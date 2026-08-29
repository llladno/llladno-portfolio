<script setup lang="ts">
import type { Job } from '~/entities/experience/model/types'

defineProps<{ jobs: Job[] }>()
</script>

<template>
  <ol class="space-y-6 border-l border-glass-border pl-5">
    <li v-for="(job, index) in jobs" :key="index">
      <p class="font-semibold">{{ job.role }} · {{ job.company }}</p>
      <p class="text-sm text-muted">{{ job.period }}</p>
      <ul class="mt-2 list-disc space-y-1 pl-4 text-sm">
        <li v-for="(bullet, bulletIndex) in job.bullets" :key="bulletIndex">
          {{ bullet }}
        </li>
      </ul>
    </li>
  </ol>
</template>
