import { useLocalStorage } from '@vueuse/core'
import { clamp } from '~/shared/lib'
import { SECTION_IDS } from '~/shared/config/navigation'
import type { SectionId } from '~/shared/config/navigation'
import type { IconPositions } from '~/widgets/desktop-shell/model/types'
import {
  DESKTOP_ICONS_STORAGE_KEY,
  DESKTOP_ICON_ORIGIN_PX,
  DESKTOP_ICON_SIZE_PX,
  DESKTOP_ICON_STEP_Y_PX,
} from '~/widgets/desktop-shell/model/constants'

const MIN_COORD = 0

/** The out-of-the-box layout: a single column down the left edge. */
const defaultPositions = (): IconPositions =>
  Object.fromEntries(
    SECTION_IDS.map((id, index) => [
      id,
      {
        x: DESKTOP_ICON_ORIGIN_PX.x,
        y: DESKTOP_ICON_ORIGIN_PX.y + index * DESKTOP_ICON_STEP_Y_PX,
      },
    ]),
  ) as IconPositions

/**
 * Owns where the desktop folder icons sit. Positions persist per-browser in
 * localStorage so a drag survives a reload; `arrangeIcons` snaps them back to
 * the default column. Client-only — the desktop surface never renders on the
 * server.
 */
export const useDesktopIcons = () => {
  const positions = useLocalStorage<IconPositions>(
    DESKTOP_ICONS_STORAGE_KEY,
    defaultPositions(),
    { mergeDefaults: true },
  )

  const moveIcon = (id: SectionId, x: number, y: number) => {
    const maxX = Math.max(MIN_COORD, window.innerWidth - DESKTOP_ICON_SIZE_PX.width)
    const maxY = Math.max(MIN_COORD, window.innerHeight - DESKTOP_ICON_SIZE_PX.height)
    positions.value = {
      ...positions.value,
      [id]: { x: clamp(x, MIN_COORD, maxX), y: clamp(y, MIN_COORD, maxY) },
    }
  }

  const arrangeIcons = () => {
    positions.value = defaultPositions()
  }

  return { positions, moveIcon, arrangeIcons }
}
