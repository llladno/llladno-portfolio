<script setup lang="ts">
import type { GlassPanelProps } from '~/shared/ui/GlassPanel/types'

withDefaults(defineProps<GlassPanelProps>(), { as: 'div' })
</script>

<template>
  <component :is="as" class="glass">
    <slot />
  </component>
</template>
