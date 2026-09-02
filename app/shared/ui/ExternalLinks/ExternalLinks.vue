<script setup lang="ts">
/* A row of outbound link pills — project demo/repo, or a job's live sites. */
import type { ExternalLink } from '~/shared/ui/ExternalLinks/types'

defineProps<{ links: ExternalLink[] }>()
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li v-for="link in links" :key="link.href">
      <a
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[0.8125rem] font-medium text-muted transition-colors hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
      >
        {{ link.label }}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="size-3"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </a>
    </li>
  </ul>
</template>
