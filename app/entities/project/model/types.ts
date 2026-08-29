import type { Locale } from '~/shared/config/i18n'

/** A block in a project case study. Rendered by <CaseBlocks />. */
export type CaseBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; alt: string; width: number; height: number }

/** Per-locale text for one project. */
export interface ProjectContent {
  title: string
  summary: string
  role?: string
  blocks: CaseBlock[]
}

/** Locale-neutral project fields plus localized `content`. */
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

/** A project with the active locale's `content` flattened onto it. */
export type LocalizedProject = Omit<Project, 'content'> & ProjectContent
