/** sessionStorage key + event so Discover can react when a profile is opened from the map. */
export const DISCOVER_MAP_FOCUS_KEY = 'musician-proto-discover-map-focus'

export const DISCOVER_MAP_FOCUS_EVENT = 'musician-proto-discover-map-focus'

/**
 * @param {string} id
 */
export function setMapFocusMusicianId(id) {
  if (typeof window === 'undefined' || id == null || id === '') return
  try {
    window.sessionStorage.setItem(DISCOVER_MAP_FOCUS_KEY, String(id))
    window.dispatchEvent(new CustomEvent(DISCOVER_MAP_FOCUS_EVENT))
  } catch {
    /* ignore */
  }
}

export function readMapFocusMusicianId() {
  if (typeof window === 'undefined') return null
  try {
    const v = window.sessionStorage.getItem(DISCOVER_MAP_FOCUS_KEY)
    return v && typeof v === 'string' ? v : null
  } catch {
    return null
  }
}

export function clearMapFocusMusicianId() {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(DISCOVER_MAP_FOCUS_KEY)
    window.dispatchEvent(new CustomEvent(DISCOVER_MAP_FOCUS_EVENT))
  } catch {
    /* ignore */
  }
}
