<script setup lang="ts">
/*
 * One window in the scroll deck. Dumb: renders macOS chrome + slotted content
 * and applies the visual state the deck computed for it. Not draggable — the
 * deck owns position via scroll. The green traffic light zooms it to full
 * screen (fills the viewport between menu bar and Dock); it un-zooms when the
 * window loses focus.
 */
import { useEventListener } from '@vueuse/core'
import { TrafficLights } from '~/shared/ui'
import type { DeckWindowVisual } from '~/widgets/window-deck/model/types'
import { SCROLL_EDGE_EPSILON_PX } from '~/widgets/window-deck/model/constants'

const props = defineProps<{
  title: string
  closeLabel: string
  zoomLabel: string
  restoreLabel: string
  visual: DeckWindowVisual
  /** Ease opacity/transform changes — set only while a direct open/close plays. */
  animated?: boolean
  /**
   * This window was opened directly (folder / menu) and sits above the deck.
   * Its body then scrolls its own content natively; in the scroll-driven
   * cascade the wheel belongs to the page, so it does not.
   */
  forced?: boolean
  /**
   * This window is the scroll-cascade leader: its body owns the wheel for its
   * own content, handing the wheel back to the deck only at the content edge.
   * (`forced` / `zoomed` windows trap the wheel entirely — that is separate.)
   */
  ownsScroll?: boolean
  /** A wider frame — for windows whose content is a side-by-side layout. */
  wide?: boolean
}>()

defineEmits<{ close: [] }>()

const titleId = useId()

const INTERACTIVE_OPACITY = 0.55

const zoomed = ref(false)
const bodyEl = ref<HTMLElement | null>(null)
const nuxtApp = useNuxtApp()

type LenisLike = { actualScroll: number }

/*
 * Cascade leader: scroll the content; at the top / bottom edge, nudge the page
 * so the deck advances. `forced` / `zoomed` windows keep trapping the wheel
 * fully (data-lenis-prevent + overscroll-contain in the template).
 */
const onBodyWheel = (event: WheelEvent) => {
  const body = bodyEl.value
  if (!body || props.forced || zoomed.value || !props.ownsScroll) return

  const atTop = body.scrollTop <= SCROLL_EDGE_EPSILON_PX
  const atBottom =
    body.scrollTop + body.clientHeight >= body.scrollHeight - SCROLL_EDGE_EPSILON_PX
  const goingDown = event.deltaY > 0
  const roomToScroll = (goingDown && !atBottom) || (!goingDown && !atTop)
  if (roomToScroll) return // browser scrolls the body natively (Lenis ignores it)

  const lenis = nuxtApp.$lenis as LenisLike | undefined
  const from = lenis?.actualScroll ?? window.scrollY
  window.scrollTo({ top: from + event.deltaY })
}

useEventListener(bodyEl, 'wheel', onBodyWheel, { passive: false })

// Losing focus drops the zoom, so a window never reopens full screen.
watch(
  () => props.visual.opacity >= INTERACTIVE_OPACITY,
  (interactive) => {
    if (!interactive) zoomed.value = false
  },
)

const style = computed(() => {
  const base = {
    opacity: props.visual.opacity,
    filter: props.visual.blurPx > 0 ? `blur(${props.visual.blurPx}px)` : undefined,
    zIndex: props.visual.zIndex,
    pointerEvents: (props.visual.opacity >= INTERACTIVE_OPACITY ? 'auto' : 'none') as
      'auto' | 'none',
  }
  if (zoomed.value) {
    return {
      ...base,
      left: '1.5rem',
      right: '1.5rem',
      top: '2.75rem',
      bottom: '4.5rem',
      width: 'auto',
      maxHeight: 'none',
      transform: 'none',
    }
  }
  return {
    ...base,
    transform:
      `translate(-50%, -50%)` +
      ` translate(${props.visual.translateXPx}px, ${props.visual.translateYPx}px)` +
      ` scale(${props.visual.scale})`,
  }
})
</script>

<template>
  <div
    class="deck-window absolute left-1/2 top-1/2 flex max-h-[76dvh] flex-col overflow-hidden rounded-window border border-glass-border bg-glass-strong shadow-[0_40px_100px_-24px_var(--color-glass-shadow)] backdrop-blur-2xl"
    :class="[
      { 'deck-window--animated': animated, 'deck-window--zoomed': zoomed },
      wide ? 'w-[min(94vw,920px)]' : 'w-[min(92vw,600px)]',
    ]"
    :style="style"
    role="group"
    :aria-labelledby="titleId"
  >
    <div class="flex h-11 shrink-0 items-center gap-2 border-b border-line px-4">
      <TrafficLights
        :close-label="closeLabel"
        :zoom-label="zoomed ? restoreLabel : zoomLabel"
        @close="$emit('close')"
        @zoom="zoomed = !zoomed"
      />
      <span
        :id="titleId"
        class="flex-1 truncate text-center text-[13px] font-medium text-fg/70"
      >
        {{ title }}
      </span>
      <span class="w-[46px] shrink-0" aria-hidden="true" />
    </div>

    <!-- When forced open, the body scrolls its own content: data-lenis-prevent
         hands the wheel back from Lenis, overscroll-contain stops it chaining to
         the page. In the scroll-driven cascade the wheel belongs to the deck. -->
    <div
      ref="bodyEl"
      class="deck-window__body grow overflow-y-auto px-7 py-7"
      :class="forced || zoomed || ownsScroll ? 'overscroll-contain' : ''"
      :data-lenis-prevent="forced || zoomed || ownsScroll || null"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.deck-window {
  will-change: transform, opacity, filter;
  transition: filter 0.1s linear;
}

.deck-window--animated {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease,
    filter 0.28s ease;
}

.deck-window--zoomed {
  transition:
    inset 0.28s cubic-bezier(0.2, 0.7, 0.2, 1),
    width 0.28s cubic-bezier(0.2, 0.7, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .deck-window--animated,
  .deck-window--zoomed {
    transition: none;
  }
}
</style>
