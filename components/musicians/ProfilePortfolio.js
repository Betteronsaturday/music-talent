'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ExternalLink, MessageCircle, Heart, Megaphone, Share2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { getPortfolioFor, PORTFOLIO_SECTIONS } from '@/data/profilePortfolioMock'
import { isLiked, toggleLike, appendPitch } from '@/data/profileEngagement'
import { getPortfolioEmbed } from '@/lib/portfolioEmbeds'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

function sectionLabel(key) {
  return PORTFOLIO_SECTIONS.find((s) => s.key === key)?.label ?? key
}

function openLinkLabel(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host.includes('youtube.com') || host === 'youtu.be' || host === 'm.youtube.com') return 'Open on YouTube'
    if (host.includes('spotify.com')) return 'Open on Spotify'
    if (host.includes('soundcloud.com')) return 'Open on SoundCloud'
    if (host.includes('instagram.com')) return 'Open on Instagram'
    if (host.includes('tiktok.com')) return 'Open on TikTok'
    if (host.includes('drive.google.com')) return 'Open in Drive'
    return 'Open link'
  } catch {
    return 'Open link'
  }
}

export default function ProfilePortfolio({ musician, viewerIsOwner }) {
  const router = useRouter()
  const portfolio = useMemo(() => getPortfolioFor(musician.id), [musician.id])
  const [likesTick, setLikesTick] = useState(0)
  const [pitchOpen, setPitchOpen] = useState(false)
  const [pitchItem, setPitchItem] = useState(null)
  const [pitchSection, setPitchSection] = useState('')
  const [pitchBody, setPitchBody] = useState('')

  const refreshLikes = useCallback(() => setLikesTick((n) => n + 1), [])
  useEffect(() => {
    const on = () => refreshLikes()
    window.addEventListener('musician-proto-portfolio-engagement', on)
    return () => window.removeEventListener('musician-proto-portfolio-engagement', on)
  }, [refreshLikes])

  const liked = useCallback(
    (itemId) => {
      void likesTick
      return isLiked(musician.id, itemId)
    },
    [likesTick, musician.id]
  )

  const onLike = (itemId) => {
    if (viewerIsOwner) {
      toast.message('Likes from others would show here in a real app.')
      return
    }
    const now = toggleLike(musician.id, itemId)
    refreshLikes()
    toast(now ? 'Saved to your likes (local).' : 'Removed from likes.')
  }

  const onShare = async (item) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const url =
      item.url && /^https?:\/\//i.test(item.url)
        ? item.url
        : `${origin}/musicians/${musician.id}#portfolio-${item.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied — paste it in DMs or social posts.')
    } catch {
      toast.message(url)
    }
  }

  const openPitch = (section, item) => {
    setPitchSection(section)
    setPitchItem(item)
    setPitchBody('')
    setPitchOpen(true)
  }

  const submitPitch = () => {
    if (!pitchItem) return
    const body = pitchBody.trim()
    if (!body) {
      toast.error('Write a short pitch first.')
      return
    }
    appendPitch({
      musicianId: musician.id,
      itemId: pitchItem.id,
      section: pitchSection,
      body,
    })
    setPitchOpen(false)
    setPitchItem(null)
    toast.success('Pitch saved locally (mock).')
  }

  const goToProfileLinks = () => {
    const path = `/musicians/${musician.id}`
    if (router.pathname === '/musicians/[id]' && router.query.id === musician.id) {
      document.getElementById('profile-links')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      router.push(`${path}#profile-links`)
    }
  }

  const openReachOut = (section, item) => {
    if (viewerIsOwner) return
    goToProfileLinks()
    toast.message(
      `In-app messaging is not in this version. Use Social & streaming for “${item.title}” (${sectionLabel(section)}).`
    )
  }

  const requestConnection = () => {
    if (viewerIsOwner) return
    goToProfileLinks()
    toast.success('Use their profile links to connect — messaging is planned for a later version.')
  }

  const totalItems = PORTFOLIO_SECTIONS.reduce(
    (n, s) => n + (portfolio[s.key]?.length ?? 0),
    0
  )

  if (totalItems === 0) {
    return (
      <Card id="profile-portfolio" aria-labelledby="portfolio-heading">
        <CardHeader>
          <CardTitle id="portfolio-heading" className="text-sm">
            Shared work
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            No external links on this profile yet (mock).
          </p>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card id="profile-portfolio" aria-labelledby="portfolio-heading">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle id="portfolio-heading" className="text-sm">
              Shared work
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              External links only — when the URL is YouTube, Spotify, or SoundCloud, a small embed preview appears
              here. Open the link in a new tab for the full player, comments, and account context.
            </p>
          </div>
          {!viewerIsOwner ? (
            <Button
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15"
              onClick={requestConnection}
            >
              <UserPlus className="size-4" />
              Ask to connect
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">Others can use the actions below on your links.</p>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {PORTFOLIO_SECTIONS.map(({ key, label }) => {
            const items = portfolio[key] ?? []
            if (!items.length) return null
            return (
              <div key={key}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </h3>
                <ul className="mt-3 space-y-4">
                  {items.map((item) => {
                    const embed = item.url ? getPortfolioEmbed(item.url) : null
                    const isSoundcloud = embed?.type === 'soundcloud'
                    return (
                      <li key={item.id} id={`portfolio-${item.id}`} className="rounded-xl border border-border bg-card/40">
                        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="font-semibold leading-snug">{item.title}</p>
                            {item.subtitle ? (
                              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                            ) : null}
                            {item.meta ? <p className="text-xs text-muted-foreground">{item.meta}</p> : null}
                            {item.url ? (
                              <p className="truncate text-[11px] text-muted-foreground/80" title={item.url}>
                                {item.url}
                              </p>
                            ) : null}
                            {item.collabId ? (
                              <Button variant="link" className="mt-1 h-auto p-0 text-xs" asChild>
                                <Link href="/musicians/collabs" className="inline-flex items-center gap-1">
                                  View collab board
                                  <ExternalLink className="size-3.5" />
                                </Link>
                              </Button>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">
                            <Button variant="default" size="sm" className="gap-1.5" asChild>
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                {openLinkLabel(item.url)}
                                <ExternalLink className="size-3.5" />
                              </a>
                            </Button>
                          </div>
                        </div>

                        {embed ? (
                          <div className="border-t border-border px-4 pb-4 pt-3">
                            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              Preview (embedded)
                            </p>
                            <div
                              className={cn(
                                'relative w-full overflow-hidden rounded-lg bg-black ring-1 ring-border',
                                isSoundcloud ? 'min-h-[166px]' : 'aspect-video'
                              )}
                            >
                              <iframe
                                src={embed.src}
                                title={item.title}
                                className="absolute inset-0 h-full w-full border-0"
                                loading="lazy"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                              />
                            </div>
                            <p className="mt-2 text-[10px] text-muted-foreground">
                              For the full player, controls, and comments, use “{openLinkLabel(item.url)}”.
                            </p>
                          </div>
                        ) : item.url ? (
                          <div className="border-t border-border px-4 pb-4 pt-3">
                            <p className="text-xs text-muted-foreground">
                              No inline preview for this host — open the link above to view on the original platform.
                            </p>
                          </div>
                        ) : null}

                        <div className="flex flex-wrap gap-2 border-t border-border p-4">
                          <Button
                            type="button"
                            variant={liked(item.id) ? 'secondary' : 'outline'}
                            size="sm"
                            className={cn(
                              liked(item.id) &&
                                'border-rose-500/50 bg-rose-500/10 text-rose-100 hover:bg-rose-500/15'
                            )}
                            aria-pressed={liked(item.id)}
                            onClick={() => onLike(item.id)}
                          >
                            <Heart
                              className={cn('size-4', liked(item.id) && 'fill-rose-400 text-rose-400')}
                            />
                            Like
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={viewerIsOwner}
                            onClick={() => openPitch(key, item)}
                          >
                            <Megaphone className="size-4" />
                            Pitch
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => onShare(item)}>
                            <Share2 className="size-4" />
                            Share
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={viewerIsOwner}
                            onClick={() => openReachOut(key, item)}
                          >
                            <MessageCircle className="size-4" />
                            Reach out
                          </Button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Dialog
        open={pitchOpen}
        onOpenChange={(open) => {
          setPitchOpen(open)
          if (!open) {
            setPitchItem(null)
            setPitchBody('')
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {pitchItem ? (
            <>
              <DialogHeader>
                <DialogTitle>Pitch “{pitchItem.title}”</DialogTitle>
                <DialogDescription>
                  Saved locally in this browser only (mock). In-app messaging is not part of this prototype yet.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={pitchBody}
                onChange={(e) => setPitchBody(e.target.value)}
                rows={4}
                placeholder="Why this piece fits your project, timeline, links…"
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="ghost" onClick={() => setPitchOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={submitPitch}>
                  Send pitch
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
