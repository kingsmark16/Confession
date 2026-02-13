# Source structure

The source tree uses feature based boundaries.

## Folders

`app` contains application bootstrap and composition.

`components/layout` contains shared page chrome such as navigation and footer.

`features` contains user facing product areas. Each feature keeps its page, components, data, hooks, and feature styles together.

`styles` contains global CSS, design tokens, and the stylesheet entry point.

`assets` contains static files imported by source code. Public files that need a stable URL live under `public`.

## Rules

Keep feature specific code inside its feature folder. Promote a component to `components` only when more than one feature needs it. Keep content collections and types in the feature data module. Keep browser side behavior in a feature hook when it is shared by more than one feature component.
