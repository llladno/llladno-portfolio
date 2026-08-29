<script setup lang="ts">
import type { Locale } from '~/shared/config/i18n'
import {
  INTRO_COPY_FADE_SPEED,
  INTRO_COPY_LIFT_PX,
} from '~/widgets/intro-stage/model/constants'

const props = defineProps<{ progress: number }>()

const appConfig = useAppConfig()
const { locale, t } = useI18n()

const role = computed(
  () => appConfig.identity.role[locale.value as Locale] ?? appConfig.identity.role.en,
)
const opacity = computed(() => Math.max(0, 1 - props.progress * INTRO_COPY_FADE_SPEED))
const liftPx = computed(() => -props.progress * INTRO_COPY_LIFT_PX)
</script>

<template>
  <div
    class="pointer-events-none absolute inset-x-0 top-[12%] text-center"
    :style="{ opacity, transform: `translateY(${liftPx}px)` }"
  >
    <h1 class="text-4xl font-bold sm:text-6xl">{{ appConfig.identity.name }}</h1>
    <p class="mt-2 text-muted">{{ role }}</p>
    <p class="mt-6 text-xs uppercase tracking-widest text-muted">
      {{ t('intro.scrollHint') }}
    </p>
  </div>
</template>
