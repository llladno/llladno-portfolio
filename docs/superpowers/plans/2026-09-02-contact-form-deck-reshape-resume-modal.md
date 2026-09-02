# Contact form, deck reshape & résumé modal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix scroll inside deck windows, move the bare desktop to the end of the deck scroll, turn the Dock résumé link into a preview modal, and add a Web3Forms-backed contact section.

**Architecture:** Four mostly-independent changes to an existing Nuxt 4 + FSD codebase. The deck changes are tuning + inversion of existing scroll math in `widgets/window-deck` and `widgets/desktop-shell`. The résumé modal and contact form are new `features/` slices wired into the client-only macOS chrome and (for SEO) the always-rendered plain stack.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup>` + TS strict, Tailwind v4 (CSS-first, theme utilities), `@vueuse/core`, Lenis smooth scroll, `@nuxtjs/i18n` v10, Playwright e2e.

**Spec:** `docs/superpowers/specs/2026-09-02-contact-form-deck-reshape-resume-modal-design.md`

## Global Constraints

- **No commits by the agent.** This project's owner commits. Each task ends with a checkpoint (`pnpm lint && pnpm typecheck` + the task's tests), not a commit.
- **Arrow functions only** — never `function` (ESLint `func-style: expression`).
- **Folder per component** — `ui/Name/{Name.vue, types.ts, constants.ts, index.ts}`. Slice-wide types → `model/types.ts`; slice-wide constants → `model/constants.ts`.
- **Named constants, not magic numbers** — every meaningful literal is `SCREAMING_SNAKE_CASE` in a `constants.ts`. Bare-allowed: `-1, 0, 1, 2` and array indices. `id-length` min 3 (no `p`, `e`, `el`, `idx`).
- **`~` imports only** — never `../` or `./`, in `.ts` or `.vue`, barrels included. `~` = `app/`.
- **Tailwind theme utilities** — `text-muted`, `bg-accent`, `border-glass-border`, `rounded-window` (auto-generated from `@theme`), not `text-[var(--…)]`. Raw `var(--…)` only where no utility exists.
- **Content-first DOM** — every H1/H2, form and link must be in the prerendered HTML. The macOS chrome (Dock, deck, modal) is a client-only enhancement layered on top; the plain stack in `pages/index.vue` + plain `<header>` in `layouts/default.vue` is the SSR baseline.
- **Every new UI string in BOTH `i18n/locales/ru.json` and `i18n/locales/en.json`.**
- **Respect `prefers-reduced-motion`** in every animation; **GSAP only** if a JS animation is needed (none required here — CSS transitions suffice).
- **Images via `<NuxtImg>`** with explicit `width`/`height` (n/a this plan).
- **i18n**: default locale `ru` at `/`, `en` at `/en/*`. Résumé href is `/resume/${locale}.pdf`.
- **e2e runs against the real static build** (`pnpm generate && pnpm preview`), chromium + webkit + mobile-safari projects. Desktop-only behaviour is `test.skip`-ped off webkit/mobile in existing specs — follow that pattern.

---

## File Structure

**Task 1 — deck reshape (desktop to the end):**

- Modify `app/widgets/window-deck/model/constants.ts` — rename `DECK_DESKTOP_LEAD` → `DECK_DESKTOP_TRAIL`.
- Modify `app/widgets/window-deck/ui/WindowDeck/WindowDeck.vue` — `windowCenter`, `scrollFocusFor` (trailing ramp), `scrollDeckToTop` → `scrollDeckToDesktop` (jump to deck bottom), `ensureDeckInView` → same park-at-desktop.
- Modify `app/widgets/desktop-shell/ui/DesktopSurface/constants.ts` — `SURFACE_FADE_END` → `SURFACE_REVEAL_START`.
- Modify `app/widgets/desktop-shell/ui/DesktopSurface/DesktopSurface.vue` — invert `covered` / `opacity`.
- Modify `tests/e2e/deck.spec.ts`.

**Task 2 — nested scroll inside deck windows:**

- Modify `app/widgets/window-deck/model/constants.ts` — add `OWNS_SCROLL_FOCUS_THRESHOLD`, `SCROLL_EDGE_EPSILON_PX`.
- Modify `app/widgets/window-deck/ui/DeckWindow/DeckWindow.vue` — `ownsScroll` prop, body ref, non-passive `wheel` handler with edge pass-through.
- Modify `app/widgets/window-deck/ui/WindowDeck/WindowDeck.vue` — expose `focus`, pass `:owns-scroll`.
- Modify `tests/e2e/deck.spec.ts` — cascade-scroll test.

**Task 3 — résumé modal from the Dock:**

- Create `app/features/resume-viewer/model/use-resume-modal.ts`.
- Create `app/features/resume-viewer/ui/ResumeModal/{ResumeModal.vue, constants.ts, index.ts}`.
- Create `app/features/resume-viewer/index.ts`.
- Modify `app/widgets/desktop-shell/ui/DockItem/DockItem.vue` (+ create `app/widgets/desktop-shell/ui/DockItem/types.ts`).
- Modify `app/widgets/desktop-shell/ui/Dock/Dock.vue`.
- Modify `app/widgets/desktop-shell/ui/DesktopShell/DesktopShell.vue` — mount `<ResumeModal>`.
- Modify `app/entities/profile/ui/AboutCard/AboutCard.vue` — plain `<a download>`.
- Modify `app/entities/profile/model/types.ts` if needed (no — href is derived).
- Modify `i18n/locales/{ru,en}.json`.
- Create `tests/e2e/resume.spec.ts`.

**Task 4 — contact form + section:**

- Modify `nuxt.config.ts` — `runtimeConfig.public.web3formsKey`.
- Modify `.env.example`.
- Create `app/features/contact-form/ui/ContactForm/{ContactForm.vue, constants.ts, index.ts}`.
- Create `app/features/contact-form/index.ts`.
- Create `app/widgets/site-sections/ui/ContactSection/{ContactSection.vue, index.ts}`.
- Modify `app/widgets/site-sections/index.ts` — export + `SECTION_REGISTRY`.
- Modify `app/shared/config/navigation.ts` — `SECTION_IDS`.
- Modify `app/pages/index.vue` — `<ContactSection />` in the plain stack.
- Modify `i18n/locales/{ru,en}.json`.
- Create `tests/e2e/contact.spec.ts`.

**Task 5 — full verification.**

---

## Task 1: Deck reshape — bare desktop at the end of the scroll

**Files:**

- Modify: `app/widgets/window-deck/model/constants.ts`
- Modify: `app/widgets/window-deck/ui/WindowDeck/WindowDeck.vue`
- Modify: `app/widgets/desktop-shell/ui/DesktopSurface/constants.ts`
- Modify: `app/widgets/desktop-shell/ui/DesktopSurface/DesktopSurface.vue`
- Test: `tests/e2e/deck.spec.ts`

**Interfaces:**

- Consumes: `useDeckState()` → `{ deckProgress, forcedSectionId }` (unchanged), `clamp` from `~/shared/lib`.
- Produces:
  - `window-deck/model/constants.ts` exports `DECK_DESKTOP_TRAIL: number` (0.16) — replaces `DECK_DESKTOP_LEAD`.
  - `DesktopSurface/constants.ts` exports `SURFACE_REVEAL_START: number` (0.82), `SURFACE_MIN_OPACITY: number` (0.12, unchanged).
  - `WindowDeck.vue` internal: `scrollDeckToDesktop()` replaces `scrollDeckToTop()` / `ensureDeckInView()`.

- [ ] **Step 1: Update the failing test first — `tests/e2e/deck.spec.ts`**

Replace the whole file with:

```ts
import { test, expect, type Page } from '@playwright/test'

/*
 * The window deck after the reshape:
 * - the intro boots straight into the first window (About) at deckProgress 0;
 * - the bare desktop is the FINAL state at the bottom of the deck scroll;
 * - the red traffic light on a scroll-focused window falls through to that
 *   bare desktop.
 */

const settle = (page: Page) => page.waitForTimeout(1200)

const WHEEL_STEPS = 40
const WHEEL_DELTA_PX = 500

const windowOpacity = (page: Page, index: number) =>
  page
    .locator('.deck-window')
    .nth(index)
    .evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity))

const wheelBy = async (page: Page, deltaY: number, steps = WHEEL_STEPS) => {
  await page.mouse.move(400, 300)
  for (let step = 0; step < steps; step += 1) {
    await page.mouse.wheel(0, deltaY)
    await page.waitForTimeout(20)
  }
  await page.waitForTimeout(700)
}

test.describe('window deck', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'deck is desktop-only')

  test('boots into the first window; last scroll position is the bare desktop', async ({
    page,
  }) => {
    await page.goto('/')
    // A little scroll to clear the intro and land on the deck.
    await wheelBy(page, WHEEL_DELTA_PX, 6)
    expect(await windowOpacity(page, 0)).toBeGreaterThan(0.75)

    // Scroll all the way down — every window recedes, the desktop is bare.
    await wheelBy(page, WHEEL_DELTA_PX, WHEEL_STEPS)
    for (const index of [0, 1, 2, 3]) {
      expect(await windowOpacity(page, index)).toBeLessThan(0.5)
    }
    // The desktop surface is interactive again at the end.
    const surface = page.getByRole('group', { name: /рабочий стол|desktop/i })
    await expect(surface).toHaveCSS('pointer-events', 'auto')
  })

  test('deep link focuses a window; close falls through to the bare desktop', async ({
    page,
  }) => {
    await page.goto('/#experience')
    await settle(page)
    expect(await windowOpacity(page, 1)).toBeGreaterThan(0.75)

    await page
      .locator('.deck-window')
      .nth(1)
      .getByRole('button', { name: /рабоч|desktop/i })
      .click()
    await settle(page)

    for (const index of [0, 1, 2, 3]) {
      expect(await windowOpacity(page, index)).toBeLessThan(0.5)
    }
    expect(new URL(page.url()).hash).toBe('')
  })
})
```

Note: the `[0, 1, 2, 3]` index lists assume Task 4 has added the 4th (`contact`) window. If Task 1 runs before Task 4, temporarily use `[0, 1, 2]` and widen it in Task 4. (Subagent-driven execution runs tasks in order — if you are on Task 1, use `[0, 1, 2]` here and Task 4's step will update it.)

- [ ] **Step 2: Run the test, expect FAIL**

Run: `pnpm test:e2e -- deck.spec.ts --project=chromium`
Expected: FAIL — first window is not focused at low scroll (old model reserves the lead zone for the bare desktop), and/or close returns to top not bottom.

- [ ] **Step 3: Rename the constant in `app/widgets/window-deck/model/constants.ts`**

Replace the `DECK_DESKTOP_LEAD` block:

```ts
/**
 * Fraction of the deck's scroll at the END reserved for the bare desktop —
 * wallpaper + folder icons, no window focused. Windows map onto
 * `[0 … 1 − TRAIL]`; the first is focused the instant the intro boots, the
 * last fades out as scroll enters this trailing zone. Closing a window scrolls
 * down into it.
 */
export const DECK_DESKTOP_TRAIL = 0.16
```

- [ ] **Step 4: Rework the math in `app/widgets/window-deck/ui/WindowDeck/WindowDeck.vue`**

4a. Update the import:

```ts
import {
  DECK_BACKGROUND_DRIFT_PX,
  DECK_CASCADE_X_PX,
  DECK_CASCADE_Y_PX,
  DECK_DESKTOP_TRAIL,
  DECK_WINDOW_SCROLL_VH,
  FORCE_TRANSITION_MS,
  WINDOW_FOCUS_CENTER_PULL,
  WINDOW_FOCUS_PLATEAU,
  WINDOW_MAX_BLUR_PX,
  WINDOW_MIN_OPACITY,
  WINDOW_MIN_SCALE,
  WINDOW_SPAN_OVERLAP,
  WINDOW_Z_RANGE,
} from '~/widgets/window-deck/model/constants'
```

4b. Replace `windowSpan` / `windowCenter` / `scrollFocusFor`:

```ts
const windowSpan = count > 1 ? (1 - DECK_DESKTOP_TRAIL) / (count - 1) : 1

// ...

/** Deck progress at which window `index` is fully focused. */
const windowCenter = (index: number): number =>
  count > 1 ? index * windowSpan : PROGRESS_MAX / 2

const scrollFocusFor = (index: number): number => {
  // The trailing zone is the bare desktop — every window fades out across it.
  const trailFactor = clamp(
    (PROGRESS_MAX - deckProgress.value) / DECK_DESKTOP_TRAIL,
    PROGRESS_MIN,
    PROGRESS_MAX,
  )
  const spanHalf = (windowSpan * (1 + WINDOW_SPAN_OVERLAP)) / 2
  const distance = clamp(
    Math.abs(deckProgress.value - windowCenter(index)) / spanHalf,
    PROGRESS_MIN,
    PROGRESS_MAX,
  )
  const natural =
    distance <= WINDOW_FOCUS_PLATEAU
      ? 1
      : 1 - smoothstep((distance - WINDOW_FOCUS_PLATEAU) / (1 - WINDOW_FOCUS_PLATEAU))
  return natural * trailFactor
}
```

4c. Replace `ensureDeckInView` + `scrollDeckToTop` with a single `scrollDeckToDesktop` (the bare desktop now lives at the bottom of the stage):

```ts
/** Jump the page (no animation) to the bare desktop at the end of the deck. */
const scrollDeckToDesktop = (): void => {
  const stage = stageEl.value
  if (!stage) return
  jumpTo(stage.offsetTop + stage.offsetHeight - window.innerHeight)
}
```

4d. In `forceOpen`, swap `ensureDeckInView()` → `scrollDeckToDesktop()`:

```ts
const forceOpen = (id: SectionId) => {
  scrollDeckToDesktop()
  forcedSectionId.value = id
  activeId.value = id
  playAnimation()
}
```

4e. In `onClose`, swap `scrollDeckToTop()` → `scrollDeckToDesktop()`:

```ts
const onClose = () => {
  playAnimation()
  if (forcedSectionId.value) {
    releaseForced()
  } else {
    scrollDeckToDesktop()
  }
  if (route.hash) router.replace({ path: route.path, hash: '' })
  scheduleRead()
}
```

4f. In `onMounted`, the deep-link branch still calls `forceOpen(target)` — no change needed there beyond 4d.

- [ ] **Step 5: Invert the desktop-surface reveal**

5a. `app/widgets/desktop-shell/ui/DesktopSurface/constants.ts`:

```ts
/**
 * Deck progress BELOW which the desktop stays hidden. Above it (the deck's
 * trailing zone, where every window has receded) the desktop fades in and
 * takes pointer input — it is the deck's final resting state.
 */
export const SURFACE_REVEAL_START = 0.82

/** The desktop never fades below this opacity once revealed. */
export const SURFACE_MIN_OPACITY = 0.12
```

5b. `app/widgets/desktop-shell/ui/DesktopSurface/DesktopSurface.vue` — update the import and the three computeds:

```ts
import {
  SURFACE_MIN_OPACITY,
  SURFACE_REVEAL_START,
} from '~/widgets/desktop-shell/ui/DesktopSurface/constants'

// ...

const FULL_OPACITY = 1

// Hidden while any window is up: scrolled into the deck body, or forced open.
const covered = computed(
  () => forcedSectionId.value !== null || deckProgress.value < SURFACE_REVEAL_START,
)
const opacity = computed(() => {
  if (covered.value) return SURFACE_MIN_OPACITY
  const span = FULL_OPACITY - SURFACE_REVEAL_START
  const into = (deckProgress.value - SURFACE_REVEAL_START) / span
  return SURFACE_MIN_OPACITY + into * (FULL_OPACITY - SURFACE_MIN_OPACITY)
})
const interactive = computed(() => !covered.value)
```

- [ ] **Step 6: Run the deck test, expect PASS**

Run: `pnpm test:e2e -- deck.spec.ts --project=chromium`
Expected: PASS.

- [ ] **Step 7: Run the neighbouring specs that touch deck scroll**

Run: `pnpm test:e2e -- desktop.spec.ts intro.spec.ts --project=chromium`
Expected: PASS. `desktop.spec.ts`'s `gotoDesktop` (deep-link `#about` → close) now parks at the bottom; its assertions (`windowOpacity < 0.5`, icon interactions) still hold. If `intro.spec.ts` "scrolling back retracts it" flakes, bump its `WHEEL_STEPS` so it fully returns to the top — do not change deck logic for it.

- [ ] **Step 8: Checkpoint**

Run: `pnpm lint && pnpm typecheck`
Expected: clean. Leave changes unstaged for the owner.

---

## Task 2: Nested scroll inside deck windows

**Files:**

- Modify: `app/widgets/window-deck/model/constants.ts`
- Modify: `app/widgets/window-deck/ui/DeckWindow/DeckWindow.vue`
- Modify: `app/widgets/window-deck/ui/WindowDeck/WindowDeck.vue`
- Test: `tests/e2e/deck.spec.ts`

**Interfaces:**

- Consumes: `useNuxtApp().$lenis` (typed locally as `{ actualScroll: number } | undefined` — Lenis exposes `actualScroll`), `DeckWindowVisual` (unchanged).
- Produces:
  - `window-deck/model/constants.ts` exports `OWNS_SCROLL_FOCUS_THRESHOLD: number` (0.9), `SCROLL_EDGE_EPSILON_PX: number` (2).
  - `DeckWindow.vue` gains prop `ownsScroll?: boolean`.
  - `WindowDeck.vue`'s `windows` computed entries gain `focus: number`.

- [ ] **Step 1: Add the cascade-scroll test to `tests/e2e/deck.spec.ts`**

Append inside `test.describe('window deck', …)`:

```ts
test('a scroll-focused window scrolls its own content before the deck advances', async ({
  page,
}) => {
  await page.goto('/')
  await wheelBy(page, WHEEL_DELTA_PX, 6)
  expect(await windowOpacity(page, 0)).toBeGreaterThan(0.75)

  const body = page.locator('.deck-window').nth(0).locator('.deck-window__body')
  const overflow = await body.evaluate((node) => node.scrollHeight - node.clientHeight)
  test.skip(overflow < 60, 'about window content fits — nothing to nested-scroll')

  await body.hover()
  await page.mouse.wheel(0, 300)
  await page.waitForTimeout(400)

  // Content moved; the window is still the focused one (deck did not jump on).
  expect(await body.evaluate((node) => node.scrollTop)).toBeGreaterThan(0)
  expect(await windowOpacity(page, 0)).toBeGreaterThan(0.75)
})
```

- [ ] **Step 2: Run it, expect FAIL**

Run: `pnpm test:e2e -- deck.spec.ts --project=chromium -g "scrolls its own content"`
Expected: FAIL — `body.scrollTop` stays 0 because Lenis eats the wheel and the deck advances instead.

- [ ] **Step 3: Add constants to `app/widgets/window-deck/model/constants.ts`**

```ts
/**
 * A window whose focus is at or above this drives its own body scroll (the
 * wheel scrolls its content, not the deck) until the content hits an edge.
 */
export const OWNS_SCROLL_FOCUS_THRESHOLD = 0.9

/** Px slack when deciding a scroll container is at its top / bottom edge. */
export const SCROLL_EDGE_EPSILON_PX = 2
```

- [ ] **Step 4: Add `ownsScroll` + the wheel handler to `app/widgets/window-deck/ui/DeckWindow/DeckWindow.vue`**

4a. Imports at the top of `<script setup>`:

```ts
import { useEventListener } from '@vueuse/core'
import { TrafficLights } from '~/shared/ui'
import type { DeckWindowVisual } from '~/widgets/window-deck/model/types'
import { SCROLL_EDGE_EPSILON_PX } from '~/widgets/window-deck/model/constants'
```

4b. Add to `defineProps`:

```ts
  /**
   * This window is the scroll-cascade leader: its body owns the wheel for its
   * own content, handing the wheel back to the deck only at the content edge.
   * (`forced` / `zoomed` windows trap the wheel entirely — that is separate.)
   */
  ownsScroll?: boolean
```

4c. After `const zoomed = ref(false)` add the body ref + handler:

```ts
const bodyEl = ref<HTMLElement | null>(null)
const nuxtApp = useNuxtApp()

type LenisLike = { actualScroll: number }

// Cascade leader: scroll the content; at the top/bottom edge, nudge the page so
// the deck advances. `forced` / `zoomed` windows keep trapping the wheel fully
// (handled by data-lenis-prevent + overscroll-contain in the template).
const onBodyWheel = (event: WheelEvent) => {
  const body = bodyEl.value
  if (!body || props.forced || zoomed.value || !props.ownsScroll) return

  const atTop = body.scrollTop <= SCROLL_EDGE_EPSILON_PX
  const atBottom =
    body.scrollTop + body.clientHeight >= body.scrollHeight - SCROLL_EDGE_EPSILON_PX
  const goingDown = event.deltaY > 0
  const roomToScroll = (goingDown && !atBottom) || (!goingDown && !atTop)
  if (roomToScroll) return // browser scrolls the body natively (Lenis ignores it)

  // At the edge in the wheel's direction — advance the page/deck by this delta.
  const lenis = nuxtApp.$lenis as LenisLike | undefined
  const from = lenis?.actualScroll ?? window.scrollY
  window.scrollTo({ top: from + event.deltaY })
}

useEventListener(bodyEl, 'wheel', onBodyWheel, { passive: false })
```

4d. In the template, add the ref and always-prevent lenis for the owning window too:

```html
<div
  ref="bodyEl"
  class="deck-window__body grow overflow-y-auto px-7 py-7"
  :class="forced || zoomed || ownsScroll ? 'overscroll-contain' : ''"
  :data-lenis-prevent="forced || zoomed || ownsScroll || null"
>
  <slot />
</div>
```

- [ ] **Step 5: Pass `owns-scroll` from `app/widgets/window-deck/ui/WindowDeck/WindowDeck.vue`**

5a. Import the threshold:

```ts
import {
  // …existing…
  OWNS_SCROLL_FOCUS_THRESHOLD,
} from '~/widgets/window-deck/model/constants'
```

5b. Add `focus` to the `windows` computed entries:

```ts
const windows = computed(() =>
  SECTION_IDS.map((id, index) => ({
    id,
    title: t(`sections.${id}`),
    focus: focusFor(index),
    visual: visualFor(index),
    forced: forcedSectionId.value === id,
    wide: id === WIDE_SECTION_ID,
  })),
)
```

5c. In the template, pass the prop:

```html
<DeckWindow
  v-for="win in windows"
  :key="win.id"
  :title="win.title"
  :close-label="t('window.toDesktop')"
  :zoom-label="t('window.zoom')"
  :restore-label="t('window.restore')"
  :visual="win.visual"
  :animated="animating"
  :forced="win.forced"
  :owns-scroll="!win.forced && win.focus >= OWNS_SCROLL_FOCUS_THRESHOLD"
  :wide="win.wide"
  @close="onClose"
></DeckWindow>
```

- [ ] **Step 6: Run the deck test, expect PASS**

Run: `pnpm test:e2e -- deck.spec.ts --project=chromium`
Expected: PASS (all deck tests, including Task 1's).

- [ ] **Step 7: Regression — forced-window scroll still works**

Run: `pnpm test:e2e -- desktop.spec.ts --project=chromium -g "scrolls its content"`
Expected: PASS — the forced-window path is unchanged (`data-lenis-prevent` was already set for `forced`).

- [ ] **Step 8: Checkpoint**

Run: `pnpm lint && pnpm typecheck`
Expected: clean.

---

## Task 3: Résumé modal from the Dock

**Files:**

- Create: `app/features/resume-viewer/model/use-resume-modal.ts`
- Create: `app/features/resume-viewer/ui/ResumeModal/ResumeModal.vue`
- Create: `app/features/resume-viewer/ui/ResumeModal/constants.ts`
- Create: `app/features/resume-viewer/ui/ResumeModal/index.ts`
- Create: `app/features/resume-viewer/index.ts`
- Create: `app/widgets/desktop-shell/ui/DockItem/types.ts`
- Modify: `app/widgets/desktop-shell/ui/DockItem/DockItem.vue`
- Modify: `app/widgets/desktop-shell/ui/Dock/Dock.vue`
- Modify: `app/widgets/desktop-shell/ui/DesktopShell/DesktopShell.vue`
- Modify: `app/entities/profile/ui/AboutCard/AboutCard.vue`
- Modify: `i18n/locales/ru.json`, `i18n/locales/en.json`
- Test: `tests/e2e/resume.spec.ts`

**Interfaces:**

- Consumes: `useI18n()` `locale` / `t`; `Locale` from `~/shared/config/i18n`; `GlassPanel` / `TrafficLights` from `~/shared/ui` (use `GlassPanel` for the panel, a plain `<button>` for close — TrafficLights is deck chrome, keep it there).
- Produces:
  - `~/features/resume-viewer` barrel exports `ResumeModal` (component) and `useResumeModal` (composable).
  - `useResumeModal()` → `{ isOpen: Ref<boolean>, open: () => void, close: () => void }` (`useState('resume:open', () => false)`).
  - `DockItem.vue` gains props `as?: 'a' | 'button'` (default `'a'`) and emit `activate: []`; when `as === 'button'` it renders a `<button type="button" @click="$emit('activate')">` with identical classes/markup.
  - `DockItem/types.ts` exports `interface DockItemRenderProps` (see step).

- [ ] **Step 1: Write the failing test — `tests/e2e/resume.spec.ts`**

```ts
import { test, expect, type Page } from '@playwright/test'

const settle = (page: Page) => page.waitForTimeout(1000)

const bootDesktop = async (page: Page) => {
  await page.goto('/#about')
  await settle(page)
}

test.describe('résumé', () => {
  test('the plain-stack résumé download link is in the prerendered HTML', async ({
    request,
  }) => {
    const ru = await request.get('/')
    expect(await ru.text()).toContain('href="/resume/ru.pdf"')
    const en = await request.get('/en/')
    expect(await en.text()).toContain('href="/resume/en.pdf"')
  })

  test('the Dock résumé tile opens a modal with a download link; Escape closes it', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Dock is desktop-only')

    await bootDesktop(page)

    const dock = page.getByRole('navigation', {
      name: /панель приложений|application dock/i,
    })
    // The résumé control is a button now, not a link.
    const trigger = dock.getByRole('button', { name: /резюме|résumé/i })
    await expect(trigger).toBeVisible()
    await trigger.click()

    const dialog = page.getByRole('dialog', { name: /резюме|résumé/i })
    await expect(dialog).toBeVisible()
    const download = dialog.getByRole('link', { name: /скачать|download/i })
    await expect(download).toHaveAttribute('href', '/resume/ru.pdf')
    await expect(download).toHaveAttribute('download', /.*/)

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  })
})
```

- [ ] **Step 2: Run it, expect FAIL**

Run: `pnpm test:e2e -- resume.spec.ts --project=chromium`
Expected: FAIL — no plain download link, Dock résumé is still an `<a>`, no dialog.

- [ ] **Step 3: Create `app/features/resume-viewer/model/use-resume-modal.ts`**

```ts
/**
 * Shared open/closed state for the résumé preview modal. `useState`-backed so
 * the Dock (and later the menu bar) can trigger the same modal, which is
 * mounted once in <DesktopShell>.
 */
export const useResumeModal = () => {
  const isOpen = useState('resume:open', () => false)
  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  return { isOpen, open, close }
}
```

- [ ] **Step 4: Create `app/features/resume-viewer/ui/ResumeModal/constants.ts`**

```ts
/** How long the backdrop / panel fade runs, in ms (matches the CSS below). */
export const RESUME_MODAL_FADE_MS = 200
```

- [ ] **Step 5: Create `app/features/resume-viewer/ui/ResumeModal/ResumeModal.vue`**

```vue
<script setup lang="ts">
/*
 * A centred modal that previews the résumé PDF (an <iframe>) with a prominent
 * download button. Teleported to <body>, closes on Escape / backdrop click,
 * traps focus and locks body scroll while open. Locale-aware href.
 */
import { useResumeModal } from '~/features/resume-viewer/model/use-resume-modal'
import type { Locale } from '~/shared/config/i18n'

const { isOpen, close } = useResumeModal()
const { locale, t } = useI18n()

const resumeHref = computed(() => `/resume/${locale.value as Locale}.pdf`)

const panelEl = ref<HTMLElement | null>(null)
const titleId = useId()

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

watch(isOpen, (openNow) => {
  if (import.meta.server) return
  document.body.style.overflow = openNow ? 'hidden' : ''
  if (openNow) {
    nextTick(() => panelEl.value?.focus())
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="resume-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4 backdrop-blur-sm sm:p-8"
        @click.self="close"
        @keydown="onKeydown"
      >
        <GlassPanel
          ref="panelEl"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          class="flex max-h-[86dvh] w-full max-w-3xl flex-col overflow-hidden rounded-window outline-none"
        >
          <header
            class="flex items-center justify-between gap-4 border-b border-line px-5 py-3"
          >
            <h2 :id="titleId" class="font-display text-base font-semibold text-fg">
              {{ t('resume.title') }}
            </h2>
            <button
              type="button"
              class="rounded-md px-2 py-1 text-sm text-muted transition-colors hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              :aria-label="t('resume.close')"
              @click="close"
            >
              ✕
            </button>
          </header>

          <div class="min-h-0 grow bg-surface">
            <iframe
              :src="resumeHref"
              :title="t('resume.title')"
              class="h-full min-h-[50vh] w-full border-0"
            />
          </div>

          <footer
            class="flex items-center justify-end gap-3 border-t border-line px-5 py-3"
          >
            <a
              :href="resumeHref"
              download
              class="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {{ t('resume.download') }}
            </a>
          </footer>
        </GlassPanel>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.resume-modal-enter-active,
.resume-modal-leave-active {
  transition: opacity 0.2s ease;
}
.resume-modal-enter-from,
.resume-modal-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .resume-modal-enter-active,
  .resume-modal-leave-active {
    transition: none;
  }
}
</style>
```

Note: `GlassPanel` currently forwards no `ref`/attrs to its inner element for focus. Check `app/shared/ui/GlassPanel/GlassPanel.vue` — it renders `<component :is="as">`, so `ref` + `tabindex` + `role` fall through as attributes to the root element via Vue's fallthrough. That is fine (single root). If `typecheck` complains about `tabindex` on the component, add `inheritAttrs` is already default true — leave it. If focus does not land, replace `<GlassPanel …>` with a plain `<div class="glass …">` and keep everything else.

- [ ] **Step 6: Create the barrels**

`app/features/resume-viewer/ui/ResumeModal/index.ts`:

```ts
export { default as ResumeModal } from '~/features/resume-viewer/ui/ResumeModal/ResumeModal.vue'
```

`app/features/resume-viewer/index.ts`:

```ts
export { ResumeModal } from '~/features/resume-viewer/ui/ResumeModal'
export { useResumeModal } from '~/features/resume-viewer/model/use-resume-modal'
```

- [ ] **Step 7: Create `app/widgets/desktop-shell/ui/DockItem/types.ts`**

```ts
/** How a Dock tile renders — an external link, or a button that runs an action. */
export interface DockItemRenderProps {
  icon: string
  label: string
  /** Pointer x from the Dock, or null when the pointer is away / reduced motion. */
  pointerX: number | null
  as?: 'a' | 'button'
  href?: string
  isExternal?: boolean
}
```

- [ ] **Step 8: Update `app/widgets/desktop-shell/ui/DockItem/DockItem.vue`**

8a. Replace `defineProps` + add emit + import the type:

```ts
import type { DockItemRenderProps } from '~/widgets/desktop-shell/ui/DockItem/types'

const props = withDefaults(defineProps<DockItemRenderProps>(), { as: 'a' })
defineEmits<{ activate: [] }>()
```

8b. In the template, swap the root `<a>` for a dynamic element. Keep every class, style binding, the `<svg>`, and the `.dock-tip` span identical:

```html
<component
  :is="as === 'button' ? 'button' : 'a'"
  ref="itemEl"
  :type="as === 'button' ? 'button' : undefined"
  :href="as === 'button' ? undefined : href"
  :target="as === 'button' ? undefined : isExternal ? '_blank' : undefined"
  :rel="as === 'button' ? undefined : isExternal ? 'noopener noreferrer' : undefined"
  :aria-label="label"
  class="dock-tile relative grid shrink-0 place-items-center rounded-[0.85rem] border border-white/12 shadow-lg [transition:transform_110ms_ease-out]"
  :style="tileStyle"
  @click="as === 'button' && $emit('activate')"
>
  <!-- unchanged svg + dock-tip -->
</component>
```

Note: `itemEl` is currently `ref<HTMLElement | null>`. With `<component :is>` the ref is still the DOM element for native tags — fine. If `typecheck` flags the ref type, widen to `ref<HTMLElement | null>(null)` (already is) — no change.

- [ ] **Step 9: Update `app/widgets/desktop-shell/ui/Dock/Dock.vue`**

9a. Script — import the modal composable, compute an `open` handler:

```ts
import { useMediaQuery } from '@vueuse/core'
import type { Locale } from '~/shared/config/i18n'
import type { DockItemConfig } from '~/shared/config/navigation'
import { DockItem } from '~/widgets/desktop-shell/ui/DockItem'
import { useResumeModal } from '~/features/resume-viewer'

const appConfig = useAppConfig()
const { locale, t } = useI18n()
const { open: openResume } = useResumeModal()
```

9b. Keep the `items` computed as-is (it still computes the résumé `href` — the modal reads its own). Template:

```html
<DockItem
  v-for="item in items"
  :key="item.id"
  :icon="item.icon"
  :label="item.label"
  :as="item.id === 'resume' ? 'button' : 'a'"
  :href="item.id === 'resume' ? undefined : item.href"
  :is-external="item.id !== 'resume'"
  :pointer-x="pointerX"
  @activate="item.id === 'resume' && openResume()"
/>
```

FSD note: `widgets → features` is a downward import — allowed. Confirm `eslint.config.mjs`'s `no-restricted-imports` for the widgets layer permits `~/features/*` (it should; the layout already imports `~/features/*`).

- [ ] **Step 10: Mount `<ResumeModal>` in `app/widgets/desktop-shell/ui/DesktopShell/DesktopShell.vue`**

Add the import and render it inside `<ClientOnly>` (it is inert until `isOpen`):

```ts
import { ResumeModal } from '~/features/resume-viewer'
```

```html
<ClientOnly>
  <Transition name="folders">
    <DesktopSurface v-if="booted" />
  </Transition>
  <!-- …menu bar, dock… -->
  <ResumeModal />
</ClientOnly>
```

- [ ] **Step 11: Plain-stack résumé link in `app/entities/profile/ui/AboutCard/AboutCard.vue`**

Add a locale-aware download link at the end of the card so it is always in the SSR HTML:

```vue
<script setup lang="ts">
import { Chip } from '~/shared/ui'
import type { Profile } from '~/entities/profile/model/types'
import type { Locale } from '~/shared/config/i18n'

defineProps<{ profile: Profile }>()

const { locale, t } = useI18n()
const resumeHref = computed(() => `/resume/${locale.value as Locale}.pdf`)
</script>
```

In the template, after the `<dl>`:

```html
<a
  :href="resumeHref"
  download
  class="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
>
  {{ t('resume.download') }}
</a>
```

- [ ] **Step 12: i18n — add `resume.*` to both locale files**

`i18n/locales/en.json` — add a top-level `"resume"` block:

```json
  "resume": {
    "title": "Résumé",
    "download": "Download PDF",
    "close": "Close résumé"
  },
```

`i18n/locales/ru.json`:

```json
  "resume": {
    "title": "Резюме",
    "download": "Скачать PDF",
    "close": "Закрыть резюме"
  },
```

Keep the existing `dock.resume` key ("Résumé (PDF)" / "Резюме (PDF)") — it is the Dock tile's `aria-label`.

- [ ] **Step 13: Run the résumé test, expect PASS**

Run: `pnpm test:e2e -- resume.spec.ts --project=chromium`
Expected: PASS. Also run `pnpm test:e2e -- intro.spec.ts --project=chromium` — that spec asserts `dockLocator(page).locator('a[href]')` has count 4. **The résumé tile is now a `<button>`, so that count drops to 3.** Update `intro.spec.ts`:

```ts
// Dock = 3 social links + the résumé button.
const tiles = dockLocator(page).locator('a[href], button')
await expect(tiles).toHaveCount(4)
```

Re-run `intro.spec.ts` → PASS.

- [ ] **Step 14: Checkpoint**

Run: `pnpm lint && pnpm typecheck`
Expected: clean.

---

## Task 4: Contact form + `contact` deck section

**Files:**

- Modify: `nuxt.config.ts`
- Modify: `.env.example`
- Create: `app/features/contact-form/ui/ContactForm/ContactForm.vue`
- Create: `app/features/contact-form/ui/ContactForm/constants.ts`
- Create: `app/features/contact-form/ui/ContactForm/index.ts`
- Create: `app/features/contact-form/index.ts`
- Create: `app/widgets/site-sections/ui/ContactSection/ContactSection.vue`
- Create: `app/widgets/site-sections/ui/ContactSection/index.ts`
- Modify: `app/widgets/site-sections/index.ts`
- Modify: `app/shared/config/navigation.ts`
- Modify: `app/pages/index.vue`
- Modify: `i18n/locales/ru.json`, `i18n/locales/en.json`
- Test: `tests/e2e/contact.spec.ts`

**Interfaces:**

- Consumes: `useRuntimeConfig().public.web3formsKey: string`; `SectionShell` from `~/shared/ui`; `SECTION_IDS` / `SectionId` from `~/shared/config/navigation`.
- Produces:
  - `~/features/contact-form` barrel exports `ContactForm`.
  - `contact-form/ui/ContactForm/constants.ts` exports `WEB3FORMS_ENDPOINT: string`, `CONTACT_SUBJECT: string`, `NAME_MAX_LENGTH`/`EMAIL_MAX_LENGTH`/`MESSAGE_MAX_LENGTH: number`.
  - `~/widgets/site-sections` barrel adds `ContactSection` export and `SECTION_REGISTRY.contact`.
  - `SECTION_IDS` becomes `['about', 'experience', 'projects', 'contact']`.

- [ ] **Step 1: Write the failing test — `tests/e2e/contact.spec.ts`**

```ts
import { test, expect, type Page } from '@playwright/test'

const settle = (page: Page) => page.waitForTimeout(800)

test.describe('contact form', () => {
  test('the contact form is in the prerendered HTML', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html).toContain('id="contact"')
    expect(html).toContain('name="email"')
    expect(html).toContain('name="message"')
  })

  test('submitting posts to Web3Forms and shows the thank-you state', async ({
    page,
  }) => {
    await page.route('**/api.web3forms.com/submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'ok' }),
      })
    })

    await page.goto('/#contact')
    await settle(page)

    const form = page.locator('form#contact-form')
    await form.getByLabel(/имя|name/i).fill('Jane Client')
    await form.getByLabel(/e-?mail|почта/i).fill('jane@example.com')
    await form.getByLabel(/сообщение|message/i).fill('Hello from the tests.')
    await form.getByRole('button', { name: /отправить|send/i }).click()

    await expect(page.getByText(/спасибо|thanks|получил/i)).toBeVisible()
  })

  test('a Web3Forms failure shows the error state', async ({ page }) => {
    await page.route('**/api.web3forms.com/submit', (route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'bad' }),
      }),
    )

    await page.goto('/#contact')
    await settle(page)

    const form = page.locator('form#contact-form')
    await form.getByLabel(/имя|name/i).fill('Jane')
    await form.getByLabel(/e-?mail|почта/i).fill('jane@example.com')
    await form.getByLabel(/сообщение|message/i).fill('Hi')
    await form.getByRole('button', { name: /отправить|send/i }).click()

    await expect(page.getByText(/не удалось|failed|ошибка|error/i)).toBeVisible()
  })
})
```

- [ ] **Step 2: Run it, expect FAIL**

Run: `pnpm test:e2e -- contact.spec.ts --project=chromium`
Expected: FAIL — no `#contact` section, no form.

- [ ] **Step 3: `nuxt.config.ts` — runtime config**

Add a top-level `runtimeConfig` key (Nuxt merges `NUXT_PUBLIC_WEB3FORMS_KEY` into `public.web3formsKey` automatically):

```ts
  runtimeConfig: {
    public: {
      web3formsKey: '',
    },
  },
```

- [ ] **Step 4: `.env.example` — document the var**

Append:

```
# Web3Forms access key for the contact form (create one for
# gregorymansurov@gmail.com at https://web3forms.com — it is emailed to you).
# The form renders without it but the submit button stays disabled.
NUXT_PUBLIC_WEB3FORMS_KEY=
```

- [ ] **Step 5: `app/features/contact-form/ui/ContactForm/constants.ts`**

```ts
/** Web3Forms submission endpoint (client-side POST, JSON). */
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/** Subject line on the email Web3Forms sends. */
export const CONTACT_SUBJECT = 'New message from the portfolio contact form'

export const NAME_MAX_LENGTH = 80
export const EMAIL_MAX_LENGTH = 120
export const MESSAGE_MAX_LENGTH = 2000
```

- [ ] **Step 6: `app/features/contact-form/ui/ContactForm/ContactForm.vue`**

```vue
<script setup lang="ts">
/*
 * Contact form. Client-side POST to Web3Forms (the site stays static). A
 * hidden honeypot (`botcheck`) catches bots. The access key comes from
 * runtime config; with no key the form renders but submit is disabled.
 */
import {
  CONTACT_SUBJECT,
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  WEB3FORMS_ENDPOINT,
} from '~/features/contact-form/ui/ContactForm/constants'

type Status = 'idle' | 'sending' | 'ok' | 'error'

const { t } = useI18n()
const accessKey = useRuntimeConfig().public.web3formsKey as string

const form = reactive({ name: '', email: '', message: '', botcheck: '' })
const status = ref<Status>('idle')
const hasKey = computed(() => accessKey.length > 0)

const fieldId = {
  name: useId(),
  email: useId(),
  message: useId(),
}

const submit = async () => {
  if (!hasKey.value || status.value === 'sending') return
  if (form.botcheck) return // bot filled the honeypot
  status.value = 'sending'
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: CONTACT_SUBJECT,
        from_name: form.name,
        replyto: form.email,
        name: form.name,
        email: form.email,
        message: form.message,
      }),
    })
    const result = (await response.json()) as { success?: boolean }
    if (response.ok && result.success) {
      status.value = 'ok'
      form.name = ''
      form.email = ''
      form.message = ''
    } else {
      status.value = 'error'
    }
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <form id="contact-form" class="space-y-5" novalidate @submit.prevent="submit">
    <p class="text-fg/80">{{ t('contact.lead') }}</p>

    <div
      v-if="!hasKey"
      class="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted"
    >
      {{ t('contact.noKey') }}
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <label :for="fieldId.name" class="block text-sm">
        <span class="mb-1 block font-medium text-faint">{{ t('contact.name') }}</span>
        <input
          :id="fieldId.name"
          v-model.trim="form.name"
          name="name"
          type="text"
          required
          :maxlength="NAME_MAX_LENGTH"
          class="w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus-visible:border-accent"
        />
      </label>
      <label :for="fieldId.email" class="block text-sm">
        <span class="mb-1 block font-medium text-faint">{{ t('contact.email') }}</span>
        <input
          :id="fieldId.email"
          v-model.trim="form.email"
          name="email"
          type="email"
          required
          :maxlength="EMAIL_MAX_LENGTH"
          class="w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus-visible:border-accent"
        />
      </label>
    </div>

    <label :for="fieldId.message" class="block text-sm">
      <span class="mb-1 block font-medium text-faint">{{ t('contact.message') }}</span>
      <textarea
        :id="fieldId.message"
        v-model.trim="form.message"
        name="message"
        required
        rows="5"
        :maxlength="MESSAGE_MAX_LENGTH"
        class="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus-visible:border-accent"
      />
    </label>

    <input
      v-model="form.botcheck"
      type="checkbox"
      name="botcheck"
      tabindex="-1"
      autocomplete="off"
      class="hidden"
      aria-hidden="true"
    />

    <div class="flex items-center gap-4">
      <button
        type="submit"
        :disabled="!hasKey || status === 'sending'"
        class="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ status === 'sending' ? t('contact.sending') : t('contact.send') }}
      </button>
      <p
        v-if="status === 'ok' || status === 'error'"
        role="status"
        aria-live="polite"
        class="text-sm"
        :class="status === 'ok' ? 'text-accent' : 'text-red-500'"
      >
        {{ status === 'ok' ? t('contact.ok') : t('contact.error') }}
      </p>
    </div>
  </form>
</template>
```

- [ ] **Step 7: barrels**

`app/features/contact-form/ui/ContactForm/index.ts`:

```ts
export { default as ContactForm } from '~/features/contact-form/ui/ContactForm/ContactForm.vue'
```

`app/features/contact-form/index.ts`:

```ts
export { ContactForm } from '~/features/contact-form/ui/ContactForm'
```

- [ ] **Step 8: `app/widgets/site-sections/ui/ContactSection/ContactSection.vue`**

```vue
<script setup lang="ts">
import { SectionShell } from '~/shared/ui'
import { ContactForm } from '~/features/contact-form'

defineProps<{ inWindow?: boolean }>()

const { t } = useI18n()
</script>

<template>
  <SectionShell id="contact" :title="t('sections.contact')" :in-window="inWindow">
    <ContactForm />
  </SectionShell>
</template>
```

`app/widgets/site-sections/ui/ContactSection/index.ts`:

```ts
export { default as ContactSection } from '~/widgets/site-sections/ui/ContactSection/ContactSection.vue'
```

- [ ] **Step 9: `app/widgets/site-sections/index.ts` — register**

```ts
import type { SectionRegistry } from '~/shared/config/navigation'
import { AboutSection } from '~/widgets/site-sections/ui/AboutSection'
import { ExperienceSection } from '~/widgets/site-sections/ui/ExperienceSection'
import { ProjectsSection } from '~/widgets/site-sections/ui/ProjectsSection'
import { ContactSection } from '~/widgets/site-sections/ui/ContactSection'

export { AboutSection } from '~/widgets/site-sections/ui/AboutSection'
export { ExperienceSection } from '~/widgets/site-sections/ui/ExperienceSection'
export { ProjectsSection } from '~/widgets/site-sections/ui/ProjectsSection'
export { ContactSection } from '~/widgets/site-sections/ui/ContactSection'

/** Section id → the component rendered inline and inside its deck window. */
export const SECTION_REGISTRY: SectionRegistry = {
  about: AboutSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  contact: ContactSection,
}
```

- [ ] **Step 10: `app/shared/config/navigation.ts` — add the id**

```ts
export const SECTION_IDS = ['about', 'experience', 'projects', 'contact'] as const
```

- [ ] **Step 11: `app/pages/index.vue` — plain stack**

Import and render `ContactSection` after `ProjectsSection`:

```ts
import {
  AboutSection,
  ContactSection,
  ExperienceSection,
  ProjectsSection,
  SECTION_REGISTRY,
} from '~/widgets/site-sections'
```

```html
<div v-else class="mx-auto max-w-2xl divide-y divide-line pb-32">
  <AboutSection />
  <ExperienceSection />
  <ProjectsSection />
  <ContactSection />
</div>
```

- [ ] **Step 12: i18n — `sections.contact` + `contact.*` in both files**

`i18n/locales/en.json` — add `"contact"` under `sections` and a top-level `"contact"` block:

```json
  "sections": {
    "about": "About",
    "experience": "Experience",
    "projects": "Portfolio",
    "contact": "Contact"
  },
```

```json
  "contact": {
    "lead": "Prefer email? Send me a message and I'll reply to your address.",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "send": "Send",
    "sending": "Sending…",
    "ok": "Thanks — got it. I'll be in touch.",
    "error": "Couldn't send. Try again, or email gregorymansurov@gmail.com.",
    "noKey": "The contact form isn't configured yet. Meanwhile: gregorymansurov@gmail.com"
  },
```

`i18n/locales/ru.json`:

```json
  "sections": {
    "about": "Обо мне",
    "experience": "Опыт",
    "projects": "Портфолио",
    "contact": "Контакты"
  },
```

```json
  "contact": {
    "lead": "Удобнее почтой? Напишите — отвечу на ваш адрес.",
    "name": "Имя",
    "email": "Почта",
    "message": "Сообщение",
    "send": "Отправить",
    "sending": "Отправляю…",
    "ok": "Спасибо — получил. Скоро свяжусь.",
    "error": "Не удалось отправить. Попробуйте ещё раз или напишите на gregorymansurov@gmail.com.",
    "noKey": "Форма ещё не настроена. Пока что: gregorymansurov@gmail.com"
  },
```

- [ ] **Step 13: Update the deck / desktop specs for 4 sections**

- `tests/e2e/deck.spec.ts` — widen the window-index lists to `[0, 1, 2, 3]` (Task 1 left them at `[0, 1, 2]` if it ran first).
- `tests/e2e/smoke.spec.ts` — the `'RU home renders with all sections'` loop: add `'contact'` to `['about', 'experience', 'projects', 'contact']`.
- `tests/e2e/desktop.spec.ts` — no change needed (indexes 0–2 still valid), but the right-click menu now lists 4 "Open …" items; existing assertions do not count them.

- [ ] **Step 14: Set a test key so the submit path runs in e2e**

`playwright.config.ts` `webServer.env` — add:

```ts
      NUXT_PUBLIC_WEB3FORMS_KEY:
        process.env.NUXT_PUBLIC_WEB3FORMS_KEY ?? 'test-key-e2e',
```

This makes the button enabled during tests; the `page.route` mock intercepts the real network call.

- [ ] **Step 15: Run the contact test, expect PASS**

Run: `pnpm test:e2e -- contact.spec.ts smoke.spec.ts --project=chromium`
Expected: PASS.

- [ ] **Step 16: Checkpoint**

Run: `pnpm lint && pnpm typecheck`
Expected: clean.

---

## Task 5: Full verification

**Files:** none (verification only).

- [ ] **Step 1: Lint + types**

Run: `pnpm lint && pnpm typecheck`
Expected: clean.

- [ ] **Step 2: Full e2e across all projects**

Run: `pnpm test:e2e`
Expected: all pass (chromium, webkit, mobile-safari). Desktop-only deck/dock/resume tests `skip` on webkit + mobile per the existing pattern — confirm they show as skipped, not failed. The contact + plain-résumé-link tests run on all three.

- [ ] **Step 3: Manual smoke via the browser preview**

Start the dev server (`preview_start` with the `dev` launch config) and check, on a desktop viewport:

1. Intro boots straight into the About window (no bare-desktop gap first).
2. Scrolling down moves through About → Experience → Portfolio → Contact, and **long window content scrolls inside the window** before the next window takes over.
3. Past the last window you land on the bare desktop (wallpaper + icons, interactive).
4. Red traffic light on a window scrolls down to that bare desktop.
5. Dock résumé tile opens the modal; the PDF previews; "Download" saves the locale PDF; Escape + backdrop close it.
6. Contact window: fill + send. With `NUXT_PUBLIC_WEB3FORMS_KEY` unset you see the "not configured" notice and a disabled button; with a real key a submit reaches `gregorymansurov@gmail.com`.
7. Toggle `prefers-reduced-motion` / narrow viewport → plain stack with all four sections, the résumé `<a download>` in About, and the contact form all present.

- [ ] **Step 4: Report**

Summarise what changed, the manual-check screenshots, and the one owner action still outstanding: **generate a Web3Forms access key for `gregorymansurov@gmail.com` and set `NUXT_PUBLIC_WEB3FORMS_KEY` in the deploy environment.**

---

## Self-Review

**Spec coverage:**

- Spec §1 (scroll inside windows) → Task 2. ✓
- Spec §2 (desktop at the end) → Task 1. ✓
- Spec §3 (résumé modal) → Task 3 (modal, composable, Dock button, plain `<a download>`, i18n). ✓
- Spec §4 (contact form) → Task 4 (runtime config, feature slice, section, `SECTION_IDS`, plain stack, i18n). ✓
- Spec "Testing" → each task writes its spec; Task 5 runs the full matrix. ✓
- Spec "Out of scope" (server route, touch pass-through, menu-bar trigger) → not implemented; `useResumeModal` is shared-ready. ✓

**Placeholder scan:** no TBD/TODO; every code step has literal content; tests have real assertions.

**Type consistency:**

- `useResumeModal()` → `{ isOpen, open, close }` — defined in Task 3 step 3, consumed in steps 9 (`open`) and 5 (`isOpen`, `close`). ✓
- `DockItem` `as` prop + `activate` emit — defined step 7–8, consumed step 9. ✓
- `DECK_DESKTOP_TRAIL` — defined Task 1 step 3, consumed step 4. ✓
- `OWNS_SCROLL_FOCUS_THRESHOLD` / `SCROLL_EDGE_EPSILON_PX` — defined Task 2 step 3, consumed steps 4–5. ✓
- `SURFACE_REVEAL_START` — defined Task 1 step 5a, consumed 5b. ✓
- `web3formsKey` — `nuxt.config.ts` step 3, consumed in `ContactForm.vue` step 6, keyed in `playwright.config.ts` step 14. ✓
- `SECTION_REGISTRY.contact` needs `ContactSection` — created step 8, registered step 9, and `SectionRegistry` is `Record<SectionId, Component>` so adding `contact` to `SECTION_IDS` (step 10) keeps the type total. ✓
- Deck window-index test lists: Task 1 notes the `[0,1,2]` vs `[0,1,2,3]` ordering hazard and Task 4 step 13 reconciles it. ✓
