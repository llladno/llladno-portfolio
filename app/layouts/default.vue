<script setup lang="ts">
/*
 * One adaptive layout. The semantic baseline (plain header + <main><slot/></main>)
 * is always in the SSR HTML so crawlers and no-JS visitors get everything.
 *
 * On a capable viewport, after the intro sets `booted`, the macOS chrome
 * (<DesktopShell>) is layered on top and the plain header steps aside.
 * `isDesktop` is client-only, so the chrome never causes a hydration mismatch.
 */
import { useDesktopMode, useIdentity, useIntroState } from '~/shared/lib'
import { SECTION_IDS } from '~/shared/config/navigation'
import { useSectionRouter } from '~/features/section-router'
import { LocaleSwitch } from '~/features/locale-switch'
import { ThemeToggle } from '~/features/theme-switch'
import { DesktopShell } from '~/widgets/desktop-shell'

const { t } = useI18n()
const localePath = useLocalePath()
const { isDesktop } = useDesktopMode()
const { booted } = useIntroState()
const { open } = useSectionRouter()
const { name } = useIdentity()

const isDesktopActive = computed(() => isDesktop.value && booted.value)
</script>

<template>
  <div class="relative min-h-dvh">
    <ClientOnly>
      <DesktopShell v-if="isDesktop" />
    </ClientOnly>

    <header
      v-show="!isDesktopActive"
      class="absolute inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent px-5 py-4 text-white"
    >
      <NuxtLink :to="localePath('/')" class="font-semibold">
        {{ name }}
      </NuxtLink>
      <nav
        :aria-label="t('a11y.sections')"
        class="hidden gap-4 text-sm text-white/70 sm:flex"
      >
        <a
          v-for="section in SECTION_IDS"
          :key="section"
          :href="`#${section}`"
          class="transition-colors hover:text-white"
          @click.prevent="open(section)"
        >
          {{ t(`sections.${section}`) }}
        </a>
      </nav>
      <div class="flex items-center gap-3">
        <ClientOnly><ThemeToggle /></ClientOnly>
        <LocaleSwitch />
      </div>
    </header>

    <!--
      On the active desktop the deck is click-through — each focused DeckWindow
      re-enables its own pointer events — so clicks on empty wallpaper land on
      <DesktopSurface> behind it.
    -->
    <main class="relative z-10" :class="{ 'pointer-events-none': isDesktopActive }">
      <slot />
    </main>
  </div>
</template>
