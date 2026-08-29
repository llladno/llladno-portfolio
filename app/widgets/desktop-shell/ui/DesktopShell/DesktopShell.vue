<script setup lang="ts">
/*
 * The macOS chrome overlay: wallpaper + menu bar + dock + the single window
 * host. Everything except the wallpaper appears only once `booted` is true
 * (after the intro). Rendered above the always-present semantic page content.
 */
import { useIntroState } from '~/shared/lib'
import { Wallpaper } from '~/widgets/desktop-shell/ui/Wallpaper'
import { MenuBar } from '~/widgets/desktop-shell/ui/MenuBar'
import { Dock } from '~/widgets/desktop-shell/ui/Dock'
import type { SectionRegistry } from '~/shared/config/navigation'
import { WindowHost } from '~/widgets/desktop-shell/ui/WindowHost'

defineProps<{ sections: SectionRegistry }>()

const { booted } = useIntroState()
</script>

<template>
  <div>
    <Wallpaper />

    <Transition name="chrome">
      <MenuBar v-if="booted" />
    </Transition>

    <ClientOnly>
      <WindowHost v-if="booted" :sections="sections" />
      <Transition name="chrome">
        <Dock v-if="booted" />
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
