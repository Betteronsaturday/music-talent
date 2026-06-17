'use client'

import { useEffect, useState } from 'react'
import { Mail, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import PlacePhotoAlbum from './PlacePhotoAlbum'
import {
  addUserPlace,
  getPlacesFor,
  PLACE_PURPOSE_LABELS,
  PLACE_TYPE_LABELS,
} from '@/data/profilePlacesMock'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const U = 'https://images.unsplash.com'

function uid() {
  return `up-${Date.now()}`
}

/**
 * Places to play or rent — venues, studios, rehearsal rooms with photo albums.
 * @param {{ musician: Record<string, unknown>, viewerIsOwner: boolean }} props
 */
export default function ProfilePlaces({ musician, viewerIsOwner }) {
  const [places, setPlaces] = useState(() => getPlacesFor(musician.id))
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState(musician.city ?? '')
  const [type, setType] = useState('home_studio')
  const [purpose, setPurpose] = useState('both')
  const [hourlyRate, setHourlyRate] = useState('')
  const [capacity, setCapacity] = useState('')
  const [amenities, setAmenities] = useState('')

  const canAdd = viewerIsOwner && musician.id === 'you'

  useEffect(() => {
    const load = () => setPlaces(getPlacesFor(musician.id))
    load()
    window.addEventListener('musician-proto-places-updated', load)
    return () => window.removeEventListener('musician-proto-places-updated', load)
  }, [musician.id])

  const onInquire = (place) => {
    if (viewerIsOwner) {
      toast.message('Others would inquire about booking this space (mock).')
      return
    }
    const email = musician.contactEmail
    if (email) {
      const subject = encodeURIComponent(`Space inquiry: ${place.name}`)
      const body = encodeURIComponent(
        `Hi ${musician.displayName},\n\nI'm interested in "${place.name}" listed on your profile.\n\n`
      )
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
      toast.success('Opening your email client (mock).')
    } else {
      toast.message(`Ask ${musician.displayName} about "${place.name}" via their profile links.`)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return
    const id = uid()
    const amenityList = amenities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    addUserPlace({
      id,
      name: name.trim(),
      type,
      purpose,
      city: city.trim() || 'Lecce',
      description: description.trim(),
      hourlyRate: hourlyRate.trim() || undefined,
      capacity: capacity ? Number(capacity) : undefined,
      amenities: amenityList.length ? amenityList : undefined,
      photos: [
        {
          id: `${id}-a`,
          url: `${U}/photo-1598487032696-e8a752d08a18?w=900&h=650&fit=crop`,
          caption: 'Space preview (placeholder)',
        },
      ],
      ownerId: 'you',
    })
    setName('')
    setDescription('')
    setHourlyRate('')
    setCapacity('')
    setAmenities('')
    toast.success('Place listing saved in this browser.')
  }

  if (!places.length && !canAdd) return null

  return (
    <Card id="profile-places" aria-labelledby="places-heading">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" aria-hidden />
          <CardTitle id="places-heading" className="text-sm">
            Places to play & rent
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Home studios, rehearsal rooms, rooftops, and harbour stages — with photo albums so people know what they are booking.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {places.length ? (
          <ul className="space-y-4">
            {places.map((place) => (
              <li
                key={place.id}
                className="space-y-4 rounded-xl border border-border bg-card/40 p-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold leading-snug">{place.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="font-normal">
                        {PLACE_TYPE_LABELS[place.type] ?? place.type}
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        {PLACE_PURPOSE_LABELS[place.purpose] ?? place.purpose}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{place.description}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{place.city}</span>
                    {place.hourlyRate ? <span>{place.hourlyRate}</span> : null}
                    {place.capacity ? <span>Up to {place.capacity} people</span> : null}
                  </div>
                  {place.amenities?.length ? (
                    <ul className="flex flex-wrap gap-1.5 pt-1">
                      {place.amenities.map((a) => (
                        <li key={a}>
                          <Badge variant="outline" className="text-[10px] font-normal">
                            {a}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <PlacePhotoAlbum photos={place.photos} placeName={place.name} />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => onInquire(place)}
                >
                  <Mail className="size-3.5" />
                  {viewerIsOwner ? 'Preview inquiry' : 'Inquire about this space'}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No places listed yet.</p>
        )}

        {canAdd ? (
          <Card className="border-dashed bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                List a place (local only)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="place-name">Name</Label>
                  <Input
                    id="place-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Courtyard writing room"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="place-desc">Description</Label>
                  <Textarea
                    id="place-desc"
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Vibe, rules, what's included…"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="place-city">City</Label>
                    <Input id="place-city" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="place-rate">Hourly rate (optional)</Label>
                    <Input
                      id="place-rate"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="€15/hr"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="place-type">Type</Label>
                    <select
                      id="place-type"
                      className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      {Object.entries(PLACE_TYPE_LABELS).map(([k, label]) => (
                        <option key={k} value={k}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="place-purpose">Purpose</Label>
                    <select
                      id="place-purpose"
                      className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    >
                      {Object.entries(PLACE_PURPOSE_LABELS).map(([k, label]) => (
                        <option key={k} value={k}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="place-capacity">Capacity (optional)</Label>
                    <Input
                      id="place-capacity"
                      type="number"
                      min={1}
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="place-amenities">Amenities (comma-separated)</Label>
                  <Input
                    id="place-amenities"
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                    placeholder="PA, vocal booth, parking"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  New listings get a placeholder album photo. In production you would upload multiple images.
                </p>
                <Button type="submit" size="sm">
                  Add place listing
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </CardContent>
    </Card>
  )
}
