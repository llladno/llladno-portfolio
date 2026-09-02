<script setup lang="ts">
/*
 * A macOS-style context menu. Positioned at the pointer, clamped inside the
 * viewport. Closes on Escape, a click outside, or a scroll. Arrow keys move the
 * highlight; Enter runs the highlighted row.
 */
import { onClickOutside, useEventListener } from '@vueuse/core'
import { clamp } from '~/shared/lib'
import type { DesktopMenuItem } from '~/widgets/desktop-shell/model/types'
import {
  CONTEXT_MENU_EDGE_GAP_PX,
  CONTEXT_MENU_ROW_PX,
  CONTEXT_MENU_WIDTH_PX,
} from '~/widgets/desktop-shell/ui/DesktopContextMenu/constants'

const props = defineProps<{
  clientX: number
  clientY: number
  items: DesktopMenuItem[]
  label: string
}>()

const emit = defineEmits<{ close: [] }>()

const rootEl = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const position = computed(() => {
  if (import.meta.server) return { left: props.clientX, top: props.clientY }
  const menuHeight = props.items.length * CONTEXT_MENU_ROW_PX + CONTEXT_MENU_EDGE_GAP_PX
  return {
    left: clamp(
      props.clientX,
      CONTEXT_MENU_EDGE_GAP_PX,
      window.innerWidth - CONTEXT_MENU_WIDTH_PX - CONTEXT_MENU_EDGE_GAP_PX,
    ),
    top: clamp(
      props.clientY,
      CONTEXT_MENU_EDGE_GAP_PX,
      window.innerHeight - menuHeight - CONTEXT_MENU_EDGE_GAP_PX,
    ),
  }
})

const choose = (item: DesktopMenuItem) => {
  item.run()
  emit('close')
}

const onKeydown = (event: KeyboardEvent) => {
  const count = props.items.length
  if (event.key === 'Escape') {
    emit('close')
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % count
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + count) % count
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const item = props.items[activeIndex.value]
    if (item) choose(item)
  }
}

onClickOutside(rootEl, () => emit('close'))
useEventListener('scroll', () => emit('close'), { passive: true })
useEventListener('resize', () => emit('close'), { passive: true })

onMounted(() => rootEl.value?.focus())
</script>

<template>
  <div
    ref="rootEl"
    class="fixed z-[70] overflow-hidden rounded-lg border border-glass-border bg-glass-strong p-1 shadow-[0_20px_60px_-16px_var(--color-glass-shadow)] backdrop-blur-2xl focus:outline-none"
    :style="{
      left: `${position.left}px`,
      top: `${position.top}px`,
      width: `${CONTEXT_MENU_WIDTH_PX}px`,
    }"
    role="menu"
    :aria-label="label"
    tabindex="-1"
    @keydown="onKeydown"
    @contextmenu.prevent
  >
    <button
      v-for="(item, index) in items"
      :key="item.key"
      type="button"
      role="menuitem"
      class="flex w-full items-center rounded px-3 py-1.5 text-left text-[13px] transition-colors"
      :class="
        index === activeIndex
          ? 'bg-accent text-accent-contrast'
          : 'text-fg/90 hover:bg-line-strong'
      "
      @mouseenter="activeIndex = index"
      @click="choose(item)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
