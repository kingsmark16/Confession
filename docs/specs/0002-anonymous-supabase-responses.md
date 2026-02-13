# Anonymous Supabase Responses

Status: Approved architecture

## Goal

Allow a visitor to submit a simple yes or no response and an optional message from the browser. The owner will inspect submitted rows in the Supabase Dashboard. The application does not need an authentication flow, admin page, or public response viewer.

## Scope

- Replace the reply form's local-only submission behavior with a direct Supabase Data API insert.
- Store the response choice, optional message, and creation timestamp.
- Permit anonymous visitors to insert rows.
- Keep response reads private to the Supabase Dashboard owner.
- Show a simple success or failure state in the form.

## Explicit non-goals

- No custom backend, API route, serverless function, or database server code.
- No visitor authentication.
- No admin UI in the application.
- No validation layer beyond the browser form's existing basic controls.
- No CAPTCHA, honeypot, rate limiting, moderation, or spam-prevention service.
- No public query or display of submitted responses.

## Data model

Table: `public.responses`

- `id uuid primary key default gen_random_uuid()`
- `answer text not null` containing `yes` or `no`
- `message text` nullable
- `created_at timestamptz not null default now()`

The database may enforce the answer values with a check constraint. The application must not expose the Supabase service-role key.

## Access model

Row Level Security is enabled for `public.responses`.

- Role `anon`: `INSERT` only.
- Role `anon`: no `SELECT`, `UPDATE`, or `DELETE` policy.
- Owner: views rows through the authenticated Supabase Dashboard.

The public insert policy intentionally accepts anonymous submissions without CAPTCHA or additional anti-abuse controls because this is a small, simple system. Abuse prevention can be designed separately if the product scope changes.

## Browser configuration

The client uses `@supabase/supabase-js` with Vite environment variables for the project URL and publishable/anonymous key. These values are public client configuration. Secrets must not be committed or bundled.

## Acceptance criteria

1. Submitting the reply form creates one row in `public.responses` with the selected answer and message.
2. The user sees a clear success state after a successful insert.
3. The user sees a clear failure state when Supabase is unavailable.
4. The form does not query or display existing responses.
5. Anonymous visitors cannot read, update, or delete response rows through the client.
6. Existing static sections and responsive behavior remain unchanged.
7. `npm run lint` and `npm run build` pass.

## Implementation boundary

The next `/develop` change should be limited to the reply feature, Supabase client setup, and documented SQL/configuration steps. It must not add unrelated backend or authentication layers.
