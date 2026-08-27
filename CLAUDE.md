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
- **@nuxtjs/i18n v10** — `prefix_except_default`, default `ru`, plus `en`.
  RU at `/`, EN at `/en/*`. UI strings in `i18n/locales/{ru,en}.json`.
  Canonical + hreflang come from `useLocaleHead()` wired in `app/app.vue`.
- **@nuxt/content v3** — `content.config.ts` defines Zod-checked collections
  (`about`, `experience`, `projects`). Locale is a required frontmatter field
  and the folder is `content/<locale>/…`. Broken frontmatter fails the build.
- **@nuxtjs/sitemap** + **@nuxtjs/robots** — multi-locale sitemap index at
  `/sitemap_index.xml`; robots points at it.
- **@nuxt/image**, **@vueuse/core**, **gsap** (free since 2025, ScrollTrigger
  included).
- **Playwright** e2e, **@axe-core/playwright** for a11y smoke.
- Native deps (`better-sqlite3`, `esbuild`, `lefthook`, `sharp`,
  `@parcel/watcher`) are allow-listed in `pnpm-workspace.yaml`
  (`onlyBuiltDependencies` + `allowBuilds`). If pnpm rewrites that file with
  `set this to true or false` placeholders, replace them with `true`.

## Architecture

- **One adaptive layout** — `app/layouts/default.vue`. The semantic baseline
  (plain header + `<main><slot/></main>`) is always in the SSR HTML. On a
  capable viewport, after the intro sets `booted`, the macOS chrome (wallpaper,
  menu bar, dock, window host) is layered on top behind `<ClientOnly>` and the
  plain header hides. `useDesktopMode()` (viewport + pointer + reduced-motion)
  is client-only, so no hydration mismatch.
  _(The spec describes two separate layouts; we merged them into one to keep
  SSR/CSR markup identical. Update the spec if this sticks.)_
- **`app/pages/index.vue`** — the only page. Renders `<IntroStage>` then the
  four sections. Both locales resolve to this page (`/` and `/en/`).
- **Sections** (`app/components/sections/*`) render plain semantic markup and
  take an `inWindow` prop. They're always in the page DOM (for SEO); the
  desktop window (`WindowHost` → `OsWindow`) renders a second instance of the
  active one. Shared `useAsyncData` keys mean data is fetched once.
- **`useSectionRouter`** is the single owner of "which section/project is
  open". It maps the URL hash (`#about`, `#projects/<slug>`) ⇄
  `activeSection` / `activeProject`. Don't track that state anywhere else.
- **`IntroStage`** owns the scroll choreography and writes `progress` (0–1) to
  `useIntroState`; `ScrubCanvas` just draws frame `round(progress * n)` and
  knows nothing about scroll. Non-cinematic (mobile / reduced-motion) →
  `IntroFallback` + immediate `boot()`.
  _Base-architecture note:_ progress is currently a scroll listener +
  `getBoundingClientRect`. The intro phase swaps this for GSAP ScrollTrigger
  (pin + scrub) per the spec. `FRAME_COUNT` in `IntroStage.vue` is `0` until
  `pnpm intro:frames` produces `public/intro/frames-*`.

## Rules

- **Content-first DOM.** Every H1/H2, project case body, and link must be in
  the prerendered HTML. Windows/Dock/intro are enhancement — they never hide
  content from a crawler or a no-JS visitor.
- Clickable = native `<button>` / `<a>`. Never `div` + `@click`. Keep
  focus-visible rings.
- Respect `prefers-reduced-motion` in every animation (GSAP, dock magnify,
  window/chrome transitions) — the CSS and `useDesktopMode` already gate on it,
  keep it that way.
- Animation library: **GSAP only**. Don't add others without discussion.
- No data in query params. Locale is expressed through the path.
- Images via `<NuxtImg>` / `<NuxtPicture>` with explicit `width`/`height`.
- Every new UI string goes into **both** `ru.json` and `en.json`.
- Components are auto-imported with **flat names** (`pathPrefix: false`):
  `app/components/os/MenuBar.vue` → `<MenuBar>`.
- TDD: add/adjust an `tests/e2e/*.spec.ts` with the feature.

## Adding a project

1. `content/ru/projects/<slug>.md` **and** `content/en/projects/<slug>.md`
   with frontmatter: `locale, title, slug, summary, cover?, tags, role?,
year?, stack, links{repo?,demo?}, order, featured`.
2. Put the cover image under `public/`.
3. `pnpm test:e2e` — a project window should open at `#projects/<slug>`.

## Adding a Dock item / section

1. Content file(s) under `content/<locale>/`.
2. Section component in `app/components/sections/`.
3. Entry in `app/app.config.ts` `dock` (and `sections` if it's a real
   section): `{ id, type: 'section' | 'link' | 'file', icon, href? }`.
4. Strings in both locale JSON files under `sections.*` / `dock.*`.

## Performance budgets

LCP < 2.5s (mobile), entry JS < ~180 KB gzip (excluding intro frames),
CLS ≈ 0. Intro frames lazy-load on viewport entry, never on the critical path.

## Not in v1

Multi-window, fake filesystem, separate project routes, contact form / server
routes, external CMS, blog, `nuxt-og-image` (removed for now — re-add in the
SEO phase; a static `/og/default.png` is referenced meanwhile).
