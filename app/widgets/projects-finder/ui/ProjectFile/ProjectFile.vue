<script setup lang="ts">
/* One tile in the Finder grid: a poster thumbnail, filename and dimensions. */
import type { LocalizedProject } from '~/entities/project'
import {
  projectFileDimensions,
  projectFileName,
  projectPosterSrc,
} from '~/widgets/projects-finder/model/file-meta'
import { FileGlyph } from '~/widgets/projects-finder/ui/FileGlyph'

const props = defineProps<{
  project: LocalizedProject
  selected: boolean
}>()

const emit = defineEmits<{ select: []; open: [] }>()

const { t } = useI18n()

const THUMB_SIZE = 96

const openHint = computed(() => (props.project.links.demo ? t('finder.open') : undefined))

const fileName = computed(() => projectFileName(props.project))
const dimensions = computed(() => projectFileDimensions(props.project))

// Explicit aria-label so the accessible name always includes the filename —
// a native <button> would otherwise fall back to `title` for its name, which
// would make every tile announce as "Open in a new tab".
const accessibleLabel = computed(() => {
  const base = `${props.project.title} — ${fileName.value}`
  return openHint.value ? `${base}. ${openHint.value}` : base
})

const thumbSrc = computed(() => {
  const { media, slug } = props.project
  if (!media) return null
  if (media.kind === 'video') return projectPosterSrc(slug)
  if (media.kind === 'image') return media.src
  return null
})

const isVideo = computed(() => props.project.media?.kind === 'video')
</script>

<template>
  <li class="list-none">
    <button
      type="button"
      role="option"
      :aria-selected="selected"
      :aria-label="accessibleLabel"
      :title="fileName"
      class="flex w-full flex-col items-center gap-1.5 rounded-lg p-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      :class="selected ? 'bg-accent/20' : 'hover:bg-elevated/60'"
      @click="emit('select')"
      @dblclick="emit('open')"
      @keydown.enter="emit('open')"
    >
      <span
        class="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border border-line bg-surface"
      >
        <NuxtImg
          v-if="thumbSrc"
          :src="thumbSrc"
          :width="THUMB_SIZE"
          :height="THUMB_SIZE"
          class="h-full w-full object-cover"
          loading="lazy"
        />
        <FileGlyph v-else class="size-7 text-faint" />
        <span
          v-if="isVideo"
          class="absolute bottom-1 right-1 flex size-4 items-center justify-center rounded-full bg-elevated/90 text-fg"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" class="size-2.5" fill="currentColor">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        </span>
      </span>
      <span
        class="line-clamp-2 max-w-full text-[11px] font-medium leading-tight [overflow-wrap:anywhere]"
        :class="selected ? 'rounded bg-accent px-1 text-accent-contrast' : 'text-fg'"
      >
        {{ fileName }}
      </span>
      <span class="text-[10px] leading-none text-faint">{{ dimensions }}</span>
    </button>
  </li>
</template>
