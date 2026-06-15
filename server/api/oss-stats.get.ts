/**
 * Live open-source stats for the Open Source page and hub hero.
 * npm download/version data is fetched fresh on every request. GitHub stars are
 * cached for 10 minutes because the unauthenticated GitHub API rate-limits
 * shared serverless IPs (and stars change slowly anyway).
 */
interface PackageStats {
  downloads: number | null
  weeklyDownloads: number | null
  version: string | null
  stars: number | null
}

interface OssStats {
  // pixsqueeze (kept at root level for backwards compat with hub hero badge)
  downloads: number | null
  weeklyDownloads: number | null
  version: string | null
  stars: number | null
  // per-package
  pixsqueeze: PackageStats
  monitor: PackageStats
  stride: PackageStats
  euValidate: PackageStats
}

async function fetchPackageStats(npmName: string, ghRepo: string, starsCache: () => Promise<number | null>): Promise<PackageStats> {
  const result: PackageStats = { downloads: null, weeklyDownloads: null, version: null, stars: null }

  try {
    const dl = await $fetch<{ downloads: number }>(`https://api.npmjs.org/downloads/point/last-month/${npmName}`)
    result.downloads = dl?.downloads ?? null
  } catch { /* best-effort */ }

  try {
    const wk = await $fetch<{ downloads: number }>(`https://api.npmjs.org/downloads/point/last-week/${npmName}`)
    result.weeklyDownloads = wk?.downloads ?? null
  } catch { /* best-effort */ }

  try {
    const pkg = await $fetch<{ version: string }>(`https://registry.npmjs.org/${npmName}/latest`)
    result.version = pkg?.version ?? null
  } catch { /* best-effort */ }

  result.stars = await starsCache()
  return result
}

const cachedPixsqueezeStars = defineCachedFunction(async (): Promise<number | null> => {
  try {
    const repo = await $fetch<{ stargazers_count: number }>(
      'https://api.github.com/repos/avlisodraude/pixsqueeze',
      { headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'alosha-web' } }
    )
    return repo?.stargazers_count ?? null
  } catch { return null }
}, { maxAge: 600, name: 'gh-stars', getKey: () => 'pixsqueeze' })

const cachedMonitorStars = defineCachedFunction(async (): Promise<number | null> => {
  try {
    const repo = await $fetch<{ stargazers_count: number }>(
      'https://api.github.com/repos/avlisodraude/monitor',
      { headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'alosha-web' } }
    )
    return repo?.stargazers_count ?? null
  } catch { return null }
}, { maxAge: 600, name: 'gh-stars', getKey: () => 'monitor' })

const cachedStrideStars = defineCachedFunction(async (): Promise<number | null> => {
  try {
    const repo = await $fetch<{ stargazers_count: number }>(
      'https://api.github.com/repos/avlisodraude/stride',
      { headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'alosha-web' } }
    )
    return repo?.stargazers_count ?? null
  } catch { return null }
}, { maxAge: 600, name: 'gh-stars', getKey: () => 'stride' })

const cachedEuValidateStars = defineCachedFunction(async (): Promise<number | null> => {
  try {
    const repo = await $fetch<{ stargazers_count: number }>(
      'https://api.github.com/repos/avlisodraude/eu-validate',
      { headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'alosha-web' } }
    )
    return repo?.stargazers_count ?? null
  } catch { return null }
}, { maxAge: 600, name: 'gh-stars', getKey: () => 'eu-validate' })

export default defineEventHandler(async (event): Promise<OssStats> => {
  setHeader(event, 'cache-control', 'no-store')

  const [pixsqueeze, monitor, stride, euValidate] = await Promise.all([
    fetchPackageStats('pixsqueeze', 'avlisodraude/pixsqueeze', cachedPixsqueezeStars),
    fetchPackageStats('@alosha/monitor', 'avlisodraude/monitor', cachedMonitorStars),
    fetchPackageStats('@alosha/stride', 'avlisodraude/stride', cachedStrideStars),
    fetchPackageStats('@alosha/eu-validate', 'avlisodraude/eu-validate', cachedEuValidateStars)
  ])

  return {
    // Root-level fields kept for backwards compat (hub hero uses stats?.weeklyDownloads)
    ...pixsqueeze,
    pixsqueeze,
    monitor,
    stride,
    euValidate
  }
})
