'use client'

import MusicianShell from '../../../components/musicians/MusicianShell'
import DiscoverMapSection from '../../../components/musicians/DiscoverMapSection'
import { FilterSelect } from '../../../components/musicians/DiscoverFilterFields'
import RoleExperienceFilterMenu from '../../../components/musicians/RoleExperienceFilterMenu'
import { useDiscoverBrowseState } from '@/hooks/useDiscoverBrowseState'
import { NEAR_ME_RADIUS_KM } from '@/lib/geo'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MusiciansMapPage() {
  const {
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
    withCoords,
    displayed,
    instruments,
    genres,
    cities,
    hasActiveBrowseFilters,
    clearBrowseFilters,
    suppressYouPin,
    userLocationForMap,
  } = useDiscoverBrowseState()

  const emptyStateCard = (
    <Card className="border-dashed">
      <CardContent className="p-6 text-center text-sm text-muted-foreground">
        {nearMeEnabled && geoStatus === 'ok' && withCoords.length > 0 ? (
          <>
            No musicians within {NEAR_ME_RADIUS_KM} km with the current filters. Turn off GPS or change filters —
            mock pins stay in the Province of Lecce (Salento).
          </>
        ) : (
          <>No one matches these filters. Clear a filter to see more profiles.</>
        )}
      </CardContent>
    </Card>
  )

  return (
    <MusicianShell title="Map · Musicians">
      <section className="space-y-6" aria-labelledby="map-heading">
        <h2 id="map-heading" className="text-sm font-medium text-foreground">
          Discovery map
        </h2>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Filters</CardTitle>
            {hasActiveBrowseFilters ? (
              <CardAction>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={clearBrowseFilters}
                >
                  Clear filters
                </Button>
              </CardAction>
            ) : null}
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
            <FilterSelect label="Instrument" value={instrument} onChange={setInstrument} options={instruments} />
            <FilterSelect label="Genre" value={genre} onChange={setGenre} options={genres} />
            <RoleExperienceFilterMenu label="Role & experience" value={roleExperience} onChange={setRoleExperience} />
          </CardContent>
        </Card>

        <DiscoverMapSection
          markers={displayed}
          userLocation={userLocationForMap}
          suppressYouPin={suppressYouPin}
          nearMeEnabled={nearMeEnabled}
          onNearMeChange={setNearMeEnabled}
          geoStatus={geoStatus}
          geoError={geoError}
        />

        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{displayed.length}</span> musicians match this view
          {nearMeEnabled && geoStatus === 'ok' ? ' (including distance when GPS is on).' : '.'}
        </p>

        {displayed.length === 0 ? emptyStateCard : null}
      </section>
    </MusicianShell>
  )
}
