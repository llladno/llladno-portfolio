<script setup lang="ts">
/*
 * Owns the intro scroll choreography.
 *
 * Desktop + motion allowed: a tall stage with a pinned inner layer; scroll
 * progress (0–1) drives the scrub canvas and, past BOOT_PROGRESS_THRESHOLD,
 * boots the desktop. Otherwise: render the fallback and boot immediately.
 *
 * NOTE (base architecture): progress is derived from a scroll listener +
 * getBoundingClientRect. The dedicated intro phase swaps this for GSAP
 * ScrollTrigger (pin + scrub) per the spec.
 */
import { useEventListener, useIntersectionObserver } from '@vueuse/core'
import { clamp, useDesktopMode, useIntroState } from '~/shared/lib'
import {
  BOOT_PROGRESS_THRESHOLD,
  INTRO_STAGE_HEIGHT_VH,
  introFrameSources,
} from '~/widgets/intro-stage/model/constants'
import { ScrubCanvas } from '~/widgets/intro-stage/ui/ScrubCanvas'
import { IntroCopy } from '~/widgets/intro-stage/ui/IntroCopy'
import { IntroFallback } from '~/widgets/intro-stage/ui/IntroFallback'

const frameSources = introFrameSources()

const { isDesktop, prefersReducedMotion } = useDesktopMode()
const { progress, booted, setProgress, boot } = useIntroState()

const isCinematic = computed(
  () => isDesktop.value && !prefersReducedMotion.value && !booted.value,
)

const stageEl = ref<HTMLElement | null>(null)
const isInViewport = ref(false)

useIntersectionObserver(stageEl, ([entry]) => {
  isInViewport.value = entry?.isIntersecting ?? false
})

const updateProgressFromScroll = () => {
  const stage = stageEl.value
  if (!stage) return

  const bounds = stage.getBoundingClientRect()
  const scrollableDistance = bounds.height - window.innerHeight
  const scrolledPast = clamp(-bounds.top, 0, scrollableDistance)
  const scrollProgress = scrollableDistance > 0 ? scrolledPast / scrollableDistance : 0

  setProgress(scrollProgress)
  if (scrollProgress >= BOOT_PROGRESS_THRESHOLD && !booted.value) boot()
}

useEventListener('scroll', updateProgressFromScroll, { passive: true })
onMounted(() => {
  if (isCinematic.value) updateProgressFromScroll()
  else boot()
})
</script>

<template>
  <IntroFallback v-if="!isCinematic && !booted" />

  <div
    v-else-if="isCinematic"
    ref="stageEl"
    :style="{ height: `${INTRO_STAGE_HEIGHT_VH}vh` }"
    class="relative"
  >
    <div class="sticky top-0 grid h-dvh place-items-center overflow-hidden">
      <ScrubCanvas
        v-if="frameSources.length"
        :frame-sources="frameSources"
        :progress="progress"
        :active="isInViewport"
        class="absolute inset-0"
      />
      <IntroCopy :progress="progress" />
    </div>
  </div>
</template>
