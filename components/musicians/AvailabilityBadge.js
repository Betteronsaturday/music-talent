import { AVAILABILITY, AVAILABILITY_LABELS } from '@/data/musiciansMock'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const STYLES = {
  [AVAILABILITY.OPEN_NOW]:
    'border-emerald-500/50 bg-emerald-500/15 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.25)]',
  [AVAILABILITY.OPEN_WEEK]:
    'border-amber-500/50 bg-amber-500/15 text-amber-50 shadow-[0_0_18px_rgba(251,191,36,0.18)]',
  [AVAILABILITY.NOT_AVAILABLE]: 'border-border bg-muted text-muted-foreground',
}

export default function AvailabilityBadge({ status, size = 'md' }) {
  const label = AVAILABILITY_LABELS[status] ?? status
  const sizeCls =
    size === 'lg'
      ? 'px-4 py-2 text-base font-semibold tracking-wide'
      : 'px-2.5 py-1 text-xs font-semibold uppercase tracking-wider'

  return (
    <Badge
      variant="outline"
      role="status"
      className={cn(
        'rounded-full border-2 font-semibold',
        sizeCls,
        STYLES[status] ?? STYLES[AVAILABILITY.NOT_AVAILABLE]
      )}
    >
      {label}
    </Badge>
  )
}
