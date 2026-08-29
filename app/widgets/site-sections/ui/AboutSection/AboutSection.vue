<script setup lang="ts">
import type { Locale } from '~/shared/config/i18n'
import { AboutCard, getProfile } from '~/entities/profile'

withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const { locale, t } = useI18n()
const profile = computed(() => getProfile(locale.value as Locale))
</script>

<template>
  <section
    id="about"
    :aria-labelledby="inWindow ? undefined : 'about-heading'"
    class="mx-auto max-w-3xl scroll-mt-16 px-6 py-16"
  >
    <h2 v-if="!inWindow" id="about-heading" class="mb-4 text-2xl font-bold">
      {{ t('sections.about') }}
    </h2>
    <AboutCard :profile="profile" />
  </section>
</template>
