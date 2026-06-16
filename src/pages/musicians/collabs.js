'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import MusicianShell from '../../../components/musicians/MusicianShell'
import {
  MOCK_COLLABS,
  readUserCollabs,
  addUserCollab,
  COMPENSATION_LABELS,
} from '@/data/collabsMock'
import { REGIONS } from '@/data/regions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function uid() {
  return `uc-${Date.now()}`
}

export default function CollabsPage() {
  const [userPosts, setUserPosts] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [city, setCity] = useState('Los Angeles')
  const [region, setRegion] = useState('North America')
  const [needed, setNeeded] = useState('Producer, Vocalist')
  const [compensation, setCompensation] = useState('paid')
  const [filterCity, setFilterCity] = useState('')
  const [filterPaid, setFilterPaid] = useState(false)

  useEffect(() => {
    const load = () => setUserPosts(readUserCollabs())
    load()
    window.addEventListener('musician-proto-collabs-updated', load)
    return () => window.removeEventListener('musician-proto-collabs-updated', load)
  }, [])

  const all = useMemo(
    () => [...userPosts, ...MOCK_COLLABS].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [userPosts]
  )

  const cities = useMemo(() => {
    const s = new Set(MOCK_COLLABS.map((c) => c.city))
    userPosts.forEach((c) => s.add(c.city))
    return [...s].sort()
  }, [userPosts])

  const filtered = useMemo(() => {
    return all.filter((c) => {
      if (filterCity && c.city !== filterCity) return false
      if (filterPaid && c.compensation !== 'paid') return false
      return true
    })
  }, [all, filterCity, filterPaid])

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    addUserCollab({
      id: uid(),
      title: title.trim(),
      body: body.trim(),
      city,
      region,
      postedById: 'you',
      postedByName: 'You (preview)',
      needed: needed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      compensation,
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setTitle('')
    setBody('')
    setNeeded('Producer, Vocalist')
  }

  return (
    <MusicianShell title="Collabs · Musicians">
      <section className="space-y-8" aria-labelledby="collabs-heading">
        <div>
          <h2 id="collabs-heading" className="text-sm font-medium text-foreground">
            Collabs happening now
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Project posts (mock + your browser-saved posts). Similar to “describe your project and let
            collaborators find you”.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Label className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-normal">
            <input
              type="checkbox"
              checked={filterPaid}
              onChange={(e) => setFilterPaid(e.target.checked)}
              className="rounded border-input"
            />
            Paid only
          </Label>
          <select
            className={cn(
              'rounded-full border border-input bg-background px-3 py-1.5 text-sm',
              'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none'
            )}
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
          >
            <option value="">Any city</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-3">
          {filtered.map((c) => (
            <li key={c.id}>
              <Card className="transition-colors hover:border-primary/30">
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold">{c.title}</CardTitle>
                  {c.compensation ? (
                    <Badge variant="secondary" className="border border-amber-500/40 text-amber-100">
                      {COMPENSATION_LABELS[c.compensation] ?? c.compensation}
                    </Badge>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{c.body}</p>
                  <p className="text-xs text-muted-foreground">
                    Looking for: <span className="text-foreground">{c.needed.join(', ')}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    {c.city} · {c.region} · posted by{' '}
                    <Link href={`/musicians/${c.postedById}`} className="underline-offset-2 hover:underline">
                      {c.postedByName}
                    </Link>{' '}
                    · {c.createdAt}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Start a collab (local only)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collab-title">Title</Label>
                <Input
                  id="collab-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Need keys for 3-track EP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collab-body">Details</Label>
                <Textarea
                  id="collab-body"
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  placeholder="What you need, timeline, links…"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="collab-city">City</Label>
                  <Input id="collab-city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collab-region">Region</Label>
                  <select
                    id="collab-region"
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="collab-needed">Looking for (comma-separated roles)</Label>
                <Input id="collab-needed" value={needed} onChange={(e) => setNeeded(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collab-comp">Compensation</Label>
                <select
                  id="collab-comp"
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  value={compensation}
                  onChange={(e) => setCompensation(e.target.value)}
                >
                  <option value="paid">Paid</option>
                  <option value="split">Rev split</option>
                  <option value="unpaid">Unpaid / portfolio</option>
                </select>
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                Post collab
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </MusicianShell>
  )
}
