<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Contact — Alosha',
  description: 'Get in touch with Alosha — partnerships, early access, or open-source support.'
})

const topics = [
  'Partnership or licensing',
  'Early access',
  'Bug or feature request',
  'Question / other'
]

const products = [
  'General / not sure',
  'PixSqueeze',
  '@alosha/monitor',
  '@alosha/stride',
  '@alosha/eu-validate'
]

const packages = [
  { name: 'pixsqueeze', label: 'PixSqueeze', issues: 'https://github.com/avlisodraude/pixsqueeze/issues', icon: 'i-lucide-image' },
  { name: 'monitor', label: '@alosha/monitor', issues: 'https://github.com/avlisodraude/monitor/issues', icon: 'i-lucide-activity' },
  { name: 'stride', label: '@alosha/stride', issues: 'https://github.com/avlisodraude/stride/issues', icon: 'i-lucide-timer' },
  { name: 'eu-validate', label: '@alosha/eu-validate', issues: 'https://github.com/avlisodraude/eu-validate/issues', icon: 'i-lucide-badge-check' }
]

const state = reactive({
  name: '',
  email: '',
  topic: topics[0],
  product: products[0],
  message: '',
  company: '' // honeypot — kept off-screen, must stay empty
})

const startedAt = ref(0)
onMounted(() => {
  startedAt.value = Date.now()
})

const loading = ref(false)
const sent = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  if (!state.name.trim() || !state.email.trim() || !state.message.trim()) {
    error.value = 'Please fill in your name, email, and a message.'
    return
  }
  loading.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...state, startedAt: startedAt.value }
    })
    sent.value = true
  } catch (e: unknown) {
    const data = (e as { data?: { statusMessage?: string, message?: string } })?.data
    error.value = data?.statusMessage || data?.message || 'Something went wrong. Please email hello@alosha.dev directly.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UPage>
    <UPageHero
      title="Get in touch"
      description="Questions, partnerships, or early access to what's coming next — reach out any time."
    />

    <UPageBody class="max-w-5xl mx-auto px-4 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form -->
        <UCard class="lg:col-span-2">
          <template #header>
            <h2 class="text-lg font-semibold">
              Send a message
            </h2>
            <p class="text-sm text-muted mt-1">
              For partnerships, licensing, private questions, and early access.
            </p>
          </template>

          <!-- Success state -->
          <div
            v-if="sent"
            class="flex flex-col items-center text-center gap-3 py-8"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="size-10 text-primary"
            />
            <p class="font-medium">
              Thanks — your message is on its way.
            </p>
            <p class="text-sm text-muted max-w-sm">
              Alosha will reply to <strong>{{ state.email }}</strong> as soon as possible.
            </p>
          </div>

          <!-- Form state -->
          <UForm
            v-else
            :state="state"
            class="space-y-5"
            @submit.prevent="handleSubmit"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField
                label="Name"
                name="name"
              >
                <UInput
                  v-model="state.name"
                  placeholder="Your name"
                  autocomplete="name"
                  required
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Email"
                name="email"
              >
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  required
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField
                label="Topic"
                name="topic"
              >
                <USelect
                  v-model="state.topic"
                  :items="topics"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Product"
                name="product"
              >
                <USelect
                  v-model="state.product"
                  :items="products"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField
              label="Message"
              name="message"
            >
              <UTextarea
                v-model="state.message"
                :rows="6"
                placeholder="What should I know?"
                required
                class="w-full"
              />
            </UFormField>

            <!-- Honeypot: hidden from real users, bots tend to fill it -->
            <div
              aria-hidden="true"
              class="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            >
              <label>
                Company
                <input
                  v-model="state.company"
                  type="text"
                  tabindex="-1"
                  autocomplete="off"
                >
              </label>
            </div>

            <UAlert
              v-if="error"
              color="error"
              variant="subtle"
              :description="error"
            />

            <div class="flex flex-wrap items-center gap-3">
              <UButton
                type="submit"
                :loading="loading"
                icon="i-lucide-send"
                class="btn-grad"
              >
                Send message
              </UButton>
              <p class="text-xs text-muted">
                Your email is used only so Alosha can reply.
              </p>
            </div>
          </UForm>
        </UCard>

        <!-- Side info -->
        <div class="space-y-6">
          <UCard>
            <div class="space-y-2">
              <UIcon
                name="i-lucide-bell"
                class="size-5 text-primary"
              />
              <h3 class="font-semibold">
                Early access
              </h3>
              <p class="text-sm text-muted">
                Choose <strong>Monitor Cloud early access</strong> as the topic for hosted monitoring, dashboards, team alerts, and uptime history.
              </p>
            </div>
          </UCard>

          <UCard>
            <div class="space-y-2">
              <UIcon
                name="i-simple-icons-github"
                class="size-5 text-primary"
              />
              <h3 class="font-semibold">
                Open-source bugs
              </h3>
              <p class="text-sm text-muted">
                Bug reports and feature requests are easiest to track in GitHub issues.
              </p>
            </div>
          </UCard>
        </div>
      </div>

      <USeparator class="my-12" />

      <!-- Open-source support -->
      <div class="space-y-4">
        <p class="text-sm font-semibold uppercase tracking-widest text-muted text-center">
          Open-source support
        </p>
        <p class="text-sm text-muted text-center">
          Bug reports and feature requests belong on GitHub — that's where they get tracked and fixed.
        </p>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UCard
            v-for="pkg in packages"
            :key="pkg.name"
            class="text-center"
          >
            <div class="flex flex-col items-center gap-3 py-2">
              <UIcon
                :name="pkg.icon"
                class="size-6 text-primary"
              />
              <p class="text-sm font-medium">
                {{ pkg.label }}
              </p>
              <UButton
                :to="pkg.issues"
                target="_blank"
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-simple-icons-github"
              >
                Open an issue
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </UPageBody>
  </UPage>
</template>
