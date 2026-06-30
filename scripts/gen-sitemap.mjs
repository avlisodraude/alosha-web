// Regenerates public/sitemap.xml from the content folder. Zero dependencies —
// runs on plain Node. Wired into `build` so every deploy ships a fresh sitemap,
// and available standalone via `pnpm gen:sitemap`.
//
// Add a new blog post and the sitemap picks it up automatically; no manual edit.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const HUB = 'https://alosha.dev'

// Static hub pages: [path, changefreq, priority]
const hubPages = [
  ['/', 'weekly', '1.0'],
  ['/products', 'weekly', '0.9'],
  ['/open-source', 'weekly', '0.8'],
  ['/blog', 'weekly', '0.8'],
  ['/demo', 'monthly', '0.7'],
  ['/about', 'monthly', '0.6'],
  ['/contact', 'monthly', '0.5'],
  ['/privacy', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3']
]

// Product subdomains: [absolute-url, changefreq, priority]
// Each product's own /demo is the highest-intent SEO page in the portfolio —
// it's the actual free tool, not a marketing page about the tool — so it
// must be listed per subdomain, not just once via the hub's /demo.
const subdomains = [
  ['https://pixsqueeze.alosha.dev/', 'weekly', '0.9'],
  ['https://pixsqueeze.alosha.dev/docs', 'weekly', '0.8'],
  ['https://pixsqueeze.alosha.dev/demo', 'weekly', '0.8'],
  ['https://monitor.alosha.dev/', 'weekly', '0.8'],
  ['https://monitor.alosha.dev/demo', 'weekly', '0.7'],
  ['https://stride.alosha.dev/', 'weekly', '0.8'],
  ['https://stride.alosha.dev/demo', 'weekly', '0.7'],
  ['https://eu-validate.alosha.dev/', 'weekly', '0.8'],
  ['https://eu-validate.alosha.dev/demo', 'weekly', '0.7']
]

const blogDir = fileURLToPath(new URL('../content/blog', import.meta.url))
const outPath = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))

function frontmatterDate(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return null
  const d = m[1].match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)
  return d ? d[1] : null
}

const posts = readdirSync(blogDir)
  .filter(f => f.endsWith('.md'))
  .map((f) => {
    const slug = f.replace(/\.md$/, '')
    const date = frontmatterDate(readFileSync(`${blogDir}/${f}`, 'utf8'))
    return { slug, date }
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

function urlEntry({ loc, changefreq, priority, lastmod }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>'
  ].filter(Boolean).join('\n')
}

const entries = [
  ...hubPages.map(([p, changefreq, priority]) => urlEntry({ loc: `${HUB}${p}`, changefreq, priority })),
  ...posts.map(({ slug, date }) => urlEntry({ loc: `${HUB}/blog/${slug}`, changefreq: 'monthly', priority: '0.6', lastmod: date })),
  ...subdomains.map(([loc, changefreq, priority]) => urlEntry({ loc, changefreq, priority }))
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

writeFileSync(outPath, xml)
console.log(`sitemap.xml written — ${hubPages.length} hub pages, ${posts.length} blog posts, ${subdomains.length} subdomains`)
