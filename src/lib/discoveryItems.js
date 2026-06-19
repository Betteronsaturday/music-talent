import { MOCK_MUSICIANS } from '@/data/musiciansMock'
import { MOCK_COLLABS, readUserCollabs } from '@/data/collabsMock'
import { getRentalsFor } from '@/data/profileRentalsMock'
import { getPlacesFor } from '@/data/profilePlacesMock'
import { mockImage } from '@/data/mockImages'
import { coordsFor } from '@/data/musicianMapCoords'

/** @typedef {'artist'|'instrument'|'space'|'collaboration'} DiscoveryKind */

/**
 * @typedef {{
 *   id: string,
 *   kind: DiscoveryKind,
 *   title: string,
 *   description: string,
 *   imageUrl: string,
 *   href: string,
 *   city?: string,
 *   ownerId?: string,
 *   lat?: number,
 *   lng?: number,
 *   mapLabel: string,
 * }} DiscoveryItem
 */

function musicianItems(musicians) {
  return musicians.map((m) => ({
    id: `artist-${m.id}`,
    kind: /** @type {const} */ ('artist'),
    title: m.displayName,
    description: m.headline || m.bio?.slice(0, 120) || `${m.instruments.join(', ')} · ${m.genres.join(', ')}`,
    imageUrl: m.photoUrl,
    href: `/musicians/${m.id}`,
    city: m.city,
    ownerId: m.id,
    lat: coordsFor(m.id)?.lat,
    lng: coordsFor(m.id)?.lng,
    mapLabel: m.displayName,
  }))
}

function rentalItems() {
  const items = []
  for (const m of MOCK_MUSICIANS) {
    for (const r of getRentalsFor(m.id)) {
      if (!r.available) continue
      const c = coordsFor(m.id)
      items.push({
        id: `rental-${r.id}`,
        kind: /** @type {const} */ ('instrument'),
        title: r.instrument,
        description: r.description,
        imageUrl: r.photoUrl || mockImage('acousticGuitar'),
        href: `/musicians/${m.id}#profile-rentals`,
        city: r.location,
        ownerId: m.id,
        lat: c?.lat,
        lng: c?.lng,
        mapLabel: r.instrument.split('(')[0].trim().slice(0, 22),
      })
    }
  }
  return items
}

function placeItems() {
  const items = []
  for (const m of MOCK_MUSICIANS) {
    for (const p of getPlacesFor(m.id)) {
      const c = coordsFor(m.id)
      const photo = p.photos?.[0]?.url || mockImage('studioRoom')
      items.push({
        id: `place-${p.id}`,
        kind: /** @type {const} */ ('space'),
        title: p.name,
        description: p.description,
        imageUrl: photo,
        href: `/musicians/${m.id}#profile-places`,
        city: p.city,
        ownerId: m.id,
        lat: c?.lat,
        lng: c?.lng,
        mapLabel: p.name.split('(')[0].trim().slice(0, 18),
      })
    }
  }
  return items
}

function collabItems(userPosts = []) {
  const all = [...userPosts, ...MOCK_COLLABS]
  return all.map((c) => {
    const c0 = coordsFor(c.postedById)
    return {
      id: `collab-${c.id}`,
      kind: /** @type {const} */ ('collaboration'),
      title: c.title,
      description: c.body,
      imageUrl: mockImage('liveConcert'),
      href: `/musicians/map?tab=collabs`,
      city: c.city,
      ownerId: c.postedById,
      lat: c0?.lat,
      lng: c0?.lng,
      mapLabel: 'Collaboration',
    }
  })
}

/**
 * @param {{
 *   segment: 'all'|'artists'|'instruments'|'spaces'|'collaborations',
 *   musicians: typeof MOCK_MUSICIANS,
 *   userCollabs?: ReturnType<typeof readUserCollabs>,
 * }} opts
 * @returns {DiscoveryItem[]}
 */
export function buildDiscoveryItems({ segment, musicians, userCollabs = [] }) {
  const artists = musicianItems(musicians)
  const instruments = rentalItems()
  const spaces = placeItems()
  const collaborations = collabItems(userCollabs)

  switch (segment) {
    case 'artists':
      return artists
    case 'instruments':
      return instruments
    case 'spaces':
      return spaces
    case 'collaborations':
      return collaborations
    default:
      return [...artists, ...instruments, ...spaces, ...collaborations]
  }
}

/**
 * @param {DiscoveryItem[]} items
 */
export function discoveryMapMarkers(items) {
  const seen = new Set()
  return items
    .filter((item) => typeof item.lat === 'number' && typeof item.lng === 'number')
    .filter((item) => {
      const key = `${item.kind}-${item.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((item) => ({
      id: item.id,
      kind: item.kind,
      lat: item.lat,
      lng: item.lng,
      label: item.mapLabel,
      href: item.href,
    }))
}
