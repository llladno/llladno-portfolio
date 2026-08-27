<script setup lang="ts">
withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const { locale, t } = useI18n()
const { activeProject, open } = useSectionRouter()

const { data: projects } = await useAsyncData(
  () => `projects-${locale.value}`,
  () =>
    queryCollection('projects')
      .where('locale', '=', locale.value)
      .order('order', 'ASC')
      .all(),
)

const current = computed(() =>
  projects.value?.find((p) => p.slug === activeProject.value),
)
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

    <!-- Full case bodies always in DOM for SEO. -->
    <div class="mt-6 grid gap-4">
      <article
        v-for="p in projects"
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
        <div v-show="!inWindow || current?.slug === p.slug" class="prose mt-3 max-w-none">
          <ContentRenderer :value="p" />
        </div>
      </article>
    </div>
  </section>
</template>
