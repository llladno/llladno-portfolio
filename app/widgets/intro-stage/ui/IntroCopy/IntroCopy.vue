<script setup lang="ts">
import { useIdentity } from '~/shared/lib'
import {
  INTRO_COPY_FADE_SPEED,
  INTRO_COPY_LIFT_PX,
} from '~/widgets/intro-stage/model/constants'

const props = defineProps<{ progress: number }>()

const { t } = useI18n()
const { name, role } = useIdentity()

const opacity = computed(() => Math.max(0, 1 - props.progress * INTRO_COPY_FADE_SPEED))
const liftPx = computed(() => -props.progress * INTRO_COPY_LIFT_PX)
</script>

<template>
  <div
    class="pointer-events-none absolute inset-x-0 bottom-[8%] px-6 text-center"
    :style="{ opacity, transform: `translateY(${liftPx}px)` }"
  >
    <h1
      class="font-display text-5xl font-semibold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-7xl"
    >
      {{ name }}
    </h1>
    <p class="mt-3 text-lg font-medium text-white/70 sm:text-xl">{{ role }}</p>
    <p class="mt-10 text-[0.7rem] uppercase tracking-[0.3em] text-white/40">
      {{ t('intro.scrollHint') }}
    </p>
  </div>
</template>
