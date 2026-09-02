import type { Locale } from '~/shared/config/i18n'

/** The person's name / role resolved for the active locale, plus their email. */
export const useIdentity = () => {
  const appConfig = useAppConfig()
  const { locale } = useI18n()

  const name = computed(
    () => appConfig.identity.name[locale.value as Locale] ?? appConfig.identity.name.en,
  )
  const role = computed(
    () => appConfig.identity.role[locale.value as Locale] ?? appConfig.identity.role.en,
  )

  return { name, role, email: appConfig.identity.email }
}
