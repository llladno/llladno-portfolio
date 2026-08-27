<script setup lang="ts">
/*
 * Owns the intro scroll choreography.
 *
 * Desktop + motion allowed: a tall stage with a pinned inner layer; scroll
 * progress (0–1) drives ScrubCanvas and, past ~0.9, boots the desktop.
 * Otherwise: render IntroFallback and boot immediately.
 *
 * NOTE (base architecture): progress is derived from a scroll listener +
 * getBoundingClientRect. The dedicated intro phase swaps this for GSAP
 * ScrollTrigger (pin + scrub) per the spec.
 */
import { useEventListener, useIntersectionObserver } from '@vueuse/core'

// Populated by scripts/build-intro-frames.mjs output; 0 until frames exist.
const FRAME_COUNT = 0
const frames = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/intro/frames-1280/${String(i + 1).padStart(4, '0')}.webp`,
)

const { isDesktop, reducedMotion } = useDesktopMode()
const { progress, booted, setProgress, boot } = useIntroState()

const cinematic = computed(() => isDesktop.value && !reducedMotion.value && !booted.value)

const root = ref<HTMLElement | null>(null)
const inView = ref(false)

useIntersectionObserver(root, ([entry]) => {
  inView.value = entry?.isIntersecting ?? false
})

function onScroll() {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const total = rect.height - window.innerHeight
  const scrolled = Math.min(total, Math.max(0, -rect.top))
  const p = total > 0 ? scrolled / total : 0
  setProgress(p)
  if (p >= 0.9 && !booted.value) boot()
}

useEventListener('scroll', onScroll, { passive: true })
onMounted(() => {
  if (!cinematic.value) boot()
  else onScroll()
})
</script>

<template>
  <IntroFallback v-if="!cinematic && !booted" />

  <div v-else-if="cinematic" ref="root" class="relative h-[350vh]">
    <div class="sticky top-0 grid h-dvh place-items-center overflow-hidden">
      <ScrubCanvas
        v-if="frames.length"
        :frames="frames"
        :progress="progress"
        :active="inView"
        class="absolute inset-0"
      />
      <IntroCopy :progress="progress" />
    </div>
  </div>
</template>
