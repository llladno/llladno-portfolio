<script setup lang="ts">
/*
 * The right pane of the Finder: an optional preview, a Get-Info-style property
 * list, and the full case study. One project's worth of DOM at a time — the
 * video element is keyed on the slug so switching projects fully swaps the
 * <source>s. Projects with no video/image (a doc, or none yet) skip the
 * preview box entirely — the Get Info + case study is the content.
 */
import { CaseBlocks } from '~/entities/project'
import type { LocalizedProject } from '~/entities/project'
import {
  projectPosterSrc,
  projectVideoSrc,
} from '~/widgets/projects-finder/model/file-meta'

const props = defineProps<{ project: LocalizedProject }>()

const { t } = useI18n()

interface InfoRow {
  label: string
  value: string
  href?: string
}

const mediaKind = computed(() => props.project.media?.kind)

const infoRows = computed<InfoRow[]>(() => {
  const { project } = props
  const rows: InfoRow[] = [
    { label: t('finder.kindLabel'), value: t(`finder.kind.${project.kindKey}`) },
    { label: t('finder.created'), value: project.year ? String(project.year) : '' },
    { label: t('finder.role'), value: project.role ?? '' },
    { label: t('finder.stack'), value: project.stack.join(', ') },
  ]
  if (project.links.demo) {
    rows.push({
      label: t('finder.where'),
      value: project.links.demo,
      href: project.links.demo,
    })
  }
  return rows.filter((row) => row.value)
})
</script>

<template>
  <div class="space-y-6 pr-1">
    <div
      v-if="mediaKind === 'video' || mediaKind === 'image'"
      class="aspect-video max-h-[360px] w-full overflow-hidden rounded-xl border border-line bg-surface"
    >
      <video
        v-if="project.media?.kind === 'video'"
        :key="project.slug"
        class="h-full w-full object-cover"
        :poster="projectPosterSrc(project.slug)"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      >
        <source :src="projectVideoSrc(project.slug, 'webm')" type="video/webm" />
        <source :src="projectVideoSrc(project.slug, 'mp4')" type="video/mp4" />
      </video>
      <NuxtImg
        v-else-if="project.media?.kind === 'image'"
        :src="project.media.src"
        :width="project.media.width"
        :height="project.media.height"
        class="h-full w-full object-cover"
      />
    </div>

    <div>
      <h3 class="font-display text-lg font-semibold tracking-tight text-fg">
        {{ project.title }}
      </h3>
      <p class="mt-1 text-sm text-muted">
        {{ t(`finder.kind.${project.kindKey}`)
        }}<template v-if="project.year"> · {{ project.year }}</template>
      </p>
    </div>

    <div>
      <h4 class="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
        {{ t('finder.info') }}
      </h4>
      <dl class="mt-3 space-y-2 text-sm">
        <div v-for="row in infoRows" :key="row.label" class="flex gap-3">
          <dt class="w-24 shrink-0 text-muted">{{ row.label }}</dt>
          <dd class="min-w-0 flex-1 text-fg/85">
            <a
              v-if="row.href"
              :href="row.href"
              target="_blank"
              rel="noopener noreferrer"
              class="break-all underline decoration-line underline-offset-2 hover:text-accent"
            >
              {{ row.value }}
            </a>
            <template v-else>{{ row.value }}</template>
          </dd>
        </div>
      </dl>
    </div>

    <div class="border-t border-line pt-6">
      <CaseBlocks :blocks="project.blocks" />
    </div>
  </div>
</template>
