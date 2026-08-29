<script setup lang="ts">
/*
 * Renders the active section inside a single draggable window. The section
 * components come from a registry passed by the layout, so this widget stays
 * unaware of the concrete sections.
 */
import { useSectionRouter } from '~/features/section-router'
import type { SectionRegistry } from '~/shared/config/navigation'
import { OsWindow } from '~/widgets/desktop-shell/ui/OsWindow'

const props = defineProps<{ sections: SectionRegistry }>()

const { t } = useI18n()
const { activeSection, close } = useSectionRouter()

const activeComponent = computed(() =>
  activeSection.value ? props.sections[activeSection.value] : null,
)
</script>

<template>
  <Transition name="window">
    <OsWindow
      v-if="activeSection && activeComponent"
      :key="activeSection"
      :title="t(`sections.${activeSection}`)"
      :close-label="t('window.close')"
      @close="close"
    >
      <component :is="activeComponent" :in-window="true" />
    </OsWindow>
  </Transition>
</template>

<style scoped>
.window-enter-active,
.window-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.window-enter-from,
.window-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
@media (prefers-reduced-motion: reduce) {
  .window-enter-active,
  .window-leave-active {
    transition: none;
  }
}
</style>
