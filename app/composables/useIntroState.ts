import { useSessionStorage } from '@vueuse/core'

/**
 * Shared state for the scroll-scrub intro.
 *
 * - `progress` (0–1) is written by `IntroStage` from its ScrollTrigger and read
 *   by `ScrubCanvas` / `Wallpaper`.
 * - `booted` flips true once the intro completes (or is skipped). Persisted for
 *   the session so returning to `/` doesn't replay the cinematic.
 */
export const useIntroState = () => {
  const progress = useState('intro:progress', () => 0)
  const booted = useSessionStorage('intro:booted', false)

  const setProgress = (value: number) => {
    progress.value = Math.min(1, Math.max(0, value))
  }

  const boot = () => {
    booted.value = true
    progress.value = 1
  }

  return { progress, booted, setProgress, boot }
}
