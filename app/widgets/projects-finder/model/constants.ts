/** Grid tile sizing — matches macOS Finder's icon-view proportions. */
export const FINDER_TILE_MIN_WIDTH_PX = 92
export const FINDER_TILE_GAP_PX = 12

/*
 * With nothing selected the grid fills the width (browse mode). Once a file is
 * picked it shrinks to a compact two-column list on the LEFT and the inspector
 * takes the rest on the RIGHT — the Portfolio deck window is wide but the
 * preview still wants the room.
 */
export const FINDER_GRID_PINNED_WIDTH_PX = 228

/*
 * Height budget for the split inside the deck window: the window is
 * `max-h-[76dvh]` and its body adds a title bar (2.75rem) + padding (3.5rem).
 * Capping the finder just under that keeps the window body itself from
 * scrolling — only the two panes scroll, and only when their content overflows.
 */
export const FINDER_MAX_HEIGHT = 'calc(76dvh - 6.75rem)'

/** Directory the recording script writes into (see scripts/record-project-previews.mjs). */
export const FINDER_MEDIA_BASE_PATH = '/projects'
