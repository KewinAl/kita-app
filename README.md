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
