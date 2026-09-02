<script setup lang="ts">
import type { Locale } from '~/shared/config/i18n'
import { SectionShell } from '~/shared/ui'
import { ExperienceTimeline, getJobs } from '~/entities/experience'

withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const { locale, t } = useI18n()
const jobs = computed(() => getJobs(locale.value as Locale))
</script>

<template>
  <SectionShell id="experience" :title="t('sections.experience')" :in-window="inWindow">
    <ExperienceTimeline :jobs="jobs" />
  </SectionShell>
</template>
