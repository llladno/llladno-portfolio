<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import type { Locale } from '~/shared/config/i18n'
import type { DockItemConfig } from '~/shared/config/navigation'
import { useResumeModal } from '~/features/resume-viewer'
import { DockItem } from '~/widgets/desktop-shell/ui/DockItem'

const appConfig = useAppConfig()
const { locale, t } = useI18n()
const { open: openResume } = useResumeModal()

const RESUME_ID = 'resume'

const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

const items = computed(() =>
  (appConfig.dock as DockItemConfig[]).map((item) => ({
    ...item,
    label: t(`dock.${item.id}`),
    href:
      item.id === 'resume' ? `/resume/${locale.value as Locale}.pdf` : (item.href ?? '#'),
  })),
)

// Pointer x drives per-tile magnification; null = pointer not over the Dock.
const pointerX = ref<number | null>(null)

const onPointerMove = (event: PointerEvent) => {
  pointerX.value = prefersReducedMotion.value ? null : event.clientX
}
const onPointerLeave = () => {
  pointerX.value = null
}
</script>

<template>
  <nav
    :aria-label="t('a11y.dock')"
    class="glass fixed inset-x-0 bottom-3 z-50 mx-auto flex w-fit items-end gap-2.5 rounded-[1.35rem] px-3 pb-2.5 pt-2"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <DockItem
      v-for="item in items"
      :key="item.id"
      :icon="item.icon"
      :label="item.label"
      :as="item.id === RESUME_ID ? 'button' : 'a'"
      :href="item.id === RESUME_ID ? undefined : item.href"
      :is-external="item.id !== RESUME_ID"
      :pointer-x="pointerX"
      @activate="item.id === RESUME_ID && openResume()"
    />
  </nav>
</template>
