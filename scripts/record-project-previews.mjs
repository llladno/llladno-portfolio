#!/usr/bin/env node
/*
 * Records short looping preview videos of the live project sites for the
 * projects Finder (see docs/superpowers/specs/2026-09-01-portfolio-projects-finder-design.md).
 *
 * Not a Playwright test — a plain Node script. Launches Chromium, drives a
 * brisk scroll pass per site, lets Playwright record a .webm, then shells out
 * to ffmpeg to produce the .mp4 / .webm / .jpg (each capped at 15s) the app
 * actually serves from public/projects/.
 *
 * Usage:
 *   pnpm record:previews            # all targets
 *   pnpm record:previews lume-store # one target, by slug
 */
import { chromium } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync, existsSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const VIEWPORT = { width: 1280, height: 800 }
const DEVICE_SCALE_FACTOR = 2
const OUTPUT_FPS = 30
const OUTPUT_MAX_WIDTH = 1280
const H264_CRF = 30
const WEBM_CRF = 34
const JPEG_QUALITY = 3
/* Just past first paint but still on the hero (the plan holds ~0.5s before the
 * first scroll) — a real, representative frame, not a blank first one. */
const POSTER_AT_SECONDS = 1.2
/* Hard cap — the plan aims lower, but a busy page's rAF throttling stretches
 * real capture time, so clamp every output to a uniform ceiling. */
const MAX_DURATION_SECONDS = 15

const SCRIPT_DIR = fileURLToPath(new URL('.', import.meta.url))
const REPO_ROOT = join(SCRIPT_DIR, '..')
const OUTPUT_DIR = join(REPO_ROOT, 'public', 'projects')

/**
 * @typedef {
 *   { scrollToFraction: number, overMs: number } |
 *   { scrollTo: number, overMs: number } |
 *   { waitMs: number }
 * } Step
 */

/**
 * A brisk pass over a page: quick scrolls (short `overMs`) separated by short
 * holds, walking the scroll fraction 0 → 1 → back to 0. `scrollToFraction` is
 * resolved against each page's own scrollable height, so the same rhythm works
 * regardless of how tall a given site is. Nominal runtime ~10s — it comes out
 * longer on animation-heavy pages (rAF contention) and is then clamped to
 * MAX_DURATION_SECONDS on encode.
 *
 * @type {Step[]}
 */
const BRISK_PLAN = [
  { waitMs: 500 },
  { scrollToFraction: 0.18, overMs: 950 },
  { waitMs: 300 },
  { scrollToFraction: 0.38, overMs: 950 },
  { waitMs: 300 },
  { scrollToFraction: 0.58, overMs: 950 },
  { waitMs: 300 },
  { scrollToFraction: 0.78, overMs: 1000 },
  { waitMs: 300 },
  { scrollToFraction: 1, overMs: 1000 },
  { waitMs: 450 },
  { scrollToFraction: 0, overMs: 1500 },
  { waitMs: 900 },
]

/** @type {{ slug: string, url: string, plan: Step[] }[]} */
const TARGETS = [
  {
    slug: 'lume-store',
    url: 'https://lume-clothes.vercel.app/',
    plan: BRISK_PLAN,
  },
  {
    slug: 'sillage-landing',
    url: 'https://sillage.mansurov.workers.dev/ru/',
    plan: BRISK_PLAN,
  },
  {
    slug: 'followpulse',
    url: 'https://followpulse.com/',
    plan: BRISK_PLAN,
  },
  {
    slug: 'electron-launcher',
    url: 'https://ntw.graphics/',
    plan: BRISK_PLAN,
  },
]

/*
 * Smoothly scrolls the page to an absolute Y or a fraction of its scroll
 * range, over `overMs`. The whole animation runs INSIDE the page on its own
 * requestAnimationFrame loop, driven by one evaluate() call — not one
 * Node↔page round trip per frame. A busy/animated site (charts, video,
 * particles) competing for the main thread otherwise stalls each of those
 * round trips, and with ~60 frames per second-long scroll that overhead
 * compounds into a wildly inflated real-world duration (a `followpulse` test
 * run once came back at 143s for a "15s" plan). One call per step keeps the
 * actual recording length close to the plan regardless of page weight.
 */
const runScrollStep = (page, step) =>
  page.evaluate(
    ({ mode, value, overMs }) => {
      const startY = window.scrollY
      const endY =
        mode === 'fraction'
          ? value * (document.documentElement.scrollHeight - window.innerHeight)
          : value
      const ease = (progress) =>
        progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2

      return new Promise((resolve) => {
        const startTime = performance.now()
        const tick = (now) => {
          const progress = Math.min(1, (now - startTime) / overMs)
          window.scrollTo(0, startY + (endY - startY) * ease(progress))
          if (progress < 1) requestAnimationFrame(tick)
          else resolve(undefined)
        }
        requestAnimationFrame(tick)
      })
    },
    'scrollToFraction' in step
      ? { mode: 'fraction', value: step.scrollToFraction, overMs: step.overMs }
      : { mode: 'absolute', value: step.scrollTo, overMs: step.overMs },
  )

const runPlan = async (page, plan) => {
  for (const step of plan) {
    if ('waitMs' in step) {
      await page.waitForTimeout(step.waitMs)
    } else {
      await runScrollStep(page, step)
    }
  }
}

const findRecordedWebm = (dir) => {
  const match = readdirSync(dir).find((entry) => entry.endsWith('.webm'))
  if (!match) throw new Error(`no .webm recorded in ${dir}`)
  return join(dir, match)
}

const recordTarget = async ({ slug, url, plan }) => {
  const recordDir = mkdtempSync(join(tmpdir(), `preview-${slug}-`))
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
      colorScheme: 'dark',
      recordVideo: { dir: recordDir, size: VIEWPORT },
    })
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle' })
    await runPlan(page, plan)
    await context.close()
  } finally {
    await browser.close()
  }
  return findRecordedWebm(recordDir)
}

const runFfmpeg = (args) => execFileSync('ffmpeg', ['-y', ...args], { stdio: 'inherit' })

const encodeOutputs = (webmPath, slug) => {
  const mp4Path = join(OUTPUT_DIR, `${slug}.mp4`)
  const webmOutPath = join(OUTPUT_DIR, `${slug}.webm`)
  const posterPath = join(OUTPUT_DIR, `${slug}.jpg`)
  const scaleFilter = `scale='min(${OUTPUT_MAX_WIDTH},iw)':-2`

  runFfmpeg([
    '-i',
    webmPath,
    '-t',
    String(MAX_DURATION_SECONDS),
    '-vf',
    scaleFilter,
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
    webmPath,
    '-t',
    String(MAX_DURATION_SECONDS),
    '-vf',
    scaleFilter,
    '-r',
    String(OUTPUT_FPS),
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '0',
    '-crf',
    String(WEBM_CRF),
    '-an',
    webmOutPath,
  ])

  runFfmpeg([
    '-ss',
    String(POSTER_AT_SECONDS),
    '-i',
    webmPath,
    '-frames:v',
    '1',
    '-update',
    '1',
    '-q:v',
    String(JPEG_QUALITY),
    posterPath,
  ])
}

const main = async () => {
  const requestedSlug = process.argv[2]
  const targets = requestedSlug
    ? TARGETS.filter((target) => target.slug === requestedSlug)
    : TARGETS

  if (targets.length === 0) {
    console.error(`No target matches slug "${requestedSlug}".`)
    process.exitCode = 1
    return
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })

  for (const target of targets) {
    console.log(`▶ recording ${target.slug} (${target.url})…`)
    const webmPath = await recordTarget(target)
    console.log(`  encoding outputs for ${target.slug}…`)
    encodeOutputs(webmPath, target.slug)
    rmSync(webmPath, { force: true })
    console.log(`✓ ${target.slug} → public/projects/${target.slug}.{mp4,webm,jpg}`)
  }
}

await main()
