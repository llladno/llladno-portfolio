import type { About, Locale } from './types'

export const about: Record<Locale, About> = {
  ru: {
    description:
      'Разработчик, делаю аккуратные веб-интерфейсы и продукты. Замените этот текст своим.',
    skills: ['TypeScript', 'Vue / Nuxt', 'Node.js'],
  },
  en: {
    description:
      'Developer building tidy web interfaces and products. Replace this text.',
    skills: ['TypeScript', 'Vue / Nuxt', 'Node.js'],
  },
}
