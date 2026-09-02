/** How often the menu-bar clock re-renders, in ms. */
export const CLOCK_REFRESH_MS = 30_000

/** Wallpaper never fully disappears, even at progress 0 (it sits behind the photo). */
export const WALLPAPER_MIN_OPACITY = 0.2

/** Intro progress at which the wallpaper reaches full opacity and stays there. */
export const WALLPAPER_REVEAL_END = 0.5

/** Where a freshly opened window sits before the user drags it, in px. */
export const WINDOW_INITIAL_POSITION = { x: 140, y: 96 }

/** Resting Dock tile size, in px. */
export const DOCK_ITEM_SIZE_PX = 48

/** Pointer distance over which a Dock tile ramps to full magnification, in px. */
export const DOCK_MAGNIFY_RADIUS_PX = 115

/** Peak scale of the tile directly under the pointer. */
export const DOCK_MAGNIFY_MAX_SCALE = 1.22

/** How far the tile under the pointer lifts, in px. */
export const DOCK_MAGNIFY_LIFT_PX = 9

/** localStorage key holding the user's dragged desktop-icon layout. */
export const DESKTOP_ICONS_STORAGE_KEY = 'portfolio:desktop-icons'

/** Where the first desktop icon sits by default, in px from the top-left. */
export const DESKTOP_ICON_ORIGIN_PX = { x: 16, y: 52 }

/** Vertical gap between icons in the default column, in px. */
export const DESKTOP_ICON_STEP_Y_PX = 104

/** Icon footprint — used for drag-clamping and marquee hit-testing, in px. */
export const DESKTOP_ICON_SIZE_PX = { width: 92, height: 92 }
