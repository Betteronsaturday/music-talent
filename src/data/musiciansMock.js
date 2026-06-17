/**
 * Demo musician dataset (no backend).
 */

export const AVAILABILITY = {
  OPEN_NOW: 'open_now',
  OPEN_WEEK: 'open_week',
  NOT_AVAILABLE: 'not_available',
}

export const AVAILABILITY_LABELS = {
  [AVAILABILITY.OPEN_NOW]: 'Open now',
  [AVAILABILITY.OPEN_WEEK]: 'Open this week',
  [AVAILABILITY.NOT_AVAILABLE]: 'Not available',
}

export const MEETUP_TYPES = {
  JAM: 'jam',
  GIG: 'gig',
  RECORDING: 'recording',
  SONGWRITING: 'songwriting',
  TEACHING: 'teaching',
}

export const MEETUP_LABELS = {
  [MEETUP_TYPES.JAM]: 'Friendly jam',
  [MEETUP_TYPES.GIG]: 'Paid gig',
  [MEETUP_TYPES.RECORDING]: 'Recording',
  [MEETUP_TYPES.SONGWRITING]: 'Songwriting',
  [MEETUP_TYPES.TEACHING]: 'Teaching',
}

export const EXPERIENCE_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  pro: 'Professional',
}

/** Stable order for filters (keys of EXPERIENCE_LABELS). */
export const EXPERIENCE_ORDER = ['beginner', 'intermediate', 'advanced', 'pro']

/** Filterable profile roles (each musician has one or more). */
export const MUSICIAN_CATEGORY_ORDER = ['live', 'producer', 'session', 'teacher']

export const MUSICIAN_CATEGORY_LABELS = {
  live: 'Live performer',
  producer: 'Producer / beatmaker',
  session: 'Session musician',
  teacher: 'Teacher',
}

/**
 * Parse `r:role`, `x:exp`, or `r:role|x:exp` tokens used by the role & experience filter.
 * @param {string} [token]
 * @returns {{ role: string | null, exp: string | null }}
 */
export function parseRoleExperienceToken(token) {
  let role = null
  let exp = null
  if (!token || typeof token !== 'string') return { role, exp }
  for (const part of token.split('|')) {
    if (part.startsWith('r:')) role = part.slice(2)
    else if (part.startsWith('x:')) exp = part.slice(2)
  }
  return { role, exp }
}

/** Human-readable summary for the filter trigger. */
export function formatRoleExperienceFilterSummary(token) {
  if (!token) return 'Any'
  const { role, exp } = parseRoleExperienceToken(token)
  if (role && exp) return `${MUSICIAN_CATEGORY_LABELS[role] ?? role} · ${EXPERIENCE_LABELS[exp] ?? exp}`
  if (role) return `${MUSICIAN_CATEGORY_LABELS[role] ?? role} · any level`
  if (exp) return `${EXPERIENCE_LABELS[exp] ?? exp} · any role`
  return 'Any'
}

/**
 * @param {{ categories?: string[], experience?: string }} m
 * @param {string} token from role & experience filter (`r:`, `x:`, or combined)
 */
export function matchesRoleExperienceFilter(m, token) {
  if (!token) return true
  const { role, exp } = parseRoleExperienceToken(token)
  if (role && !(m.categories ?? []).includes(role)) return false
  if (exp && m.experience !== exp) return false
  return true
}

const U = 'https://example.com'

export const MOCK_MUSICIANS = [
  {
    id: 'you',
    categories: ['producer', 'session', 'live'],
    displayName: 'You (preview)',
    photoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    headline: 'Keys / electronic · session-friendly · building neo-soul sketches into releases.',
    bio: 'Placeholder bio — describe your sound, influences, and what you are looking for in a few lines. Think of this as your LinkedIn summary: who you are musically, what you care about, and the kinds of people you want to meet.',
    instruments: ['Keys', 'Synth', 'Programmer'],
    genres: ['Electronic', 'Neo-soul'],
    experience: 'intermediate',
    area: 'Centro storico · 1 km',
    city: 'Lecce',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Independent artist & collaborator',
        organization: 'Self / various artists',
        period: '2019 — present',
        location: 'Lecce',
        description:
          'Writing toplines, keys layers, and arrangement ideas for remote sessions. Comfortable with stems, click, and async feedback.',
      },
      {
        title: 'Studio assistant (weekend)',
        organization: 'North Echo Studio',
        period: '2021 — 2023',
        location: 'Lecce',
        description: 'Patching sessions, basic gain staging, and helping vocalists find headphone mixes.',
      },
    ],
    studies: [
      {
        school: 'Community music program',
        credential: 'Certificate',
        field: 'Electronic production & ear training',
        period: '2018',
      },
      {
        school: 'Self-directed study',
        credential: 'Ongoing',
        field: 'Harmony, sound design, and groove programming',
        period: '2017 — present',
      },
    ],
    socialLinks: [
      { platform: 'instagram', url: `${U}/you/instagram` },
      { platform: 'tiktok', url: `${U}/you/tiktok` },
      { platform: 'youtube', url: `${U}/you/youtube` },
      { platform: 'spotify', url: `${U}/you/spotify` },
      { platform: 'apple_music', url: `${U}/you/apple-music` },
      { platform: 'soundcloud', url: `${U}/you/soundcloud` },
      { platform: 'bandcamp', url: `${U}/you/bandcamp` },
      { platform: 'twitter', url: `${U}/you/x` },
      { platform: 'linkedin', url: `${U}/you/linkedin` },
      { platform: 'facebook', url: `${U}/you/facebook` },
      { platform: 'discord', url: `${U}/you/discord` },
      { platform: 'twitch', url: `${U}/you/twitch` },
      { platform: 'linktree', url: `${U}/you/links` },
      { platform: 'website', url: `${U}/you/site`, label: 'Personal site' },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.JAM, MEETUP_TYPES.RECORDING],
    contactEmail: 'you.salento@example.com',
    availabilityCaption: 'Evenings only · Mon–Thu after 19:00 · weekends flexible until late.',
    meetThreadMock: {
      fromName: 'Jordan Okonkwo',
      excerpt:
        'Hey — loved your neo-soul sketches. Could you make Thursday or Saturday rehearsal? I’ll bring the rhythm section.',
      proposals: [
        { id: 'p1', label: 'Thu 20:00 · North Echo Studio (Lecce)' },
        { id: 'p2', label: 'Sat 18:30 · Same room, longer slot' },
      ],
    },
  },
  {
    id: '1',
    categories: ['session', 'live', 'teacher'],
    displayName: 'Maya Conti',
    photoUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
    headline: 'Session vocalist & writer · indie / R&B hooks and harmonies.',
    bio: 'Session vocalist and writer. Harmonies, hooks, and late-night ideas. I like fast turnarounds, clear references, and kind collaborators.',
    instruments: ['Vocals', 'Acoustic guitar', 'BGVs'],
    genres: ['Indie', 'R&B'],
    experience: 'advanced',
    area: 'Centro storico · 800 m',
    city: 'Galatina',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Featured vocalist',
        organization: 'Various indie releases',
        period: '2020 — present',
        location: 'Galatina · remote',
        description: 'Toplines, doubles, and ad-lib passes delivered as dry + processed stems.',
      },
      {
        title: 'Vocal coach (small groups)',
        organization: 'Independent',
        period: '2018 — present',
        location: 'Galatina',
        description: 'Breath support, phrasing, and studio etiquette for first-time recording artists.',
      },
    ],
    studies: [
      {
        school: 'Contemporary vocal program',
        credential: 'Diploma',
        field: 'Commercial voice & performance',
        period: '2016 — 2018',
      },
    ],
    socialLinks: [
      { platform: 'instagram', url: `${U}/maya/instagram` },
      { platform: 'youtube', url: `${U}/maya/youtube` },
      { platform: 'spotify', url: `${U}/maya/spotify` },
      { platform: 'apple_music', url: `${U}/maya/apple-music` },
      { platform: 'soundcloud', url: `${U}/maya/soundcloud` },
      { platform: 'bandcamp', url: `${U}/maya/bandcamp` },
      { platform: 'tiktok', url: `${U}/maya/tiktok` },
      { platform: 'twitter', url: `${U}/maya/x` },
      { platform: 'linkedin', url: `${U}/maya/linkedin` },
      { platform: 'website', url: `${U}/maya`, label: 'Press kit' },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.JAM, MEETUP_TYPES.SONGWRITING, MEETUP_TYPES.GIG],
    contactEmail: 'maya.conti.music@example.com',
    availabilityCaption: 'Open this week · weekday afternoons for remote writing.',
    meetThreadMock: {
      fromName: 'You (preview)',
      excerpt: 'Can we lock Sunday morning vocals? I’m bringing scratch lyrics and a rough chord sheet.',
      proposals: [
        { id: 'm1', label: 'Sun 10:00 · Home studio (Galatina) — quiet street' },
        { id: 'm2', label: 'Mon 16:00 · Zoom stems pass' },
      ],
    },
  },
  {
    id: '2',
    categories: ['live', 'session', 'teacher'],
    displayName: 'Jordan Okonkwo',
    photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    headline: 'Drummer · pocket-first grooves · rehearsal room with kit.',
    bio: 'Drummer for pocket-first grooves. Rehearsal space with kit. I read charts, learn by ear, and keep time relaxed.',
    instruments: ['Drums', 'Percussion', 'Cajón'],
    genres: ['Jazz', 'Hip-hop', 'Funk'],
    experience: 'pro',
    area: 'Borgo marinaro · 2 km',
    city: 'Gallipoli',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'House band drummer',
        organization: 'Blue Line Jazz Lounge',
        period: '2017 — present',
        location: 'Gallipoli',
        description: 'Four nights / month — standards, neo-soul, and guest artist sets.',
      },
      {
        title: 'Touring fill-in',
        organization: 'Independent artists',
        period: '2015 — present',
        location: 'Salento coast',
        description: 'Short runs with click + tracks; comfortable with in-ears.',
      },
    ],
    studies: [
      {
        school: 'Percussion institute (private track)',
        credential: 'Certificate',
        field: 'Jazz coordination & brush technique',
        period: '2014 — 2015',
      },
    ],
    socialLinks: [
      { platform: 'youtube', url: `${U}/jordan/youtube` },
      { platform: 'instagram', url: `${U}/jordan/instagram` },
      { platform: 'tiktok', url: `${U}/jordan/tiktok` },
      { platform: 'spotify', url: `${U}/jordan/spotify` },
      { platform: 'soundcloud', url: `${U}/jordan/soundcloud` },
      { platform: 'twitter', url: `${U}/jordan/x` },
      { platform: 'website', url: `${U}/jordan`, label: 'Lessons & booking' },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_WEEK,
    openFor: [MEETUP_TYPES.JAM, MEETUP_TYPES.GIG, MEETUP_TYPES.TEACHING],
    contactEmail: 'jordan.okonkwo@example.com',
    availabilityCaption: 'Evenings only · after 18:00 · Sat daytime ok.',
  },
  {
    id: '3',
    categories: ['session', 'live'],
    displayName: 'Elena Ruiz',
    photoUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    headline: 'Bassist · melodic lines · upright & electric.',
    bio: 'Bassist · melodic lines, tight time. Looking for writers and producers. I love soul, Latin, and anything with space.',
    instruments: ['Electric bass', 'Upright'],
    genres: ['Soul', 'Latin'],
    experience: 'advanced',
    area: 'Lungomare · 3 km',
    city: 'Otranto',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Session bassist',
        organization: 'Remote & Salento studios',
        period: '2018 — present',
        location: 'Otranto',
        description: 'Reading changes, arranging intros, and locking with live drums or programmed kits.',
      },
    ],
    studies: [
      {
        school: 'Conservatorium (jazz performance)',
        credential: 'BMus (partial)',
        field: 'Double bass',
        period: '2014 — 2017',
      },
    ],
    socialLinks: [
      { platform: 'spotify', url: `${U}/elena/spotify` },
      { platform: 'instagram', url: `${U}/elena/instagram` },
      { platform: 'youtube', url: `${U}/elena/youtube` },
      { platform: 'bandcamp', url: `${U}/elena/bandcamp` },
      { platform: 'soundcloud', url: `${U}/elena/soundcloud` },
      { platform: 'linkedin', url: `${U}/elena/linkedin` },
      { platform: 'website', url: `${U}/elena`, label: 'Portfolio PDF' },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_WEEK,
    openFor: [MEETUP_TYPES.RECORDING, MEETUP_TYPES.SONGWRITING],
  },
  {
    id: '4',
    categories: ['session', 'live', 'producer'],
    displayName: 'Sam Rivera',
    photoUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=400&fit=crop',
    headline: 'Guitarist · ambient washes to crunchy riffs · home studio.',
    bio: 'Guitarist — ambient textures to crunchy riffs. Home studio with re-amp chain and a few nice mics.',
    instruments: ['Electric guitar', 'Pedal steel', 'Pedals'],
    genres: ['Rock', 'Shoegaze'],
    experience: 'intermediate',
    area: 'Centro · 5 km',
    city: 'Maglie',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Guitar overdubs (remote)',
        organization: 'Independent producers',
        period: '2021 — present',
        location: 'Maglie · remote',
        description: 'Stereo ambient beds, noise textures, and doubled rhythm parts.',
      },
    ],
    studies: [
      {
        school: 'Online production cohort',
        credential: 'Coursework',
        field: 'Sound design & guitar processing',
        period: '2020',
      },
    ],
    socialLinks: [
      { platform: 'instagram', url: `${U}/sam/instagram` },
      { platform: 'youtube', url: `${U}/sam/youtube` },
      { platform: 'tiktok', url: `${U}/sam/tiktok` },
      { platform: 'bandcamp', url: `${U}/sam/bandcamp` },
      { platform: 'soundcloud', url: `${U}/sam/soundcloud` },
      { platform: 'spotify', url: `${U}/sam/spotify` },
      { platform: 'twitter', url: `${U}/sam/x` },
      { platform: 'discord', url: `${U}/sam/discord` },
      { platform: 'twitch', url: `${U}/sam/twitch` },
      { platform: 'website', url: `${U}/sam`, label: 'Gear list' },
    ],
    links: [],
    availability: AVAILABILITY.NOT_AVAILABLE,
    openFor: [MEETUP_TYPES.JAM],
  },
  {
    id: '5',
    categories: ['live', 'teacher', 'session'],
    displayName: 'Theo Park',
    photoUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
    headline: 'Woodwinds · charts or improv · big band & small group.',
    bio: 'Saxophone and woodwinds. Reading charts or improvising. Comfortable in section or as a featured voice.',
    instruments: ['Saxophone', 'Flute', 'Clarinet'],
    genres: ['Jazz', 'Classical'],
    experience: 'pro',
    area: 'Centro storico · 2 km',
    city: 'Nardò',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Big band section lead',
        organization: 'City Jazz Orchestra',
        period: '2014 — present',
        location: 'Nardò',
        description: 'Alto chair + occasional flute doubles on pops and concert programs.',
      },
      {
        title: 'Teaching studio',
        organization: 'Independent',
        period: '2012 — present',
        location: 'Nardò',
        description: 'Jazz improvisation and reading for teens and adults.',
      },
    ],
    studies: [
      {
        school: 'University of the Arts',
        credential: 'MMus',
        field: 'Jazz saxophone',
        period: '2010 — 2012',
      },
      {
        school: 'University of the Arts',
        credential: 'BMus',
        field: 'Classical clarinet',
        period: '2006 — 2010',
      },
    ],
    socialLinks: [
      { platform: 'youtube', url: `${U}/theo/youtube` },
      { platform: 'instagram', url: `${U}/theo/instagram` },
      { platform: 'spotify', url: `${U}/theo/spotify` },
      { platform: 'apple_music', url: `${U}/theo/apple-music` },
      { platform: 'soundcloud', url: `${U}/theo/soundcloud` },
      { platform: 'linkedin', url: `${U}/theo/linkedin` },
      { platform: 'facebook', url: `${U}/theo/facebook` },
      { platform: 'website', url: `${U}/theo`, label: 'Teaching site' },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.GIG, MEETUP_TYPES.TEACHING, MEETUP_TYPES.RECORDING],
  },
  {
    id: '6',
    categories: ['live'],
    displayName: 'Luca Venturi',
    photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    headline: 'Pizzica & taranta · tamburello & frame drums.',
    bio: 'Festival stages and piazze across Salento — pocket-first folk grooves.',
    instruments: ['Tamburello', 'Frame drums', 'Bendir'],
    genres: ['Folk', 'World'],
    experience: 'advanced',
    area: 'Centro · 1 km',
    city: 'Casarano',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Folk ensemble percussion',
        organization: 'Circuito estivo Salento',
        period: '2017 — present',
        location: 'Provincia di Lecce',
        description: 'Outdoor sets and processional lines with singers.',
      },
    ],
    studies: [],
    socialLinks: [
      { platform: 'instagram', url: `${U}/luca/instagram` },
      { platform: 'youtube', url: `${U}/luca/youtube` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.JAM, MEETUP_TYPES.GIG],
  },
  {
    id: '7',
    categories: ['live', 'session', 'teacher'],
    displayName: 'Chiara De Santis',
    photoUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    headline: 'Violin · chamber & wedding quartets.',
    bio: 'Classical training with a soft spot for film cues and intimate rooms.',
    instruments: ['Violin', 'Viola'],
    genres: ['Classical', 'Film score'],
    experience: 'advanced',
    area: 'Old town',
    city: 'Copertino',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Quartet first chair',
        organization: 'Ensemble Salento',
        period: '2016 — present',
        location: 'Copertino',
        description: 'Ceremonies, church acoustics, and small hall programmes.',
      },
    ],
    studies: [
      {
        school: 'Conservatorio (strings)',
        credential: 'Diploma',
        field: 'Violin performance',
        period: '2012 — 2016',
      },
    ],
    socialLinks: [
      { platform: 'instagram', url: `${U}/chiara/instagram` },
      { platform: 'spotify', url: `${U}/chiara/spotify` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_WEEK,
    openFor: [MEETUP_TYPES.GIG, MEETUP_TYPES.RECORDING],
  },
  {
    id: '8',
    categories: ['live', 'session'],
    displayName: 'Marco Pollio',
    photoUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop',
    bio: 'Song circles, cantine concerts, and stripped duo sets.',
    instruments: ['Mandolin', 'Chitarra battente', 'Vocals'],
    genres: ['Folk', 'Indie'],
    experience: 'intermediate',
    area: 'Campagna · 3 km',
    city: 'Veglie',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Duo residencies',
        organization: 'Self',
        period: '2019 — present',
        location: 'Veglie',
        description: 'Originals in dialect + Italian with loop-friendly arrangements.',
      },
    ],
    studies: [],
    socialLinks: [
      { platform: 'instagram', url: `${U}/marco/instagram` },
      { platform: 'youtube', url: `${U}/marco/youtube` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.JAM, MEETUP_TYPES.SONGWRITING],
  },
  {
    id: '9',
    categories: ['live', 'session'],
    displayName: 'Francesca Greco',
    photoUrl: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=400&h=400&fit=crop',
    headline: 'Soul vocalist · wedding band lead.',
    bio: 'Warm tone, tight harmonies, and bilingual sets (IT / EN).',
    instruments: ['Vocals', 'Keys'],
    genres: ['Soul', 'Pop'],
    experience: 'advanced',
    area: 'Centro',
    city: 'Ugento',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Lead vocalist',
        organization: 'SoulCoast band',
        period: '2018 — present',
        location: 'Ugento',
        description: 'Private events and festival slots along the Ionian coast.',
      },
    ],
    studies: [],
    socialLinks: [
      { platform: 'instagram', url: `${U}/francesca/instagram` },
      { platform: 'spotify', url: `${U}/francesca/spotify` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_WEEK,
    openFor: [MEETUP_TYPES.GIG, MEETUP_TYPES.RECORDING],
  },
  {
    id: '10',
    categories: ['live'],
    displayName: 'Antonio Presicce',
    photoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    headline: 'Organetto & fisarmonica · liscio & ballo.',
    bio: 'Dance halls and sagre — quick setups and clear stage plots.',
    instruments: ['Accordion', 'Organetto'],
    genres: ['Folk', 'Latin'],
    experience: 'pro',
    area: 'Centro storico',
    city: 'Tricase',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Dance orchestra',
        organization: 'Orchestra Presicce',
        period: '2009 — present',
        location: 'Tricase',
        description: 'Traditional sets with caller-friendly dynamics.',
      },
    ],
    studies: [],
    socialLinks: [
      { platform: 'facebook', url: `${U}/antonio/facebook` },
      { platform: 'youtube', url: `${U}/antonio/youtube` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.GIG, MEETUP_TYPES.TEACHING],
  },
  {
    id: '11',
    categories: ['live', 'session', 'teacher'],
    displayName: 'Valentina Leo',
    photoUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop',
    headline: 'Pianist · jazz trio & solo lounge.',
    bio: 'Standards, Italian songbook, and quiet hotel residencies.',
    instruments: ['Piano', 'Rhodes'],
    genres: ['Jazz', 'Bossa nova'],
    experience: 'advanced',
    area: 'Rione Terra',
    city: 'Specchia',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Trio residency',
        organization: 'Hotel lounge circuit',
        period: '2015 — present',
        location: 'Specchia',
        description: 'Weekend trio with upright and brushed drums.',
      },
    ],
    studies: [
      {
        school: 'Private jazz harmony',
        credential: 'Ongoing',
        field: 'Voicings & repertoire',
        period: '2014 — present',
      },
    ],
    socialLinks: [
      { platform: 'instagram', url: `${U}/valentina/instagram` },
      { platform: 'soundcloud', url: `${U}/valentina/soundcloud` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.JAM, MEETUP_TYPES.GIG],
  },
  {
    id: '12',
    categories: ['live'],
    displayName: 'Domenico Surdo',
    photoUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
    headline: 'Tromba · brass section & fanfare.',
    bio: 'Marching intros, brass pads for pop, and brass quintet charts.',
    instruments: ['Trumpet', 'Flugelhorn'],
    genres: ['Jazz', 'Pop'],
    experience: 'pro',
    area: 'Periferia · 2 km',
    city: 'Leverano',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Section trumpet',
        organization: 'Salento Brass',
        period: '2011 — present',
        location: 'Leverano',
        description: 'Corporate events and outdoor civic concerts.',
      },
    ],
    studies: [],
    socialLinks: [
      { platform: 'youtube', url: `${U}/domenico/youtube` },
      { platform: 'instagram', url: `${U}/domenico/instagram` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_WEEK,
    openFor: [MEETUP_TYPES.GIG, MEETUP_TYPES.RECORDING],
  },
  {
    id: '13',
    categories: ['session'],
    displayName: 'Serena Maglie',
    photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    headline: 'Cellist · strings for singer-songwriters.',
    bio: 'Arrangements from single lines; remote stems in 48k.',
    instruments: ['Cello'],
    genres: ['Indie', 'Classical'],
    experience: 'intermediate',
    area: 'Centro',
    city: 'Martano',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Session overdubs',
        organization: 'Home studio',
        period: '2020 — present',
        location: 'Martano',
        description: 'Layered pads and melodic counterlines.',
      },
    ],
    studies: [],
    socialLinks: [
      { platform: 'instagram', url: `${U}/serena/instagram` },
      { platform: 'spotify', url: `${U}/serena/spotify` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.RECORDING, MEETUP_TYPES.SONGWRITING],
  },
  {
    id: '14',
    categories: ['producer', 'live'],
    displayName: 'Riccardo Zocco',
    photoUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=400&fit=crop',
    headline: 'Electronic producer / live set · club seasons & afterhours.',
    bio: 'Ableton and hardware for club-friendly electronic sets: sequencers, drum machines, and analog synth layers. Warm-ups into peak-time arcs and clean handoffs with live bands. Comfortable reading room energy in Italian + English.',
    instruments: ['Ableton Live', 'Synth', 'Drum machine'],
    genres: ['House', 'Techno', 'Electronic'],
    experience: 'pro',
    area: 'Campagna',
    city: 'Presicce',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Resident electronic act · Ionian summer season',
        organization: 'Beach clubs & lidos (Salento)',
        period: '2019 — present',
        location: 'Provincia di Lecce',
        description:
          'Four-month season: sunset house into peak melodic techno, handoffs with percussionists, and strict soundcheck windows with FOH.',
      },
      {
        title: 'Guest live electronic · warehouse & ex-industrial venues',
        organization: 'Promoters across Puglia',
        period: '2017 — present',
        location: 'Bari · Lecce · Taranto',
        description: 'All-night bills: warm-up discipline, 125–135 BPM arcs, and emergency mic for shout-outs.',
      },
      {
        title: 'Production workshop mentor',
        organization: 'Weekend intensive (mock)',
        period: '2022 — present',
        location: 'Lecce',
        description: 'Set prep, tempo transitions, and reading a room without harsh, mismatched drops.',
      },
    ],
    studies: [],
    socialLinks: [
      { platform: 'instagram', url: `${U}/riccardo/instagram` },
      { platform: 'soundcloud', url: `${U}/riccardo/soundcloud` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_WEEK,
    openFor: [MEETUP_TYPES.GIG, MEETUP_TYPES.JAM, MEETUP_TYPES.RECORDING],
    contactEmail: 'riccardo.zocco.music@example.com',
    availabilityCaption: 'Late nights · club hours · travel within province by arrangement.',
    meetThreadMock: {
      fromName: 'Anna Manca',
      excerpt: 'Warmup slot for the warehouse night? I can bring 135 BPM tools and hand off clean on a shared clock.',
      proposals: [
        { id: 'rz1', label: 'Fri 23:30 · Backstage link-check slot' },
        { id: 'rz2', label: 'Sat 22:00 · Main room handoff (mock)' },
      ],
    },
  },
  {
    id: '15',
    categories: ['live', 'session'],
    displayName: 'Giulia Castro',
    photoUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop',
    headline: 'Arpa celtica · cerimonie & installazioni sonore.',
    bio: 'Soft dynamics for vows and site-specific resonance pieces.',
    instruments: ['Celtic harp'],
    genres: ['Classical', 'Ambient'],
    experience: 'advanced',
    area: 'Marina',
    city: 'Castro',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Solo harp for events',
        organization: 'Independent',
        period: '2014 — present',
        location: 'Castro',
        description: 'Outdoor cliffside ceremonies and gallery openings.',
      },
    ],
    studies: [],
    socialLinks: [
      { platform: 'instagram', url: `${U}/giulia/instagram` },
      { platform: 'youtube', url: `${U}/giulia/youtube` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.GIG, MEETUP_TYPES.RECORDING],
  },
  {
    id: '16',
    categories: ['producer', 'live'],
    displayName: 'Anna Manca',
    photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    headline: 'Techno live set · warehouse energy & long blends.',
    bio: 'Industrial-tinged techno with Ableton and hardware when the room allows. Live dub siren FX and layered stems. Safety-first cable runs and labeled drives for festival changeovers.',
    instruments: ['Ableton Live', 'Mixer', 'Modular'],
    genres: ['Techno', 'Electronic', 'Industrial'],
    experience: 'pro',
    area: 'Centro · 500 m',
    city: 'Lecce',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Headline live electronic · indoor techno series',
        organization: 'Ex-convento nights (mock)',
        period: '2021 — present',
        location: 'Lecce',
        description: 'All-night driving sets: tension/release arcs, no “microwave” drops, and coordinated strobes with lighting.',
      },
      {
        title: 'Festival tent · second stage',
        organization: 'South Italy electronic weekender',
        period: '2019 — present',
        location: 'Salento',
        description: 'Handoff from live band to electronic set in under 12 minutes with shared tempo map.',
      },
      {
        title: 'Producer · club tools & edits',
        organization: 'Self-released + label promos',
        period: '2018 — present',
        location: 'Remote',
        description: 'Extended mixes, dub versions for club bills, and mastering prep with trusted engineer.',
      },
    ],
    studies: [
      {
        school: 'Electronic music production (private)',
        credential: 'Ongoing',
        field: 'Arrangement & low-end in club systems',
        period: '2019 — present',
      },
    ],
    socialLinks: [
      { platform: 'instagram', url: `${U}/anna/instagram` },
      { platform: 'soundcloud', url: `${U}/anna/soundcloud` },
      { platform: 'spotify', url: `${U}/anna/spotify` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_NOW,
    openFor: [MEETUP_TYPES.GIG, MEETUP_TYPES.RECORDING, MEETUP_TYPES.JAM],
  },
  {
    id: '17',
    categories: ['live', 'teacher'],
    displayName: 'Daniele Torsello',
    photoUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop',
    headline: 'Live party sets · weddings, corporate & beach events.',
    bio: 'Italian + international singalong sets: acoustic-first moments, 90s dance, and “classics” blocks for mixed-age floors. Host mic in IT/EN, wireless hygiene, and a backup playlist if the rig fails.',
    instruments: ['Keys', 'Vocals', 'Laptop playback'],
    genres: ['Pop', 'House', 'Dance'],
    experience: 'advanced',
    area: 'Borgo marinaro',
    city: 'Gallipoli',
    region: 'Puglia · Salento',
    experiences: [
      {
        title: 'Wedding & private event entertainer',
        organization: 'Torsello Entertainment (mock)',
        period: '2016 — present',
        location: 'Gallipoli · Lecce province',
        description: 'Timeline coordination with planners, dinner jazz playlists, and dancefloor peaks without volume complaints.',
      },
      {
        title: 'Corporate gala live sets',
        organization: 'Agency roster',
        period: '2018 — present',
        location: 'Puglia',
        description: 'Strict dress code events: conservative first hour, then controlled energy with clean edits.',
      },
      {
        title: 'Radio mix show guest',
        organization: 'Regional FM (mock)',
        period: '2020 — present',
        location: 'Lecce',
        description: 'Monthly 60-minute blends with station-provided jingles and clock compliance.',
      },
    ],
    studies: [],
    socialLinks: [
      { platform: 'instagram', url: `${U}/daniele/instagram` },
      { platform: 'facebook', url: `${U}/daniele/facebook` },
    ],
    links: [],
    availability: AVAILABILITY.OPEN_WEEK,
    openFor: [MEETUP_TYPES.GIG, MEETUP_TYPES.TEACHING],
  },
]

const LS_KEY = 'musician-proto-me'

export function readStoredMeOverrides() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeStoredMeOverrides(data) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LS_KEY, JSON.stringify(data))
  window.dispatchEvent(new CustomEvent('musician-proto-updated'))
}

export function mergeMeFromStorage(musicians) {
  const overrides = readStoredMeOverrides()
  if (!overrides) return musicians
  return musicians.map((m) => {
    if (m.id !== 'you') return m
    return {
      ...m,
      ...overrides,
      openFor: overrides.openFor ?? m.openFor,
      socialLinks: overrides.socialLinks ?? m.socialLinks,
      studies: overrides.studies ?? m.studies,
      experiences: overrides.experiences ?? m.experiences,
      instruments: overrides.instruments ?? m.instruments,
      genres: overrides.genres ?? m.genres,
      headline: overrides.headline ?? m.headline,
      bio: overrides.bio ?? m.bio,
      categories: (overrides.categories ?? m.categories).filter((c) =>
        Object.hasOwn(MUSICIAN_CATEGORY_LABELS, c)
      ),
      contactEmail: overrides.contactEmail ?? m.contactEmail,
      availabilityCaption: overrides.availabilityCaption ?? m.availabilityCaption,
      meetThreadMock: overrides.meetThreadMock ?? m.meetThreadMock,
    }
  })
}
