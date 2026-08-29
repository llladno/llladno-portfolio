<script setup lang="ts">
import { GlassPanel } from '~/shared/ui'
import type { Profile } from '~/entities/profile/model/types'

defineProps<{ profile: Profile }>()
</script>

<template>
  <div>
    <p class="text-muted">{{ profile.description }}</p>
    <ul v-if="profile.skills.length" class="mt-4 flex flex-wrap gap-2">
      <GlassPanel
        v-for="skill in profile.skills"
        :key="skill"
        as="li"
        class="rounded-full px-3 py-1 text-sm"
      >
        {{ skill }}
      </GlassPanel>
    </ul>
  </div>
</template>
