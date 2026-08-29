<script setup lang="ts">
/*
 * One adaptive layout. The semantic baseline (plain header + <main><slot/></main>)
 * is always in the SSR HTML so crawlers and no-JS visitors get everything.
 *
 * On a capable viewport, after the intro sets `booted`, the macOS chrome
 * (<DesktopShell>) is layered on top and the plain header steps aside.
 * `isDesktop` is client-only, so the chrome never causes a hydration mismatch.
 */
import { useDesktopMode, useIntroState } from '~/shared/lib'
import { SECTION_IDS } from '~/shared/config/navigation'
import { LocaleSwitch } from '~/features/locale-switch'
import { DesktopShell } from '~/widgets/desktop-shell'
import { SECTION_REGISTRY } from '~/widgets/site-sections'

const appConfig = useAppConfig()
const { t } = useI18n()
const localePath = useLocalePath()
const { isDesktop } = useDesktopMode()
const { booted } = useIntroState()

const isDesktopActive = computed(() => isDesktop.value && booted.value)
</script>

<template>
  <div class="relative min-h-dvh">
    <ClientOnly>
      <DesktopShell v-if="isDesktop" :sections="SECTION_REGISTRY" />
    </ClientOnly>

    <header
      v-show="!isDesktopActive"
      class="glass sticky top-0 z-50 flex items-center justify-between px-4 py-2"
    >
      <NuxtLink :to="localePath('/')" class="font-semibold">
        {{ appConfig.identity.name }}
      </NuxtLink>
      <nav :aria-label="t('a11y.sections')" class="hidden gap-3 text-sm sm:flex">
        <a v-for="section in SECTION_IDS" :key="section" :href="`#${section}`">
          {{ t(`sections.${section}`) }}
        </a>
      </nav>
      <LocaleSwitch />
    </header>

    <main class="relative z-10">
      <slot />
    </main>
  </div>
</template>
