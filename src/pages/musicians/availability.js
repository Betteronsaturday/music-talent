'use client'

import { useEffect, useState } from 'react'
import MusicianShell from '../../../components/musicians/MusicianShell'
import AvailabilityBadge from '../../../components/musicians/AvailabilityBadge'
import {
  AVAILABILITY,
  AVAILABILITY_LABELS,
  MEETUP_TYPES,
  MEETUP_LABELS,
  MOCK_MUSICIANS,
  readStoredMeOverrides,
  writeStoredMeOverrides,
} from '@/data/musiciansMock'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const defaultMe = MOCK_MUSICIANS.find((m) => m.id === 'you')

export default function MusiciansAvailabilityPage() {
  const [availability, setAvailability] = useState(defaultMe?.availability ?? AVAILABILITY.OPEN_NOW)
  const [openFor, setOpenFor] = useState(() => new Set(defaultMe?.openFor ?? []))

  useEffect(() => {
    const stored = readStoredMeOverrides()
    if (stored?.availability) setAvailability(stored.availability)
    if (stored?.openFor?.length) setOpenFor(new Set(stored.openFor))
  }, [])

  const toggleMeetup = (key) => {
    setOpenFor((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const save = () => {
    const prev = readStoredMeOverrides() ?? {}
    writeStoredMeOverrides({
      ...prev,
      availability,
      openFor: [...openFor],
    })
    toast.success('Saved locally — discover and your profile will reflect this.')
  }

  return (
    <MusicianShell title="Your status · Musicians">
      <section className="space-y-8" aria-labelledby="status-heading">
        <div>
          <h2 id="status-heading" className="text-lg font-semibold">
            Set availability
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Placeholder flow — saved only in this browser (localStorage). No account.
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Current status
            </CardTitle>
            <CardDescription>
              This badge is the strongest visual cue across discover and profiles.
            </CardDescription>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <AvailabilityBadge status={availability} size="lg" />
            </div>
          </CardHeader>
          <CardContent>
            <fieldset className="space-y-3">
              <legend className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Choose status
              </legend>
              <div className="flex flex-col gap-2">
                {Object.values(AVAILABILITY).map((key) => (
                  <label
                    key={key}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition',
                      availability === key
                        ? 'border-primary/50 bg-muted'
                        : 'border-border bg-card hover:border-primary/30'
                    )}
                  >
                    <input
                      type="radio"
                      name="availability"
                      value={key}
                      checked={availability === key}
                      onChange={() => setAvailability(key)}
                      className="h-4 w-4"
                    />
                    {AVAILABILITY_LABELS[key]}
                  </label>
                ))}
              </div>
            </fieldset>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              What are you open for?
            </CardTitle>
            <CardDescription>Select any combination (mock only).</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {Object.values(MEETUP_TYPES).map((key) => {
                const on = openFor.has(key)
                return (
                  <li key={key}>
                    <Button
                      type="button"
                      variant={on ? 'secondary' : 'outline'}
                      className={cn(
                        'h-auto w-full justify-between py-3 text-left font-normal',
                        on && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-50'
                      )}
                      onClick={() => toggleMeetup(key)}
                    >
                      {MEETUP_LABELS[key]}
                      <span className="text-xs text-muted-foreground">{on ? 'On' : 'Off'}</span>
                    </Button>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>

        <Button className="w-full sm:w-auto" onClick={save}>
          Save status
        </Button>
      </section>
    </MusicianShell>
  )
}
