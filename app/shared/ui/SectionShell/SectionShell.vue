<script setup lang="ts">
/*
 * The shell every page section shares: the `<section id aria>` landmark plus,
 * inline, a padded block and a heading. (The constrained width + dividers come
 * from the content sheet in `pages/index.vue`.) Inside a window (`inWindow`)
 * the window's title bar is the heading, so only content renders.
 */
defineProps<{ id: string; title: string; inWindow?: boolean }>()
</script>

<template>
  <section
    :id="id"
    :aria-labelledby="inWindow ? undefined : `${id}-heading`"
    :class="inWindow ? '' : 'scroll-mt-24 px-7 py-16 sm:px-10 sm:py-20'"
  >
    <slot v-if="inWindow" />

    <template v-else>
      <h2
        :id="`${id}-heading`"
        class="mb-9 font-display text-[1.75rem] font-semibold tracking-tight text-fg sm:text-4xl"
      >
        {{ title }}
      </h2>
      <slot />
    </template>
  </section>
</template>
