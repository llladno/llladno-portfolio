export interface Language {
  name: string
  level: string
}

export interface Profile {
  /** Bio paragraph shown under the heading. */
  description: string
  avatar?: string
  location?: string
  skills: string[]
  languages?: Language[]
}
