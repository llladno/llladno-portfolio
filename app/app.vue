<script setup lang="ts">
import { useIdentity } from '~/shared/lib'

const appConfig = useAppConfig()
const { name, role, email } = useIdentity()
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
        name: name.value,
        jobTitle: role.value,
        email: `mailto:${email}`,
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
