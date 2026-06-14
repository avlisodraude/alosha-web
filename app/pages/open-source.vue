<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Open Source — Alosha',
  description: 'Open-source projects maintained by Alosha.'
})

// Client-side so the figure is refreshed live from npm on every page load.
const { data: stats } = await useFetch('/api/oss-stats', { server: false })

const nf = new Intl.NumberFormat('en-US')
const fmt = (n?: number | null) => (n == null ? '—' : nf.format(n))
</script>

<template>
  <UPage>
    <UPageHero
      title="Open Source"
      description="We maintain the open-source projects our products are built on. Use them freely — MIT licensed."
    />
    <UPageBody>
      <div class="max-w-2xl mx-auto">
        <UPageCard
          title="pixsqueeze"
          description="JavaScript image compressor with server-side HEIC, TIFF & camera-RAW conversion."
        >
          <!-- Live stats -->
          <div class="grid grid-cols-3 gap-4 mt-2">
            <div>
              <div class="text-2xl font-bold">
                {{ fmt(stats?.weeklyDownloads) }}
              </div>
              <div class="text-xs text-muted uppercase tracking-wide">
                Downloads / week
              </div>
            </div>
            <div>
              <div class="text-2xl font-bold">
                {{ fmt(stats?.stars) }}
              </div>
              <div class="text-xs text-muted uppercase tracking-wide">
                GitHub stars
              </div>
            </div>
            <div>
              <div class="text-2xl font-bold">
                {{ stats?.version ? `v${stats.version}` : '—' }}
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
                to="https://github.com/avlisodraude/pixsqueeze"
                target="_blank"
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-simple-icons-github"
              >
                GitHub
              </UButton>
              <UButton
                to="https://www.npmjs.com/package/pixsqueeze"
                target="_blank"
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-simple-icons-npm"
              >
                npm
              </UButton>
              <UButton
                to="https://pixsqueeze.alosha.dev"
                target="_blank"
                size="xs"
                variant="subtle"
                trailing-icon="i-lucide-arrow-up-right"
              >
                Hosted product
              </UButton>
            </div>
          </template>
        </UPageCard>
      </div>
    </UPageBody>
  </UPage>
</template>
