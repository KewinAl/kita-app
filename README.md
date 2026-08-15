# Kita App — Staff-First Daily Workflow PWA

A Progressive Web App for Swiss Kitas built around the staff's daily workflow.

## Requirements

- **Node.js 18+** (Next.js 15 requires Node 18.18+)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **View Prototype** to see the staff group overview mockup.

## Backend (Supabase + Prisma)

The product plan uses **PostgreSQL (Supabase)**, **Prisma**, **Supabase Auth**, and **Storage**. The app runs **without** these for local UI work; when you are ready:

1. Copy [.env.example](.env.example) to `.env.local` and fill in Supabase + `DATABASE_URL`.
2. Apply schema and seed:

   ```bash
   npm run db:push
   npm run db:seed
   ```

3. Optional: require login for `/prototype` by setting `NEXT_PUBLIC_REQUIRE_AUTH=true`, then use [/login](/login) (magic link or password).

Full deploy steps: [docs/DEPLOY.md](docs/DEPLOY.md).

## Work Session Commands (Agent-Friendly)

Use these commands so common workflows are one-liners:

```bash
npm run wf:sync
npm run wf:dev
npm run wf:dev:update
npm run wf:update:deps
npm run wf:update:system
npm run wf:verify
npm run wf:verify:build
```

What they do:

- `wf:sync`: fetches remote and reports ahead/behind/diverged state
- `wf:dev`: checks git sync and starts dev server
- `wf:dev:update`: checks git sync, updates deps, starts dev server
- `wf:update:deps`: runs `npm outdated` then `npm update`
- `wf:update:system`: runs `winget upgrade --all` and updates npm CLI
- `wf:verify`: runs lint checks
- `wf:verify:build`: runs lint and production build

## Phase 0 (Done)

- Next.js 15 + Tailwind + shadcn/ui scaffold
- `(prototype)` route group with mock data shaped like backend records
- Opening day fixed to **2026-08-03**; Mon–Fri day switcher (no ±14 clamp)
- Past 2 weeks seeded with sleep / activities / meals; next week meal plans only
- Groups sized for spots: Schmetterlinge (≥18mo), Bären (mixed), Igel (<18mo)
- Group overview with switcher (Schmetterlinge, Bären, Igel)
- Morning / Lunch / Afternoon counts banner
- Entgegennehmen (check-in) with Info from parents
- Abgeben (check-out) with collapsible handover view
- No Send Reports page — follow `docs/PLAN.md`

## Project Structure

```
src/
  app/
    (prototype)/prototype/   # /prototype routes
      group/page.tsx         # Staff group overview mockup
    page.tsx                 # Home
  components/
    prototype/               # Prototype-only components
    ui/                      # shadcn/ui
  lib/
    mock/                    # Fake data for prototype
    db/                      # Prisma client singleton
    supabase/                # Supabase browser/server helpers
prisma/
  schema.prisma              # Database schema
  seed.ts                    # Demo seed data
```
