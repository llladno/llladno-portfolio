<script setup lang="ts">
/*
 * The left column of the Finder: a wrapping grid of file tiles. Owns roving
 * keyboard focus (arrow keys move the selection; the column count is read
 * back from the grid's own resolved CSS so it tracks however many tiles
 * actually fit per row).
 */
import type { LocalizedProject } from '~/entities/project'
import {
  FINDER_TILE_GAP_PX,
  FINDER_TILE_MIN_WIDTH_PX,
} from '~/widgets/projects-finder/model/constants'
import { ProjectFile } from '~/widgets/projects-finder/ui/ProjectFile'

const props = defineProps<{
  projects: LocalizedProject[]
  selectedSlug: string | null
  label: string
}>()

const emit = defineEmits<{ select: [slug: string]; open: [slug: string] }>()

const gridEl = ref<HTMLElement | null>(null)

const columnCount = (): number => {
  const grid = gridEl.value
  if (!grid) return 1
  const template = getComputedStyle(grid).gridTemplateColumns
  return Math.max(1, template.split(' ').length)
}

const moveSelection = (delta: number) => {
  const index = props.projects.findIndex((project) => project.slug === props.selectedSlug)
  const nextIndex = Math.min(Math.max(index + delta, 0), props.projects.length - 1)
  const next = props.projects[nextIndex]
  if (next) emit('select', next.slug)
}

const ARROW_KEYS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key in ARROW_KEYS) {
    event.preventDefault()
    moveSelection(ARROW_KEYS[event.key] as number)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveSelection(-columnCount())
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveSelection(columnCount())
  } else if (event.key === 'Home') {
    event.preventDefault()
    moveSelection(-props.projects.length)
  } else if (event.key === 'End') {
    event.preventDefault()
    moveSelection(props.projects.length)
  }
}

watch(
  () => props.selectedSlug,
  async () => {
    await nextTick()
    gridEl.value
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  },
)
</script>

<template>
  <ul
    ref="gridEl"
    role="listbox"
    :aria-label="label"
    tabindex="0"
    class="grid content-start gap-3 rounded-lg p-1 outline-none"
    :style="{
      gridTemplateColumns: `repeat(auto-fill, minmax(${FINDER_TILE_MIN_WIDTH_PX}px, 1fr))`,
      gap: `${FINDER_TILE_GAP_PX}px`,
    }"
    @keydown="onKeydown"
  >
    <ProjectFile
      v-for="project in projects"
      :key="project.slug"
      :project="project"
      :selected="project.slug === selectedSlug"
      @select="emit('select', project.slug)"
      @open="emit('open', project.slug)"
    />
  </ul>
</template>
