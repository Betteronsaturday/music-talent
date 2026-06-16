/** @typedef {{ id: string, title: string, body: string, city: string, region: string, postedById: string, postedByName: string, needed: string[], compensation?: 'paid'|'split'|'unpaid', createdAt: string }} CollabPost */

/** @type {CollabPost[]} */
export const MOCK_COLLABS = [
  {
    id: 'c1',
    title: 'Live drummer for 5-song EP',
    body: 'Indie rock — rehearsals Sat AM, tracking next month. Backline provided.',
    city: 'Los Angeles',
    region: 'North America',
    postedById: '3',
    postedByName: 'Elena Ruiz',
    needed: ['Drums'],
    compensation: 'paid',
    createdAt: '2025-11-02',
  },
  {
    id: 'c2',
    title: 'Co-writer for neo-soul hooks',
    body: 'Looking for topline + harmony ideas. Remote ok; share stems in Drive.',
    city: 'Berlin',
    region: 'Europe',
    postedById: '1',
    postedByName: 'Maya Chen',
    needed: ['Vocals', 'Songwriting'],
    compensation: 'split',
    createdAt: '2025-11-08',
  },
  {
    id: 'c3',
    title: 'Brass section for one session',
    body: 'Funk track — charts ready. 3-hour block downtown studio.',
    city: 'Melbourne',
    region: 'Australasia',
    postedById: '5',
    postedByName: 'Theo Park',
    needed: ['Saxophone', 'Trumpet'],
    compensation: 'paid',
    createdAt: '2025-11-12',
  },
]

const LS_KEY = 'musician-proto-collabs'

export function readUserCollabs() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeUserCollabs(list) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LS_KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent('musician-proto-collabs-updated'))
}

export function addUserCollab(post) {
  const next = [post, ...readUserCollabs()]
  writeUserCollabs(next)
}

export const COMPENSATION_LABELS = {
  paid: 'Paid',
  split: 'Rev split',
  unpaid: 'Unpaid / portfolio',
}
