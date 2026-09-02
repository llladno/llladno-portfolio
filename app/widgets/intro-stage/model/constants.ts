/*
 * Tunables for the code-driven intro "boot".
 *
 * Slide 1 is a plain landing: full-bleed hero photo + scrim + copy. Scrolling
 * through the sticky stage parallaxes the photo and dissolves it, revealing
 * the OS wallpaper that already sits behind everything; past
 * BOOT_PROGRESS_THRESHOLD the macOS chrome assembles. Scrolling back up past
 * BOOT_UNBOOT_THRESHOLD restores the landing.
 *
 * A scroll listener derives overall progress (0–1); the `TL_*` pairs carve
 * that into the sub-ranges each layer animates across.
 */

/**
 * Height of the scroll stage, in viewport heights. The inner layer sticks for
 * the first 100vh, so the choreography plays over the remaining `HEIGHT - 100`.
 * Kept short so the content sheet follows the photo promptly.
 */
export const INTRO_STAGE_HEIGHT_VH = 340

/** Progress (0–1) past which the macOS chrome assembles. */
export const BOOT_PROGRESS_THRESHOLD = 0.94

/** Progress below which (scrolling back up) the chrome retracts and the landing returns. */
export const BOOT_UNBOOT_THRESHOLD = 0.82

/* ---- Hero photo: parallax (drift + a touch of scale), never a zoom ---- */

/** How far the photo drifts up over the whole stage, as a % of its own height. */
export const PARALLAX_SHIFT_PERCENT = 11

/** Gentle scale across the stage — depth cue, and hides the drifting edges. */
export const PARALLAX_SCALE_START = 1.04
export const PARALLAX_SCALE_END = 1.14

/* ---- Progress sub-ranges each layer animates across (0–1 overall) ---- */

/** The photo (and its scrim) dissolve across this range, revealing the wallpaper. */
export const TL_PHOTO_FADE_START = 0.62
export const TL_PHOTO_FADE_END = 0.96

/* ---- Stat callouts that count up over the photo, one at a time, before the boot ---- */

/** Overall progress at which the first stat starts fading in. */
export const INTRO_STATS_ENTER_START = 0.07

/** Progress between one stat's start and the next (spans overlap → each lives longer). */
export const INTRO_STAT_STEP = 0.26

/** Progress span allotted to each stat (fade in → hold → long drift up & out). */
export const INTRO_STAT_SPAN = 0.34

/** Fraction of a stat's span spent fading in. */
export const INTRO_STAT_FADE_IN = 0.14

/** Fractions of a stat's span across which it drifts up and fades away (long, unhurried). */
export const INTRO_STAT_EXIT_START = 0.44
export const INTRO_STAT_EXIT_END = 0.98

/** Upward travel as a stat leaves, in px; plus a small settle as it arrives. */
export const INTRO_STAT_DRIFT_PX = 46
export const INTRO_STAT_ENTER_RISE_PX = 10

/** Local progress past which a stat's number starts ticking up. */
export const INTRO_STAT_ACTIVE_MIN = 0.02

/* ---- Intro copy (headline over the photo) ---- */

/** Intro headline reaches full transparency at `progress = 1 / FADE_SPEED`. */
export const INTRO_COPY_FADE_SPEED = 4

/** Max upward travel of the intro headline as progress goes 0 → 1, in px. */
export const INTRO_COPY_LIFT_PX = 48
