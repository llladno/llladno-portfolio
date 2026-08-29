interface SeoI18nInput {
  title: string
  description: string
  image?: string
}

/**
 * Fills OG/Twitter meta from one title/description pair and keeps `<html lang>`
 * in sync with the active locale. Canonical + hreflang are emitted by
 * @nuxtjs/i18n (`useLocaleHead` in `app.vue`); this only adds the page meta.
 */
export const useSeoI18n = (input: SeoI18nInput) => {
  const { locale } = useI18n()

  useHead({ htmlAttrs: { lang: locale.value } })

  useSeoMeta({
    title: input.title,
    description: input.description,
    ogTitle: input.title,
    ogDescription: input.description,
    ogType: 'website',
    ogImage: input.image,
    twitterCard: 'summary_large_image',
    twitterTitle: input.title,
    twitterDescription: input.description,
  })
}
