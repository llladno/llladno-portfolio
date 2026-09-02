import type { SectionId } from '~/shared/config/navigation'

/** A desktop icon's position on the wallpaper, in px from the viewport's top-left. */
export interface IconPosition {
  x: number
  y: number
}

export type IconPositions = Record<SectionId, IconPosition>

/** One row in the desktop context menu. */
export interface DesktopMenuItem {
  key: string
  label: string
  run: () => void
}
