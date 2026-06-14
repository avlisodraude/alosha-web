<script setup lang="ts">
const { productUrl, monitorUrl } = useSite()

useSeoMeta({
  title: 'Alosha — Privacy-first developer tools, powered by open source',
  description: 'Alosha builds and maintains developer products on open-source foundations — PixSqueeze, Monitor, and more.',
  ogTitle: 'Alosha — Privacy-first developer tools, powered by open source',
  ogDescription: 'Alosha builds and maintains developer products on open-source foundations — PixSqueeze, Monitor, and more.',
  ogImage: 'https://alosha.dev/og.png',
  ogUrl: 'https://alosha.dev',
  twitterCard: 'summary_large_image'
})

const { data: stats } = await useFetch('/api/oss-stats')
const nf = new Intl.NumberFormat('en-US')

const totalDownloads = computed(() => {
  const px = stats.value?.pixsqueeze?.downloads ?? 0
  const mo = stats.value?.monitor?.downloads ?? 0
  return px + mo || null
})

const products = computed(() => [
  {
    name: 'PixSqueeze',
    status: 'Live',
    description: 'Image compression API with HEIC, TIFF & camera-RAW conversion. Open-source core, hosted batch API.',
    icon: 'i-lucide-image',
    to: productUrl,
    external: true
  },
  {
    name: 'Monitor',
    status: 'Live',
    description: 'Playwright-based website monitoring — checks, retries, screenshots on failure, and multi-channel alerts.',
    icon: 'i-lucide-activity',
    to: monitorUrl,
    external: true
  },
  {
    name: 'Stride',
    status: 'Coming soon',
    description: 'Running analytics for athletes and coaches.',
    icon: 'i-lucide-footprints',
    to: '/products',
    external: false
  }
])

const steps = [
  { icon: 'i-lucide-git-branch', title: 'Open source', description: 'We find a useful but underserved open-source project, improve it, and ship it in the open under a permissive license.' },
  { icon: 'i-lucide-heart-handshake', title: 'Trust', description: 'Developers adopt it, file issues, and star it. Credibility compounds in public — no marketing required.' },
  { icon: 'i-lucide-rocket', title: 'Product', description: 'A hosted service or premium tier turns that trust into a sustainable product, while the core stays free.' }
]
</script>

<template>
  <div>
    <UPageHero>
      <template #headline>
        <UBadge
          v-if="totalDownloads"
          color="primary"
          variant="subtle"
          size="lg"
        >
          {{ nf.format(totalDownloads) }} npm downloads a month and counting
        </UBadge>
      </template>
      <template #title>
        Building privacy-first tools<br><span class="text-grad">powered by open source</span>
      </template>
      <template #description>
        <p class="text-lg text-muted max-w-2xl mx-auto">
          Alosha is a software studio that improves useful open-source projects and turns
          them into sustainable developer products. Open source first — commercial where it counts.
        </p>
      </template>
      <template #links>
        <UButton
          to="/products"
          size="xl"
          trailing-icon="i-lucide-arrow-right"
          class="btn-grad"
        >
          Explore products
        </UButton>
        <UButton
          to="/open-source"
          size="xl"
          color="neutral"
          variant="subtle"
        >
          Open source
        </UButton>
      </template>
    </UPageHero>

    <!-- Products -->
    <UPageSection
      title="Products"
      description="Each product is part of the Alosha ecosystem — grown from an open-source foundation."
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <UPageCard
          v-for="p in products"
          :key="p.name"
          :icon="p.icon"
          :title="p.name"
          :description="p.description"
          :to="p.to"
          :target="p.external ? '_blank' : undefined"
          spotlight
        >
          <template #footer>
            <UBadge
              :color="p.status === 'Live' ? 'primary' : 'neutral'"
              variant="subtle"
              size="sm"
            >
              {{ p.status }}
            </UBadge>
          </template>
        </UPageCard>
      </div>
    </UPageSection>

    <!-- How Alosha works -->
    <UPageSection
      title="How we build"
      description="One repeatable loop, run with AI as the execution layer so a small team can sustain a portfolio."
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="relative rounded-xl border border-default p-6"
        >
          <span class="absolute -top-3 left-6 text-xs font-mono text-muted bg-default px-2">
            0{{ i + 1 }}
          </span>
          <UIcon
            :name="step.icon"
            class="size-6 text-primary"
          />
          <h3 class="font-semibold mt-3">
            {{ step.title }}
          </h3>
          <p class="text-sm text-muted mt-1">
            {{ step.description }}
          </p>
        </div>
      </div>
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Open source is the foundation"
        description="We build trust in the open, then offer hosted and premium versions for teams that want them."
        variant="subtle"
        :links="[
          { label: 'See our open source', to: '/open-source', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
          { label: 'About Alosha', to: '/about', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageSection>
  </div>
</template>
