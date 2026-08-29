<script setup lang="ts">
import { GlassPanel } from '~/shared/ui'
import { DOCK_ICON_LABEL_LENGTH } from '~/widgets/desktop-shell/model/constants'

defineProps<{
  label: string
  isActive?: boolean
  href?: string
  isExternal?: boolean
}>()

const emit = defineEmits<{ activate: [] }>()

const glyph = (label: string) => label.slice(0, DOCK_ICON_LABEL_LENGTH)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : 'button'"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :aria-current="isActive ? 'true' : undefined"
    :title="label"
    class="group relative grid size-12 place-items-center rounded-xl transition-transform duration-150 hover:-translate-y-1 hover:scale-110 motion-reduce:transform-none motion-reduce:transition-none"
    @click="!href && emit('activate')"
  >
    <GlassPanel class="grid size-11 place-items-center rounded-xl text-xs font-medium">
      {{ glyph(label) }}
    </GlassPanel>
    <span class="sr-only">{{ label }}</span>
    <span
      v-if="isActive"
      class="absolute -bottom-1.5 size-1 rounded-full bg-current"
      aria-hidden="true"
    />
  </component>
</template>
