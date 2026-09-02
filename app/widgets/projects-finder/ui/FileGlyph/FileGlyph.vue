<script setup lang="ts">
/*
 * The page-with-folded-corner glyph a Finder tile / inspector shows when a
 * project has no video or image preview. Size and colour come from the parent
 * (`class="size-8 text-faint"`); `withLines` adds the "text" detail for the
 * larger inspector rendering.
 */
withDefaults(defineProps<{ withLines?: boolean }>(), { withLines: false })
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-width="1.25"
  >
    <path
      d="M6 3.75A1.75 1.75 0 0 0 4.25 5.5v13A1.75 1.75 0 0 0 6 20.25h12a1.75 1.75 0 0 0 1.75-1.75V9.06a1.75 1.75 0 0 0-.51-1.24l-3.56-3.56a1.75 1.75 0 0 0-1.24-.51H6Z"
      stroke-linejoin="round"
    />
    <path d="M14 3.75V8a1 1 0 0 0 1 1h4.25" stroke-linejoin="round" />
    <path v-if="withLines" d="M8 13h8M8 16.5h5" stroke-linecap="round" />
  </svg>
</template>
