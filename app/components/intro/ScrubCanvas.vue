<script setup lang="ts">
/*
 * Draws a pre-rendered image sequence to a canvas based on `progress` (0–1).
 * Knows nothing about scroll — the parent stage owns that. Frames are lazily
 * preloaded once `active` becomes true (parent flips it on viewport entry).
 */
const props = defineProps<{
  frames: string[]
  progress: number
  active: boolean
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const images = ref<HTMLImageElement[]>([])
const ready = ref(false)

const draw = () => {
  const el = canvas.value
  if (!el || !ready.value || images.value.length === 0) return
  const ctx = el.getContext('2d')
  if (!ctx) return
  const idx = Math.min(
    images.value.length - 1,
    Math.max(0, Math.round(props.progress * (images.value.length - 1))),
  )
  const img = images.value[idx]
  if (!img) return
  const dpr = window.devicePixelRatio || 1
  el.width = el.clientWidth * dpr
  el.height = el.clientHeight * dpr
  ctx.clearRect(0, 0, el.width, el.height)
  ctx.drawImage(img, 0, 0, el.width, el.height)
}

const preload = () => {
  let loaded = 0
  images.value = props.frames.map((src) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      loaded += 1
      if (loaded >= props.frames.length) {
        ready.value = true
        draw()
      }
    }
    return img
  })
}

watch(
  () => props.active,
  (v) => v && images.value.length === 0 && preload(),
)
watch(() => props.progress, draw)
onMounted(() => props.active && preload())

defineExpose({ ready })
</script>

<template>
  <canvas ref="canvas" class="size-full" :data-ready="ready" aria-hidden="true" />
</template>
