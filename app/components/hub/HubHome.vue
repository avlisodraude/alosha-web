<script setup lang="ts">
// Portfolio comes straight from the registry — adding a package needs no edit here.
const { products } = useSite()

const statusColor = (s: string) => (s === 'live' ? 'primary' : s === 'beta' ? 'warning' : 'neutral')
const statusLabel = (s: string) => (s === 'live' ? 'Live' : s === 'beta' ? 'Beta' : 'Coming soon')

useSeoMeta({
  title: 'Alosha — Privacy-first developer tools, powered by open source',
  description: 'Alosha builds and maintains developer products on open-source foundations — PixSqueeze, Monitor, Stride, and more.',
  ogTitle: 'Alosha — Privacy-first developer tools, powered by open source',
  ogDescription: 'Alosha builds and maintains developer products on open-source foundations — PixSqueeze, Monitor, Stride, and more.',
  ogImage: 'https://alosha.dev/og.png',
  ogUrl: 'https://alosha.dev',
  twitterCard: 'summary_large_image'
})

const { data: stats } = await useFetch('/api/oss-stats')
const nf = new Intl.NumberFormat('en-US')

const totalDownloads = computed(() => {
  const px = stats.value?.pixsqueeze?.downloads ?? 0
  const mo = stats.value?.monitor?.downloads ?? 0
  const st = stats.value?.stride?.downloads ?? 0
  const ev = stats.value?.euValidate?.downloads ?? 0
  return px + mo + st + ev || null
})
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

    <!-- Package matrix -->
    <UPageSection
      title="The package matrix"
      description="One toolkit, many single-purpose packages — each free and open-source at its core, each with its own home. Mix and match the ones your stack needs."
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <RevealOnScroll
          v-for="(p, i) in products"
          :key="p.slug"
          :index="i"
          class="h-full"
        >
          <UPageCard
            :icon="p.icon"
            :title="p.name"
            :description="p.blurb"
            :to="p.url"
            target="_blank"
            class="h-full"
            spotlight
          >
            <template #footer>
              <div class="flex items-center justify-between w-full gap-2">
                <span class="text-xs text-muted">{{ p.audience }}</span>
                <UBadge
                  :color="statusColor(p.status)"
                  variant="subtle"
                  size="sm"
                >
                  {{ statusLabel(p.status) }}
                </UBadge>
              </div>
            </template>
          </UPageCard>
        </RevealOnScroll>
      </div>

      <div class="flex justify-center mt-8">
        <UButton
          to="/products"
          color="neutral"
          variant="subtle"
          trailing-icon="i-lucide-arrow-right"
        >
          Compare all products
        </UButton>
      </div>
    </UPageSection>

    <!-- How Alosha works — split image/text panels (design handoff) -->
    <HubHowWeBuild />

    <UPageSection>
      <UPageCTA
        title="Open source is the foundation"
        description="We build trust in the open, then offer hosted tiers, priority support and custom work for teams that want them."
        variant="subtle"
        :links="[
          { label: 'Support & custom work', to: '/support', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
          { label: 'See our open source', to: '/open-source', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageSection>
  </div>
</template>
