<script setup lang="ts">
/*
 * The projects window's interior, redone as a macOS Finder: a grid of "files"
 * on the left, a Get-Info-style inspector on the right. The inspector is
 * hidden until a file is clicked — like Finder, nothing is previewed up front;
 * once one is picked the grid shrinks to a compact two-column list and the
 * inspector takes the rest. Selection is owned by useSectionRouter (the same
 * #projects/<slug> hash the plain card list uses), so a deep link opens the
 * same file here.
 *
 * The row is capped at FINDER_MAX_HEIGHT so the deck window's own body never
 * scrolls — each pane scrolls itself, and only when it overflows.
 */
import type { Locale } from '~/shared/config/i18n'
import { getProjects } from '~/entities/project'
import { useSectionRouter } from '~/features/section-router'
import {
  FINDER_GRID_PINNED_WIDTH_PX,
  FINDER_MAX_HEIGHT,
} from '~/widgets/projects-finder/model/constants'
import { ProjectFileGrid } from '~/widgets/projects-finder/ui/ProjectFileGrid'
import { ProjectInspector } from '~/widgets/projects-finder/ui/ProjectInspector'

const { locale, t } = useI18n()
const { activeProjectSlug, open } = useSectionRouter()

const projects = computed(() => getProjects(locale.value as Locale))

// No default — the inspector stays hidden until a file is actually clicked.
const selectedSlug = computed(() => activeProjectSlug.value)

const selectedProject = computed(
  () => projects.value.find((project) => project.slug === selectedSlug.value) ?? null,
)

const select = (slug: string) => open('projects', slug)

const openFile = (slug: string) => {
  const project = projects.value.find((candidate) => candidate.slug === slug)
  if (project?.links.demo) window.open(project.links.demo, '_blank', 'noopener')
}
</script>

<template>
  <div class="flex gap-5" :style="{ maxHeight: FINDER_MAX_HEIGHT }">
    <ProjectFileGrid
      class="finder-pane shrink-0 overflow-y-auto"
      :style="selectedProject ? { width: `${FINDER_GRID_PINNED_WIDTH_PX}px` } : {}"
      :class="selectedProject ? '' : 'w-full'"
      :projects="projects"
      :selected-slug="selectedSlug"
      :label="t('sections.projects')"
      @select="select"
      @open="openFile"
    />
    <ProjectInspector
      v-if="selectedProject"
      class="finder-pane min-w-0 flex-1 overflow-y-auto"
      :project="selectedProject"
    />
  </div>
</template>

<style scoped>
/* Thin, quiet scrollbars for both panes (Vue scopes this onto the child roots). */
.finder-pane {
  scrollbar-width: thin;
  scrollbar-color: var(--color-line-strong) transparent;
}

.finder-pane::-webkit-scrollbar {
  width: 6px;
}

.finder-pane::-webkit-scrollbar-thumb {
  background: var(--color-line-strong);
  border-radius: 3px;
}
</style>
