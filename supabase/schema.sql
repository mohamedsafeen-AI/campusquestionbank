-- Supabase SQL schema for Campus Question Bank
-- Tables:
--   materials (question + answer + optional pdf)
--   messages  (contact form submissions)

create extension if not exists "pgcrypto";

-- Materials table
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  subject_name text not null,
  unit_name text not null,
  question text not null,
  answer text not null,
  pdf_url text,
  created_at timestamp with time zone not null default now()
);

-- Messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone not null default now()
);

-- RLS policies (recommended)
-- For public reads of materials:
-- Enable RLS and allow select for all.

alter table public.materials enable row level security;

drop policy if exists "materials_select_public" on public.materials;
create policy "materials_select_public" on public.materials
  for select
  using (true);

-- For inserts/deletes we use SERVICE_ROLE_KEY from backend, so public policies are not needed.
-- Keep them denied.

alter table public.messages enable row level security;

drop policy if exists "messages_select_public" on public.messages;
create policy "messages_select_public" on public.messages
  for select
  using (false);

