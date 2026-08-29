#!/usr/bin/env node
/*
 * Slices the raw intro video into a numbered WebP frame sequence for the
 * scroll-scrub canvas. Requires ffmpeg on PATH.
 *
 * Input:  assets-src/intro.mp4  (not tracked in git)
 * Output: public/intro/frames-1280/0001.webp ...  (committed — it's the asset)
 *         public/intro/frames-1920/0001.webp ...
 *         public/intro/poster.webp  (first frame, used as fallback hero)
 *
 * Usage: pnpm intro:frames
 */
import { existsSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const SRC = 'assets-src/intro.mp4'
const FPS = 30
const SIZES = [1280, 1920]

if (!existsSync(SRC)) {
  console.error(`Missing ${SRC}. Put the raw intro video there first.`)
  process.exit(1)
}

for (const widthPx of SIZES) {
  const dir = `public/intro/frames-${widthPx}`
  mkdirSync(dir, { recursive: true })
  console.log(`Encoding ${widthPx}px frames -> ${dir}`)
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      SRC,
      '-vf',
      `fps=${FPS},scale=${widthPx}:-2`,
      '-c:v',
      'libwebp',
      '-quality',
      '78',
      `${dir}/%04d.webp`,
    ],
    { stdio: 'inherit' },
  )
}

mkdirSync('public/intro', { recursive: true })
execFileSync(
  'ffmpeg',
  ['-y', '-i', SRC, '-vf', 'scale=1280:-2', '-frames:v', '1', 'public/intro/poster.webp'],
  { stdio: 'inherit' },
)

console.log('Done. Update FRAME_COUNT in app/components/intro/IntroStage.vue.')
