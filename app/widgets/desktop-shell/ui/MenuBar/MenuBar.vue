<script setup lang="ts">
import { GlassPanel } from '~/shared/ui'
import { SECTION_IDS } from '~/shared/config/navigation'
import { useSectionRouter } from '~/features/section-router'
import { LocaleSwitch } from '~/features/locale-switch'
import { MenuClock } from '~/widgets/desktop-shell/ui/MenuClock'

const appConfig = useAppConfig()
const { t } = useI18n()
const { open } = useSectionRouter()
</script>

<template>
  <GlassPanel
    as="header"
    class="fixed inset-x-0 top-0 z-50 flex h-8 items-center gap-4 px-3 text-sm"
  >
    <span aria-hidden="true" />
    <strong class="font-semibold">{{ appConfig.identity.name }}</strong>

    <nav :aria-label="t('a11y.sections')" class="flex gap-3">
      <button
        v-for="section in SECTION_IDS"
        :key="section"
        type="button"
        class="opacity-80 hover:opacity-100"
        @click="open(section)"
      >
        {{ t(`sections.${section}`) }}
      </button>
    </nav>

    <div class="ml-auto flex items-center gap-3">
      <LocaleSwitch />
      <MenuClock />
    </div>
  </GlassPanel>
</template>
