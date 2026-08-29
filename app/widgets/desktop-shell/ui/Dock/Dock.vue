<script setup lang="ts">
import { GlassPanel } from '~/shared/ui'
import {
  isSectionId,
  type DockItemConfig,
  type SectionId,
} from '~/shared/config/navigation'
import { useSectionRouter } from '~/features/section-router'
import { DockItem } from '~/widgets/desktop-shell/ui/DockItem'

const appConfig = useAppConfig()
const { t } = useI18n()
const { activeSection, open } = useSectionRouter()

const items = appConfig.dock as DockItemConfig[]

const labelOf = (item: DockItemConfig): string =>
  item.kind === 'section' ? t(`sections.${item.id}`) : t(`dock.${item.id}`)

const activate = (item: DockItemConfig) => {
  if (item.kind === 'section' && isSectionId(item.id)) open(item.id as SectionId)
}
</script>

<template>
  <GlassPanel
    as="nav"
    :aria-label="t('a11y.dock')"
    class="fixed inset-x-0 bottom-3 z-50 mx-auto flex w-fit items-end gap-2 rounded-2xl px-3 py-2"
  >
    <DockItem
      v-for="item in items"
      :key="item.id"
      :label="labelOf(item)"
      :is-active="item.kind === 'section' && activeSection === item.id"
      :href="item.kind === 'section' ? undefined : item.href"
      :is-external="item.kind === 'link'"
      @activate="activate(item)"
    />
  </GlassPanel>
</template>
