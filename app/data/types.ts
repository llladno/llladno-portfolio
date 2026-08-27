export type Locale = 'ru' | 'en'

/** A block in a project case study. Rendered by <CaseBlocks />. */
export type CaseBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; alt: string; width: number; height: number }

export interface About {
  /** Bio paragraph shown under the heading. */
  description: string
  avatar?: string
  skills: string[]
}

export interface Job {
  company: string
  role: string
  /** Free-form, e.g. "2023 — present". */
  period: string
  location?: string
  bullets: string[]
}

/** Per-locale text for one project. */
export interface ProjectContent {
  title: string
  summary: string
  role?: string
  blocks: CaseBlock[]
}

/** Locale-neutral project fields + localized `content`. */
export interface Project {
  slug: string
  year?: number
  tags: string[]
  stack: string[]
  links: { repo?: string; demo?: string }
  cover?: string
  /** Lower sorts first. */
  order: number
  featured: boolean
  content: Record<Locale, ProjectContent>
}
