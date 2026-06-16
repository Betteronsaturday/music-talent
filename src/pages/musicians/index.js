'use client'

import Link from 'next/link'
import MusicianShell from '../../../components/musicians/MusicianShell'
import MusicianCard from '../../../components/musicians/MusicianCard'
import { FilterSelect } from '../../../components/musicians/DiscoverFilterFields'
import RoleExperienceFilterMenu from '../../../components/musicians/RoleExperienceFilterMenu'
import { MOCK_STORIES } from '@/data/storiesMock'
import { useDiscoverBrowseState } from '@/hooks/useDiscoverBrowseState'
import { NEAR_ME_RADIUS_KM } from '@/lib/geo'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function MusiciansDiscoverPage() {
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
    geoStatus,
    withCoords,
    displayed,
    instruments,
    genres,
    cities,
    hasActiveBrowseFilters,
    clearBrowseFilters,
    mapFocusListedFirst,
  } = useDiscoverBrowseState()

  const emptyStateCard = (
    <Card className="border-dashed">
      <CardContent className="p-6 text-center text-sm text-muted-foreground">
        {nearMeEnabled && geoStatus === 'ok' && withCoords.length > 0 ? (
          <>
            No musicians within {NEAR_ME_RADIUS_KM} km with the current filters. Turn off GPS on the Map tab or
            change filters — mock pins stay in the Province of Lecce (Salento).
          </>
        ) : (
          <>No one matches these filters. Clear a filter to see more profiles.</>
        )}
      </CardContent>
    </Card>
  )

  return (
    <MusicianShell title="Discover · Musicians">
      <section className="space-y-6" aria-labelledby="discover-heading">
        <div className="space-y-2">
          <h2 id="discover-heading" className="text-sm font-medium text-foreground">
            Salento scene (mock)
          </h2>
          <p className="text-xs text-muted-foreground">
            Profiles are fictional but clustered around the Province of Lecce for the map prototype. Use the{' '}
            <strong className="font-medium text-foreground">Map</strong> tab for pins by main instrument, role, and
            experience — same filters and optional GPS apply there.
          </p>
        </div>

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

        <p className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{displayed.length}</span> musicians
        </p>

        {mapFocusListedFirst ? (
          <p className="text-xs text-amber-100/85">
            Opened from the map — this profile stays at the top while it still matches your filters.
          </p>
        ) : null}

        <ul className="grid gap-4 sm:grid-cols-2">
          {displayed.map((m) => (
            <li key={m.id}>
              <MusicianCard musician={m} />
            </li>
          ))}
        </ul>

        {displayed.length === 0 ? emptyStateCard : null}

        <div className="border-t border-border pt-8">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h2 className="text-sm font-medium text-foreground">Stories</h2>
              <p className="mt-1 text-xs text-muted-foreground">Outcomes & moments (mock vignettes).</p>
            </div>
            <Button variant="link" className="h-auto p-0 text-xs text-amber-200/90" asChild>
              <Link href="/musicians/stories">See all</Link>
            </Button>
          </div>
          <ul className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
            {MOCK_STORIES.map((s) => (
              <li key={s.id} className="w-[min(100%,280px)] shrink-0 snap-start">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-[10px] uppercase tracking-wider">
                      {s.city}
                    </CardDescription>
                    <CardTitle className="text-sm leading-snug">{s.headline}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="line-clamp-3 text-xs text-muted-foreground">{s.detail}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MusicianShell>
  )
}
