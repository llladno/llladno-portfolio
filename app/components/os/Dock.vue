<script setup lang="ts">
const appConfig = useAppConfig()
const { t } = useI18n()
const { activeSection, open } = useSectionRouter()

type DockEntry = {
  id: string
  type: 'section' | 'link' | 'file'
  href?: string
}

const items = appConfig.dock as DockEntry[]

function labelFor(item: DockEntry) {
  if (item.type === 'section') return t(`sections.${item.id}`)
  return t(`dock.${item.id}`)
}
</script>

<template>
  <nav
    :aria-label="t('a11y.dock')"
    class="glass fixed inset-x-0 bottom-3 z-50 mx-auto flex w-fit items-end gap-2 rounded-2xl px-3 py-2"
  >
    <DockItem
      v-for="item in items"
      :key="item.id"
      :label="labelFor(item)"
      :active="item.type === 'section' && activeSection === item.id"
      :href="item.type === 'section' ? undefined : item.href"
      :external="item.type === 'link'"
      @activate="open(item.id as any)"
    />
  </nav>
</template>
