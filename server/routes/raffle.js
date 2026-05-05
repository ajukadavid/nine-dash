/**
 * Express route — mount with: app.use('/api/raffle', require('./routes/raffle'))
 * Install: npm install express jsonwebtoken (optional, for JWT verify)
 */

const express = require('express')
const router = express.Router()

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' })
  }

  req.user = { id: 'user_demo_001' }
  next()
}

const PRIZES = [
  { id: 'lucky-nine', icon: '9', label: 'Lucky 9', weight: 6 },
  { id: 'free-ship', icon: '📦', label: 'Free Shipping', weight: 30 },
  { id: 'off-10', icon: '🏷️', label: '10% Off', weight: 25 },
  { id: 'off-20', icon: '✂️', label: '20% Off', weight: 18 },
  { id: 'off-30', icon: '🔥', label: '30% Off', weight: 10 },
  { id: 'gift-card', icon: '🎁', label: '₦5k Gift Card', weight: 7 },
  { id: 'vip-access', icon: '👑', label: 'VIP Access', weight: 5 },
  { id: 'try-again', icon: '🎀', label: 'Try Again', weight: 5 },
]

/** Single discount code with a fixed number of uses. Keep in sync with `src/api/raffleApi.ts`. */
const DISCOUNT_CODE = 'L23CKY9'
const DISCOUNT_CODE_MAX_USES = 9

/** Times the code has been awarded this server session. */
let claimedCodeCount = 0

/** IPs that have already claimed a win. Persists for the server process lifetime. */
const winnerIPs = new Set()

const DEV_INFINITE_SPINS = false
const MAX_SPINS_PER_USER = DEV_INFINITE_SPINS ? 999999 : 5
/** Match `JACKPOT_CHANCE` in `src/api/raffleApi.ts` — only Lucky 9 triple wins. */
const JACKPOT_CHANCE = 0.08

/**
 * Set `true` while developing/testing to skip the IP-based already-won check.
 * Flip back to `false` before going live.
 */
const DEV_BYPASS_IP_CHECK = false

const JACKPOT_PRIZE_ID = 'lucky-nine'

const userSpinData = new Map()

function getUserData(userId) {
  if (!userSpinData.has(userId)) {
    userSpinData.set(userId, {
      remainingSpins: MAX_SPINS_PER_USER,
      totalSpinsUsed: 0,
      winHistory: [],
    })
  }
  return userSpinData.get(userId)
}

function weightedRandom(pool) {
  const total = pool.reduce((sum, p) => sum + p.weight, 0)
  let rand = Math.random() * total
  for (const p of pool) {
    rand -= p.weight
    if (rand <= 0) return p
  }
  return pool[0]
}

/** Returns a guaranteed non-winning reel set (used when the player has already won). */
function pickLoseOutcome() {
  return [PRIZES[1], PRIZES[2], PRIZES[3]]
}

/**
 * Jackpot (JACKPOT_CHANCE): always Lucky 9 triple — the only winning combination.
 * Non-jackpot: guaranteed mismatch — reels 2 & 3 differ from reel 1.
 */
function pickOutcome() {
  const luckyNine = PRIZES.find((p) => p.id === JACKPOT_PRIZE_ID)
  if (Math.random() < JACKPOT_CHANCE) return [luckyNine, luckyNine, luckyNine]

  const first = weightedRandom(PRIZES)
  let second
  let third
  do {
    second = weightedRandom(PRIZES)
  } while (second.id === first.id)
  do {
    third = weightedRandom(PRIZES)
  } while (third.id === first.id)
  return [first, second, third]
}

router.get('/user-spins', requireAuth, (req, res) => {
  const data = getUserData(req.user.id)
  res.json({
    remainingSpins: data.remainingSpins,
    totalSpinsUsed: data.totalSpinsUsed,
    winHistory: data.winHistory,
  })
})

router.post('/spin', requireAuth, (req, res) => {
  const data = getUserData(req.user.id)

  if (data.remainingSpins <= 0) {
    return res.status(403).json({ message: 'No spins remaining.' })
  }

  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress

  if (!DEV_BYPASS_IP_CHECK && winnerIPs.has(clientIP)) {
    return res.json({
      prizes: pickLoseOutcome(),
      remainingSpins: data.remainingSpins,
      totalSpinsUsed: data.totalSpinsUsed,
      isWin: false,
      alreadyWon: true,
    })
  }

  if (!DEV_INFINITE_SPINS) {
    data.remainingSpins -= 1
  }
  data.totalSpinsUsed += 1

  const prizes = pickOutcome()
  const isLuckyNineTriple = prizes.every((p) => p.id === JACKPOT_PRIZE_ID)

  let discountCode
  let allPrizesClaimed = false

  if (isLuckyNineTriple) {
    if (claimedCodeCount < DISCOUNT_CODE_MAX_USES) {
      discountCode = DISCOUNT_CODE
      claimedCodeCount++
      if (!DEV_BYPASS_IP_CHECK) winnerIPs.add(clientIP)
      data.winHistory.unshift({
        ...prizes[0],
        discountCode,
        wonAt: new Date().toISOString(),
      })
    } else {
      allPrizesClaimed = true
    }
  }

  res.json({
    prizes,
    remainingSpins: data.remainingSpins,
    totalSpinsUsed: data.totalSpinsUsed,
    isWin: isLuckyNineTriple && !allPrizesClaimed,
    discountCode,
    allPrizesClaimed,
  })
})

router.post('/claim/:prizeId', requireAuth, (req, res) => {
  const data = getUserData(req.user.id)
  const win = data.winHistory.find((w) => w.id === req.params.prizeId && !w.claimed)

  if (!win) {
    return res.status(404).json({ message: 'Prize not found or already claimed.' })
  }

  win.claimed = true
  win.claimedAt = new Date().toISOString()

  res.json({ success: true, prize: win })
})

module.exports = router
