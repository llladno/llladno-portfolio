# Projects window → macOS Finder

**Status:** implemented
**Date:** 2026-09-01
**Scope:** the interior of the "Portfolio" deck window only. The window deck,
desktop surface, desktop icons, Dock, menu bar and intro are untouched.

## Goal

Replace the vertical `ProjectCard` list inside the Portfolio window with a
macOS Finder-style layout: a grid of "files" (one per project) on the left, an
inspector pane on the right that shows a looping **video preview** of the
selected project, a Finder-style "Get Info" property list, and the full case
study below it.

The plain stacked `ProjectCard` list stays exactly as-is for the SSR baseline,
mobile, and reduced-motion users (`useDesktopMode().isDesktop` already excludes
all three — the Finder can only ever mount inside the deck).

## Non-goals

- No Finder sidebar ("Yesterday / Previous 7 days"), toolbar, or view switcher.
- No change to how the Portfolio window opens, focuses, closes, or zooms.
- No new routing concepts — `useSectionRouter` keeps sole ownership of
  `activeProjectSlug ⇄ #projects/<slug>`.
- Not every project gets a video (see Assets).

## Architecture

### New slice: `app/widgets/projects-finder/`

```
widgets/projects-finder/
  model/
    constants.ts    grid tile size/gap, inspector width, stack breakpoint,
                    media base path
    file-meta.ts    pure helpers: projectFileName, projectFileDimensions,
                    projectPosterSrc, projectVideoSrc
  ui/
    ProjectFinder/      the split view — owns selection + keyboard nav, reads
                        getProjects() + useSectionRouter
    ProjectFileGrid/    the left column: a flow grid of <ProjectFile>
    ProjectFile/        one tile — poster thumb + filename + sub-label
    ProjectInspector/   the right pane — preview media + property list + <CaseBlocks>
  index.ts             → ProjectFinder
```

FSD: `widgets` may import `entities` + `shared`. `ProjectInspector` reuses
`CaseBlocks` from `~/entities/project`. Selection logic is **not** shared with
`DesktopSurface` (that is spatial x/y + drag; this is a flow grid).

### Changed: `app/widgets/site-sections/ui/ProjectsSection/ProjectsSection.vue`

Becomes a switch:

```
inWindow  → <ProjectFinder />
otherwise → the current <ProjectCard v-for> list   (unchanged)
```

`SectionShell` still wraps both (keeps `<section id="projects">`).

### Changed: `app/entities/project/model/types.ts`

```ts
export type ProjectMedia =
  | { kind: 'video'; width: number; height: number }
  | { kind: 'image'; src: string; width: number; height: number }
  | { kind: 'doc' }

export type ProjectKindKey = 'website' | 'desktop' | 'miniapp' | 'dashboard' | 'doc'

export interface Project {
  // ...existing fields...
  kindKey: ProjectKindKey
  media?: ProjectMedia
}
```

- `LocalizedProject` picks up `kindKey` + `media` automatically (it is
  `Omit<Project, 'content'> & ProjectContent`).
- `video` asset paths are derived, never stored:
  `/projects/<slug>.mp4`, `/projects/<slug>.webm`, poster `/projects/<slug>.jpg`.
- `image.src` is an explicit `public/` path.
- `doc` has no media — the inspector shows a document glyph.

### Changed: `app/entities/project/model/data.ts`

Per project, add `kindKey` and (where applicable) `media`:

| slug                 | kindKey     | media                           |
| -------------------- | ----------- | ------------------------------- |
| `telegram-mini-apps` | `miniapp`   | — (pending; owner will supply)  |
| `followpulse`        | `dashboard` | `video` 1280×800                |
| `lume-store`         | `website`   | `video` 1280×800                |
| `sillage-landing`    | `website`   | `video` 1280×800                |
| `electron-launcher`  | `desktop`   | `video` 1280×800 (ntw.graphics) |
| `cnc-monitoring`     | `doc`       | `{ kind: 'doc' }`               |

## Component behaviour

### `ProjectFinder`

- `const projects = computed(() => getProjects(locale))` (getter pre-sorts by
  `order`).
- `const { activeProjectSlug, open } = useSectionRouter()`.
- `selectedSlug = computed(() => activeProjectSlug.value)` — **no default**. The
  inspector stays hidden (`v-if="selectedProject"`) until a file is clicked,
  like Finder previewing nothing up front. A deep link (`#projects/<slug>`)
  still lands with that file selected + its inspector shown.
- `select(slug)` → `open('projects', slug)` (writes the hash; no scroll).
- Keyboard: when the grid has focus, ArrowLeft/Right/Up/Down move the selection
  (column count read from the grid's resolved `grid-template-columns`);
  Enter / double-click → open `links.demo` in a new tab
  (`window.open(href, '_blank', 'noopener')`) when present, else no-op.
- Window width: the `projects` deck window is `wide` — `DeckWindow` takes a
  `wide` prop (`WindowDeck` passes it for `WIDE_SECTION_ID = 'projects'`) that
  swaps `w-[min(92vw,600px)]` → `w-[min(94vw,920px)]`. About/Experience stay
  narrow.
- Layout: `flex` row, `:style="{ maxHeight: FINDER_MAX_HEIGHT }"` (≈ window
  `max-h` minus its chrome) so the **deck window body never scrolls** — only
  the panes do, and only on overflow. Both panes get `.finder-pane` (thin
  scrollbars, scoped style reaches the child roots).
  - Nothing selected → `ProjectFileGrid` is `w-full` (multi-column browse).
  - A file selected → grid shrinks to `w-[FINDER_GRID_PINNED_WIDTH_PX]px`
    (~228px, a **two-column** compact list — 6 tiles fit without scrolling) on
    the **left**; `ProjectInspector` is `flex-1 overflow-y-auto` on the
    **right** (the one pane that actually scrolls, for a long case study).
  - The grid `<ul>` has `p-1` so the selected tile's highlight isn't clipped by
    its own `overflow`; selection is a `bg-accent/20` fill, not a ring.
  - No responsive stacking — desktop-only, window width fixed.
- Deep link: `ProjectFileGrid` watches `selectedSlug` and
  `scrollIntoView({ block: 'nearest' })`s the selected tile.

### `ProjectFileGrid`

`<ul role="listbox" :aria-label="t('sections.projects')" tabindex="0">` that owns
the roving focus; arrow keys are handled here and bubble the new slug up to
`ProjectFinder`. (Keyboard nav is the lowest-priority piece — ship pointer
selection first if it grows.)

### `ProjectFile`

`<li><button role="option" :aria-selected>` containing:

- thumb: `<NuxtImg>` of `/projects/<slug>.jpg` for `video`; `media.src` for
  `image`; a document SVG glyph for `doc`; a generic file glyph when `media` is
  absent. `video` thumbs carry a small ▶ / film-strip badge.
- filename: `projectFileName(project)` — `<slug>.mp4` (video), basename of
  `media.src` (image), `<slug>.md` (doc), `<slug>.webloc` (no media).
- sub-label: `"{w} × {h}"` for video/image, `"—"` otherwise.
- selected state: `bg-accent/15 ring-1 ring-accent` (matches the desktop
  icon's selected treatment); focus-visible ring always.

### `ProjectInspector`

Props: `project: LocalizedProject`. Top → bottom:

1. **Preview** — only rendered for `video` / `image` (an `aspect-video`,
   `max-h-[360px]`, `rounded-xl` box). `doc` and no-media projects skip it
   entirely; the Get Info + case study is the content.
   - `video`: `<video autoplay muted loop playsinline preload="metadata"
:poster>` with `<source>` webm then mp4. Always autoplay (reduced-motion
     users never reach this component).
   - `image`: `<NuxtImg :src :width :height>`.
2. **Name + kind line:** `{{ project.title }} — {{ t('finder.kind.' + project.kindKey) }} · {{ project.year }}`.
3. **Property list** (`t('finder.info')` heading, `<dl>` of rows; a row is
   omitted when its value is empty):
   - `finder.kindLabel` → localized kind (`finder.kind.<kindKey>`)
   - `finder.created` → `project.year`
   - `finder.role` → `project.role`
   - `finder.stack` → `project.stack.join(', ')`
   - `finder.where` → `<a>` to `project.links.demo` (`target=_blank rel=noopener`)
4. **Case study:** `<CaseBlocks :blocks="project.blocks" />` — unchanged
   component, scrolls with the inspector column.

## i18n — new keys (both `ru.json` and `en.json`)

```
finder.info            "Информация" / "Get Info"
finder.kindLabel       "Вид" / "Kind"           (row label; `kind` is the namespace below)
finder.created         "Создан" / "Created"
finder.role            "Роль" / "Role"
finder.stack           "Стек" / "Stack"
finder.where           "Источник" / "Where"
finder.open            "Открыть в новой вкладке" / "Open in a new tab"
finder.kind.website    "Сайт" / "Website"
finder.kind.desktop    "Настольное приложение" / "Desktop app"
finder.kind.miniapp    "Telegram Mini App" / "Telegram Mini App"
finder.kind.dashboard  "Веб-платформа" / "Web platform"
finder.kind.doc        "Документ" / "Document"
```

`ProjectFile` sets an explicit `aria-label` (`"{title} — {filename}. {open hint}"`)
so the tile's accessible name carries the filename — a bare `<button>` would
otherwise fall back to `title` and every tile would announce identically.

## Assets & the recording script

### `scripts/record-project-previews.mjs` (plain Node, not a Playwright test)

- One shared `BRISK_PLAN: Step[]` reused for every target, where
  `Step = { scrollToFraction: number, overMs: number } | { scrollTo: number,
overMs: number } | { waitMs: number }`. `scrollToFraction` is resolved against
  each page's own scroll height, so the same rhythm fits any site.
- Each scroll step runs its eased animation **inside the page** on one
  `requestAnimationFrame` loop via a single `page.evaluate` — not one Node↔page
  round trip per frame. Driving ~900 frames from Node let a busy site's main
  thread stall each round trip and inflate a "15s" capture to 140s+; one call
  per step keeps wall-clock close to the plan.
- For each entry: `chromium.launch()` →
  `browser.newContext({ viewport: 1280×800, deviceScaleFactor: 2,
colorScheme: 'dark', recordVideo: { dir: tmp, size } })` → run the plan →
  `context.close()` → Playwright flushes a `.webm`.
- `ffmpeg` post-process (via `node:child_process` `execFileSync`), **`-t 15`
  on both video outputs** so every clip is capped at a uniform 15s regardless
  of capture drift:
  - `<slug>.mp4` — `-c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p
-movflags +faststart -an`, scaled to ≤1280 wide.
  - `<slug>.webm` — `-c:v libvpx-vp9 -b:v 0 -crf 34 -an`.
  - `<slug>.jpg` — `-ss 0.6 -frames:v 1 -update 1 -q:v 3`.
  - output → `public/projects/`.
- `package.json`: `"record:previews": "node scripts/record-project-previews.mjs"`.
- Not wired into CI. Videos are committed as static assets.
- Target sites: `lume-store` (lume-clothes.vercel.app),
  `sillage-landing` (sillage.mansurov.workers.dev/ru/),
  `followpulse` (followpulse.com), `electron-launcher` (ntw.graphics).
- CLAUDE.md gains a short "Recording project previews" note.

### Performance

- Each `.mp4` target < ~1.5 MB, `.webm` smaller. Poster JPGs ~1600px, optimised.
- `<video preload="metadata">` and only the selected project's video is in the
  DOM (inspector renders one project at a time) — at most one video loads.
- Budgets in CLAUDE.md are per entry-JS / LCP; these assets are lazy, inside a
  post-hydration client-only widget, off the critical path.

## Testing — `tests/e2e/finder.spec.ts` (chromium-only, `test.use({ locale: 'ru-RU' })`)

1. `/#projects` — one tile per project; no `Информация`, no `<video>`, no
   `[selected]` option (inspector hidden until a pick).
2. `/#projects/sillage-landing` deep link — tile `aria-selected`; inspector
   shows the SILLAGE heading, a "Сайт" kind, one `<video>`.
3. Click the `followpulse` tile → it becomes `aria-selected` and the URL hash
   is `#projects/followpulse`.
4. `/#projects/cnc-monitoring` — no `<video>`; the tile is named `*.md`.

`projects.spec.ts` now runs `test.use({ viewport: <mobile>, locale: 'ru-RU' })`
so it exercises the plain card list (deck suppressed) — that's the SSR/mobile
baseline those assertions target.

## Rollout / order of work

1. `entities/project` — types + data (`kindKey`, `media`).
2. `scripts/record-project-previews.mjs` + run it → `public/projects/*`.
3. `widgets/projects-finder/` — constants, file-meta, then the 4 components.
4. Wire `ProjectsSection` switch + i18n keys.
5. `finder.spec.ts`; run `pnpm lint`, `pnpm typecheck`, browser verify.
6. CLAUDE.md updates (architecture map + recording note + "Not in v1" trim).
