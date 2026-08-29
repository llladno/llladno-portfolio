<script setup lang="ts">
import type { CaseBlock } from '~/entities/project/model/types'

defineProps<{ blocks: CaseBlock[] }>()
</script>

<template>
  <div class="space-y-3">
    <template v-for="(block, index) in blocks" :key="index">
      <h3 v-if="block.type === 'heading'" class="text-base font-semibold">
        {{ block.text }}
      </h3>
      <p v-else-if="block.type === 'paragraph'" class="text-sm text-muted">
        {{ block.text }}
      </p>
      <ul v-else-if="block.type === 'list'" class="list-disc space-y-1 pl-5 text-sm">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
          {{ item }}
        </li>
      </ul>
      <NuxtImg
        v-else-if="block.type === 'image'"
        :src="block.src"
        :alt="block.alt"
        :width="block.width"
        :height="block.height"
        class="rounded-lg"
        loading="lazy"
      />
    </template>
  </div>
</template>
