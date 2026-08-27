<script setup lang="ts">
withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const { locale, t } = useI18n()
const { data } = await useAsyncData(
  () => `experience-${locale.value}`,
  () => queryCollection('experience').where('locale', '=', locale.value).first(),
)
</script>

<template>
  <section
    id="experience"
    :aria-labelledby="inWindow ? undefined : 'experience-h'"
    class="mx-auto max-w-3xl scroll-mt-16 px-6 py-16"
  >
    <h2 v-if="!inWindow" id="experience-h" class="text-2xl font-bold">
      {{ t('sections.experience') }}
    </h2>
    <ol class="mt-6 space-y-6 border-l border-[var(--color-glass-border)] pl-5">
      <li v-for="(job, i) in data?.items" :key="i">
        <p class="font-semibold">{{ job.role }} · {{ job.company }}</p>
        <p class="text-sm text-[var(--color-muted)]">{{ job.period }}</p>
        <ul class="mt-2 list-disc space-y-1 pl-4 text-sm">
          <li v-for="(b, j) in job.bullets" :key="j">{{ b }}</li>
        </ul>
      </li>
    </ol>
  </section>
</template>
