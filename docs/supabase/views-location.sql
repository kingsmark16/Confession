alter table public.views
  add column if not exists country text,
  add column if not exists city text;
