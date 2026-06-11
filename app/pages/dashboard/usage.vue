<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const user = useSupabaseUser()
const API = 'https://pixsqueeze-api-production.up.railway.app'

interface UsageData {
  plan: string
  used: number
  limit: number | null
  remaining: number | null
  resetDate: string | null
}

const usage = ref<UsageData | null>(null)
const loading = ref(true)
const error = ref('')

const planLimits: Record<string, number | null> = {
  FREE: 100,
  STARTER: 2000,
  PRO: 20000,
  BUSINESS: null
}

const usagePercent = computed(() => {
  if (!usage.value || !usage.value.limit) return 0
  return Math.min(100, Math.round((usage.value.used / usage.value.limit) * 100))
})

const progressColor = computed(() => {
  if (usagePercent.value >= 90) return 'error'
  if (usagePercent.value >= 70) return 'warning'
  return 'primary'
})

const resetDateFormatted = computed(() => {
  if (!usage.value?.resetDate) return null
  return new Date(usage.value.resetDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
})

const daysUntilReset = computed(() => {
  if (!usage.value?.resetDate) return null
  const now = new Date()
  const reset = new Date(usage.value.resetDate)
  return Math.ceil((reset.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
})

onMounted(async () => {
  const key = user.value?.user_metadata?.pixsqueeze_api_key
  if (!key) {
    error.value = 'No API key found. Visit the Overview page first.'
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${API}/usage`, {
      headers: { 'Authorization': `Bearer ${key}` }
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = await res.json()
    usage.value = {
      plan: data.plan ?? 'FREE',
      used: data.used ?? 0,
      limit: data.limit ?? planLimits[data.plan ?? 'FREE'],
      remaining: data.remaining ?? null,
      resetDate: data.resetDate ?? null
    }
  } catch (e: any) {
    error.value = `Could not load usage: ${e.message}`
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Usage</h1>
      <p class="text-muted text-sm mt-1">Your image compression usage for the current billing period.</p>
    </div>

    <UAlert v-if="error" color="error" :description="error" />

    <!-- Main usage card -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">Current period</span>
          <div v-if="usage">
            <UBadge :color="usage.plan === 'FREE' ? 'neutral' : 'primary'" variant="subtle">
              {{ usage.plan }}
            </UBadge>
          </div>
          <USkeleton v-else-if="loading" class="h-5 w-16 rounded-full" />
        </div>
      </template>

      <div v-if="loading" class="space-y-4">
        <USkeleton class="h-10 w-24" />
        <USkeleton class="h-2 w-full rounded-full" />
        <div class="grid grid-cols-3 gap-4">
          <USkeleton class="h-16" />
          <USkeleton class="h-16" />
          <USkeleton class="h-16" />
        </div>
      </div>

      <div v-else-if="usage" class="space-y-4">
        <!-- Big number -->
        <div class="flex items-end gap-2">
          <span class="text-4xl font-bold font-mono">{{ usage.used.toLocaleString() }}</span>
          <span class="text-muted text-sm mb-1">
            {{ usage.limit ? `/ ${usage.limit.toLocaleString()} images` : '/ Unlimited' }}
          </span>
        </div>

        <!-- Progress bar -->
        <div v-if="usage.limit" class="space-y-1">
          <UProgress :value="usagePercent" :color="progressColor" />
          <div class="flex justify-between text-xs text-muted">
            <span>{{ usagePercent }}% used</span>
            <span>{{ (usage.remaining ?? usage.limit - usage.used).toLocaleString() }} remaining</span>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-3 gap-4 pt-2">
          <div class="rounded-lg bg-muted/10 p-3 text-center">
            <div class="text-2xl font-bold font-mono">{{ usage.used.toLocaleString() }}</div>
            <div class="text-xs text-muted mt-1">Images processed</div>
          </div>
          <div class="rounded-lg bg-muted/10 p-3 text-center">
            <div class="text-2xl font-bold font-mono">
              {{ usage.limit ? (usage.remaining ?? usage.limit - usage.used).toLocaleString() : '∞' }}
            </div>
            <div class="text-xs text-muted mt-1">Images remaining</div>
          </div>
          <div class="rounded-lg bg-muted/10 p-3 text-center">
            <div class="text-2xl font-bold font-mono">{{ daysUntilReset ?? '—' }}</div>
            <div class="text-xs text-muted mt-1">Days until reset</div>
          </div>
        </div>

        <!-- Reset date -->
        <p v-if="resetDateFormatted" class="text-xs text-muted flex items-center gap-1">
          <UIcon name="i-lucide-calendar" />
          Resets on {{ resetDateFormatted }}
        </p>

        <!-- Warning near limit -->
        <UAlert
          v-if="usage.limit && usagePercent >= 80"
          :color="usagePercent >= 90 ? 'error' : 'warning'"
          :icon="usagePercent >= 90 ? 'i-lucide-alert-circle' : 'i-lucide-alert-triangle'"
          :title="usagePercent >= 90 ? 'Almost out of images' : 'Approaching your limit'"
          :description="usagePercent >= 90
            ? `You've used ${usagePercent}% of your monthly limit. Upgrade to avoid interruptions.`
            : `You've used ${usagePercent}% of your monthly limit.`"
        />
      </div>

      <template #footer>
        <div class="flex items-center justify-between text-xs text-muted">
          <span>Usage resets at the start of each billing period.</span>
          <UButton size="xs" variant="ghost" icon="i-lucide-refresh-cw" @click="$router.go(0)">
            Refresh
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- Plan limits reference -->
    <UCard>
      <template #header>
        <span class="font-semibold">Plan limits</span>
      </template>
      <div class="divide-y divide-default">
        <div
          v-for="(limit, plan) in planLimits"
          :key="plan"
          class="flex items-center justify-between py-3"
          :class="usage?.plan === plan ? 'text-default' : 'text-muted'"
        >
          <div class="flex items-center gap-2">
            <UIcon
              v-if="usage?.plan === plan"
              name="i-lucide-check-circle"
              class="text-primary"
            />
            <UIcon v-else name="i-lucide-circle" class="opacity-30" />
            <span class="font-medium">{{ plan }}</span>
            <UBadge v-if="usage?.plan === plan" color="primary" variant="subtle" size="xs">Current</UBadge>
          </div>
          <span class="font-mono text-sm">
            {{ limit ? limit.toLocaleString() + ' / mo' : 'Unlimited' }}
          </span>
        </div>
      </div>
      <template #footer>
        <UButton to="/dashboard/billing" size="sm" variant="outline">
          View billing & upgrade
        </UButton>
      </template>
    </UCard>
  </div>
</template>
