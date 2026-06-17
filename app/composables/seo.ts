/**
 * SEO helpers shared across the app.
 *
 * useCanonical()  — emits <link rel="canonical"> for the current URL. Called once
 *                   per layout so every page gets a self-referential canonical on
 *                   whichever domain it's served from.
 * useJsonLd(data) — emits a <script type="application/ld+json"> block. Safe to call
 *                   multiple times per page (layout Organization + page schema).
 * useBreadcrumbs() — emits a BreadcrumbList from an ordered list of crumbs. The
 *                   last crumb is the current page and usually omits `path`.
 */
export function useCanonical(path?: string) {
  const url = useRequestURL()
  const href = `${url.origin}${path ?? url.pathname}`.replace(/\/$/, '') || url.origin
  useHead({
    link: [{ rel: 'canonical', href: href || url.origin }]
  })
}

export function useJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  useHead({
    script: [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify(data)
    }]
  })
}

export function useBreadcrumbs(crumbs: Array<{ name: string, path?: string }>) {
  const hub = 'https://alosha.dev'
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': crumbs.map((c, i) => {
      const item: Record<string, unknown> = {
        '@type': 'ListItem',
        'position': i + 1,
        'name': c.name
      }
      if (c.path) item.item = `${hub}${c.path}`
      return item
    })
  })
}
