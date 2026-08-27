<script setup lang="ts">
// Fixed gradient backdrop for the desktop. Fades in with intro progress.
const { progress } = useIntroState()
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 -z-0 transition-opacity duration-700"
    :style="{ opacity: Math.max(0.15, progress) }"
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
