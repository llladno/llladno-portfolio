<script setup lang="ts">
import { useNow } from '@vueuse/core'
import type { Locale } from '~/shared/config/i18n'
import { LOCALE_LANGUAGE } from '~/shared/config/i18n'
import { CLOCK_REFRESH_MS } from '~/widgets/desktop-shell/model/constants'

const { locale } = useI18n()
const now = useNow({ interval: CLOCK_REFRESH_MS })

const label = computed(() =>
  new Intl.DateTimeFormat(LOCALE_LANGUAGE[locale.value as Locale], {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now.value),
)
</script>

<template>
  <time class="tabular-nums">{{ label }}</time>
</template>
