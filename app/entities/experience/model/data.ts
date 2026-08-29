import type { Locale } from '~/shared/config/i18n'
import type { Job } from '~/entities/experience/model/types'

const JOBS_BY_LOCALE: Record<Locale, Job[]> = {
  ru: [
    {
      company: 'Компания',
      role: 'Frontend-разработчик',
      period: '2023 — сейчас',
      location: 'Удалённо',
      bullets: [
        'Разработка и поддержка веб-приложения.',
        'Улучшение производительности и доступности.',
      ],
    },
  ],
  en: [
    {
      company: 'Company',
      role: 'Frontend Developer',
      period: '2023 — present',
      location: 'Remote',
      bullets: [
        'Built and maintained a web application.',
        'Improved performance and accessibility.',
      ],
    },
  ],
}

export const getJobs = (locale: Locale): Job[] => JOBS_BY_LOCALE[locale]
