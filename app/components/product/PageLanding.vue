<script setup lang="ts">
/**
 * Generic, data-driven landing page for an open-source package product.
 *
 * Renders any package's marketing page from a LandingConfig (see
 * `app/utils/landings.ts`) plus the resolved product registry entry. Adding a
 * package needs no new component — just a registry entry and a landing config.
 *
 * Hero action links, npm/GitHub links, SEO URLs and structured data are all
 * derived from the product, so the config never repeats them.
 */
import type { LandingConfig } from '~/utils/landings'
import type { ResolvedProduct } from '~/utils/products'

const props = defineProps<{
  config: LandingConfig
  product: ResolvedProduct
}>()

const { config, product } = props

const ogImage = `${product.url}/og-${product.slug}.png`

useSeoMeta({
  title: config.seo.title,
  description: config.seo.description,
  ogTitle: config.seo.title,
  ogDescription: config.seo.description,
  ogUrl: product.url,
  ogImage,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  'name': product.npmName,
  'applicationCategory': 'DeveloperApplication',
  'operatingSystem': config.os,
  'description': config.seo.description,
  'url': product.url,
  'image': ogImage,
  'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
  'publisher': { '@type': 'Organization', 'name': 'Alosha', 'url': 'https://alosha.dev' }
})

const heroLinks = [
  { label: 'Live demo', to: '/demo', icon: 'i-lucide-play', size: 'xl' as const, class: 'btn-grad' },
  { label: 'Get started free', to: product.npm, target: '_blank', trailingIcon: 'i-lucide-arrow-right', size: 'xl' as const, color: 'neutral' as const, variant: 'subtle' as const },
  { label: 'View on GitHub', to: product.repo, target: '_blank', size: 'xl' as const, color: 'neutral' as const, variant: 'subtle' as const, icon: 'i-simple-icons-github' }
]

const supportLinks = [
  config.supportPrimary
    ? { label: config.supportPrimary.label, to: config.supportPrimary.to, trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' }
    : { label: `npm install ${product.npmName}`, to: product.npm, target: '_blank', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
  { label: 'View on GitHub', to: product.repo, target: '_blank', icon: 'i-simple-icons-github', color: 'neutral' as const, variant: 'outline' as const }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <UPageHero
      class="hero-glow"
      :links="heroLinks"
    >
      <template #headline>
        <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-default bg-default font-mono text-xs text-muted">
          <span class="size-1.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(16,185,129,.25)]" />
          {{ config.headline }}
        </span>
      </template>
      <template #title>
        {{ config.titleLead }}<br><span class="text-grad">{{ config.titleAccent }}</span>
      </template>
      <template #description>
        <p class="text-lg text-muted max-w-xl mx-auto">
          {{ config.description }}
          <strong
            v-if="config.descriptionStrong"
            class="text-default"
          >{{ config.descriptionStrong }}</strong>
        </p>
      </template>

      <template #default>
        <div
          v-if="config.heroChips?.length"
          class="flex flex-wrap justify-center items-center gap-2 mt-6"
        >
          <UBadge
            v-for="chip in config.heroChips"
            :key="chip"
            color="primary"
            variant="subtle"
            size="lg"
            class="font-mono"
          >
            .{{ chip }}
          </UBadge>
          <span
            v-if="config.heroChipsNote"
            class="text-muted text-sm ml-1"
          >{{ config.heroChipsNote }}</span>
        </div>
        <ProductBadges
          :pkg="product.npmName"
          :badges="config.badges"
          :class="config.heroChips?.length ? 'mt-4' : 'mt-6'"
        />
      </template>
    </UPageHero>

    <!-- Quickstart code -->
    <UPageSection
      :title="config.codeTitle"
      :description="config.codeDescription"
    >
      <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-5 text-sm font-mono text-green-400 overflow-x-auto max-w-2xl mx-auto shadow-lg">
        <pre>{{ config.code }}</pre>
      </div>
    </UPageSection>

    <!-- Features -->
    <UPageSection
      :title="config.featuresTitle"
      :description="config.featuresDescription"
      :features="config.features"
    />

    <!-- Optional CLI / extra code demo -->
    <UPageSection
      v-if="config.cliDemo"
      :title="config.cliDemo.title"
      :description="config.cliDemo.description"
    >
      <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-5 text-sm font-mono text-green-400 overflow-x-auto max-w-2xl mx-auto shadow-lg">
        <pre>{{ config.cliDemo.code }}</pre>
      </div>
    </UPageSection>

    <!-- Production recipes -->
    <ProductRecipes
      :title="config.recipesTitle"
      :description="config.recipesDescription"
      :recipes="config.recipes"
    />

    <!-- Trust / compliance matrix -->
    <ProductTrustMatrix :rows="config.trustRows" />

    <!-- Commercial gateway -->
    <ProductSupportCTA
      :brand="product.name"
      :title="config.supportTitle"
      :points="config.supportPoints"
      :links="supportLinks"
    />
  </div>
</template>
