<script setup lang="ts">
const appConfig = useAppConfig()
const { locale } = useI18n()
const siteUrl = useSiteConfig().url

// Localized <html lang>, canonical and hreflang alternates from @nuxtjs/i18n.
const localeHead = useLocaleHead({ dir: true, lang: true, seo: true })
useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs ?? {},
  link: localeHead.value.link ?? [],
  meta: localeHead.value.meta ?? [],
}))

// Global Person JSON-LD.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: appConfig.identity.name,
        jobTitle:
          appConfig.identity.role[locale.value as 'ru' | 'en'] ??
          appConfig.identity.role.en,
        email: `mailto:${appConfig.identity.email}`,
        url: siteUrl,
        sameAs: appConfig.socials.map((social) => social.href),
      }),
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
