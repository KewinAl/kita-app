# Deploy: Vercel + Supabase + Prisma

This app can run as a **mock prototype** without backend env vars. To enable **Supabase Auth**, **Postgres via Prisma**, and a **public demo**, follow the steps below.

## 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. **Auth → URL configuration**: add your Vercel URL (and `http://localhost:3000` for local) to **Redirect URLs**.
3. Add **Site URL** (production URL).

## 2. Database connection string

1. **Project Settings → Database → Connection string → URI** (or the pooler string if you prefer).
2. Set `DATABASE_URL` in Vercel and in `.env.local` locally (copy from [.env.example](/.env.example)).

## 3. Prisma schema and data

From the repo root (with `DATABASE_URL` set):

```bash
npm install
npm run db:push
npm run db:seed
```

For production CI/CD, prefer migrations:

```bash
npm run db:migrate
```

Then deploy migrations in your pipeline with `prisma migrate deploy`.

## 4. Vercel environment variables

Set at least:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Postgres connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `NEXT_PUBLIC_REQUIRE_AUTH` | Set to `true` to force login before `/prototype` |

Build command uses `prisma generate` via `postinstall` and `npm run build`.

## 5. Profiles (app roles)

The Prisma model `Profile` maps `auth.users.id` to `role` and `organizationId`. After a user signs up, insert or update a row in `Profile` (or add a Supabase trigger — see [docs/supabase-profile.sql](supabase-profile.sql)).

## 6. Storage (photos)

1. Create a bucket (e.g. `day-photos`) in **Storage**.
2. Add RLS policies so authenticated users can upload/read within their org (tighten for production).
3. Store object paths in `LogPhoto.storagePath` (see [prisma/schema.prisma](../prisma/schema.prisma)).

## 7. Health check

After deploy, open `/api/health` — `database` should be `connected` when `DATABASE_URL` is valid.

## 8. Public demo checklist

- [ ] `NEXT_PUBLIC_REQUIRE_AUTH=true` for stakeholder URL
- [ ] Redirect URLs include production domain
- [ ] Seed or manual `Profile` rows for demo users
- [ ] Smoke test: magic link login → `/prototype/group`
