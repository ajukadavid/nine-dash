<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRaffleStore } from '@/stores/raffleStore'
import { RAFFLE_PRIZES, JACKPOT_PRIZE_ID } from '@/data/rafflePrizes'
import { RAFFLE_MOCK_MODE, STORAGE_KEY, DEV_BYPASS_STORAGE_CHECK } from '@/api/raffleApi'
import type { RafflePrize } from '@/data/rafflePrizes'
import { useSlotSounds } from '@/composables/use-slot-sounds'

const raffleStore = useRaffleStore()

/** Synced from measured `.mech-reel-item` height (ResizeObserver) — matches fluid `--reel-item-h` */
const itemHeightPx = ref(88)


const imgLoadFailed = reactive<Record<string, boolean>>({})
function onImgError(prizeId: string) {
  imgLoadFailed[prizeId] = true
}

const reelStrip = computed(() => [...RAFFLE_PRIZES, ...RAFFLE_PRIZES, ...RAFFLE_PRIZES, ...RAFFLE_PRIZES])

const trackRefs = ref<(HTMLElement | null)[]>([])

function setTrackRef(el: Element | null, i: number) {
  if (el instanceof HTMLElement) trackRefs.value[i] = el
}

const isSpinning = ref(false)
const isWinner = ref(false)
const hasAlreadyWon = ref(false)
const resultMessage = ref('')
const wonCode = ref('')
const resultType = ref<'win' | 'lose' | 'claimed' | 'already-won' | 'error' | 'neutral'>('neutral')

const remainingSpins = computed(() => raffleStore.remainingSpins)

function animateReel(
  trackEl: HTMLElement,
  targetPrizeIndex: number,
  durationMs: number,
  reelIndex: number,
): Promise<void> {
  return new Promise((resolve) => {
    /* Land the winning strip cell on the *middle* row of the 3-row window (not the top row). */
    const landIndex = RAFFLE_PRIZES.length * 2 + targetPrizeIndex
    const landOffset = (landIndex - 1) * itemHeightPx.value

    trackEl.style.transition = 'none'
    trackEl.style.transform = 'translateY(0)'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        trackEl.style.transition = `transform ${durationMs}ms cubic-bezier(0.15, 0.85, 0.25, 1.0)`
        trackEl.style.transform = `translateY(-${landOffset}px)`
        setTimeout(() => {
          reelLanded(reelIndex)
          resolve()
        }, durationMs + 80)
      })
    })
  })
}

async function handleSpin() {
  if (isSpinning.value || remainingSpins.value === 0 || hasAlreadyWon.value) return

  isSpinning.value = true
  isWinner.value = false
  wonCode.value = ''
  resultMessage.value = ''

  try {
    const spinResult = await raffleStore.performSpin()

    if (spinResult.alreadyWon) {
      hasAlreadyWon.value = true
      resultType.value = 'already-won'
      resultMessage.value = "You've already claimed a prize in this promotion."
      return
    }

    const reelResults = spinResult.prizes as RafflePrize[]
    const prizeIndices = reelResults.map((p) => RAFFLE_PRIZES.findIndex((x) => x.id === p.id))

    startSpinSound()

    const animations = prizeIndices.map((idx, i) => {
      const duration = 1600 + i * 300
      const el = trackRefs.value[i]
      if (!el || idx < 0) return Promise.resolve()
      return animateReel(el, idx, duration, i)
    })

    await Promise.all(animations)
    stopSpinSound()

    const isLuckyNineTriple = reelResults.every((p) => p.id === JACKPOT_PRIZE_ID)

    if (isLuckyNineTriple && spinResult.allPrizesClaimed) {
      resultType.value = 'claimed'
      resultMessage.value = 'All 9 prizes have been claimed. Better luck next time!'
    } else if (isLuckyNineTriple && spinResult.discountCode) {
      isWinner.value = true
      hasAlreadyWon.value = true
      resultType.value = 'win'
      wonCode.value = spinResult.discountCode
      resultMessage.value = 'JACKPOT! Your discount code:'
      if (RAFFLE_MOCK_MODE) raffleStore.recordWin(reelResults[0]!)
      playWin()
    } else {
      resultType.value = 'lose'
      resultMessage.value = 'No match this time — try again!'
    }
  } catch (err) {
    stopSpinSound()
    resultType.value = 'error'
    resultMessage.value = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
    console.error('[SlotMachine] Spin error:', err)
  } finally {
    isSpinning.value = false
  }
}

const { startSpinSound, reelLanded, stopSpinSound, playWin } = useSlotSounds()

const compositeWrapRef = ref<HTMLElement | null>(null)
let itemHeightObserver: ResizeObserver | null = null

function syncReelItemHeight() {
  const root = compositeWrapRef.value
  if (!root) return
  const cell = root.querySelector('.mech-reel-item')
  if (cell instanceof HTMLElement) {
    const h = cell.getBoundingClientRect().height
    if (h > 0) itemHeightPx.value = Math.round(h * 100) / 100
  }
}

onMounted(() => {
  if (!DEV_BYPASS_STORAGE_CHECK && localStorage.getItem(STORAGE_KEY)) {
    hasAlreadyWon.value = true
    resultType.value = 'already-won'
    resultMessage.value = "You've already claimed a prize in this promotion."
  }
  raffleStore.fetchUserSpins().catch(() => {})
  requestAnimationFrame(() => {
    syncReelItemHeight()
    if (compositeWrapRef.value) {
      itemHeightObserver = new ResizeObserver(() => syncReelItemHeight())
      itemHeightObserver.observe(compositeWrapRef.value)
    }
  })
  window.addEventListener('orientationchange', syncReelItemHeight)
})

onUnmounted(() => {
  itemHeightObserver?.disconnect()
  itemHeightObserver = null
  window.removeEventListener('orientationchange', syncReelItemHeight)
})
</script>

<template>
  <div class="photo-slot-root w-full max-w-[min(100%,520px)]">
    <!--
      Composite: AI cabinet PNG + HTML reels. Tune overlay in scoped CSS (--reel-*, --spin-*, --lever-*).
      Asset: public/slots/cabinet.png
    -->
    <div
      ref="compositeWrapRef"
      class="composite-wrap relative mx-auto w-full max-w-full select-none"
      :class="{ 'cabinet-win-shake': isWinner }"
    >
      <img
        src="/slots/cabinet.png"
        alt=""
        class="pointer-events-none block h-auto w-full"
        width="1024"
        height="1280"
        draggable="false"
      />

      <!-- Functional reels (sit over the dark window in the artwork; 3 rows, payline through middle) -->
      <div class="reel-overlay">
        <div class="reel-overlay-inner">
          <div v-for="i in [0, 1, 2]" :key="i" class="reel-slot">
            <div class="reel-mask reel-mask-three">
              <div
                class="reel-track"
                :ref="(el) => setTrackRef(el as Element | null, i)"
              >
                <div
                  v-for="(prize, j) in reelStrip"
                  :key="`${prize.id}-${j}`"
                  class="mech-reel-item"
                >
                  <div class="reel-symbol">
                    <img
                      v-if="prize.imageSrc && !imgLoadFailed[prize.id]"
                      :src="prize.imageSrc"
                      class="max-h-full max-w-full object-contain"
                      loading="lazy"
                      @error="onImgError(prize.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="win-line" />
      </div>

      <!-- Invisible hit targets over the painted SPIN + lever -->
      <button
        type="button"
        class="hit-spin"
        :disabled="isSpinning || remainingSpins === 0 || hasAlreadyWon"
        :title="hasAlreadyWon ? 'You have already claimed a prize.' : `Spins: ${remainingSpins}. Tap here or the side lever to spin.`"
        aria-label="Spin the reels"
        aria-describedby="slot-spin-hint"
        @click.prevent.stop="handleSpin"
      />
      <button
        type="button"
        class="hit-lever"
        :class="{ 'hit-lever-pulled': isSpinning }"
        :disabled="isSpinning || remainingSpins === 0 || hasAlreadyWon"
        aria-label="Pull lever to spin"
        aria-describedby="slot-spin-hint"
        @click.prevent.stop="handleSpin"
      />
    </div>

    <p id="slot-spin-hint" class="spin-hint">
      <span class="hint-try">Try your luck</span> —
      <span class="spin-hint-kicker hint-spin">SPIN</span>
      <span class="hint-body"> to win, or press </span>
      <a
        href="https://turndasix.company.site/"
        class="spin-hint-kicker start-cta"
        style="text-decoration: none; cursor: pointer;"
      >START</a>

      <span class="hint-body"> to go straight to the store.</span>
    </p>

    <transition name="result-fade">
      <div v-if="resultMessage" class="mt-3 text-center">
        <p
          class="text-xs sm:text-sm"
          :class="
            resultType === 'win'
              ? 'font-bold tracking-wide text-amber-300 drop-shadow-[0_0_14px_rgba(251,191,36,0.45)]'
              : resultType === 'lose'
                ? 'text-rose-400'
                : resultType === 'already-won'
                  ? 'text-sky-400'
                  : resultType === 'error'
                    ? 'text-red-500'
                    : 'text-zinc-400'
          "
        >
          {{ resultMessage }}
        </p>
        <p
          v-if="wonCode"
          class="mt-1 font-mono text-sm font-bold tracking-widest text-amber-200 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] sm:text-base"
        >
          {{ wonCode }}
        </p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.photo-slot-root {
  font-family: 'joystix', monospace;
}

/* ─── Overlay alignment (percent of composite box = image box). Edit these to fit your PNG. ─── */
.composite-wrap {
  /* Fluid row height — vw fallback; cqw when container queries supported */
  --reel-item-h: clamp(52px, 18vw, 88px);
  /* Top/bottom row dimming only — middle row has no overlay (natural brightness) */
  --reel-edge-dim: 0.96;
  /* Nudge payline toward icon centers (labels sit below icons) */
  --payline-nudge: -6px;
  /* Tighter box inside the black glass — width + top tune to bezel; height = 3× row (see .reel-overlay) */
  --reel-t: 20.5%;
  --reel-l: 18%;
  /* Negative = shift reel window left (px) */
  --reel-l-nudge: -5px;
  --reel-w: 62%;
  /* Vertical center of painted SPIN (used with translate -50% -50% on .hit-spin) */
  --spin-t: 57%;
  --spin-l: 50%;
  --spin-size: 17%;
  --lever-t: 26%;
  --lever-r: 3%;
  --lever-w: 13%;
  --lever-h: 30%;
  /* box-shadow on this wrapper — not filter on parent — keeps SPIN/lever hit targets clickable */
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.55);
}

@supports (container-type: inline-size) {
  .composite-wrap {
    container-type: inline-size;
    --reel-item-h: clamp(52px, 17.5cqw, 88px);
  }
}

/* Narrow screens: reel window reads “right-heavy” vs bezel; nudge % + SPIN (tuned vs iPhone) */
@media (max-width: 480px) {
  .composite-wrap {
    --reel-l: 15.5%;
    --reel-l-nudge: 0px;
    --reel-w: 62.5%;
    --spin-t: 56.5%;
    --spin-l: 49.5%;
    --lever-t: 25.8%;
    --lever-r: 3.2%;
  }
}

.reel-overlay {
  position: absolute;
  top: var(--reel-t);
  left: calc(var(--reel-l) + var(--reel-l-nudge));
  width: var(--reel-w);
  /* Exact pixel height = 3 rows; keeps payline at 50% aligned with spin result */
  height: calc(3 * var(--reel-item-h));
  overflow: hidden;
  border-radius: 4px;
  pointer-events: none;
}

.reel-overlay-inner {
  display: grid;
  height: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 3%;
  align-items: stretch;
  padding: 0 1%;
  box-sizing: border-box;
}

.reel-slot {
  position: relative;
  min-width: 0;
  border-radius: 2px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(8, 8, 10, 0.55) 0%, rgba(2, 2, 4, 0.75) 100%);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.75);
}

.reel-mask {
  position: relative;
  overflow: hidden;
}

/* Darken only top & bottom bands; middle stays untouched (no screen/highlight lift) */
.reel-mask::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, var(--reel-edge-dim)) 0%,
    rgba(0, 0, 0, calc(var(--reel-edge-dim) * 0.92)) 10%,
    rgba(0, 0, 0, calc(var(--reel-edge-dim) * 0.72)) 22%,
    rgba(0, 0, 0, 0) 35%,
    rgba(0, 0, 0, 0) 65%,
    rgba(0, 0, 0, calc(var(--reel-edge-dim) * 0.72)) 78%,
    rgba(0, 0, 0, calc(var(--reel-edge-dim) * 0.92)) 90%,
    rgba(0, 0, 0, var(--reel-edge-dim)) 100%
  );
}

/* Exactly three symbol rows; middle row = payline target */
.reel-mask-three {
  height: 100%;
}

.reel-track {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  will-change: transform;
}

/*
 * Fixed icon band + fixed label band so symbols line up across columns (labels vary in lines).
 * Without this, 1-line vs 2-line labels shift the icon vertically within the cell.
 */
.mech-reel-item {
  box-sizing: border-box;
  display: flex;
  height: var(--reel-item-h);
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1px 2px 2px;
  gap: 0;
}

.reel-symbol {
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: calc(var(--reel-item-h) * 0.58);
  align-items: center;
  justify-content: center;
}

.reel-symbol img {
  max-height: min(40px, calc(var(--reel-item-h) * 0.5));
  max-width: min(44px, calc(var(--reel-item-h) * 0.55));
  object-fit: contain;
}

.reel-symbol span {
  max-height: min(40px, calc(var(--reel-item-h) * 0.5));
  max-width: min(44px, calc(var(--reel-item-h) * 0.55));
  font-size: clamp(0.85rem, calc(var(--reel-item-h) * 0.36), 1.5rem);
  line-height: 1;
}

.reel-label {
  box-sizing: border-box;
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  min-height: calc(var(--reel-item-h) * 0.34);
  max-height: calc(var(--reel-item-h) * 0.34);
  padding: 0 1px;
  text-align: center;
  font-size: 5px;
  font-weight: 700;
  line-height: 1.08;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #e8e8e6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  word-break: break-word;
}
@media (min-width: 480px) {
  .reel-label {
    font-size: 6px;
  }
}

.win-line {
  pointer-events: none;
  position: absolute;
  z-index: 5;
  left: 4%;
  right: 4%;
  top: calc(50% + var(--payline-nudge));
  height: 2px;
  transform: translateY(-50%);
  border-radius: 99px;
  background: linear-gradient(90deg, transparent, rgba(220, 50, 50, 0.85), transparent);
  box-shadow: 0 0 8px rgba(255, 60, 60, 0.5);
  opacity: 0.85;
}

/* Click targets — SPIN gets a soft pulse ring so it’s obvious it’s interactive */
.hit-spin {
  position: absolute;
  z-index: 20;
  top: var(--spin-t);
  left: var(--spin-l);
  width: var(--spin-size);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border: none;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  background: transparent;
  outline: none;
  pointer-events: auto;
}
.hit-spin:focus-visible {
  outline: 2px solid rgba(250, 204, 21, 0.85);
  outline-offset: 3px;
}
.hit-spin::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 2px solid rgba(255, 235, 200, 0.55);
  box-shadow:
    0 0 10px rgba(255, 90, 60, 0.45),
    inset 0 0 12px rgba(255, 255, 255, 0.12);
  pointer-events: none;
  animation: spin-affordance-pulse 2.2s ease-in-out infinite;
}
.hit-spin:disabled::after {
  animation: none;
  opacity: 0.35;
  box-shadow: none;
  border-color: rgba(255, 255, 255, 0.15);
}
.hit-spin:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@keyframes spin-affordance-pulse {
  0%,
  100% {
    opacity: 0.65;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hit-spin::after {
    animation: none;
    opacity: 0.85;
  }
}

.spin-hint {
  margin-top: 0.65rem;
  padding: 0 0.5rem;
  text-align: center;
  font-size: 0.7rem;
  line-height: 1.35;
  color: #a1a1aa;
}
@media (max-width: 480px) {
  .spin-hint {
    margin-top: 0.35rem;
    font-size: 0.68rem;
  }
}
@media (min-width: 480px) {
  .spin-hint {
    font-size: 0.75rem;
  }
}
.hint-try {
  color: #a78bfa;
}
.hint-body {
  color: #94a3b8;
}
.spin-hint-kicker {
  font-weight: 600;
  color: #d4d4d8;
}
.hint-spin {
  color: #34d399;
}
.spin-hint-kicker.start-cta {
  color: #ef4444;
  font-size: 1rem;
  display: inline-block;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.spin-hint-kicker.start-cta:hover {
  transform: scale(1.15);
}

.hit-lever {
  position: absolute;
  z-index: 20;
  top: var(--lever-t);
  right: var(--lever-r);
  width: var(--lever-w);
  height: var(--lever-h);
  border: none;
  border-radius: 40%;
  padding: 0;
  cursor: pointer;
  background: transparent;
  outline: none;
  pointer-events: auto;
  transform-origin: 70% 80%;
  transition: transform 0.28s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.hit-lever:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
.hit-lever-pulled {
  transform: rotate(18deg);
}

.cabinet-win-shake {
  animation: bandit-shake 0.55s ease;
}

@keyframes bandit-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-3px) rotate(-0.3deg);
  }
  40% {
    transform: translateX(3px) rotate(0.3deg);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
}

.result-fade-enter-active {
  transition: opacity 0.3s ease;
}
.result-fade-leave-active {
  transition: opacity 0.15s ease;
}
.result-fade-enter-from,
.result-fade-leave-to {
  opacity: 0;
}
</style>
