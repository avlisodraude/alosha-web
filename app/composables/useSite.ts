export type Site = 'hub' | 'product' | 'monitor'

/**
 * Resolves which site the current request belongs to.
 *
 *   alosha.dev            → 'hub'      (portfolio hub)
 *   pixsqueeze.alosha.dev → 'product'  (PixSqueeze app)
 *   monitor.alosha.dev    → 'monitor'  (Monitor app)
 *
 * SSR-safe: host comes from useRequestURL(), which is populated on both the
 * server and the client. For local dev, set NUXT_PUBLIC_FORCE_SITE=hub|product|monitor.
 */
export function useSite() {
  const config = useRuntimeConfig()
  const url = useRequestURL()
  const host = url.host || ''

  const force = String(config.public.forceSite || '')
  let site: Site
  if (force === 'hub' || force === 'product' || force === 'monitor') {
    site = force
  } else if (host.startsWith('pixsqueeze.')) {
    site = 'product'
  } else if (host.startsWith('monitor.')) {
    site = 'monitor'
  } else {
    site = 'hub'
  }

  return {
    site,
    isHub: site === 'hub',
    isProduct: site === 'product',
    isMonitor: site === 'monitor',
    host,
    isProdHost: host.endsWith('alosha.dev'),
    hubUrl: String(config.public.hubUrl),
    productUrl: String(config.public.productUrl),
    monitorUrl: String(config.public.monitorUrl)
  }
}
