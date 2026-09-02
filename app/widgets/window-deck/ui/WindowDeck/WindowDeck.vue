<script setup lang="ts">
/*
 * The window deck. Two ways a window comes to focus:
 *
 * 1. Scroll — a tall stage with a `position: sticky` inner layer; a scroll
 *    listener derives `deckProgress` (0–1) and each section's window gets a
 *    `focus` from it (sharp/opaque/on-top when focused, blurred/dimmed/behind
 *    when not). Neighbouring spans overlap, so mid-scroll one window closes
 *    behind the next.
 *
 * 2. Directly — a desktop folder or the menu bar calls `open(id)`. The matching
 *    window is *forced* to full focus on top of the deck **without moving the
 *    page**. Closing it (red traffic light / Escape) drops back to wherever the
 *    scroll left off — the bare desktop in the common case. Any real scroll
 *    gesture releases the forced window and hands control back to the cascade.
 */
import { useEventListener } from '@vueuse/core'
import { clamp, useDeckState, useIntroState } from '~/shared/lib'
import { SCROLL_SECTION_IDS, SECTION_IDS, isSectionId } from '~/shared/config/navigation'
import type { SectionId, SectionRegistry } from '~/shared/config/navigation'
import type { DeckWindowVisual } from '~/widgets/window-deck/model/types'
import {
  DECK_BACKGROUND_DRIFT_PX,
  DECK_CASCADE_X_PX,
  DECK_CASCADE_Y_PX,
  DECK_DESKTOP_TRAIL,
  DECK_WINDOW_SCROLL_VH,
  FORCE_TRANSITION_MS,
  OWNS_SCROLL_FOCUS_THRESHOLD,
  WINDOW_FOCUS_CENTER_PULL,
  WINDOW_FOCUS_PLATEAU,
  WINDOW_MAX_BLUR_PX,
  WINDOW_MIN_OPACITY,
  WINDOW_MIN_SCALE,
  WINDOW_SPAN_OVERLAP,
  WINDOW_Z_RANGE,
} from '~/widgets/window-deck/model/constants'
import { DeckWindow } from '~/widgets/window-deck/ui/DeckWindow'

const props = defineProps<{ sections: SectionRegistry }>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()
const { deckProgress, forcedSectionId } = useDeckState()
const { booted } = useIntroState()

const PROGRESS_MIN = 0
const PROGRESS_MAX = 1
const SMOOTHSTEP_PEAK = 3
const HASH_FOCUS_THRESHOLD = 0.5
const DEEP_LINK_SETTLE_MS = 120

// Every section gets a window; only the scroll sections drive the cascade
// geometry (stage height, spacing). Overlay sections (e.g. contact) are
// forced-open only.
const count = SECTION_IDS.length
const scrollCount = SCROLL_SECTION_IDS.length
const stageHeight = `${scrollCount * DECK_WINDOW_SCROLL_VH}vh`
const windowSpan = scrollCount > 1 ? (1 - DECK_DESKTOP_TRAIL) / (scrollCount - 1) : 1

const stageEl = ref<HTMLElement | null>(null)
const activeId = ref<SectionId | null>(null)
const animating = ref(false)

let frameHandle = 0
let animateTimer: ReturnType<typeof setTimeout> | undefined

type LenisLike = { scrollTo: (target: number, options?: { immediate?: boolean }) => void }

const smoothstep = (value: number): number =>
  value * value * (SMOOTHSTEP_PEAK - 2 * value)

/** Deck progress at which the scroll window `scrollIndex` is fully focused. */
const windowCenter = (scrollIndex: number): number =>
  scrollCount > 1 ? scrollIndex * windowSpan : PROGRESS_MAX / 2

const scrollFocusFor = (index: number): number => {
  // Overlay sections never take focus by scrolling — only when forced open.
  const id = SECTION_IDS[index]
  const scrollIndex = id ? (SCROLL_SECTION_IDS as readonly SectionId[]).indexOf(id) : -1
  if (scrollIndex < 0) return PROGRESS_MIN

  // The trailing zone is the bare desktop — every window fades out across it.
  const trailFactor = clamp(
    (PROGRESS_MAX - deckProgress.value) / DECK_DESKTOP_TRAIL,
    PROGRESS_MIN,
    PROGRESS_MAX,
  )
  const spanHalf = (windowSpan * (1 + WINDOW_SPAN_OVERLAP)) / 2
  const distance = clamp(
    Math.abs(deckProgress.value - windowCenter(scrollIndex)) / spanHalf,
    PROGRESS_MIN,
    PROGRESS_MAX,
  )
  const natural =
    distance <= WINDOW_FOCUS_PLATEAU
      ? 1
      : 1 - smoothstep((distance - WINDOW_FOCUS_PLATEAU) / (1 - WINDOW_FOCUS_PLATEAU))
  return natural * trailFactor
}

const focusFor = (index: number): number => {
  if (forcedSectionId.value) {
    return SECTION_IDS[index] === forcedSectionId.value ? PROGRESS_MAX : PROGRESS_MIN
  }
  return scrollFocusFor(index)
}

const visualFor = (index: number): DeckWindowVisual => {
  const focus = focusFor(index)
  const forced = forcedSectionId.value === SECTION_IDS[index]
  const recede = 1 - focus
  const cascade = index - (count - 1) / 2
  const cascadeDirection = cascade === 0 ? 1 : Math.sign(cascade)
  return {
    opacity: WINDOW_MIN_OPACITY + (1 - WINDOW_MIN_OPACITY) * focus,
    blurPx: recede * WINDOW_MAX_BLUR_PX,
    scale: WINDOW_MIN_SCALE + (1 - WINDOW_MIN_SCALE) * focus,
    translateXPx: forced
      ? 0
      : cascade * DECK_CASCADE_X_PX * (1 - focus * WINDOW_FOCUS_CENTER_PULL) +
        cascadeDirection * recede * DECK_BACKGROUND_DRIFT_PX,
    translateYPx: forced
      ? 0
      : cascade * DECK_CASCADE_Y_PX * (1 - focus * WINDOW_FOCUS_CENTER_PULL),
    zIndex: Math.round(focus * WINDOW_Z_RANGE) + index,
  }
}

const WIDE_SECTION_ID: SectionId = 'projects'

const windows = computed(() =>
  SECTION_IDS.map((id, index) => ({
    id,
    title: t(`sections.${id}`),
    focus: focusFor(index),
    visual: visualFor(index),
    forced: forcedSectionId.value === id,
    wide: id === WIDE_SECTION_ID,
  })),
)

const hashSection = (): SectionId | null => {
  const raw = route.hash.replace(/^#/, '').split('/')[0]
  return raw && isSectionId(raw) ? raw : null
}

const jumpTo = (targetY: number): void => {
  const lenis = nuxtApp.$lenis as LenisLike | undefined
  if (lenis) lenis.scrollTo(targetY, { immediate: true })
  else window.scrollTo({ top: targetY })
}

/** Jump the page (no animation) to the bare desktop at the end of the deck. */
const scrollDeckToDesktop = (): void => {
  const stage = stageEl.value
  if (!stage) return
  jumpTo(stage.offsetTop + stage.offsetHeight - window.innerHeight)
}

const playAnimation = () => {
  animating.value = true
  clearTimeout(animateTimer)
  animateTimer = setTimeout(() => {
    animating.value = false
  }, FORCE_TRANSITION_MS)
}

const forceOpen = (id: SectionId) => {
  scrollDeckToDesktop()
  forcedSectionId.value = id
  activeId.value = id
  playAnimation()
}

const releaseForced = () => {
  if (!forcedSectionId.value) return
  forcedSectionId.value = null
  activeId.value = null
}

const readProgress = () => {
  const stage = stageEl.value
  if (!stage) return

  const bounds = stage.getBoundingClientRect()
  const scrollableDistance = bounds.height - window.innerHeight
  const scrolledPast = clamp(-bounds.top, PROGRESS_MIN, scrollableDistance)
  deckProgress.value =
    scrollableDistance > 0 ? scrolledPast / scrollableDistance : PROGRESS_MIN

  // A forced window owns the hash and focus until it is closed or scrolled away.
  if (forcedSectionId.value) return

  let leaderIndex = 0
  let leaderFocus = -1
  SECTION_IDS.forEach((_, index) => {
    const focus = scrollFocusFor(index)
    if (focus > leaderFocus) {
      leaderFocus = focus
      leaderIndex = index
    }
  })

  const nextActive =
    leaderFocus >= HASH_FOCUS_THRESHOLD ? (SECTION_IDS[leaderIndex] ?? null) : null
  if (nextActive !== activeId.value) {
    activeId.value = nextActive
    router.replace({ path: route.path, hash: nextActive ? `#${nextActive}` : '' })
  }
}

const scheduleRead = () => {
  cancelAnimationFrame(frameHandle)
  frameHandle = requestAnimationFrame(readProgress)
}

const onClose = () => {
  playAnimation()
  if (forcedSectionId.value) {
    // Opened directly — just drop it, the page never moved.
    releaseForced()
  } else {
    // Focused by scrolling — fall through to the bare desktop below.
    scrollDeckToDesktop()
  }
  if (route.hash) router.replace({ path: route.path, hash: '' })
  scheduleRead()
}

/*
 * A scroll gesture on the wallpaper drops the forced window and resumes the
 * cascade — but a gesture that starts inside the open window is that window
 * scrolling its own content, so leave it alone.
 */
const onScrollGesture = (event: Event) => {
  if (!forcedSectionId.value) return
  const target = event.target
  if (target instanceof Element && target.closest('.deck-window')) return
  releaseForced()
  scheduleRead()
}

const onKeydown = (event: KeyboardEvent) => {
  if (forcedSectionId.value && event.key === 'Escape') onClose()
}

useEventListener('scroll', scheduleRead, { passive: true })
useEventListener('resize', scheduleRead, { passive: true })
useEventListener('wheel', onScrollGesture, { passive: true })
useEventListener('touchmove', onScrollGesture, { passive: true })
useEventListener('keydown', onKeydown)

/*
 * Hash → window. Only a hash change that ISN'T already matched by scroll
 * position (a Dock / folder / menu jump, not `readProgress` writing its own
 * leader) opens the window directly. Otherwise the cascade already has it.
 */
watch(
  () => route.hash,
  () => {
    const target = hashSection()
    if (!target) {
      releaseForced()
      return
    }
    if (target === forcedSectionId.value) return
    const index = SECTION_IDS.indexOf(target)
    if (index >= 0 && scrollFocusFor(index) >= HASH_FOCUS_THRESHOLD) return
    forceOpen(target)
  },
)

// Scrolling the intro back up un-boots — forget any window that was open.
watch(booted, (isBooted) => {
  if (!isBooted) releaseForced()
})

onMounted(async () => {
  // A deep link owns the hash (it may carry a project slug). Claim the forced
  // window *before* the first readProgress so the scroll leader doesn't
  // overwrite `#projects/<slug>` with its own `#about` on load.
  const target = hashSection()
  if (target) {
    forcedSectionId.value = target
    activeId.value = target
  }
  readProgress()
  if (!target) return
  await nextTick()
  setTimeout(() => forceOpen(target), DEEP_LINK_SETTLE_MS)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameHandle)
  clearTimeout(animateTimer)
})
</script>

<template>
  <div ref="stageEl" class="deck-stage" :style="{ height: stageHeight }">
    <div class="deck-pin">
      <DeckWindow
        v-for="win in windows"
        :key="win.id"
        :title="win.title"
        :close-label="t('window.toDesktop')"
        :zoom-label="t('window.zoom')"
        :restore-label="t('window.restore')"
        :visual="win.visual"
        :animated="animating"
        :forced="win.forced"
        :owns-scroll="!win.forced && win.focus >= OWNS_SCROLL_FOCUS_THRESHOLD"
        :wide="win.wide"
        @close="onClose"
      >
        <component :is="props.sections[win.id]" :in-window="true" />
      </DeckWindow>
    </div>
  </div>
</template>

<style scoped>
.deck-stage {
  position: relative;
}

/*
 * The deck itself is click-through — only a focused DeckWindow opts back into
 * pointer events (it sets `pointer-events: auto` inline above INTERACTIVE_OPACITY).
 * That lets clicks on empty wallpaper reach the desktop surface underneath.
 */
.deck-stage,
.deck-pin {
  pointer-events: none;
}

.deck-pin {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
}
</style>
