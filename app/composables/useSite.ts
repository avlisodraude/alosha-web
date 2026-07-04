import { PRODUCTS, resolveProduct, resolvedProducts, productForSite, type Site } from '../utils/products'

/**
 * Resolves which site the current request belongs to.
 *
 *   alosha.dev              → 'hub'         (portfolio hub)
 *   pixsqueeze.alosha.dev   → 'product'      (PixSqueeze app)
 *   monitor.alosha.dev      → 'monitor'      (Monitor app)
 *   stride.alosha.dev       → 'stride'       (Stride app)
 *   eu-validate.alosha.dev  → 'eu-validate'  (eu-validate package landing)
 *   vue-select.alosha.dev   → 'vue-select'   (vue-select package landing)
 *
 * Subdomain → site matching is driven by the product registry
 * (`app/utils/products.ts`), so adding a package is a one-line registry change.
 *
 * SSR-safe: host comes from useRequestURL(), which is populated on both the
 * server and the client. For local dev, set NUXT_PUBLIC_FORCE_SITE=hub|product|monitor|stride|eu-validate|vue-select.
 */
export function useSite() {
  const config = useRuntimeConfig()
  const url = useRequestURL()
  const host = url.host || ''

  const force = String(config.public.forceSite || '')
  const validForce = force === 'hub' || PRODUCTS.some(p => p.site === force)

  let site: Site
  if (validForce) {
    site = force as Site
  } else {
    // Match the host's leading label (e.g. "monitor.") against a registry slug.
    const match = PRODUCTS.find(p => host.startsWith(`${p.slug}.`))
    site = match ? match.site : 'hub'
  }

  const product = productForSite(site)

  return {
    site,
    isHub: site === 'hub',
    isProduct: site === 'product',
    isMonitor: site === 'monitor',
    isStride: site === 'stride',
    isEuValidate: site === 'eu-validate',
    isVueSelect: site === 'vue-select',
    host,
    isProdHost: host.endsWith('alosha.dev'),
    /** The active product (registry entry with resolved links), or null on the hub. */
    product,
    /** The full portfolio with links resolved — drives matrices, nav and grids. */
    products: resolvedProducts(),
    hubUrl: String(config.public.hubUrl),
    // Backward-compatible per-product URLs, now derived from the registry.
    productUrl: resolveProduct(PRODUCTS.find(p => p.site === 'product')!).url,
    monitorUrl: resolveProduct(PRODUCTS.find(p => p.site === 'monitor')!).url,
    strideUrl: resolveProduct(PRODUCTS.find(p => p.site === 'stride')!).url,
    euValidateUrl: resolveProduct(PRODUCTS.find(p => p.site === 'eu-validate')!).url,
    vueSelectUrl: resolveProduct(PRODUCTS.find(p => p.site === 'vue-select')!).url
  }
}
