/** Height of the pinned scroll stage, in viewport heights. */
export const INTRO_STAGE_HEIGHT_VH = 350

/** Scroll progress (0–1) at which the desktop "boots" and the pin releases. */
export const BOOT_PROGRESS_THRESHOLD = 0.9

/** Intro headline reaches full transparency at `progress = 1 / FADE_SPEED`. */
export const INTRO_COPY_FADE_SPEED = 3

/** Max upward travel of the intro headline as progress goes 0 → 1, in px. */
export const INTRO_COPY_LIFT_PX = 40

/** Canvas fallback when `window.devicePixelRatio` is unavailable. */
export const DEFAULT_PIXEL_RATIO = 1

/** Frame image width variant to load. */
export const FRAME_WIDTH_PX = 1280

/**
 * Number of frames produced by `scripts/build-intro-frames.mjs`. Stays 0 until
 * a real intro video has been sliced; the scrub canvas is inert while it is 0.
 */
export const FRAME_COUNT = 0

const FRAME_NUMBER_PAD = 4

export const frameSrc = (frameNumber: number): string =>
  `/intro/frames-${FRAME_WIDTH_PX}/${String(frameNumber).padStart(FRAME_NUMBER_PAD, '0')}.webp`

export const introFrameSources = (): string[] =>
  Array.from({ length: FRAME_COUNT }, (_, index) => frameSrc(index + 1))
