/**
 * Optional iframe previews for portfolio URLs (opens full content on the provider in a new tab).
 * @returns {{ type: string, src: string } | null}
 */
export function getPortfolioEmbed(url) {
  if (!url || typeof url !== 'string') return null
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    const id = parsed.pathname.replace(/^\//, '').split('/')[0]
    if (id) return { type: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` }
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    const v = parsed.searchParams.get('v')
    if (v) return { type: 'youtube', src: `https://www.youtube-nocookie.com/embed/${v}` }
    const m = parsed.pathname.match(/\/embed\/([^/]+)/)
    if (m?.[1]) return { type: 'youtube', src: `https://www.youtube-nocookie.com/embed/${m[1]}` }
    const s = parsed.pathname.match(/\/shorts\/([^/]+)/)
    if (s?.[1]) return { type: 'youtube', src: `https://www.youtube-nocookie.com/embed/${s[1]}` }
  }

  if (host === 'open.spotify.com' || host === 'spotify.com') {
    const path = parsed.pathname.replace(/^\/+|\/+$/g, '')
    const m = path.match(/^(intl-[a-z]{2}\/)?(track|album|playlist|episode)\/([^/?]+)/i)
    if (m) {
      const kind = m[2].toLowerCase()
      const id = m[3]
      return { type: 'spotify', src: `https://open.spotify.com/embed/${kind}/${id}?utm_source=generator` }
    }
  }

  if (host.endsWith('soundcloud.com')) {
    const enc = encodeURIComponent(url)
    return {
      type: 'soundcloud',
      src: `https://w.soundcloud.com/player/?url=${enc}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false`,
    }
  }

  return null
}
