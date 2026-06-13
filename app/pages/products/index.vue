<script setup lang="ts">
definePageMeta({ layout: 'hub' })

const { productUrl } = useSite()

useSeoMeta({
  title: 'Products — Alosha',
  description: 'Developer products from the Alosha studio, each grown from an open-source foundation. Starting with PixSqueeze.'
})

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

const upcoming = [
  {
    name: 'Monitor',
    icon: 'i-lucide-activity',
    description: 'Hosted browser automation and uptime monitoring for teams — built on the Playwright ecosystem.',
    audience: 'For businesses and development teams'
  },
  {
    name: 'Stride',
    icon: 'i-lucide-footprints',
    description: 'Running analytics for athletes and coaches — turn training data into insight.',
    audience: 'For runners, coaches & endurance athletes'
  }
]
</script>

<template>
  <UPage>
    <UPageHero
      title="Products"
      description="Developer products built and maintained by Alosha, each grown from an open-source foundation."
    />

    <UPageBody>
      <!-- PixSqueeze — featured / live -->
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

      <!-- Upcoming -->
      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold">
            In the pipeline
          </h2>
          <p class="text-muted mt-1">
            Next products in the Alosha portfolio. Want early access? <ULink to="/contact">Get in touch</ULink>.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UPageCard
            v-for="p in upcoming"
            :key="p.name"
            :icon="p.icon"
            :title="p.name"
            :description="p.description"
          >
            <template #footer>
              <div class="flex items-center justify-between w-full">
                <span class="text-sm text-muted">{{ p.audience }}</span>
                <UBadge
                  color="neutral"
                  variant="subtle"
                  size="sm"
                >
                  Coming soon
                </UBadge>
              </div>
            </template>
          </UPageCard>
        </div>
      </section>
    </UPageBody>
  </UPage>
</template>
