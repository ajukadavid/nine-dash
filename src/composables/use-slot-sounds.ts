/**
 * Slot machine sound effects via Web Audio API — no audio files required.
 */

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!(window as unknown as { _slotAudioCtx?: AudioContext })._slotAudioCtx) {
    try {
      ;(window as unknown as { _slotAudioCtx?: AudioContext })._slotAudioCtx =
        new AudioContext()
    } catch {
      return null
    }
  }
  return (window as unknown as { _slotAudioCtx?: AudioContext })._slotAudioCtx!
}

/** Short mechanical tick — played repeatedly while reels spin */
function playTick(ctx: AudioContext, when: number, vol = 0.18) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008))
  }
  const src = ctx.createBufferSource()
  src.buffer = buf

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1400
  filter.Q.value = 1.2

  const gain = ctx.createGain()
  gain.gain.value = vol

  src.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  src.start(when)
}

/** Dull thud when a single reel stops */
function playReelStop(ctx: AudioContext, when: number) {
  // Low thud
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(120, when)
  osc.frequency.exponentialRampToValueAtTime(55, when + 0.12)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.38, when)
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.18)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(when)
  osc.stop(when + 0.18)

  // Click transient
  const clickBuf = ctx.createBuffer(1, ctx.sampleRate * 0.015, ctx.sampleRate)
  const d = clickBuf.getChannelData(0)
  for (let i = 0; i < d.length; i++) {
    d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004))
  }
  const clickSrc = ctx.createBufferSource()
  clickSrc.buffer = clickBuf
  const clickGain = ctx.createGain()
  clickGain.gain.value = 0.25
  clickSrc.connect(clickGain)
  clickGain.connect(ctx.destination)
  clickSrc.start(when)
}

/** Ascending fanfare for jackpot win */
function playJackpot(ctx: AudioContext) {
  const now = ctx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5] // C5 E5 G5 C6 E6
  const durations = [0.12, 0.12, 0.12, 0.2, 0.45]
  let t = now + 0.05

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.value = freq

    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = freq * 2

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.22, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, t + durations[i]!)

    osc.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc.start(t)
    osc.stop(t + durations[i]!)
    osc2.start(t)
    osc2.stop(t + durations[i]!)

    t += durations[i]! * 0.85
  })

  // Coin shower shimmer after the melody
  for (let c = 0; c < 12; c++) {
    const coinT = now + 0.55 + c * 0.07 + Math.random() * 0.04
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 900 + Math.random() * 600
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.12, coinT)
    g.gain.exponentialRampToValueAtTime(0.001, coinT + 0.09)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(coinT)
    osc.stop(coinT + 0.09)
  }
}

let spinInterval: ReturnType<typeof setInterval> | null = null
let tickSpeed = 80 // ms between ticks — slows down as each reel lands

export function useSlotSounds() {
  function resumeCtx() {
    const ctx = getCtx()
    if (ctx && ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  function startSpinSound() {
    const ctx = resumeCtx()
    if (!ctx) return
    tickSpeed = 65

    spinInterval = setInterval(() => {
      playTick(ctx, ctx.currentTime, 0.15)
    }, tickSpeed)
  }

  function reelLanded(reelIndex: number) {
    const ctx = resumeCtx()
    if (!ctx) return

    // Slow ticks a bit per reel that stops
    tickSpeed = 65 + reelIndex * 18
    if (spinInterval) {
      clearInterval(spinInterval)
      spinInterval = setInterval(() => {
        playTick(ctx, ctx.currentTime, 0.13)
      }, tickSpeed)
    }

    playReelStop(ctx, ctx.currentTime)
  }

  function stopSpinSound() {
    if (spinInterval) {
      clearInterval(spinInterval)
      spinInterval = null
    }
  }

  function playWin() {
    const ctx = resumeCtx()
    if (!ctx) return
    playJackpot(ctx)
  }

  return { startSpinSound, reelLanded, stopSpinSound, playWin }
}
