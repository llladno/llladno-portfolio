# Deploy — Cloudflare (Workers Static Assets)

The prerendered site (`nuxt generate` → `.output/public`) ships as a Cloudflare
**Worker with Static Assets** — no server code. Live at
`https://grigory.mansurov.workers.dev`. Config: [`wrangler.jsonc`](./wrangler.jsonc).

Same setup as the SILLAGE repo.

## Setup (once) — connect the repo

Cloudflare dashboard → **Workers & Pages → Create → Import a repository** →
pick `llladno/llladno-portfolio`.

- **Worker name** — set it to **`grigory`** so the URL is
  `grigory.mansurov.workers.dev`. `wrangler.jsonc`'s `name` matches.
- **Build command** — `pnpm generate`.
- **Deploy command** — leave the default `npx wrangler deploy`
  (`npx wrangler versions upload` for non-production branches).
- The API-token prompt ("a new token will be created automatically") — allow it.
- `.node-version` pins Node 22; pnpm is picked up from `pnpm-lock.yaml` +
  `packageManager`.

### Build variables (Settings → Build → Variables and Secrets)

| Name                        | Value                                                       | Why                                                                                                                   |
| --------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `NUXT_PUBLIC_WEB3FORMS_KEY` | the Web3Forms access key for the contact form               | Baked into the client bundle at build time; without it the contact form renders but the submit button stays disabled. |
| `NUXT_PUBLIC_SITE_URL`      | `https://your-domain` _(only after adding a custom domain)_ | Feeds `<link rel="canonical">`, `hreflang`, the sitemap. Defaults to the `workers.dev` URL in `nuxt.config.ts`.       |

**Save and deploy.** First build ~2–3 min. Every push to `main` builds and
deploys after that; other branches get a preview version URL.

### Custom domain

Worker → **Settings → Domains & Routes** → add the domain, then set the
`NUXT_PUBLIC_SITE_URL` build variable above and redeploy.

## Manual deploy (fallback)

```bash
pnpm wrangler login   # one time
pnpm deploy           # nuxt generate → wrangler deploy
```

`pnpm deploy:preview` uploads a preview version (its own URL, not production).
A manual `pnpm generate` needs the env vars locally (`.env` — gitignored).

## Caching

[`public/_headers`](./public/_headers) — honoured by Static Assets — pins a
one-year immutable cache on the content-hashed `/_nuxt/*` and `/_ipx/*` assets,
and a one-day cache on `hero.jpg` / `projects/*` / `resume/*` (stable names,
replaceable on a redeploy). HTML is left uncached so redeploys show immediately.
`not_found_handling: "404-page"` in `wrangler.jsonc` serves the prerendered
`404.html` for unknown paths.

## CI

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs `pnpm lint`,
`pnpm typecheck` and the full Playwright e2e on every push / PR. It does **not**
deploy — Cloudflare's own Git integration (Workers Builds) does that.
