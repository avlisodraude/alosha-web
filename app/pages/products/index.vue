<script setup lang="ts">
definePageMeta({ layout: 'hub' })

const { productUrl } = useSite()

useSeoMeta({
  title: 'Products — Alosha',
  description: 'Commercial products from the Alosha studio.'
})

const products = [
  {
    name: 'PixSqueeze',
    status: 'Live',
    description: 'Image compression API with HEIC, TIFF & camera-RAW conversion. Free tier, hosted batch API.',
    icon: 'i-lucide-image',
    to: productUrl,
    external: true
  },
  {
    name: 'Monitor',
    status: 'Coming soon',
    description: 'Hosted browser automation and uptime monitoring for teams.',
    icon: 'i-lucide-activity',
    to: '/contact',
    external: false
  },
  {
    name: 'Stride',
    status: 'Coming soon',
    description: 'Running analytics for athletes and coaches.',
    icon: 'i-lucide-footprints',
    to: '/contact',
    external: false
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UPageCard
          v-for="p in products"
          :key="p.name"
          :icon="p.icon"
          :title="p.name"
          :description="p.description"
          :to="p.to"
          :target="p.external ? '_blank' : undefined"
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
    </UPageBody>
  </UPage>
</template>
