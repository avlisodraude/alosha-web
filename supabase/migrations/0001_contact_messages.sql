-- Contact-form submissions backup for alosha.dev.
-- Email (via Resend) is the primary delivery; this table is a durable record.
--
-- Run once in the Supabase SQL editor (project kihwsdoutlbzvmchpevw):
--   Dashboard → SQL Editor → New query → paste → Run.
--
-- Security model: inserts happen ONLY from the server route using the
-- service_role key, which bypasses RLS. RLS is enabled with no policies, so
-- the anon/public key can neither read nor write this table.

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  topic       text,
  product     text,
  message     text not null,
  -- light request metadata for spam triage / debugging
  user_agent  text,
  ip          text
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- Enable RLS with no policies → only service_role (server) can touch it.
alter table public.contact_messages enable row level security;
