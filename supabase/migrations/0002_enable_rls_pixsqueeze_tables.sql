-- Harden the Prisma-managed PixSqueeze tables by enabling Row Level Security.
--
-- WHY: these tables show "UNRESTRICTED" in the Supabase Table Editor, meaning
-- RLS is OFF while they sit in the `public` schema. That exposes them through
-- the auto-generated PostgREST Data API to anyone holding the *public* anon /
-- publishable key (which ships in the browser bundle) — i.e. customer emails,
-- API keys, and Stripe IDs could be read/written by anyone.
--
-- WHY THIS IS SAFE:
--   * The PixSqueeze API (Express on Railway) talks to Postgres over a DIRECT
--     connection string as the `postgres` role, which has BYPASSRLS — so the
--     backend keeps full access regardless of these policies.
--   * The alosha-web frontend NEVER reads these tables via the Supabase client.
--     It only uses Supabase Auth; all PixSqueeze data goes through the Railway
--     API. (Verified: no .from('Customer'/'ApiKey') calls in the app.)
--   * Enabling RLS with NO policies blocks only the anon/authenticated roles
--     via PostgREST — exactly the exposure we want to close.
--
-- Run in the Supabase SQL editor (project kihwsdoutlbzvmchpevw), same as before.
-- AFTER running, smoke-test the dashboard (provision key / usage / billing) to
-- confirm the Railway backend is unaffected. Low risk, but worth a click.

alter table public."Customer" enable row level security;
alter table public."ApiKey"   enable row level security;

-- Prisma's bookkeeping table — no PII, but no reason to expose it either.
alter table public."_prisma_migrations" enable row level security;
