<script setup lang="ts">
/*
 * The interactive desktop. A full-viewport layer behind the window deck
 * (z-0) that hosts the folder icons, a rubber-band selection rectangle and the
 * right-click context menu. It fades — and stops taking pointer input — once a
 * deck window pulls focus.
 *
 * The deck stage above it is `pointer-events: none` except for the focused
 * window, so clicks on empty wallpaper fall through to here.
 */
import { useDeckState } from '~/shared/lib'
import { SECTION_IDS } from '~/shared/config/navigation'
import type { SectionId } from '~/shared/config/navigation'
import { useSectionRouter } from '~/features/section-router'
import { useDesktopIcons } from '~/widgets/desktop-shell/model/use-desktop-icons'
import type { DesktopMenuItem } from '~/widgets/desktop-shell/model/types'
import { DESKTOP_ICON_SIZE_PX } from '~/widgets/desktop-shell/model/constants'
import { DesktopIcon } from '~/widgets/desktop-shell/ui/DesktopIcon'
import { DesktopContextMenu } from '~/widgets/desktop-shell/ui/DesktopContextMenu'
import {
  SURFACE_MIN_OPACITY,
  SURFACE_REVEAL_START,
} from '~/widgets/desktop-shell/ui/DesktopSurface/constants'

const PRIMARY_BUTTON = 0
const FULL_OPACITY = 1

const { t } = useI18n()
const { open } = useSectionRouter()
const { deckProgress, forcedSectionId } = useDeckState()
const { positions, moveIcon, arrangeIcons } = useDesktopIcons()

// Hidden while any window is up: scrolled into the deck body, or forced open.
// It reveals only in the deck's trailing zone, its final resting state.
const covered = computed(
  () => forcedSectionId.value !== null || deckProgress.value < SURFACE_REVEAL_START,
)
const opacity = computed(() => {
  if (covered.value) return SURFACE_MIN_OPACITY
  const span = FULL_OPACITY - SURFACE_REVEAL_START
  const into = (deckProgress.value - SURFACE_REVEAL_START) / span
  return SURFACE_MIN_OPACITY + into * (FULL_OPACITY - SURFACE_MIN_OPACITY)
})
const interactive = computed(() => !covered.value)

/* --- selection --- */
const selectedIds = ref<SectionId[]>([])
const isSelected = (id: SectionId) => selectedIds.value.includes(id)
const clearSelection = () => {
  selectedIds.value = []
}
const onIconSelect = (id: SectionId, additive: boolean) => {
  if (!additive) {
    selectedIds.value = [id]
  } else if (isSelected(id)) {
    selectedIds.value = selectedIds.value.filter((current) => current !== id)
  } else {
    selectedIds.value = [...selectedIds.value, id]
  }
}

const openIcon = (id: SectionId) => {
  selectedIds.value = [id]
  open(id)
}

/* --- rubber-band selection --- */
const marquee = ref<{
  startX: number
  startY: number
  endX: number
  endY: number
} | null>(null)

const marqueeRect = computed(() => {
  const box = marquee.value
  if (!box) return null
  return {
    left: Math.min(box.startX, box.endX),
    top: Math.min(box.startY, box.endY),
    width: Math.abs(box.endX - box.startX),
    height: Math.abs(box.endY - box.startY),
  }
})

const onSurfacePointerDown = (event: PointerEvent) => {
  if (event.button !== PRIMARY_BUTTON || event.target !== event.currentTarget) return
  clearSelection()
  marquee.value = {
    startX: event.clientX,
    startY: event.clientY,
    endX: event.clientX,
    endY: event.clientY,
  }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

const onSurfacePointerMove = (event: PointerEvent) => {
  if (!marquee.value) return
  marquee.value = { ...marquee.value, endX: event.clientX, endY: event.clientY }

  const rect = marqueeRect.value
  if (!rect) return
  selectedIds.value = SECTION_IDS.filter((id) => {
    const spot = positions.value[id]
    return (
      spot.x < rect.left + rect.width &&
      spot.x + DESKTOP_ICON_SIZE_PX.width > rect.left &&
      spot.y < rect.top + rect.height &&
      spot.y + DESKTOP_ICON_SIZE_PX.height > rect.top
    )
  })
}

const onSurfacePointerUp = (event: PointerEvent) => {
  ;(event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId)
  marquee.value = null
}

/* --- context menu --- */
const menu = ref<{
  clientX: number
  clientY: number
  label: string
  items: DesktopMenuItem[]
} | null>(null)

const closeMenu = () => {
  menu.value = null
}

const onIconMenu = (id: SectionId, clientX: number, clientY: number) => {
  selectedIds.value = [id]
  menu.value = {
    clientX,
    clientY,
    label: t('a11y.contextMenu'),
    items: [{ key: 'open', label: t('desktop.open'), run: () => openIcon(id) }],
  }
}

const onSurfaceContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  clearSelection()
  menu.value = {
    clientX: event.clientX,
    clientY: event.clientY,
    label: t('a11y.contextMenu'),
    items: [
      ...SECTION_IDS.map((id) => ({
        key: id,
        label: t('desktop.openFolder', { name: t(`sections.${id}`) }),
        run: () => openIcon(id),
      })),
      { key: 'arrange', label: t('desktop.arrangeIcons'), run: arrangeIcons },
    ],
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-0 transition-opacity duration-300"
    :style="{ opacity, pointerEvents: interactive ? 'auto' : 'none' }"
    :aria-label="t('a11y.desktop')"
    role="group"
    @pointerdown="onSurfacePointerDown"
    @pointermove="onSurfacePointerMove"
    @pointerup="onSurfacePointerUp"
    @pointercancel="onSurfacePointerUp"
    @contextmenu="onSurfaceContextMenu"
  >
    <DesktopIcon
      v-for="id in SECTION_IDS"
      :id="id"
      :key="id"
      :label="t(`sections.${id}`)"
      :hint="t('desktop.openFolder', { name: t(`sections.${id}`) })"
      :position="positions[id]"
      :selected="isSelected(id)"
      @select="(additive) => onIconSelect(id, additive)"
      @open="openIcon(id)"
      @menu="(clientX, clientY) => onIconMenu(id, clientX, clientY)"
      @move="(x, y) => moveIcon(id, x, y)"
    />

    <div
      v-if="marqueeRect"
      class="pointer-events-none absolute rounded-sm border border-accent/70 bg-accent/15"
      :style="{
        left: `${marqueeRect.left}px`,
        top: `${marqueeRect.top}px`,
        width: `${marqueeRect.width}px`,
        height: `${marqueeRect.height}px`,
      }"
      aria-hidden="true"
    />

    <Teleport to="body">
      <DesktopContextMenu
        v-if="menu"
        :client-x="menu.clientX"
        :client-y="menu.clientY"
        :items="menu.items"
        :label="menu.label"
        @close="closeMenu"
      />
    </Teleport>
  </div>
</template>
