# Code-Driven Intro Implementation Plan

**Goal:** Replace the scroll-scrub _video_ intro with a GSAP-driven "boot"
choreography over real DOM — validated by `app/pages/prototype-intro.vue`.

**Architecture:** `IntroStage` is a tall stage with a `position: sticky` inner
layer. A rAF-throttled scroll listener derives progress (0–1); `gsap.set`
applies each layer's state. Layers: hero photo → expanding orange screen glow
→ desktop wallpaper cross-fade. Past `BOOT_PROGRESS_THRESHOLD` it calls
`boot()`; `DesktopShell` then staggers MenuBar / Dock / window in via CSS
transitions.

_(ScrollTrigger's pin was tried first and dropped — its pin-spacer never
resolved `end` in this Nuxt/SSR setup; CSS sticky + a scroll listener is the
pattern the original `IntroStage` already used and it works.)_

**Tech Stack:** Nuxt 4, GSAP 3 (`gsap.set`), Tailwind v4 tokens.

**Spec:** `docs/superpowers/specs/2026-08-27-portfolio-macos-design.md`
(§ intro to be rewritten as part of Task 6).

## Global constraints

- Arrow functions only; folder-per-component; `~` imports only; named
  constants (SCREAMING_SNAKE) — no magic numbers.
- Content-first DOM unchanged: the 4 semantic sections stay in SSR HTML.
- `prefers-reduced-motion` and non-desktop → `IntroFallback` + immediate
  `boot()`, no timeline.
- Every new UI string in both `ru.json` and `en.json`.
- No commits — the user commits.

---

## Task 1 — Warm palette tokens

**Files:** `app/assets/css/main.css`

Retune wallpaper + add glow tokens so the screen-glow → wallpaper cross-fade
is seamless (black + orange radial, echoing `public/hero.jpg`).

- `--color-wall-a/b/c` → warm (amber / ember / near-black) on `:root` and in
  the `prefers-color-scheme: dark` block.
- Add `--color-glow-core`, `--color-glow-edge`.
- `Wallpaper.vue` gradient already reads these — verify it reads warm.

## Task 2 — intro-stage constants

**Files:** `app/widgets/intro-stage/model/constants.ts`

Remove: `FRAME_COUNT`, `FRAME_WIDTH_PX`, `FRAME_NUMBER_PAD`, `frameSrc`,
`introFrameSources`, `DEFAULT_PIXEL_RATIO`.

Add: `INTRO_STAGE_HEIGHT_VH` (340), `CAMERA_PUSH_SCALE`, `SCREEN_FOCAL_X/Y`,
`CAMERA_PUSH_BLUR_PX`, `CAMERA_PUSH_BRIGHTNESS`, `GLOW_START_SCALE`, and the
`TL_PUSH/GLOW/WALL_START/END` sub-range bounds. Keep `BOOT_PROGRESS_THRESHOLD`
(0.85), `INTRO_COPY_*`.

## Task 3 — new layer components

**Files:**

- Create `app/widgets/intro-stage/ui/HeroLayer/{HeroLayer.vue,index.ts}`
- Create `app/widgets/intro-stage/ui/ScreenGlow/{ScreenGlow.vue,index.ts}`
- Delete `app/widgets/intro-stage/ui/ScrubCanvas/`

`HeroLayer` — `<img src="/hero.jpg" @error>` over an always-present CSS studio
scene (black + orange radial + stand-in laptop) so a missing photo still
reads. `aria-hidden`. `ScreenGlow` — one radial-gradient div, `aria-hidden`,
transform-origin at the focal point.

## Task 4 — IntroStage orchestration

**Files:** `app/widgets/intro-stage/ui/IntroStage/IntroStage.vue`

Replace `ScrubCanvas` with `HeroLayer` + `ScreenGlow` + `IntroCopy` inside a
tall stage (`height: INTRO_STAGE_HEIGHT_VH vh`) whose inner layer is
`position: sticky`. Keep the rAF-throttled `scroll`/`resize` listener →
`getBoundingClientRect` → progress; `applyChoreography(progress)` calls
`gsap.set` on each layer for its `subProgress` sub-range. Past threshold →
`boot()`. GSAP via dynamic `import('gsap')` in `onMounted`. Gate the cinematic
branch on an `isMounted` ref so SSR (which renders `<IntroFallback>`) matches
the first client paint. `onBeforeUnmount` cancels the pending frame.

## Task 5 — DesktopShell enter animation

**Files:** `app/widgets/desktop-shell/ui/DesktopShell/DesktopShell.vue`,
`app/widgets/desktop-shell/model/constants.ts`

Replace the `<Transition name="chrome">` opacity fades with a GSAP stagger on
`booted`: MenuBar (slide from top), Dock (rise from bottom), first window
(scale + fade). Guard with `prefers-reduced-motion`. Add
`CHROME_ENTER_STAGGER_S`, `CHROME_ENTER_DURATION_S`.

## Task 6 — cleanup + docs + tests

**Files:** delete `app/pages/prototype-intro.vue`,
`scripts/build-intro-frames.mjs`; `package.json` (drop `intro:frames`);
`CLAUDE.md` (intro description, commands table, gotchas); the spec § intro;
`tests/e2e/smoke.spec.ts` (+ intro boot test); `public/intro/` note.

Add `tests/e2e/intro.spec.ts` — on desktop viewport, scrolling past the stage
reveals `.menu-bar` / dock; reduced-motion shows them immediately.

## Task 7 — verify

`pnpm lint && pnpm typecheck && pnpm test:e2e`. Manual: `/` on a desktop
viewport with `public/hero.jpg` present.
