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
- `(prototype)` route group with mock data
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
```
