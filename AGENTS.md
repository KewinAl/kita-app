# Kita App

Staff-first daily workflow PWA for Swiss Kitas, built with Next.js 15, React 19, Tailwind CSS, and shadcn/ui. Currently in Phase 0 (Visual Prototype) — all data is mocked, no backend/database.

## Cursor Cloud specific instructions

- **Node version**: The project requires Node.js 20 (see `.nvmrc`). Use `nvm use 20` before running commands.
- **Package manager**: npm (lockfile is `package-lock.json`).
- **Dev server**: `npm run dev` starts Next.js on port 3000. All data is mocked in `src/lib/mock/`.
- **Lint**: `npm run lint` runs `next lint`. The `.eslintrc.json` extends `next/core-web-vitals`.
- **Build caveat**: `npm run build` fails with a pre-existing `useSearchParams()` Suspense boundary error on the `/prototype/ablauf/eingabe` page. This does **not** affect the dev server.
- **No external services**: No database, Docker, or API keys needed. The prototype is entirely self-contained with mock data.
- See `README.md` for project structure and `docs/PLAN.md` for the full roadmap.
