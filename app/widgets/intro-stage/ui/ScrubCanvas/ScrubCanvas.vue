<script setup lang="ts">
/*
 * Draws a pre-rendered image sequence to a canvas based on `progress` (0–1).
 * Knows nothing about scroll — the stage owns that. Frames are lazily preloaded
 * once `active` becomes true (the stage flips it on viewport entry).
 */
import { clamp } from '~/shared/lib'
import { DEFAULT_PIXEL_RATIO } from '~/widgets/intro-stage/model/constants'

const props = defineProps<{
  frameSources: string[]
  progress: number
  active: boolean
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const frames = ref<HTMLImageElement[]>([])
const isReady = ref(false)

const drawCurrentFrame = () => {
  const canvas = canvasEl.value
  if (!canvas || !isReady.value || frames.value.length === 0) return

  const context = canvas.getContext('2d')
  if (!context) return

  const lastFrameIndex = frames.value.length - 1
  const frameIndex = clamp(Math.round(props.progress * lastFrameIndex), 0, lastFrameIndex)
  const frame = frames.value[frameIndex]
  if (!frame) return

  const pixelRatio = window.devicePixelRatio || DEFAULT_PIXEL_RATIO
  canvas.width = canvas.clientWidth * pixelRatio
  canvas.height = canvas.clientHeight * pixelRatio
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(frame, 0, 0, canvas.width, canvas.height)
}

const preloadFrames = () => {
  let loadedCount = 0
  frames.value = props.frameSources.map((source) => {
    const image = new Image()
    image.src = source
    image.onload = () => {
      loadedCount += 1
      if (loadedCount >= props.frameSources.length) {
        isReady.value = true
        drawCurrentFrame()
      }
    }
    return image
  })
}

watch(
  () => props.active,
  (isActive) => {
    if (isActive && frames.value.length === 0) preloadFrames()
  },
)
watch(() => props.progress, drawCurrentFrame)
onMounted(() => {
  if (props.active) preloadFrames()
})
</script>

<template>
  <canvas ref="canvasEl" class="size-full" :data-ready="isReady" aria-hidden="true" />
</template>
