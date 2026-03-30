# 🗳️ Who Are You Voting For?

Anonymous, real-time US election polling. Vote on active races and hypothetical matchups — no login, no tracking, just your voice. Results appear instantly with a national bar chart and interactive state-by-state heatmap.

**Live:** [who-are-you-voting-for.vercel.app](https://who-are-you-voting-for.vercel.app) *(update after first deploy)*

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + `next-themes` (dark/light mode)
- **Database:** Neon Postgres (`@neondatabase/serverless`)
- **IP Geolocation:** `geoip-lite` (offline, no API key needed)
- **Maps:** `react-simple-maps`
- **Deployment:** Vercel

---

## Local Development

```bash
git clone https://github.com/sdisorbo/who-are-you-voting-for.git
cd who-are-you-voting-for
npm install --legacy-peer-deps
cp .env.example .env.local
# Fill in DATABASE_URL and DATABASE_URL_UNPOOLED from your Neon dashboard
npx ts-node --esm scripts/seed.ts   # seed the database once
npm run dev                          # http://localhost:3000
```

---

## Database Setup (Neon)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project → copy the **pooled** and **direct** connection strings
3. Paste into `.env.local`:
   ```
   DATABASE_URL=postgres://...         # pooled
   DATABASE_URL_UNPOOLED=postgres://... # direct
   ```
4. Run the seed script once to create tables and load initial data

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Vercel auto-detects Next.js — no build config needed
4. In **Project Settings → Environment Variables**, add:
   - `DATABASE_URL` — Neon pooled connection string
   - `DATABASE_URL_UNPOOLED` — Neon direct connection string
   - `IP_SALT` — any random string (hardens IP hashing)
5. Click **Deploy** — every push to `main` auto-deploys

---

## Privacy

- One vote per IP per election, enforced via a SHA-256 hash stored in the database
- Raw IP addresses are **never** logged or stored
- No cookies, no accounts, no tracking

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon pooled connection string |
| `DATABASE_URL_UNPOOLED` | Seed only | Neon direct connection string |
| `IP_SALT` | Optional | Random string to harden IP hashing |
