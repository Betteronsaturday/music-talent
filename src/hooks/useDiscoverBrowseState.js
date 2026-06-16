'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MOCK_MUSICIANS, mergeMeFromStorage, matchesRoleExperienceFilter } from '@/data/musiciansMock'
import { coordsFor } from '@/data/musicianMapCoords'
import { haversineKm, NEAR_ME_RADIUS_KM } from '@/lib/geo'
import {
  DISCOVER_MAP_FOCUS_EVENT,
  readMapFocusMusicianId,
} from '@/lib/discoverMapFocus'

const BROWSE_STORAGE_KEY = 'musician-proto-discover-browse'

function readBrowsePrefs() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(BROWSE_STORAGE_KEY)
    if (!raw) return {}
    const v = JSON.parse(raw)
    return v && typeof v === 'object' ? v : {}
  } catch {
    return {}
  }
}

function writeBrowsePrefs(data) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(BROWSE_STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

/** Migrate legacy session key `category` (role slug only) → `r:slug`. */
function hydrateRoleExperience(p) {
  const re = typeof p.roleExperience === 'string' ? p.roleExperience : ''
  if (re) return re
  const legacy = typeof p.category === 'string' ? p.category : ''
  if (legacy) return `r:${legacy}`
  return ''
}

export function useDiscoverBrowseState() {
  const didHydrate = useRef(false)
  const [list, setList] = useState(MOCK_MUSICIANS)
  const [instrument, setInstrument] = useState('')
  const [genre, setGenre] = useState('')
  const [city, setCity] = useState('')
  const [roleExperience, setRoleExperience] = useState('')
  const [nearMeEnabled, setNearMeEnabled] = useState(false)
  const [userGeo, setUserGeo] = useState(null)
  const [geoStatus, setGeoStatus] = useState('idle')
  const [geoError, setGeoError] = useState(null)
  const [mapFocusId, setMapFocusId] = useState(null)

  useEffect(() => {
    const syncMapFocus = () => setMapFocusId(readMapFocusMusicianId())
    syncMapFocus()
    window.addEventListener(DISCOVER_MAP_FOCUS_EVENT, syncMapFocus)
    return () => window.removeEventListener(DISCOVER_MAP_FOCUS_EVENT, syncMapFocus)
  }, [])

  useEffect(() => {
    const refresh = () => setList(mergeMeFromStorage(MOCK_MUSICIANS))
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('musician-proto-updated', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('musician-proto-updated', refresh)
    }
  }, [])

  useEffect(() => {
    if (!didHydrate.current) {
      const p = readBrowsePrefs()
      setInstrument(typeof p.instrument === 'string' ? p.instrument : '')
      setGenre(typeof p.genre === 'string' ? p.genre : '')
      setCity(typeof p.city === 'string' ? p.city : '')
      setRoleExperience(hydrateRoleExperience(p))
      setNearMeEnabled(Boolean(p.nearMeEnabled))
      didHydrate.current = true
      return
    }
    writeBrowsePrefs({ instrument, genre, city, roleExperience, nearMeEnabled })
  }, [instrument, genre, city, roleExperience, nearMeEnabled])

  useEffect(() => {
    if (!nearMeEnabled) {
      setUserGeo(null)
      setGeoStatus('idle')
      setGeoError(null)
      return
    }
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('error')
      setGeoError('Geolocation is not supported in this browser.')
      return
    }
    setGeoStatus('loading')
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoStatus('ok')
      },
      () => {
        setGeoStatus('error')
        setGeoError(
          'Location permission was denied or timed out. Turn off “Use my location” to browse all mock pins.'
        )
        setUserGeo(null)
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 120_000 }
    )
  }, [nearMeEnabled])

  const instruments = useMemo(
    () => [...new Set(MOCK_MUSICIANS.flatMap((m) => m.instruments))].sort((a, b) => a.localeCompare(b)),
    []
  )
  const genres = useMemo(
    () => [...new Set(MOCK_MUSICIANS.flatMap((m) => m.genres))].sort((a, b) => a.localeCompare(b)),
    []
  )
  const cities = useMemo(
    () => [...new Set(MOCK_MUSICIANS.map((m) => m.city).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    []
  )

  const hasActiveBrowseFilters = useMemo(
    () => Boolean(instrument || genre || city || roleExperience),
    [instrument, genre, city, roleExperience]
  )

  const clearBrowseFilters = useCallback(() => {
    setInstrument('')
    setGenre('')
    setCity('')
    setRoleExperience('')
  }, [])

  const filtered = useMemo(() => {
    return list.filter((m) => {
      if (!matchesRoleExperienceFilter(m, roleExperience)) return false
      if (instrument && !m.instruments.includes(instrument)) return false
      if (genre && !m.genres.includes(genre)) return false
      if (city && m.city !== city) return false
      return true
    })
  }, [list, roleExperience, instrument, genre, city])

  const withCoords = useMemo(() => {
    return filtered
      .map((m) => {
        const c = coordsFor(m.id)
        if (!c) return null
        return { ...m, lat: c.lat, lng: c.lng }
      })
      .filter(Boolean)
  }, [filtered])

  const displayedBase = useMemo(() => {
    if (!nearMeEnabled) return withCoords
    if (geoStatus === 'loading' || geoStatus === 'idle') return withCoords
    if (geoStatus === 'error' || !userGeo) return withCoords
    return withCoords.filter((m) => haversineKm(userGeo, { lat: m.lat, lng: m.lng }) <= NEAR_ME_RADIUS_KM)
  }, [withCoords, nearMeEnabled, geoStatus, userGeo])

  /** After opening a profile from the map, that musician is listed first on Discover (when still in the filtered set). */
  const displayed = useMemo(() => {
    if (!mapFocusId) return displayedBase
    const idx = displayedBase.findIndex((m) => m.id === mapFocusId)
    if (idx <= 0) return displayedBase
    const next = [...displayedBase]
    const [picked] = next.splice(idx, 1)
    return [picked, ...next]
  }, [displayedBase, mapFocusId])

  const mapFocusListedFirst = Boolean(
    mapFocusId && displayed.length > 0 && displayed[0].id === mapFocusId
  )

  const suppressYouPin = Boolean(nearMeEnabled && geoStatus === 'ok' && userGeo)
  const userLocationForMap = nearMeEnabled && geoStatus === 'ok' && userGeo ? userGeo : null

  return {
    instrument,
    setInstrument,
    genre,
    setGenre,
    city,
    setCity,
    roleExperience,
    setRoleExperience,
    nearMeEnabled,
    setNearMeEnabled,
    geoStatus,
    geoError,
    instruments,
    genres,
    cities,
    hasActiveBrowseFilters,
    clearBrowseFilters,
    filtered,
    withCoords,
    displayed,
    suppressYouPin,
    userLocationForMap,
    mapFocusListedFirst,
  }
}
