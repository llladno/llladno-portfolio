<script setup lang="ts">
import { useSeoI18n } from '~/shared/lib'
import { IntroStage } from '~/widgets/intro-stage'
import {
  AboutSection,
  ProjectsSection,
  ExperienceSection,
  ContactSection,
} from '~/widgets/site-sections'

const { t } = useI18n()
const appConfig = useAppConfig()

useSeoI18n({
  title: `${appConfig.identity.name} — ${t('seo.tagline')}`,
  description: t('seo.description'),
  image: '/og/default.png',
})
</script>

<template>
  <div>
    <IntroStage />

    <AboutSection />
    <ProjectsSection />
    <ExperienceSection />
    <ContactSection />
  </div>
</template>
