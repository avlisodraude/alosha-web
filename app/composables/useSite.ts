export type Site = 'hub' | 'product' | 'monitor' | 'stride' | 'eu-validate'

/**
 * Resolves which site the current request belongs to.
 *
 *   alosha.dev              → 'hub'         (portfolio hub)
 *   pixsqueeze.alosha.dev   → 'product'      (PixSqueeze app)
 *   monitor.alosha.dev      → 'monitor'      (Monitor app)
 *   stride.alosha.dev       → 'stride'       (Stride app)
 *   eu-validate.alosha.dev  → 'eu-validate'  (eu-validate package landing)
 *
 * SSR-safe: host comes from useRequestURL(), which is populated on both the
 * server and the client. For local dev, set NUXT_PUBLIC_FORCE_SITE=hub|product|monitor|stride|eu-validate.
 */
export function useSite() {
  const config = useRuntimeConfig()
  const url = useRequestURL()
  const host = url.host || ''

  const force = String(config.public.forceSite || '')
  let site: Site
  if (force === 'hub' || force === 'product' || force === 'monitor' || force === 'stride' || force === 'eu-validate') {
    site = force
  } else if (host.startsWith('pixsqueeze.')) {
    site = 'product'
  } else if (host.startsWith('monitor.')) {
    site = 'monitor'
  } else if (host.startsWith('stride.')) {
    site = 'stride'
  } else if (host.startsWith('eu-validate.')) {
    site = 'eu-validate'
  } else {
    site = 'hub'
  }

  return {
    site,
    isHub: site === 'hub',
    isProduct: site === 'product',
    isMonitor: site === 'monitor',
    isStride: site === 'stride',
    isEuValidate: site === 'eu-validate',
    host,
    isProdHost: host.endsWith('alosha.dev'),
    hubUrl: String(config.public.hubUrl),
    productUrl: String(config.public.productUrl),
    monitorUrl: String(config.public.monitorUrl),
    strideUrl: String(config.public.strideUrl),
    euValidateUrl: String(config.public.euValidateUrl)
  }
}
