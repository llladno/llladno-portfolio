<script setup lang="ts">
import { getProjects } from '~/data'
import type { Locale } from '~/data'

withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const { locale, t } = useI18n()
const { activeProject, open } = useSectionRouter()

const items = computed(() => getProjects(locale.value as Locale))
</script>

<template>
  <section
    id="projects"
    :aria-labelledby="inWindow ? undefined : 'projects-h'"
    class="mx-auto max-w-3xl scroll-mt-16 px-6 py-16"
  >
    <h2 v-if="!inWindow" id="projects-h" class="text-2xl font-bold">
      {{ t('sections.projects') }}
    </h2>

    <!-- Full case bodies always in the DOM for SEO. -->
    <div class="mt-6 grid gap-4">
      <article
        v-for="p in items"
        :id="`projects-${p.slug}`"
        :key="p.slug"
        class="glass rounded-xl p-4"
      >
        <button
          type="button"
          class="text-left text-lg font-semibold"
          @click="open('projects', p.slug)"
        >
          {{ p.title }}
        </button>
        <p class="mt-1 text-sm text-[var(--color-muted)]">{{ p.summary }}</p>
        <div v-show="!inWindow || activeProject === p.slug" class="mt-3">
          <CaseBlocks :blocks="p.blocks" />
        </div>
      </article>
    </div>
  </section>
</template>
