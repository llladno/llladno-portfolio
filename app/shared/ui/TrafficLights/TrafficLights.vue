<script setup lang="ts">
import { TRAFFIC_LIGHTS } from '~/shared/ui/TrafficLights/constants'

defineProps<{ closeLabel: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <span class="flex gap-1.5">
    <button
      v-for="light in TRAFFIC_LIGHTS"
      :key="light.id"
      :type="light.interactive ? 'button' : undefined"
      :disabled="!light.interactive"
      :aria-label="light.id === 'close' ? closeLabel : undefined"
      :aria-hidden="light.interactive ? undefined : 'true'"
      :tabindex="light.interactive ? undefined : -1"
      class="size-3 rounded-full"
      :style="{ background: light.colorVar }"
      @click="light.id === 'close' && emit('close')"
    />
  </span>
</template>
