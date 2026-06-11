<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const API = PIXSQUEEZE_API
const pixKey = usePixsqueezeKey()

const currentPlan = ref<string>('FREE')
const loadingUsage = ref(true)
const loadingCheckout = ref<string | null>(null)
const loadingPortal = ref(false)
const error = ref('')

const plans = [
  {
    key: 'FREE',
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Personal projects and testing.',
    features: ['100 images / month', 'Batch up to 10 images', 'JPEG · PNG · WebP', 'Community support'],
    highlight: false
  },
  {
    key: 'STARTER',
    name: 'Starter',
    price: '$9',
    period: '/mo',
    description: 'Small apps and side projects.',
    features: ['2,000 images / month', 'Batch up to 50 images', 'JPEG · PNG · WebP', 'Email support'],
    highlight: false
  },
  {
    key: 'PRO',
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'Production apps with real traffic.',
    features: ['20,000 images / month', 'Batch up to 100 images', 'JPEG · PNG · WebP', 'Priority processing', 'Priority support'],
    highlight: true
  },
  {
    key: 'BUSINESS',
    name: 'Business',
    price: '$99',
    period: '/mo',
    description: 'High-volume workloads.',
    features: ['Unlimited images', 'Batch up to 100 images', 'JPEG · PNG · WebP', 'Priority processing', 'Dedicated support'],
    highlight: false
  }
]

const planOrder = ['FREE', 'STARTER', 'PRO', 'BUSINESS']

const isUpgrade = (planKey: string) => planOrder.indexOf(planKey) > planOrder.indexOf(currentPlan.value)
const isDowngrade = (planKey: string) => planOrder.indexOf(planKey) < planOrder.indexOf(currentPlan.value)

onMounted(async () => {
  const key = pixKey.value
  if (!key) {
    loadingUsage.value = false
    return
  }
  try {
    const res = await fetch(`${API}/usage`, { headers: { Authorization: `Bearer ${key}` } })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = await res.json()
    currentPlan.value = data.plan ?? 'FREE'
  } catch (e) {
    error.value = `Could not load plan info: ${e instanceof Error ? e.message : e}`
  } finally {
    loadingUsage.value = false
  }
})

async function checkout(planKey: string) {
  const key = pixKey.value
  if (!key) return
  loadingCheckout.value = planKey
  error.value = ''
  try {
    const res = await fetch(`${API}/billing/checkout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else throw new Error(data.error ?? 'No checkout URL returned')
  } catch (e) {
    error.value = `Could not start checkout: ${e instanceof Error ? e.message : e}`
  } finally {
    loadingCheckout.value = null
  }
}

async function openPortal() {
  const key = pixKey.value
  if (!key) return
  loadingPortal.value = true
  error.value = ''
  try {
    const res = await fetch(`${API}/billing/portal`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` }
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else throw new Error(data.error ?? 'No portal URL returned')
  } catch (e) {
    error.value = `Could not open billing portal: ${e instanceof Error ? e.message : e}`
  } finally {
    loadingPortal.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          Billing
        </h1>
        <p class="text-muted text-sm mt-1">
          Manage your plan and payment details.
        </p>
      </div>
      <UButton
        v-if="currentPlan !== 'FREE'"
        variant="outline"
        icon="i-lucide-credit-card"
        :loading="loadingPortal"
        @click="openPortal"
      >
        Manage billing
      </UButton>
    </div>

    <UAlert
      v-if="error"
      color="error"
      :description="error"
    />

    <!-- Current plan banner -->
    <UCard v-if="!loadingUsage">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UIcon
              name="i-lucide-package"
              class="text-primary"
            />
          </div>
          <div>
            <p class="font-semibold">
              {{ currentPlan }} plan
            </p>
            <p class="text-sm text-muted">
              {{ currentPlan === 'FREE' ? 'Free forever, no credit card required.' : 'Billed monthly via Stripe.' }}
            </p>
          </div>
        </div>
        <UBadge
          :color="currentPlan === 'FREE' ? 'neutral' : 'primary'"
          variant="subtle"
        >
          {{ currentPlan === 'FREE' ? 'Free' : 'Paid' }}
        </UBadge>
      </div>
    </UCard>
    <div
      v-else
      class="flex items-center gap-2 text-sm text-muted"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin"
      />
      Loading plan info…
    </div>

    <!-- Plan cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard
        v-for="plan in plans"
        :key="plan.key"
        :class="[
          'flex flex-col',
          plan.key === currentPlan ? 'ring-2 ring-primary' : '',
          plan.highlight && plan.key !== currentPlan ? 'ring-1 ring-primary/30' : ''
        ]"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold">{{ plan.name }}</span>
            <div class="flex gap-1">
              <UBadge
                v-if="plan.key === currentPlan"
                color="primary"
                variant="subtle"
                size="xs"
              >
                Current
              </UBadge>
              <UBadge
                v-else-if="plan.highlight"
                color="neutral"
                variant="subtle"
                size="xs"
              >
                Popular
              </UBadge>
            </div>
          </div>
          <div class="mt-2 flex items-end gap-1">
            <span class="text-3xl font-bold">{{ plan.price }}</span>
            <span class="text-muted text-sm mb-1">{{ plan.period }}</span>
          </div>
          <p class="text-xs text-muted mt-1">
            {{ plan.description }}
          </p>
        </template>

        <ul class="space-y-2 text-xs flex-1">
          <li
            v-for="f in plan.features"
            :key="f"
            class="flex items-start gap-1.5"
          >
            <UIcon
              name="i-lucide-check"
              class="text-primary shrink-0 mt-0.5"
            />
            {{ f }}
          </li>
        </ul>

        <template #footer>
          <!-- Current plan -->
          <UButton
            v-if="plan.key === currentPlan"
            disabled
            block
            variant="soft"
          >
            Current plan
          </UButton>
          <!-- Upgrade -->
          <UButton
            v-else-if="isUpgrade(plan.key)"
            block
            :variant="plan.highlight ? 'solid' : 'outline'"
            :loading="loadingCheckout === plan.key"
            @click="checkout(plan.key)"
          >
            Upgrade
          </UButton>
          <!-- Downgrade -->
          <UButton
            v-else-if="isDowngrade(plan.key) && plan.key !== 'FREE'"
            block
            variant="ghost"
            color="neutral"
            :loading="loadingCheckout === plan.key"
            @click="checkout(plan.key)"
          >
            Downgrade
          </UButton>
          <!-- Downgrade to free -->
          <UButton
            v-else-if="isDowngrade(plan.key) && plan.key === 'FREE'"
            block
            variant="ghost"
            color="neutral"
            :loading="loadingPortal"
            @click="openPortal"
          >
            Cancel plan
          </UButton>
        </template>
      </UCard>
    </div>

    <!-- FAQ -->
    <UCard>
      <template #header>
        <span class="font-semibold">Billing FAQ</span>
      </template>
      <div class="divide-y divide-default text-sm">
        <div class="py-3">
          <p class="font-medium">
            When am I charged?
          </p>
          <p class="text-muted mt-1">
            You're charged immediately when you upgrade, and then on the same day each month.
          </p>
        </div>
        <div class="py-3">
          <p class="font-medium">
            Can I cancel anytime?
          </p>
          <p class="text-muted mt-1">
            Yes. Cancel from the billing portal — your plan stays active until the end of the billing period.
          </p>
        </div>
        <div class="py-3">
          <p class="font-medium">
            What happens if I exceed my limit?
          </p>
          <p class="text-muted mt-1">
            Requests will return a 429 error until the next billing period or until you upgrade.
          </p>
        </div>
        <div class="py-3">
          <p class="font-medium">
            Do unused images roll over?
          </p>
          <p class="text-muted mt-1">
            No. Usage resets at the start of each billing period.
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
