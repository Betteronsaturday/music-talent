const LIKES_KEY = 'musician-proto-portfolio-likes'
const PITCHES_KEY = 'musician-proto-portfolio-pitches'

function readJson(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('musician-proto-portfolio-engagement'))
}

/** @returns {Record<string, true>} keys `${musicianId}:${itemId}` */
export function readLikes() {
  const v = readJson(LIKES_KEY, {})
  return v && typeof v === 'object' ? v : {}
}

export function isLiked(musicianId, itemId) {
  return Boolean(readLikes()[`${musicianId}:${itemId}`])
}

export function setLiked(musicianId, itemId, liked) {
  const next = { ...readLikes() }
  const k = `${musicianId}:${itemId}`
  if (liked) next[k] = true
  else delete next[k]
  writeJson(LIKES_KEY, next)
}

export function toggleLike(musicianId, itemId) {
  const liked = !isLiked(musicianId, itemId)
  setLiked(musicianId, itemId, liked)
  return liked
}

/** @returns {{ id: string, musicianId: string, itemId: string, section: string, body: string, createdAt: string }[]} */
export function readPitches() {
  const v = readJson(PITCHES_KEY, [])
  return Array.isArray(v) ? v : []
}

export function appendPitch({ musicianId, itemId, section, body }) {
  const row = {
    id: `pitch-${Date.now()}`,
    musicianId,
    itemId,
    section,
    body: String(body ?? '').trim().slice(0, 500),
    createdAt: new Date().toISOString(),
  }
  writeJson(PITCHES_KEY, [row, ...readPitches()])
  return row
}
