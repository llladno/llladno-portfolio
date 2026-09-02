export interface IntroStat {
  value: number
  /** Rendered after the number, e.g. the "+" on "4+". */
  suffix: string
  /** i18n key for the caption under the number. */
  labelKey: string
}

/** Pulled from the CV — see entities/experience and entities/profile. */
export const INTRO_STATS: readonly IntroStat[] = [
  { value: 4, suffix: '+', labelKey: 'intro.stats.experience' },
  { value: 3, suffix: '', labelKey: 'intro.stats.teams' },
  { value: 10, suffix: '', labelKey: 'intro.stats.tech' },
]

/** Where each stat sits over the hero — spread across the frame, one per corner-ish. */
export const STAT_ANCHORS: readonly string[] = [
  'left-[7%] top-[16%] text-left',
  'right-[8%] top-[42%] text-right',
  'left-[9%] bottom-[28%] text-left',
]

/** How long a stat's number takes to tick up to its value, in ms. */
export const COUNT_DURATION_MS = 850
