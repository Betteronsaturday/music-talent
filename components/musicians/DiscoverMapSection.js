'use client'

import dynamic from 'next/dynamic'
import { NEAR_ME_RADIUS_KM } from '@/lib/geo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'

const DiscoverMapLeaflet = dynamic(() => import('./DiscoverMapLeaflet'), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[min(52vh,440px)] w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-xs text-muted-foreground"
      aria-hidden
    >
      Loading map…
    </div>
  ),
})

/**
 * @param {{
 *   markers: Array<{ id: string, lat: number, lng: number, displayName: string, instruments: string[], openFor?: string[], availability?: string }>,
 *   userLocation: { lat: number, lng: number } | null,
 *   suppressYouPin?: boolean,
 *   nearMeEnabled: boolean,
 *   onNearMeChange: (next: boolean) => void,
 *   geoStatus: 'idle' | 'loading' | 'ok' | 'error',
 *   geoError?: string | null,
 * }} props
 */
export default function DiscoverMapSection({
  markers,
  userLocation,
  suppressYouPin,
  nearMeEnabled,
  onNearMeChange,
  geoStatus,
  geoError,
}) {
  return (
    <Card>
      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm font-semibold leading-snug">Discovery map</CardTitle>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <input
              id="near-me-gps"
              type="checkbox"
              checked={nearMeEnabled}
              onChange={(e) => onNearMeChange(e.target.checked)}
              className="size-4 rounded border border-input accent-primary"
            />
            <Label htmlFor="near-me-gps" className="cursor-pointer text-xs font-normal leading-snug text-foreground">
              Use my location (GPS)
            </Label>
          </div>
          {geoStatus === 'loading' ? (
            <p className="text-[11px] text-muted-foreground">Requesting location…</p>
          ) : nearMeEnabled && geoStatus === 'ok' ? (
            <p className="text-[11px] text-muted-foreground">
              Showing musicians within ~{NEAR_ME_RADIUS_KM} km. Your pin is the blue dot.
            </p>
          ) : null}
        </div>
        {geoError ? <p className="text-[11px] text-destructive">{geoError}</p> : null}
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <DiscoverMapLeaflet
          markers={markers}
          userLocation={userLocation}
          suppressYouPin={suppressYouPin}
        />
        <p className="text-[10px] text-muted-foreground">
          Scroll zoom is off — use +/- controls. Enable GPS only if you want the map centred on you and the list
          filtered by distance (browser prompt).
        </p>
      </CardContent>
    </Card>
  )
}
