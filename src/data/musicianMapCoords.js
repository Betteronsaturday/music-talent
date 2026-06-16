/**
 * Mock pins — Province of Lecce (Salento, Puglia, Italy) for prototype density.
 * Coordinates are approximate town centres / neighbourhoods.
 */

export const MUSICIAN_COORDS = {
  you: { lat: 40.3527, lng: 18.172 },
  '1': { lat: 40.1713, lng: 18.1667 },
  '2': { lat: 40.0559, lng: 17.9914 },
  '3': { lat: 40.1456, lng: 18.4887 },
  '4': { lat: 40.1206, lng: 18.2984 },
  '5': { lat: 40.1761, lng: 17.8254 },
  '6': { lat: 40.0121, lng: 18.1632 },
  '7': { lat: 40.2684, lng: 18.0543 },
  '8': { lat: 40.1692, lng: 18.0614 },
  '9': { lat: 39.9269, lng: 18.1312 },
  '10': { lat: 39.9334, lng: 18.3572 },
  '11': { lat: 39.9414, lng: 18.1284 },
  '12': { lat: 40.2886, lng: 17.9994 },
  '13': { lat: 40.2044, lng: 18.2996 },
  '14': { lat: 39.9086, lng: 18.2611 },
  '15': { lat: 40.0019, lng: 18.4264 },
  '16': { lat: 40.3541, lng: 18.1755 },
  '17': { lat: 40.0535, lng: 17.9925 },
}

/** @param {string} id */
export function coordsFor(id) {
  return MUSICIAN_COORDS[id] ?? null
}
