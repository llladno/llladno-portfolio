import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],

  css: ['~/assets/css/main.css'],

  // FSD: no component auto-import — every component is imported explicitly
  // through its slice's `index.ts` public API. (Nuxt/Vue framework
  // auto-imports like `ref`, `useRoute`, `useI18n` stay on.)
  components: [],

  vite: {
    plugins: [tailwindcss()],
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://portfolio.example',
    name: 'Portfolio',
  },

  // SSG-first: prerender everything, crawl links from the entry routes.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en/', '/sitemap.xml', '/robots.txt'],
      failOnError: false,
    },
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://portfolio.example',
    strategy: 'prefix_except_default',
    defaultLocale: 'ru',
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  typescript: {
    strict: true,
    typeCheck: false, // run explicitly via `pnpm typecheck` / CI
  },
})
