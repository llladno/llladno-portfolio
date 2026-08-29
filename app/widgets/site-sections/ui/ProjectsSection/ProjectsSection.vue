<script setup lang="ts">
import type { Locale } from '~/shared/config/i18n'
import { ProjectCard, getProjects } from '~/entities/project'
import { useSectionRouter } from '~/features/section-router'

const props = withDefaults(defineProps<{ inWindow?: boolean }>(), {
  inWindow: false,
})

const { locale, t } = useI18n()
const { activeProjectSlug, open } = useSectionRouter()

const projects = computed(() => getProjects(locale.value as Locale))

const isExpanded = (slug: string): boolean =>
  !props.inWindow || activeProjectSlug.value === slug
</script>

<template>
  <section
    id="projects"
    :aria-labelledby="inWindow ? undefined : 'projects-heading'"
    class="mx-auto max-w-3xl scroll-mt-16 px-6 py-16"
  >
    <h2 v-if="!inWindow" id="projects-heading" class="mb-6 text-2xl font-bold">
      {{ t('sections.projects') }}
    </h2>

    <!-- Full case bodies stay in the DOM for SEO; the card collapses them. -->
    <div class="grid gap-4">
      <ProjectCard
        v-for="project in projects"
        :key="project.slug"
        :project="project"
        :expanded="isExpanded(project.slug)"
        @open="open('projects', project.slug)"
      />
    </div>
  </section>
</template>
