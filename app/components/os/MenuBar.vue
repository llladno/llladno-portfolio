<script setup lang="ts">
const appConfig = useAppConfig()
const { t } = useI18n()
const { sections, open } = useSectionRouter()
</script>

<template>
  <header
    class="glass fixed inset-x-0 top-0 z-50 flex h-8 items-center gap-4 px-3 text-sm"
  >
    <span aria-hidden="true" />
    <strong class="font-semibold">{{ appConfig.identity.name }}</strong>

    <nav :aria-label="t('a11y.sections')" class="flex gap-3">
      <button
        v-for="s in sections"
        :key="s"
        type="button"
        class="opacity-80 hover:opacity-100"
        @click="open(s)"
      >
        {{ t(`sections.${s}`) }}
      </button>
    </nav>

    <div class="ml-auto flex items-center gap-3">
      <LocaleSwitch />
      <MenuClock />
    </div>
  </header>
</template>
