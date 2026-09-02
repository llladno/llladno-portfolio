# Contact form, deck reshape, resume modal — design

Date: 2026-09-02

Four changes, discussed and approved in chat:

1. **Fix scroll inside deck windows** — content of a scroll-focused window is
   currently unreachable (Lenis owns the wheel).
2. **Move the bare desktop to the _end_ of the deck** — the intro boots straight
   into the first window; the empty desktop is the final resting state.
3. **Résumé → modal from the Dock** — the Dock `resume` item opens a modal with a
   PDF preview + a Download button, instead of linking straight to the file. No
   deck section.
4. **Contact form** — a new `contact` window that emails
   `gregorymansurov@gmail.com` via Web3Forms (site stays SSG). It is an
   **overlay** window: reachable from its desktop icon / `#contact` deep link,
   but **not part of the scroll cascade** (`SCROLL_SECTION_IDS` =
   about/experience/projects). Still in the plain SSR stack for SEO / no-JS.

---

## 1. Scroll inside deck windows

### Problem

`app/plugins/lenis.client.ts` runs Lenis with `smoothWheel: true`. Lenis
consumes wheel events to smooth-scroll the page, so a child with
`overflow-y-auto` never scrolls unless it carries `data-lenis-prevent`. In
`DeckWindow.vue` the body gets `data-lenis-prevent` + `overscroll-contain` only
when `forced || zoomed`. In the plain scroll cascade the focused window's
overflow is therefore dead — the user scrolls, the window cascades away, the
content was never readable.

### Approach — nested scroll with edge pass-through

The focused window in the cascade owns the wheel for its own content; reaching
the content's top/bottom edge hands the wheel back to the deck.

- `DeckWindow` gains a boolean `ownsScroll` prop (distinct from `forced`). When
  `ownsScroll || forced || zoomed`, the body carries `data-lenis-prevent` +
  `overscroll-contain` and scrolls natively.
- `WindowDeck` passes `:owns-scroll="win.focus >= OWNS_SCROLL_FOCUS_THRESHOLD"`
  — only the current leader owns its scroll (threshold ~0.9, a new constant).
- Edge pass-through: `DeckWindow` adds a `wheel` listener (non-passive) on its
  body. When `deltaY > 0` and `scrollTop + clientHeight >= scrollHeight - EDGE_EPS_PX`,
  or `deltaY < 0` and `scrollTop <= EDGE_EPS_PX`, it does **not**
  `preventDefault` and calls `window` scroll via the injected `$lenis`
  (`lenis.scrollTo(lenis.scroll + event.deltaY)`) so the deck advances. Inside
  the content, it lets the browser scroll natively (Lenis already ignores it via
  `data-lenis-prevent`). Touch: rely on `overscroll-contain` + native; no JS
  pass-through for touch in v1 (mobile uses the plain stack anyway).
- New constants in `window-deck/model/constants.ts`: `OWNS_SCROLL_FOCUS_THRESHOLD`,
  `SCROLL_EDGE_EPSILON_PX`.
- Reduced motion / mobile: plain stack, unaffected.

### Files

- `app/widgets/window-deck/ui/DeckWindow/DeckWindow.vue`
- `app/widgets/window-deck/ui/WindowDeck/WindowDeck.vue`
- `app/widgets/window-deck/model/constants.ts`

---

## 2. Bare desktop at the end of the deck

### Current model

`DECK_DESKTOP_LEAD = 0.16` reserves the **start** of `deckProgress` for the bare
desktop. Windows are centered at `DECK_DESKTOP_LEAD + index * windowSpan`,
`windowSpan = (1 - DECK_DESKTOP_LEAD) / (count - 1)`. `scrollFocusFor` multiplies
every window's focus by a `deskFactor` that ramps `0 → 1` across the lead zone.
`DesktopSurface` is fully opaque at `deckProgress = 0`, fading to
`SURFACE_MIN_OPACITY` by `SURFACE_FADE_END`. Closing a scroll-focused window
calls `scrollDeckToTop()`.

### New model

Rename `DECK_DESKTOP_LEAD` → `DECK_DESKTOP_TRAIL` (same value ~0.16), meaning the
**tail** of `deckProgress`.

- `windowSpan = (1 - DECK_DESKTOP_TRAIL) / (count - 1)`; window `index` centered
  at `index * windowSpan`. First window fully focused at `deckProgress = 0`,
  last at `1 - DECK_DESKTOP_TRAIL`.
- Replace the `deskFactor` ramp with a trailing ramp-down:
  `trailFactor = clamp((1 - deckProgress) / DECK_DESKTOP_TRAIL, 0, 1)`, applied
  as a multiplier to every window's `scrollFocusFor`, so the tail zone is
  genuinely window-free and the last window fades out as `deckProgress` enters
  it. No leading ramp — window 0 is at full focus from `deckProgress = 0`.
- `DesktopSurface`: invert the opacity math. `covered` is true while
  `deckProgress < SURFACE_REVEAL_START` (new constant, ~`1 - DECK_DESKTOP_TRAIL`);
  opacity ramps `SURFACE_MIN_OPACITY → 1` from `SURFACE_REVEAL_START` to `1`.
  `forcedSectionId` still forces `covered` (a directly-opened window dims the
  surface regardless of scroll). `SURFACE_FADE_END` → `SURFACE_REVEAL_START`;
  rename the constant, keep `SURFACE_MIN_OPACITY`.
- `WindowDeck`: `scrollDeckToTop()` → `scrollDeckToBottom()` — jump to
  `stage.offsetTop + (stage.offsetHeight - window.innerHeight)`. Used by
  `onClose` for a scroll-focused window ("close" now means "fall through to the
  desktop below").
- `ensureDeckInView` (deep link) unchanged — still jumps to `stage.offsetTop`,
  which is now the first window rather than the bare desktop. Fine.
- `onMounted` with no hash: no change (starts at first window in focus).
- Consequence, accepted: the intro's "boot" now lands on the About window, not
  an empty desktop.

### Files

- `app/widgets/window-deck/model/constants.ts`
- `app/widgets/window-deck/ui/WindowDeck/WindowDeck.vue`
- `app/widgets/desktop-shell/ui/DesktopSurface/DesktopSurface.vue`
- `app/widgets/desktop-shell/ui/DesktopSurface/constants.ts`

---

## 3. Résumé modal from the Dock

### Approach

- New slice `app/features/resume-viewer/`:
  - `model/use-resume-modal.ts` → `useResumeModal()` — `useState`-backed
    `{ isOpen, open, close }` (mirrors `useDeckState`), so the Dock (and later
    the menu bar) can trigger it.
  - `ui/ResumeModal/ResumeModal.vue` — `<Teleport to="body">`, backdrop, glass
    panel, `role="dialog"` + `aria-modal`, Escape + backdrop-click close, focus
    moved to the panel on open and restored on close, body scroll lock while
    open. Content: `<iframe :src="resumeHref" class="...">` preview (with a
    `<a>` fallback link inside for browsers that block inline PDF) + a prominent
    `<a :href="resumeHref" download>` **Download** button. `resumeHref =
/resume/<locale>.pdf` (locale-aware, same rule as the Dock today).
  - `index.ts` → `ResumeModal`, `useResumeModal`.
- `DockItem` / `Dock`: the `resume` item renders a `<button>` that calls
  `useResumeModal().open()` instead of an `<a>`. Minimal change: `Dock.vue`
  branches on `item.id === 'resume'`; `DockItem` gains an optional `@activate`
  emit and an `as` discriminator (`'a'` vs `'button'`) — keep the magnification
  math identical.
- `ResumeModal` is mounted once in `DesktopShell.vue` (client-only chrome).
- `app.config.ts` `dock` entry for `resume` stays (`kind: 'file'`); the href is
  still computed for the modal.
- **SEO / no-JS:** the plain-stack path must keep a real
  `<a href="/resume/<locale>.pdf" download>` in the prerendered HTML. Add it to
  `AboutCard` (or the plain `<header>` in `layouts/default.vue`) — a plain
  résumé link that is always in the HTML. The Dock modal is a client-only
  enhancement on top.

### Files

- `app/features/resume-viewer/**` (new)
- `app/widgets/desktop-shell/ui/Dock/Dock.vue`
- `app/widgets/desktop-shell/ui/DockItem/DockItem.vue` (+ `types.ts`)
- `app/widgets/desktop-shell/ui/DesktopShell/DesktopShell.vue`
- `app/entities/profile/ui/AboutCard/AboutCard.vue` (plain résumé link)
- `i18n/locales/{ru,en}.json` — `resume.title`, `resume.download`,
  `resume.previewFallback`, `a11y.resumeDialog`

---

## 4. Contact form (Web3Forms)

### Delivery

Web3Forms — client-side `POST https://api.web3forms.com/submit`, JSON body:
`{ access_key, subject, from_name, replyto, name, email, message, botcheck }`.
No account beyond a free access key tied to `gregorymansurov@gmail.com`
(**the owner generates it** at web3forms.com and confirms by email — not done by
the agent). Site stays SSG; no Nitro server route.

- `nuxt.config.ts`: `runtimeConfig.public.web3formsKey` (default `''`, from
  `NUXT_PUBLIC_WEB3FORMS_KEY`). Add the var to `.env.example`.
- If the key is empty at runtime, the form renders but shows an inline notice
  and the submit button is disabled — the build never breaks.

### Slices

- New feature `app/features/contact-form/`:
  - `ui/ContactForm/ContactForm.vue` — native `<form>` with `name`, `email`
    (`type=email`), `message` (`<textarea>`), a visually-hidden honeypot input
    named `botcheck`, and a submit `<button>`. Client validation (required +
    email pattern); `status: 'idle' | 'sending' | 'ok' | 'error'` drives an
    inline status region (`aria-live="polite"`). On success the fields clear and
    a thank-you message shows.
  - `ui/ContactForm/constants.ts` — `WEB3FORMS_ENDPOINT`, `CONTACT_SUBJECT`,
    field `maxlength`s.
  - `index.ts` → `ContactForm`.
- New section `app/widgets/site-sections/ui/ContactSection/ContactSection.vue` —
  wraps `<ContactForm>` in `SectionShell` (`id="contact"`, `inWindow` prop).
  Export from `widgets/site-sections/index.ts`; add to `SECTION_REGISTRY`.
- `app/shared/config/navigation.ts`: `SECTION_IDS = ['about', 'experience',
'projects', 'contact']`. The deck stage, desktop icon, plain-header nav link
  and plain-stack entry all key off this — except `pages/index.vue`'s plain
  stack, where `<ContactSection />` is added by hand.
- `useDesktopIcons` picks up `contact` via its `mergeDefaults`.

### i18n

`i18n/locales/{ru,en}.json`:

- `sections.contact` — "Контакты" / "Contact"
- `contact.lead`, `contact.name`, `contact.email`, `contact.message`,
  `contact.send`, `contact.sending`, `contact.ok`, `contact.error`,
  `contact.noKey` (the missing-key notice)

### Files

- `nuxt.config.ts`, `.env.example`
- `app/features/contact-form/**` (new)
- `app/widgets/site-sections/ui/ContactSection/**` (new)
- `app/widgets/site-sections/index.ts`
- `app/shared/config/navigation.ts`
- `app/pages/index.vue`
- `i18n/locales/{ru,en}.json`

---

## Testing (Playwright, TDD)

- `tests/e2e/deck.spec.ts` — update: at `deckProgress = 0` window 0 (`about`) is
  focused (`opacity > 0.75`); scrolling to the bottom of the deck shows the bare
  desktop (all windows `opacity < 0.5`, `DesktopSurface` interactive); the red
  button on a scroll-focused window lands on that bare desktop.
- `tests/e2e/deck.spec.ts` (or a new `deck-scroll.spec.ts`) — a window with
  overflowing content: wheel over the body scrolls the content first; only after
  the content bottom does the next window take focus.
- `tests/e2e/resume.spec.ts` (new) — Dock résumé item is a `<button>`; clicking
  opens a dialog containing a `download` link to `/resume/en.pdf` (and `/ru.pdf`
  under `/`); Escape closes it; the plain-stack résumé `<a download>` is in the
  SSR HTML.
- `tests/e2e/contact.spec.ts` (new) — the contact `<form>` is in the prerendered
  HTML (assert against `page.content()` before hydration or via `--no-js`
  context); required-field validation blocks submit; with the API mocked
  (`page.route('**/api.web3forms.com/**')`) a success response shows the
  thank-you state and clears the fields; a failure response shows the error
  state.
- `tests/e2e/smoke.spec.ts` / axe — contact section landmark + labelled inputs;
  résumé dialog has an accessible name and trapped focus.

## Out of scope (v1)

- Nitro server route / SMTP.
- Touch pass-through for nested window scroll (mobile uses the plain stack).
- Menu-bar résumé trigger (the composable is ready for it; not wired now).
- Rate-limiting / captcha beyond the Web3Forms honeypot.
