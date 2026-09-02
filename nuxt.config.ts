import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Web3Forms access key for the contact form. Set via
      // NUXT_PUBLIC_WEB3FORMS_KEY; empty disables the submit button.
      web3formsKey: '',
    },
  },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap',
        },
      ],
      script: [
        {
          // Apply the saved theme before first paint so there is no flash.
          innerHTML:
            "try{var t=localStorage.getItem('portfolio:theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
          type: 'text/javascript',
          tagPosition: 'head',
          tagPriority: 'critical',
        },
      ],
    },
  },

  // FSD: no component auto-import — every component is imported explicitly
  // through its slice's `index.ts` public API. (Nuxt/Vue framework
  // auto-imports like `ref`, `useRoute`, `useI18n` stay on.)
  components: [],

  vite: {
    plugins: [tailwindcss()],
  },

  site: {
    // The Cloudflare Worker's default URL. Override with NUXT_PUBLIC_SITE_URL
    // (a build variable) once a custom domain is attached — it feeds the
    // canonical link, hreflang alternates and the sitemap.
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://grigory.mansurov.workers.dev',
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
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://grigory.mansurov.workers.dev',
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
