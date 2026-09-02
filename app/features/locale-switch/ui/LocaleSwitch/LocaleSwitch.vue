<script setup lang="ts">
import type { Locale } from '~/shared/config/i18n'

interface LocaleOption {
  code: Locale
  name: string
}

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

const options = computed(() =>
  (locales.value as LocaleOption[]).map((option) => {
    const path = switchLocalePath(option.code)
    return {
      code: option.code,
      // `switchLocalePath` drops the hash — re-attach the current section.
      href: path.includes('#') ? path : path + route.hash,
    }
  }),
)
</script>

<template>
  <nav aria-label="Language" class="flex items-center gap-1 text-xs">
    <NuxtLink
      v-for="option in options"
      :key="option.code"
      :to="option.href"
      class="rounded px-1.5 py-0.5"
      :class="option.code === locale ? 'font-semibold text-accent' : 'opacity-70'"
      :aria-current="option.code === locale ? 'true' : undefined"
    >
      {{ option.code.toUpperCase() }}
    </NuxtLink>
  </nav>
</template>
