import type { SectionId } from '~/shared/config/navigation'

const DECK_PROGRESS_MIN = 0

/**
 * Shared state of the window deck.
 *
 * - `deckProgress` (0–1) — written by `WindowDeck` from scroll position; drives
 *   the scroll-driven window cascade.
 * - `forcedSectionId` — a window opened directly (a desktop folder, the menu
 *   bar) rather than by scrolling. While set, that window is focused on top of
 *   the deck without moving the page; `DesktopSurface` dims behind it.
 */
export const useDeckState = () => {
  const deckProgress = useState('deck:progress', () => DECK_PROGRESS_MIN)
  const forcedSectionId = useState<SectionId | null>('deck:forced', () => null)
  return { deckProgress, forcedSectionId }
}
