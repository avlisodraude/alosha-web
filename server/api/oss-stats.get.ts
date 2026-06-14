/**
 * Live open-source stats for the Open Source page and hub hero.
 * npm download/version data is fetched fresh on every request. GitHub stars are
 * cached for 10 minutes because the unauthenticated GitHub API rate-limits
 * shared serverless IPs (and stars change slowly anyway).
 */
interface OssStats {
  downloads: number | null
  weeklyDownloads: number | null
  version: string | null
  stars: number | null
}

const cachedStars = defineCachedFunction(async (): Promise<number | null> => {
  try {
    const repo = await $fetch<{ stargazers_count: number }>(
      'https://api.github.com/repos/avlisodraude/pixsqueeze',
      { headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'alosha-web' } }
    )
    return repo?.stargazers_count ?? null
  } catch {
    return null
  }
}, { maxAge: 600, name: 'gh-stars', getKey: () => 'pixsqueeze' })

export default defineEventHandler(async (event): Promise<OssStats> => {
  // Always reflect the live npm numbers — never serve a cached response.
  setHeader(event, 'cache-control', 'no-store')

  const result: OssStats = { downloads: null, weeklyDownloads: null, version: null, stars: null }

  try {
    const dl = await $fetch<{ downloads: number }>('https://api.npmjs.org/downloads/point/last-month/pixsqueeze')
    result.downloads = dl?.downloads ?? null
  } catch {
    /* best-effort */
  }

  try {
    const wk = await $fetch<{ downloads: number }>('https://api.npmjs.org/downloads/point/last-week/pixsqueeze')
    result.weeklyDownloads = wk?.downloads ?? null
  } catch {
    /* best-effort */
  }

  try {
    const pkg = await $fetch<{ version: string }>('https://registry.npmjs.org/pixsqueeze/latest')
    result.version = pkg?.version ?? null
  } catch {
    /* best-effort */
  }

  result.stars = await cachedStars()
  return result
})
