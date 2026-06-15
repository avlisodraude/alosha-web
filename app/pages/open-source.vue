<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Open Source — Alosha',
  description: 'Open-source projects maintained by Alosha.'
})

const { data: stats } = await useFetch('/api/oss-stats', {
  server: false,
  query: { _: Date.now() }
})

const nf = new Intl.NumberFormat('en-US')
const fmt = (n?: number | null) => (n == null ? '—' : nf.format(n))

const packages = computed(() => [
  {
    name: 'pixsqueeze',
    description: 'JavaScript image compressor with server-side HEIC, TIFF & camera-RAW conversion.',
    stats: stats.value?.pixsqueeze,
    github: 'https://github.com/avlisodraude/pixsqueeze',
    npm: 'https://www.npmjs.com/package/pixsqueeze',
    product: 'https://pixsqueeze.alosha.dev',
    productLabel: 'Hosted product',
  },
  {
    name: '@alosha/monitor',
    description: 'Playwright-based website monitoring — checks, retries, screenshots on failure, and multi-channel alerts.',
    stats: stats.value?.monitor,
    github: 'https://github.com/avlisodraude/monitor',
    npm: 'https://www.npmjs.com/package/@alosha/monitor',
    product: 'https://monitor.alosha.dev',
    productLabel: 'Product page',
  },
  {
    name: '@alosha/stride',
    description: 'Parse GPX files, compute running metrics (pace, HR zones, splits), and render Chart.js dashboards — zero config.',
    stats: stats.value?.stride,
    github: 'https://github.com/avlisodraude/stride',
    npm: 'https://www.npmjs.com/package/@alosha/stride',
    product: 'https://stride.alosha.dev',
    productLabel: 'Product page',
  },
  {
    name: '@alosha/eu-validate',
    description: 'Offline EU identifier validation — checksum-accurate VAT (14 countries), IBAN, BSN and KvK checks with zero dependencies.',
    stats: stats.value?.euValidate,
    github: 'https://github.com/avlisodraude/eu-validate',
    npm: 'https://www.npmjs.com/package/@alosha/eu-validate',
    product: 'https://eu-validate.alosha.dev',
    productLabel: 'Product page',
  },
])
</script>

<template>
  <UPage>
    <UPageHero
      title="Open Source"
      description="We maintain the open-source projects our products are built on. Use them freely — MIT licensed."
    />
    <UPageBody>
      <div class="max-w-2xl mx-auto space-y-6">
        <UPageCard
          v-for="pkg in packages"
          :key="pkg.name"
          :title="pkg.name"
          :description="pkg.description"
        >
          <div class="grid grid-cols-3 gap-4 mt-2">
            <div>
              <div class="text-2xl font-bold">
                {{ fmt(pkg.stats?.weeklyDownloads) }}
              </div>
              <div class="text-xs text-muted uppercase tracking-wide">
                Downloads / week
              </div>
            </div>
            <div>
              <div class="text-2xl font-bold">
                {{ fmt(pkg.stats?.stars) }}
              </div>
              <div class="text-xs text-muted uppercase tracking-wide">
                GitHub stars
              </div>
            </div>
            <div>
              <div class="text-2xl font-bold">
                {{ pkg.stats?.version ? `v${pkg.stats.version}` : '—' }}
              </div>
              <div class="text-xs text-muted uppercase tracking-wide">
                Latest
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex flex-wrap items-center gap-3">
              <UBadge
                color="primary"
                variant="subtle"
                size="sm"
              >
                Active
              </UBadge>
              <UButton
                :to="pkg.github"
                target="_blank"
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-simple-icons-github"
              >
                GitHub
              </UButton>
              <UButton
                :to="pkg.npm"
                target="_blank"
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-simple-icons-npm"
              >
                npm
              </UButton>
              <UButton
                :to="pkg.product"
                target="_blank"
                size="xs"
                variant="subtle"
                trailing-icon="i-lucide-arrow-up-right"
              >
                {{ pkg.productLabel }}
              </UButton>
            </div>
          </template>
        </UPageCard>
      </div>
    </UPageBody>
  </UPage>
</template>
