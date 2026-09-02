#!/usr/bin/env node
/*
 * Converts hand-recorded screen captures dropped into public/projects/ as
 * `<slug>.mov` into the `<slug>.{webm,mp4,jpg}` trio the projects Finder serves
 * (same encoder settings as scripts/record-project-previews.mjs). Deletes the
 * source `.mov` afterwards — those must never ship (they are 60–130 MB each).
 *
 * Not a Playwright test, not run in CI — a one-off content step. The `.mov`
 * files are the input; the committed outputs are `public/projects/<slug>.*`.
 *
 * Usage:
 *   pnpm convert:previews             # every public/projects/*.mov
 *   pnpm convert:previews lume-store  # one slug
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, rmSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUTPUT_FPS = 30
const OUTPUT_MAX_WIDTH = 1280
const H264_CRF = 30
const WEBM_CRF = 34
const JPEG_QUALITY = 3
const POSTER_AT_SECONDS = 1.2

const SCRIPT_DIR = fileURLToPath(new URL('.', import.meta.url))
const PROJECTS_DIR = join(SCRIPT_DIR, '..', 'public', 'projects')
const SCALE_FILTER = `scale='min(${OUTPUT_MAX_WIDTH},iw)':-2`

const runFfmpeg = (args) => execFileSync('ffmpeg', ['-y', ...args], { stdio: 'inherit' })

const convert = (slug) => {
  const source = join(PROJECTS_DIR, `${slug}.mov`)
  const mp4Path = join(PROJECTS_DIR, `${slug}.mp4`)
  const webmPath = join(PROJECTS_DIR, `${slug}.webm`)
  const posterPath = join(PROJECTS_DIR, `${slug}.jpg`)

  runFfmpeg([
    '-i',
    source,
    '-vf',
    SCALE_FILTER,
    '-r',
    String(OUTPUT_FPS),
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    String(H264_CRF),
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-an',
    mp4Path,
  ])

  runFfmpeg([
    '-i',
    source,
    '-vf',
    SCALE_FILTER,
    '-r',
    String(OUTPUT_FPS),
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '0',
    '-crf',
    String(WEBM_CRF),
    '-an',
    webmPath,
  ])

  // Poster comes off the already-scaled mp4, so it inherits the 1280-wide size.
  runFfmpeg([
    '-ss',
    String(POSTER_AT_SECONDS),
    '-i',
    mp4Path,
    '-frames:v',
    '1',
    '-update',
    '1',
    '-q:v',
    String(JPEG_QUALITY),
    posterPath,
  ])

  rmSync(source, { force: true })
  console.log(`✓ ${slug} → public/projects/${slug}.{mp4,webm,jpg} (removed ${slug}.mov)`)
}

const requested = process.argv.slice(2)
const slugs = requested.length
  ? requested
  : readdirSync(PROJECTS_DIR)
      .filter((entry) => entry.endsWith('.mov'))
      .map((entry) => basename(entry, '.mov'))

if (!slugs.length) {
  console.log('No public/projects/*.mov to convert.')
  process.exit(0)
}

for (const slug of slugs) convert(slug)
