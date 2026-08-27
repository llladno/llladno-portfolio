import { about } from './about'
import { experience } from './experience'
import { projects } from './projects'
import type { Locale } from './types'

export type { Locale, About, Job, Project, ProjectContent, CaseBlock } from './types'

// Dev-only sanity check: project slugs must be unique.
if (import.meta.dev) {
  const seen = new Set<string>()
  for (const p of projects) {
    if (seen.has(p.slug)) throw new Error(`Duplicate project slug: ${p.slug}`)
    seen.add(p.slug)
  }
}

export const getAbout = (locale: Locale) => about[locale]

export const getExperience = (locale: Locale) => experience[locale]

/** Projects sorted by `order`, with the active locale's text flattened in. */
export const getProjects = (locale: Locale) =>
  [...projects]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({ ...p, ...p.content[locale] }))

export const getProject = (locale: Locale, slug: string) =>
  getProjects(locale).find((p) => p.slug === slug) ?? null
