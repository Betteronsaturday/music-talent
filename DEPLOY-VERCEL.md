# Deploy on Vercel

Production app: **https://musician-discovery-prototype.vercel.app**

The project is linked to GitHub (`Betteronsaturday/music-talent`). Pushes to **`main`** deploy automatically.

## GitHub → Vercel (recommended)

1. [Vercel Dashboard](https://vercel.com) → project **musician-discovery-prototype**.
2. **Settings → Git** should show `Betteronsaturday/music-talent`, branch `main`, root directory **`.`**.
3. Push to `main` on GitHub; Vercel builds with `npm run build`.

## Manual CLI deploy

From the repository root:

```bash
npm install -g vercel   # optional
vercel login
vercel link             # if not already linked (.vercel/project.json)
vercel deploy --prod --yes
```

Team scope (if prompted): **betteronsaturdays-projects**.

## After deploy

- `/` redirects to `/musicians/map`.
- If images fail to load, check Unsplash URLs in `src/data/musiciansMock.js` or swap to your own assets.

## Environment variables

This demo does not require secrets. When you add auth, email, or a database, configure variables in **Vercel → Project → Settings → Environment Variables** and pull locally with:

```bash
vercel env pull .env.local
```
