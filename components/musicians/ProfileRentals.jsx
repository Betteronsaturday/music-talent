'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Guitar, Mail, Package } from 'lucide-react'
import { toast } from 'sonner'
import {
  addUserRental,
  CONDITION_LABELS,
  getRentalsFor,
} from '@/data/profileRentalsMock'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

function uid() {
  return `ur-${Date.now()}`
}

/**
 * Gear & instrument rentals on a musician profile.
 * @param {{ musician: Record<string, unknown>, viewerIsOwner: boolean }} props
 */
export default function ProfileRentals({ musician, viewerIsOwner }) {
  const [rentals, setRentals] = useState(() => getRentalsFor(musician.id))
  const [instrument, setInstrument] = useState('')
  const [description, setDescription] = useState('')
  const [dailyRate, setDailyRate] = useState('')
  const [location, setLocation] = useState(musician.city ?? '')
  const [condition, setCondition] = useState('good')
  const [photoUrl, setPhotoUrl] = useState('')

  const canAdd = viewerIsOwner && musician.id === 'you'

  useEffect(() => {
    const load = () => setRentals(getRentalsFor(musician.id))
    load()
    window.addEventListener('musician-proto-rentals-updated', load)
    return () => window.removeEventListener('musician-proto-rentals-updated', load)
  }, [musician.id])

  const onRequest = (item) => {
    if (viewerIsOwner) {
      toast.message('Others would reach out to rent this gear (mock).')
      return
    }
    const email = musician.contactEmail
    if (email) {
      const subject = encodeURIComponent(`Rental inquiry: ${item.instrument}`)
      const body = encodeURIComponent(
        `Hi ${musician.displayName},\n\nI'm interested in renting your ${item.instrument} listed on Music Talent.\n\n`
      )
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
      toast.success('Opening your email client (mock).')
    } else {
      toast.message(`Ask ${musician.displayName} about "${item.instrument}" via their profile links.`)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (!instrument.trim() || !description.trim()) return
    addUserRental({
      id: uid(),
      instrument: instrument.trim(),
      description: description.trim(),
      dailyRate: dailyRate.trim() || undefined,
      location: location.trim() || 'Lecce',
      condition,
      available: true,
      photoUrl: photoUrl.trim() || undefined,
      ownerId: 'you',
      useCase: undefined,
    })
    setInstrument('')
    setDescription('')
    setDailyRate('')
    setPhotoUrl('')
    toast.success('Rental listing saved in this browser.')
  }

  if (!rentals.length && !canAdd) return null

  return (
    <Card id="profile-rentals" aria-labelledby="rentals-heading">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Guitar className="size-4 text-muted-foreground" aria-hidden />
          <CardTitle id="rentals-heading" className="text-sm">
            Instrument & gear rentals
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Spare keys, mics, kits — gear others can borrow or rent when you are not using it.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {rentals.length ? (
          <ul className="space-y-4">
            {rentals.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-xl border border-border bg-card/40"
              >
                <div className="flex flex-col sm:flex-row">
                  {item.photoUrl ? (
                    <div className="relative aspect-[4/3] w-full shrink-0 bg-muted sm:aspect-auto sm:h-36 sm:w-44">
                      <Image
                        src={item.photoUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 176px"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] w-full shrink-0 items-center justify-center bg-muted/50 sm:aspect-auto sm:h-36 sm:w-44">
                      <Package className="size-8 text-muted-foreground/50" aria-hidden />
                    </div>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="font-semibold leading-snug">{item.instrument}</p>
                        <Badge
                          variant={item.available ? 'secondary' : 'outline'}
                          className={cn(
                            item.available
                              ? 'border-emerald-500/40 text-emerald-100'
                              : 'text-muted-foreground'
                          )}
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {item.dailyRate ? <span>{item.dailyRate}</span> : null}
                        <span>{item.location}</span>
                        <span>{CONDITION_LABELS[item.condition] ?? item.condition}</span>
                      </div>
                      {item.useCase ? (
                        <p className="text-[11px] text-muted-foreground/90">Best for: {item.useCase}</p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit gap-1.5"
                      disabled={!item.available}
                      onClick={() => onRequest(item)}
                    >
                      <Mail className="size-3.5" />
                      {viewerIsOwner ? 'Preview inquiry' : 'Request rental'}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No rentals listed yet.</p>
        )}

        {canAdd ? (
          <Card className="border-dashed bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                List gear (local only)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="rental-instrument">Instrument / gear</Label>
                  <Input
                    id="rental-instrument"
                    required
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    placeholder="e.g. Nord Stage 3, SM7B kit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rental-desc">Description</Label>
                  <Textarea
                    id="rental-desc"
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Condition, what's included, pickup area…"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rental-rate">Daily rate (optional)</Label>
                    <Input
                      id="rental-rate"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(e.target.value)}
                      placeholder="€25/day"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rental-location">Location</Label>
                    <Input
                      id="rental-location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rental-condition">Condition</Label>
                    <select
                      id="rental-condition"
                      className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rental-photo">Photo URL (optional)</Label>
                    <Input
                      id="rental-photo"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/…"
                    />
                  </div>
                </div>
                <Button type="submit" size="sm">
                  Add rental listing
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </CardContent>
    </Card>
  )
}
