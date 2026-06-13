/**
 * Two-domain routing for a single Nuxt app.
 *
 * - On the real production domains, a route that belongs to the *other* site is
 *   redirected to the correct subdomain (same path preserved).
 * - The hub site renders shared/hub routes with the `hub` layout; the product
 *   site keeps each page's own layout (default / dashboard).
 *
 * Cross-domain redirects are only enforced on *.alosha.dev so local dev
 * (localhost) can reach every route. Use NUXT_PUBLIC_FORCE_SITE to test a
 * specific site locally.
 */
export default defineNuxtRouteMiddleware((to) => {
  const { site, isHub, isProdHost, hubUrl, productUrl } = useSite()
  const target = routeSite(to.path)

  if (isProdHost && target !== 'shared' && target !== site) {
    const base = target === 'product' ? productUrl : hubUrl
    return navigateTo(`${base}${to.fullPath}`, { external: true })
  }

  if (isHub && (target === 'hub' || target === 'shared')) {
    setPageLayout('hub')
  }
})
