<script setup lang="ts">
import { Chip, ExternalLinks } from '~/shared/ui'
import type { ExternalLink } from '~/shared/ui'
import { CaseBlocks } from '~/entities/project/ui/CaseBlocks'
import type { LocalizedProject } from '~/entities/project/model/types'

const props = defineProps<{
  project: LocalizedProject
  /** Whether the full case body is visible (collapsed in the inline list). */
  expanded: boolean
}>()

const emit = defineEmits<{ open: [] }>()

const { t } = useI18n()

const outboundLinks = computed<ExternalLink[]>(() => {
  const { demo, repo } = props.project.links
  const links: ExternalLink[] = []
  if (demo) links.push({ label: t('project.demo'), href: demo })
  if (repo) links.push({ label: t('project.repo'), href: repo })
  return links
})
</script>

<template>
  <article :id="`projects-${project.slug}`" class="card overflow-hidden">
    <button
      type="button"
      class="group flex w-full items-start justify-between gap-5 p-5 text-left transition-colors hover:bg-elevated/50"
      @click="emit('open')"
    >
      <div class="min-w-0">
        <h3 class="font-display text-lg font-semibold tracking-tight text-fg">
          {{ project.title }}
        </h3>
        <p class="mt-1 text-sm text-muted">{{ project.summary }}</p>
        <ul v-if="project.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
          <li v-for="tag in project.tags" :key="tag">
            <Chip>{{ tag }}</Chip>
          </li>
        </ul>
      </div>
      <span class="mt-1 shrink-0 font-mono text-xs text-faint">
        {{ project.year }}
      </span>
    </button>

    <div v-show="expanded" class="border-t border-line px-5 pb-5 pt-4">
      <CaseBlocks :blocks="project.blocks" />
      <ExternalLinks v-if="outboundLinks.length" :links="outboundLinks" class="mt-5" />
    </div>
  </article>
</template>
