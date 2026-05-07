/**
 * Raffle API — mock or real backend (`server/routes/raffle.js`).
 */
import { RAFFLE_PRIZES, JACKPOT_PRIZE_ID, type RafflePrize } from '@/data/rafflePrizes'

export const RAFFLE_MOCK_MODE = true

/** `true` = never run out of spins in mock (shows a large spin count). */
export const INFINITE_MOCK_SPINS = true

const MOCK_SPINS_DISPLAY = 999_999

export const RAFFLE_API_BASE = '/api/raffle'

/**
 * Chance of landing triple Lucky 9 (the ONLY winning combination).
 * Raise toward `1` for more frequent wins (e.g. `0.25` = 25% of spins).
 * Keep in sync with `JACKPOT_CHANCE` in `server/routes/raffle.js` when using the backend.
 */
export const JACKPOT_CHANCE = 0.08

/** Single discount code with a fixed number of uses. Keep in sync with `server/routes/raffle.js`. */
export const DISCOUNT_CODE = 'L23CKY9'
export const DISCOUNT_CODE_MAX_USES = 9

/** localStorage key used to remember that this browser already won. */
export const STORAGE_KEY = 'nine_raffle_won'

/**
 * Set `true` while developing/testing to skip the localStorage already-won check in mock mode.
 * Flip back to `false` before going live.
 */
export const DEV_BYPASS_STORAGE_CHECK = true

export interface SpinResult {
  prizes: RafflePrize[]
  remainingSpins?: number
  totalSpinsUsed?: number
  isWin?: boolean
  /** Discount code awarded on a Lucky 9 jackpot win. */
  discountCode?: string
  /** `true` when triple Lucky 9 fires but all 9 uses are exhausted. */
  allPrizesClaimed?: boolean
  /** `true` when this browser/IP has already won and cannot win again. */
  alreadyWon?: boolean
}

export interface UserSpinsPayload {
  remainingSpins: number
  totalSpinsUsed: number
  winHistory: unknown[]
}

function weightedRandom(pool: readonly RafflePrize[]): RafflePrize {
  const total = pool.reduce((s, p) => s + p.weight, 0)
  let rand = Math.random() * total
  for (const p of pool) {
    rand -= p.weight
    if (rand <= 0) return p
  }
  return pool[0]!
}

/**
 * Mirrors server `pickOutcome`.
 * Jackpot (JACKPOT_CHANCE): always Lucky 9 triple — the only winning combo.
 * Non-jackpot (1 - JACKPOT_CHANCE): guaranteed mismatch — reels 2 & 3 differ from reel 1.
 */
function pickOutcome(): RafflePrize[] {
  const luckyNine = RAFFLE_PRIZES.find((p) => p.id === JACKPOT_PRIZE_ID)!
  if (Math.random() < JACKPOT_CHANCE) return [luckyNine, luckyNine, luckyNine]

  // All three reels spin independently. Re-roll only if we accidentally hit a
  // triple jackpot on the non-jackpot path (probability ≈ 0.2%, negligible).
  let prizes: RafflePrize[]
  do {
    prizes = [
      weightedRandom(RAFFLE_PRIZES),
      weightedRandom(RAFFLE_PRIZES),
      weightedRandom(RAFFLE_PRIZES),
    ]
  } while (prizes.every((p) => p.id === JACKPOT_PRIZE_ID))
  return prizes
}

/** Returns a guaranteed non-winning reel set (used when the player has already won). */
function pickLoseOutcome(): RafflePrize[] {
  return [RAFFLE_PRIZES[1]!, RAFFLE_PRIZES[2]!, RAFFLE_PRIZES[3]!]
}

const mock = {
  _remainingSpins: 5,
  _totalUsed: 0,
  _wins: [] as unknown[],
  /** Number of times the discount code has been awarded; capped at DISCOUNT_CODE_MAX_USES. */
  _claimedCount: 0,

  async getUserSpins(): Promise<UserSpinsPayload> {
    await delay(400)
    return {
      remainingSpins: INFINITE_MOCK_SPINS ? MOCK_SPINS_DISPLAY : this._remainingSpins,
      totalSpinsUsed: this._totalUsed,
      winHistory: this._wins,
    }
  },

  async spin(): Promise<SpinResult> {
    await delay(300)

    if (!DEV_BYPASS_STORAGE_CHECK && localStorage.getItem(STORAGE_KEY)) {
      return { prizes: pickLoseOutcome(), alreadyWon: true }
    }

    if (!INFINITE_MOCK_SPINS) {
      if (this._remainingSpins <= 0) throw new Error('No spins remaining.')
      this._remainingSpins--
    }
    this._totalUsed++

    const prizes = pickOutcome()
    const isLuckyNineTriple = prizes.every((p) => p.id === JACKPOT_PRIZE_ID)

    let discountCode: string | undefined
    let allPrizesClaimed: boolean | undefined

    if (isLuckyNineTriple) {
      if (this._claimedCount < DISCOUNT_CODE_MAX_USES) {
        discountCode = DISCOUNT_CODE
        this._claimedCount++
        if (!DEV_BYPASS_STORAGE_CHECK) localStorage.setItem(STORAGE_KEY, '1')
      } else {
        allPrizesClaimed = true
      }
    }

    return {
      prizes,
      remainingSpins: INFINITE_MOCK_SPINS ? MOCK_SPINS_DISPLAY : this._remainingSpins,
      totalSpinsUsed: this._totalUsed,
      isWin: isLuckyNineTriple && !allPrizesClaimed,
      discountCode,
      allPrizesClaimed,
    }
  },
}

const real = {
  async getUserSpins(): Promise<UserSpinsPayload> {
    return apiFetch<UserSpinsPayload>(`${RAFFLE_API_BASE}/user-spins`)
  },

  async spin(): Promise<SpinResult> {
    return apiFetch<SpinResult>(`${RAFFLE_API_BASE}/spin`, { method: 'POST' })
  },
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token')

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(body.message || `Request failed: ${res.status}`)
  }

  return res.json() as Promise<T>
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const raffleApi = RAFFLE_MOCK_MODE ? mock : real
