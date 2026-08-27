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

export function getAbout(locale: Locale) {
  return about[locale]
}

export function getExperience(locale: Locale) {
  return experience[locale]
}

/** Projects sorted by `order`, with the active locale's text flattened in. */
export function getProjects(locale: Locale) {
  return [...projects]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({ ...p, ...p.content[locale] }))
}

export function getProject(locale: Locale, slug: string) {
  return getProjects(locale).find((p) => p.slug === slug) ?? null
}
