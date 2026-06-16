import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import MusicianShell from '../../../components/musicians/MusicianShell'
import AvailabilityBadge from '../../../components/musicians/AvailabilityBadge'
import ProfilePortfolio from '../../../components/musicians/ProfilePortfolio'
import ProfileResume from '../../../components/musicians/ProfileResume'
import ProfileMeetEngagement from '../../../components/musicians/ProfileMeetEngagement'
import {
  MOCK_MUSICIANS,
  mergeMeFromStorage,
  MEETUP_LABELS,
} from '@/data/musiciansMock'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { clearMapFocusMusicianId, setMapFocusMusicianId } from '@/lib/discoverMapFocus'

export async function getStaticPaths() {
  return {
    paths: MOCK_MUSICIANS.map((m) => ({ params: { id: m.id } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  return { props: { id: params.id } }
}

export default function MusicianProfilePage({ id }) {
  const router = useRouter()
  const [musician, setMusician] = useState(() => MOCK_MUSICIANS.find((m) => m.id === id))

  useEffect(() => {
    if (!router.isReady) return
    const raw = router.query.from
    const fromMap = Array.isArray(raw) ? raw[0] : raw
    if (fromMap === 'map') {
      setMapFocusMusicianId(id)
    } else {
      clearMapFocusMusicianId()
    }
  }, [router.isReady, router.query.from, id])

  useEffect(() => {
    const refresh = () => {
      const merged = mergeMeFromStorage(MOCK_MUSICIANS)
      setMusician(merged.find((m) => m.id === id))
    }
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('musician-proto-updated', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('musician-proto-updated', refresh)
    }
  }, [id])

  if (!musician) {
    return null
  }

  const isYou = musician.id === 'you'

  return (
    <MusicianShell title={`${musician.displayName} · Profile`}>
      <div className="space-y-8">
        <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground" asChild>
          <Link href="/musicians">← Back to discover</Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="relative aspect-[16/10] w-full bg-muted md:aspect-[21/9]">
            <Image
              src={musician.photoUrl}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 960px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{musician.displayName}</h1>
                <p className="text-sm text-muted-foreground">{musician.area}</p>
                {musician.city ? (
                  <p className="text-xs text-muted-foreground/80">
                    {musician.city}
                    {musician.region ? ` · ${musician.region}` : ''}
                  </p>
                ) : null}
                {musician.headline ? (
                  <p className="mt-2 max-w-prose text-sm font-medium leading-snug text-zinc-100 md:text-zinc-200">
                    {musician.headline}
                  </p>
                ) : null}
              </div>
              <AvailabilityBadge status={musician.availability} size="lg" />
            </div>
          </div>

          <CardContent className="space-y-8 p-5 md:p-8">
            <ProfileResume musician={musician} />

            <ProfileMeetEngagement musician={musician} viewerIsOwner={isYou} />

            {isYou ? (
              <Card className="border-amber-500/35 bg-amber-500/[0.06] ring-1 ring-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-100/90">
                    Profile insights
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Mock “Pro”-style engagement — static numbers for layout only.
                  </p>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <dt className="text-[11px] text-muted-foreground">Views (7d)</dt>
                      <dd className="text-lg font-semibold">128</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-muted-foreground">Link taps</dt>
                      <dd className="text-lg font-semibold">34</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-muted-foreground">Saves to lists</dt>
                      <dd className="text-lg font-semibold">12</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-muted-foreground">Collab replies</dt>
                      <dd className="text-lg font-semibold">5</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ) : null}

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Availability
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Status is the live signal other musicians see first — color-coded in the app.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <AvailabilityBadge status={musician.availability} size="lg" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Open for
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {musician.openFor.map((key) => (
                    <li key={key}>
                      <Badge variant="secondary">{MEETUP_LABELS[key]}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {isYou ? (
              <Button className="w-full min-[400px]:w-auto" asChild>
                <Link href="/musicians/availability">Edit your status</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>

        <ProfilePortfolio musician={musician} viewerIsOwner={isYou} />
      </div>
    </MusicianShell>
  )
}
