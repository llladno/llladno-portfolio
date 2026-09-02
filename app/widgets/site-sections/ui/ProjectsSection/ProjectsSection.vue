<script setup lang="ts">
import type { Locale } from '~/shared/config/i18n'
import { SectionShell } from '~/shared/ui'
import { ProjectCard, getProjects } from '~/entities/project'
import { useSectionRouter } from '~/features/section-router'
import { ProjectFinder } from '~/widgets/projects-finder'

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
  <SectionShell id="projects" :title="t('sections.projects')" :in-window="inWindow">
    <!-- Inside a window: the Finder. Otherwise (SSR/SEO baseline, mobile,
         reduced motion) full case bodies stay in the DOM as a plain list. -->
    <ProjectFinder v-if="inWindow" />
    <div v-else class="grid gap-3">
      <ProjectCard
        v-for="project in projects"
        :key="project.slug"
        :project="project"
        :expanded="isExpanded(project.slug)"
        @open="open('projects', project.slug)"
      />
    </div>
  </SectionShell>
</template>
