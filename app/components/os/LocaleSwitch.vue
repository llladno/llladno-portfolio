<script setup lang="ts">
// Switches locale while preserving the current section (hash).
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

type LocaleCode = 'ru' | 'en'

const options = computed(() =>
  (locales.value as { code: LocaleCode; name: string }[]).map((l) => ({
    code: l.code,
    name: l.name,
    to: switchLocalePath(l.code) + route.hash,
  })),
)
</script>

<template>
  <nav :aria-label="'Language'" class="flex items-center gap-1 text-xs">
    <NuxtLink
      v-for="o in options"
      :key="o.code"
      :to="o.to"
      class="rounded px-1.5 py-0.5"
      :class="
        o.code === locale ? 'font-semibold text-[var(--color-accent)]' : 'opacity-70'
      "
      :aria-current="o.code === locale ? 'true' : undefined"
    >
      {{ o.code.toUpperCase() }}
    </NuxtLink>
  </nav>
</template>
