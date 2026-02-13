# Confession

This is a static, public pop art love confession page. It is a browser only React experience with no API, server, database, authentication, environment configuration, form submission, or persisted visitor data. Work as a senior React and TypeScript frontend engineer, and do not invent backend layers the repository does not contain.

## Stack

- **Language and runtime**: TypeScript 5.9 in the browser. Node.js is build tooling only, and its version is not pinned.
- **Framework**: React 19 with Vite 8 beta.
- **UI**: Handwritten CSS and Lucide React. Tailwind 4, Radix UI, and shadcn related packages are installed, but the current product UI does not use their components or utility classes.
- **Package manager**: npm, with `package-lock.json`.

## Build approach

`<TBD, set by /scope>`. Until `/scope` records a project default, follow the governing spec and make the smallest complete change that preserves the working page.

## Commands

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

In Windows PowerShell environments that block `npm.ps1`, use `npm.cmd` with the same arguments. There is currently no test command.

## Project map and sources of truth

- [The page spec](docs/specs/0001-pop-art-confession.md) is the behavior and acceptance contract. [design.md](design.md) and the files in `stitch/` are visual references. Runtime implementation belongs in `src/`, never in the exported Stitch files.
- [src/README.md](src/README.md) defines the feature based boundaries. `src/main.tsx` starts `src/app/App.tsx`, which composes `src/features/confession/ConfessionPage.tsx`.
- Keep the page, its components, static data, browser behavior, and feature CSS in `src/features/confession/`. Promote code to `src/components/` only after real reuse across features.
- `src/styles/index.css` is the runtime stylesheet entry, and `src/styles/tokens.css` owns design tokens. The `src/index.css` references in `design.md` and `components.json` are stale.
- Stable URL assets belong in `public/`; imported assets belong in `src/assets/`. Gallery images must remain local under `public/images/memories/`. The root `README.md` is still Vite template text, not product guidance.

## Rules

- Keep TypeScript strict and free of unused code. Match nearby style: single quotes, no semicolons, trailing commas, small function components, and named exports except for the existing default `App` export.
- Keep component props typed beside the component. Keep content collections and their types in the feature data module. Put shared browser behavior in focused hooks.
- The `@/*` alias exists, but current source uses relative imports. Match the surrounding area. Do not assume the missing `src/lib`, `src/components/ui`, or `src/hooks` alias targets already exist.
- Preserve the specified section order, anchor IDs, local gallery paths, and static page behavior unless a new spec changes them.
- Preserve semantic HTML, useful alt text, labelled navigation, keyboard access, visible focus, live announcements, decorative icon hiding, responsive layouts, and reduced motion behavior.
- Extend the existing CSS custom properties and feature stylesheet. Do not migrate the page to Tailwind, Radix, shadcn, or another styling system merely because related packages are installed.
- Treat a new API, persistence layer, provider, data model, authentication flow, or full page redesign as a load bearing decision. Route it through `/architect` before `/develop`.
- Do not expose or commit credentials from ignored local tool configuration. Do not edit `node_modules/` or `dist/`; both are generated.

## Verification

- Run `npm run lint` and `npm run build` after source changes. For UI changes, also check narrow and wide layouts, keyboard focus, section links, local images, and reduced motion.
- No automated tests or `test-preferences.json` exist yet. Do not claim test coverage. `/test` owns choosing and recording the test setup when tests are requested.
- The root `.git` directory is currently empty. Git based skills cannot derive a diff or history, so never invent one; use explicit file scope until Git is initialized.

## Workflow

For a planned feature, use `/scope` then `/architect`, `/develop`, `/check verify`, `/test`, `/check review`, optional `/document`, and finally `/sync`. Use `/debug` when behavior is broken and the cause is not obvious. Use `/audit` when project context or an established area is missing or stale. Skip a stage only when its own skill allows it.

## Agent skills

- [scope](.agents/skills/scope/): `JavaScript-Mastery-Pro/skills`, plans and reconciles product work in `docs/scope/` without choosing implementation tools.
- [architect](.agents/skills/architect/): `JavaScript-Mastery-Pro/skills`, resolves load bearing decisions and owns build specs in `docs/specs/`; it does not write application code.
- [audit](.agents/skills/audit/): `JavaScript-Mastery-Pro/skills`, creates or restructures durable `AGENTS.md` context and documents established areas.
- [develop](.agents/skills/develop/): `JavaScript-Mastery-Pro/skills`, builds approved UI or logic, updates its feature progress, and routes undecided architecture back to `/architect`.
- [check](.agents/skills/check/): `JavaScript-Mastery-Pro/skills`, runs real application verification or a fresh model code review; it never fixes application code.
- [test](.agents/skills/test/): `JavaScript-Mastery-Pro/skills`, owns test preferences and tests for changed code; it does not modify application code.
- [debug](.agents/skills/debug/): `JavaScript-Mastery-Pro/skills`, proves a root cause, applies the smallest fix, verifies it, and hands regression coverage to `/test`.
- [document](.agents/skills/document/): `JavaScript-Mastery-Pro/skills`, writes PR text, changelog entries, release notes, or postmortems from real repository evidence.
- [sync](.agents/skills/sync/): `JavaScript-Mastery-Pro/skills`, performs the final surgical update of context, scope progress, and spec status after a completed change.

## Context files

- No nested `AGENTS.md` is warranted for the current small, single feature source tree.

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
