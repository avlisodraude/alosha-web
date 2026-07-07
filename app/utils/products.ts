/**
 * The Alosha product registry — the single source of truth for the portfolio.
 *
 * Adding a new package is a ONE-PLACE change: append an entry here and the hub
 * matrix, /products, /about, the demo hub, the product launcher and the
 * subdomain layout all pick it up automatically. The only per-package files
 * that remain bespoke are the package's own landing + demo components (their
 * selling content legitimately differs) and the `Site` union below.
 *
 * URLs are DERIVED from `slug` (`https://<slug>.alosha.dev`) so new packages
 * never need a runtimeConfig entry.
 */

/** Which site a request resolves to. `hub` is the root domain. */
export type Site = 'hub' | 'product' | 'monitor' | 'stride' | 'eu-validate' | 'vue-select' | 'xlsx'

export type ProductKind = 'package' | 'hosted-api'
export type ProductStatus = 'live' | 'beta' | 'soon'

/** shields.io badge keys supported by ProductBadges. */
export type ProductBadgeKey = 'version' | 'downloads' | 'minzip' | 'types' | 'license'

export interface ProductDef {
  /** useSite() key for this product's subdomain. */
  site: Exclude<Site, 'hub'>
  /** Subdomain label; also drives the derived URL. */
  slug: string
  /** Display name. */
  name: string
  /** Scoped npm package name, e.g. "@alosha/monitor". */
  npmName: string
  /** GitHub repository URL. */
  repo: string
  /** Lucide icon name. */
  icon: string
  /** One-line product blurb for cards and grids. */
  blurb: string
  /** Who it's for — short audience line. */
  audience: string
  /** package = MIT npm library; hosted-api = paid hosted service with OSS core. */
  kind: ProductKind
  status: ProductStatus
  /** Key into the /api/oss-stats response, when live npm stats are wired up. */
  statsKey?: string
}

/** A ProductDef with its derived links resolved. */
export interface ResolvedProduct extends ProductDef {
  /** Product home, e.g. https://monitor.alosha.dev */
  url: string
  /** npm package page. */
  npm: string
}

/** Root domain used to derive subdomain URLs. */
export const ROOT_DOMAIN = 'alosha.dev'

/**
 * The portfolio, in display order. Append new packages here.
 */
export const PRODUCTS: ProductDef[] = [
  {
    site: 'product',
    slug: 'pixsqueeze',
    name: 'PixSqueeze',
    npmName: '@alosha/pixsqueeze',
    repo: 'https://github.com/avlisodraude/pixsqueeze',
    icon: 'i-lucide-image',
    blurb: 'Image compression API with HEIC, TIFF & camera-RAW conversion. Open-source core, hosted batch API.',
    audience: 'For apps handling user image uploads',
    kind: 'hosted-api',
    status: 'live',
    statsKey: 'pixsqueeze'
  },
  {
    site: 'monitor',
    slug: 'monitor',
    name: 'Monitor',
    npmName: '@alosha/monitor',
    repo: 'https://github.com/avlisodraude/monitor',
    icon: 'i-lucide-activity',
    blurb: 'Playwright-based website monitoring — checks, retries, screenshots on failure, and multi-channel alerts.',
    audience: 'For businesses & development teams',
    kind: 'package',
    status: 'live',
    statsKey: 'monitor'
  },
  {
    site: 'stride',
    slug: 'stride',
    name: 'Stride',
    npmName: '@alosha/stride',
    repo: 'https://github.com/avlisodraude/stride',
    icon: 'i-lucide-footprints',
    blurb: 'Parse GPX, TCX and FIT files, compute running metrics, and render Chart.js dashboards — one API for every format.',
    audience: 'For runners, coaches & endurance athletes',
    kind: 'package',
    status: 'live',
    statsKey: 'stride'
  },
  {
    site: 'eu-validate',
    slug: 'eu-validate',
    name: 'eu-validate',
    npmName: '@alosha/eu-validate',
    repo: 'https://github.com/avlisodraude/eu-validate',
    icon: 'i-lucide-badge-check',
    blurb: 'Offline EU identifier validation — checksum-accurate VAT, IBAN, BSN and KvK checks with zero dependencies.',
    audience: 'For EU fintech, billing & compliance',
    kind: 'package',
    status: 'live',
    statsKey: 'euValidate'
  },
  {
    site: 'vue-select',
    slug: 'vue-select',
    name: 'vue-select',
    npmName: '@alosha/vue-select',
    repo: 'https://github.com/avlisodraude/vue-select',
    icon: 'i-lucide-list-filter',
    blurb: 'A maintained Vue 3 fork of the classic select/dropdown/typeahead component — grouped options, full WAI-ARIA accessibility, and native TypeScript types.',
    audience: 'For Vue 3 teams building forms and admin UIs',
    kind: 'package',
    status: 'live',
    statsKey: 'vueSelect'
  },
  {
    site: 'xlsx',
    slug: 'xlsx',
    name: 'Alosha XLSX',
    npmName: '@alosha/xlsx',
    repo: 'https://github.com/avlisodraude/alosha-xlsx',
    icon: 'i-lucide-table',
    blurb: 'Modern TypeScript Excel (.xlsx) reader & writer — ESM-first, ExcelJS-compatible, with a low-memory streaming writer.',
    audience: 'For apps that read & write spreadsheets',
    kind: 'package',
    status: 'live',
    statsKey: 'xlsx'
  }
]

/** Derive a product's subdomain URL from its slug. */
export function productUrl(p: ProductDef): string {
  return `https://${p.slug}.${ROOT_DOMAIN}`
}

/** Derive a product's npm page URL. */
export function npmUrl(p: ProductDef): string {
  return `https://www.npmjs.com/package/${p.npmName}`
}

/** Attach derived links to a product definition. */
export function resolveProduct(p: ProductDef): ResolvedProduct {
  return { ...p, url: productUrl(p), npm: npmUrl(p) }
}

/** The full portfolio with links resolved. */
export function resolvedProducts(): ResolvedProduct[] {
  return PRODUCTS.map(resolveProduct)
}

/** Look up a product by its useSite `site` key. */
export function productForSite(site: Site): ResolvedProduct | null {
  const def = PRODUCTS.find(p => p.site === site)
  return def ? resolveProduct(def) : null
}
