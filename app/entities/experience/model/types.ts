export interface Job {
  company: string
  role: string
  /** Free-form, e.g. "2023 — present". */
  period: string
  location?: string
  bullets: string[]
}
