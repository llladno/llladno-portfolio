<script setup lang="ts">
import type { Locale } from '~/shared/config/i18n'
import { SectionShell } from '~/shared/ui'
import { AboutCard, getProfile } from '~/entities/profile'

withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const { locale, t } = useI18n()
const profile = computed(() => getProfile(locale.value as Locale))
</script>

<template>
  <SectionShell id="about" :title="t('sections.about')" :in-window="inWindow">
    <AboutCard :profile="profile" />
  </SectionShell>
</template>
