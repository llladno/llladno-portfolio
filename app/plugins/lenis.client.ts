import Lenis from 'lenis'

/*
 * Momentum ("smooth") scrolling for the whole page. Native scroll under the
 * hood (v1.3), so `position: sticky` in the intro stage still works and the
 * intro's scroll listener keeps firing.
 *
 * Also pins every load to the top: the intro must replay from the first slide,
 * so browser scroll restoration is disabled here. Lenis itself is skipped
 * under reduced motion (the top-pinning still applies).
 */

/** Glide time for a wheel tick to settle, in seconds. */
const LENIS_DURATION_S = 1.05

/** Extra gap above an anchored section, in px (clears the menu bar). */
const ANCHOR_OFFSET_PX = 84

export default defineNuxtPlugin((nuxtApp) => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  if (prefersReducedMotion) return

  const lenis = new Lenis({ duration: LENIS_DURATION_S, smoothWheel: true })
  lenis.scrollTo(0, { immediate: true })

  let rafHandle = 0
  const tick = (time: number) => {
    lenis.raf(time)
    rafHandle = requestAnimationFrame(tick)
  }
  rafHandle = requestAnimationFrame(tick)

  const onAnchorClick = (event: MouseEvent) => {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      'a[href^="#"]',
    )
    const targetId = anchor?.getAttribute('href')?.slice(1)
    const target = targetId ? document.getElementById(targetId) : null
    if (!target) return

    event.preventDefault()
    lenis.scrollTo(target, { offset: -ANCHOR_OFFSET_PX })
  }
  document.addEventListener('click', onAnchorClick)

  nuxtApp.hook('page:finish', () => lenis.resize())

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      document.removeEventListener('click', onAnchorClick)
      cancelAnimationFrame(rafHandle)
      lenis.destroy()
    })
  }

  return { provide: { lenis } }
})
