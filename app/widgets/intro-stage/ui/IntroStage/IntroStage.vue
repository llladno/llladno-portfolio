<script setup lang="ts">
/*
 * Owns the intro "boot".
 *
 * Slide 1 is a plain landing — a full-bleed hero photo behind a scrim, with
 * the name over it. On a capable viewport (first visit) the inner layer is
 * pinned with `position: sticky`; a scroll listener derives `progress` (0–1)
 * and GSAP applies each layer's state:
 *
 *   photo parallaxes up (drift + a touch of scale, never a zoom) and
 *   dissolves, revealing the OS <Wallpaper> that already sits behind everything
 *   → past BOOT_PROGRESS_THRESHOLD the macOS chrome assembles.
 *   Scrolling back up past BOOT_UNBOOT_THRESHOLD restores the landing.
 *
 * Otherwise (reduced motion, small viewport, return visit): render
 * <IntroFallback> and boot immediately.
 *
 * SSR renders <IntroFallback> (it carries the page <h1>); the cinematic stage
 * is gated behind `isMounted` so the client's first paint matches the server.
 */
import type { gsap as Gsap } from 'gsap'
import { useEventListener } from '@vueuse/core'
import { clamp, useDesktopMode, useIntroState } from '~/shared/lib'
import {
  BOOT_PROGRESS_THRESHOLD,
  BOOT_UNBOOT_THRESHOLD,
  INTRO_STAGE_HEIGHT_VH,
  PARALLAX_SCALE_END,
  PARALLAX_SCALE_START,
  PARALLAX_SHIFT_PERCENT,
  TL_PHOTO_FADE_END,
  TL_PHOTO_FADE_START,
} from '~/widgets/intro-stage/model/constants'
import { HeroLayer } from '~/widgets/intro-stage/ui/HeroLayer'
import { IntroCopy } from '~/widgets/intro-stage/ui/IntroCopy'
import { IntroStats } from '~/widgets/intro-stage/ui/IntroStats'
import { IntroFallback } from '~/widgets/intro-stage/ui/IntroFallback'

const PROGRESS_MIN = 0
const PROGRESS_MAX = 1

const { isDesktop, prefersReducedMotion } = useDesktopMode()
const { progress, booted, setProgress, boot } = useIntroState()

const isMounted = ref(false)
const startedBooted = booted.value

const isCinematic = computed(
  () =>
    isMounted.value && isDesktop.value && !prefersReducedMotion.value && !startedBooted,
)

const stageEl = ref<HTMLElement | null>(null)
const pinEl = ref<HTMLElement | null>(null)
const heroEl = ref<HTMLElement | null>(null)

const stageHeight = `${INTRO_STAGE_HEIGHT_VH}vh`

let gsap: typeof Gsap | null = null
let frameHandle = 0

const lerp = (start: number, end: number, amount: number): number =>
  start + (end - start) * amount

/** Map overall progress onto a sub-range, clamped to 0–1. */
const subProgress = (value: number, rangeStart: number, rangeEnd: number): number =>
  clamp((value - rangeStart) / (rangeEnd - rangeStart), PROGRESS_MIN, PROGRESS_MAX)

const applyChoreography = (value: number) => {
  if (!gsap || !heroEl.value) return

  const faded = subProgress(value, TL_PHOTO_FADE_START, TL_PHOTO_FADE_END)
  gsap.set(heroEl.value, {
    yPercent: -PARALLAX_SHIFT_PERCENT * value,
    scale: lerp(PARALLAX_SCALE_START, PARALLAX_SCALE_END, value),
    autoAlpha: 1 - faded,
  })
}

const readProgress = () => {
  const stage = stageEl.value
  if (!stage) return

  const bounds = stage.getBoundingClientRect()
  const scrollableDistance = bounds.height - window.innerHeight
  const scrolledPast = clamp(-bounds.top, PROGRESS_MIN, scrollableDistance)
  const nextProgress =
    scrollableDistance > 0 ? scrolledPast / scrollableDistance : PROGRESS_MIN

  setProgress(nextProgress)
  applyChoreography(nextProgress)

  // Toggle the desktop chrome from progress, with hysteresis so a scroll that
  // parks near the threshold doesn't flicker. Scrolling back up to the landing
  // retracts it — the first slide returns to its initial state.
  if (!booted.value && nextProgress >= BOOT_PROGRESS_THRESHOLD) {
    booted.value = true
  } else if (booted.value && nextProgress < BOOT_UNBOOT_THRESHOLD) {
    booted.value = false
  }
}

const scheduleRead = () => {
  cancelAnimationFrame(frameHandle)
  frameHandle = requestAnimationFrame(readProgress)
}

useEventListener('scroll', scheduleRead, { passive: true })
useEventListener('resize', scheduleRead, { passive: true })

onMounted(async () => {
  isMounted.value = true
  await nextTick()

  if (!isCinematic.value) {
    boot()
    return
  }

  const gsapModule = await import('gsap')
  gsap = gsapModule.gsap
  await nextTick()
  readProgress()
})

onBeforeUnmount(() => cancelAnimationFrame(frameHandle))
</script>

<template>
  <div
    v-if="isCinematic"
    ref="stageEl"
    class="intro-stage"
    :style="{ height: stageHeight }"
  >
    <div ref="pinEl" class="intro-pin">
      <div ref="heroEl" class="intro-photo">
        <HeroLayer />
        <div class="intro-scrim" aria-hidden="true" />
      </div>

      <IntroCopy :progress="progress" />
      <IntroStats :progress="progress" />
    </div>
  </div>

  <IntroFallback v-else />
</template>

<style scoped>
.intro-stage {
  position: relative;
}

.intro-pin {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Oversized so the parallax drift never reveals an edge. */
.intro-photo {
  position: absolute;
  inset: -18vh 0;
  will-change: transform, opacity;
}

.intro-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    color-mix(in oklab, var(--color-glow-edge) 62%, transparent) 0%,
    color-mix(in oklab, var(--color-glow-edge) 12%, transparent) 30%,
    color-mix(in oklab, var(--color-glow-edge) 30%, transparent) 62%,
    color-mix(in oklab, var(--color-glow-edge) 78%, transparent) 100%
  );
}
</style>
