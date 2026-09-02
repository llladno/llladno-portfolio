import type { Locale } from '~/shared/config/i18n'
import type { Job } from '~/entities/experience/model/types'

const JOBS_BY_LOCALE: Record<Locale, Job[]> = {
  ru: [
    {
      company: 'GameSport',
      role: 'Middle Frontend-разработчик',
      period: 'Ноябрь 2024 — сейчас',
      location: 'Санкт-Петербург · Гибрид',
      stack: [
        'Vue.js',
        'React',
        'TypeScript',
        'Pinia',
        'NestJS',
        'Playwright',
        'Vitest',
        'PWA',
      ],
      bullets: [
        'Веду frontend-разработку на 3+ продуктах компании — отвечаю за архитектуру, качество кода и командные процессы, ревьюю задачи и помогаю с онбордингом новых разработчиков.',
        'Провёл полный редизайн флагманского приложения — сам собрал UI-макет и реализовал его от начала до конца, без регрессий на релизе.',
        'Внедрил E2E-тесты (Playwright) и unit-тесты (Vitest) по всей кодовой базе, настроил их запуск в CI.',
        'Провёл технические аудиты 3+ проектов с письменными рекомендациями; выстроил документацию и заметно сократил время онбординга.',
        'Работал fullstack, где нужно: часть API и бизнес-логики на NestJS, интеграции с внешними сервисами.',
      ],
      projects: [
        {
          name: 'GameSport',
          href: 'https://t.me/GameSportBetBot',
          summary:
            'Ставочные и медиа-продукты GameSport: веб-приложения, Telegram Mini Apps и PWA.',
          bullets: [
            'Разработал Telegram Mini Apps и PWA для двух продуктов GameSport — это повысило удержание пользователей.',
            'Сделал Telegram-бота @GameSportBetBot и Mini App к нему — от Vue-интерфейса до интеграции с NestJS-бэкендом.',
            'Собрал админ-панели с большим объёмом данных и сложной визуализацией графиков.',
          ],
        },
        {
          name: 'FollowPulse',
          href: 'https://followpulse.com/',
          summary:
            'SaaS-платформа аналитики соцсетей и мессенджеров — продукт команды GameSport. Fullstack, в команде.',
          bullets: [
            'Собрал дашборды с тяжёлой визуализацией графиков на больших датасетах.',
            'Реализовал разделы Smart Search, Audience Tracker и Telegram Analytics.',
            'Отвечал за фронтенд и часть API на NestJS; тёмная тема с градиентными акцентами, мультиязычный интерфейс.',
          ],
        },
      ],
    },
    {
      company: 'Фриланс · коммерческие проекты',
      role: 'Frontend / Fullstack-разработчик',
      period: '2025 — 2026',
      location: 'Удалённо',
      stack: ['Next.js', 'Nuxt', 'React', 'Vue.js', 'TypeScript', 'GSAP', 'Tailwind'],
      bullets: [
        'Соло-заказы: реализовал приложения целиком и передал кодовые базы заказчикам — дальнейшее развитие ведут их команды.',
      ],
      projects: [
        {
          name: 'Lumé',
          href: 'https://lume-clothes.vercel.app/',
          summary:
            'Интернет-магазин одежды из натуральных тканей. Fullstack, соло, коммерческий заказ (Next.js).',
          bullets: [
            'Каталог, карточки товара, корзина и оформление заказа.',
            'Подключил российские платёжные методы; собрал и передал кодовую базу заказчику.',
          ],
        },
        {
          name: 'SILLAGE',
          href: 'https://sillage.mansurov.workers.dev/ru/',
          summary:
            'Концептуальный лендинг нишевого парфюма. Frontend, соло, коммерческий заказ.',
          bullets: [
            'Scroll-сторителлинг со scrubbed canvas-героем, три локали, предрендер (SSG).',
            'Реализовал фронтенд целиком по макету и передал заказчику.',
          ],
        },
      ],
    },
    {
      company: 'FiveMods',
      role: 'Junior Frontend-разработчик',
      period: 'Март 2023 — Ноябрь 2024',
      location: 'Санкт-Петербург · Удалённо',
      stack: ['Electron', 'Vue.js', 'TypeScript', 'NestJS', 'Playwright'],
      bullets: [
        'Спроектировал и собрал полноценное desktop-приложение на Electron — в срок, без критических багов на релизе.',
        'Самостоятельно разработал frontend лаунчера на Electron: автообновление, управление модами, аккаунт пользователя.',
        'Сделал маркетинговый лендинг Network Graphics (ntw.graphics), поднявший конверсию.',
        'Написал E2E-тесты (Playwright), покрывающие все критические пользовательские сценарии.',
        'Собрал панель менеджера поддержки с интеграцией backend на NestJS.',
      ],
      links: [{ label: 'ntw.graphics', href: 'https://ntw.graphics/' }],
    },
    {
      company: 'BIOCAD',
      role: 'Стажёр Frontend-разработчика',
      period: 'Апрель 2022 — Октябрь 2022',
      location: 'Санкт-Петербург · Гибрид',
      stack: ['Angular', 'TypeScript', 'REST API'],
      bullets: [
        'Разработал интерфейс для управления и мониторинга ЧПУ-станков в реальном времени — используется операторами ежедневно.',
        'Оптимизировал пользовательские сценарии — эффективность команды выросла на 10–15%.',
        'Выпускал готовые к продакшену фичи в корпоративной среде на протяжении 6-месячной стажировки.',
      ],
    },
  ],
  en: [
    {
      company: 'GameSport',
      role: 'Middle Frontend Developer',
      period: 'Nov 2024 — present',
      location: 'Saint Petersburg · Hybrid',
      stack: [
        'Vue.js',
        'React',
        'TypeScript',
        'Pinia',
        'NestJS',
        'Playwright',
        'Vitest',
        'PWA',
      ],
      bullets: [
        'Lead frontend development across 3+ of the company’s products — owning architecture, code quality and team processes, reviewing work and helping onboard new developers.',
        'Ran a full redesign of the flagship app — built the UI mockup and implemented it end-to-end, with no regressions at release.',
        'Introduced E2E tests (Playwright) and unit tests (Vitest) across the codebase and wired them into CI.',
        'Ran technical audits of 3+ projects with written recommendations; built up the docs and cut onboarding time noticeably.',
        'Worked fullstack where needed: parts of the API and business logic in NestJS, third-party integrations.',
      ],
      projects: [
        {
          name: 'GameSport',
          href: 'https://t.me/GameSportBetBot',
          summary:
            'GameSport’s betting and media products: web apps, Telegram Mini Apps and PWAs.',
          bullets: [
            'Built Telegram Mini Apps and PWAs for two GameSport products — improving user retention.',
            'Built the @GameSportBetBot Telegram bot and its Mini App — from the Vue UI to the NestJS backend integration.',
            'Built admin panels handling large datasets with complex chart visualizations.',
          ],
        },
        {
          name: 'FollowPulse',
          href: 'https://followpulse.com/',
          summary:
            'A SaaS analytics platform for social networks and messengers — a GameSport team product. Fullstack, on a team.',
          bullets: [
            'Built dashboards with heavy chart visualization over large datasets.',
            'Implemented the Smart Search, Audience Tracker and Telegram Analytics sections.',
            'Owned the frontend and part of the NestJS API; dark theme with gradient accents, multilingual UI.',
          ],
        },
      ],
    },
    {
      company: 'Freelance · client projects',
      role: 'Frontend / Fullstack Developer',
      period: '2025 — 2026',
      location: 'Remote',
      stack: ['Next.js', 'Nuxt', 'React', 'Vue.js', 'TypeScript', 'GSAP', 'Tailwind'],
      bullets: [
        'Solo commissions: built each application end-to-end and handed over the codebase — the clients’ teams take it from there.',
      ],
      projects: [
        {
          name: 'Lumé',
          href: 'https://lume-clothes.vercel.app/',
          summary:
            'A natural-fabric clothing store. Fullstack, solo, client commission (Next.js).',
          bullets: [
            'Catalog, product pages, cart and checkout.',
            'Integrated Russian payment methods; built and handed over the codebase.',
          ],
        },
        {
          name: 'SILLAGE',
          href: 'https://sillage.mansurov.workers.dev/ru/',
          summary:
            'A concept landing for a niche perfume. Frontend, solo, client commission.',
          bullets: [
            'Scroll storytelling with a scrubbed canvas hero, three locales, prerender (SSG).',
            'Built the frontend end-to-end from the design and handed it over.',
          ],
        },
      ],
    },
    {
      company: 'FiveMods',
      role: 'Junior Frontend Developer',
      period: 'Mar 2023 — Nov 2024',
      location: 'Saint Petersburg · Remote',
      stack: ['Electron', 'Vue.js', 'TypeScript', 'NestJS', 'Playwright'],
      bullets: [
        'Designed and built a full-scale Electron desktop application — delivered on time with no critical bugs at release.',
        'Independently developed the frontend for an Electron launcher: auto-update, mod management, user account.',
        'Built the Network Graphics marketing landing (ntw.graphics) that lifted conversion.',
        'Wrote E2E tests (Playwright) covering all critical user flows.',
        'Built a support-manager dashboard integrated with a NestJS backend.',
      ],
      links: [{ label: 'ntw.graphics', href: 'https://ntw.graphics/' }],
    },
    {
      company: 'BIOCAD',
      role: 'Frontend Developer Intern',
      period: 'Apr 2022 — Oct 2022',
      location: 'Saint Petersburg · Hybrid',
      stack: ['Angular', 'TypeScript', 'REST API'],
      bullets: [
        'Developed a real-time interface for controlling and monitoring CNC machines, used daily by operators.',
        'Optimized user workflows — improved team efficiency by 10–15%.',
        'Delivered production-ready features in a corporate environment over a 6-month internship.',
      ],
    },
  ],
}

export const getJobs = (locale: Locale): Job[] => JOBS_BY_LOCALE[locale]
