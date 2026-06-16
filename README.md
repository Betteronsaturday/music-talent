# Musician discovery prototype

Concept-only Next.js app (mock data, no backend). Vampr-inspired flows (discover, collabs, stories) — not affiliated with Vampr. In-app messaging is intentionally out of scope for now.

## Run

```bash
npm install
npm run dev
```

Open **http://localhost:3001/musicians/map** after the dev server prints **Ready** (or **`/`**, which redirects to the map).

- **`/`** redirects to **`/musicians/map`** via `next.config.js` (prototype defaults to the Salento map).
- **`/musicians`** is the Discover grid + stories.
- **Port 3001** avoids clashing with another app on **3000**.

See **`OPEN.md`** if anything fails to load.

## Routes

| Path | Purpose |
|------|---------|
| `/musicians/map` | **Default home**: map (OpenStreetMap + Leaflet, optional GPS); mock pins in **Province of Lecce** |
| `/musicians` | Discover: filters, profile grid, stories (same browse session as Map) |
| `/musicians/collabs` | Collab posts + post your own (localStorage) |
| `/musicians/stories` | Mock vignettes |
| `/musicians/[id]` | Profile: headline, about, instruments, experience, education, social/streaming links (+ portfolio) |
| `/musicians/availability` | Availability (localStorage) |

No backend, auth, or payments.

## UI

- **[shadcn/ui](https://ui.shadcn.com/)** (Radix Nova style) — components live under `src/components/ui/`.
- **Tailwind CSS v4** with `@tailwindcss/postcss`, theme tokens in `src/styles/globals.css` (`@import "tailwindcss"`, `@theme inline`, dark mode via `class="dark"` on `<html>`).
- **Icons:** [Lucide](https://lucide.dev/) (`lucide-react`).
- **Toasts:** [Sonner](https://sonner.emilkowal.ski/) via `<Toaster />` in `_app.js`.

Add more primitives anytime:

```bash
npx shadcn@latest add <component> -y
```
