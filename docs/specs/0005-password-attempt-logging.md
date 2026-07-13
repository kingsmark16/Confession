# Password Attempt Logging

**Status**: Proposed

## Summary

Record every password submitted to the opening gate in Supabase. Each record stores the exact entered text, whether it matched, the anonymous browser ID, and the timestamp. The records are private to the owner and remain until manually deleted.

## Context

The owner wants to inspect all password attempts, including incorrect entries, while preserving the current browser only password gate. This introduces sensitive plaintext storage, so the feature must keep reads private and must never block access when tracking is unavailable.

## Requirements

- **AC-1**: Every password submission creates one row containing the exact submitted text, `is_correct`, anonymous ID, and creation timestamp.
- **AC-2**: Correct and incorrect attempts are both recorded.
- **AC-3**: Anonymous visitors can insert attempts but cannot read or delete them from the public client.
- **AC-4**: The password gate continues normally when Supabase is unavailable or logging fails.
- **AC-5**: Existing password validation, session unlock behavior, and responsive gate UI remain unchanged.
- **AC-6**: `npm.cmd run lint` and `npm.cmd run build` pass.

## Decision

**Chosen option**: Store every plaintext attempt with a correctness flag in a private Supabase table.

Add `recordPasswordAttempt(passwordText, isCorrect)` and call it for every password form submission.

## Rationale

This matches the owner’s explicit need to inspect the exact attempts and distinguish accepted from rejected entries. The browser flow remains authoritative for unlocking, while logging is best effort and cannot prevent the visitor from continuing.

## Feature design

**Data model sketch**:

Table `public.password_attempts`:

- `id uuid primary key default gen_random_uuid()`
- `password_text text not null`
- `is_correct boolean not null`
- `anonymous_id text not null`
- `created_at timestamptz not null default now()`
- No relationship to `responses` or `views`

**State transitions**:

No state machine. Each submit creates an immutable attempt row.

**API surface**:

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `recordPasswordAttempt(passwordText, isCorrect)` | client helper | `passwordText: string` required, `isCorrect: boolean` required | `void` | Supabase `anon` key; no user auth | Supabase or network error logged and swallowed |

**Key invariants**:

- Every submit is an independent row, including repeated values.
- The stored text is exactly the submitted text.
- `is_correct` reflects the gate comparison result.
- Attempt rows are never updated by the public client.

**Security model**:

- Role `anon` may insert rows only.
- Role `anon` has no select, update, or delete policy.
- The owner reads rows through the authenticated Supabase Dashboard.
- Plaintext password data is sensitive and must not be rendered, logged, or returned by the application.

**Configuration required**:

No new environment variables. Reuse the existing Supabase URL and publishable key.

**Critical test scenarios**:

- Happy path: submit a correct password and an incorrect password, then confirm two rows with matching text and flags, verifies **AC-1**, **AC-2**.
- Failure case: make the Supabase insert fail and confirm the gate still accepts or rejects the password normally, verifies **AC-4**, **AC-5**.
- Auth/permission: an anonymous client cannot select or delete attempt rows, verifies **AC-3**.

## Build plan

1. Create the `public.password_attempts` table and insert only RLS policy, satisfying **AC-1**, **AC-2**, **AC-3**.
2. Add `recordPasswordAttempt(passwordText, isCorrect)` using the existing Supabase client and anonymous ID helper, satisfying **AC-1**, **AC-4**.
3. Call the helper on every password submit without changing unlock behavior, satisfying **AC-2**, **AC-4**, **AC-5**.
4. Document the SQL and run lint and build, satisfying **AC-6**.

## Consequences

**Positive**:
- The owner can inspect the full password attempt history.
- Correct and incorrect submissions are easy to distinguish.

**Negative / tradeoffs**:
- Plaintext passwords are highly sensitive and remain in the database until manual deletion.
- Anonymous clients can fabricate attempt rows because there is no authenticated user identity.

**Neutral**:
- This feature adds no public analytics or admin UI.

## Follow-up

- [ ] Apply the SQL migration in the Supabase SQL Editor and confirm the table and RLS policies are live.
