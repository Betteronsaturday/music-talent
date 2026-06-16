/**
 * Mock portfolio: external links only (no hosted images).
 * Optional in-page embed preview for YouTube, Spotify, and SoundCloud — always open full content on the provider.
 */

/** @typedef {{ id: string, title: string, subtitle?: string, url: string, meta?: string, collabId?: string }} PortfolioItem */

const YT = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
const YT2 = 'https://www.youtube.com/watch?v=9bZkp7q19f0'
const SP = 'https://open.spotify.com/track/3gWrHmAZ17Y8CgJIJAdi71'
const SP2 = 'https://open.spotify.com/track/11dFghVXANMlKmPdg66JZz'
const SC = 'https://soundcloud.com/soundcloud/shine'
const IG = 'https://www.instagram.com/reel/C0ExampleMockLink/'
const TT = 'https://www.tiktok.com/@example/video/1234567890'
const DRIVE = 'https://drive.google.com/drive/folders/0ExampleMockFolder'

/** @type {Record<string, { stories: PortfolioItem[], videos: PortfolioItem[], tracks: PortfolioItem[], collabs: PortfolioItem[] }>} */
const BY_MUSICIAN = {
  you: {
    stories: [
      {
        id: 'you-s1',
        title: 'Studio diary reel',
        subtitle: 'Behind the desk — IG Reel',
        url: IG,
        meta: '2d ago',
      },
      {
        id: 'you-s2',
        title: 'TikTok loop idea',
        subtitle: 'Short groove clip',
        url: TT,
        meta: '1w ago',
      },
    ],
    videos: [
      {
        id: 'you-v1',
        title: 'Live loop performance',
        subtitle: 'Reference take',
        url: YT2,
        meta: '4.2k views',
      },
    ],
    tracks: [
      {
        id: 'you-tr1',
        title: 'Neon Hallways (demo)',
        subtitle: 'Private SoundCloud',
        url: SC,
        meta: 'Unlisted',
      },
      {
        id: 'you-tr2',
        title: 'Glassline sketch',
        subtitle: 'Spotify demo',
        url: SP,
        meta: 'Streaming',
      },
    ],
    collabs: [
      {
        id: 'you-cf1',
        title: 'Remote hook swap',
        subtitle: 'Stems folder (read-only mock)',
        url: DRIVE,
        meta: 'With Maya Conti',
      },
    ],
  },
  '1': {
    stories: [{ id: '1-s1', title: 'Writing room POV', subtitle: 'Instagram', url: IG, meta: '12h ago' }],
    videos: [{ id: '1-v1', title: 'Vocal booth one-take', subtitle: 'YouTube', url: YT, meta: 'Session reel' }],
    tracks: [
      { id: '1-tr1', title: 'Sideways Sunday', subtitle: 'Spotify single', url: SP2, meta: '2025' },
      { id: '1-tr2', title: 'Blue light sketch', subtitle: 'SoundCloud', url: SC, meta: 'Draft' },
    ],
    collabs: [
      {
        id: '1-cf1',
        title: 'Co-writer for neo-soul hooks',
        subtitle: 'Open collab post',
        url: 'https://example.com/collab/neo-soul-hooks',
        meta: 'Seeking topline',
        collabId: 'c2',
      },
    ],
  },
  '2': {
    stories: [{ id: '2-s1', title: 'Pocket check', subtitle: 'TikTok', url: TT, meta: '3d ago' }],
    videos: [{ id: '2-v1', title: 'Rehearsal room groove', subtitle: 'YouTube', url: YT2, meta: 'Loop' }],
    tracks: [{ id: '2-tr1', title: 'Metro pocket stems', subtitle: 'SoundCloud pack', url: SC, meta: 'Download' }],
    collabs: [
      {
        id: '2-cf1',
        title: 'Live drummer for 5-song EP',
        subtitle: 'Drive references',
        url: DRIVE,
        meta: 'Completed',
        collabId: 'c1',
      },
    ],
  },
  '3': {
    stories: [{ id: '3-s1', title: 'Melodic bass walk', subtitle: 'Instagram', url: IG, meta: '5d ago' }],
    videos: [{ id: '3-v1', title: 'Session comping bass', subtitle: 'YouTube', url: YT, meta: 'Studio' }],
    tracks: [{ id: '3-tr1', title: 'Rooftop sway', subtitle: 'Spotify', url: SP, meta: 'Bandcamp alt in bio' }],
    collabs: [
      {
        id: '3-cf1',
        title: 'Live drummer for 5-song EP',
        subtitle: 'Project folder',
        url: DRIVE,
        meta: 'Active',
        collabId: 'c1',
      },
    ],
  },
  '4': {
    stories: [
      { id: '4-s1', title: 'Pedal walkthrough', subtitle: 'Instagram', url: IG, meta: '4d ago' },
      { id: '4-s2', title: 'Green room POV', subtitle: 'TikTok', url: TT, meta: '2w ago' },
    ],
    videos: [{ id: '4-v1', title: 'Pedalboard tour', subtitle: 'YouTube', url: YT2, meta: 'Gear' }],
    tracks: [{ id: '4-tr1', title: 'Satellite reverb test', subtitle: 'SoundCloud demo', url: SC, meta: 'Demo' }],
    collabs: [
      {
        id: '4-cf1',
        title: 'Ambient score for short film',
        subtitle: 'Shared stems',
        url: DRIVE,
        meta: 'Seeking mix notes',
      },
    ],
  },
  '5': {
    stories: [{ id: '5-s1', title: 'Big band chart read', subtitle: 'Instagram', url: IG, meta: '1d ago' }],
    videos: [{ id: '5-v1', title: 'Solo break (live)', subtitle: 'YouTube', url: YT, meta: 'Live' }],
    tracks: [{ id: '5-tr1', title: 'Blue note étude', subtitle: 'Spotify', url: SP2, meta: 'Study track' }],
    collabs: [
      {
        id: '5-cf1',
        title: 'Brass section for one session',
        subtitle: 'Charts PDF',
        url: DRIVE,
        meta: 'Active',
        collabId: 'c3',
      },
    ],
  },
}

const EMPTY = { stories: [], videos: [], tracks: [], collabs: [] }

export function getPortfolioFor(musicianId) {
  return BY_MUSICIAN[musicianId] ?? EMPTY
}

export const PORTFOLIO_SECTIONS = [
  { key: 'stories', label: 'Stories' },
  { key: 'videos', label: 'Videos' },
  { key: 'tracks', label: 'Music tracks' },
  { key: 'collabs', label: 'Collaborations' },
]
