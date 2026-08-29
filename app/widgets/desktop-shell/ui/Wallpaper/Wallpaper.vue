<script setup lang="ts">
import { useIntroState } from '~/shared/lib'
import { WALLPAPER_MIN_OPACITY } from '~/widgets/desktop-shell/model/constants'

const { progress } = useIntroState()

const opacity = computed(() => Math.max(WALLPAPER_MIN_OPACITY, progress.value))
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 -z-0 transition-opacity duration-700"
    :style="{ opacity }"
    aria-hidden="true"
  >
    <div
      class="absolute inset-0"
      style="
        background:
          radial-gradient(120% 120% at 20% 10%, var(--color-wall-a), transparent 60%),
          radial-gradient(120% 120% at 90% 80%, var(--color-wall-c), transparent 55%),
          linear-gradient(160deg, var(--color-wall-a), var(--color-wall-b));
      "
    />
  </div>
</template>
