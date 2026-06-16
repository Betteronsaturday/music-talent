'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Search, Map as MapIcon, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mergeMeFromStorage, MOCK_MUSICIANS } from '@/data/musiciansMock'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const nav = [
  { href: '/musicians/map', label: 'Map', Icon: MapIcon },
  { href: '/musicians', label: 'Discover', Icon: Search },
  { href: '/musicians/collabs', label: 'Collabs', Icon: ClipboardList },
]

export default function MusicianShell({ children, title = 'Musician discovery' }) {
  const router = useRouter()
  const path = router.pathname
  const asPath = router.asPath.split('?')[0]

  const [me, setMe] = useState(() => MOCK_MUSICIANS.find((m) => m.id === 'you'))

  useEffect(() => {
    const refresh = () => {
      setMe(mergeMeFromStorage(MOCK_MUSICIANS).find((m) => m.id === 'you'))
    }
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('musician-proto-updated', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('musician-proto-updated', refresh)
    }
  }, [])

  const isActiveLink = (href) => {
    if (href === '/musicians') return path === '/musicians'
    return path === href.replace(/\/$/, '') || path === href
  }

  const onYouProfile = path === '/musicians/[id]' && asPath.startsWith('/musicians/you')
  const photoUrl = me?.photoUrl ?? ''
  const initials = (me?.displayName ?? 'You').replace(/\s*\([^)]*\)\s*/g, '').trim().slice(0, 2) || 'Yo'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-background text-foreground antialiased selection:bg-muted selection:text-foreground">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pb-24 pt-4 md:max-w-3xl md:px-6 md:pb-10 md:pt-6">
          <header className="mb-4 flex flex-col gap-3 border-b border-border pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Salento · demo build
                </p>
                <h1 className="text-lg font-semibold tracking-tight md:text-xl">Musician discovery</h1>
                <p className="text-sm text-muted-foreground">
                  Map · discover · collabs · stories
                </p>
              </div>
              <div className="flex shrink-0 items-start pt-0.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        onYouProfile && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                      )}
                      aria-label="Your account menu"
                    >
                      <Avatar className="size-10">
                        {photoUrl ? <AvatarImage src={photoUrl} alt="" /> : null}
                        <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-40">
                    <DropdownMenuItem asChild>
                      <Link href="/musicians/you">Bio</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/musicians/availability">Settings</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <nav
            className="mb-6 hidden flex-wrap gap-1 rounded-2xl border border-border bg-card/80 p-1 md:flex"
            aria-label="Section"
          >
            {nav.map(({ href, label, Icon }) => {
              const active = isActiveLink(href)
              return (
                <Button
                  key={href}
                  variant={active ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-full"
                  asChild
                >
                  <Link href={href} className="inline-flex items-center gap-2">
                    <Icon className="size-5 shrink-0" aria-hidden />
                    {label}
                  </Link>
                </Button>
              )
            })}
          </nav>

          <main className="flex-1">{children}</main>
        </div>

        <nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
          aria-label="Primary"
        >
          <ul className="mx-auto flex max-w-lg justify-between gap-0.5 px-1 py-2">
            {nav.map(({ href, label, Icon }) => {
              const active = isActiveLink(href)
              return (
                <li key={href} className="min-w-0 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-auto w-full flex-col gap-0.5 py-1 text-[9px] font-medium leading-tight sm:text-[10px]',
                      active ? 'text-foreground' : 'text-muted-foreground'
                    )}
                    asChild
                  >
                    <Link href={href}>
                      <Icon className="mx-auto size-6 shrink-0" aria-hidden />
                      <span className="line-clamp-2 text-center">{label}</span>
                    </Link>
                  </Button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
