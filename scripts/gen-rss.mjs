// Regenerates public/rss.xml from the content/blog folder. Zero dependencies —
// runs on plain Node, same pattern as gen-sitemap.mjs. Wired into `build` so every
// deploy ships a fresh feed, and available standalone via `pnpm gen:rss`.
//
// Add a new blog post and the feed picks it up automatically; no manual edit.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const HUB = 'https://alosha.dev'
const FEED_TITLE = 'Alosha — Blog'
const FEED_DESC = 'Notes on building privacy-first developer tools, from the Alosha studio.'
const FEED_PATH = '/rss.xml'

const blogDir = fileURLToPath(new URL('../content/blog', import.meta.url))
const outPath = fileURLToPath(new URL('../public/rss.xml', import.meta.url))

// Minimal frontmatter reader — pulls the scalar fields we need from the leading
// `---` block. Handles optional single/double quotes around values.
function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const fields = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) continue
    let value = kv[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
      value = value.slice(1, -1)
    }
    fields[kv[1]] = value
  }
  return fields
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// YYYY-MM-DD -> RFC-822 date (RSS pubDate format), pinned to UTC.
function rfc822(date) {
  if (!date) return null
  const d = new Date(`${date}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? null : d.toUTCString()
}

const posts = readdirSync(blogDir)
  .filter(f => f.endsWith('.md'))
  .map((f) => {
    const slug = f.replace(/\.md$/, '')
    return { slug, ...parseFrontmatter(readFileSync(`${blogDir}/${f}`, 'utf8')) }
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

const items = posts.map((p) => {
  const link = `${HUB}/blog/${p.slug}`
  const pubDate = rfc822(p.date)
  return [
    '    <item>',
    `      <title>${escapeXml(p.title || p.slug)}</title>`,
    `      <link>${link}</link>`,
    `      <guid isPermaLink="true">${link}</guid>`,
    p.description ? `      <description>${escapeXml(p.description)}</description>` : null,
    p.author ? `      <dc:creator>${escapeXml(p.author)}</dc:creator>` : null,
    pubDate ? `      <pubDate>${pubDate}</pubDate>` : null,
    '    </item>'
  ].filter(Boolean).join('\n')
}).join('\n')

// lastBuildDate tracks the newest post so readers know when the feed changed.
const lastBuildDate = rfc822(posts[0]?.date) || new Date().toUTCString()

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${HUB}/blog</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${HUB}${FEED_PATH}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

writeFileSync(outPath, xml)
console.log(`rss.xml written — ${posts.length} blog posts`)
