<script setup lang="ts">
/*
 * Stat callouts over the hero photo. Each one appears on its own — in its own
 * corner of the frame — counts up, holds, then drifts up and fades away over an
 * unhurried window before the next arrives. Purely a function of overall
 * `progress`; nothing tracks the scroll except that exit.
 */
import { clamp, easeOutCubic } from '~/shared/lib'
import {
  INTRO_STATS_ENTER_START,
  INTRO_STAT_ACTIVE_MIN,
  INTRO_STAT_DRIFT_PX,
  INTRO_STAT_ENTER_RISE_PX,
  INTRO_STAT_EXIT_END,
  INTRO_STAT_EXIT_START,
  INTRO_STAT_FADE_IN,
  INTRO_STAT_SPAN,
  INTRO_STAT_STEP,
} from '~/widgets/intro-stage/model/constants'
import { INTRO_STATS, STAT_ANCHORS } from '~/widgets/intro-stage/ui/IntroStats/constants'
import IntroStat from '~/widgets/intro-stage/ui/IntroStats/IntroStat.vue'

const props = defineProps<{ progress: number }>()

const { t } = useI18n()

const PROGRESS_MIN = 0
const PROGRESS_MAX = 1

const stats = computed(() =>
  INTRO_STATS.map((stat, index) => {
    const start = INTRO_STATS_ENTER_START + index * INTRO_STAT_STEP
    const local = clamp(
      (props.progress - start) / INTRO_STAT_SPAN,
      PROGRESS_MIN,
      PROGRESS_MAX,
    )
    const enter = easeOutCubic(
      clamp(local / INTRO_STAT_FADE_IN, PROGRESS_MIN, PROGRESS_MAX),
    )
    const exit = clamp(
      (local - INTRO_STAT_EXIT_START) / (INTRO_STAT_EXIT_END - INTRO_STAT_EXIT_START),
      PROGRESS_MIN,
      PROGRESS_MAX,
    )
    return {
      key: stat.labelKey,
      target: stat.value,
      suffix: stat.suffix,
      label: t(stat.labelKey),
      anchor: STAT_ANCHORS[index] ?? STAT_ANCHORS[0] ?? '',
      active: local > INTRO_STAT_ACTIVE_MIN && local < PROGRESS_MAX,
      opacity: enter * (1 - exit),
      liftPx: INTRO_STAT_ENTER_RISE_PX * (1 - enter) - INTRO_STAT_DRIFT_PX * exit ** 2,
    }
  }),
)
</script>

<template>
  <IntroStat
    v-for="stat in stats"
    :key="stat.key"
    :target="stat.target"
    :suffix="stat.suffix"
    :label="stat.label"
    :anchor="stat.anchor"
    :active="stat.active"
    :opacity="stat.opacity"
    :lift-px="stat.liftPx"
  />
</template>
