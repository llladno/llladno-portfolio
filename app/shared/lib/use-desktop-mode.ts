import { useMediaQuery } from '@vueuse/core'

const DESKTOP_MIN_WIDTH_PX = 1024

/**
 * True when the macOS-desktop chrome should be shown: wide viewport, a fine
 * pointer, and no reduced-motion preference. Reactive — the layout responds if
 * the user changes any of these.
 *
 * SSR renders `false` (plain-layout markup) to stay deterministic; the desktop
 * chrome is layered on after hydration without layout shift.
 */
export const useDesktopMode = () => {
  const isWideViewport = useMediaQuery(`(min-width: ${DESKTOP_MIN_WIDTH_PX}px)`)
  const hasFinePointer = useMediaQuery('(pointer: fine)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const isDesktop = computed(
    () => isWideViewport.value && hasFinePointer.value && !prefersReducedMotion.value,
  )

  return { isDesktop, prefersReducedMotion }
}
