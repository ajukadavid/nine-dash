import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { raffleApi, RAFFLE_MOCK_MODE, INFINITE_MOCK_SPINS } from '@/api/raffleApi'
import type { RafflePrize } from '@/data/rafflePrizes'

export interface WinHistoryItem extends RafflePrize {
  time: string
}

/** Avoid disabled spin before first fetch resolves (infinite mock matches post-fetch count). */
function initialRemainingSpins(): number {
  if (RAFFLE_MOCK_MODE && INFINITE_MOCK_SPINS) return 999_999
  return 0
}

export const useRaffleStore = defineStore('raffle', () => {
  const remainingSpins = ref(initialRemainingSpins())
  const totalSpinsUsed = ref(0)
  const winHistory = ref<WinHistoryItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasSpins = computed(() => remainingSpins.value > 0)
  const totalWins = computed(() => winHistory.value.length)

  async function fetchUserSpins() {
    isLoading.value = true
    error.value = null
    try {
      const data = await raffleApi.getUserSpins()
      remainingSpins.value = data.remainingSpins
      totalSpinsUsed.value = data.totalSpinsUsed
      winHistory.value = normalizeHistory(data.winHistory)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      error.value = msg
      console.error('[raffleStore] fetchUserSpins error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function performSpin() {
    if (remainingSpins.value === 0) {
      throw new Error('No spins remaining.')
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await raffleApi.spin()

      if (typeof result.remainingSpins === 'number') {
        remainingSpins.value = result.remainingSpins
      } else {
        remainingSpins.value = Math.max(0, remainingSpins.value - 1)
      }
      if (typeof result.totalSpinsUsed === 'number') {
        totalSpinsUsed.value = result.totalSpinsUsed
      } else {
        totalSpinsUsed.value += 1
      }

      if (!RAFFLE_MOCK_MODE) {
        await fetchUserSpins()
      }

      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      error.value = msg
      console.error('[raffleStore] performSpin error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function recordWin(prize: RafflePrize) {
    const now = new Date()
    winHistory.value.unshift({
      ...prize,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  }

  function reset() {
    remainingSpins.value = 0
    totalSpinsUsed.value = 0
    winHistory.value = []
    error.value = null
  }

  return {
    remainingSpins,
    totalSpinsUsed,
    winHistory,
    isLoading,
    error,
    hasSpins,
    totalWins,
    fetchUserSpins,
    performSpin,
    recordWin,
    reset,
  }
})

function normalizeHistory(raw: unknown): WinHistoryItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map((entry) => {
    const e = entry as Record<string, unknown>
    return {
      id: String(e.id ?? ''),
      icon: String(e.icon ?? ''),
      label: String(e.label ?? ''),
      weight: typeof e.weight === 'number' ? e.weight : 0,
      time:
        typeof e.time === 'string'
          ? e.time
          : typeof e.wonAt === 'string'
            ? new Date(e.wonAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
    }
  })
}
