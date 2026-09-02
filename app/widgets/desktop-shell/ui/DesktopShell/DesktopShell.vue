<script setup lang="ts">
/*
 * The macOS chrome overlay: wallpaper + menu bar + Dock. The wallpaper is
 * always mounted (it reveals with intro progress and then stays as the OS
 * background); the menu bar and Dock appear once `booted` is true and animate
 * in with a short stagger. Content windows live in the page's <WindowDeck>.
 */
import { useIntroState } from '~/shared/lib'
import { ResumeModal } from '~/features/resume-viewer'
import { Wallpaper } from '~/widgets/desktop-shell/ui/Wallpaper'
import { MenuBar } from '~/widgets/desktop-shell/ui/MenuBar'
import { Dock } from '~/widgets/desktop-shell/ui/Dock'
import { DesktopSurface } from '~/widgets/desktop-shell/ui/DesktopSurface'

const { booted } = useIntroState()
</script>

<template>
  <div>
    <Wallpaper />

    <ClientOnly>
      <Transition name="folders">
        <DesktopSurface v-if="booted" />
      </Transition>

      <Transition name="menu-bar">
        <MenuBar v-if="booted" />
      </Transition>

      <Transition name="dock">
        <Dock v-if="booted" />
      </Transition>

      <ResumeModal />
    </ClientOnly>
  </div>
</template>

<style scoped>
.menu-bar-enter-active,
.dock-enter-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.dock-enter-active {
  transition-delay: 0.12s;
}

.menu-bar-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.dock-enter-from {
  opacity: 0;
  transform: translateY(140%);
}

.menu-bar-leave-active,
.dock-leave-active,
.folders-leave-active {
  transition: opacity 0.3s ease;
}
.menu-bar-leave-to,
.dock-leave-to,
.folders-leave-to {
  opacity: 0;
}

.folders-enter-active {
  transition: opacity 0.5s ease 0.15s;
}
.folders-enter-from {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .menu-bar-enter-active,
  .dock-enter-active,
  .folders-enter-active,
  .menu-bar-leave-active,
  .dock-leave-active,
  .folders-leave-active {
    transition: none;
  }
}
</style>
