import { clamp } from '~/shared/lib/clamp'

const PROGRESS_MIN = 0
const PROGRESS_MAX = 1

/**
 * Shared state for the scroll-driven intro. Deliberately NOT persisted — every
 * reload replays from the first slide, and scrolling back up restores it.
 *
 * - `progress` (0–1) — written by IntroStage, read by <Wallpaper>.
 * - `booted` — whether the macOS chrome shows. The cinematic path toggles it
 *   from scroll progress (with hysteresis); the fallback path forces it via
 *   `boot()`.
 */
export const useIntroState = () => {
  const progress = useState('intro:progress', () => PROGRESS_MIN)
  const booted = useState('intro:booted', () => false)

  const setProgress = (value: number) => {
    progress.value = clamp(value, PROGRESS_MIN, PROGRESS_MAX)
  }

  const boot = () => {
    booted.value = true
    progress.value = PROGRESS_MAX
  }

  return { progress, booted, setProgress, boot }
}
