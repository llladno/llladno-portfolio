import { useMediaQuery } from '@vueuse/core'

const STORAGE_KEY = 'portfolio:theme'

export type Theme = 'light' | 'dark'

/**
 * Light / dark theme, owned here.
 *
 * First visit follows the OS (`prefers-color-scheme`) via a CSS `@media` block —
 * no `data-theme` attribute is written. Toggling pins an explicit choice on
 * `<html data-theme>` and persists it; a tiny inline `<head>` script (see
 * `nuxt.config.ts`) re-applies it before first paint so there is no flash.
 */
export const useTheme = () => {
  const theme = useState<Theme>('theme', () => 'dark')
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const persist = (value: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // storage blocked (private mode) — the choice still holds for this visit
    }
  }

  const set = (value: Theme) => {
    theme.value = value
    document.documentElement.dataset.theme = value
    persist(value)
  }

  const toggle = () => set(theme.value === 'dark' ? 'light' : 'dark')

  onMounted(() => {
    const stored = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY)
      } catch {
        return null
      }
    })()
    theme.value =
      stored === 'light' || stored === 'dark'
        ? stored
        : systemPrefersDark.value
          ? 'dark'
          : 'light'
  })

  return { theme, toggle }
}
