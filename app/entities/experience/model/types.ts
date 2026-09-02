import type { ExternalLink } from '~/shared/ui'

/** A notable product / initiative inside a role, rendered as a sub-block. */
export interface JobProject {
  name: string
  /** Live site / demo, if any. */
  href?: string
  summary: string
  bullets?: string[]
}

export interface Job {
  company: string
  role: string
  /** Free-form, e.g. "Nov 2024 — present". */
  period: string
  location?: string
  stack?: string[]
  bullets: string[]
  /** Sub-blocks for roles that span several distinct products. */
  projects?: JobProject[]
  /** Live sites / demos tied to this role. */
  links?: ExternalLink[]
}
