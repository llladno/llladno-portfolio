<script setup lang="ts">
import { useIdentity } from '~/shared/lib'
import { SECTION_IDS } from '~/shared/config/navigation'
import { useSectionRouter } from '~/features/section-router'
import { LocaleSwitch } from '~/features/locale-switch'
import { ThemeToggle } from '~/features/theme-switch'
import { MenuClock } from '~/widgets/desktop-shell/ui/MenuClock'

const { t } = useI18n()
const { name } = useIdentity()
const { open } = useSectionRouter()
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 flex h-7 items-center gap-1 border-b border-line bg-glass-strong px-3 text-[13px] text-fg/90 backdrop-blur-xl"
  >
    <span class="grid size-5 place-items-center">
      <span class="size-2 rounded-full bg-accent" aria-hidden="true" />
    </span>
    <strong class="px-2 font-semibold">{{ name }}</strong>

    <nav :aria-label="t('a11y.sections')" class="flex">
      <button
        v-for="section in SECTION_IDS"
        :key="section"
        type="button"
        class="rounded px-2 py-0.5 text-fg/70 transition-colors hover:bg-line-strong hover:text-fg"
        @click="open(section)"
      >
        {{ t(`sections.${section}`) }}
      </button>
    </nav>

    <div class="ml-auto flex items-center gap-2.5 text-fg/80">
      <ThemeToggle />
      <LocaleSwitch />
      <MenuClock />
    </div>
  </header>
</template>
