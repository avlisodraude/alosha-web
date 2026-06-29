<script setup lang="ts">
/**
 * Demo hub shown on alosha.dev/demo. Each product's real demo lives on its own
 * subdomain (the shared /demo route renders the matching demo per host), so the
 * hub can't render them inline — instead it links out to each live demo.
 */
const { products } = useSite()

// Demo-specific copy, keyed by product slug. Add a package's slug here to give
// it a demo card; products without an entry are skipped.
const demoCopy: Record<string, { tagline: string, cta: string }> = {
  'pixsqueeze': { tagline: 'Compress JPEG, PNG & WebP right in your browser — no upload, no signup.', cta: 'Compress an image' },
  'stride': { tagline: 'Drop a GPX, TCX or FIT file and see pace, splits, elevation and heart-rate zones.', cta: 'Analyse a run' },
  'monitor': { tagline: 'Watch a monitoring run: multi-step checks, assertions, alerts and HTML reports.', cta: 'See a run' },
  'eu-validate': { tagline: 'Validate EU VAT, IBAN, BSN, KvK and postal codes — offline and instant.', cta: 'Validate an identifier' }
}

const demos = computed(() =>
  products
    .filter(p => demoCopy[p.slug])
    .map(p => ({ name: p.name, icon: p.icon, to: `${p.url}/demo`, ...demoCopy[p.slug]! }))
)
</script>

<template>
  <UPage>
    <UPageHero
      title="Try it yourself"
      description="Every Alosha product has a live demo running on its open-source core — right in your browser, nothing uploaded. Pick one to try."
    />

    <UPageBody class="max-w-5xl mx-auto px-4 w-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <UPageCard
          v-for="d in demos"
          :key="d.name"
          :to="d.to"
          target="_blank"
          variant="subtle"
          spotlight
          class="h-full"
        >
          <div class="flex flex-col h-full">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center size-10 shrink-0 rounded-lg bg-primary/10 text-primary">
                <UIcon
                  :name="d.icon"
                  class="size-5"
                />
              </div>
              <h3 class="font-semibold text-lg">
                {{ d.name }}
              </h3>
              <UBadge
                color="primary"
                variant="subtle"
                size="sm"
                class="ml-auto"
              >
                Live demo
              </UBadge>
            </div>

            <p class="text-sm text-muted mt-4">
              {{ d.tagline }}
            </p>

            <div class="mt-auto pt-5">
              <span class="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {{ d.cta }}
                <UIcon name="i-lucide-arrow-up-right" />
              </span>
            </div>
          </div>
        </UPageCard>
      </div>
    </UPageBody>
  </UPage>
</template>
