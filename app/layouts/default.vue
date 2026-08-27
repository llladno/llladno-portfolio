<script setup lang="ts">
/*
 * One adaptive layout. The semantic baseline (header + <main><slot/></main>) is
 * always in the SSR HTML so crawlers and no-JS visitors get everything.
 *
 * On a capable viewport, after the intro sets `booted`, the macOS chrome
 * (wallpaper, menu bar, dock, window host) is layered on top and the plain
 * header steps aside. `isDesktop` is client-only, so the chrome lives behind
 * <ClientOnly> and never causes a hydration mismatch.
 */
const appConfig = useAppConfig()
const { t } = useI18n()
const localePath = useLocalePath()
const { sections } = useSectionRouter()
const { isDesktop } = useDesktopMode()
const { booted } = useIntroState()

const desktopActive = computed(() => isDesktop.value && booted.value)
</script>

<template>
  <div class="relative min-h-dvh">
    <ClientOnly>
      <Wallpaper v-if="isDesktop" />
    </ClientOnly>

    <header
      v-show="!desktopActive"
      class="glass sticky top-0 z-50 flex items-center justify-between px-4 py-2"
    >
      <NuxtLink :to="localePath('/')" class="font-semibold">
        {{ appConfig.identity.name }}
      </NuxtLink>
      <nav :aria-label="t('a11y.sections')" class="hidden gap-3 text-sm sm:flex">
        <a v-for="s in sections" :key="s" :href="`#${s}`">
          {{ t(`sections.${s}`) }}
        </a>
      </nav>
      <LocaleSwitch />
    </header>

    <ClientOnly>
      <Transition name="chrome">
        <MenuBar v-if="desktopActive" />
      </Transition>
    </ClientOnly>

    <main class="relative z-10">
      <slot />
    </main>

    <ClientOnly>
      <WindowHost v-if="desktopActive" />
      <Transition name="chrome">
        <Dock v-if="desktopActive" />
      </Transition>
    </ClientOnly>
  </div>
</template>

<style scoped>
.chrome-enter-active,
.chrome-leave-active {
  transition: opacity 0.4s ease;
}
.chrome-enter-from,
.chrome-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .chrome-enter-active,
  .chrome-leave-active {
    transition: none;
  }
}
</style>
