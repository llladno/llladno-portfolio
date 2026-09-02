<script setup lang="ts">
import type { CaseBlock } from '~/entities/project/model/types'

defineProps<{ blocks: CaseBlock[] }>()
</script>

<template>
  <div class="space-y-4">
    <template v-for="(block, index) in blocks" :key="index">
      <h4
        v-if="block.type === 'heading'"
        class="text-xs font-semibold uppercase tracking-[0.15em] text-accent"
      >
        {{ block.text }}
      </h4>
      <p
        v-else-if="block.type === 'paragraph'"
        class="text-sm leading-relaxed text-fg/80"
      >
        {{ block.text }}
      </p>
      <ul
        v-else-if="block.type === 'list'"
        class="space-y-1.5 text-sm leading-relaxed text-fg/80"
      >
        <li
          v-for="(item, itemIndex) in block.items"
          :key="itemIndex"
          class="relative pl-4"
        >
          <span
            class="absolute left-0 top-[0.5rem] size-1 rounded-full bg-faint"
            aria-hidden="true"
          />
          {{ item }}
        </li>
      </ul>
      <NuxtImg
        v-else-if="block.type === 'image'"
        :src="block.src"
        :alt="block.alt"
        :width="block.width"
        :height="block.height"
        class="rounded-lg border border-line"
        loading="lazy"
      />
    </template>
  </div>
</template>
