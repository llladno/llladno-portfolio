<script setup lang="ts">
/*
 * Static hero shown when the cinematic boot is skipped: reduced motion, a
 * narrow viewport, or a return visit within the session. Always in the SSR
 * HTML — carries the page's single <h1>.
 */
import { useIdentity } from '~/shared/lib'
import { HERO_IMAGE_SRC } from '~/widgets/intro-stage/ui/HeroLayer/constants'
import { INTRO_STATS } from '~/widgets/intro-stage/ui/IntroStats/constants'

const { t } = useI18n()
const { name, role } = useIdentity()

const hasPhoto = ref(true)
</script>

<template>
  <section
    class="relative flex min-h-dvh flex-col items-center justify-end overflow-hidden pb-[14vh] pt-24"
  >
    <div class="wallpaper-surface absolute inset-0 -z-20" aria-hidden="true" />
    <img
      v-show="hasPhoto"
      :src="HERO_IMAGE_SRC"
      alt=""
      class="absolute inset-0 -z-10 size-full object-cover object-center"
      decoding="async"
      @error="hasPhoto = false"
    />
    <div
      class="absolute inset-0 -z-10"
      style="
        background: linear-gradient(
          to bottom,
          oklch(0 0 0 / 0.55) 0%,
          oklch(0 0 0 / 0.12) 30%,
          oklch(0 0 0 / 0.32) 62%,
          color-mix(in oklab, var(--color-glow-edge) 90%, transparent) 100%
        );
      "
      aria-hidden="true"
    />

    <div class="px-6 text-center">
      <h1
        class="font-display text-5xl font-semibold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-7xl"
      >
        {{ name }}
      </h1>
      <p class="mt-3 text-lg font-medium text-white/70">{{ role }}</p>

      <ul class="mt-8 flex flex-wrap items-start justify-center gap-x-9 gap-y-4">
        <li
          v-for="stat in INTRO_STATS"
          :key="stat.labelKey"
          class="flex flex-col items-center"
        >
          <span
            class="font-display text-4xl font-semibold tabular-nums leading-none text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)] sm:text-5xl"
          >
            {{ stat.value }}{{ stat.suffix }}
          </span>
          <span
            class="mt-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-white/70"
          >
            {{ t(stat.labelKey) }}
          </span>
        </li>
      </ul>

      <a
        href="#about"
        class="mt-8 inline-block rounded-full bg-accent px-6 py-2.5 font-semibold text-accent-contrast transition-transform hover:-translate-y-0.5"
      >
        {{ t('intro.cta') }}
      </a>
    </div>
  </section>
</template>
