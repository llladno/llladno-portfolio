# Референсы и промты для красивого сайта

Собрано под проект «портфолио с рабочим столом macOS». Дизайн-решения — в
[`docs/superpowers/specs/2026-08-27-portfolio-macos-design.md`](superpowers/specs/2026-08-27-portfolio-macos-design.md)
(приложения B и C там же).

---

## 1. Галереи вдохновения (где искать примеры)

| Сайт | URL | Для чего |
|---|---|---|
| Awwwards | awwwards.com | Топ-крафт, награды, фильтр по технологии (есть тег `nuxt-js`) |
| Godly | godly.website | Отобранные лендинги и порфолио, очень «вкусно» |
| Land-book | land-book.com | Чистая курация полезных, хорошо сделанных сайтов |
| SiteInspire | siteinspire.com | Минимализм, типографика, структура |
| The FWA | thefwa.com | Иммерсивные / экспериментальные проекты |
| CSS Design Awards | cssdesignawards.com | Награды, разбор по критериям |
| Httpster | httpster.net | Смелая типографика, бруталистичный вкус |
| One Page Love | onepagelove.com | **Именно one-page сайты** — прямо ваш формат |
| Lapa Ninja | lapa.ninja | Лендинги по категориям, есть «Portfolio» |
| Minimal Gallery | minimal.gallery | Чистый минимализм |
| Mobbin | mobbin.com | Реальные UI-паттерны (моб + веб), справочник по компонентам |
| Muzli | muz.li | Ежедневная лента вдохновения |
| Dribbble / Behance | dribbble.com, behance.net | Идеи до вёрстки, концепты |

**Тег-поиски на Awwwards/Godly:** `macOS`, `operating system`, `scroll
storytelling`, `glassmorphism`, `portfolio`, `Nuxt.js`, `WebGL`.

---

## 2. Рабочий стол macOS в вебе (живые сайты + опенсорс)

**Живые / известные:**
- `macos.now.sh` — симуляция macOS GUI (React + UnoCSS), исходники:
  `github.com/Renovamen/playground-macos`
- `dustinbrett.com` (**daedalOS**) — полноценная десктоп-ОС в браузере, Finder,
  терминал, окна
- `macosportfolio.netlify.app` — портфолио в стиле macOS (SvelteKit + Tailwind),
  `github.com/ansxuman/macOS-Themed-Portfolio`
- Bruno Simon — `bruno-simon.com` — не macOS, но эталон «портфолио-как-опыт»
- Panic — `panic.com` (Nova, Playdate) — оконная, «приложенческая» подача
- Poolside.fm — ретро-ОС интерфейс с настроением

**Опенсорс-клоны (смотреть код Dock / окон / стекла):**
- `github.com/Renovamen/playground-macos` — React, Redux, Tailwind
- `github.com/ansxuman/macOS-Themed-Portfolio` — SvelteKit, TS
- `github.com/uakbr/macos-portfolio` — React + Redux + Tailwind
- GitHub Topic: `github.com/topics/macos-portfolio`

> Смотрим на: магнификацию Dock, стекло (`backdrop-filter`), traffic-lights,
> драг окна, фокус-менеджмент. Мультиоконность нам НЕ нужна (см. спеку, YAGNI).

---

## 3. Scroll-scrub / Apple-style сторителлинг

**Живые эталоны:**
- Apple — страницы **AirPods Pro**, **MacBook Pro**, **iPhone**, **Mac mini**
  (scroll-scrubbed видео, pin-секции, «въезд» камеры)
- Lusion — `lusion.co`
- Active Theory — `activetheory.net`
- Locomotive — `locomotive.ca`
- Igloo Inc — `igloo.inc`
- Obys Agency — `obys.agency`
- Noomo Agency — `noomoagency.com` (Awwwards «Website of the Year», **на Nuxt 3
  + Three.js + GSAP**)

**Туториалы по нашей технике (canvas image sequence + GSAP ScrollTrigger):**
- GSAP Vault — «Apple-Style Scroll Image Sequences»: `gsapvault.com/blog/scroll-image-sequence-tutorial`
- GreenSock CodePen (helper function): `codepen.io/GreenSock/pen/VwgevYW`
- GitHub пример: `github.com/Baisampayan/gsap-canvas-image-sequence-scroll-animation`
- React + GSAP разбор: `blog.loopspeed.co.uk/scroll-driven-image-sequence-header`
- YouTube: «Apple-Style Image Sequence Animation On Scroll with GSAP»

**Суть техники:** прелоад массива пронумерованных кадров → `gsap.to()` со
`scrub` анимирует объект `{ frame: 0 }` до `frameCount-1` → на каждом `onUpdate`
рисуем нужный кадр в `<canvas>` → контейнер `pin`-ится на время
последовательности.

**GSAP лицензия:** с апреля 2025 GSAP **100% бесплатен**, включая коммерческое
использование и все ранее платные плагины (ScrollTrigger, ScrollSmoother,
SplitText, MorphSVG, DrawSVG) — после покупки Webflow. Ключ/аккаунт не нужен.

---

## 4. Nuxt-специфично

- Nuxt Showcase — `nuxt.com/showcase`
- Nuxt Templates — `nuxt.com/templates`
- Awwwards, фильтр Nuxt — `awwwards.com/websites/nuxt-js/`
- Портфолио-шаблоны на Nuxt 3 + Nuxt Content + Tailwind:
  `github.com/awagen/nuxt-canvas`, `github.com/brendonvz/nuxt-portfolio`
- Модули для нашего кейса: `@nuxt/content` v3 (collections), `@nuxtjs/i18n`
  (SEO guide), `nuxt-og-image`, `@nuxtjs/sitemap`, `@nuxt/image`

---

## 5. Библиотеки промтов для «красивых сайтов»

- **websiteprompts.ai** — 100+ бесплатных промтов под Lovable / Bolt / v0 /
  Claude, по индустриям (есть Portfolio)
- **websiteprompts.com** — библиотека под ChatGPT / Claude / v0 / Cursor / Bolt
- **promptpack.tech** — 75+ промтов под Claude Code / Cursor / v0 / Lovable /
  Bolt, упор на «modern, creative, production-ready»
- **lovableprompts.app** — генератор промтов под Lovable

**Как писать сильный промт (общие правила из этих источников):**
1. Конкретика вместо ярлыков: не «тёмная тема», а «графитовый фон с мягким
   сине-фиолетовым градиентом и неоново-зелёным акцентом».
2. Кто аудитория, что должен делать сайт, как он должен *ощущаться*.
3. Итеративно: сначала каркас, потом отдельными промтами — layout, цвет,
   типографика, анимации.
4. Явно перечислить секции и поведение каждой.
5. Ограничения тоже в промт: «respect prefers-reduced-motion», «content-first
   DOM», «no external animation libs besides GSAP».

---

## 6. Готовый промт под этот проект

Для Claude Code / Cursor / v0 (архитектура — из спеки, это «сжатая» версия):

```
Build a one-page Nuxt 4 + Vue 3 + TypeScript portfolio with a macOS-desktop
metaphor. Tailwind v4 (CSS-first, @theme), @nuxtjs/i18n (prefix_except_default,
default "ru", + "en"), @nuxt/content v3, GSAP + ScrollTrigger. SSG (nuxt
generate).

Intro (desktop only): a sticky "stage" ~350vh tall, pinned via ScrollTrigger.
A canvas plays a pre-rendered WebP image sequence scrubbed by scroll through
4 phases: (1) headline fades in over a hero image, (2) a laptop unfolds from
the image, (3) camera pushes into the laptop screen, (4) cross-fade into a
macOS-style desktop — wallpaper + top menu bar + bottom Dock fade in, pin
releases.

Desktop layer: glassmorphism (backdrop-filter). Top menu bar: name + section
menus + locale switch + theme toggle + live clock. Bottom Dock: section icons
+ external links + resume PDF, magnify-on-hover. One draggable glass window at
a time = the active section; traffic-light close returns home. Sections open
as windows, deep-linked via URL hash (#projects/<slug>).

Mobile / prefers-reduced-motion: NO scrub, NO windows, NO pin. Plain stacked
<section> layout with a sticky header + burger menu. The H1 and all section
content (incl. full project case bodies) must be identical in both modes and
present in the SSG HTML — content-first DOM for SEO.

Constraints: respect prefers-reduced-motion in every animation; native
<button>/<a> for anything clickable, visible focus rings; no animation library
besides GSAP; no data in query params (locale via path); images via <NuxtImg>
with width/height; every UI string in both ru.json and en.json.

SEO: useSeoMeta per locale, i18n auto hreflang/canonical, @nuxtjs/sitemap,
@nuxtjs/robots, nuxt-og-image, JSON-LD Person.

Deliver: project scaffold, both layouts, intro components (IntroStage,
ScrubCanvas, IntroCopy, IntroFallback), OS components (MenuBar, Dock, DockItem,
OsWindow, WindowHost, Wallpaper), composables (useDesktopMode, useIntroState,
useSectionRouter), content schema, Playwright e2e for smoke/i18n/nav/
reduced-motion/seo/a11y.
```

Промты для генерации **картинки героя, кадров трансформации, обоев, OG-карточки
и иконок Dock** — в спеке, Приложение C.

---

## Источники

- [16 Best Web Design Inspiration Sites (2026) — Colorlib](https://colorlib.com/wp/showcase-inspiration-sites-web-design/)
- [13 Best Web Design Inspiration Sites (2026) — aidesigner.ai](https://www.aidesigner.ai/blog/web-design-inspiration)
- [Top Web Design Inspiration & CSS Awards Websites for 2026 — Design Nominees](https://www.designnominees.com/blog/top-web-design-inspiration-css-awards-websites-for-2026)
- [macos-portfolio — GitHub Topics](https://github.com/topics/macos-portfolio)
- [playground-macos — Renovamen (GitHub)](https://github.com/Renovamen/playground-macos)
- [macOS-Themed-Portfolio — ansxuman (GitHub)](https://github.com/ansxuman/macOS-Themed-Portfolio)
- [I Built a macOS-Inspired Portfolio — Medium](https://medium.com/@ansxuman/i-created-a-developer-portfolio-inspired-by-the-macos-interface-271b7f886819)
- [Apple-Style Scroll Image Sequences — GSAP Vault](https://gsapvault.com/blog/scroll-image-sequence-tutorial)
- [Scroll-based image sequence helper — GreenSock CodePen](https://codepen.io/GreenSock/pen/VwgevYW)
- [gsap-canvas-image-sequence-scroll-animation — GitHub](https://github.com/Baisampayan/gsap-canvas-image-sequence-scroll-animation)
- [Scroll-driven image sequence in React with GSAP — Loopspeed](https://blog.loopspeed.co.uk/scroll-driven-image-sequence-header)
- [Webflow makes GSAP 100% free — Webflow Blog](https://webflow.com/blog/gsap-becomes-free)
- [gsap — npm](https://www.npmjs.com/package/gsap)
- [Noomo Agency: Website of the Year on Awwwards (built with Nuxt 3)](https://noomoagency.com/insights/noomo-agency-best-websites-design-on-awwwards)
- [Best Nuxt.js Websites — Awwwards](https://www.awwwards.com/websites/nuxt-js/)
- [Nuxt Showcase](https://nuxt.com/showcase)
- [nuxt-canvas — awagen (GitHub)](https://github.com/awagen/nuxt-canvas)
- [Websiteprompts.ai — Free AI Website Prompts](https://websiteprompts.ai/)
- [Website Prompts for ChatGPT, Claude, v0, Cursor, Bolt](https://websiteprompts.com/)
- [PromptPack — Premium AI Website Prompts](https://promptpack.tech/)
- [How to create a portfolio website using Lovable AI — Codecademy](https://www.codecademy.com/article/lovable-ai-website-builder)
