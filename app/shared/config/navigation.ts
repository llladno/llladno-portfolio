import type { Component } from 'vue'

export const SECTION_IDS = ['about', 'experience', 'projects', 'contact'] as const

export type SectionId = (typeof SECTION_IDS)[number]

/**
 * Sections that take part in the scroll-driven window cascade (order = scroll
 * order). Anything in `SECTION_IDS` but not here is an *overlay* section — it
 * still has a desktop icon and a `DeckWindow`, but is only ever focused by
 * opening it directly (icon / deep link), never by scrolling.
 */
export const SCROLL_SECTION_IDS = ['about', 'experience', 'projects'] as const

export const isScrollSection = (value: SectionId): boolean =>
  (SCROLL_SECTION_IDS as readonly string[]).includes(value)

export type DockItemKind = 'section' | 'link' | 'file'

export interface DockItemConfig {
  id: string
  kind: DockItemKind
  icon: string
  /** Required for `link` and `file` kinds. */
  href?: string
}

export const isSectionId = (value: string): value is SectionId =>
  (SECTION_IDS as readonly string[]).includes(value)

/** Section id → the component rendered inside that section's window. */
export type SectionRegistry = Record<SectionId, Component>
