import type { Locale } from '~/shared/config/i18n'
import type { LocalizedProject, Project } from '~/entities/project/model/types'

/*
 * Drawn from the CV's concrete deliverables. Fill in links / covers / metrics
 * as real project pages come together.
 */
const PROJECTS: Project[] = [
  {
    slug: 'telegram-mini-apps',
    year: 2025,
    tags: ['Vue.js', 'PWA', 'Telegram'],
    stack: ['Vue.js', 'TypeScript', 'Pinia', 'NestJS'],
    links: { demo: 'https://t.me/GameSportBetBot' },
    kindKey: 'miniapp',
    order: 1,
    featured: true,
    content: {
      ru: {
        title: 'Telegram Mini Apps и PWA',
        summary: 'Мини-приложения и PWA для двух продуктов GameSport.',
        role: 'Middle Frontend-разработчик',
        blocks: [
          { type: 'heading', text: 'Задача' },
          {
            type: 'paragraph',
            text: 'Дать пользователям быстрый доступ к продукту прямо из Telegram и через устанавливаемое PWA, без потери удержания.',
          },
          { type: 'heading', text: 'Что сделал' },
          {
            type: 'list',
            items: [
              'Собрал два Telegram Mini App на Vue.js с общими UI-примитивами.',
              'Сделал Telegram-бота @GameSportBetBot и Mini App к нему — от Vue-интерфейса до интеграции с NestJS-бэкендом.',
              'Настроил offline-режим и установку через PWA.',
              'Связал фронт с NestJS-бэкендом, добавил E2E-покрытие критических сценариев.',
            ],
          },
          { type: 'heading', text: 'Результат' },
          {
            type: 'paragraph',
            text: 'Рост удержания пользователей на обоих проектах; общая кодовая база для веба и мини-аппов.',
          },
        ],
      },
      en: {
        title: 'Telegram Mini Apps & PWA',
        summary: 'Mini apps and PWAs for two GameSport products.',
        role: 'Middle Frontend Developer',
        blocks: [
          { type: 'heading', text: 'Problem' },
          {
            type: 'paragraph',
            text: 'Give users fast access to the product straight from Telegram and as an installable PWA, without losing retention.',
          },
          { type: 'heading', text: 'What I did' },
          {
            type: 'list',
            items: [
              'Built two Telegram Mini Apps in Vue.js sharing common UI primitives.',
              'Built the @GameSportBetBot Telegram bot and its Mini App — from the Vue UI to the NestJS backend integration.',
              'Set up offline mode and PWA install.',
              'Wired the frontend to a NestJS backend, added E2E coverage of critical flows.',
            ],
          },
          { type: 'heading', text: 'Outcome' },
          {
            type: 'paragraph',
            text: 'Improved retention on both projects; one shared codebase for web and mini apps.',
          },
        ],
      },
    },
  },
  {
    slug: 'electron-launcher',
    year: 2024,
    tags: ['Electron', 'Desktop', 'Vue.js'],
    stack: ['Electron', 'Vue.js', 'TypeScript', 'NestJS', 'Playwright'],
    links: { demo: 'https://ntw.graphics/' },
    kindKey: 'desktop',
    media: { kind: 'video', width: 1280, height: 668 },
    order: 5,
    featured: true,
    content: {
      ru: {
        title: 'Desktop-приложение и лаунчер на Electron',
        summary: 'Полноценное настольное приложение и лаунчер для FiveMods.',
        role: 'Junior Frontend-разработчик',
        blocks: [
          { type: 'heading', text: 'Задача' },
          {
            type: 'paragraph',
            text: 'Настольный клиент и лаунчер для распространения и запуска продукта, стабильные к релизу.',
          },
          { type: 'heading', text: 'Что сделал' },
          {
            type: 'list',
            items: [
              'Спроектировал и реализовал desktop-приложение на Electron целиком.',
              'Самостоятельно собрал frontend лаунчера.',
              'Сделал маркетинговый лендинг Network Graphics (ntw.graphics), поднявший конверсию.',
              'Покрыл все критические сценарии E2E-тестами на Playwright.',
              'Сделал панель менеджера поддержки с интеграцией NestJS-бэкенда.',
            ],
          },
          { type: 'heading', text: 'Результат' },
          {
            type: 'paragraph',
            text: 'Релиз в срок, без критических багов; лаунчер стал основным способом доставки.',
          },
        ],
      },
      en: {
        title: 'Electron Desktop App & Launcher',
        summary: 'A full desktop application and launcher for FiveMods.',
        role: 'Junior Frontend Developer',
        blocks: [
          { type: 'heading', text: 'Problem' },
          {
            type: 'paragraph',
            text: 'A desktop client and launcher to distribute and run the product, stable by release.',
          },
          { type: 'heading', text: 'What I did' },
          {
            type: 'list',
            items: [
              'Designed and built the Electron desktop application end-to-end.',
              'Independently built the launcher frontend.',
              'Built the Network Graphics marketing landing (ntw.graphics) that lifted conversion.',
              'Covered every critical flow with Playwright E2E tests.',
              'Built a support-manager dashboard integrated with a NestJS backend.',
            ],
          },
          { type: 'heading', text: 'Outcome' },
          {
            type: 'paragraph',
            text: 'Shipped on time with no critical bugs; the launcher became the primary delivery channel.',
          },
        ],
      },
    },
  },
  {
    slug: 'cnc-monitoring',
    year: 2022,
    tags: ['Angular', 'Realtime', 'Industrial'],
    stack: ['Angular', 'TypeScript', 'REST API'],
    links: {},
    kindKey: 'doc',
    media: { kind: 'doc' },
    order: 6,
    featured: false,
    content: {
      ru: {
        title: 'Мониторинг ЧПУ-станков в реальном времени',
        summary: 'Интерфейс управления и мониторинга для операторов BIOCAD.',
        role: 'Стажёр Frontend-разработчика',
        blocks: [
          { type: 'heading', text: 'Задача' },
          {
            type: 'paragraph',
            text: 'Дать операторам единый экран для управления и наблюдения за ЧПУ-станками в реальном времени.',
          },
          { type: 'heading', text: 'Что сделал' },
          {
            type: 'list',
            items: [
              'Собрал real-time интерфейс на Angular с обновлением статусов станков.',
              'Оптимизировал пользовательские сценарии под ежедневную работу операторов.',
            ],
          },
          { type: 'heading', text: 'Результат' },
          {
            type: 'paragraph',
            text: 'Эффективность команды выросла на 10–15%; интерфейс используется ежедневно.',
          },
        ],
      },
      en: {
        title: 'Real-time CNC Machine Monitoring',
        summary: 'A control and monitoring interface for BIOCAD operators.',
        role: 'Frontend Developer Intern',
        blocks: [
          { type: 'heading', text: 'Problem' },
          {
            type: 'paragraph',
            text: 'Give operators a single screen to control and watch CNC machines in real time.',
          },
          { type: 'heading', text: 'What I did' },
          {
            type: 'list',
            items: [
              'Built a real-time Angular interface with live machine-status updates.',
              'Optimized user workflows around operators’ daily use.',
            ],
          },
          { type: 'heading', text: 'Outcome' },
          {
            type: 'paragraph',
            text: 'Team efficiency improved by 10–15%; the interface is used daily.',
          },
        ],
      },
    },
  },
  {
    slug: 'followpulse',
    year: 2025,
    tags: ['React', 'Analytics', 'Dashboards'],
    stack: ['React', 'TypeScript', 'NestJS', 'Charts'],
    links: { demo: 'https://followpulse.com/' },
    kindKey: 'dashboard',
    media: { kind: 'video', width: 1280, height: 668 },
    order: 2,
    featured: true,
    content: {
      ru: {
        title: 'FollowPulse — аналитика соцсетей',
        summary: 'SaaS-платформа аналитики соцсетей и мессенджеров.',
        role: 'Fullstack-разработчик · в команде GameSport',
        blocks: [
          { type: 'heading', text: 'Задача' },
          {
            type: 'paragraph',
            text: 'Дать SMM-специалистам, аналитикам и агентствам единую панель: динамика и точки роста, данные аудитории, вовлечённость, конкуренты, отдельная аналитика Telegram-каналов и чатов, умный поиск по публикациям.',
          },
          { type: 'heading', text: 'Что сделал' },
          {
            type: 'list',
            items: [
              'В команде GameSport отвечал за фронтенд и часть API — работал fullstack.',
              'Собрал дашборды с тяжёлой визуализацией графиков на больших датасетах.',
              'Реализовал разделы Smart Search, Audience Tracker и Telegram Analytics.',
              'Тёмная тема с градиентными акцентами, многоязычный интерфейс.',
            ],
          },
          { type: 'heading', text: 'Результат' },
          {
            type: 'paragraph',
            text: 'Платформа работает в проде на followpulse.com.',
          },
        ],
      },
      en: {
        title: 'FollowPulse — Social Media Analytics',
        summary: 'A SaaS analytics platform for social networks and messengers.',
        role: 'Fullstack Developer · on the GameSport team',
        blocks: [
          { type: 'heading', text: 'Problem' },
          {
            type: 'paragraph',
            text: 'Give SMMs, analysts and agencies one dashboard: growth dynamics and inflection points, audience data, engagement, competitors, a dedicated Telegram channel/chat analytics module, and smart search across posts.',
          },
          { type: 'heading', text: 'What I did' },
          {
            type: 'list',
            items: [
              'Owned the frontend and part of the API on the GameSport team — worked fullstack.',
              'Built dashboards with heavy chart visualization over large datasets.',
              'Implemented the Smart Search, Audience Tracker and Telegram Analytics sections.',
              'Dark theme with gradient accents, multilingual UI.',
            ],
          },
          { type: 'heading', text: 'Outcome' },
          {
            type: 'paragraph',
            text: 'The platform runs in production at followpulse.com.',
          },
        ],
      },
    },
  },
  {
    slug: 'lume-store',
    year: 2026,
    tags: ['Next.js', 'E-commerce', 'React'],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    links: { demo: 'https://lume-clothes.vercel.app/' },
    kindKey: 'website',
    media: { kind: 'video', width: 1280, height: 668 },
    order: 3,
    featured: true,
    content: {
      ru: {
        title: 'Lumé — интернет-магазин одежды',
        summary: 'Витрина бренда одежды из натуральных тканей — коммерческий заказ.',
        role: 'Fullstack-разработчик · заказ',
        blocks: [
          { type: 'heading', text: 'Задача' },
          {
            type: 'paragraph',
            text: 'DTC-бренд одежды из натуральных тканей заказал витрину интернет-магазина: каталог, карточки товара, корзина и оформление заказа с российскими платёжными методами.',
          },
          { type: 'heading', text: 'Что сделал' },
          {
            type: 'list',
            items: [
              'Собрал каталог с разделами (Женское, Мужское, Аксессуары, Sale) и фильтрами.',
              'Карточки товара с рейтингами и скидками, корзина, оформление заказа, промокоды.',
              'Порог бесплатной доставки, оплата Visa / Mastercard / МИР / СБП.',
              'Оптимизация изображений через next/image, адаптив, SEO-разметка.',
            ],
          },
          { type: 'heading', text: 'Формат работы' },
          {
            type: 'paragraph',
            text: 'Коммерческий заказ: реализовал приложение целиком и передал кодовую базу. Дальнейшее развитие магазина ведёт команда заказчика.',
          },
          { type: 'heading', text: 'Стек' },
          {
            type: 'paragraph',
            text: 'Next.js, React, TypeScript, Tailwind CSS.',
          },
        ],
      },
      en: {
        title: 'Lumé — Clothing Store',
        summary: 'Storefront for a natural-fabric clothing brand — a client commission.',
        role: 'Fullstack Developer · commission',
        blocks: [
          { type: 'heading', text: 'Problem' },
          {
            type: 'paragraph',
            text: 'A DTC natural-fabric clothing brand commissioned an online storefront: catalog, product pages, cart and checkout with Russian payment methods.',
          },
          { type: 'heading', text: 'What I did' },
          {
            type: 'list',
            items: [
              'Built the catalog with sections (Women, Men, Accessories, Sale) and filters.',
              'Product cards with ratings and discounts, cart, checkout, promo codes.',
              'Free-shipping threshold, payments via Visa / Mastercard / MIR / SBP.',
              'Image optimization via next/image, responsive layout, SEO markup.',
            ],
          },
          { type: 'heading', text: 'Engagement' },
          {
            type: 'paragraph',
            text: 'A client commission: I built the application end-to-end and handed over the codebase. The brand’s team drives the store from there.',
          },
          { type: 'heading', text: 'Stack' },
          {
            type: 'paragraph',
            text: 'Next.js, React, TypeScript, Tailwind CSS.',
          },
        ],
      },
    },
  },
  {
    slug: 'sillage-landing',
    year: 2026,
    tags: ['Nuxt', 'Scroll-storytelling', 'GSAP'],
    stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'GSAP', 'Lenis', 'Tailwind'],
    links: { demo: 'https://sillage.mansurov.workers.dev/ru/' },
    kindKey: 'website',
    media: { kind: 'video', width: 1280, height: 668 },
    order: 4,
    featured: true,
    content: {
      ru: {
        title: 'SILLAGE — лендинг нишевого парфюма',
        summary:
          'Концептуальный сайт-история для парфюмерного дома — коммерческий заказ.',
        role: 'Frontend-разработчик · заказ',
        blocks: [
          { type: 'heading', text: 'Задача' },
          {
            type: 'paragraph',
            text: 'Нишевый парфюмерный дом заказал концептуальный одностраничный лендинг под запуск первого аромата — сайт-историю, где прокрутка ведёт от флакона к нотам и ритуалу.',
          },
          { type: 'heading', text: 'Что сделал' },
          {
            type: 'list',
            items: [
              'Scroll-scrubbed canvas-герой: прокрутка проигрывает секвенцию из 121 WebP-кадра.',
              'Сцены-секции с параллаксом и сменой фонов, сжимающийся при прокрутке хедер.',
              'Три локали — RU / EN / FR — с переключателем языка.',
              'Статический предрендер (SSG), оптимизация изображений, плавный скролл на Lenis.',
            ],
          },
          { type: 'heading', text: 'Формат работы' },
          {
            type: 'paragraph',
            text: 'Коммерческий заказ: реализовал фронтенд целиком и передал кодовую базу заказчику.',
          },
          { type: 'heading', text: 'Стек' },
          {
            type: 'paragraph',
            text: 'Nuxt 4, Vue 3, TypeScript, GSAP + ScrollTrigger, Lenis, Tailwind CSS.',
          },
        ],
      },
      en: {
        title: 'SILLAGE — Niche Perfume Landing',
        summary: 'A concept scroll-story site for a perfume house — a client commission.',
        role: 'Frontend Developer · commission',
        blocks: [
          { type: 'heading', text: 'Problem' },
          {
            type: 'paragraph',
            text: 'A niche perfume house commissioned a concept one-page landing for its first fragrance launch — a scroll-driven story that moves from the bottle to the notes to the ritual.',
          },
          { type: 'heading', text: 'What I did' },
          {
            type: 'list',
            items: [
              'Scroll-scrubbed canvas hero: scrolling plays a 121-frame WebP sequence.',
              'Scene sections with parallax and shifting backdrops, a header that condenses on scroll.',
              'Three locales — RU / EN / FR — with a language switch.',
              'Static prerender (SSG), image optimization, momentum scrolling with Lenis.',
            ],
          },
          { type: 'heading', text: 'Engagement' },
          {
            type: 'paragraph',
            text: 'A client commission: I built the frontend end-to-end and handed over the codebase.',
          },
          { type: 'heading', text: 'Stack' },
          {
            type: 'paragraph',
            text: 'Nuxt 4, Vue 3, TypeScript, GSAP + ScrollTrigger, Lenis, Tailwind CSS.',
          },
        ],
      },
    },
  },
]

const toLocalized = (project: Project, locale: Locale): LocalizedProject => {
  const { content, ...shared } = project
  return { ...shared, ...content[locale] }
}

/** Projects sorted by `order`, with the active locale's text flattened in. */
export const getProjects = (locale: Locale): LocalizedProject[] =>
  [...PROJECTS]
    .sort((left, right) => left.order - right.order)
    .map((project) => toLocalized(project, locale))

export const getProject = (locale: Locale, slug: string): LocalizedProject | null =>
  getProjects(locale).find((project) => project.slug === slug) ?? null
