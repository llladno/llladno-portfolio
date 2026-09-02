import type { RouterConfig } from '@nuxt/schema'

/*
 * The window deck and Lenis own scrolling. Never let a hash change (Dock click,
 * deck writing `#about` as it scrolls) trigger the router's default
 * scroll-to-element behaviour — it would fight the deck.
 */
export default <RouterConfig>{
  scrollBehavior(toRoute, fromRoute, savedPosition) {
    if (toRoute.path === fromRoute.path) return false
    return savedPosition ?? { top: 0 }
  },
}
