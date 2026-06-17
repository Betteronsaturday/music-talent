/**
 * Verified Unsplash photo IDs — each returns HTTP 200 from images.unsplash.com.
 * Centralised so profile mocks and avatars stay in sync when URLs rot.
 */

const U = 'https://images.unsplash.com'

/** @type {Record<string, string>} */
export const MOCK_PHOTOS = {
  keyboard: 'photo-1520523839897-bd0b52f945a0',
  vocalMic: 'photo-1558618666-fcd25c85cd64',
  acousticGuitar: 'photo-1510915361894-db8b60106cb1',
  electricGuitar: 'photo-1511379938547-c1f69419868d',
  drums: 'photo-1571019613454-1cb2f99b2d8b',
  sampler: 'photo-1514320291840-2e0a9bf2a9ae',
  musicianPortrait: 'photo-1516280440614-37939bbacd81',
  liveConcert: 'photo-1493225457124-a3eb161ffa5f',
  stageLights: 'photo-1514525253161-7a46d19cd819',
  djDeck: 'photo-1470225620780-dba8ba36b745',
  studioRoom: 'photo-1507838153414-b4b713384a76',
  headphones: 'photo-1525201548942-d8732f6617a0',
  singer: 'photo-1487412720507-e7ab37603c6f',
  violin: 'photo-1511671782779-c97d3d27a1d4',
  trumpet: 'photo-1520454974749-611b7248ffdb',
  cello: 'photo-1574169208507-84376144848b',
}

/**
 * @param {string} photoId
 * @param {number} [w]
 * @param {number} [h]
 */
export function unsplashUrl(photoId, w = 800, h = 600) {
  return `${U}/${photoId}?w=${w}&h=${h}&fit=crop`
}

/**
 * @param {keyof typeof MOCK_PHOTOS} key
 * @param {number} [w]
 * @param {number} [h]
 */
export function mockImage(key, w = 800, h = 600) {
  return unsplashUrl(MOCK_PHOTOS[key], w, h)
}
