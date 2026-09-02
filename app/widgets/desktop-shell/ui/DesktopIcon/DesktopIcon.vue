<script setup lang="ts">
/*
 * One folder icon on the desktop. Absolutely positioned from the layout the
 * surface owns. Single click selects (shift/⌘ adds to the selection), double
 * click or Enter opens the window, drag past a threshold moves the icon, right
 * click asks the surface for a context menu.
 */
import type { SectionId } from '~/shared/config/navigation'
import type { IconPosition } from '~/widgets/desktop-shell/model/types'
import {
  FOLDER_ICON_PATH,
  ICON_DRAG_THRESHOLD_PX,
} from '~/widgets/desktop-shell/ui/DesktopIcon/constants'

const props = defineProps<{
  id: SectionId
  label: string
  hint: string
  position: IconPosition
  selected: boolean
}>()

const emit = defineEmits<{
  select: [additive: boolean]
  open: []
  menu: [clientX: number, clientY: number]
  move: [x: number, y: number]
}>()

const PRIMARY_BUTTON = 0

const rootEl = ref<HTMLButtonElement | null>(null)

const drag = ref<{
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
  active: boolean
} | null>(null)

let suppressClick = false

const onPointerDown = (event: PointerEvent) => {
  if (event.button !== PRIMARY_BUTTON) return
  drag.value = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: props.position.x,
    originY: props.position.y,
    active: false,
  }
}

const onPointerMove = (event: PointerEvent) => {
  const state = drag.value
  if (!state || event.pointerId !== state.pointerId) return

  const deltaX = event.clientX - state.startX
  const deltaY = event.clientY - state.startY
  if (!state.active && Math.hypot(deltaX, deltaY) < ICON_DRAG_THRESHOLD_PX) return

  if (!state.active) {
    state.active = true
    rootEl.value?.setPointerCapture(state.pointerId)
    if (!props.selected) emit('select', false)
  }
  emit('move', state.originX + deltaX, state.originY + deltaY)
}

const onPointerUp = (event: PointerEvent) => {
  const state = drag.value
  if (!state || event.pointerId !== state.pointerId) return
  if (state.active) {
    rootEl.value?.releasePointerCapture(state.pointerId)
    suppressClick = true
  }
  drag.value = null
}

const onClick = (event: MouseEvent) => {
  if (suppressClick) {
    suppressClick = false
    return
  }
  emit('select', event.shiftKey || event.metaKey || event.ctrlKey)
}

const onDoubleClick = () => emit('open')

const onContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  emit('menu', event.clientX, event.clientY)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('open')
  }
}

defineExpose({ focus: () => rootEl.value?.focus() })
</script>

<template>
  <button
    ref="rootEl"
    type="button"
    class="desktop-icon absolute flex w-[92px] flex-col items-center gap-1.5 rounded-xl p-2.5 text-center transition-colors hover:bg-fg/10 focus-visible:bg-fg/10"
    :class="selected ? 'bg-fg/15 ring-1 ring-fg/25' : ''"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    :title="hint"
    :aria-pressed="selected"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @click="onClick"
    @dblclick="onDoubleClick"
    @contextmenu="onContextMenu"
    @keydown="onKeydown"
  >
    <svg
      viewBox="0 0 24 24"
      class="size-11 drop-shadow-[0_2px_6px_rgba(0,0,0,0.32)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="`folder-${id}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="oklch(0.82 0.12 62)" />
          <stop offset="1" stop-color="oklch(0.62 0.15 48)" />
        </linearGradient>
      </defs>
      <path :d="FOLDER_ICON_PATH" :fill="`url(#folder-${id})`" />
    </svg>
    <span
      class="text-[11px] font-medium leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
      :class="selected ? 'rounded bg-accent px-1 text-accent-contrast' : 'text-fg'"
    >
      {{ label }}
    </span>
  </button>
</template>

<style scoped>
.desktop-icon {
  touch-action: none;
}
</style>
