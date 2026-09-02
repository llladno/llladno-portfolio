<script setup lang="ts">
/*
 * One stat over the hero photo — a bare number + caption, no chrome. The number
 * ticks up to its value the first time the stat becomes active (a real eased
 * count, not a scroll scrub — small numbers look janky scrubbed); scrolling
 * back past it resets so it replays. Position and visibility come from the
 * parent; this only counts and paints.
 */
import { easeOutCubic } from '~/shared/lib'
import { COUNT_DURATION_MS } from '~/widgets/intro-stage/ui/IntroStats/constants'

const props = defineProps<{
  target: number
  suffix: string
  label: string
  anchor: string
  active: boolean
  opacity: number
  liftPx: number
}>()

const shown = ref(0)
let frameHandle = 0

const countTo = (target: number) => {
  cancelAnimationFrame(frameHandle)
  const from = shown.value
  const startedAt = performance.now()
  const tick = (now: number) => {
    const fraction = Math.min(1, (now - startedAt) / COUNT_DURATION_MS)
    shown.value = Math.round(from + (target - from) * easeOutCubic(fraction))
    if (fraction < 1) frameHandle = requestAnimationFrame(tick)
  }
  frameHandle = requestAnimationFrame(tick)
}

watch(
  () => props.active,
  (active) => {
    if (active) {
      countTo(props.target)
    } else {
      cancelAnimationFrame(frameHandle)
      shown.value = 0
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => cancelAnimationFrame(frameHandle))
</script>

<template>
  <div
    class="pointer-events-none absolute"
    :class="anchor"
    :style="{ opacity, transform: `translateY(${liftPx}px)` }"
    aria-hidden="true"
  >
    <span
      class="block font-display text-6xl font-semibold tabular-nums leading-none text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)] sm:text-7xl"
    >
      {{ shown }}{{ suffix }}
    </span>
    <span
      class="mt-2 block text-[0.72rem] font-medium uppercase tracking-[0.22em] text-white/75 drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)]"
    >
      {{ label }}
    </span>
  </div>
</template>
