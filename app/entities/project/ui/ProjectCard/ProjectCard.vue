<script setup lang="ts">
import { GlassPanel } from '~/shared/ui'
import { CaseBlocks } from '~/entities/project/ui/CaseBlocks'
import type { LocalizedProject } from '~/entities/project/model/types'

defineProps<{
  project: LocalizedProject
  /** Whether the full case body is visible (collapsed inside a window). */
  expanded: boolean
}>()

const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <GlassPanel :id="`projects-${project.slug}`" as="article" class="rounded-xl p-4">
    <button type="button" class="text-left text-lg font-semibold" @click="emit('open')">
      {{ project.title }}
    </button>
    <p class="mt-1 text-sm text-muted">{{ project.summary }}</p>
    <div v-show="expanded" class="mt-3">
      <CaseBlocks :blocks="project.blocks" />
    </div>
  </GlassPanel>
</template>
