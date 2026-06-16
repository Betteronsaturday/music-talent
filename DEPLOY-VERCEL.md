# Share on Vercel (new project)

Your Vercel team slug (from Cursor integration): **`betteronsaturdays-projects`**.

## Option A — CLI (works without pushing to GitHub)

In **your own terminal** (macOS Terminal or Cursor’s terminal on your machine):

```bash
cd /Users/andreasabato/Documents/Repository/portfolio/musician-discovery-prototype

npx vercel@latest login

npx vercel@latest deploy --prod --yes \
  --scope betteronsaturdays-projects \
  --project musician-discovery-feedback
```

- First run creates the **new** project `musician-discovery-feedback` and prints the **Production** URL (share that `https://…vercel.app` link).
- `--scope` keeps it on your team, not a personal default.

If `--project` is taken globally, pick another name, e.g. `musician-discovery-feedback-2026`.

## Option B — Dashboard + Git

1. Push this repo (or a fork) to GitHub.
2. [Vercel](https://vercel.com) → **Add New…** → **Project** → **Import** the repo.
3. Set **Root Directory** to `musician-discovery-prototype`.
4. Name the project (e.g. `musician-discovery-feedback`) → **Deploy**.
5. Use the **Production** domain Vercel assigns.

## After deploy

- Open **`/`** or **`/musicians`** on the production URL (your app redirects `/` → `/musicians`).
- Fix any broken Unsplash image URLs if you see missing avatars in production.
