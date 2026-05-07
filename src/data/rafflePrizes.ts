/**
 * Shared prize pool — keep `id` / weights in sync with `server/routes/raffle.js` when using the backend.
 *
 * Win rule: ONLY three `lucky-nine` reels = win (a unique discount code, max 9 ever awarded).
 * All other combinations — including other triples — are losses. Symbols below are cosmetic decoys.
 *
 * Images: put files in `public/slots/` and set `imageSrc` to `/slots/your-file.png`.
 * If `imageSrc` is omitted, `icon` (emoji) shows instead.
 */
export interface RafflePrize {
  /** Stable id — used for matching and API payloads */
  id: string
  /** Fallback when no image or image fails to load */
  /** Relative to site root, e.g. `/slots/cherry.png` */
  imageSrc?: string
  weight: number
}

/** Three of this id in a row = jackpot (UI + copy); still a normal prize win in the store */
export const JACKPOT_PRIZE_ID = 'lucky-nine'

export function isJackpotPrizeId(id: string): boolean {
  return id === JACKPOT_PRIZE_ID
}

export const RAFFLE_PRIZES: readonly RafflePrize[] = [
  {
    id: JACKPOT_PRIZE_ID,
    imageSrc: '/slots/nine.png',
    weight: 6,
  },
  { id: 'try-again-1', weight: 6, imageSrc: '/slots/null.png' },
  { id: 'try-again-2', weight: 6, imageSrc: '/slots/null.png' },
  { id: 'try-again-3', weight: 6, imageSrc: '/slots/null.png' },
  { id: 'try-again-4', weight: 6, imageSrc: '/slots/null.png' },
  { id: 'try-again-5', weight: 6, imageSrc: '/slots/null.png' },
  { id: 'try-again-6', weight: 6, imageSrc: '/slots/null.png' },
  { id: 'try-again-7', weight: 6, imageSrc: '/slots/null.png' },
]
