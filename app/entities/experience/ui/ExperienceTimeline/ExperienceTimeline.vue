<script setup lang="ts">
import { Chip, ExternalLinks } from '~/shared/ui'
import type { Job } from '~/entities/experience/model/types'

defineProps<{ jobs: Job[] }>()
</script>

<template>
  <ol class="space-y-10">
    <li
      v-for="(job, index) in jobs"
      :key="index"
      class="relative border-l border-line pl-6"
    >
      <span
        class="absolute -left-[5px] top-[0.4rem] size-2.5 rounded-full bg-accent ring-4 ring-bg"
        aria-hidden="true"
      />
      <p class="font-mono text-xs uppercase tracking-[0.12em] text-faint">
        {{ job.period }}
      </p>
      <p class="mt-1.5 font-semibold text-fg">{{ job.role }}</p>
      <p class="text-sm text-muted">
        {{ job.company }}<template v-if="job.location"> · {{ job.location }}</template>
      </p>

      <ul v-if="job.stack?.length" class="mt-3 flex flex-wrap gap-1.5">
        <li v-for="tech in job.stack" :key="tech">
          <Chip>{{ tech }}</Chip>
        </li>
      </ul>

      <ul class="mt-3 space-y-1.5 text-sm leading-relaxed text-fg/80">
        <li
          v-for="(bullet, bulletIndex) in job.bullets"
          :key="bulletIndex"
          class="relative pl-4"
        >
          <span
            class="absolute left-0 top-[0.5rem] size-1 rounded-full bg-faint"
            aria-hidden="true"
          />
          {{ bullet }}
        </li>
      </ul>

      <div v-if="job.projects?.length" class="mt-4 space-y-4">
        <div
          v-for="project in job.projects"
          :key="project.name"
          class="rounded-lg border border-line bg-surface/60 p-4"
        >
          <p class="font-semibold text-fg">
            <a
              v-if="project.href"
              :href="project.href"
              target="_blank"
              rel="noopener noreferrer"
              class="underline decoration-line underline-offset-4 transition-colors hover:decoration-accent hover:text-accent"
            >
              {{ project.name }}
            </a>
            <template v-else>{{ project.name }}</template>
          </p>
          <p class="mt-1 text-sm text-muted">{{ project.summary }}</p>
          <ul
            v-if="project.bullets?.length"
            class="mt-2.5 space-y-1.5 text-sm leading-relaxed text-fg/80"
          >
            <li
              v-for="(bullet, bulletIndex) in project.bullets"
              :key="bulletIndex"
              class="relative pl-4"
            >
              <span
                class="absolute left-0 top-[0.5rem] size-1 rounded-full bg-faint"
                aria-hidden="true"
              />
              {{ bullet }}
            </li>
          </ul>
        </div>
      </div>

      <ExternalLinks v-if="job.links?.length" :links="job.links" class="mt-3" />
    </li>
  </ol>
</template>
