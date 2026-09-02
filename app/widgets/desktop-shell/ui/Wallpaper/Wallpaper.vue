<script setup lang="ts">
/*
 * The desktop wallpaper — a fixed, full-viewport background for the whole
 * "OS". Revealed as the intro photo parallaxes away, then it stays put behind
 * every section for the rest of the page.
 */
import { useIntroState } from '~/shared/lib'
import {
  WALLPAPER_MIN_OPACITY,
  WALLPAPER_REVEAL_END,
} from '~/widgets/desktop-shell/model/constants'

const { progress } = useIntroState()

const opacity = computed(() =>
  Math.min(1, Math.max(WALLPAPER_MIN_OPACITY, progress.value / WALLPAPER_REVEAL_END)),
)
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500"
    :style="{ opacity }"
    aria-hidden="true"
  >
    <div class="wallpaper-surface absolute inset-0" />
    <div
      class="absolute inset-0"
      style="
        background: radial-gradient(
          130% 100% at 50% 34%,
          transparent 38%,
          var(--color-wall-vignette) 100%
        );
      "
    />
  </div>
</template>
