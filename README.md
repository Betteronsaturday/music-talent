# Music Talent

A **Next.js** web app for discovering musicians, browsing a regional map, posting collaboration opportunities, and exploring rich musician profiles. The current version runs entirely on **mock data** in the browser — there is no backend, authentication, or payment flow yet. It is designed as a working UI and product shell you can extend into a full platform.

**Live demo:** [music-talent.vercel.app](https://music-talent.vercel.app)

---

## What this app does

Musicians and organizers can:

- **Map** — See fictional profiles pinned around the Province of Lecce (Salento, Italy) on OpenStreetMap. Filter by city, instrument, genre, role, and experience. Optional browser GPS narrows results to a radius.
- **Discover** — Grid of musician cards with the same filters as the map, plus a stories strip. Opening a profile from the map pins that person to the top of Discover while filters still match.
- **Collabs** — Browse and post collaboration asks (stored in `localStorage` in this demo).
- **Profiles** — Resume-style pages: headline, bio, instruments, genres, experience, education, social links, portfolio embeds, availability, and a lightweight “meet & engage” section (reach-out email, in-thread availability, time proposals, reminder preferences — all client-side).
- **Settings** — Edit your preview profile’s availability and “open for” meetup types (`/musicians/availability`).

The default profile is **`you`** (`/musicians/you`). Edits persist in the browser via `localStorage`.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | [Next.js 16](https://nextjs.org/) (Pages Router) |
| UI | [React 19](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS v4](https://tailwindcss.com/) |
| Map | [Leaflet](https://leafletjs.com/) + OpenStreetMap tiles |
| Icons | [Lucide](https://lucide.dev/) |
| Toasts | [Sonner](https://sonner.emilkowal.ski/) |
| Deploy | [Vercel](https://vercel.com/) (Git-connected) |

---

## Requirements

- **Node.js** 18.18+ (20+ recommended)
- **npm** 9+

---

## Getting started

```bash
git clone git@github.com:Betteronsaturday/music-talent.git
cd music-talent
npm install
npm run dev
```

Open [http://localhost:3001/musicians/map](http://localhost:3001/musicians/map) once the dev server reports **Ready**.

- `/` redirects to `/musicians/map` (see `next.config.js`).
- Dev server uses port **3001** to avoid clashing with other apps on 3000.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve production build on :3001
npm run lint    # ESLint (Next.js config)
```

If the app does not load, see [OPEN.md](./OPEN.md).

---

## Routes

| Path | Description |
|------|-------------|
| `/musicians/map` | Map home — pins, filters, optional GPS |
| `/musicians` | Discover grid + stories |
| `/musicians/collabs` | Collaboration board |
| `/musicians/stories` | Full stories list |
| `/musicians/[id]` | Musician profile (`you`, `1`, `2`, …) |
| `/musicians/availability` | Edit your availability & open-for types |

---

## Project structure

```
components/musicians/     # Feature UI (map, cards, profile sections, filters)
src/
  components/ui/          # shadcn primitives (button, card, dialog, …)
  data/                   # Mock musicians, collabs, stories, map coords
  hooks/                  # Shared browse/filter state (map + discover)
  lib/                    # Geo helpers, map-focus session, utilities
  pages/                  # Next.js routes
  styles/globals.css      # Tailwind v4 theme + map pin styles
```

### Important modules

- **`src/data/musiciansMock.js`** — Musician records, availability labels, role categories, `mergeMeFromStorage()` for the `you` profile.
- **`src/hooks/useDiscoverBrowseState.js`** — Shared filters + GPS; session keys for browse prefs.
- **`src/lib/discoverMapFocus.js`** — When a profile is opened from the map (`?from=map`), that ID is pinned first on Discover.
- **`src/data/musicianMapCoords.js`** — Lat/lng per musician ID (Salento cluster).

### Browser persistence (`localStorage`)

| Key | Purpose |
|-----|---------|
| `musician-proto-me` | Overrides for the `you` profile |
| `musician-proto-discover-browse` | Filter + GPS toggle across Map/Discover |
| `musician-proto-collabs` | User-posted collab entries |
| `musician-proto-reminder-prefs` | Email/push reminder toggles on your profile |
| `musician-proto-portfolio-*` | Portfolio likes/pitches (per profile) |

---

## Deployment

The project is connected to **GitHub** → **Vercel**:

- **Repo:** `Betteronsaturday/music-talent`
- **Production branch:** `main`
- **Root directory:** `.` (repository root)

Pushing to `main` triggers a production deployment. See [DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md) for manual CLI deploy and troubleshooting.

---

## Design principles (current build)

1. **Outcome-focused engagement** — Availability and proposals live in context (profile / thread), not an endless feed.
2. **Shared browse state** — Map and Discover use the same filters and session storage.
3. **Progressive disclosure** — Rich profile (resume, portfolio, meet section) without requiring a login in the demo.
4. **Regional story** — Mock data is anchored in Salento so map + copy feel coherent.

---

## How to improve the project

Below is a practical roadmap. Pick one vertical slice at a time rather than bolting on a full backend everywhere at once.

### 1. Real accounts & profiles

- Add auth (e.g. Clerk, Auth0, or NextAuth) and replace `you` preview with a signed-in user.
- Move profile edits from `localStorage` to an API + database (Postgres via Neon, Supabase, etc.).
- Validate and verify reach-out email (relay or reveal-on-match).

### 2. Messaging & proposals

- Replace mock thread/proposal UI with persisted threads and messages.
- Implement proposal state machine: `proposed` → `confirmed` | `countered` | `declined`.
- Wire reminder preferences to email (Resend, Postmark) and optional web push.

### 3. Discovery & search

- Server-side filter/search with pagination; keep map bounds query for performance.
- Ranking by distance, shared genres, availability, and mutual “open for”.
- Save/bookmark lists synced per user.

### 4. Collabs

- Persist posts in DB; moderation and reporting hooks.
- Notify musicians when a collab matches their role/instrument filters.

### 5. Map & location

- Geocode real user locations with privacy controls (city-level default).
- Cluster markers at low zoom; link pin popups to quick actions (message, save).

### 6. Quality & ops

- Add Playwright/Cypress smoke tests for map → profile → discover pin flow.
- Introduce CI (GitHub Actions): `lint` + `build` on every PR.
- Replace Unsplash mock photos with licensed assets or uploads (Vercel Blob / S3).

### 7. UI polish

- Light/dark theme toggle in shell (tokens already in `globals.css`).
- Accessibility pass on map popups, filter menus, and profile forms.
- Mobile map interactions (larger tap targets, bottom sheet for pin details).

---

## Adding UI components

This repo uses the shadcn CLI:

```bash
npx shadcn@latest add <component> -y
```

Components land in `src/components/ui/`. Config: `components.json`.

---

## Contributing

1. Fork the repo and create a feature branch from `main`.
2. Keep changes focused; match existing patterns (Pages Router, `@/` imports, shadcn components).
3. Run `npm run lint` and `npm run build` before opening a PR.
4. Describe **what** and **why** in the PR — screenshots for UI changes help.

For larger features, open an issue first to align on scope (especially anything that needs a backend or auth).

---

## License

See [LICENSE](./LICENSE) in this repository.

---

## Acknowledgements

- Map tiles © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- Profile photos are placeholder images from [Unsplash](https://unsplash.com/) in mock data only.
