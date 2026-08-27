<script setup lang="ts">
import { getAbout } from '~/data'
import type { Locale } from '~/data'

withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const { locale, t } = useI18n()
const data = computed(() => getAbout(locale.value as Locale))
</script>

<template>
  <section
    id="about"
    :aria-labelledby="inWindow ? undefined : 'about-h'"
    class="mx-auto max-w-3xl scroll-mt-16 px-6 py-16"
  >
    <h2 v-if="!inWindow" id="about-h" class="text-2xl font-bold">
      {{ t('sections.about') }}
    </h2>
    <p class="mt-4 text-[var(--color-muted)]">{{ data.description }}</p>
    <ul v-if="data.skills.length" class="mt-4 flex flex-wrap gap-2">
      <li v-for="s in data.skills" :key="s" class="glass rounded-full px-3 py-1 text-sm">
        {{ s }}
      </li>
    </ul>
  </section>
</template>
