<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { GlassPanel, TrafficLights } from '~/shared/ui'
import { WINDOW_INITIAL_POSITION } from '~/widgets/desktop-shell/model/constants'

defineProps<{ title: string; closeLabel: string }>()
const emit = defineEmits<{ close: [] }>()

const dragHandleEl = ref<HTMLElement | null>(null)
const titleId = useId()

const { style: dragStyle } = useDraggable(dragHandleEl, {
  initialValue: WINDOW_INITIAL_POSITION,
  preventDefault: true,
})

const closeOnEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<template>
  <GlassPanel
    class="fixed z-40 flex max-h-[80dvh] w-[min(90vw,720px)] flex-col overflow-hidden rounded-window"
    :style="dragStyle"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
  >
    <div
      ref="dragHandleEl"
      class="flex cursor-grab items-center gap-2 border-b border-glass-border px-3 py-2 active:cursor-grabbing"
    >
      <TrafficLights :close-label="closeLabel" @close="emit('close')" />
      <span :id="titleId" class="mx-auto text-sm font-medium">{{ title }}</span>
    </div>

    <div class="overflow-y-auto p-5">
      <slot />
    </div>
  </GlassPanel>
</template>
