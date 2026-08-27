import { useMediaQuery } from '@vueuse/core'

/**
 * True when the macOS-desktop chrome should be shown: wide viewport, a fine
 * pointer, and no reduced-motion preference. Reactive — the layout switches
 * live if the user changes any of these.
 *
 * SSR renders `false` (plain-layout markup) to stay deterministic; the desktop
 * chrome is layered on after hydration without layout shift.
 */
export function useDesktopMode() {
  const wide = useMediaQuery('(min-width: 1024px)')
  const finePointer = useMediaQuery('(pointer: fine)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const isDesktop = computed(
    () => wide.value && finePointer.value && !reducedMotion.value,
  )

  return { isDesktop, reducedMotion }
}
