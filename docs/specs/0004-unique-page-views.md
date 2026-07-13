# Unique Anonymous Page Views

**Status**: In Progress

## Summary

Record one private page view per anonymous browser device for the confession page. A persistent browser identifier makes reloads idempotent, while Supabase stores the first and most recent visit timestamps. Tracking failures never interrupt the visitor experience.

## Context

The owner wants to measure how many distinct anonymous browser devices opened the page. The existing application already has a Supabase client and anonymous identifier helper used by response submissions. The count must not be shown publicly, and no IP address or personal identity should be collected.

## Requirements

- **AC-1**: The first load of the confession page creates one `views` row for the current page and anonymous browser identifier.
- **AC-2**: Reloads from the same browser device do not create another row and update only `last_seen_at`.
- **AC-3**: A different browser device can create its own row for the same page.
- **AC-4**: The unique count is available privately through the Supabase Dashboard and is not queried or displayed in the public page.
- **AC-5**: Duplicate concurrent requests are harmless because the database uniqueness constraint and upsert behavior preserve one row per page and device.
- **AC-6**: Supabase or network failures are logged for diagnostics but fail silently without blocking or changing the visitor experience.
- **AC-7**: Existing response behavior, music playback, page layout, and responsive behavior remain unchanged.
- **AC-8**: `npm.cmd run lint` and `npm.cmd run build` pass.

## Options considered

### Option 1: Unique row per page and anonymous device

Store one row for each `(page_key, anonymous_id)` pair and update `last_seen_at` on later loads.

**Pros**:
- Directly represents unique devices and makes counting simple.
- Database uniqueness makes retries and concurrent loads safe.

**Cons**:
- Clearing browser storage or switching browsers creates a new anonymous device row.

### Option 2: Aggregate counter row

Store one numeric counter per page and increment it from the browser.

**Pros**:
- Minimal storage.

**Cons**:
- Cannot reliably prevent duplicate increments from reloads or concurrent requests without trusted server logic.

### Option 3: Event log with later deduplication

Store every page load event and calculate unique devices during reporting.

**Pros**:
- Preserves detailed history.

**Cons**:
- Stores unnecessary data for this requirement and makes private reporting more complex.

## Decision

**Chosen option**: Option 1: Unique row per page and anonymous device

Add a `recordPageView(pageKey)` helper that reuses the existing Supabase client and anonymous ID helper, then call it once when the confession page mounts.

## Rationale

The unique composite key gives the desired one-device count without trusting client-side counters. Reusing the existing identifier and Supabase setup keeps the change small and consistent with the response flow. Private reads avoid exposing visitor analytics while still allowing the owner to inspect counts in Supabase.

## Feature design

**Data model sketch**:

Table `public.views`:

- `id uuid primary key default gen_random_uuid()`
- `page_key text not null`
- `anonymous_id text not null`
- `first_viewed_at timestamptz not null default now()`
- `last_seen_at timestamptz not null default now()`
- Unique constraint on `(page_key, anonymous_id)`
- No relationship to `public.responses`

**State transitions**:

No lifecycle state. A first visit inserts a row; subsequent visits update `last_seen_at` on the same row.

**API surface**:

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `recordPageView(pageKey)` | client helper | `pageKey: string` required | `void` | Supabase `anon` key; no user auth | duplicate conflict handled by upsert, network or Supabase error logged and swallowed |

**Key invariants**:

- `(page_key, anonymous_id)` is unique.
- `first_viewed_at` is never changed after insertion.
- `last_seen_at` is refreshed on later loads.
- The public client never reads the aggregate or individual view rows.

**Security model**:

- Anonymous visitors may insert a row and update only the row matching their own `anonymous_id` and page key.
- Anonymous visitors have no `SELECT` or `DELETE` access.
- The owner views data through the authenticated Supabase Dashboard.
- No IP addresses, user agents, screen sizes, or other device metadata are stored.

**Configuration required**:

No new environment variables. Use the existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` values.

**Critical test scenarios**:

- Happy path: first page load inserts one row and a reload updates `last_seen_at`, verifies **AC-1**, **AC-2**.
- Failure case: duplicate concurrent calls and a rejected Supabase request do not create duplicate rows or block the page, verifies **AC-5**, **AC-6**.
- Auth/permission: an anonymous client cannot select or delete view rows, verifies **AC-4**, **AC-7**.

## Build plan

1. Create the `public.views` table, composite uniqueness constraint, and RLS policies, satisfying **AC-1**, **AC-2**, **AC-3**, **AC-5**.
2. Add the `recordPageView(pageKey)` Supabase helper using the existing anonymous ID utility and idempotent upsert, satisfying **AC-1**, **AC-2**, **AC-5**, **AC-6**.
3. Call the helper once from the confession page mount without adding public analytics UI, satisfying **AC-1**, **AC-4**, **AC-7**.
4. Document the SQL and verify lint and production build, satisfying **AC-8**.

## Consequences

**Positive**:
- Unique device counts remain stable across reloads.
- The implementation adds no backend service, authentication flow, or public analytics surface.

**Negative / tradeoffs**:
- Anonymous IDs are browser-local and can be reset by clearing storage, using private browsing, or changing devices.
- Anonymous write policies allow a determined client to fabricate identifiers.

**Neutral**:
- Counts are inspected privately in Supabase rather than rendered in the application.

## Follow-up

- [ ] Apply the SQL migration and confirm the RLS policies in the Supabase dashboard before implementation verification.
