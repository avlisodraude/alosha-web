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
    icon: 'i-lucide-image',
    description: 'JavaScript image compressor with server-side HEIC, TIFF & camera-RAW conversion.',
    stats: stats.value?.pixsqueeze,
    github: 'https://github.com/avlisodraude/pixsqueeze',
    npm: 'https://www.npmjs.com/package/pixsqueeze',
    product: 'https://pixsqueeze.alosha.dev',
    productLabel: 'Hosted product'
  },
  {
    name: '@alosha/monitor',
    icon: 'i-lucide-activity',
    description: 'Playwright-based website monitoring — checks, retries, screenshots on failure, and multi-channel alerts.',
    stats: stats.value?.monitor,
    github: 'https://github.com/avlisodraude/monitor',
    npm: 'https://www.npmjs.com/package/@alosha/monitor',
    product: 'https://monitor.alosha.dev',
    productLabel: 'Product page'
  },
  {
    name: '@alosha/stride',
    icon: 'i-lucide-footprints',
    description: 'Parse GPX, TCX and FIT files, compute running metrics (pace, HR zones, splits), and render Chart.js dashboards — zero config.',
    stats: stats.value?.stride,
    github: 'https://github.com/avlisodraude/stride',
    npm: 'https://www.npmjs.com/package/@alosha/stride',
    product: 'https://stride.alosha.dev',
    productLabel: 'Product page'
  },
  {
    name: '@alosha/eu-validate',
    icon: 'i-lucide-badge-check',
    description: 'Offline EU identifier validation — checksum-accurate VAT (14 countries), IBAN, BSN and KvK checks with zero dependencies.',
    stats: stats.value?.euValidate,
    github: 'https://github.com/avlisodraude/eu-validate',
    npm: 'https://www.npmjs.com/package/@alosha/eu-validate',
    product: 'https://eu-validate.alosha.dev',
    productLabel: 'Product page'
  }
])

const totalWeekly = computed(() =>
  packages.value.reduce((sum, p) => sum + (p.stats?.weeklyDownloads ?? 0), 0)
)
</script>

<template>
  <UPage>
    <UPageHero
      title="Open Source"
      description="We maintain the open-source projects our products are built on. Use them freely — MIT licensed."
    />
    <UPageBody class="max-w-6xl mx-auto px-4 w-full">
      <!-- At-a-glance summary -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div class="rounded-lg border border-default bg-elevated/60 dark:bg-white/[0.06] px-4 py-3">
          <div class="text-2xl font-bold tabular-nums">
            {{ packages.length }}
          </div>
          <div class="text-xs text-muted uppercase tracking-wide">
            Packages
          </div>
        </div>
        <div class="rounded-lg border border-default bg-elevated/60 dark:bg-white/[0.06] px-4 py-3">
          <div class="text-2xl font-bold tabular-nums">
            {{ fmt(totalWeekly) }}
          </div>
          <div class="text-xs text-muted uppercase tracking-wide">
            Downloads / week
          </div>
        </div>
        <div class="rounded-lg border border-default bg-elevated/60 dark:bg-white/[0.06] px-4 py-3">
          <div class="text-2xl font-bold">
            MIT
          </div>
          <div class="text-xs text-muted uppercase tracking-wide">
            Licensed
          </div>
        </div>
        <div class="rounded-lg border border-default bg-elevated/60 dark:bg-white/[0.06] px-4 py-3">
          <div class="text-2xl font-bold">
            Active
          </div>
          <div class="text-xs text-muted uppercase tracking-wide">
            Maintained
          </div>
        </div>
      </div>

      <!-- Package tiles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UPageCard
          v-for="pkg in packages"
          :key="pkg.name"
          variant="subtle"
          class="h-full transition-shadow hover:shadow-lg bg-elevated/60 dark:bg-white/[0.06] ring-1 ring-default dark:ring-white/[0.14]"
        >
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="flex items-start gap-3">
              <div class="flex items-center justify-center size-10 shrink-0 rounded-lg bg-primary/10 text-primary">
                <UIcon
                  :name="pkg.icon"
                  class="size-5"
                />
              </div>
              <div class="min-w-0">
                <h3 class="font-semibold truncate">
                  {{ pkg.name }}
                </h3>
                <p class="text-sm text-muted mt-1">
                  {{ pkg.description }}
                </p>
              </div>
            </div>

            <!-- Links -->
            <div class="flex flex-wrap items-center gap-2 mt-4">
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

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 mt-auto pt-5">
              <div>
                <div class="text-2xl font-bold tabular-nums">
                  {{ fmt(pkg.stats?.weeklyDownloads) }}
                </div>
                <div class="text-xs text-muted uppercase tracking-wide">
                  Downloads / week
                </div>
              </div>
              <div>
                <div class="text-2xl font-bold tabular-nums">
                  {{ fmt(pkg.stats?.stars) }}
                </div>
                <div class="text-xs text-muted uppercase tracking-wide">
                  GitHub stars
                </div>
              </div>
              <div>
                <div class="text-2xl font-bold tabular-nums">
                  {{ pkg.stats?.version ? `v${pkg.stats.version}` : '—' }}
                </div>
                <div class="text-xs text-muted uppercase tracking-wide">
                  Latest
                </div>
              </div>
            </div>
          </div>
        </UPageCard>
      </div>
    </UPageBody>
  </UPage>
</template>
