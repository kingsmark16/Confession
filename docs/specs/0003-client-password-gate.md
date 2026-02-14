# 0003. Add a client password gate

**Date**: 2026-07-13
**Status**: In Progress

## Summary

Show a responsive password gate before the confession page is mounted. The build reads `SITE_PASSWORD`, converts it to a SHA-256 hash, and exposes only the hash to the browser. This is a privacy deterrent, not secure access control, because all client code can ultimately be inspected or changed by a visitor.

## Context

> ⚠️ Premise note: A browser only password check cannot provide real security. A determined visitor can inspect or modify the JavaScript and bypass the gate. Real protection requires hosting level access control or a server that refuses to send the page until access is verified.

The existing React application mounts the complete confession experience immediately. The requested enhancement adds an entry gate without a custom backend, database, authentication provider, or hosting service dependency.

The engineer accepts the client side limitation. The implementation should avoid placing the plain password in the generated bundle and should prevent accidental viewing through the normal interface.

## Requirements

**User stories**:

- As the site owner, I want visitors to enter a password before seeing the confession page.
- As an invited visitor, I want the password form to work clearly on mobile and desktop.

**Acceptance criteria**:

- **AC-1**: The confession page and music player are not mounted before the correct password is entered.
- **AC-2**: An incorrect password keeps the gate open and shows an accessible error message.
- **AC-3**: A correct password unlocks the page for the current browser tab.
- **AC-4**: Reloading an unlocked tab remains unlocked, while a new tab asks for the password again.
- **AC-5**: The gate fits narrow mobile screens and wide desktop screens without horizontal scrolling.
- **AC-6**: The password input has a visible label, keyboard focus, submit behavior, and a show or hide control.
- **AC-7**: A missing `SITE_PASSWORD` value fails closed and does not mount the confession page.
- **AC-8**: The generated browser bundle does not contain the plain `SITE_PASSWORD` value.
- **AC-9**: Reduced motion preferences disable nonessential gate animation.

## Options considered

### Option 1: Plain Vite environment variable comparison

Read a `VITE_*` password directly in React and compare it in the browser.

**Pros**:

- Minimal implementation.

**Cons**:

- Places the plain password in the public bundle.
- Very easy to discover through browser tools.

### Option 2: Build time password hashing

Read a non public environment variable in Vite configuration, inject only its SHA-256 hash, then hash the visitor input in the browser.

**Pros**:

- Keeps the plain password out of the generated bundle.
- Requires no backend or database.

**Cons**:

- The gate can still be bypassed by modifying client code.
- Weak passwords can still be guessed offline from the exposed hash.

### Option 3: Hosting level access control

Use the deployment platform to require access before serving the application files.

**Pros**:

- Provides a real security boundary.
- Keeps the application code unavailable to unauthorized visitors.

**Cons**:

- Depends on the selected hosting platform and may require a paid plan.
- Does not satisfy the requested application styled password popup by itself.

## Decision

**Chosen option**: Option 2: Build time password hashing

Use a responsive React gate as an accepted privacy deterrent. Vite reads `SITE_PASSWORD` during the build and injects only a SHA-256 hash. Successful access is stored in `sessionStorage` for the current tab.

**Implementation skills**: `develop` (`JavaScript-Mastery-Pro/skills`, `.agents/skills/develop/`)

## Rationale

Build time hashing is the strongest implementation available within the stated browser only constraint. It avoids the most obvious failure of shipping the plain password while keeping the project static. Hosting level access control remains the correct option if the requirement later changes from deterrence to security.

## Feature design

**Data model sketch**:

No persisted application data is added. `sessionStorage` stores one boolean unlock marker scoped to the current tab.

**State transitions**:

`locked` → `checking` → `unlocked`. An invalid password returns `checking` to `locked` with an error. Missing configuration remains `locked`.

**API surface**:

None.

**Key invariants**:

- The confession component tree is not mounted while locked.
- The plain password is never assigned to a `VITE_*` variable or injected into browser code.
- Only a successful hash comparison writes the session unlock marker.
- The gate remains usable without animation.

**Security model**:

This feature provides casual privacy only. It does not authenticate identity, protect static assets, stop source inspection, or resist a determined attacker.

**Configuration required**:

- `SITE_PASSWORD`: plain password read by Vite only during development and build.

**Critical test scenarios**:

- Correct password unlocks and mounts the page, verifies **AC-1**, **AC-3**, and **AC-8**.
- Incorrect password stays locked with an announced error, verifies **AC-2**.
- Reload and new tab behavior follows session scope, verifies **AC-4**.
- Missing configuration stays locked, verifies **AC-7**.
- Mobile, keyboard, and reduced motion checks verify **AC-5**, **AC-6**, and **AC-9**.

## Build plan

1. Add the Vite build time hash definition and TypeScript declaration, satisfies **AC-7** and **AC-8**.
2. Build the password gate component with session state, accessible form behavior, and show or hide control, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, and **AC-6**.
3. Add responsive pop art styling and reduced motion support, satisfies **AC-5** and **AC-9**.
4. Gate application mounting in `App.tsx` and verify lint and production build, satisfies **AC-1** through **AC-9**.

## Consequences

**Positive**:

- Casual visitors cannot reach the confession through the normal interface without the password.
- The plain password is absent from the generated browser bundle.
- No backend or database is added.

**Negative / tradeoffs**:

- A determined visitor can bypass the gate.
- Static assets remain directly accessible if their URLs are known.
- Changing the password requires a new deployment.

**Neutral**:

- Access lasts only for the current browser tab.

## Follow-up

- [ ] Move protection to the hosting layer if real access control becomes necessary.

## Migration plan

**Strategy**: No migration needed.

**Phases**:

1. Add the build configuration and gate.
2. Deploy with `SITE_PASSWORD` configured in the hosting environment.

**Rollback**: Revert the gate and Vite hash definition.

**Risks**: A missing deployment variable intentionally leaves the site locked.
