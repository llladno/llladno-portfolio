export interface TrafficLight {
  id: 'close' | 'zoom'
  colorVar: string
  /** Glyph shown on hover of the cluster (macOS detail). */
  glyph: string
}

/** Red closes, green zooms to full screen. (Minimize is not part of this OS.) */
export const TRAFFIC_LIGHTS: readonly TrafficLight[] = [
  {
    id: 'close',
    colorVar: 'var(--color-tl-close)',
    glyph: '×',
  },
  {
    id: 'zoom',
    colorVar: 'var(--color-tl-zoom)',
    glyph: '⤢',
  },
]
