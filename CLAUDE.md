# CLAUDE.md

Personal portfolio — a **one-page** site with a macOS-desktop metaphor:
a scroll-driven intro (portrait photo → camera pushes into the laptop screen →
its glow "boots" into a desktop), then a
top menu bar + bottom Dock + glass windows. All content lives as sections of a
single page.

Full design doc: `docs/superpowers/specs/2026-08-27-portfolio-macos-design.md`
Inspiration list: see that spec's Appendix B.

## Commands

| Task              | Command                                        |
| ----------------- | ---------------------------------------------- |
| Install           | `pnpm install`                                 |
| Dev server        | `pnpm dev`                                     |
| Static build      | `pnpm generate` (needs `NUXT_PUBLIC_SITE_URL`) |
| Preview the build | `pnpm preview`                                 |
| Lint              | `pnpm lint` (fix: `pnpm lint:fix`)             |
| Types             | `pnpm typecheck`                               |
| E2E               | `pnpm test:e2e` (UI: `pnpm test:e2e:ui`)       |

`pnpm test:e2e` runs `pnpm generate && pnpm preview` first (see
`playwright.config.ts`) — it tests the real static output.

## Stack

- **Nuxt 4** + Vue 3 + TypeScript (strict). SSG via `nuxt generate`, Nitro
  `static` preset, all routes prerendered (`crawlLinks`).
- **Tailwind v4**, CSS-first. Tokens + the `glass` / `wallpaper-surface` /
  `card` utilities live in `app/assets/css/main.css` (`@theme`, `@utility`). No
  `tailwind.config.js`. `@theme` color/radius tokens auto-generate utilities
  (`text-muted`, `bg-surface`, `border-line`, `rounded-card`) — use those, not
  `[var(--…)]` — including `font-display` (Hanken Grotesk, loaded via a Google
  Fonts `<link>` in `nuxt.config.ts` `app.head`; body stays on `--font-sans`).
  **Identity: "Signal"** — a hot orange (`#FF7A1A` brand fill) keyed to the
  intro glow, on a cool near-neutral ground. **Dual-theme**: the bare `:root`
  is the full **light** palette (warm paper, burnt-orange accent for contrast);
  **dark Signal** is layered on via `@media (prefers-color-scheme: dark)
:root:not([data-theme='light'])` and `:root[data-theme='dark']`. Style through
  the tokens so all three states (system / explicit-light / explicit-dark) work.
- **Theme toggle** — `useTheme()` (`shared/lib`, `{ theme, toggle }`, light/dark)
  - `<ThemeToggle>` (`features/theme-switch`) in the menu bar and the plain
    header (`<ClientOnly>`). First visit follows the OS (no attribute written);
    toggling pins `<html data-theme>` + `localStorage['portfolio:theme']`. A tiny
    inline `<head>` script (`nuxt.config.ts`) re-applies the stored choice before
    first paint — no flash.
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
  `entities/project`'s `CaseBlocks`. Real content lives here (drawn from the
  owner's CV); `public/resume/{ru,en}.pdf` are the résumé downloads.
- **`useIdentity()`** (`shared/lib`) — the person's `name` / `role` resolved for
  the active locale, plus `email`. `app.config.ts` holds `identity`
  (`name`/`role` are `{ ru, en }`), `socials`, and the Dock layout.
- **@nuxtjs/sitemap** + **@nuxtjs/robots** — multi-locale sitemap index at
  `/sitemap_index.xml`; robots points at it.
- **@nuxt/image**, **@vueuse/core**, **gsap** (free since 2025, ScrollTrigger
  included), **lenis** (momentum scroll — `app/plugins/lenis.client.ts`, skipped
  under reduced motion; also intercepts `#anchor` clicks).
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
    lib/         clamp, use-desktop-mode, use-deck-state, use-intro-state, use-theme, use-seo-i18n  (+ index.ts barrel)
    ui/          GlassPanel/, TrafficLights/, SectionShell/, Chip/  — reusable dumb components
  entities/
    profile/     model/{types,data}  ui/AboutCard/            index.ts → AboutCard, getProfile, Profile
    project/     model/{types,data}  ui/{ProjectCard,CaseBlocks}/   index.ts → …, getProjects, getProject
    experience/  model/{types,data}  ui/ExperienceTimeline/   index.ts → …, getJobs, Job
  features/
    section-router/   model/use-section-router.ts   → useSectionRouter (owns hash ⇄ activeSection/activeProjectSlug)
    locale-switch/    ui/LocaleSwitch/
    theme-switch/     ui/ThemeToggle/   (state in shared/lib/use-theme.ts)
  widgets/
    intro-stage/    model/constants.ts (INTRO_STAGE_HEIGHT_VH, PARALLAX_*, BOOT_*_THRESHOLD, TL_PHOTO_FADE_*, INTRO_STATS_*, …)  ui/{IntroStage,HeroLayer,IntroCopy,IntroStats,IntroFallback}/
    desktop-shell/  model/constants.ts (CLOCK_REFRESH_MS, WALLPAPER_*, DOCK_MAGNIFY_*, …)  ui/{DesktopShell,MenuBar,Dock,DockItem,MenuClock,Wallpaper}/
    window-deck/    model/{constants.ts (DECK_*, WINDOW_*), types.ts}  ui/{WindowDeck,DeckWindow}/  — the scroll-driven window cascade
    projects-finder/  model/{constants.ts, file-meta.ts}  ui/{ProjectFinder,ProjectFileGrid,ProjectFile,ProjectInspector,FileGlyph}/  — the Portfolio window's Finder
    site-sections/  ui/{About,Experience,Projects}Section/  index.ts → the 3 sections + SECTION_REGISTRY
  pages/index.vue   layouts/default.vue   router.options.ts   app.vue  error.vue  app.config.ts
```

- **One adaptive layout** — `layouts/default.vue`. The semantic baseline (plain
  header + `<main><slot/></main>` with all 4 sections stacked) is always in the
  SSR HTML. On a capable viewport `<DesktopShell>` (wallpaper + menu bar + Dock)
  layers on top behind `<ClientOnly>` and the plain header hides.
  `useDesktopMode()` is client-only → no hydration mismatch.
- **The OS background** — `<Wallpaper>` is a `fixed inset-0 -z-10` layer that
  reveals as the intro photo dissolves (opacity tracks `progress`, full by
  `WALLPAPER_REVEAL_END`) and then **stays put behind every section** for the
  rest of the page. `<main>` has no background of its own.
- **`pages/index.vue`** — SSR + first client paint render the **plain stack**
  (`about` / `experience` / `projects`, in the HTML for SEO). After mount, on a
  capable viewport, `<WindowDeck :sections="SECTION_REGISTRY">` takes over;
  reduced motion / mobile keep the stack. Both locales resolve here.
- **`WindowDeck`** — a `count × DECK_WINDOW_SCROLL_VH`-tall stage with a
  `position: sticky` inner layer. A scroll listener writes `deckProgress` (0–1)
  to `useDeckState`; each section's `DeckWindow` gets a `focus` (0–1) from it —
  sharp/opaque/on-top when focused, blurred + dimmed + shrunk + cascaded-away
  when not (and `pointer-events: none` below `INTERACTIVE_OPACITY`). The first
  `DECK_DESKTOP_LEAD` of scroll is the **bare desktop** (no window focused —
  `<DesktopSurface>` shows). Neighbouring spans overlap (`WINDOW_SPAN_OVERLAP`),
  so mid-scroll one window closes behind the next; multiple visible at once by
  design. The focused window's id → URL hash (`router.replace`, no scroll —
  `router.options.ts`). `.deck-stage` / `.deck-pin` are `pointer-events: none` —
  only the focused window opts back in — so clicks on empty wallpaper reach
  `<DesktopSurface>`.
- **Two ways to focus a window.** _Scroll_ — the cascade above. _Directly_ —
  `open(id)` (desktop folder, menu bar, deep link) sets `forcedSectionId` in
  `useDeckState`: that window snaps to full focus **on top of the deck without
  moving the page** (`DECK_DESKTOP_LEAD` stays put; `DeckWindow :animated` eases
  it for `FORCE_TRANSITION_MS`). The `watch(route.hash)` only forces open when
  the target isn't _already_ the scroll leader (`scrollFocusFor >= 0.5`) — so
  `readProgress` writing its own hash doesn't recursively force-open every
  window you scroll past. Deep link jumps the page (no animation) past the
  intro first, then forces.
- **Closing a window** — red traffic light / Escape → `onClose`: a _forced_
  window just drops (page never moved); a _scroll-focused_ one gets
  `scrollDeckToTop()` (instant jump to the bare desktop). Any real wheel/touch
  gesture on the wallpaper also releases a forced window (`onScrollGesture`,
  ignored when the gesture starts inside `.deck-window`).
- **`DeckWindow` chrome** — two traffic lights only: **red = close**,
  **green = zoom** (fills the viewport between menu bar and Dock; toggles;
  auto-restores when the window loses focus). No minimize. A forced or zoomed
  window's body carries `data-lenis-prevent` + `overscroll-contain` so the wheel
  scrolls _its_ content, not the page (Lenis hijacks the wheel otherwise); in
  the plain cascade the wheel stays the page's.
- **`DesktopSurface`** (`desktop-shell/ui/`) — a full-viewport interactive
  desktop behind the deck (z-0), fading + going non-interactive as `deckProgress`
  passes `SURFACE_FADE_END`. Hosts one `<DesktopIcon>` per section, a rubber-band
  selection rectangle, and a right-click `<DesktopContextMenu>` (Teleported to
  body). `useDesktopIcons` (`model/`) owns icon positions — persisted per-browser
  in `localStorage` (`DESKTOP_ICONS_STORAGE_KEY`), `arrangeIcons()` resets the
  column. Single click selects (⇧/⌘ adds), **double click / Enter opens**
  (`useSectionRouter.open(id)` → hash → deck scrolls there), drag past
  `ICON_DRAG_THRESHOLD_PX` moves.
- **Dock** — GitHub / LinkedIn / Telegram / Résumé (PDF, locale-aware). No
  section navigation — that's the desktop icons + scroll. Config in `app.config.ts`.
- **Section components** take an `inWindow` prop and wrap an entity's UI in
  `shared/ui/SectionShell` (the `<section id aria>` landmark + a padded block +
  `<h2>`; `inWindow` drops the heading — the window title bar is it).
- **The Portfolio window is a macOS Finder** (`widgets/projects-finder`) —
  `ProjectsSection` swaps to `<ProjectFinder>` only when `inWindow` (SSR/mobile/
  reduced-motion keep the plain `ProjectCard` list; nothing else about the deck
  changes). A `<ProjectFileGrid>` of `<ProjectFile>` tiles on the left; the
  `<ProjectInspector>` on the right is **hidden until a tile is clicked** — no
  default selection. Selection is still just `useSectionRouter`'s
  `activeProjectSlug ⇄ #projects/<slug>`, so a deep link opens a file
  pre-selected. The inspector shows a looping `<video>` (or image / document
  glyph), a Get-Info property list (`finder.*` i18n keys), and the project's
  full `<CaseBlocks>`; it's `sticky` + independently `overflow-y-auto` so only
  it scrolls, not the grid. Video/poster assets are derived from `slug` —
  `public/projects/<slug>.{mp4,webm,jpg}` — via `Project.media` in
  `entities/project` (`kind: 'video' | 'image' | 'doc'`); `Project.kindKey`
  drives the inspector's localized "Kind" row. Not every project has a video
  (see `Project.media` in `entities/project/model/data.ts`).
- **`useSectionRouter`** is the single owner of "which section/project is open"
  — URL hash (`#about`, `#projects/<slug>`) ⇄ `activeSection` /
  `activeProjectSlug`. Don't track that state anywhere else.
- **`IntroStage`** owns the "boot". Slide 1 is a plain landing: `HeroLayer`
  (`public/hero.jpg`) full-bleed behind an `intro-scrim` gradient, name over it,
  no macOS chrome. It's a `INTRO_STAGE_HEIGHT_VH`-tall stage with a
  `position: sticky` inner layer; a scroll listener (rAF-throttled,
  `getBoundingClientRect`) derives `progress` (0–1) and `gsap.set` applies each
  layer's state — the photo **parallaxes** (drift + a touch of scale, never a
  zoom) and **dissolves** (`TL_PHOTO_FADE_*`), revealing the `<Wallpaper>`
  behind it. Mid-scroll, `<IntroStats>` counts 2–3 CV figures up over the photo
  (`INTRO_STATS_*` windows; each `<IntroStat>` owns a one-shot rAF count that
  resets when scrolled back past) and clears before the boot. `booted` toggles
  from `progress` **both ways** with hysteresis (`BOOT_PROGRESS_THRESHOLD` /
  `BOOT_UNBOOT_THRESHOLD`) — scrolling back up restores the landing. `useIntroState` is **not persisted** and
  `lenis.client.ts` pins every load to the top, so each reload replays the
  intro. Non-cinematic (reduced motion, narrow viewport) → `IntroFallback`
  (static photo hero, carries the `<h1>`) + immediate `boot()`. GSAP loads via
  dynamic `import()` in `onMounted` (never on
  the SSR path); the cinematic branch is gated on `isMounted` so SSR and first
  client paint match.

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
   locale-neutral fields (including `kindKey` — drives the Finder's Kind row)
   - `content: { ru, en }`, each `{ title, summary, role?, blocks: CaseBlock[] }`.
2. Give it `media`: `{ kind: 'video', width, height }` if you have a live site
   to record (see below), `{ kind: 'image', src, width, height }` for a static
   cover in `public/`, or `{ kind: 'doc' }` / omit entirely for a project with
   no visual — the Finder tile falls back to a document / generic-file glyph.
3. `pnpm test:e2e` — the project window opens at `#projects/<slug>` with that
   file pre-selected in the Finder.

### Recording a project preview video

`pnpm record:previews [slug]` (`scripts/record-project-previews.mjs`) drives a
brisk ~15s scroll pass over a target's live URL in headless Chromium, records
it, then uses `ffmpeg` to write `public/projects/<slug>.{mp4,webm,jpg}`. Add
the site to the `TARGETS` array in that script first. Not a Playwright test,
not run in CI — a one-off content step; the outputs are committed as static
assets.

Alternatively, drop a hand-recorded `public/projects/<slug>.mov` and run
`pnpm convert:previews [slug]` (`scripts/convert-project-movs.mjs`) — same
`ffmpeg` settings, writes the `.{webm,mp4,jpg}` trio and deletes the `.mov`
(gitignored; they are 60–130 MB). Keep `Project.media`'s `width`/`height` in
sync with the encoded output (the record path is 1280×800, a 16:10 ReplayKit
capture ends up 1280×668).

### Favicon

`public/favicon.svg` is the source — an orange rounded-square "G" monogram
(Signal brand). `pnpm gen:favicons` (`scripts/gen-favicons.mjs`, headless
Chromium) rasterises it to `favicon.ico` (32px PNG-in-ICO), `apple-touch-icon.png`
(180) and `favicon-192x192.png`; all four are linked in `nuxt.config.ts`
`app.head` and committed. Re-run after editing the SVG.

## Adding a section (folder + deck window)

1. New entity slice (or reuse one) with `model/data.ts` getter + `ui/` card.
2. `app/widgets/site-sections/ui/<Name>Section/` wrapping that card in
   `SectionShell`; export it, add to `SECTION_REGISTRY` in
   `widgets/site-sections/index.ts`, and render it in the plain stack in
   `pages/index.vue`.
3. Add the id to `SECTION_IDS` in `shared/config/navigation.ts` (order = deck
   order = desktop-icon order). `<DesktopIcon>` draws one folder glyph per id —
   no per-section icon asset needed. `useDesktopIcons` picks up the new id via
   `mergeDefaults`.
4. Strings in both locale JSON under `sections.*`. The deck stage grows
   automatically (`count × DECK_WINDOW_SCROLL_VH`).

## Adding a Dock item

Edit `app/app.config.ts` `dock` (`{ id, kind: 'link' | 'file', icon, href? }`),
add a filled 24×24 `currentColor` path list to `DockItem/constants.ts`
`DOCK_ICON_PATHS` (real brand marks — Simple Icons, `fill-rule: evenodd`), and a
label under `dock.*` in both locale JSON files. `id: 'resume'` gets a
locale-aware `/resume/<locale>.pdf` href automatically.

## Performance budgets

LCP < 2.5s (mobile), entry JS < ~180 KB gzip, CLS ≈ 0. `public/hero.jpg` is
the intro's first frame — optimise it (WebP/AVIF, ~1600px wide). GSAP +
ScrollTrigger load via dynamic `import()` after mount, off the critical path.

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
