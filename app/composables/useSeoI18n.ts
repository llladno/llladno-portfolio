/**
 * Thin wrapper over `useSeoMeta` that fills OG/Twitter fields from a single
 * title/description pair and keeps `<html lang>` in sync with the active locale.
 * hreflang / canonical are emitted automatically by @nuxtjs/i18n (needs
 * `site.url`).
 */
export const useSeoI18n = (input: {
  title: string
  description: string
  image?: string
}) => {
  const { locale } = useI18n()

  useHead({
    htmlAttrs: { lang: locale.value },
  })

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
