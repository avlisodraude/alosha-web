// Build guard: every blog post must ship a matching per-post OG image.
//
// app/pages/blog/[slug].vue sets og:image to `/og-blog-<slug>.png` with NO
// fallback, so a post without its image gets a share card pointing at a 404.
// This script fails the build before that can ship. Zero dependencies — runs on
// plain Node, same pattern as gen-sitemap.mjs / gen-rss.mjs. Wired into `build`
// and available standalone via `pnpm check:og`.
//
// Orphan images (a PNG with no matching post) are reported as a warning only —
// they don't break anything, but they're worth cleaning up.
import { readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const blogDir = fileURLToPath(new URL('../content/blog', import.meta.url))
const publicDir = fileURLToPath(new URL('../public', import.meta.url))

const slugs = readdirSync(blogDir)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace(/\.md$/, ''))

const missing = slugs.filter(slug => !existsSync(`${publicDir}/og-blog-${slug}.png`))

// Orphans: og-blog-*.png files (excluding the generic og-blog.png) with no post.
const expected = new Set(slugs.map(s => `og-blog-${s}.png`))
const orphans = readdirSync(publicDir)
  .filter(f => /^og-blog-.+\.png$/.test(f) && f !== 'og-blog.png')
  .filter(f => !expected.has(f))

if (orphans.length) {
  console.warn(`⚠ orphan OG images (no matching post): ${orphans.join(', ')}`)
}

if (missing.length) {
  console.error('✖ Missing per-post OG images for:')
  for (const slug of missing) {
    console.error(`    ${slug}  →  expected public/og-blog-${slug}.png`)
  }
  console.error('\nGenerate the image (brand gradient template) before building, '
    + 'or the post\'s share card will 404.')
  process.exit(1)
}

console.log(`og-images ok — ${slugs.length} posts, all have a matching og-blog-<slug>.png`)
