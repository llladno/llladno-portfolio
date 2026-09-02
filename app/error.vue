<script setup lang="ts">
import type { NuxtError } from '#app'

const NOT_FOUND_STATUS = 404

defineProps<{ error: NuxtError }>()
const { t } = useI18n()

const goHome = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="grid min-h-dvh place-items-center p-6 text-center">
    <div>
      <p class="text-6xl font-bold">{{ error.statusCode }}</p>
      <p class="mt-2 text-muted">
        {{
          error.statusCode === NOT_FOUND_STATUS ? t('error.notFound') : t('error.generic')
        }}
      </p>
      <button
        class="mt-6 rounded-full bg-accent px-5 py-2 font-medium text-accent-contrast"
        @click="goHome"
      >
        {{ t('error.home') }}
      </button>
    </div>
  </div>
</template>
