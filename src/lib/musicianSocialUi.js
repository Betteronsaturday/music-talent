import {
  Camera,
  Disc3,
  Globe,
  Headphones,
  MessageCircle,
  Mic2,
  Podcast,
  Share2,
  Users,
  Video,
} from 'lucide-react'

/** @type {Record<string, { label: string, Icon: typeof Globe }>} */
export const PLATFORM_META = {
  website: { label: 'Website', Icon: Globe },
  linktree: { label: 'Linktree', Icon: Globe },
  instagram: { label: 'Instagram', Icon: Camera },
  threads: { label: 'Threads', Icon: Camera },
  youtube: { label: 'YouTube', Icon: Video },
  tiktok: { label: 'TikTok', Icon: Video },
  spotify: { label: 'Spotify', Icon: Headphones },
  apple_music: { label: 'Apple Music', Icon: Headphones },
  soundcloud: { label: 'SoundCloud', Icon: Mic2 },
  bandcamp: { label: 'Bandcamp', Icon: Disc3 },
  twitter: { label: 'X / Twitter', Icon: Share2 },
  x: { label: 'X', Icon: Share2 },
  facebook: { label: 'Facebook', Icon: Users },
  linkedin: { label: 'LinkedIn', Icon: Users },
  discord: { label: 'Discord', Icon: MessageCircle },
  twitch: { label: 'Twitch', Icon: Podcast },
}

/**
 * @param {{ platform?: string, url: string, label?: string }} entry
 */
export function resolveSocialLink(entry) {
  const key = (entry.platform || 'website').toLowerCase()
  const meta = PLATFORM_META[key] || { label: entry.label || 'Link', Icon: Globe }
  return {
    key,
    href: entry.url,
    label: entry.label || meta.label,
    Icon: meta.Icon,
  }
}

/**
 * @param {{ socialLinks?: { platform?: string, url: string, label?: string }[], links?: { label: string, url: string }[] }} musician
 */
export function getMusicianSocialEntries(musician) {
  if (musician.socialLinks?.length) {
    return musician.socialLinks.map((e) => resolveSocialLink(e))
  }
  return (musician.links || []).map((l) =>
    resolveSocialLink({ platform: guessPlatformFromLabel(l.label), url: l.url, label: l.label })
  )
}

function guessPlatformFromLabel(label) {
  const s = String(label).toLowerCase()
  if (s.includes('instagram')) return 'instagram'
  if (s.includes('youtube')) return 'youtube'
  if (s.includes('spotify')) return 'spotify'
  if (s.includes('soundcloud')) return 'soundcloud'
  if (s.includes('bandcamp')) return 'bandcamp'
  if (s.includes('tiktok')) return 'tiktok'
  if (s.includes('linkedin')) return 'linkedin'
  if (s.includes('facebook')) return 'facebook'
  if (s.includes('twitter') || s === 'x') return 'twitter'
  if (s.includes('discord')) return 'discord'
  if (s.includes('twitch')) return 'twitch'
  if (s.includes('apple')) return 'apple_music'
  if (s.includes('linktree')) return 'linktree'
  return 'website'
}
