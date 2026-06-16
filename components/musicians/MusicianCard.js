import Image from 'next/image'
import Link from 'next/link'
import AvailabilityBadge from './AvailabilityBadge'
import { MEETUP_LABELS, MUSICIAN_CATEGORY_LABELS } from '@/data/musiciansMock'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function MusicianCard({ musician }) {
  const meetupPreview = musician.openFor?.slice(0, 3).map((k) => MEETUP_LABELS[k]).join(' · ')
  const roleKeys = musician.categories ?? []

  return (
    <Link href={`/musicians/${musician.id}`} className="group block h-full">
      <Card
        className={cn(
          'h-full overflow-hidden transition-colors hover:border-primary/30 hover:bg-card/90'
        )}
      >
        <div className="relative aspect-[4/3] w-full bg-muted">
          <Image
            src={musician.photoUrl}
            alt=""
            fill
            className="object-cover opacity-95 transition group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-x-0 bottom-0 flex justify-center p-3">
            <AvailabilityBadge status={musician.availability} size="lg" />
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold">{musician.displayName}</h2>
              <p className="text-xs text-muted-foreground">{musician.area}</p>
              {musician.city ? (
                <p className="text-[11px] text-muted-foreground/80">
                  {musician.city}
                  {musician.region ? ` · ${musician.region}` : ''}
                </p>
              ) : null}
            </div>
          </div>
          {roleKeys.length ? (
            <div className="flex flex-wrap gap-1.5">
              {roleKeys.map((k) => (
                <Badge key={k} variant="secondary" className="text-[10px] font-normal">
                  {MUSICIAN_CATEGORY_LABELS[k] ?? k}
                </Badge>
              ))}
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground">
            <span className="text-muted-foreground/70">Instruments</span>{' '}
            {musician.instruments.join(', ')}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="text-muted-foreground/70">Genres</span> {musician.genres.join(', ')}
          </p>
          {meetupPreview ? (
            <p className="border-t border-border pt-2 text-[11px] leading-snug text-muted-foreground">
              Open for: {meetupPreview}
              {musician.openFor?.length > 3 ? '…' : ''}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  )
}
