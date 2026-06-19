'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_MARKER_COLORS } from '@/theme/muiTheme'

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function chipIcon(label, color) {
  const safe = escapeHtml(label)
  const bg = escapeHtml(color)
  return L.divIcon({
    className: 'browse-map-chip-wrap',
    html: `<div class="browse-map-chip" style="background:${bg}" role="img" aria-label="${safe}"><span>${safe}</span></div>`,
    iconAnchor: [0, 16],
    iconSize: [1, 32],
  })
}

function userIcon() {
  return L.divIcon({
    className: 'musician-map-user-wrap',
    html: '<div class="musician-map-user" aria-hidden="true"></div>',
    iconAnchor: [8, 8],
    iconSize: [16, 16],
  })
}

/**
 * @param {{
 *   markers: Array<{ id: string, kind: string, lat: number, lng: number, label: string, href: string }>,
 *   userLocation: { lat: number, lng: number } | null,
 *   fullscreen?: boolean,
 * }} props
 */
export default function BrowseMapColored({ markers, userLocation, fullscreen = false }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const map = L.map(el, { scrollWheelZoom: true, zoomControl: true })
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    for (const m of markers) {
      const color = MAP_MARKER_COLORS[m.kind] || MAP_MARKER_COLORS.artist
      const marker = L.marker([m.lat, m.lng], { icon: chipIcon(m.label, color) }).addTo(map)
      marker.bindPopup(
        `<div class="map-popup"><p class="map-popup__title">${escapeHtml(m.label)}</p><p class="map-popup__link"><a href="${escapeHtml(m.href)}">View more</a></p></div>`,
        { maxWidth: 240 }
      )
    }

    if (userLocation) {
      L.circle([userLocation.lat, userLocation.lng], {
        radius: 900,
        color: '#3b82f6',
        weight: 1,
        fillColor: '#3b82f6',
        fillOpacity: 0.06,
      }).addTo(map)
      const u = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon(), zIndexOffset: 500 }).addTo(map)
      u.bindPopup('<div class="map-popup-user">You are here</div>')
    }

    const pts = [...markers.map((m) => [m.lat, m.lng])]
    if (userLocation) pts.push([userLocation.lat, userLocation.lng])
    if (pts.length === 1) {
      map.setView(pts[0], userLocation ? 12 : 11)
    } else if (pts.length > 1) {
      map.fitBounds(L.latLngBounds(pts).pad(0.12))
    } else {
      map.setView([40.15, 18.35], 10)
    }

    const ro = new ResizeObserver(() => {
      map.invalidateSize()
    })
    ro.observe(el)
    const t = window.setTimeout(() => map.invalidateSize(), 120)

    return () => {
      window.clearTimeout(t)
      ro.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [JSON.stringify(markers), userLocation?.lat, userLocation?.lng])

  useEffect(() => {
    if (fullscreen && mapRef.current) {
      const t = window.setTimeout(() => mapRef.current?.invalidateSize(), 80)
      return () => window.clearTimeout(t)
    }
  }, [fullscreen])

  return (
    <div
      ref={elRef}
      style={{
        width: '100%',
        height: fullscreen ? '100%' : '100%',
        minHeight: fullscreen ? undefined : 420,
        borderRadius: fullscreen ? 0 : 8,
        overflow: 'hidden',
      }}
    />
  )
}
