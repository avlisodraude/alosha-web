<script setup lang="ts">
definePageMeta({ layout: 'default' })

const client = useSupabaseClient()
const user = useSupabaseUser()
const status = ref('Confirming your account…')
const API = PIXSQUEEZE_API

watch(user, async (u) => {
  if (!u) return

  // Already has a PixSqueeze key — go straight to dashboard
  if (u.user_metadata?.pixsqueeze_api_key) {
    return navigateTo('/dashboard')
  }

  // New user: provision a PixSqueeze API key
  try {
    status.value = 'Setting up your account…'

    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: u.email })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? `Registration failed: ${res.status}`)
    const apiKey = data.apiKey ?? data.key ?? data.api_key

    if (!apiKey) throw new Error('No API key returned')

    // Store key in Supabase user metadata
    await client.auth.updateUser({ data: { pixsqueeze_api_key: apiKey } })

    status.value = 'All set! Redirecting…'
    await navigateTo('/dashboard')
  } catch (e) {
    status.value = `Something went wrong: ${e instanceof Error ? e.message : e}`
  }
}, { immediate: true })
</script>

<template>
  <div class="flex items-center justify-center min-h-[70vh]">
    <UCard class="text-center p-8 max-w-sm">
      <UIcon
        :name="status.startsWith('Something') ? 'i-lucide-circle-x' : 'i-lucide-loader-circle'"
        :class="['text-3xl mx-auto mb-3', status.startsWith('Something') ? 'text-error' : 'text-primary animate-spin']"
      />
      <p class="text-muted text-sm">
        {{ status }}
      </p>
    </UCard>
  </div>
</template>
