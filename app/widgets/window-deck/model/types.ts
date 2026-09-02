/** Per-window visual state the deck computes from scroll and hands to a window. */
export interface DeckWindowVisual {
  opacity: number
  blurPx: number
  scale: number
  translateXPx: number
  translateYPx: number
  zIndex: number
}
