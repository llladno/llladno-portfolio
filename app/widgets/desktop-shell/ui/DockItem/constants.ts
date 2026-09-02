import { BRAND_ICON_PATHS } from '~/shared/config/brand-icons'

/*
 * Dock icons — one entry per `icon` name used in `app.config.ts` `dock`. The
 * brand marks come from the shared set; the résumé adds a download glyph. Each
 * value is a list of SVG path `d` strings on a 24×24 grid, filled with
 * `currentColor` (`fill-rule: evenodd`).
 */
export const DOCK_ICON_PATHS: Record<string, string[]> = {
  ...BRAND_ICON_PATHS,
  resume: [
    'M13 3a1 1 0 1 0-2 0v10.586l-3.293-3.293a1 1 0 0 0-1.414 1.414l5 5a1 1 0 0 0 1.414 0l5-5a1 1 0 0 0-1.414-1.414L13 13.586V3z',
    'M4 19a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2H4z',
  ],
}

export interface DockTint {
  /** Tile background — a fixed brand colour, or a theme token for the résumé. */
  tile: string
  /** Glyph colour on that background. */
  ink: string
}

/*
 * macOS-style coloured tiles: each social in its brand colour, the résumé in
 * the site accent. Brand hexes are fixed (they don't theme); the résumé tracks
 * `--color-accent` so it flips with light/dark.
 */
export const DOCK_ICON_TINTS: Record<string, DockTint> = {
  github: { tile: '#24292f', ink: '#ffffff' },
  linkedin: { tile: '#0a66c2', ink: '#ffffff' },
  telegram: { tile: '#229ed9', ink: '#ffffff' },
  resume: { tile: 'var(--color-accent)', ink: 'var(--color-accent-contrast)' },
}

export const DOCK_TINT_FALLBACK: DockTint = { tile: '#24292f', ink: '#ffffff' }
