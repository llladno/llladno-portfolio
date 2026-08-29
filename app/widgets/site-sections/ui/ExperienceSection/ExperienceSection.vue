<script setup lang="ts">
import type { Locale } from '~/shared/config/i18n'
import { ExperienceTimeline, getJobs } from '~/entities/experience'

withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const { locale, t } = useI18n()
const jobs = computed(() => getJobs(locale.value as Locale))
</script>

<template>
  <section
    id="experience"
    :aria-labelledby="inWindow ? undefined : 'experience-heading'"
    class="mx-auto max-w-3xl scroll-mt-16 px-6 py-16"
  >
    <h2 v-if="!inWindow" id="experience-heading" class="mb-6 text-2xl font-bold">
      {{ t('sections.experience') }}
    </h2>
    <ExperienceTimeline :jobs="jobs" />
  </section>
</template>
