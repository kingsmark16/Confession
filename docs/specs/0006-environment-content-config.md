# 0006. Keep private page configuration out of source

**Date**: 2026-08-25
**Status**: In Progress

## Summary

Move the personal recipient name, author name, signature, and letter text out of tracked source files and into the local environment configuration. Keep the existing password flow based on the non public `SITE_PASSWORD` variable. This keeps personal values out of GitHub, but the recipient and letter still appear in the browser because the public page must render them.

## Context

> ⚠️ Premise note: Environment variables in a browser build do not hide values from visitors. They only keep values out of the repository source. The recipient and letter are intentionally public page content, while the password is hashed before browser code receives it.

The recipient and letter message are currently literal values in `src/features/confession/letter.data.ts`. The password is already read from `SITE_PASSWORD` in `vite.config.ts`, and only its hash is defined for browser code. The repository ignores `.env`, so local values can remain outside tracked files.

## Requirements

**User stories**:

- As the page owner, I want personal copy kept out of tracked source files so it is not exposed on GitHub.
- As a visitor, I want the page to render the same recipient, letter, and password gate after configuration is supplied.

**Acceptance criteria**:

- **AC-1**: The recipient is read from `VITE_LETTER_RECIPIENT` wherever it is displayed and no personal recipient literal remains in tracked source code.
- **AC-2**: The letter is read from `VITE_LETTER_MESSAGE` and no personal letter literal remains in tracked source code.
- **AC-3**: The password continues to be read from `SITE_PASSWORD` during the Vite build and no plaintext password is added to tracked source code.
- **AC-4**: The author and signature are read from `VITE_LETTER_AUTHOR` and `VITE_LETTER_SIGNATURE`, and no personal author or signature literal remains in tracked source code.
- **AC-5**: A missing required letter variable stops the Vite build with a clear configuration error instead of silently rendering incomplete personal copy.
- **AC-6**: `.env.example` documents all required variable names with blank or placeholder values and contains no personal content or real password.
- **AC-7**: The configured page keeps its current letter pagination, personal copy display, password gate behavior, lint result, and production build behavior.

## Options considered

### Option 1: Move values into environment configuration

Read the recipient and letter from public Vite variables, and keep the password in the existing non public build variable.

**Pros**:

- Removes the personal values from GitHub tracked source.
- Fits the existing Vite configuration and static page.
- Requires no server, database, or hosting change.

**Cons**:

- Public Vite variables are still included in the browser bundle.
- A new deployment or local configuration is needed when the copy changes.

### Option 2: Keep the current literals and rely on repository access

Leave the content in the TypeScript data file and protect the repository through account permissions.

**Pros**:

- No runtime or build change.

**Cons**:

- Does not meet the request to keep personal content out of GitHub.

### Option 3: Move the page behind server access control

Serve the content only after a hosting or server authorization check.

**Pros**:

- Can provide real secrecy from unauthorised visitors.

**Cons**:

- Changes the browser only architecture and deployment model.
- Is not needed for the stated goal of keeping values out of GitHub.

## Decision

**Chosen option**: Option 1, move personal page configuration into environment variables.

Use `VITE_LETTER_AUTHOR`, `VITE_LETTER_RECIPIENT`, `VITE_LETTER_MESSAGE`, and `VITE_LETTER_SIGNATURE` for public page content. Keep `SITE_PASSWORD` as a non public build variable, hash it in `vite.config.ts`, and expose only the hash to the password gate. Validate required letter variables during Vite startup and build.

**Implementation skills**: `develop` (`JavaScript-Mastery-Pro/skills`, `.agents/skills/develop/`)

## Rationale

The requested boundary is GitHub source visibility, not browser secrecy. The existing ignored `.env` and Vite build already support that boundary. A direct refactor is small, reversible, and preserves the static application without inventing a server layer.

## Feature design

**Data model sketch**:

No database or persisted browser data is added. The configuration values are build inputs only.

| Configuration | Required | Read by | Browser visibility |
|---|---|---|---|
| `VITE_LETTER_RECIPIENT` | yes | React through Vite | public, required to render the page |
| `VITE_LETTER_MESSAGE` | yes | React through Vite | public, required to render the page |
| `SITE_PASSWORD` | yes for an unlocked deployment | Vite config only | plaintext stays out of browser code, hash remains inspectable |

**State transitions**:

No new runtime state. Missing letter configuration fails before the application runs. Password state continues to use the existing locked and unlocked flow.

**API surface**:

None. No network endpoint is added.

**Key invariants**:

- Personal author, recipient, signature, and letter values do not appear as literals in tracked TypeScript files.
- `.env` remains ignored and `.env.example` contains no real values.
- The password is never read through a `VITE_*` variable.
- The browser receives the recipient and letter because they must be displayed.
- The browser receives only the password hash, not the plaintext password.
- Missing required letter configuration fails loudly during Vite startup or build.

**Security model**:

This change protects repository source visibility only. It does not protect rendered letter content from visitors or provide secure access control. The existing password gate remains a casual privacy deterrent. The existing password attempt logging feature stores submitted password text in Supabase and is a separate sensitive data concern that should be removed or redesigned before treating the gate as secure.

**Configuration required**:

- `VITE_LETTER_AUTHOR`: the author name displayed in the footer.
- `VITE_LETTER_RECIPIENT`: the recipient displayed in the navigation and letter.
- `VITE_LETTER_MESSAGE`: the full letter text, including paragraph breaks.
- `VITE_LETTER_SIGNATURE`: the signature displayed at the end of the letter.
- `SITE_PASSWORD`: the password read only by the Vite build configuration.
- Existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` remain unchanged.

**Critical test scenarios**:

- Build with all required variables and confirm the current personal copy, letter pages, and password gate render, verifies **AC-1**, **AC-2**, **AC-3**, **AC-4**, and **AC-7**.
- Remove a required letter variable and confirm Vite reports a clear configuration error, verifies **AC-5**.
- Inspect tracked source and `.env.example` and confirm no personal content or plaintext password is present, verifies **AC-1**, **AC-2**, **AC-4**, and **AC-6**.
- Run lint and production build with local configuration, verifies **AC-7**.

## Build plan

1. Add required configuration validation and the public letter environment variable declarations, satisfying **AC-1**, **AC-2**, **AC-3**, **AC-4**, and **AC-5**.
2. Replace hardcoded personal copy with environment reads while preserving pagination and displayed behavior, satisfying **AC-1**, **AC-2**, **AC-4**, and **AC-7**.
3. Add `.env.example` with safe placeholders and verify ignored local configuration, source inspection, lint, and production build, satisfying **AC-3**, **AC-5**, **AC-6**, and **AC-7**.

## Consequences

**Positive**:

- Personal values are no longer committed in the source files.
- The static page architecture stays unchanged.
- Local development and deployment configuration have an explicit template.

**Negative / tradeoffs**:

- The letter and recipient remain visible to anyone who loads the page.
- A deployment without the required variables fails instead of showing fallback copy.
- The password hash and client gate remain inspectable and bypassable by a determined visitor.

**Neutral**:

- Changing copy requires changing the environment configuration and rebuilding.

## Follow-up

- [ ] Remove or redesign plaintext password attempt logging before treating the password gate as secure.

## Migration plan

**Strategy**: Direct replacement, with no data migration.

**Phases**:

1. Copy the current recipient and message into ignored local environment configuration.
2. Switch the letter data module to read those variables.
3. Verify the configured build and source visibility.

**Rollback**: Restore the letter constants and remove the new public letter variables if the configured build cannot be restored.

**Risks**: A missing or malformed multiline environment value can prevent the app from starting. The example file and explicit validation reduce this risk.
