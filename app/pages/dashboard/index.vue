<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const user = useSupabaseUser()
const API = PIXSQUEEZE_API

// --- State ---
const apiKey = ref<string | null>(null)
const usage = ref<{ used: number, limit: number, plan: string } | null>(null)
const loadingKey = ref(false)
const loadingUsage = ref(false)
const loadingBilling = ref(false)
const copied = ref(false)
const revealed = ref(false)
const error = ref('')

const planLimits: Record<string, number | null> = {
  FREE: 100,
  STARTER: 2000,
  PRO: 20000,
  BUSINESS: null
}

const usagePercent = computed(() => {
  if (!usage.value) return 0
  const limit = planLimits[usage.value.plan]
  if (!limit) return 0
  return Math.min(100, Math.round((usage.value.used / limit) * 100))
})

// --- Load or provision API key ---
onMounted(async () => {
  const meta = user.value?.user_metadata

  if (meta?.pixsqueeze_api_key) {
    // Already provisioned — use it directly
    apiKey.value = meta.pixsqueeze_api_key
    await fetchUsage(meta.pixsqueeze_api_key)
  } else {
    // Not provisioned yet (e.g. confirmed email but confirm.vue didn't run)
    await provisionKey()
  }
})

async function provisionKey() {
  loadingKey.value = true
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.value?.email })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? `Status ${res.status}`)
    const key = data.apiKey
    if (!key) throw new Error('No key returned')

    // Persist in Supabase user metadata so we don't re-register on next login
    const client = useSupabaseClient()
    await client.auth.updateUser({ data: { pixsqueeze_api_key: key } })

    apiKey.value = key
    await fetchUsage(key)
  } catch (e) {
    error.value = `Could not provision API key: ${e instanceof Error ? e.message : e}`
  } finally {
    loadingKey.value = false
  }
}

async function fetchUsage(key: string) {
  loadingUsage.value = true
  try {
    const res = await fetch(`${API}/usage`, { headers: { Authorization: `Bearer ${key}` } })
    if (!res.ok) throw new Error('Failed to load usage')
    const data = await res.json()
    usage.value = { used: data.used ?? 0, limit: data.limit ?? 100, plan: data.plan ?? 'FREE' }
  } catch {
    error.value = 'Could not load usage data.'
  } finally {
    loadingUsage.value = false
  }
}

async function copyKey() {
  if (!apiKey.value) return
  await navigator.clipboard.writeText(apiKey.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

async function openBillingPortal() {
  if (!apiKey.value) return
  loadingBilling.value = true
  try {
    const res = await fetch(`${API}/billing/portal`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey.value}` }
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  } catch {
    error.value = 'Could not open billing portal.'
  } finally {
    loadingBilling.value = false
  }
}

async function openUpgradeCheckout(plan: 'STARTER' | 'PRO' | 'BUSINESS') {
  if (!apiKey.value) return
  loadingBilling.value = true
  try {
    const res = await fetch(`${API}/billing/checkout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey.value}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  } catch {
    error.value = 'Could not start checkout.'
  } finally {
    loadingBilling.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold">
        Overview
      </h1>
      <p class="text-muted text-sm mt-1">
        {{ user?.email }}
      </p>
    </div>

    <UAlert
      v-if="error"
      color="error"
      :description="error"
    />

    <!-- Plan + Usage -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">Usage this month</span>
          <UBadge
            v-if="usage"
            :color="usage.plan === 'FREE' ? 'neutral' : 'primary'"
            variant="subtle"
          >
            {{ usage.plan }}
          </UBadge>
          <USkeleton
            v-else
            class="h-5 w-16 rounded-full"
          />
        </div>
      </template>

      <div
        v-if="loadingUsage"
        class="space-y-3"
      >
        <USkeleton class="h-4 w-32" />
        <USkeleton class="h-2 w-full rounded-full" />
      </div>
      <div
        v-else-if="usage"
        class="space-y-3"
      >
        <div class="flex items-end justify-between text-sm">
          <span class="font-mono text-2xl font-bold">{{ usage.used.toLocaleString() }}</span>
          <span class="text-muted">
            {{ planLimits[usage.plan] ? `/ ${planLimits[usage.plan]!.toLocaleString()} images` : '/ Unlimited' }}
          </span>
        </div>
        <UProgress
          v-if="planLimits[usage.plan]"
          :value="usagePercent"
          color="primary"
        />
        <p
          v-if="usage.plan === 'FREE'"
          class="text-xs text-muted"
        >
          On the free plan. Upgrade to compress more images.
        </p>
      </div>
      <div
        v-else
        class="text-sm text-muted"
      >
        No usage data available.
      </div>

      <template #footer>
        <div class="flex gap-2 flex-wrap">
          <UButton
            v-if="usage?.plan === 'FREE'"
            size="sm"
            :loading="loadingBilling"
            @click="openUpgradeCheckout('STARTER')"
          >
            Upgrade to Starter — $9/mo
          </UButton>
          <UButton
            v-if="usage?.plan === 'STARTER'"
            size="sm"
            :loading="loadingBilling"
            @click="openUpgradeCheckout('PRO')"
          >
            Upgrade to Pro — $29/mo
          </UButton>
          <UButton
            v-if="usage?.plan !== 'FREE'"
            size="sm"
            variant="outline"
            :loading="loadingBilling"
            @click="openBillingPortal"
          >
            Manage billing
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- API Key -->
    <UCard>
      <template #header>
        <span class="font-semibold">API Key</span>
      </template>

      <div
        v-if="loadingKey"
        class="flex items-center gap-2 text-sm text-muted"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="animate-spin"
        />
        Setting up your API key…
      </div>
      <div
        v-else-if="apiKey"
        class="flex items-center gap-2"
      >
        <UInput
          :model-value="apiKey"
          :type="revealed ? 'text' : 'password'"
          readonly
          class="flex-1 font-mono text-sm"
        />
        <UButton
          :icon="revealed ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="revealed = !revealed"
        />
        <UButton
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="copied ? 'success' : 'neutral'"
          variant="ghost"
          size="sm"
          @click="copyKey"
        />
      </div>
      <div
        v-else
        class="text-sm text-muted"
      >
        No API key found.
      </div>

      <template #footer>
        <p class="text-xs text-muted">
          Keep this key secret. Include it as <code class="font-mono bg-muted/20 px-1 rounded">Authorization: Bearer &lt;key&gt;</code> in every request.
        </p>
      </template>
    </UCard>

    <!-- Quick start -->
    <UCard>
      <template #header>
        <span class="font-semibold">Quick start</span>
      </template>
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto">
        <pre>curl -X POST {{ API }}/compress/batch \
  -H "Authorization: Bearer {{ revealed && apiKey ? apiKey : 'psx_your_key_here' }}" \
  -F "files[]=@photo.jpg" \
  -F "quality=0.8"</pre>
      </div>
      <p class="text-xs text-muted mt-2">
        Full reference in the <NuxtLink
          to="/docs"
          class="text-primary hover:underline"
        >API docs</NuxtLink>.
      </p>
    </UCard>
  </div>
</template>
