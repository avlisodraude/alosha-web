/** Base URL of the hosted PixSqueeze batch API. */
export const PIXSQUEEZE_API = 'https://pixsqueeze-api-production.up.railway.app'

/** The current user's PixSqueeze API key from Supabase user metadata (null if not provisioned). */
export function usePixsqueezeKey() {
  const user = useSupabaseUser()
  return computed<string | null>(() => user.value?.user_metadata?.pixsqueeze_api_key ?? null)
}
