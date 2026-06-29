<script setup lang="ts">
definePageMeta({ layout: 'hub' })

const { productUrl, products } = useSite()

useSeoMeta({
  title: 'Products — Alosha',
  description: 'Developer products built and maintained by Alosha — PixSqueeze, Monitor, Stride and eu-validate. Each grown from an open-source foundation.',
  ogTitle: 'Products — Alosha',
  ogDescription: 'Developer products built and maintained by Alosha — PixSqueeze, Monitor, Stride and eu-validate.',
  ogImage: 'https://alosha.dev/og.png',
  ogUrl: 'https://alosha.dev/products',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://alosha.dev/og.png'
})

useBreadcrumbs([
  { name: 'Home', path: '/' },
  { name: 'Products' }
])

const { data: stats } = await useFetch('/api/oss-stats')
const nf = new Intl.NumberFormat('en-US')
const fmt = (n?: number | null) => (n == null ? '—' : nf.format(n))

const pixsqueezeFeatures = [
  { icon: 'i-lucide-image', title: 'HEIC, TIFF & RAW conversion', description: 'Convert formats browsers can\'t read natively — iPhone HEIC, TIFF, and camera RAW — server-side.' },
  { icon: 'i-lucide-zap', title: 'Batch in one call', description: 'Send up to 1,000 images per request and get compressed results back in a single response.' },
  { icon: 'i-lucide-shield-check', title: 'Private by default', description: 'Images are processed in-memory and never stored. Your files stay yours.' },
  { icon: 'i-lucide-code-2', title: 'One endpoint, any stack', description: 'A single REST endpoint and API key. Works from curl, Node, Python — anything.' }
]

const pixsqueezePlans = [
  { name: 'Free', price: '$0', detail: '100 images / mo' },
  { name: 'Starter', price: '$9', detail: '2,000 images / mo' },
  { name: 'Pro', price: '$29', detail: '20,000 images / mo', highlight: true },
  { name: 'Business', price: '$99', detail: 'Unlimited' }
]

// The rest of the portfolio — everything except the featured hosted product —
// straight from the registry, with live npm stats joined by statsKey.
const moreProducts = computed(() =>
  products
    .filter(p => p.site !== 'product')
    .map(p => ({
      ...p,
      stats: p.statsKey ? (stats.value as unknown as Record<string, PackageStats | undefined>)?.[p.statsKey] : undefined
    }))
)

interface PackageStats {
  downloads: number | null
  weeklyDownloads: number | null
  version: string | null
  stars: number | null
}
</script>

<template>
  <UPage>
    <UPageHero
      title="Products"
      description="Developer products built and maintained by Alosha, each grown from an open-source foundation."
    />

    <UPageBody class="max-w-5xl mx-auto px-4 w-full">
      <!-- PixSqueeze — featured / hosted product -->
      <section class="space-y-8">
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-image"
            class="size-7 text-primary"
          />
          <h2 class="text-2xl font-bold">
            PixSqueeze
          </h2>
          <UBadge
            color="primary"
            variant="subtle"
            size="sm"
          >
            Live
          </UBadge>
          <UBadge
            color="neutral"
            variant="subtle"
            size="sm"
          >
            Hosted API
          </UBadge>
        </div>

        <p class="text-muted max-w-2xl">
          Compressing user-uploaded images in the browser is lossy and inconsistent, and browsers
          can't even read iPhone HEIC, TIFF, or camera RAW. <strong class="text-default">PixSqueeze</strong>
          handles compression and format conversion through one simple API — with an open-source core you can
          self-host and a hosted batch tier when you need scale.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <UPageCard
            v-for="f in pixsqueezeFeatures"
            :key="f.title"
            :icon="f.icon"
            :title="f.title"
            :description="f.description"
            variant="subtle"
          />
        </div>

        <!-- Pricing summary -->
        <div>
          <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
            Pricing
          </h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <UCard
              v-for="plan in pixsqueezePlans"
              :key="plan.name"
              :class="plan.highlight ? 'ring-2 ring-primary' : ''"
            >
              <div class="flex items-center justify-between">
                <span class="font-semibold">{{ plan.name }}</span>
                <UBadge
                  v-if="plan.highlight"
                  color="primary"
                  variant="subtle"
                  size="sm"
                >
                  Popular
                </UBadge>
              </div>
              <div class="mt-1 text-2xl font-bold">
                {{ plan.price }}<span class="text-sm text-muted font-normal">/mo</span>
              </div>
              <p class="text-sm text-muted mt-1">
                {{ plan.detail }}
              </p>
            </UCard>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <UButton
            :to="productUrl"
            target="_blank"
            size="lg"
            trailing-icon="i-lucide-arrow-up-right"
            class="btn-grad"
          >
            Open PixSqueeze
          </UButton>
          <UButton
            :to="`${productUrl}/docs`"
            target="_blank"
            size="lg"
            color="neutral"
            variant="outline"
          >
            API docs
          </UButton>
        </div>
      </section>

      <USeparator class="my-12" />

      <!-- The rest of the portfolio — all live -->
      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold">
            More from Alosha
          </h2>
          <p class="text-muted mt-1">
            Open-source-first packages, each with its own home and live on npm.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UPageCard
            v-for="p in moreProducts"
            :key="p.slug"
            variant="subtle"
            class="h-full"
          >
            <div class="flex flex-col h-full">
              <div class="flex items-start gap-3">
                <div class="flex items-center justify-center size-10 shrink-0 rounded-lg bg-primary/10 text-primary">
                  <UIcon
                    :name="p.icon"
                    class="size-5"
                  />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold">
                      {{ p.name }}
                    </h3>
                    <UBadge
                      color="primary"
                      variant="subtle"
                      size="sm"
                    >
                      Live
                    </UBadge>
                  </div>
                  <p class="text-xs text-muted mt-0.5">
                    {{ p.audience }}
                  </p>
                </div>
              </div>

              <p class="text-sm text-muted mt-4">
                {{ p.blurb }}
              </p>

              <!-- Live npm signal -->
              <div class="grid grid-cols-2 gap-3 mt-5">
                <div>
                  <div class="text-lg font-bold tabular-nums">
                    {{ fmt(p.stats?.weeklyDownloads) }}
                  </div>
                  <div class="text-xs text-muted uppercase tracking-wide">
                    Downloads / week
                  </div>
                </div>
                <div>
                  <div class="text-lg font-bold tabular-nums">
                    {{ p.stats?.version ? `v${p.stats.version}` : '—' }}
                  </div>
                  <div class="text-xs text-muted uppercase tracking-wide">
                    Latest
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2 mt-auto pt-5 border-t border-default">
                <UButton
                  :to="p.url"
                  target="_blank"
                  size="xs"
                  variant="subtle"
                  trailing-icon="i-lucide-arrow-up-right"
                >
                  Open
                </UButton>
                <UButton
                  :to="p.repo"
                  target="_blank"
                  size="xs"
                  color="neutral"
                  variant="outline"
                  icon="i-simple-icons-github"
                >
                  GitHub
                </UButton>
                <UButton
                  :to="p.npm"
                  target="_blank"
                  size="xs"
                  color="neutral"
                  variant="outline"
                  icon="i-simple-icons-npm"
                >
                  npm
                </UButton>
              </div>
            </div>
          </UPageCard>
        </div>
      </section>

      <UPageCTA
        class="mt-12"
        title="Built in the open"
        description="Every product starts as an MIT-licensed package you can use and self-host. See the source and live download stats."
        variant="subtle"
        :links="[
          { label: 'Explore open source', to: '/open-source', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
          { label: 'Get in touch', to: '/contact', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageBody>
  </UPage>
</template>
