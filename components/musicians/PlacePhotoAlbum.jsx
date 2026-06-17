'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

/**
 * Horizontal photo strip + lightbox for place listings.
 * @param {{ photos: { id: string, url: string, caption?: string }[], placeName: string }} props
 */
export default function PlacePhotoAlbum({ photos, placeName }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (!photos?.length) return null

  const current = photos[index] ?? photos[0]

  const openAt = (i) => {
    setIndex(i)
    setOpen(true)
  }

  const step = (delta) => {
    setIndex((i) => (i + delta + photos.length) % photos.length)
  }

  return (
    <>
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <Images className="size-3.5" aria-hidden />
          Photo album ({photos.length})
        </p>
        <ul className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {photos.map((photo, i) => (
            <li key={photo.id} className="shrink-0">
              <button
                type="button"
                onClick={() => openAt(i)}
                className={cn(
                  'relative block h-20 w-28 overflow-hidden rounded-lg ring-1 ring-border',
                  'transition hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || `${placeName} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setIndex(0)
        }}
      >
        <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="space-y-1 border-b border-border px-4 py-3 text-left">
            <DialogTitle className="text-base">{placeName}</DialogTitle>
            <DialogDescription>
              {current.caption || `Photo ${index + 1} of ${photos.length}`}
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-[4/3] w-full bg-muted">
            <Image
              key={current.id}
              src={current.url}
              alt={current.caption || placeName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            {photos.length > 1 ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 shadow"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 shadow"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </>
            ) : null}
          </div>
          {photos.length > 1 ? (
            <p className="px-4 py-2 text-center text-xs text-muted-foreground">
              {index + 1} / {photos.length}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
