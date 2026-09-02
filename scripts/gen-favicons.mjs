#!/usr/bin/env node
/*
 * Rasterises public/favicon.svg into the PNG / ICO set the app links from
 * nuxt.config.ts. Uses headless Chromium (already a dev dep via Playwright) so
 * there is no extra image tooling to install. Not run in CI — a one-off content
 * step; the outputs are committed. Re-run after editing favicon.svg.
 *
 *   pnpm gen:favicons
 */
import { chromium } from '@playwright/test'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ICO_HEADER_BYTES = 6
const ICO_ENTRY_BYTES = 16
const ICO_SIZE_PX = 32
const ICO_BIT_DEPTH = 32

const PUBLIC_DIR = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public')
const svg = readFileSync(join(PUBLIC_DIR, 'favicon.svg'), 'utf8')

const OUTPUTS = [
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
]

/** Wrap a PNG buffer in a single-image ICO container (PNG-compressed entry). */
const pngToIco = (png) => {
  const header = Buffer.alloc(ICO_HEADER_BYTES)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(1, 4) // image count

  const entry = Buffer.alloc(ICO_ENTRY_BYTES)
  entry.writeUInt8(ICO_SIZE_PX, 0)
  entry.writeUInt8(ICO_SIZE_PX, 1)
  entry.writeUInt16LE(1, 4) // colour planes
  entry.writeUInt16LE(ICO_BIT_DEPTH, 6)
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(ICO_HEADER_BYTES + ICO_ENTRY_BYTES, 12)

  return Buffer.concat([header, entry, png])
}

const browser = await chromium.launch()
const renderPng = async (size) => {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  })
  await page.setContent(
    `<!doctype html><style>*{margin:0}html,body{width:${size}px;height:${size}px}` +
      `svg{display:block;width:100%;height:100%}</style>${svg}`,
    { waitUntil: 'load' },
  )
  const buffer = await page.screenshot({ omitBackground: true })
  await page.close()
  return buffer
}

const write = (name, buffer) => {
  writeFileSync(join(PUBLIC_DIR, name), buffer)
  console.log(`✓ public/${name} (${buffer.length} bytes)`)
}

for (const { name, size } of OUTPUTS) write(name, await renderPng(size))
write('favicon.ico', pngToIco(await renderPng(ICO_SIZE_PX)))

await browser.close()
