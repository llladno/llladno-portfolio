import { defineContentConfig, defineCollection, z } from '@nuxt/content'

/*
 * Content collections. Locale is derived from the top-level folder (ru/ | en/)
 * and stored as a field so queries can filter by the active locale.
 * Broken frontmatter fails the build, not production.
 */
const locale = z.enum(['ru', 'en'])

const about = defineCollection({
  type: 'page',
  source: '*/about.md',
  schema: z.object({
    locale,
    title: z.string(),
    description: z.string(),
    avatar: z.string().optional(),
    skills: z.array(z.string()).default([]),
  }),
})

const experience = defineCollection({
  type: 'data',
  source: '*/experience.yml',
  schema: z.object({
    locale,
    items: z.array(
      z.object({
        company: z.string(),
        role: z.string(),
        period: z.string(),
        location: z.string().optional(),
        bullets: z.array(z.string()).default([]),
      }),
    ),
  }),
})

const projects = defineCollection({
  type: 'page',
  source: '*/projects/*.md',
  schema: z.object({
    locale,
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    role: z.string().optional(),
    year: z.number().optional(),
    stack: z.array(z.string()).default([]),
    links: z
      .object({
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
      })
      .default({}),
    order: z.number().default(0),
    featured: z.boolean().default(false),
  }),
})

export default defineContentConfig({
  collections: { about, experience, projects },
})
