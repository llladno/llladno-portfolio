import type { Locale } from '~/shared/config/i18n'
import type { LocalizedProject, Project } from '~/entities/project/model/types'

const PROJECTS: Project[] = [
  {
    slug: 'sample-project',
    year: 2025,
    tags: ['Nuxt', 'TypeScript'],
    stack: ['Nuxt', 'Tailwind'],
    links: { repo: 'https://github.com/' },
    order: 1,
    featured: true,
    content: {
      ru: {
        title: 'Пример проекта',
        summary: 'Короткое описание проекта в одну строку.',
        role: 'Автор',
        blocks: [
          { type: 'heading', text: 'Задача' },
          { type: 'paragraph', text: 'Опишите контекст и проблему.' },
          { type: 'heading', text: 'Решение' },
          { type: 'paragraph', text: 'Опишите, что вы сделали и почему.' },
          {
            type: 'list',
            items: ['Первое решение', 'Второе решение', 'Третье решение'],
          },
          { type: 'heading', text: 'Результат' },
          { type: 'paragraph', text: 'Опишите итог и метрики.' },
        ],
      },
      en: {
        title: 'Sample Project',
        summary: 'A one-line description of the project.',
        role: 'Author',
        blocks: [
          { type: 'heading', text: 'Problem' },
          { type: 'paragraph', text: 'Describe the context and the problem.' },
          { type: 'heading', text: 'Solution' },
          { type: 'paragraph', text: 'Describe what you built and why.' },
          {
            type: 'list',
            items: ['First decision', 'Second decision', 'Third decision'],
          },
          { type: 'heading', text: 'Outcome' },
          { type: 'paragraph', text: 'Describe the result and metrics.' },
        ],
      },
    },
  },
]

const toLocalized = (project: Project, locale: Locale): LocalizedProject => {
  const { content, ...shared } = project
  return { ...shared, ...content[locale] }
}

/** Projects sorted by `order`, with the active locale's text flattened in. */
export const getProjects = (locale: Locale): LocalizedProject[] =>
  [...PROJECTS]
    .sort((left, right) => left.order - right.order)
    .map((project) => toLocalized(project, locale))

export const getProject = (locale: Locale, slug: string): LocalizedProject | null =>
  getProjects(locale).find((project) => project.slug === slug) ?? null
