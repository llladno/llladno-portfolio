export interface TrafficLight {
  id: 'close' | 'minimize' | 'zoom'
  colorVar: string
  /** Only the close button is interactive in v1. */
  interactive: boolean
}

export const TRAFFIC_LIGHTS: readonly TrafficLight[] = [
  { id: 'close', colorVar: 'var(--color-tl-close)', interactive: true },
  { id: 'minimize', colorVar: 'var(--color-tl-min)', interactive: false },
  { id: 'zoom', colorVar: 'var(--color-tl-zoom)', interactive: false },
]
