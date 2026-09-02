<script setup lang="ts">
import {
  DOCK_ITEM_SIZE_PX,
  DOCK_MAGNIFY_LIFT_PX,
  DOCK_MAGNIFY_MAX_SCALE,
  DOCK_MAGNIFY_RADIUS_PX,
} from '~/widgets/desktop-shell/model/constants'
import {
  DOCK_ICON_PATHS,
  DOCK_ICON_TINTS,
  DOCK_TINT_FALLBACK,
} from '~/widgets/desktop-shell/ui/DockItem/constants'
import type { DockItemRenderProps } from '~/widgets/desktop-shell/ui/DockItem/types'

const props = withDefaults(defineProps<DockItemRenderProps>(), { as: 'a' })
defineEmits<{ activate: [] }>()

const MAGNIFY_EASE_EXPONENT = 2

const itemEl = ref<HTMLElement | null>(null)
/** 0 at rest, 1 directly under the pointer. */
const magnify = ref(0)

const paths = computed(() => DOCK_ICON_PATHS[props.icon] ?? DOCK_ICON_PATHS.github)
const tint = computed(() => DOCK_ICON_TINTS[props.icon] ?? DOCK_TINT_FALLBACK)

const tileScale = computed(() => 1 + (DOCK_MAGNIFY_MAX_SCALE - 1) * magnify.value)

const tileStyle = computed(() => ({
  width: `${DOCK_ITEM_SIZE_PX}px`,
  height: `${DOCK_ITEM_SIZE_PX}px`,
  transform: `translateY(${-DOCK_MAGNIFY_LIFT_PX * magnify.value}px) scale(${tileScale.value})`,
  '--tile-scale': tileScale.value,
  background: `linear-gradient(180deg, color-mix(in oklab, ${tint.value.tile} 82%, white) 0%, ${tint.value.tile} 100%)`,
  color: tint.value.ink,
}))

watch(
  () => props.pointerX,
  (pointerX) => {
    const node = itemEl.value
    if (pointerX == null || !node) {
      magnify.value = 0
      return
    }
    const rect = node.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    const proximity = Math.max(
      0,
      1 - Math.abs(pointerX - center) / DOCK_MAGNIFY_RADIUS_PX,
    )
    magnify.value = proximity ** MAGNIFY_EASE_EXPONENT
  },
)
</script>

<template>
  <component
    :is="as === 'button' ? 'button' : 'a'"
    ref="itemEl"
    :type="as === 'button' ? 'button' : undefined"
    :href="as === 'button' ? undefined : href"
    :target="as === 'button' || !isExternal ? undefined : '_blank'"
    :rel="as === 'button' || !isExternal ? undefined : 'noopener noreferrer'"
    :aria-label="label"
    class="dock-tile relative grid shrink-0 place-items-center rounded-[0.85rem] border border-white/12 shadow-lg [transition:transform_110ms_ease-out]"
    :style="tileStyle"
    @click="as === 'button' && $emit('activate')"
  >
    <svg
      viewBox="0 0 24 24"
      class="size-[22px]"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
      aria-hidden="true"
    >
      <path v-for="(pathData, index) in paths" :key="index" :d="pathData" />
    </svg>
    <span class="dock-tip" aria-hidden="true">{{ label }}</span>
  </component>
</template>

<style scoped>
.dock-tile {
  transform-origin: bottom center;
}

.dock-tip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 14px);
  transform: translateX(-50%) scale(calc(1 / var(--tile-scale, 1)));
  transform-origin: center bottom;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  color: var(--color-fg);
  background: var(--color-glass-strong);
  border: 1px solid var(--color-glass-border);
  box-shadow: 0 10px 30px -10px var(--color-glass-shadow);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.13s ease;
}

.dock-tile:hover .dock-tip,
.dock-tile:focus-visible .dock-tip {
  opacity: 1;
  transition-delay: 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  .dock-tip {
    transition: none;
  }
}
</style>
