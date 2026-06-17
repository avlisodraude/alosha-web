<script setup lang="ts">
definePageMeta({ layout: 'hub' })

const { productUrl, monitorUrl, strideUrl, euValidateUrl } = useSite()

useSeoMeta({
  title: 'About — Alosha',
  description: 'The Alosha philosophy: improve open source, distribute it, build sustainable products with AI-assisted development. The portfolio today: PixSqueeze, Monitor, Stride and eu-validate.'
})

const portfolio = [
  { name: 'PixSqueeze', icon: 'i-lucide-image', description: 'Image compression API with HEIC, TIFF & camera-RAW conversion.', to: productUrl },
  { name: 'Monitor', icon: 'i-lucide-activity', description: 'Playwright-based website monitoring with alerts and HTML reports.', to: monitorUrl },
  { name: 'Stride', icon: 'i-lucide-footprints', description: 'GPX, TCX & FIT running analytics and Chart.js dashboards.', to: strideUrl },
  { name: 'eu-validate', icon: 'i-lucide-badge-check', description: 'Offline, checksum-accurate EU VAT, IBAN, BSN & KvK validation.', to: euValidateUrl }
]
</script>

<template>
  <UPage>
    <UPageHero
      title="About Alosha"
      description="A solo-founder software studio operating as Product Owner, using AI to build and maintain a portfolio of developer products."
    />
    <UPageBody>
      <div class="prose dark:prose-invert max-w-2xl mx-auto">
        <p>
          Alosha identifies useful but underserved open-source projects, improves them, and builds
          trust within the developer community. A portion of that audience becomes customers of hosted
          services, premium features, and mobile apps.
        </p>
        <p>
          The asset isn't any single codebase — it's the repeatable process: identify opportunities,
          improve existing solutions, distribute through open source, and leverage AI to accelerate
          execution. That's how a small team, or one founder, can sustainably run several products.
        </p>
        <p>
          Today that portfolio spans four products — <strong>PixSqueeze</strong> for image
          compression, <strong>Monitor</strong> for website monitoring, <strong>Stride</strong> for
          running analytics, and <strong>eu-validate</strong> for offline EU identifier validation —
          each built on an open-source core that anyone can use freely.
        </p>
      </div>

      <div class="max-w-3xl mx-auto mt-12">
        <h2 class="text-sm font-semibold text-muted uppercase tracking-wide mb-4 text-center">
          The portfolio today
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UPageCard
            v-for="p in portfolio"
            :key="p.name"
            :icon="p.icon"
            :title="p.name"
            :description="p.description"
            :to="p.to"
            target="_blank"
            variant="subtle"
            spotlight
          />
        </div>
      </div>
    </UPageBody>
  </UPage>
</template>
