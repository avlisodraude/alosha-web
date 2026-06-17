/**
 * SEO helpers shared across the app.
 *
 * useCanonical()  — emits <link rel="canonical"> for the current URL. Called once
 *                   per layout so every page gets a self-referential canonical on
 *                   whichever domain it's served from.
 * useJsonLd(data) — emits a <script type="application/ld+json"> block. Safe to call
 *                   multiple times per page (layout Organization + page schema).
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
