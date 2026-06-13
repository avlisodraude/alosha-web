<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Blog — Alosha',
  description: 'Notes on open-source maintenance, AI-assisted development, and building products.'
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Blog"
      description="Notes on open-source maintenance, AI-assisted development, and building products in the open."
    />
    <UPageBody>
      <div class="max-w-xl mx-auto text-center text-muted">
        <UIcon
          name="i-lucide-pencil-line"
          class="size-8 mx-auto mb-3"
        />
        <p>First posts are on the way. Check back soon.</p>
      </div>
    </UPageBody>
  </UPage>
</template>
