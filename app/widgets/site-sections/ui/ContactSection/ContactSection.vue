<script setup lang="ts">
withDefaults(defineProps<{ inWindow?: boolean }>(), { inWindow: false })

const appConfig = useAppConfig()
const { t } = useI18n()
</script>

<template>
  <section
    id="contact"
    :aria-labelledby="inWindow ? undefined : 'contact-heading'"
    class="mx-auto max-w-3xl scroll-mt-16 px-6 py-16"
  >
    <h2 v-if="!inWindow" id="contact-heading" class="mb-4 text-2xl font-bold">
      {{ t('sections.contact') }}
    </h2>
    <ul class="space-y-2">
      <li>
        <a :href="`mailto:${appConfig.identity.email}`" class="underline">
          {{ appConfig.identity.email }}
        </a>
      </li>
      <li v-for="social in appConfig.socials" :key="social.id">
        <a
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          class="underline"
        >
          {{ social.label }}
        </a>
      </li>
    </ul>
  </section>
</template>
