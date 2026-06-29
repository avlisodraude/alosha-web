<script setup lang="ts">
definePageMeta({ layout: 'hub' })

const { products } = useSite()

useSeoMeta({
  title: 'Support & Custom Work — Alosha',
  description: 'Founder-backed support, hosted tiers and custom development for the Alosha toolkit. The open-source core stays free; pay only for hosted features, priority help, or bespoke work.',
  ogTitle: 'Support & Custom Work — Alosha',
  ogDescription: 'Founder-backed support, hosted tiers and custom development for the Alosha toolkit.',
  ogImage: 'https://alosha.dev/og.png',
  ogUrl: 'https://alosha.dev/support',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://alosha.dev/og.png'
})

useBreadcrumbs([
  { name: 'Home', path: '/' },
  { name: 'Support' }
])

// Honest tiers for a solo-maintained studio — no faux-enterprise SLAs.
const tiers = [
  {
    name: 'Community',
    price: 'Free',
    icon: 'i-lucide-git-pull-request-arrow',
    description: 'Everything open-source, forever.',
    features: [
      'Full MIT-licensed packages on npm',
      'Public issue tracker on GitHub',
      'Docs, recipes and live demos',
      'Best-effort community help'
    ],
    cta: { label: 'Browse the source', to: '/open-source', variant: 'outline' as const }
  },
  {
    name: 'Priority Support',
    price: 'Let\'s talk',
    icon: 'i-lucide-life-buoy',
    highlight: true,
    description: 'A direct line to the person who wrote the code.',
    features: [
      'Private email channel, fast turnaround',
      'Prioritised bug fixes and releases',
      'Help integrating a package into your stack',
      'Guidance on upgrades and edge cases'
    ],
    cta: { label: 'Get in touch', to: 'mailto:hello@alosha.dev', variant: 'solid' as const }
  },
  {
    name: 'Custom Work',
    price: 'Project-based',
    icon: 'i-lucide-hammer',
    description: 'Need something the open-source core does not cover?',
    features: [
      'New features or country/format coverage',
      'Private packages built to your spec',
      'Hosted/self-hosted deployment help',
      'Consulting on architecture and DX'
    ],
    cta: { label: 'Describe your project', to: 'mailto:hello@alosha.dev', variant: 'outline' as const }
  }
]

// Products that already offer (or will offer) a paid hosted tier on top of the
// free core — surfaced straight from the registry.
const hosted = [
  { product: products.find(p => p.slug === 'pixsqueeze'), note: 'Hosted batch compression API with a free 100-image tier.', status: 'Live' },
  { product: products.find(p => p.slug === 'eu-validate'), note: 'Hosted VIES VAT & KvK registration lookups via @alosha/eu-validate/cloud.', status: 'Coming soon' }
].filter(h => h.product)
</script>

<template>
  <UPage>
    <UPageHero
      title="Support & custom work"
      description="Every Alosha package is free and MIT-licensed. When you need more — a hosted feature, a fast answer, or bespoke work — there is a paid path, backed by the founder rather than a ticket queue."
    />

    <UPageBody class="max-w-5xl mx-auto px-4 w-full">
      <!-- Tiers -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard
          v-for="tier in tiers"
          :key="tier.name"
          :class="tier.highlight ? 'ring-2 ring-primary' : ''"
          class="flex flex-col"
        >
          <template #header>
            <div class="flex items-center gap-2.5">
              <UIcon
                :name="tier.icon"
                class="size-5 text-primary"
              />
              <span class="font-semibold">{{ tier.name }}</span>
              <UBadge
                v-if="tier.highlight"
                color="primary"
                variant="subtle"
                size="sm"
                class="ml-auto"
              >
                Most popular
              </UBadge>
            </div>
            <div class="mt-3 text-2xl font-bold">
              {{ tier.price }}
            </div>
            <p class="text-sm text-muted mt-1">
              {{ tier.description }}
            </p>
          </template>

          <ul class="space-y-2 text-sm flex-1">
            <li
              v-for="f in tier.features"
              :key="f"
              class="flex items-start gap-2"
            >
              <UIcon
                name="i-lucide-check"
                class="text-primary shrink-0 mt-0.5"
              />
              <span>{{ f }}</span>
            </li>
          </ul>

          <template #footer>
            <UButton
              :to="tier.cta.to"
              :variant="tier.cta.variant"
              :class="tier.highlight ? 'btn-grad' : ''"
              block
            >
              {{ tier.cta.label }}
            </UButton>
          </template>
        </UCard>
      </div>

      <!-- Hosted tiers per product -->
      <section class="mt-14">
        <h2 class="text-xl font-bold">
          Hosted tiers
        </h2>
        <p class="text-muted mt-1">
          Some packages have a hosted service on top of the free core — you pay only for the network-backed part.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          <UPageCard
            v-for="h in hosted"
            :key="h.product!.slug"
            :icon="h.product!.icon"
            :title="h.product!.name"
            :description="h.note"
            variant="subtle"
          >
            <template #footer>
              <div class="flex items-center justify-between w-full gap-2">
                <UButton
                  :to="h.product!.url"
                  target="_blank"
                  size="xs"
                  variant="subtle"
                  trailing-icon="i-lucide-arrow-up-right"
                >
                  Open {{ h.product!.name }}
                </UButton>
                <UBadge
                  :color="h.status === 'Live' ? 'primary' : 'neutral'"
                  variant="subtle"
                  size="sm"
                >
                  {{ h.status }}
                </UBadge>
              </div>
            </template>
          </UPageCard>
        </div>
      </section>

      <UPageCTA
        class="mt-14"
        title="Tell me what you need"
        description="Whether it's a production incident, a feature you'd sponsor, or a one-off integration — email hello@alosha.dev and you'll hear back from the maintainer directly."
        variant="subtle"
        :links="[
          { label: 'Email hello@alosha.dev', to: 'mailto:hello@alosha.dev', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
          { label: 'Use the contact form', to: '/contact', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageBody>
  </UPage>
</template>
