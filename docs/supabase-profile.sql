-- Optional: create a public.profiles table in Supabase that mirrors Prisma "Profile",
-- or manage Profile rows via Prisma only (recommended if Prisma owns the schema).
--
-- If you use Supabase Auth UI signup and want a row on every new user, you can use
-- a trigger on auth.users. Align columns with prisma/schema.prisma model Profile:
--   id uuid PK (same as auth.users.id)
--   email text
--   role text / enum
--   organizationId text nullable
--
-- Example (adjust schema names to match how you migrate):

-- create table if not exists public.profiles (
--   id uuid primary key references auth.users on delete cascade,
--   email text,
--   role text not null default 'general_staff',
--   "organizationId" text,
--   "createdAt" timestamptz not null default now(),
--   "updatedAt" timestamptz not null default now()
-- );

-- Minimal trigger to insert profile on signup (example only):

-- create or replace function public.handle_new_user()
-- returns trigger as $$
-- begin
--   insert into public.profiles (id, email, role)
--   values (new.id, new.email, 'general_staff');
--   return new;
-- end;
-- $$ language plpgsql security definer;

-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();

-- Note: If Prisma migrations create the "Profile" table in the public schema,
-- prefer managing it via Prisma migrate and inserting demo users with SQL or seed scripts.
