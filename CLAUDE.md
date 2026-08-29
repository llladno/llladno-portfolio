# CLAUDE.md

Personal portfolio — a **one-page** site with a macOS-desktop metaphor:
a scroll-scrub intro (image → laptop unfolds → "boot" into a desktop), then a
top menu bar + bottom Dock + glass windows. All content lives as sections of a
single page.

Full design doc: `docs/superpowers/specs/2026-08-27-portfolio-macos-design.md`
Inspiration list: see that spec's Appendix B.

## Commands

| Task                  | Command                                        |
| --------------------- | ---------------------------------------------- |
| Install               | `pnpm install`                                 |
| Dev server            | `pnpm dev`                                     |
| Static build          | `pnpm generate` (needs `NUXT_PUBLIC_SITE_URL`) |
| Preview the build     | `pnpm preview`                                 |
| Lint                  | `pnpm lint` (fix: `pnpm lint:fix`)             |
| Types                 | `pnpm typecheck`                               |
| E2E                   | `pnpm test:e2e` (UI: `pnpm test:e2e:ui`)       |
| Intro frames from mp4 | `pnpm intro:frames`                            |

`pnpm test:e2e` runs `pnpm generate && pnpm preview` first (see
`playwright.config.ts`) — it tests the real static output.

## Stack

- **Nuxt 4** + Vue 3 + TypeScript (strict). SSG via `nuxt generate`, Nitro
  `static` preset, all routes prerendered (`crawlLinks`).
- **Tailwind v4**, CSS-first. Tokens + the `glass` utility live in
  `app/assets/css/main.css` (`@theme`, `@utility`). No `tailwind.config.js`.
  `@theme` color/radius tokens auto-generate utilities (`text-muted`,
  `rounded-window`) — use those, not `[var(--…)]`.
- **ESLint** flat config (`eslint.config.mjs`) extends `@nuxt/eslint`
  (`stylistic: false` — formatting is Prettier's job, no rule overlap). Adds
  arrow-only, `id-length`, `no-magic-numbers`, and per-layer
  `no-restricted-imports` for FSD direction. **Prettier** (`.prettierrc.json`:
  no semis, single quotes, trailing commas, width 90). `lefthook` runs both on
  staged files pre-commit; CI runs `pnpm lint` + `pnpm typecheck`.
- **@nuxtjs/i18n v10** — `prefix_except_default`, default `ru`, plus `en`.
  RU at `/`, EN at `/en/*`. UI strings in `i18n/locales/{ru,en}.json`.
  Canonical + hreflang come from `useLocaleHead()` wired in `app/app.vue`.
- **Content = typed TS modules** in each entity's `model/data.ts` (no CMS, no
  `@nuxt/content`). `entities/profile` → `getProfile(locale)`,
  `entities/experience` → `getJobs(locale)`, `entities/project` →
  `getProjects(locale)` / `getProject(locale, slug)`. Sections call these
  synchronously in `setup` (local data, no `useAsyncData`). Project case bodies
  are a `CaseBlock[]` (`heading` / `paragraph` / `list` / `image`) rendered by
  `entities/project`'s `CaseBlocks`.
- **@nuxtjs/sitemap** + **@nuxtjs/robots** — multi-locale sitemap index at
  `/sitemap_index.xml`; robots points at it.
- **@nuxt/image**, **@vueuse/core**, **gsap** (free since 2025, ScrollTrigger
  included).
- **Playwright** e2e, **@axe-core/playwright** for a11y smoke.

## Architecture — light FSD

Layers under `app/`, outer → inner: **app → widgets → features → entities →
shared**. `app` = `pages/`, `layouts/`, `app.vue`, `error.vue`,
`app.config.ts`. Imports go **downward only** (ESLint enforces). No component
auto-import — everything is imported explicitly through a slice's `index.ts`.

```
app/
  shared/
    config/      i18n.ts (LOCALES, Locale), navigation.ts (SECTION_IDS, SectionId, DockItemConfig, SectionRegistry)
    lib/         clamp, use-desktop-mode, use-intro-state, use-seo-i18n  (+ index.ts barrel)
    ui/          GlassPanel/, TrafficLights/  — reusable dumb components
  entities/
    profile/     model/{types,data}  ui/AboutCard/            index.ts → AboutCard, getProfile, Profile
    project/     model/{types,data}  ui/{ProjectCard,CaseBlocks}/   index.ts → …, getProjects, getProject
    experience/  model/{types,data}  ui/ExperienceTimeline/   index.ts → …, getJobs, Job
  features/
    section-router/   model/use-section-router.ts   → useSectionRouter (owns hash ⇄ activeSection/activeProjectSlug)
    locale-switch/    ui/LocaleSwitch/
  widgets/
    intro-stage/    model/constants.ts (INTRO_STAGE_HEIGHT_VH, BOOT_PROGRESS_THRESHOLD, …)  ui/{IntroStage,ScrubCanvas,IntroCopy,IntroFallback}/
    desktop-shell/  model/constants.ts (CLOCK_REFRESH_MS, WALLPAPER_MIN_OPACITY, …)  ui/{DesktopShell,MenuBar,Dock,DockItem,MenuClock,OsWindow,WindowHost,Wallpaper}/
    site-sections/  ui/{About,Projects,Experience,Contact}Section/  index.ts → the 4 sections + SECTION_REGISTRY
  pages/index.vue      layouts/default.vue      app.vue  error.vue  app.config.ts
```

- **One adaptive layout** — `layouts/default.vue`. The semantic baseline (plain
  header + `<main><slot/></main>` with all 4 sections) is always in the SSR
  HTML. On a capable viewport, after the intro sets `booted`,
  `<DesktopShell :sections="SECTION_REGISTRY">` layers the macOS chrome on top
  behind `<ClientOnly>` and the plain header hides. `useDesktopMode()` is
  client-only → no hydration mismatch.
  _(The spec describes two layouts; merged into one to keep SSR/CSR markup
  identical.)_
- **`pages/index.vue`** — the only page; renders `<IntroStage>` + the 4
  sections. Both locales resolve here (`/` and `/en/`).
- **Section components** take an `inWindow` prop and wrap an entity's UI with
  the `<section id aria>` shell. Always in the page DOM (SEO); `WindowHost` →
  `OsWindow` renders a second instance of the active one from `SECTION_REGISTRY`.
- **`useSectionRouter`** is the single owner of "which section/project is open"
  — URL hash (`#about`, `#projects/<slug>`) ⇄ `activeSection` /
  `activeProjectSlug`. Don't track that state anywhere else.
- **`IntroStage`** owns the scroll choreography and writes `progress` (0–1) to
  `useIntroState`; `ScrubCanvas` just draws frame `round(progress * n)`.
  Non-cinematic → `IntroFallback` + immediate `boot()`.
  _Base note:_ progress is a scroll listener today; the intro phase swaps in
  GSAP ScrollTrigger. `FRAME_COUNT` in `intro-stage/model/constants.ts` is `0`
  until `pnpm intro:frames` produces `public/intro/frames-*`.

## Code standards

Enforced by ESLint (`eslint.config.mjs`) + the `code-standards` skill. Run
`/code-standards` (or the skill) before committing.

- **Arrow functions only** — never `function` (`func-style: expression`).
- **Folder per component** — `ui/Name/{Name.vue, types.ts, constants.ts, index.ts}`.
  Slice-wide types → `model/types.ts`; slice-wide constants → `model/constants.ts`.
- **Named constants, not magic numbers** — every meaningful literal (`0.9`,
  `350`, `30_000`, storage keys) is a `SCREAMING_SNAKE_CASE` const in a
  `constants.ts`. Bare-allowed: `-1, 0, 1, 2` and array indices.
- **Readable names** — no `p`, `e`, `el`, `ctx`, `idx`, `tmp`. Full words
  (`scrollProgress`, `event`, `canvas`, `index`). `id-length` min 3.
- **`~` imports only** — never `../` or `./`, in `.ts` or `.vue`, barrels
  included. `~` = `app/`.
- **Reusable components** — check `shared/ui/` before writing markup; repeated
  markup becomes a `shared/ui/` component.
- **Tailwind theme utilities** — `text-muted`, `bg-accent`,
  `border-glass-border`, `rounded-window` (auto-generated from `@theme`), not
  `text-[var(--color-muted)]`. Raw `var(--…)` only where no utility exists.
- **Content-first DOM** — every H1/H2, case body, and link is in the
  prerendered HTML; windows/dock/intro never hide content.
- Clickable = native `<button>` / `<a>`; keep focus-visible rings.
- Respect `prefers-reduced-motion` in every animation.
- Animation library: **GSAP only**.
- No data in query params; locale is in the path.
- Images via `<NuxtImg>` with explicit `width`/`height`.
- Every new UI string in **both** `ru.json` and `en.json`.
- TDD: add/adjust a `tests/e2e/*.spec.ts` with the feature.

## Adding a project

1. New entry in `app/entities/project/model/data.ts` (`PROJECTS`):
   locale-neutral fields + `content: { ru, en }`, each
   `{ title, summary, role?, blocks: CaseBlock[] }`.
2. Cover image → `public/`.
3. `pnpm test:e2e` — the project window opens at `#projects/<slug>`.

## Adding a Dock item / section

1. New entity slice (or reuse one) with `model/data.ts` getter + `ui/` card.
2. `app/widgets/site-sections/ui/<Name>Section/` wrapping that card; export it
   and add to `SECTION_REGISTRY` in `widgets/site-sections/index.ts`; render it
   in `pages/index.vue`.
3. Add the id to `SECTION_IDS` in `shared/config/navigation.ts` and an entry
   in `app/app.config.ts` `dock` (`{ id, kind, icon, href? }`).
4. Strings in both locale JSON files under `sections.*` / `dock.*`.

## Performance budgets

LCP < 2.5s (mobile), entry JS < ~180 KB gzip (excluding intro frames),
CLS ≈ 0. Intro frames lazy-load on viewport entry, never on the critical path.

## Not in v1

Multi-window, fake filesystem, separate project routes, contact form / server
routes, CMS / `@nuxt/content`, blog, `nuxt-og-image` (removed for now — re-add
in the SEO phase; a static `/og/default.png` is referenced meanwhile).

## Gotchas

- TypeScript pinned to `5.9.3` via `pnpm-workspace.yaml` `overrides` — TS 7
  breaks `typescript-eslint`. If pnpm rewrites `pnpm-workspace.yaml`'s
  `allowBuilds` block with `set this to true or false` placeholders, replace
  them with `true`.
- Native deps (`esbuild`, `lefthook`, `sharp`, `@parcel/watcher`) are
  allow-listed in `pnpm-workspace.yaml`.
- `pnpm test:e2e` reuses a running dev server on :3000 (`reuseExistingServer`).
  Kill stale ones (`lsof -ti:3000 | xargs kill`) if tests hit old content.
