export const LOCALES = ['ru', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'ru'

export const LOCALE_LANGUAGE: Record<Locale, string> = {
  ru: 'ru-RU',
  en: 'en-US',
}
