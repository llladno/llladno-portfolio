<script setup lang="ts">
/*
 * Light / dark switch. Shows the theme you'd get by clicking (sun when dark,
 * moon when light). Client-only where mounted, so the icon never renders
 * against the wrong theme during hydration.
 */
import { useTheme } from '~/shared/lib'

const { t } = useI18n()
const { theme, toggle } = useTheme()

const nextLabel = computed(() =>
  theme.value === 'dark' ? t('theme.toLight') : t('theme.toDark'),
)
</script>

<template>
  <button
    type="button"
    class="grid size-6 place-items-center rounded opacity-75 transition-opacity hover:opacity-100"
    :aria-label="nextLabel"
    :title="nextLabel"
    @click="toggle"
  >
    <svg
      v-if="theme === 'dark'"
      viewBox="0 0 24 24"
      class="size-4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"
      />
    </svg>
    <svg
      v-else
      viewBox="0 0 24 24"
      class="size-4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 13.5A8 8 0 0 1 10.5 4a7 7 0 1 0 9.5 9.5z" />
    </svg>
  </button>
</template>
