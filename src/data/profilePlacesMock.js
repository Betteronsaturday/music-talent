/**
 * Mock places to play or rent — studios, venues, rehearsal rooms with photo albums.
 */

/** @typedef {{ id: string, url: string, caption?: string }} PlacePhoto */

/** @typedef {{ id: string, name: string, type: 'venue'|'rehearsal'|'home_studio'|'outdoor', purpose: 'work'|'fun'|'both', city: string, description: string, hourlyRate?: string, capacity?: number, amenities?: string[], photos: PlacePhoto[], ownerId: string }} PlaceListing */

const U = 'https://images.unsplash.com'

/** @type {Record<string, PlaceListing[]>} */
const BY_MUSICIAN = {
  you: [
    {
      id: 'you-p1',
      name: 'North Echo Studio (shared desk)',
      type: 'home_studio',
      purpose: 'work',
      city: 'Lecce',
      description:
        'Quiet street, treated vocal booth + live room. I rent the desk when I travel — ideal for overdubs and writing camps.',
      hourlyRate: '€20/hr',
      capacity: 4,
      amenities: ['Vocal booth', 'UA Apollo', 'Midi controllers', 'Coffee'],
      photos: [
        {
          id: 'you-p1-a',
          url: `${U}/photo-1598487032696-e8a752d08a18?w=900&h=650&fit=crop`,
          caption: 'Control room — Apollo + monitors',
        },
        {
          id: 'you-p1-b',
          url: `${U}/photo-1511379936296-1b3dc1e1fad1?w=900&h=650&fit=crop`,
          caption: 'Vocal booth',
        },
        {
          id: 'you-p1-c',
          url: `${U}/photo-1516280440614-37939bbacd81?w=900&h=650&fit=crop`,
          caption: 'Live room corner',
        },
      ],
      ownerId: 'you',
    },
  ],
  '1': [
    {
      id: '1-p1',
      name: 'Cortile writing room',
      type: 'home_studio',
      purpose: 'both',
      city: 'Galatina',
      description:
        'Stone courtyard with acoustic guitar-friendly acoustics. Daytime natural light — great for hooks and harmonies.',
      hourlyRate: '€12/hr',
      capacity: 3,
      amenities: ['Courtyard seating', 'Power outlets', 'Quiet after 22:00'],
      photos: [
        {
          id: '1-p1-a',
          url: `${U}/photo-1516280440614-37939bbacd81?w=900&h=650&fit=crop`,
          caption: 'Courtyard setup',
        },
        {
          id: '1-p1-b',
          url: `${U}/photo-1493225457124-a3eb161ffa5f?w=900&h=650&fit=crop`,
          caption: 'Evening session light',
        },
      ],
      ownerId: '1',
    },
    {
      id: '1-p2',
      name: 'Palazzo rooftop (acoustic sets)',
      type: 'outdoor',
      purpose: 'fun',
      city: 'Galatina',
      description:
        'Small rooftop for acoustic duo/trio — sunset slots only. Neighbours are cool until 23:00. BYO PA or battery amp.',
      capacity: 30,
      amenities: ['Sunset view', 'Power hookup', 'No drum kit'],
      photos: [
        {
          id: '1-p2-a',
          url: `${U}/photo-1514525253161-7a46d19cd819?w=900&h=650&fit=crop`,
          caption: 'Rooftop view at golden hour',
        },
        {
          id: '1-p2-b',
          url: `${U}/photo-1470225620780-dba8ba36b745?w=900&h=650&fit=crop`,
          caption: 'Acoustic set layout',
        },
        {
          id: '1-p2-c',
          url: `${U}/photo-1459749411176-04c624e0bc2d?w=900&h=650&fit=crop`,
          caption: 'Audience area',
        },
      ],
      ownerId: '1',
    },
  ],
  '2': [
    {
      id: '2-p1',
      name: 'Blue Line rehearsal bunker',
      type: 'rehearsal',
      purpose: 'work',
      city: 'Gallipoli',
      description:
        'Sound-treated room with house drum kit. Book by the hour when I am not using it — touring bands welcome.',
      hourlyRate: '€18/hr',
      capacity: 6,
      amenities: ['Drum kit', 'Bass amp', 'Guitar amp', 'PA wedge'],
      photos: [
        {
          id: '2-p1-a',
          url: `${U}/photo-1519892300165-c27d1d47f784?w=900&h=650&fit=crop`,
          caption: 'Kit end of the room',
        },
        {
          id: '2-p1-b',
          url: `${U}/photo-1511379936296-1b3dc1e1fad1?w=900&h=650&fit=crop`,
          caption: 'Amp corner + PA',
        },
      ],
      ownerId: '2',
    },
    {
      id: '2-p2',
      name: 'Harbour stage (weekend slots)',
      type: 'venue',
      purpose: 'both',
      city: 'Gallipoli',
      description:
        'Organiser friend runs an open-mic on the harbour wall. I can intro you for a guest slot — fun crowd, mixed tourists + locals.',
      capacity: 80,
      amenities: ['Basic PA', 'DI boxes', 'Evening lighting'],
      photos: [
        {
          id: '2-p2-a',
          url: `${U}/photo-1506157786151-54500f258709?w=900&h=650&fit=crop`,
          caption: 'Stage facing the harbour',
        },
        {
          id: '2-p2-b',
          url: `${U}/photo-1429962714451-bb934ec75da1?w=900&h=650&fit=crop`,
          caption: 'Weekend crowd',
        },
      ],
      ownerId: '2',
    },
  ],
}

const LS_KEY = 'musician-proto-places'

export const PLACE_TYPE_LABELS = {
  venue: 'Venue',
  rehearsal: 'Rehearsal room',
  home_studio: 'Home studio',
  outdoor: 'Outdoor space',
}

export const PLACE_PURPOSE_LABELS = {
  work: 'Work / sessions',
  fun: 'Fun / open mic',
  both: 'Work & fun',
}

export function readUserPlaces() {
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

export function writeUserPlaces(list) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LS_KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent('musician-proto-places-updated'))
}

export function addUserPlace(listing) {
  writeUserPlaces([listing, ...readUserPlaces()])
}

/** @param {string} musicianId */
export function getPlacesFor(musicianId) {
  const mock = BY_MUSICIAN[musicianId] ?? []
  if (typeof window === 'undefined') return mock
  const user = readUserPlaces().filter((p) => p.ownerId === musicianId)
  return [...user, ...mock]
}
