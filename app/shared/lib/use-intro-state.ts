import { useSessionStorage } from '@vueuse/core'
import { clamp } from '~/shared/lib/clamp'

const PROGRESS_MIN = 0
const PROGRESS_MAX = 1
const BOOTED_STORAGE_KEY = 'intro:booted'

/**
 * Shared state for the scroll-scrub intro.
 *
 * - `progress` (0–1) is written by the intro stage and read by the scrub canvas
 *   and wallpaper.
 * - `booted` flips true once the intro completes (or is skipped). Persisted for
 *   the session so returning to `/` doesn't replay the cinematic.
 */
export const useIntroState = () => {
  const progress = useState('intro:progress', () => PROGRESS_MIN)
  const booted = useSessionStorage(BOOTED_STORAGE_KEY, false)

  const setProgress = (value: number) => {
    progress.value = clamp(value, PROGRESS_MIN, PROGRESS_MAX)
  }

  const boot = () => {
    booted.value = true
    progress.value = PROGRESS_MAX
  }

  return { progress, booted, setProgress, boot }
}
