<script setup lang="ts">
// Headline overlay for the intro. Fades/lifts out as progress advances.
const props = defineProps<{ progress: number }>()
const appConfig = useAppConfig()
const { locale, t } = useI18n()

const role = computed(
  () =>
    appConfig.identity.role[locale.value as 'ru' | 'en'] ?? appConfig.identity.role.en,
)
const opacity = computed(() => Math.max(0, 1 - props.progress * 3))
</script>

<template>
  <div
    class="pointer-events-none absolute inset-x-0 top-[12%] text-center"
    :style="{ opacity, transform: `translateY(${-progress * 40}px)` }"
  >
    <h1 class="text-4xl font-bold sm:text-6xl">{{ appConfig.identity.name }}</h1>
    <p class="mt-2 text-[var(--color-muted)]">{{ role }}</p>
    <p class="mt-6 text-xs uppercase tracking-widest text-[var(--color-muted)]">
      {{ t('intro.scrollHint') }}
    </p>
  </div>
</template>
