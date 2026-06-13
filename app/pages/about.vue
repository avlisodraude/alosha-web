<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'About — Alosha',
  description: 'The Alosha philosophy: improve open source, distribute it, build sustainable products with AI-assisted development.'
})
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
      </div>
    </UPageBody>
  </UPage>
</template>
