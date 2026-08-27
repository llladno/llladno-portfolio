<script setup lang="ts">
import { useDraggable } from '@vueuse/core'

const props = defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()

const handle = ref<HTMLElement | null>(null)
const titleId = useId()

const { x, y, style } = useDraggable(handle, {
  initialValue: { x: 120, y: 80 },
  preventDefault: true,
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
void props
void x
void y
</script>

<template>
  <div
    class="glass fixed z-40 flex max-h-[80dvh] w-[min(90vw,720px)] flex-col overflow-hidden rounded-[var(--radius-window)]"
    :style="style"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
  >
    <div
      ref="handle"
      class="flex cursor-grab items-center gap-2 border-b border-[var(--color-glass-border)] px-3 py-2 active:cursor-grabbing"
    >
      <span class="flex gap-1.5">
        <button
          type="button"
          class="size-3 rounded-full"
          style="background: var(--color-tl-close)"
          :aria-label="'Close'"
          @click="emit('close')"
        />
        <span
          class="size-3 rounded-full"
          style="background: var(--color-tl-min)"
          aria-hidden="true"
        />
        <span
          class="size-3 rounded-full"
          style="background: var(--color-tl-zoom)"
          aria-hidden="true"
        />
      </span>
      <span :id="titleId" class="mx-auto text-sm font-medium">{{ title }}</span>
    </div>

    <div class="overflow-y-auto p-5">
      <slot />
    </div>
  </div>
</template>
