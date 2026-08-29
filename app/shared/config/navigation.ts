import type { Component } from 'vue'

export const SECTION_IDS = ['about', 'projects', 'experience', 'contact'] as const

export type SectionId = (typeof SECTION_IDS)[number]

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
