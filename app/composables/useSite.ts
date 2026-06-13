export type Site = 'hub' | 'product'

/**
 * Resolves which of the two sites the current request belongs to.
 *
 *   alosha.dev            → 'hub'      (portfolio hub)
 *   pixsqueeze.alosha.dev → 'product'  (PixSqueeze app)
 *
 * SSR-safe: host comes from useRequestURL(), which is populated on both the
 * server and the client. For local dev, set NUXT_PUBLIC_FORCE_SITE=hub|product.
 */
export function useSite() {
  const config = useRuntimeConfig()
  const url = useRequestURL()
  const host = url.host || ''

  const force = String(config.public.forceSite || '')
  let site: Site
  if (force === 'hub' || force === 'product') {
    site = force
  } else if (host.startsWith('pixsqueeze.')) {
    site = 'product'
  } else {
    site = 'hub'
  }

  return {
    site,
    isHub: site === 'hub',
    isProduct: site === 'product',
    host,
    isProdHost: host.endsWith('alosha.dev'),
    hubUrl: String(config.public.hubUrl),
    productUrl: String(config.public.productUrl)
  }
}
