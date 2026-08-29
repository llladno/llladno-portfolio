# Портфолио «macOS Desktop» — дизайн-документ

- **Дата:** 2026-08-27
- **Статус:** на ревью
- **Тип:** архитектурный (новый проект)

## Отклонения, принятые при реализации базы (2026-08-27)

1. **Один адаптивный layout** (`app/layouts/default.vue`) вместо двух
   (`desktop` / `plain`) — чтобы SSR/CSR разметка совпадала. Семантический
   контент всегда в SSR; macOS-чром поверх за `<ClientOnly>` после `boot()`.
2. **Контент — TS-модули в `app/data/`**, не `@nuxt/content` (см. §6). Ушёл
   модуль и нативный `better-sqlite3`.
3. **`nuxt-og-image` убран** — тянул `@resvg/resvg-js` (натив) и ломал
   prerender. Вернуть в SEO-фазе; пока статический `/og/default.png` в мете.
4. **TypeScript запинен на 5.9.3** (`overrides` в `pnpm-workspace.yaml`) —
   TS 7.0 несовместим с `typescript-eslint`.
5. **Структура — лёгкий FSD** (`app/{shared,entities,features,widgets}` +
   Nuxt `pages`/`layouts`). Каждый компонент — папка
   `ui/Name/{Name.vue,types.ts,constants.ts,index.ts}`. Авто-импорт компонентов
   **выключен** — всё через `index.ts` слайса. Импорты только вниз по слоям
   (ESLint `no-restricted-imports`).
6. **Код-стандарты** (ESLint + скилл `.claude/skills/code-standards`):
   только стрелочные функции, именованные константы вместо магических чисел,
   читаемые имена (`id-length` ≥ 3), импорты только через `~`, Tailwind
   theme-утилиты вместо `[var(--…)]`.

## 1. Цель и объём

Персональное портфолио-сайт с кинематографичным входом и метафорой рабочего
стола macOS.

**Пользовательский сценарий входа:**

1. Сверху картинка + заголовок (текст обо мне).
2. При скролле проигрывается scroll-scrubbed анимация: из картинки «вырастает»
   ноутбук.
3. Камера въезжает в экран ноутбука → страница «загружается» в интерфейс,
   похожий на рабочий стол macOS: верхний menu bar, нижний Dock, стеклянные
   панели (glassmorphism), контент обо мне на «экране».
4. Иконки Dock и пункты меню открывают разделы сайта.

**В объёме:**

- One-page сайт: один роут на локаль (`/`, `/en/`), все разделы — секции в DOM.
- Разделы: About / Projects / Experience / Contact (список может дополниться).
- Проекты открываются окном/оверлеем на главной (без отдельных роутов).
- i18n: RU (по умолчанию) + EN.
- SEO: SSG, мета-теги, hreflang/canonical, sitemap, robots, OG-картинки, JSON-LD.
- Контакт: только ссылки (email/mailto, соцсети, PDF-резюме), без бэкенда.
- E2E-тесты Playwright + CI.
- Упрощённая версия для мобильных и `prefers-reduced-motion`.

**Вне объёма (YAGNI для v1):**

- Мультиоконность, z-order-менеджер, фейковая файловая система.
- Отдельные страницы-кейсы проектов и OG-картинки под каждый проект.
- Форма обратной связи / серверные роуты / БД.
- CMS — контент в репозитории.
- Блог.
- Тёмная/светлая тема — задел в токенах есть, но приоритет низкий (см. §11).

## 2. Выбранный подход

Рассмотрены три подхода к связи «рабочий стол ↔ роутинг/SEO»:

| Подход                                                       | Суть                                                                                                                                  | Почему нет                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **1. Content-first DOM + OS как прогрессивное улучшение** ⭐ | Семантический контент всегда в DOM; menu bar / Dock / окно накладываются поверх на способных вьюпортах; мобилка — простой стек секций | — выбран                                            |
| 2. SPA-оболочка «настоящая ОС»                               | Один роут, разделы — клиентские окна, мультиоконность                                                                                 | Слабое SEO, тяжёлые e2e, мобилка = отдельная сборка |
| 3. Два раздельных опыта                                      | Кинолендинг + отдельное обычное портфолио                                                                                             | Теряется главная идея рабочего стола                |

**Выбран подход 1**, уточнённый до **one-page**: контент разделов — секции
одной страницы; Dock/меню не навигируют между страницами, а открывают окно
(desktop) или скроллят к секции (plain). Весь вау-эффект сохраняется, контент
остаётся детерминированным, индексируемым и тестируемым.

## 3. Стек и рендеринг

### Стек

- **Nuxt 4** + Vue 3 + TypeScript (strict).
- **Tailwind CSS v4** через `@tailwindcss/vite`, CSS-first конфигурация
  (`@theme` в `app/assets/css/main.css`), без `tailwind.config.js`.
- **@nuxtjs/i18n v9** — стратегия `prefix_except_default`,
  `defaultLocale: 'ru'` → RU на `/`, EN на `/en/*`.
- **Контент — типизированные TS-модули в `app/data/`** (без `@nuxt/content`;
  см. §6).
- **@nuxt/image** — оптимизация изображений (провайдер `ipx`, AVIF/WebP).
- **GSAP + ScrollTrigger** — scroll-scrubbing и pin (GSAP с 2025 полностью
  бесплатен, включая ScrollTrigger).
- **@vueuse/core** — `useScroll`, `useMediaQuery`, `useDraggable`,
  `usePreferredReducedMotion`, `useIntersectionObserver`.
- **SEO:** `@nuxtjs/sitemap`, `@nuxtjs/robots`, `nuxt-og-image`.
- **Тесты:** `@playwright/test` + `@nuxt/test-utils`, `@axe-core/playwright`.
- **Качество:** `@nuxt/eslint` (flat config) + Prettier, `vue-tsc` (typecheck),
  `lefthook` (git-хуки).
- **Пакетный менеджер:** `pnpm`. **Node:** LTS, зафиксирован в `.nvmrc` +
  `engines`.

### Рендеринг

- **SSG-first:** `nuxt generate`, prerender всех роутов (`crawlLinks: true`) +
  `/sitemap.xml`, `/robots.txt`, `/en/`, локализованная 404.
- Nitro preset — `static`. Смена на `node-server` / `vercel` / `cloudflare` —
  одна строка конфига, когда определён хостинг.
- Бэкенд не требуется (контакт = ссылки) → чистая статика подходит полностью.
- Никаких данных в query-параметрах; переключение локали меняет путь.
- `NUXT_PUBLIC_SITE_URL` — обязателен для абсолютных canonical/hreflang/OG.

### Бюджеты производительности (проверяются в CI, Lighthouse CI опционально)

- LCP < 2.5s на мобильном профиле.
- JS при входе < ~180 KB gzip (без кадров интро).
- Ассеты интро (кадры) — вне критического пути, ленивый прелоад по входу в зону.
- CLS ≈ 0 (десктоп-чром докидывается без layout-shift, зарезервированные зоны).

## 4. Intro: scroll-scrub («картинка → текст → ноутбук → рабочий стол»)

### Структура сцены

- `app/pages/index.vue` → `<IntroStage>` + далее секции.
- `IntroStage` — контейнер высотой ~`350vh`; внутри `position: sticky`
  вьюпорт-слой, который GSAP ScrollTrigger пинит и скрабит по прогрессу `0→1`.
- Фазы прогресса:
  1. `0.00–0.15` — статичная картинка, H1 появляется.
  2. `0.15–0.70` — скраб кадров: из картинки вырастает ноутбук.
  3. `0.70–0.90` — «въезд» в экран ноутбука, подзаголовок уходит.
  4. `0.90–1.00` — кроссфейд в рабочий стол (Wallpaper + Dock + menu bar
     проявляются), пин снимается, `booted = true`.

### Техника воспроизведения — кадровая последовательность на `<canvas>` (выбрано)

- Исходный mp4 нарезается в ~120–180 кадров WebP скриптом
  `scripts/build-intro-frames.mjs` (ffmpeg). Два набора: ~1280px и ~1920px.
- Прелоад кадров запускается по `IntersectionObserver` (пользователь дошёл до
  зоны). До готовности скраб отключён, показывается `poster.webp` (первый кадр);
  прогресс готовности отражается в `aria`/`data`-атрибуте.
- Скролл двигает `currentFrame`; отрисовка на `<canvas>` через
  `requestAnimationFrame`.
- Причина выбора против `<video>` + `currentTime`: детерминированный скраб без
  рывков во всех браузерах (особенно iOS/Android), чёткая картинка, легко
  тестировать. Цена — вес ~1.5–3 MB на набор кадров и шаг препроцессинга.
- `<video>`-режим остаётся задокументированным фолбэком, если кадры окажутся
  неприемлемо тяжёлыми.

### Fallback (мобилка / `prefers-reduced-motion` / no-JS)

- Ни скраба, ни пина. `IntroFallback`: статичный герой-образ (последний кадр —
  ноутбук с экраном) + H1 + подзаголовок + кнопка «Смотреть работы» → скролл к
  секциям.
- Рабочий стол на мобилке не собирается — сразу `plain` layout.
- SSR/SSG всегда отдаёт этот семантический вариант; canvas-скраб — улучшение
  поверх.

### Ассеты

- `public/intro/frames-1280/0001.webp …`, `frames-1920/…`, `public/intro/poster.webp`.
- Исходный mp4 — в `assets-src/` (в git не коммитим; хранение уточняется —
  Git LFS или внешнее хранилище).
- `scripts/build-intro-frames.mjs` — документируется в CLAUDE.md; перед
  `nuxt generate` скрипт проверяет наличие кадров.

## 5. OS-слой (layouts, menu bar, Dock, окно)

### Два layout'а

- `app/layouts/desktop.vue` — активен при ширине `≥ lg` И без
  `prefers-reduced-motion`. Содержит `<Wallpaper>`, `<MenuBar>`, `<Dock>`,
  `<WindowHost>` (монтирует `<slot>` страницы внутри `<OsWindow>`).
- `app/layouts/plain.vue` — мобилка / reduced-motion / фолбэк. Sticky-хедер
  (имя + бургер-меню разделов + LocaleSwitch + ThemeToggle), `<slot>` —
  обычные секции внутри `<main>`.
- Выбор layout — на клиенте через `useDesktopMode()` (media-query +
  reduced-motion). SSG рендерит plain-совместимую разметку; десктоп-чром
  докидывается после mount без layout-shift (CSS резервирует зоны). H1 и
  контент идентичны в обоих режимах.

### Компоненты OS (`app/components/os/`)

- **`MenuBar.vue`** — верхняя стеклянная плашка. Слева: «» + имя + пункты-меню
  (About / Projects / Experience / Contact — дублируют Dock, дают клавиатурную
  навигацию). Справа: `LocaleSwitch` (RU/EN), `ThemeToggle`, `MenuClock`
  (реальное время, `Intl.DateTimeFormat` по локали).
- **`Dock.vue` + `DockItem.vue`** — снизу по центру, стекло + `backdrop-filter`.
  Иконки: разделы + внешние ссылки (GitHub / LinkedIn / Telegram) + «резюме
  PDF». Магнификация по ховеру (`transform: scale` от расстояния до курсора,
  отключается при reduced-motion). Активный раздел — индикатор-точка. Каждый
  `DockItem` — `<button>` или `<a>` (внешние ссылки — настоящие `<a>`).
- **`OsWindow.vue`** — стеклянная панель: `TrafficLights` (close → закрыть
  окно/`#`; minimize/zoom — декоративные в v1), заголовок = title раздела,
  тело = `<slot>`. Таскается мышью (`useDraggable`, в пределах вьюпорта).
  Позиция не персистится (v1).
- **`WindowHost.vue`** — одно активное окно за раз, соответствует `activeSection`
  из `useSectionRouter`. Transition при смене (fade + scale 0.98→1; View
  Transitions API где есть, иначе Vue `<Transition>`; при reduced-motion —
  мгновенно).
- **`Wallpaper.vue`** — CSS-градиент / мягкая анимация (macOS-подобно), варианты
  под тему, статичный при reduced-motion.

### Композаблы (`app/composables/`)

- **`useDesktopMode.ts`** — реактивный boolean (media-query + reduced-motion).
- **`useIntroState.ts`** — прогресс интро (`0–1`) + флаг `booted`
  (`sessionStorage`: при возврате на `/` в рамках сессии интро проматывается
  мгновенно).
- **`useSectionRouter.ts`** — единственный владелец «какой раздел/проект
  открыт». Вход: hash + клики Dock/меню/карточек. Выход: `activeSection`,
  `activeProject`, `open()`, `close()`. Обновляет hash через
  `history.replaceState`; scroll-spy в plain-режиме.
- **`useDockMagnify.ts`** — логика увеличения иконок.
- **`useSeoI18n.ts`** — обёртка `useSeoMeta` + hreflang/canonical/`<html lang>`.

### Переходы

- Клик по Dock/меню → `useSectionRouter.open(section)` → окно (desktop) или
  `scrollIntoView` к секции (plain) + hash.
- Красная кнопка / `Escape` → `close()` → hash `#`, домашнее окно (About).

### Доступность

- Dock — `<nav aria-label>`, Tab/стрелки работают, видимые фокус-кольца.
- Окно в desktop-режиме — `role="dialog"` + `aria-modal="true"` +
  `aria-labelledby` на заголовок, focus-trap, возврат фокуса на триггер при
  закрытии. В plain-режиме раздел — обычный `<section aria-labelledby>` без
  trap.
- Всё кликабельное — нативные `<button>` / `<a>`, не `div` + `@click`.
- Хеш-навигация не ломает скролл-до-контента для скринридеров.

## 6. Контент-модель, i18n, SEO

### Контент (типизированные TS-модули, `app/data/`)

> Обновлено при реализации: `@nuxt/content` не используется (лишний модуль +
> нативный `better-sqlite3` + формат папок не понравился). Контент — обычные
> TS-файлы с типами.

```
app/data/
  types.ts        # Locale, About, Job, Project, ProjectContent, CaseBlock
  about.ts        # about: Record<Locale, About>
  experience.ts   # experience: Record<Locale, Job[]>
  projects.ts     # projects: Project[]  (locale-neutral поля + content: Record<Locale, …>)
  index.ts        # getAbout / getExperience / getProjects / getProject; dev-проверка уникальности slug
```

- `Project` = `{ slug, year?, tags[], stack[], links{repo?,demo?}, cover?,
order, featured, content: Record<Locale, ProjectContent> }`.
  `ProjectContent` = `{ title, summary, role?, blocks: CaseBlock[] }`.
- `CaseBlock` = `heading | paragraph | list | image` — структурированный кейс,
  рендерится компонентом `components/content/CaseBlocks.vue`.
- Типобезопасность — на этапе `nuxt typecheck` / сборки. Никакого рантайм-парсинга:
  секции зовут `getAbout(locale)` и т.п. синхронно в `setup`.
- Полное тело каждого кейса рендерится в DOM в секции `#projects` как
  `<article>` (для SEO). «Окно проекта» — слой представления над теми же
  данными.
- UI-строки — `i18n/locales/ru.json` + `en.json`, вложенные ключи по фичам:
  `intro.*`, `dock.*`, `window.*`, `menu.*`, `seo.*`, `a11y.*`, `common.*`.

### i18n

- `strategy: 'prefix_except_default'`, `defaultLocale: 'ru'`,
  `locales: [{ code: 'ru', language: 'ru-RU' }, { code: 'en', language: 'en-US' }]`.
- `detectBrowserLanguage`: `redirectOn: 'root'`, cookie, без редиректа на
  вложенных путях (прямые ссылки не прыгают).
- Переключение языка сохраняет активный раздел (`switchLocalePath` + текущий
  hash).
- `baseUrl` из `NUXT_PUBLIC_SITE_URL`.

### SEO

- `useSeoI18n` на странице: `title`, `description`, `ogTitle`,
  `ogDescription`, `ogImage`, `twitterCard`. Один набор на локаль.
- `@nuxtjs/i18n` авто-генерит `<link rel="alternate" hreflang>` + `x-default` +
  canonical (требует `baseUrl`).
- `nuxt-og-image` — по одной OG-картинке на локаль (имя + краткое описание +
  mac-мотив), генерится при prerender.
- `@nuxtjs/sitemap` — из prerendered роутов (`/`, `/en/`) с `alternates`.
- `@nuxtjs/robots` — allow all + ссылка на sitemap; на preview-окружениях
  `disallow: /` (по env).
- JSON-LD: `Person` (глобально в `app.vue`) — имя, должность, соцпрофили
  (`sameAs`), ссылка на резюме.
- `<html lang>` и `dir` — из активной локали.
- Локализованная 404 (`app/error.vue`).

### Роуты (все prerender)

```
/           /en/
/sitemap.xml   /robots.txt   (+ 404)
```

Разделы и проекты — через hash: `#about`, `#projects`, `#experience`,
`#contact`, `#projects/<slug>`.

## 7. Тесты (Playwright), CI, тулинг

### Playwright (`tests/e2e/`) — против `nuxt generate` + `nuxi preview`

- `smoke.spec.ts` — `/` и `/en/` → 200, есть H1, 4 секции с `<h2>`, Dock/меню
  видны на desktop-вьюпорте.
- `i18n.spec.ts` — свитчер RU↔EN меняет `<html lang>`, тексты, URL-префикс;
  активный раздел (hash) сохраняется; hreflang/`x-default`/canonical есть и
  абсолютные.
- `navigation.spec.ts` — Dock-иконка открывает окно раздела + ставит hash;
  красная кнопка/`Escape` закрывают → `#`; клик по карточке проекта открывает
  окно проекта (`#projects/<slug>`); прямой заход по `/#projects/<slug>`
  открывает то же.
- `intro.spec.ts` — desktop-вьюпорт: скролл по `IntroStage` двигает прогресс,
  в конце проявляются Dock + menu bar; `booted` в sessionStorage проматывает
  интро при повторном визите.
- `reduced-motion.spec.ts` — `emulateMedia({ reducedMotion: 'reduce' })`: нет
  canvas-скраба и пина, сразу plain layout, весь контент доступен.
- `responsive.spec.ts` — мобильный вьюпорт: plain layout, бургер-меню скроллит
  к секциям, Dock отсутствует.
- `seo.spec.ts` — title/description/OG на обеих локалях; `/sitemap.xml`
  содержит `/` и `/en/`; `/robots.txt` доступен; JSON-LD `Person` валиден.
- `a11y.spec.ts` — `@axe-core/playwright` на `/` и `/en/` (plain + desktop),
  0 serious/critical.
- Проекты браузеров: Chromium + WebKit + Mobile Safari (iOS-скраб — главный
  риск). Опционально — визуальные снапшоты Dock/окна с `maxDiffPixelRatio`.

### CI (`.github/workflows/ci.yml`)

- Джобы: `lint` (eslint + `prettier --check`), `typecheck` (`vue-tsc`),
  `test:e2e` (build → preview → playwright, кеш браузеров), опц. `lighthouse`
  (бюджеты из §3).
- Валидация контента — часть `nuxt build` (Zod-схемы).

### Тулинг

- `lefthook`: pre-commit → eslint --fix + prettier на staged; pre-push →
  typecheck.
- `.nvmrc` / `engines` — Node LTS.
- `scripts/build-intro-frames.mjs` — ffmpeg-нарезка кадров + проверка наличия
  кадров перед `generate`.

## 8. Структура проекта

```
portfolio/
├─ nuxt.config.ts              # модули, i18n, nitro(prerender), image, site url
├─ content.config.ts           # Zod-схемы коллекций
├─ app.config.ts               # тема, соц-ссылки, конфиг Dock (порядок иконок)
├─ eslint.config.mjs
├─ lefthook.yml
├─ playwright.config.ts
├─ .nvmrc  .env.example        # NUXT_PUBLIC_SITE_URL
│
├─ app/
│  ├─ app.vue                  # NuxtLayout/NuxtPage + глобальный JSON-LD Person
│  ├─ error.vue                # локализованная 404/500
│  ├─ assets/css/main.css      # @import "tailwindcss"; @theme { токены, стекло }
│  ├─ layouts/{desktop,plain}.vue
│  ├─ pages/index.vue          # IntroStage + 4 секции
│  ├─ components/
│  │  ├─ intro/                # IntroStage, ScrubCanvas, IntroCopy, IntroFallback
│  │  ├─ os/                   # MenuBar, Dock, DockItem, OsWindow, WindowHost,
│  │  │                        #   Wallpaper, TrafficLights, LocaleSwitch,
│  │  │                        #   ThemeToggle, MenuClock
│  │  ├─ sections/             # About/Projects/Experience/ContactSection
│  │  └─ content/              # ProjectCard, ProjectCase, ExperienceTimeline,
│  │                           #   SkillList, SocialLinks, ProseRenderer
│  ├─ composables/             # useDesktopMode, useIntroState, useSectionRouter,
│  │                           #   useDockMagnify, useSeoI18n
│  └─ utils/                   # frame-preloader, easing, focus-trap
│
├─ i18n/
│  ├─ i18n.config.ts
│  └─ locales/{ru,en}.json
│
├─ content/{ru,en}/…           # about.md, experience.yml, projects/*.md
│
├─ public/
│  ├─ intro/frames-1280/*.webp  frames-1920/*.webp  poster.webp
│  ├─ resume/{ru,en}.pdf
│  ├─ og/                      # генерит nuxt-og-image
│  └─ favicon / icons
│
├─ scripts/build-intro-frames.mjs
├─ tests/e2e/*.spec.ts  +  tests/fixtures/
├─ .github/workflows/ci.yml
├─ CLAUDE.md
└─ docs/superpowers/specs/2026-08-27-portfolio-macos-design.md
```

### Ключевые контракты модулей

- **`useSectionRouter`** — единственный владелец состояния «какой раздел/проект
  открыт». Вход: hash, клики Dock/меню/карточек. Выход: `activeSection`,
  `activeProject`, `open()`, `close()`. Зависит от `useRoute`, `useIntroState`.
  Consumers не знают внутренностей.
- **`ScrubCanvas`** — вход: `frames` (URL[]), `progress` (0–1). Выход:
  отрисовка. Про скролл не знает.
- **`IntroStage`** — владелец ScrollTrigger/пина. Отдаёт `progress` вниз,
  эмитит `booted` наверх.
- **`OsWindow`** — чистый презентер: `title`, `slot`, событие `close`. Драг —
  внутри.
- **Контент-компоненты** (`sections/*`, `content/*`) не знают про desktop/plain,
  получают данные, рендерят семантику. Обёртка (окно/секция) — снаружи.

## 9. Поток данных

```
build: content/*.md,*.yml ──(@nuxt/content + Zod)──► типизированные коллекции
                                                         │
runtime (SSG HTML): pages/index.vue ─► sections/* ─► content/* (вся семантика в DOM)
                                                         │
client mount:
  useDesktopMode ─► layout: desktop | plain
  IntroStage (desktop) ─► useIntroState.progress ─► ScrubCanvas, Wallpaper fade
  IntroStage booted ─► useIntroState.booted (sessionStorage)
  URL hash ─┬─► useSectionRouter.activeSection/activeProject
  Dock/Menu/Card click ─┘        │
                                 ├─ desktop: WindowHost монтирует OsWindow(slot=section)
                                 └─ plain: scrollIntoView(section) + раскрытие проекта
  LocaleSwitch ─► switchLocalePath(+hash) ─► /en/… ─► useSeoI18n обновляет мету
```

## 10. Обработка ошибок и краевые случаи

- **Кадры интро не загрузились** → остаёмся на `poster.webp`, скраб выключен,
  по завершении зоны всё равно `booted` (без анимации ноутбука); ошибка в
  консоль, не блокирует сайт.
- **JS отключён** → SSG-HTML: H1, все секции, все кейсы проектов, ссылки,
  резюме доступны; нет Dock/окон/интро — это приемлемо.
- **Прямой заход по `/#projects/<slug>` с несуществующим slug** → hash
  игнорируется, открывается `#projects` (или ничего), без ошибки.
- **`prefers-reduced-motion` меняется в рантайме** → `useDesktopMode`
  реактивен, layout переключается; состояние раздела (hash) сохраняется.
- **Очень узкий десктоп / очень широкий телефон** → порог `lg` +
  проверка `pointer: fine` для десктоп-режима; граничные — plain.
- **Битый контент** → сборка падает на Zod-валидации (в CI, до деплоя).
- **Отсутствует `NUXT_PUBLIC_SITE_URL`** → сборка предупреждает; canonical/OG
  становятся относительными (для локалки ок, для прода CI требует переменную).
- **SSR/CSR mismatch по layout** → на сервере всегда рендерим plain-совместимую
  разметку, desktop-чром появляется только после mount (`<ClientOnly>` для
  чисто-декоративных частей), контент вне `ClientOnly`.

## 11. Открытые вопросы

1. **Хостинг** не выбран → проектируем под `static`, Nitro-preset меняется
   позже одной строкой.
2. **Хранение исходного mp4** интро — Git LFS или внешнее хранилище
   (решить при инициализации).
3. **Тёмная/светлая тема** — токены закладываем сразу, но полноценный
   `ThemeToggle` может уехать в v1.1 (низкий приоритет).
4. **Дополнительные разделы Dock** («Придумаем ещё») — добавляются позже через
   `app.config.ts` + новый файл контента, архитектура не меняется.
5. **Точное число кадров интро** (120–180) — калибруется по реальному
   исходнику и весу.

## 12. План проверки

- Все e2e из §7 зелёные на Chromium + WebKit + Mobile Safari.
- Lighthouse (мобильный): Performance ≥ 90, SEO = 100, Accessibility ≥ 95,
  бюджеты §3 соблюдены.
- Ручная проверка: интро на реальном iPhone (Safari) и Android (Chrome) — нет
  рывков скраба, fallback корректен.
- Проверка индексации: `/` и `/en/` в sitemap, hreflang валиден
  (Google Rich Results Test), OG-превью в Telegram/Twitter/LinkedIn.
- `nuxt generate` не требует сети и внешних сервисов.

---

## Приложение A. Черновик CLAUDE.md

```markdown
# CLAUDE.md

Персональное портфолио. One-page сайт с метафорой рабочего стола macOS:
scroll-scrubbed интро (картинка → ноутбук → «загрузка» в desktop), затем
menu bar + Dock + стеклянные окна. Контент — секции одной страницы.

## Команды

| Задача                        | Команда                                  |
| ----------------------------- | ---------------------------------------- |
| Установка                     | `pnpm install`                           |
| Дев-сервер                    | `pnpm dev`                               |
| Прод-сборка (SSG)             | `pnpm generate`                          |
| Локальный предпросмотр сборки | `pnpm preview`                           |
| Lint                          | `pnpm lint` (авто-фикс: `pnpm lint:fix`) |
| Типы                          | `pnpm typecheck`                         |
| E2E                           | `pnpm test:e2e` (UI: `pnpm test:e2e:ui`) |
| Кадры интро из mp4            | `pnpm intro:frames`                      |

## Архитектура (кратко)

- **Nuxt 4 + Vue 3 + TS strict**, **Tailwind v4** (CSS-first, `@theme` в
  `app/assets/css/main.css`, без `tailwind.config.js`).
- **Рендеринг:** SSG (`nuxt generate`), prerender всех роутов. Роутов два:
  `/` (RU) и `/en/` (EN). Разделы и проекты — через hash (`#projects/<slug>`).
- **i18n:** `@nuxtjs/i18n`, `prefix_except_default`, default `ru`. UI-строки в
  `i18n/locales/*.json`. Контентные тексты — в `content/<locale>/…`.
- **Контент:** `@nuxt/content` v3, Zod-схемы в `content.config.ts`. Битый
  frontmatter = падение сборки.
- **Два layout'а:** `desktop.vue` (≥ lg + не reduced-motion) и `plain.vue`
  (мобилка / reduced-motion). Выбор — `useDesktopMode()` на клиенте. **Контент
  и H1 идентичны в обоих**; desktop-чром — прогрессивное улучшение.
- **Состояние раздела** — только через `useSectionRouter` (владелец hash ⇄
  activeSection/activeProject). Не дублировать эту логику в компонентах.
- **Интро:** `IntroStage` владеет GSAP ScrollTrigger/пином; `ScrubCanvas`
  рисует кадры по `progress` и про скролл не знает. Fallback — `IntroFallback`.

## Правила

- **Content-first:** вся семантика (H1, `<h2>` разделов, тела кейсов, ссылки)
  всегда в SSG-HTML. Окна/Dock/интро ничего не должны «прятать» от краулера.
- Кликабельное — нативные `<button>`/`<a>`, не `div` + `@click`. Фокус-кольца
  не убирать.
- Уважать `prefers-reduced-motion` в каждой анимации (GSAP, Dock-магнификация,
  transition окон).
- Анимации — только GSAP (бесплатен, включая ScrollTrigger). Не добавлять
  другие анимационные библиотеки без обсуждения.
- Никаких данных в query-параметрах. Локаль — через путь.
- Изображения — через `<NuxtImg>`/`<NuxtPicture>`, всегда с `width`/`height`.
- Новые UI-строки — сразу в `ru.json` И `en.json`.
- Тесты писать/обновлять вместе с фичей (TDD). Спеки — в `tests/e2e/`.

## Как добавить проект

1. `content/ru/projects/<slug>.md` и `content/en/projects/<slug>.md`
   (frontmatter: `title, slug, summary, cover, tags, links, role, year, stack`).
2. Обложку — в `public/` (или рядом, через `@nuxt/content` assets).
3. При необходимости — порядок/`featured` в `content/<locale>/projects/_index.yml`.
4. `pnpm test:e2e -- navigation` — проверить, что окно проекта открывается.

## Как добавить раздел Dock

1. Контент-файл в `content/<locale>/`.
2. Компонент секции в `app/components/sections/`.
3. Запись в `app.config.ts` (иконка, порядок, i18n-ключ, тип: section | link).
4. Строки в `i18n/locales/*.json`.

## Бюджеты

LCP < 2.5s (мобилка), JS входа < ~180 KB gzip (без кадров интро), CLS ≈ 0.
Кадры интро — ленивая загрузка по `IntersectionObserver`, не в критическом пути.

## Что не делаем в v1

Мультиоконность, фейковая ФС, отдельные роуты проектов, форма контакта,
серверные роуты, CMS, блог.
```

## Приложение B. Референсы (что смотреть)

### Метафора рабочего стола / macOS в вебе

- **macOS Web — Renato Corali** — `macos.now.sh` (`github.com/Renovamen/playground-macos`).
- **daedalOS — Dustin Brett** — `dustinbrett.com` — полноценная десктоп-ОС в браузере.
- **stephband «macOS» clone**, **Vincent Will «Mac OS» portfolio**.
- **Panic — Nova / Playdate** сайты (`panic.com`) — «оконная» подача.
- **Poolside.fm** — ретро-ОС интерфейс с настроением.

### Scroll-scrub / кинематографичный сторителлинг

- **Apple** — страницы AirPods Pro, MacBook Pro, iPhone, «Mac mini» — эталон
  scroll-scrubbed видео и pin-секций.
- **Lusion** (`lusion.co`), **Active Theory** (`activetheory.net`),
  **Locomotive** (`locomotive.ca`).
- **Igloo Inc** (`igloo.inc`), **Rebank**, **Obys Agency**.
- **Cassie Evans** (`cassie.codes`) — SVG + scroll-анимации, разборы.
- **Codrops** (`tympanus.net/codrops`) — туториалы «на scroll reveal»,
  «image to canvas sequence».

### Портфолио-вдохновение

- **Bruno Simon** (`bruno-simon.com`) — 3D-портфолио, планка вау.
- **Rauno Freiberg** (`rauno.me`), **Paco Coursey** (`paco.me`),
  **Emil Kowalski** (`emilkowal.ski`) — вкус к деталям/интеракциям, glass UI.
- **Lynn Fisher** (`lynnandtonic.com`) — адаптив как арт.
- **Josh Comeau** (`joshwcomeau.com`) — анимации + доступность.

### Галереи для поиска ещё

- **Awwwards** (`awwwards.com`), **Godly** (`godly.website`),
  **Httpster** (`httpster.net`), **Land-book** (`land-book.com`),
  **SiteInspire** (`siteinspire.com`), **Minimal Gallery**.
- Тег-поиски: «macOS», «operating system», «scroll storytelling»,
  «glassmorphism», «portfolio».

### Техника (референс-чтение для реализации)

- GSAP ScrollTrigger docs — рецепты `pin` + `scrub`.
- «Animating a canvas with scroll» / Apple AirPods teardown-статьи
  (поиск: «apple airpods scroll animation canvas sequence tutorial»).
- Nuxt i18n SEO guide, Nuxt `nuxt-og-image`, `@nuxt/content` v3 collections.

## Приложение C. Промты для генерации визуала / ассетов

> Модель под задачу: подбирать через `models_explore`; для видео —
> `get_workflow_instructions`. Ниже — заготовки промтов.

### C1. Ключевая картинка героя (до превращения в ноутбук)

```
A single hero product shot: a closed matte-space-grey aluminium laptop
floating on a soft graphite-to-deep-blue gradient background, subtle studio
rim light, gentle contact shadow, faint volumetric haze, centered, lots of
negative space above for a headline, 3/4 top-down angle, photoreal, 8k,
cinematic, calm premium mood. No text, no logos.
```

### C2. Кадры трансформации (картинка → раскрывающийся ноутбук)

```
Product animation keyframes, same matte-space-grey laptop, seamless loop from
FULLY CLOSED to SCREEN OPEN AT ~110°, camera slowly pushing in toward the
screen, identical lighting and background across frames (graphite-to-deep-blue
gradient), screen emits a soft neutral glow when open, no reflections that
break continuity, photoreal, consistent framing, 150 frames, 30fps feel.
```

(В `generate_video` — короткий клип «closed → open + push-in», затем нарезать
скриптом в WebP-кадры.)

### C3. Обои рабочего стола (2 варианта под тему)

```
macOS-style abstract wallpaper, smooth flowing gradient ribbons, deep blue /
violet / teal, soft grain, subtle depth, no subject, no text, 5120x2880,
elegant and minimal. Variant A: dark. Variant B: light airy pastel.
```

### C4. OG-картинка (шаблон, потом заменит nuxt-og-image)

```
Open Graph card, 1200x630, left: large clean sans-serif name and one-line role,
right: minimal 3/4 render of an open space-grey laptop showing a tiny desktop
UI, graphite gradient background, generous margins, high contrast, no clutter.
```

### C5. Иконки Dock (единый набор)

```
Set of 6 squircle app icons, macOS Big Sur style, consistent 2.5D depth, soft
inner shadow, vibrant but harmonious palette, each representing: profile/about,
folder/projects, timeline/experience, envelope/contact, github mark, document/CV.
Flat background, 512x512 each, cohesive family.
```

### C6. Промт-подсказки для дизайна страницы (в Claude/v0/Cursor)

```
Build a one-page Nuxt 4 portfolio with a macOS-desktop metaphor.
- Scroll-scrubbed intro: sticky stage, canvas image sequence, phases
  (headline → laptop unfolds → push into screen → cross-fade to desktop).
- After "boot": top menu bar + bottom Dock (magnify on hover) + one draggable
  glass window; Dock/menu open sections as windows, deep-linked via URL hash.
- Mobile / prefers-reduced-motion: no scrub, no windows — plain stacked
  sections with a sticky header. Same H1 and content in both modes
  (content-first DOM for SEO).
- Tailwind v4 CSS-first, glassmorphism tokens, respect reduced-motion in every
  animation. i18n RU(default)/EN via @nuxtjs/i18n prefix_except_default.
```
