create extension if not exists pgcrypto;

create table if not exists public.views (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  anonymous_id text not null,
  first_viewed_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  constraint views_page_anonymous_unique unique (page_key, anonymous_id)
);

alter table public.views enable row level security;

drop policy if exists "Allow anonymous view inserts" on public.views;
create policy "Allow anonymous view inserts"
  on public.views for insert
  to anon
  with check (true);

drop policy if exists "Allow anonymous view timestamp updates" on public.views;
create policy "Allow anonymous view timestamp updates"
  on public.views for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Deny anonymous view reads" on public.views;

revoke select, delete on public.views from anon;
grant insert, update on public.views to anon;
