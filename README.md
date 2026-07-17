# Modern Heartfelt Confession Site

A responsive, pop art confession page built with React and TypeScript. It combines a paginated love letter, music player, animated romantic garden, memory gallery, final yes or no moment, and an optional message form backed by Supabase.

LIVE: https://confession4u.mcanghel.fun

## Features

- Pop art responsive layout with animated decorative icons
- Sticky navigation that hides while scrolling down and returns while scrolling up
- Built in music player using tracks from `src/assets/music/`
- Multi page love letter driven by editable data in `src/features/confession/letter.data.ts`
- Memory gallery and reasons section
- Yes or no final question with an animated garden outcome
- Optional reply message form
- Anonymous browser ID so repeat submissions from the same browser update one response row
- Supabase storage for the current answer, message, first answer, and answer change count

## Technology

- React 19
- TypeScript
- Vite
- Handwritten CSS
- Lucide React
- Supabase JavaScript client

## Getting started

Install dependencies:

```bash
npm ci
```

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SITE_PASSWORD=your-private-page-password
```

`SITE_PASSWORD` is read only while Vite starts or builds the project. The generated browser bundle receives its SHA-256 hash, not the plain password. This gate discourages casual access, but it is not a replacement for hosting level access control.

Start the local server:

```bash
npm run dev
```

The local address is shown by Vite, usually `http://localhost:5173`.

## Commands

```bash
npm run dev      # Start local development
npm run build    # Type check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

On Windows systems where PowerShell blocks npm scripts, use `npm.cmd` in place of `npm`.

## Azure deployment

The workflow in `.github/workflows/azure-static-web-apps-icy-sky-0d3066f00.yml` deploys the Vite `dist` folder to Azure Static Web Apps whenever `main` changes. Pull requests create a preview deployment and closing a pull request removes it.

Add these GitHub repository secrets before pushing to `main`:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN_ICY_SKY_0D3066F00
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
SITE_PASSWORD
```

The Azure token comes from the Static Web App deployment token. The Supabase values are used during the client build. `SITE_PASSWORD` is used only while building the password gate and is never passed as a plain value to the browser bundle.

If deployment reports `No matching Static Web App was found or the api key was invalid`, open the Azure Static Web App resource that owns this site, choose **Manage deployment token**, copy the current token, and replace the GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN_ICY_SKY_0D3066F00`. The token must come from the same Static Web App resource. Resetting or recreating that resource invalidates older tokens.

## Supabase setup

The page writes directly to `public.responses`. There is no custom backend, account system, or in app admin screen. View submissions in the Supabase Dashboard Table Editor.

Run this in the Supabase SQL Editor for a fresh setup:

```sql
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  anonymous_id uuid not null unique,
  answer text check (answer is null or answer in ('yes', 'no')),
  message text,
  first_answer text check (first_answer is null or first_answer in ('yes', 'no')),
  answer_update_count integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.track_response_answer()
returns trigger
language plpgsql
as $$
begin
  if new.first_answer is null and new.answer is not null then
    new.first_answer := new.answer;
  end if;

  if tg_op = 'UPDATE'
     and old.answer is distinct from new.answer
     and old.answer is not null
     and new.answer is not null then
    new.answer_update_count := old.answer_update_count + 1;
  end if;

  return new;
end;
$$;

drop trigger if exists response_answer_tracking on public.responses;

create trigger response_answer_tracking
before insert or update on public.responses
for each row
execute function public.track_response_answer();
```

For the current simple browser only setup, grant the public client write access but not read or delete access:

```sql
alter table public.responses disable row level security;

revoke select, delete on table public.responses from anon, authenticated;
grant insert, update on table public.responses to anon, authenticated;
```

The Supabase publishable key is safe to use in a browser. Never add a Supabase service role key to `.env` values that start with `VITE_`, because Vite exposes those values in the client bundle.

### Response behavior

Each browser receives an anonymous UUID stored in local storage. The database uses it as a unique key.

- The first message or answer creates one row.
- Later messages update the same row.
- Choosing YES or NO updates the current answer.
- `first_answer` never changes after the first selected answer.
- `answer_update_count` increases only when the answer changes from YES to NO or from NO to YES.
- Clearing browser storage or using another browser creates a new anonymous identity.

## Project structure

```text
src/
  app/                         Application composition
  components/layout/           Shared navigation and footer
  features/confession/         Main experience, letter, reply, garden, styles, and data
  features/music-player/       Music dialog, playback state, and effects
  styles/                      Global CSS and design tokens
  assets/                      Imported images and music
public/images/memories/        Gallery images with stable public URLs
docs/specs/                    Product and technical specifications
```

See [src/README.md](src/README.md) for the source folder conventions.

## Content updates

- Edit `src/features/confession/letter.data.ts` to change the letter, recipient, sender, and page sizing.
- Edit `src/features/confession/confession.data.ts` to update page copy, reasons, and gallery content.
- Replace or add music in `src/assets/music/`, then update `src/features/music-player/musicPlayer.data.ts`.
- Replace the gallery image in `src/assets/you.png` or the public memory images as needed.

## Quality checks

Before publishing changes, run:

```bash
npm run lint
npm run build
```

Check the experience at narrow mobile widths and desktop widths, confirm navigation links work, test keyboard focus, and verify a new Supabase response appears in the dashboard.
