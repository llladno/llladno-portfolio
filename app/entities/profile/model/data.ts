import type { Locale } from '~/shared/config/i18n'
import type { Profile } from '~/entities/profile/model/types'

const PROFILE_BY_LOCALE: Record<Locale, Profile> = {
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

export const getProfile = (locale: Locale): Profile => PROFILE_BY_LOCALE[locale]
