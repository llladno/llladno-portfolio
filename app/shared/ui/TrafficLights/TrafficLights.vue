<script setup lang="ts">
import { TRAFFIC_LIGHTS } from '~/shared/ui/TrafficLights/constants'

defineProps<{ closeLabel: string; zoomLabel: string }>()
const emit = defineEmits<{ close: []; zoom: [] }>()

const activate = (id: 'close' | 'zoom') => {
  if (id === 'close') emit('close')
  else emit('zoom')
}
</script>

<template>
  <span class="group flex gap-2">
    <button
      v-for="light in TRAFFIC_LIGHTS"
      :key="light.id"
      type="button"
      :aria-label="light.id === 'close' ? closeLabel : zoomLabel"
      class="grid size-3 place-items-center rounded-full text-[9px] font-bold leading-none text-black/55"
      :style="{ background: light.colorVar }"
      @click="activate(light.id)"
    >
      <span class="opacity-0 transition-opacity group-hover:opacity-100">
        {{ light.glyph }}
      </span>
    </button>
  </span>
</template>
