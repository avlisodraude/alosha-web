/**
 * Live open-source stats for the Open Source page, hub hero and product grid.
 *
 * Registry-driven: every product in `app/utils/products.ts` is fetched
 * automatically, so adding a package needs no change here — its npm
 * download/version numbers and GitHub stars appear on their own.
 *
 * Both npm and GitHub lookups are cached (stale-while-revalidate) so a page
 * render never blocks on — or blanks out because of — an unreachable
 * upstream API: the last known-good value keeps serving while a background
 * refresh is attempted. npm data only needs daily freshness; GitHub stars
 * are refreshed more often since they're cheap and the unauthenticated
 * GitHub API rate-limits shared serverless IPs.
 */
import { PRODUCTS, type ProductDef } from '../../app/utils/products'

interface PackageStats {
  downloads: number | null
  weeklyDownloads: number | null
  version: string | null
  stars: number | null
}

type NpmStats = Omit<PackageStats, 'stars'>

// Root-level fields mirror the flagship product for backwards compatibility;
// per-package stats live under each product's statsKey (e.g. `euValidate`).
// The response also carries an entry for every product in the registry, keyed
// by statsKey — consumers reach those dynamically.
interface OssStats extends PackageStats {
  pixsqueeze: PackageStats
  monitor: PackageStats
  stride: PackageStats
  euValidate: PackageStats
  vueSelect: PackageStats
}

/** "https://github.com/owner/repo" -> "owner/repo" for the GitHub API. */
function repoPath(p: ProductDef): string {
  return p.repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/+$/, '')
}

// One cached function keyed by "owner/repo" — scales to any number of repos.
const cachedStars = defineCachedFunction(
  async (repo: string): Promise<number | null> => {
    try {
      const data = await $fetch<{ stargazers_count: number }>(
        `https://api.github.com/repos/${repo}`,
        { headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'alosha-web' } }
      )
      return data?.stargazers_count ?? null
    } catch {
      return null
    }
  },
  { maxAge: 600, name: 'gh-stars', getKey: (repo: string) => repo }
)

// npm lookups are cached for a day — these numbers need at most daily
// freshness, and caching means a render never waits on (or goes blank from)
// npm being unreachable: the last successful fetch keeps serving while a
// fresh one is attempted in the background.
const cachedNpmStats = defineCachedFunction(
  async (npmName: string): Promise<NpmStats> => {
    const result: NpmStats = { downloads: null, weeklyDownloads: null, version: null }
    let anySucceeded = false

    try {
      const dl = await $fetch<{ downloads: number }>(`https://api.npmjs.org/downloads/point/last-month/${npmName}`)
      result.downloads = dl?.downloads ?? null
      anySucceeded = true
    } catch { /* best-effort */ }

    try {
      const wk = await $fetch<{ downloads: number }>(`https://api.npmjs.org/downloads/point/last-week/${npmName}`)
      result.weeklyDownloads = wk?.downloads ?? null
      anySucceeded = true
    } catch { /* best-effort */ }

    try {
      const pkg = await $fetch<{ version: string }>(`https://registry.npmjs.org/${npmName}/latest`)
      result.version = pkg?.version ?? null
      anySucceeded = true
    } catch { /* best-effort */ }

    // If npm is entirely unreachable, throw instead of returning all-nulls —
    // this makes the cache keep serving the last known-good value (swr)
    // rather than overwriting it with a blank result.
    if (!anySucceeded) throw new Error(`npm unreachable for ${npmName}`)

    return result
  },
  { maxAge: 86400, name: 'npm-stats', getKey: (npmName: string) => npmName }
)

async function fetchPackageStats(p: ProductDef): Promise<PackageStats> {
  const [npm, stars] = await Promise.all([
    // Only throws when npm is down *and* nothing has ever been cached yet —
    // fall back to nulls rather than failing the whole stats response.
    cachedNpmStats(p.npmName).catch(() => ({ downloads: null, weeklyDownloads: null, version: null }) as NpmStats),
    cachedStars(repoPath(p))
  ])
  return { ...npm, stars }
}

export default defineEventHandler(async (event): Promise<OssStats> => {
  setHeader(event, 'cache-control', 'no-store')

  const stats = await Promise.all(PRODUCTS.map(fetchPackageStats))

  // Key each product's stats by its statsKey (falling back to slug).
  const byKey: Record<string, PackageStats> = {}
  PRODUCTS.forEach((p, i) => {
    byKey[p.statsKey ?? p.slug] = stats[i]!
  })

  // Flagship (the hosted product) mirrored at the root for backwards compat.
  const flagship = PRODUCTS.find(p => p.site === 'product')
  const root: PackageStats = (flagship ? byKey[flagship.statsKey ?? flagship.slug] : undefined)
    ?? stats[0]
    ?? { downloads: null, weeklyDownloads: null, version: null, stars: null }

  return { ...root, ...byKey } as OssStats
})
