# Unique Anonymous Page Views and Approximate Location

**Status**: In Progress

## Summary

Record one private page view per anonymous browser device for the confession page. A persistent browser identifier makes reloads idempotent, while Supabase stores the first and most recent visit timestamps. The page also makes a best effort IP based lookup and stores only the returned country and city.

## Context

The owner wants to measure distinct anonymous browser devices and see the approximate country and city associated with each visit. The public page must not display this information. The location is inferred from the visitor's public IP by `ipapi.co`, so it is approximate and may identify a network or VPN location rather than the visitor's actual location.

The current application already has a Supabase client, an anonymous identifier helper, and a `public.views` design. Location lookup must remain optional and must never interrupt the confession experience.

## Requirements

- **AC-1**: The first load of the confession page creates one `views` row for the current page and anonymous browser identifier.
- **AC-2**: Reloads from the same browser device do not create another row and update only `last_seen_at` plus any newly available location fields.
- **AC-3**: A different browser device can create its own row for the same page.
- **AC-4**: A best effort lookup obtains approximate country and city without requesting browser GPS permission.
- **AC-5**: Only `country` and `city` are stored. Raw IP addresses, exact coordinates, region details, and provider response payloads are not stored.
- **AC-6**: Location lookup, Supabase, and network failures fail silently for the visitor and do not block or change the page experience.
- **AC-7**: The unique count and location data are available privately through the Supabase Dashboard and are not queried or displayed in the public page.
- **AC-8**: Duplicate concurrent requests preserve one row per page and device.
- **AC-9**: `npm.cmd run lint` and `npm.cmd run build` pass.

## Options considered

### Option 1: Client side IP geolocation with `ipapi.co`

The browser requests the provider's current IP lookup endpoint, keeps only country and city, and sends those fields to the existing Supabase page view row.

**Pros**:

- Fits the existing static browser architecture.
- Needs no API key or new server deployment.
- Does not request precise browser location permission.

**Cons**:

- The provider receives the visitor's public IP as part of the request.
- City accuracy is approximate and can be wrong for mobile networks, VPNs, and shared connections.

### Option 2: Supabase Edge Function proxy

Call a Supabase Edge Function that obtains the request location and calls a provider from the server side.

**Pros**:

- Keeps provider details out of the browser and centralizes the integration.
- Makes future rate limiting and provider replacement easier.

**Cons**:

- Adds an Edge Function deployment and a new server surface to a static project.
- Still requires a provider and careful handling of request IP data.

### Option 3: Browser GPS location

Ask for precise browser location and reverse geocode it into a city and country.

**Pros**:

- Can be more accurate when the visitor grants permission.

**Cons**:

- Requires an explicit permission prompt and HTTPS.
- Collects more sensitive data than this requirement needs.

## Decision

**Chosen option**: Option 1, client side IP geolocation with `ipapi.co`.

Keep the existing Supabase page view path. Before the insert, make a short timed request to `https://ipapi.co/json/`. Map only `country_name` to `country` and `city` to `city`. If the lookup fails, insert or update the page view without location data. The client never stores or forwards the raw IP, coordinates, or full provider response.

**Implementation skills**: `develop` (`JavaScript-Mastery-Pro/skills`, `.agents/skills/develop/`) · `supabase` (`supabase`, `.agents/skills/supabase/`)

## Rationale

The requested data is approximate country and city, not precise location. A small client side lookup keeps the current static architecture and avoids a new server deployment. The privacy boundary is enforced by selecting only two fields before writing to Supabase and by keeping the data private through existing table access rules.

## Feature design

**Data model sketch**:

Table `public.views` keeps its current fields and adds:

- `country text` nullable
- `city text` nullable

The existing unique constraint on `(page_key, anonymous_id)` remains unchanged. There are no new relationships.

**State transitions**:

No new visible UI state. The page view flow starts a best effort location lookup, then inserts or updates the existing row. A timeout, denied provider request, malformed response, or Supabase failure ends the tracking attempt without changing the page.

**API surface**:

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `https://ipapi.co/json/` | GET | visitor network identity inferred by provider | provider JSON, used only for country and city | none | timeout, rate limit, unavailable, malformed response |
| `recordPageView(pageKey)` | client helper | `pageKey: string` | `void` | Supabase publishable key | duplicate conflict, schema error, network error, all logged and swallowed |

**Key invariants**:

- `(page_key, anonymous_id)` is unique.
- `first_viewed_at` is never changed after insertion.
- `last_seen_at` is refreshed on later loads.
- `country` and `city` are nullable and contain only trimmed provider fields.
- Raw IP addresses, exact coordinates, region fields, and provider payloads are never written to Supabase or browser storage.
- The public client never reads view rows or location data.

**Security model**:

- Anonymous visitors may insert and update only their own page view row according to the existing RLS design.
- Anonymous visitors have no `SELECT` or `DELETE` access.
- The owner views rows through the authenticated Supabase Dashboard.
- The third party provider receives the visitor request IP through the normal network request. The README must disclose this approximate location lookup.
- This is approximate analytics, not identity verification. Visitors using VPNs, proxies, mobile networks, or privacy tools may be attributed incorrectly.

**Configuration required**:

No new environment variables. Existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` remain unchanged.

**Database setup required**:

Run `docs/supabase/views-location.sql` in the Supabase SQL Editor before expecting location fields to be stored.

**Critical test scenarios**:

- First page load inserts one row with country and city when the provider returns valid data, verifies **AC-1**, **AC-4**, and **AC-5**.
- A provider timeout or malformed response still records the page view without location and does not block the page, verifies **AC-6**.
- Reload updates the existing row rather than creating another row, verifies **AC-2** and **AC-8**.
- Source review confirms no raw IP, coordinates, or provider payload are persisted, verifies **AC-5**.
- Anonymous clients cannot read the private view rows, verifies **AC-7**.
- Lint and production build pass, verifies **AC-9**.

## Build plan

1. Add nullable `country` and `city` columns to the existing `public.views` table setup and document the SQL, satisfying **AC-5**, **AC-7**, and **AC-8**.
2. Add a timed, defensive `ipapi.co` lookup that returns only trimmed country and city fields, satisfying **AC-4**, **AC-5**, and **AC-6**.
3. Include optional location fields in the existing idempotent page view insert and update flow, satisfying **AC-1**, **AC-2**, **AC-3**, **AC-6**, and **AC-8**.
4. Update the README with the provider, privacy boundary, database setup, and verification steps, then run lint and production build, satisfying **AC-6**, **AC-7**, and **AC-9**.

## Consequences

**Positive**:

- The owner can privately see approximate country and city for unique page view rows.
- No GPS prompt, exact coordinates, raw IP storage, or public location UI is added.
- Existing page view uniqueness and failure behavior remain intact.

**Negative / tradeoffs**:

- A third party receives the visitor's public IP through the lookup request.
- City results are approximate and may be wrong or unavailable.
- Provider availability and rate limits can reduce location coverage.
- The database schema must be updated manually before the new fields can be written.

**Neutral**:

- Existing rows remain valid with null country and city values.

## Follow-up

- [ ] Apply `docs/supabase/views-location.sql` in the Supabase SQL Editor and confirm the columns and existing RLS policies are live.
- [ ] Add a visible privacy notice before public launch that explains approximate location collection and the provider involved.
