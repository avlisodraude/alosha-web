<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Open Source — Alosha',
  description: 'Open-source projects maintained by Alosha.'
})

const projects = [
  {
    name: 'pixsqueeze',
    description: 'JavaScript image compressor with server-side HEIC, TIFF & camera-RAW conversion.',
    repo: 'https://github.com/avlisodraude/pixsqueeze',
    npm: 'https://www.npmjs.com/package/pixsqueeze',
    status: 'Active'
  }
]
</script>

<template>
  <UPage>
    <UPageHero
      title="Open Source"
      description="We maintain the open-source projects our products are built on. Use them freely — MIT licensed."
    />
    <UPageBody>
      <div class="space-y-4">
        <UPageCard
          v-for="proj in projects"
          :key="proj.name"
          :title="proj.name"
          :description="proj.description"
        >
          <template #footer>
            <div class="flex flex-wrap items-center gap-3">
              <UBadge
                color="primary"
                variant="subtle"
                size="sm"
              >
                {{ proj.status }}
              </UBadge>
              <UButton
                :to="proj.repo"
                target="_blank"
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-simple-icons-github"
              >
                GitHub
              </UButton>
              <UButton
                :to="proj.npm"
                target="_blank"
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-simple-icons-npm"
              >
                npm
              </UButton>
            </div>
          </template>
        </UPageCard>
      </div>
    </UPageBody>
  </UPage>
</template>
