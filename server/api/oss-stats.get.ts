/**
 * Live open-source stats for the Open Source page.
 * Cached for 1 hour so we don't hit npm / GitHub on every render.
 */
interface OssStats {
  downloads: number | null
  version: string | null
  stars: number | null
}

export default defineCachedEventHandler(async (): Promise<OssStats> => {
  const result: OssStats = { downloads: null, version: null, stars: null }

  try {
    const dl = await $fetch<{ downloads: number }>(
      'https://api.npmjs.org/downloads/point/last-month/pixsqueeze'
    )
    result.downloads = dl?.downloads ?? null
  } catch {
    /* best-effort — leave null on failure */
  }

  try {
    const pkg = await $fetch<{ version: string }>('https://registry.npmjs.org/pixsqueeze/latest')
    result.version = pkg?.version ?? null
  } catch {
    /* best-effort */
  }

  try {
    const repo = await $fetch<{ stargazers_count: number }>(
      'https://api.github.com/repos/avlisodraude/pixsqueeze',
      { headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'alosha-web' } }
    )
    result.stars = repo?.stargazers_count ?? null
  } catch {
    /* best-effort */
  }

  return result
}, { maxAge: 60 * 60, name: 'oss-stats', getKey: () => 'pixsqueeze' })
