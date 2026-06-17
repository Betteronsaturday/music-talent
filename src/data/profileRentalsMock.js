/**
 * Mock instrument & gear rentals proposed by musicians on their profile.
 * User posts persist in localStorage (collabs-style).
 */

import { mockImage } from '@/data/mockImages'

/** @typedef {{ id: string, instrument: string, description: string, dailyRate?: string, location: string, condition: 'excellent'|'good'|'fair', available: boolean, photoUrl?: string, ownerId: string, useCase?: string }} RentalListing */

/** @type {Record<string, RentalListing[]>} */
const BY_MUSICIAN = {
  you: [
    {
      id: 'you-r1',
      instrument: 'Nord Stage 3 (88-key)',
      description:
        'Weighted keys, great for neo-soul sessions. Includes sustain pedal and soft case. Pickup in Lecce centro.',
      dailyRate: '€35/day',
      location: 'Lecce',
      condition: 'excellent',
      available: true,
      photoUrl: mockImage('keyboard'),
      ownerId: 'you',
      useCase: 'Tour backup · last-minute session',
    },
    {
      id: 'you-r2',
      instrument: 'Shure SM7B + boom arm',
      description: 'Vocal mic setup — pop filter included. Ideal if you forgot yours on a coastal gig run.',
      dailyRate: '€18/day',
      location: 'Lecce',
      condition: 'good',
      available: true,
      photoUrl: mockImage('vocalMic'),
      ownerId: 'you',
      useCase: 'Vocal booth · podcast · scratch demos',
    },
  ],
  '1': [
    {
      id: '1-r1',
      instrument: 'Taylor 314ce (acoustic)',
      description:
        'Road-worn but reliable. Fresh strings, capo included. Perfect for writers passing through Salento.',
      dailyRate: '€22/day',
      location: 'Galatina',
      condition: 'good',
      available: true,
      photoUrl: mockImage('acousticGuitar'),
      ownerId: '1',
      useCase: 'Songwriting retreat · unplugged set',
    },
    {
      id: '1-r2',
      instrument: 'Warm Audio WA-47jr (condenser)',
      description: 'Home-studio vocal mic. Phantom power required. Soft case + XLR cable.',
      dailyRate: '€15/day',
      location: 'Galatina',
      condition: 'excellent',
      available: true,
      photoUrl: mockImage('vocalMic', 800, 600),
      ownerId: '1',
      useCase: 'Last-minute vocal session',
    },
  ],
  '2': [
    {
      id: '2-r1',
      instrument: 'Pearl Export kit (5-piece)',
      description:
        'Full kit with cymbals (ride, hi-hat, 2 crashes). Throne not included — bring your own. Rehearsal room only.',
      dailyRate: '€40/day',
      location: 'Gallipoli',
      condition: 'good',
      available: true,
      photoUrl: mockImage('drums'),
      ownerId: '2',
      useCase: 'Tour fill-in · band rehearsal',
    },
    {
      id: '2-r2',
      instrument: 'Roland SPD-SX (sampler pad)',
      description: 'Loaded with click-friendly cues. USB for custom samples. Great backup if your SPD fails on the road.',
      dailyRate: '€28/day',
      location: 'Gallipoli',
      condition: 'excellent',
      available: false,
      photoUrl: mockImage('sampler'),
      ownerId: '2',
      useCase: 'Live tracks · hybrid set',
    },
  ],
}

const LS_KEY = 'musician-proto-rentals'

export const CONDITION_LABELS = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
}

export function readUserRentals() {
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

export function writeUserRentals(list) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LS_KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent('musician-proto-rentals-updated'))
}

export function addUserRental(listing) {
  writeUserRentals([listing, ...readUserRentals()])
}

/** @param {string} musicianId */
export function getRentalsFor(musicianId) {
  const mock = BY_MUSICIAN[musicianId] ?? []
  if (typeof window === 'undefined') return mock
  const user = readUserRentals().filter((r) => r.ownerId === musicianId)
  return [...user, ...mock]
}
