<script setup lang="ts">
import { useDesktopMode, useIdentity, useSeoI18n } from '~/shared/lib'
import { IntroStage } from '~/widgets/intro-stage'
import { WindowDeck } from '~/widgets/window-deck'
import { SocialLinks } from '~/shared/ui'
import {
  AboutSection,
  ContactSection,
  ExperienceSection,
  ProjectsSection,
  SECTION_REGISTRY,
} from '~/widgets/site-sections'

const { t } = useI18n()
const { isDesktop } = useDesktopMode()
const { name } = useIdentity()

useSeoI18n({
  title: `${name.value} — ${t('seo.tagline')}`,
  description: t('seo.description'),
  image: '/og/default.png',
})

// SSR + first client paint render the plain stack (all content in the HTML for
// SEO). On a capable viewport the scroll-driven window deck takes over after
// mount; reduced motion / mobile keep the stack.
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
const useDeck = computed(() => isMounted.value && isDesktop.value)
</script>

<template>
  <div>
    <IntroStage />

    <WindowDeck v-if="useDeck" :sections="SECTION_REGISTRY" />

    <div v-else class="mx-auto max-w-2xl pb-16">
      <div class="divide-y divide-line">
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </div>
      <footer class="border-t border-line px-7 pt-10 sm:px-10">
        <SocialLinks />
      </footer>
    </div>
  </div>
</template>
