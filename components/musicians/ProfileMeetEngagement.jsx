'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, Mail, MessageSquareText } from 'lucide-react'
import { toast } from 'sonner'
import AvailabilityBadge from './AvailabilityBadge'
import { AVAILABILITY_LABELS } from '@/data/musiciansMock'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const REMINDER_PREFS_KEY = 'musician-proto-reminder-prefs'

function defaultMeetThreadMock() {
  return {
    fromName: 'Salento Scene',
    excerpt:
      'Prototype thread — the latest in-app message would land here. Your availability stays pinned in the header so nobody has to ask “are you free?” twice.',
    proposals: [
      { id: 'demo1', label: 'Thu 20:00 · Rehearsal room (mock slot)' },
      { id: 'demo2', label: 'Sat 18:00 · Remote listen-back (mock slot)' },
    ],
  }
}

function readReminderPrefs() {
  if (typeof window === 'undefined') return { email: true, push: false }
  try {
    const raw = window.localStorage.getItem(REMINDER_PREFS_KEY)
    if (!raw) return { email: true, push: false }
    const v = JSON.parse(raw)
    return {
      email: Boolean(v.email),
      push: Boolean(v.push),
    }
  } catch {
    return { email: true, push: false }
  }
}

function writeReminderPrefs(next) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(REMINDER_PREFS_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

/**
 * In-profile engagement: reach-out email, thread-style availability, slot proposals, reminder prefs (mock).
 * @param {{ musician: Record<string, unknown>, viewerIsOwner: boolean }} props
 */
export default function ProfileMeetEngagement({ musician, viewerIsOwner }) {
  const contactEmail = musician.contactEmail
  const caption = musician.availabilityCaption
  const thread = useMemo(() => musician.meetThreadMock ?? defaultMeetThreadMock(), [musician.meetThreadMock])

  const [proposalOutcome, setProposalOutcome] = useState(null)
  const [counterNote, setCounterNote] = useState('')
  const [showCounter, setShowCounter] = useState(false)
  const [reminders, setReminders] = useState({ email: true, push: false })

  useEffect(() => {
    setProposalOutcome(null)
    setCounterNote('')
    setShowCounter(false)
  }, [musician.id])

  useEffect(() => {
    if (viewerIsOwner && musician.id === 'you') {
      setReminders(readReminderPrefs())
    }
  }, [viewerIsOwner, musician.id])

  const persistReminders = (next) => {
    setReminders(next)
    if (viewerIsOwner && musician.id === 'you') {
      writeReminderPrefs(next)
      toast.success('Reminder preferences saved in this browser (mock).')
    }
  }

  const onConfirm = () => {
    setProposalOutcome('confirmed')
    setShowCounter(false)
    toast.success('Slot confirmed (prototype — no backend).')
  }

  const onDecline = () => {
    setProposalOutcome('declined')
    setShowCounter(false)
    toast.message('Declined — thread would update for everyone (mock).')
  }

  const onCounter = () => {
    if (!showCounter) {
      setShowCounter(true)
      return
    }
    if (!counterNote.trim()) {
      toast.error('Add a short counter-proposal (even “Sun after 6”).')
      return
    }
    setProposalOutcome('countered')
    toast.success('Counter sent (prototype).')
  }

  const isYouProfile = musician.id === 'you'
  const canEditReminders = viewerIsOwner && isYouProfile

  return (
    <div className="space-y-6" aria-labelledby="meet-engagement-heading">
      <h2 id="meet-engagement-heading" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Meet & stay in the app
      </h2>
      <p className="text-xs text-muted-foreground">
        Lightweight engagement layer — no feed, no hosted audio. Fictional emails use <span className="font-mono">example.com</span>.
      </p>

      <Card className="border border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-muted-foreground" aria-hidden />
            <CardTitle className="text-sm font-semibold">Reach-out email</CardTitle>
          </div>
          <CardDescription>
            A verified inbox (not implemented here) reduces spam vs posting a raw address on Instagram.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {contactEmail ? (
            <>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 font-normal" asChild>
                <a href={`mailto:${contactEmail}`}>
                  <span className="truncate">{contactEmail}</span>
                </a>
              </Button>
              <p className="text-[11px] text-muted-foreground">
                In production: hide until match, rate-limit reveals, or relay through the product.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No reach-out email on this mock profile.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4 text-muted-foreground" aria-hidden />
            <CardTitle className="text-sm font-semibold">In-thread availability</CardTitle>
          </div>
          <CardDescription>
            Status + plain-language windows travel with the conversation so scheduling stays contextual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-2">
              <AvailabilityBadge status={musician.availability} size="sm" />
              <Badge variant="outline" className="text-[10px] font-normal">
                {AVAILABILITY_LABELS[musician.availability] ?? musician.availability}
              </Badge>
            </div>
            {caption ? (
              <p className="pt-2 text-sm leading-relaxed text-foreground">{caption}</p>
            ) : (
              <p className="pt-2 text-sm text-muted-foreground">Add a short rhythm-of-life note on your profile (mock).</p>
            )}
          </div>

          <div className="rounded-lg border border-dashed border-border bg-card/40 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Thread preview</p>
            <p className="mt-2 text-xs font-medium text-foreground">{thread.fromName}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{thread.excerpt}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Time proposals</CardTitle>
          <CardDescription>
            Suggested slots with confirm / counter / decline — keeps negotiation inside the product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {thread.proposals.map((p) => (
              <li
                key={p.id}
                className={cn(
                  'rounded-md border border-border bg-muted/20 px-3 py-2 text-sm text-foreground',
                  proposalOutcome && 'opacity-60'
                )}
              >
                {p.label}
              </li>
            ))}
          </ul>

          {proposalOutcome ? (
            <p className="text-xs text-muted-foreground">
              Outcome:{' '}
              <span className="font-medium text-foreground">
                {proposalOutcome === 'confirmed' && 'Confirmed'}
                {proposalOutcome === 'declined' && 'Declined'}
                {proposalOutcome === 'countered' && 'Counter sent'}
              </span>
              {' · '}
              <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => setProposalOutcome(null)}>
                Reset demo
              </Button>
            </p>
          ) : null}

          {showCounter ? (
            <div className="space-y-2">
              <Textarea
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="Counter: suggest 1–2 windows that work for you…"
                rows={3}
                className="resize-none text-sm"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" disabled={Boolean(proposalOutcome)} onClick={onConfirm}>
              Confirm
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={Boolean(proposalOutcome)}
              onClick={onCounter}
            >
              {showCounter ? 'Send counter' : 'Counter'}
            </Button>
            <Button type="button" size="sm" variant="outline" disabled={Boolean(proposalOutcome)} onClick={onDecline}>
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" aria-hidden />
            <CardTitle className="text-sm font-semibold">Reminders</CardTitle>
          </div>
          <CardDescription>
            Pull people back to an outcome (reply due, proposal waiting) — not an endless notification feed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canEditReminders ? (
            <>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2 hover:bg-muted/40">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border border-input accent-primary"
                  checked={reminders.email}
                  onChange={(e) => persistReminders({ ...reminders, email: e.target.checked })}
                />
                <span>
                  <span className="text-sm font-medium text-foreground">Email nudges</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    “Jordan is waiting on a time proposal” style summaries (mock).
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2 hover:bg-muted/40">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border border-input accent-primary"
                  checked={reminders.push}
                  onChange={(e) => persistReminders({ ...reminders, push: e.target.checked })}
                />
                <span>
                  <span className="text-sm font-medium text-foreground">Push (browser / app)</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Short actionable pings when something needs a yes/no (mock).
                  </span>
                </span>
              </label>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {viewerIsOwner
                ? 'Reminder toggles appear when you view your own profile as “You (preview)”.'
                : `${musician.displayName} would choose email vs push in their settings — not editable on someone else’s profile (mock).`}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
