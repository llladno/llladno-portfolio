const CUBIC_EXPONENT = 3

/** Ease-out cubic: fast start, gentle settle. `fraction` is clamped 0–1 by callers. */
export const easeOutCubic = (fraction: number): number =>
  1 - (1 - fraction) ** CUBIC_EXPONENT
