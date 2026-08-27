<script setup lang="ts">
const { t } = useI18n()
const appConfig = useAppConfig()
const { locale } = useI18n()
const role = computed(
  () =>
    appConfig.identity.role[locale.value as 'ru' | 'en'] ?? appConfig.identity.role.en,
)
</script>

<template>
  <section
    class="mx-auto grid min-h-[70dvh] max-w-3xl place-items-center px-6 text-center"
  >
    <div>
      <!--
        Poster is public/intro/poster.webp once scripts/build-intro-frames.mjs
        has run. Until then, a placeholder keeps the layout stable.
      -->
      <div
        class="glass mx-auto grid aspect-[16/10] w-full max-w-[640px] place-items-center rounded-xl text-sm text-[var(--color-muted)]"
      >
        {{ t('intro.posterAlt') }}
      </div>
      <h1 class="mt-8 text-3xl font-bold sm:text-5xl">
        {{ appConfig.identity.name }}
      </h1>
      <p class="mt-2 text-[var(--color-muted)]">{{ role }}</p>
      <a
        href="#about"
        class="mt-6 inline-block rounded-full bg-[var(--color-accent)] px-5 py-2 text-white"
      >
        {{ t('intro.cta') }}
      </a>
    </div>
  </section>
</template>
