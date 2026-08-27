<script setup lang="ts">
withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const appConfig = useAppConfig()
const { t } = useI18n()
</script>

<template>
  <section
    id="contact"
    :aria-labelledby="inWindow ? undefined : 'contact-h'"
    class="mx-auto max-w-3xl scroll-mt-16 px-6 py-16"
  >
    <h2 v-if="!inWindow" id="contact-h" class="text-2xl font-bold">
      {{ t('sections.contact') }}
    </h2>
    <ul class="mt-4 space-y-2">
      <li>
        <a :href="`mailto:${appConfig.identity.email}`" class="underline">
          {{ appConfig.identity.email }}
        </a>
      </li>
      <li v-for="s in appConfig.socials" :key="s.id">
        <a :href="s.href" target="_blank" rel="noopener noreferrer" class="underline">
          {{ s.label }}
        </a>
      </li>
    </ul>
  </section>
</template>
