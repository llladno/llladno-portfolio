/**
 * Deck progress BELOW which the desktop stays hidden. Above it (the deck's
 * trailing zone, where every window has receded) the desktop fades in and
 * takes pointer input — it is the deck's final resting state.
 */
export const SURFACE_REVEAL_START = 0.82

/** The desktop never fades below this opacity once revealed. */
export const SURFACE_MIN_OPACITY = 0.12
