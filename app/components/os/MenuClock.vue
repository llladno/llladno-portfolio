<script setup lang="ts">
import { useNow } from '@vueuse/core'

const { locale } = useI18n()
const now = useNow({ interval: 30_000 })

const label = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now.value),
)
</script>

<template>
  <time class="tabular-nums">{{ label }}</time>
</template>
