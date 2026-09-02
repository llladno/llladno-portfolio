<script setup lang="ts">
import { Chip } from '~/shared/ui'
import type { Profile } from '~/entities/profile/model/types'
import type { Locale } from '~/shared/config/i18n'

defineProps<{ profile: Profile }>()

const { locale, t } = useI18n()
const resumeHref = computed(() => `/resume/${locale.value as Locale}.pdf`)
</script>

<template>
  <div class="space-y-8">
    <p class="text-lg leading-relaxed text-fg/85 sm:text-xl">
      {{ profile.description }}
    </p>

    <ul v-if="profile.skills.length" class="flex flex-wrap gap-2">
      <li v-for="skill in profile.skills" :key="skill">
        <Chip>{{ skill }}</Chip>
      </li>
    </ul>

    <dl class="grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
      <div v-if="profile.location">
        <dt class="font-medium text-faint">{{ t('about.location') }}</dt>
        <dd class="mt-0.5 text-fg/85">{{ profile.location }}</dd>
      </div>
      <div v-if="profile.languages?.length">
        <dt class="font-medium text-faint">{{ t('about.languages') }}</dt>
        <dd class="mt-0.5 text-fg/85">
          {{ profile.languages.map((lang) => `${lang.name} — ${lang.level}`).join(', ') }}
        </dd>
      </div>
    </dl>

    <a
      :href="resumeHref"
      download
      class="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
    >
      {{ t('resume.download') }}
    </a>
  </div>
</template>
