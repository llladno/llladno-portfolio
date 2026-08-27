<script setup lang="ts">
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
