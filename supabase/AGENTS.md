# Supabase server functions

- `functions/record-page-view/index.ts` is the public page view endpoint used by `src/features/confession/lib/views.ts`.
- Keep the function anonymous and validate its fixed page key and UUID shaped browser identifier at the boundary.
- Use Supabase's built in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets only inside the Edge Function. Never expose the service role key to Vite or the browser.
- Read the forwarded visitor IP only in memory for the `ipwho.is` lookup. Request only country and city fields. Persist only nullable `country` and `city` values. Never log or store the raw IP, exact coordinates, or provider payload.
- Keep CORS handling, short provider timeouts, duplicate page view handling, and failure isolation intact.
- Deploy with `supabase functions deploy record-page-view` after linking the project. See [README.md](../README.md) and [docs/specs/0004-unique-page-views.md](../docs/specs/0004-unique-page-views.md).

_Drafted by /sync from the introducing change, worth a quick human pass._
