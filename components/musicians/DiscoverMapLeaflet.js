'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MEETUP_LABELS, AVAILABILITY_LABELS, MUSICIAN_CATEGORY_LABELS } from '@/data/musiciansMock'

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function pillIcon(label) {
  const safe = escapeHtml(label)
  return L.divIcon({
    className: 'musician-map-pin-wrap',
    html: `<div class="musician-map-pin" role="img" aria-label="${safe}"><span class="musician-map-pin__pill">${safe}</span><span class="musician-map-pin__caret" aria-hidden="true"></span></div>`,
    iconAnchor: [72, 46],
    iconSize: [144, 48],
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
 *   markers: Array<{ id: string, lat: number, lng: number, displayName: string, instruments: string[], categories?: string[], openFor?: string[], availability?: string }>,
 *   userLocation: { lat: number, lng: number } | null,
 *   suppressYouPin?: boolean,
 * }} props
 */
export default function DiscoverMapLeaflet({ markers, userLocation, suppressYouPin }) {
  const elRef = useRef(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const apply = () => {
      const toShow = suppressYouPin ? markers.filter((m) => m.id !== 'you') : markers

      for (const m of toShow) {
        const mainInstrument = m.instruments?.[0] ?? 'Musician'
        const marker = L.marker([m.lat, m.lng], { icon: pillIcon(mainInstrument) }).addTo(map)
        const open = (m.openFor ?? [])
          .slice(0, 3)
          .map((k) => MEETUP_LABELS[k])
          .filter(Boolean)
          .join(' · ')
        const avail = m.availability ? AVAILABILITY_LABELS[m.availability] : ''
        const roles = (m.categories ?? [])
          .map((k) => MUSICIAN_CATEGORY_LABELS[k])
          .filter(Boolean)
          .join(' · ')
        const body = `
          <div class="map-popup">
            <p class="map-popup__title">${escapeHtml(m.displayName)}</p>
            <p class="map-popup__instrument">${escapeHtml(mainInstrument)}</p>
            ${roles ? `<p class="map-popup__roles">${escapeHtml(roles)}</p>` : ''}
            ${avail ? `<p class="map-popup__meta">${escapeHtml(avail)}</p>` : ''}
            ${open ? `<p class="map-popup__open">Open for: ${escapeHtml(open)}</p>` : ''}
            <p class="map-popup__link"><a href="/musicians/${escapeHtml(m.id)}?from=map">Open profile</a></p>
          </div>`
        marker.bindPopup(body, { maxWidth: 260 })
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

      const pts = [...toShow.map((m) => [m.lat, m.lng])]
      if (userLocation) pts.push([userLocation.lat, userLocation.lng])
      if (pts.length === 1) {
        map.setView(pts[0], userLocation ? 12 : 11)
      } else if (pts.length > 1) {
        const b = L.latLngBounds(pts)
        map.fitBounds(b.pad(0.14))
      } else {
        map.setView([40.35, 18.17], 10)
      }
    }

    apply()

    return () => {
      map.remove()
    }
    // Recreate map when markers / user change (keeps logic simple for prototype)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional remount set
  }, [JSON.stringify(markers), userLocation?.lat, userLocation?.lng, suppressYouPin])

  return <div ref={elRef} className="z-0 h-[min(52vh,440px)] w-full rounded-lg border border-border bg-muted" />
}
