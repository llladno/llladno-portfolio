/*
 * Tunables for the scroll-driven window deck.
 *
 * After the intro boots, scrolling scrubs a cascade of macOS windows — one per
 * section. Each window's "focus" (0–1) is a function of scroll position: fully
 * focused windows are sharp and opaque and on top; backgrounded ones are
 * blurred, dimmed, shrunk and behind. Neighbouring windows' scroll spans
 * overlap, so mid-scroll you see one closing behind the next.
 */

/** Scroll height allotted to each window, in viewport heights. */
export const DECK_WINDOW_SCROLL_VH = 88

/**
 * Fraction of the deck's scroll at the END reserved for the bare desktop —
 * wallpaper + folder icons, no window focused. Windows map onto `[0 … 1 −
 * TRAIL]`; the first is focused the instant the intro boots, the last fades out
 * as scroll enters this trailing zone. Closing a window scrolls down into it.
 */
export const DECK_DESKTOP_TRAIL = 0.16

/**
 * A window whose focus is at or above this is the cascade leader — if its
 * content overflows, the body becomes an independent scroll area (the wheel
 * scrolls its content, never the deck).
 */
export const OWNS_SCROLL_FOCUS_THRESHOLD = 0.9

/** Px slack when deciding whether a window body's content overflows. */
export const SCROLL_EDGE_EPSILON_PX = 2

/** Cascade offset between consecutive windows, in px. */
export const DECK_CASCADE_X_PX = 44
export const DECK_CASCADE_Y_PX = 32

/** Extra sideways drift a backgrounded window takes, in px (feels like it slides away). */
export const DECK_BACKGROUND_DRIFT_PX = 60

/** A fully backgrounded window keeps at least this opacity. */
export const WINDOW_MIN_OPACITY = 0.14

/** Peak blur on a fully backgrounded window, in px. */
export const WINDOW_MAX_BLUR_PX = 8

/** A fully backgrounded window shrinks to this scale. */
export const WINDOW_MIN_SCALE = 0.92

/** Fraction of a window's span it stays fully focused (the rest cross-fades). */
export const WINDOW_FOCUS_PLATEAU = 0.32

/** How far neighbouring windows' spans overlap (0 = touch, 1 = full overlap). */
export const WINDOW_SPAN_OVERLAP = 0.55

/** How strongly the focused window is pulled back toward centre (0–1). */
export const WINDOW_FOCUS_CENTER_PULL = 0.62

/** z-index granularity — the focused window lands near this, others below. */
export const WINDOW_Z_RANGE = 1000

/**
 * How long the ease lasts when a window is opened or closed directly (folder
 * double-click, menu bar) rather than scrolled to, in ms. Only applied around
 * those moments — a scroll-driven cascade stays instant per frame.
 */
export const FORCE_TRANSITION_MS = 300
