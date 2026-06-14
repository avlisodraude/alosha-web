import type { Site } from '~/composables/useSite'

// Path prefixes owned by the product app (pixsqueeze.alosha.dev).
// NB: /demo is intentionally NOT here — it's a shared route so each product
// subdomain (pixsqueeze / monitor / stride) renders its own demo in demo.vue.
export const productPrefixes = ['/login', '/confirm', '/reset-password', '/dashboard', '/docs']

// Path prefixes owned by the portfolio hub (alosha.dev).
export const hubPrefixes = ['/products', '/open-source', '/about', '/contact', '/blog']

/**
 * Which site a given path belongs to. '/' (and anything unclassified) is
 * 'shared' — the host decides what renders there.
 */
export function routeSite(path: string): Site | 'shared' {
  const p = path.replace(/\/+$/, '') || '/'
  if (p === '/') return 'shared'
  if (productPrefixes.some(pre => p === pre || p.startsWith(`${pre}/`))) return 'product'
  if (hubPrefixes.some(pre => p === pre || p.startsWith(`${pre}/`))) return 'hub'
  return 'shared'
}
