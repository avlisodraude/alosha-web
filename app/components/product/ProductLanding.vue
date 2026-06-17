<script setup lang="ts">
useSeoMeta({
  title: 'PixSqueeze — Image Compression API',
  description: 'Batch compress images at scale with a simple API. Free tier, no credit card required.',
  ogTitle: 'PixSqueeze — Image Compression API',
  ogDescription: 'Batch compress images at scale with a simple API. Free tier, no credit card required.',
  ogImage: 'https://pixsqueeze.alosha.dev/og.png',
  ogUrl: 'https://pixsqueeze.alosha.dev',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://pixsqueeze.alosha.dev/og.png'
})

const features = [
  { icon: 'i-lucide-zap', title: 'Fast batch processing', description: 'Send multiple images in a single API call. We handle compression in parallel and return results in seconds.' },
  { icon: 'i-lucide-sliders-horizontal', title: 'Full control', description: 'Set quality, max width, and output format per request. JPEG, PNG, and WebP supported out of the box.' },
  { icon: 'i-lucide-shield-check', title: 'Secure & private', description: 'Images are processed in-memory and never stored on our servers. Your files stay yours.' },
  { icon: 'i-lucide-code-2', title: 'Simple integration', description: 'One endpoint, one API key. Works with any language or framework — curl, Node, Python, you name it.' },
  { icon: 'i-lucide-bar-chart-2', title: 'Usage dashboard', description: 'See exactly how many images you\'ve processed this month. Upgrade or downgrade any time.' },
  { icon: 'i-lucide-package', title: 'Open-source core', description: 'Built on PixSqueeze, a battle-tested open-source library with millions of downloads.' }
]

const plans = [
  {
    name: 'Free', price: '$0', period: '/mo',
    description: 'For personal projects and testing.',
    highlight: false, cta: 'Get started free', ctaTo: '/login?signup=1',
    features: ['100 images / month', 'Batch up to 10 images', 'JPEG · PNG · WebP', 'API key included', 'Community support']
  },
  {
    name: 'Starter', price: '$9', period: '/mo',
    description: 'For small apps and side projects.',
    highlight: false, cta: 'Get started', ctaTo: '/login?signup=1',
    features: ['2,000 images / month', 'Batch up to 50 images', 'JPEG · PNG · WebP', 'API key included', 'Email support']
  },
  {
    name: 'Pro', price: '$29', period: '/mo',
    description: 'For production apps with real traffic.',
    highlight: true, cta: 'Get Pro', ctaTo: '/login?signup=1',
    features: ['20,000 images / month', 'Batch up to 100 images', 'JPEG · PNG · WebP', 'Priority processing', 'Priority support']
  },
  {
    name: 'Business', price: '$99', period: '/mo',
    description: 'For high-volume workloads.',
    highlight: false, cta: 'Get Business', ctaTo: '/login?signup=1',
    features: ['Unlimited images', 'Batch up to 100 images', 'JPEG · PNG · WebP', 'Priority processing', 'Dedicated support']
  }
]

const codeExample = `curl -X POST ${PIXSQUEEZE_API}/compress/batch \\
  -H "Authorization: Bearer psx_your_key_here" \\
  -F "files[]=@photo1.jpg" \\
  -F "files[]=@photo2.heic" \\
  -F "quality=0.7" \\
  -F "maxWidth=1280"`
</script>

<template>
  <div>
    <!-- Hero -->
    <UPageHero
      class="hero-glow"
      :links="[
        { label: 'Start for free', to: '/login?signup=1', trailingIcon: 'i-lucide-arrow-right', size: 'xl', class: 'btn-grad' },
        { label: 'See pricing', to: '#pricing', size: 'xl', color: 'neutral', variant: 'subtle' }
      ]"
    >
      <template #headline>
        <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-default bg-default font-mono text-xs text-muted">
          <span class="size-1.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(16,185,129,.25)]" />
          API live · 100 images free every month
        </span>
      </template>
      <template #title>
        Image compression API<br><span class="text-grad">that just works</span>
      </template>
      <template #description>
        <p class="text-lg text-muted max-w-xl mx-auto">
          Batch compress JPEG, PNG, and WebP images via a simple REST API.
          <strong class="text-default">100 images free every month</strong> — no credit card required.
        </p>
      </template>
    </UPageHero>

    <!-- Code snippet -->
    <UPageSection
      title="One endpoint, done"
      description="Send images, get compressed images back. That's it."
    >
      <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-5 text-sm font-mono text-green-400 overflow-x-auto max-w-2xl mx-auto shadow-lg">
        <pre>{{ codeExample }}</pre>
      </div>
    </UPageSection>

    <!-- Features -->
    <UPageSection
      title="Everything you need"
      description="Built for developers who want compression handled and out of the way."
      :features="features"
    />

    <!-- Pricing -->
    <UPageSection
      id="pricing"
      title="Simple, transparent pricing"
      description="Start free. Upgrade when you need more."
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <UCard
          v-for="plan in plans"
          :key="plan.name"
          :class="plan.highlight ? 'ring-2 ring-primary' : ''"
          class="flex flex-col"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold text-base">{{ plan.name }}</span>
              <UBadge
                v-if="plan.highlight"
                color="primary"
                variant="subtle"
                size="sm"
              >
                Popular
              </UBadge>
            </div>
            <div class="mt-2 flex items-end gap-1">
              <span class="text-3xl font-bold">{{ plan.price }}</span>
              <span class="text-muted text-sm mb-1">{{ plan.period }}</span>
            </div>
            <p class="text-sm text-muted mt-1">
              {{ plan.description }}
            </p>
          </template>

          <ul class="space-y-2 text-sm flex-1">
            <li
              v-for="f in plan.features"
              :key="f"
              class="flex items-center gap-2"
            >
              <UIcon
                name="i-lucide-check"
                class="text-primary shrink-0"
              />
              {{ f }}
            </li>
          </ul>

          <template #footer>
            <UButton
              :to="plan.ctaTo"
              :variant="plan.highlight ? 'solid' : 'outline'"
              :class="plan.highlight ? 'btn-grad' : ''"
              block
            >
              {{ plan.cta }}
            </UButton>
          </template>
        </UCard>
      </div>
    </UPageSection>

    <!-- CTA -->
    <UPageSection>
      <UPageCTA
        title="Start compressing in minutes"
        description="Sign up, grab your API key, and make your first batch call. Free forever on the starter tier."
        variant="subtle"
        :links="[
          { label: 'Create free account', to: '/login?signup=1', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
          { label: 'View on GitHub', to: 'https://github.com/avlisodraude/pixsqueeze', target: '_blank', icon: 'i-simple-icons-github', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageSection>
  </div>
</template>
