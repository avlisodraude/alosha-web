<script setup lang="ts">
definePageMeta({ layout: 'hub' })

const { products } = useSite()

useSeoMeta({
  title: 'About — Alosha',
  description: 'The Alosha philosophy: improve open source, distribute it, build sustainable products with AI-assisted development. The portfolio today: PixSqueeze, Monitor, Stride and eu-validate.'
})

useBreadcrumbs([
  { name: 'Home', path: '/' },
  { name: 'About' }
])

const steps = [
  { icon: 'i-lucide-git-branch', title: 'Open source', description: 'Find a useful but underserved project, make it genuinely better, and ship it in the open under a permissive license.' },
  { icon: 'i-lucide-heart-handshake', title: 'Trust', description: 'Developers adopt it, file issues, and star it. Credibility compounds in public — no marketing required.' },
  { icon: 'i-lucide-rocket', title: 'Product', description: 'A hosted service or premium tier turns that trust into a sustainable product, while the core stays free.' }
]

// Portfolio comes from the registry — no per-package edits here.
const portfolio = products
</script>

<template>
  <UPage>
    <UPageHero
      title="About Alosha"
      description="A solo-founder software studio operating as Product Owner, using AI to build and maintain a portfolio of developer products."
      :ui="{ container: 'py-12 sm:py-16 lg:py-20' }"
    />
    <UPageBody>
      <!-- Intro -->
      <div class="max-w-2xl mx-auto space-y-5">
        <p class="text-xl text-highlighted leading-relaxed font-medium">
          Alosha is a one-person software studio with a deliberately narrow approach: find a useful
          but underserved open-source project, make it genuinely better, and earn trust by building
          in the open.
        </p>
        <p class="text-base text-default leading-relaxed">
          A share of that audience becomes customers of hosted services and premium tiers — which
          funds the next project. The asset isn't any single codebase; it's the loop. Identify an
          opportunity, improve what already exists, distribute through open source, and lean on AI to
          move fast. That's what lets one founder sustainably run several products at once.
        </p>
      </div>

      <!-- How we build -->
      <div class="max-w-4xl mx-auto mt-16">
        <h2 class="text-xl font-bold text-highlighted text-center">
          How we build
        </h2>
        <p class="text-muted text-center mt-1">
          One repeatable loop, run with AI as the execution layer.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="rounded-xl border border-default bg-elevated/40 p-6"
          >
            <div class="flex items-center justify-between">
              <UIcon
                :name="step.icon"
                class="size-6 text-primary"
              />
              <span class="text-xs font-mono text-muted">0{{ i + 1 }}</span>
            </div>
            <h3 class="font-semibold text-highlighted mt-3">
              {{ step.title }}
            </h3>
            <p class="text-sm text-toned mt-1 leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Portfolio -->
      <div class="max-w-4xl mx-auto mt-16">
        <h2 class="text-xl font-bold text-highlighted text-center">
          The portfolio today
        </h2>
        <p class="text-muted text-center mt-1">
          Four products, each built on an open-source core anyone can use freely.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <UPageCard
            v-for="p in portfolio"
            :key="p.slug"
            :icon="p.icon"
            :title="p.name"
            :description="p.blurb"
            :to="p.url"
            target="_blank"
            variant="subtle"
            spotlight
          />
        </div>
      </div>
    </UPageBody>
  </UPage>
</template>
