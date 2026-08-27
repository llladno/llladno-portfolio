<script setup lang="ts">
interface Props {
  label: string
  active?: boolean
  href?: string
  external?: boolean
}
defineProps<Props>()
defineEmits<{ activate: [] }>()
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : 'button'"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :aria-current="active ? 'true' : undefined"
    :title="label"
    class="group relative grid size-12 place-items-center rounded-xl transition-transform duration-150 hover:-translate-y-1 hover:scale-110 motion-reduce:transform-none motion-reduce:transition-none"
    @click="!href && $emit('activate')"
  >
    <span class="glass grid size-11 place-items-center rounded-xl text-xs font-medium">
      {{ label.slice(0, 2) }}
    </span>
    <span class="sr-only">{{ label }}</span>
    <span
      v-if="active"
      class="absolute -bottom-1.5 size-1 rounded-full bg-current"
      aria-hidden="true"
    />
  </component>
</template>
