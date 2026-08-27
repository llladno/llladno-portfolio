<script setup lang="ts">
/*
 * Renders the active section inside a single draggable window. The same section
 * components are also rendered inline on the page (for SEO / plain mode); shared
 * `useAsyncData` keys mean the data is fetched once.
 */
import AboutSection from '~/components/sections/AboutSection.vue'
import ProjectsSection from '~/components/sections/ProjectsSection.vue'
import ExperienceSection from '~/components/sections/ExperienceSection.vue'
import ContactSection from '~/components/sections/ContactSection.vue'

const { t } = useI18n()
const { activeSection, close } = useSectionRouter()

const registry = {
  about: AboutSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  contact: ContactSection,
}
</script>

<template>
  <Transition name="window">
    <OsWindow
      v-if="activeSection"
      :key="activeSection"
      :title="t(`sections.${activeSection}`)"
      @close="close"
    >
      <component :is="registry[activeSection]" :in-window="true" />
    </OsWindow>
  </Transition>
</template>

<style scoped>
.window-enter-active,
.window-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.window-enter-from,
.window-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
@media (prefers-reduced-motion: reduce) {
  .window-enter-active,
  .window-leave-active {
    transition: none;
  }
}
</style>
