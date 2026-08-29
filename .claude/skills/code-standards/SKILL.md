---
name: code-standards
description: Review portfolio code against this project's standards — FSD layering, arrow-only functions, folder-per-component with types/constants in model/, readable names, named constants instead of magic numbers, `~` imports only, Tailwind theme utilities. Use before committing, when reviewing a diff, or when asked to "check standards" / "проверь на соответствие стандартам".
---

# Code standards review

Check changed (or named) files against the rules below. Report violations
grouped by rule, each with `file:line`, the offending snippet, and the fix.
Run `pnpm lint` and `pnpm typecheck` first — they catch the mechanical rules;
this skill covers what the linter can't judge (naming quality, layer intent,
component decomposition).

## 1. Architecture — light FSD

Layers under `app/`, outer → inner: **app → widgets → features → entities → shared**.
(`app` = `pages/`, `layouts/`, `app.vue`, `error.vue`, `app.config.ts`.)

- Imports go **downward only**. A widget may use features/entities/shared; an
  entity may not import a feature or widget; shared imports nothing from above.
  (ESLint `no-restricted-imports` enforces the direction.)
- Cross-slice imports go through the slice's **public API** (`index.ts` for a
  slice, or `shared/<segment>` / `shared/<segment>/<file>` for shared). Never
  deep-import another slice's `model/` or `ui/Foo/` internals.
- Intra-slice imports are allowed to reach into `model/` and sibling `ui/`.
- A slice owns: `ui/` (components), `model/` (types, constants, data, stores),
  `lib/` (slice-local helpers), `index.ts` (public API).
- New cross-cutting primitive → `shared/`. New domain noun → `entities/`.
  New user-facing capability → `features/`. New composed page block → `widgets/`.

## 2. Every component is a folder

`ui/ComponentName/` containing:

- `ComponentName.vue`
- `types.ts` — the component's prop/emit/local types (when non-trivial)
- `constants.ts` — the component's literals (when it has any)
- `index.ts` — `export { default as ComponentName } from './ComponentName.vue'`

Shared types for a whole slice live in `model/types.ts`; shared constants in
`model/constants.ts`. Never inline a type or a tunable number that another file
in the slice also needs.

## 3. Functions are arrow functions

`const doThing = () => {}` — never `function doThing() {}`, never
`const doThing = function () {}`. Applies to composables, helpers, handlers,
comparators. Order `const` declarations so a helper is defined before the one
that calls it (no hoisting). Object/class method shorthand is fine.

## 4. Reusable components

Before adding markup, check `shared/ui/` for an existing primitive
(`GlassPanel`, `TrafficLights`, …). Repeated markup (a styled panel, a chip, a
button variant) becomes a `shared/ui/` component, not a copy-paste.

## 5. Names read like prose

Reject single/opaque identifiers: `p`, `e`, `el`, `ctx`, `idx`, `fn`, `cb`,
`tmp`, `data2`, `arr`. Use the full word: `scrollProgress`, `event`, `canvasEl`
→ `canvas`, `context`, `index`, `handler`. A reader should not have to look up
what a variable holds.

Bad:

```ts
const p = total > 0 ? scrolled / total : 0
setProgress(p)
if (p >= 0.9 && !booted.value) boot()
```

Good:

```ts
const scrollProgress = scrollableDistance > 0 ? scrolledPast / scrollableDistance : 0
setProgress(scrollProgress)
if (scrollProgress >= BOOT_PROGRESS_THRESHOLD && !booted.value) boot()
```

## 6. No magic numbers or strings

Any literal with meaning goes into a named `const` (SCREAMING_SNAKE_CASE),
placed in the slice's `model/constants.ts` or the component's `constants.ts`.
This includes thresholds (`0.9`), sizes (`350`, `1280`), durations (`30_000`),
storage keys, animation multipliers. Allowed bare: `-1`, `0`, `1`, `2`, and
array indices.

## 7. Imports use the `~` alias

Never `../` or `./` in `.ts` / `.vue` (including `index.ts` barrels). Always
`~/shared/...`, `~/entities/...`, etc. `~` resolves to `app/`.

## 8. Styling uses Tailwind theme utilities

`@theme` tokens in `app/assets/css/main.css` auto-generate utilities. Use
`text-muted`, `bg-accent`, `border-glass-border`, `rounded-window` — not
`text-[var(--color-muted)]`. Raw `var(--…)` is only for multi-stop gradients
and other things with no utility form. The `glass` surface is the `@utility glass`.

## 9. i18n & a11y (carried from CLAUDE.md)

Every new UI string in **both** `i18n/locales/ru.json` and `en.json`.
Clickable = native `<button>` / `<a>`. Respect `prefers-reduced-motion` in
every animation. Content-first DOM — nothing hides content from a crawler.

## Report format

```
## <rule name>
- app/widgets/foo/ui/Bar/Bar.vue:12 — `const p = …`
  → rename to `scrollProgress`; extract `0.9` to BOOT_PROGRESS_THRESHOLD in model/constants.ts
```

End with `pnpm lint` / `pnpm typecheck` status. If clean, say so in one line.
