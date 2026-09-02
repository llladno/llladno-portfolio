import type { Locale } from '~/shared/config/i18n'
import type { Profile } from '~/entities/profile/model/types'

const SKILLS = [
  'React',
  'Next.js',
  'Vue.js',
  'Nuxt',
  'TypeScript',
  'NestJS',
  'Playwright',
  'Vitest',
  'PWA',
  'Electron',
  'GSAP',
  'Tailwind',
  'Vite',
]

const PROFILE_BY_LOCALE: Record<Locale, Profile> = {
  ru: {
    description:
      'Frontend-разработчик с опытом 4+ лет: быстрые, масштабируемые и удобные ' +
      'веб-приложения. Основной стек — React и Vue.js, бэкенд на NestJS. Увлечён ' +
      'чистым кодом, продуманным UI/UX и внедрением AI-инструментов в реальные ' +
      'процессы разработки — context / harness / loop engineering, где AI-агенты ' +
      'запускаются, проверяют себя и итерируются автономно.',
    location: 'Сербия · Удалённо',
    skills: SKILLS,
    languages: [
      { name: 'Русский', level: 'родной' },
      { name: 'Английский', level: 'A2–B1' },
    ],
  },
  en: {
    description:
      'Frontend developer with 4+ years of experience building fast, scalable, ' +
      'and user-friendly web applications. Core stack: React and Vue.js, with ' +
      'backend experience in NestJS. Passionate about clean code, thoughtful ' +
      'UI/UX, and bringing AI tooling into real development workflows — context, ' +
      'harness, and loop engineering, where AI agents launch, self-verify, and ' +
      'iterate autonomously.',
    location: 'Serbia · Remote',
    skills: SKILLS,
    languages: [
      { name: 'Russian', level: 'native' },
      { name: 'English', level: 'A2–B1' },
    ],
  },
}

export const getProfile = (locale: Locale): Profile => PROFILE_BY_LOCALE[locale]
