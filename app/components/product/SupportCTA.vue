<script setup lang="ts">
/**
 * Commercial / support gateway (Phase-1 footer, Phase-4 commercial gateway).
 *
 * Deliberately framed as *founder-backed support and paid add-ons* rather than
 * faux-enterprise SLAs — the honest pitch for a solo-maintained ecosystem.
 * The gate is real paid value (hosted endpoints, custom work, priority help),
 * never the MIT-licensed code itself.
 *
 *   <ProductSupportCTA brand="eu-validate" :points="[...]" :links="[...]" />
 */
import type { ButtonProps } from '@nuxt/ui'

withDefaults(
  defineProps<{
    brand: string
    title?: string
    description?: string
    /** Short value lines for the commercial / paid tier. */
    points?: string[]
    links?: ButtonProps[]
  }>(),
  {
    title: 'Need more than the open-source core?',
    description: undefined,
    points: () => [],
    links: () => []
  }
)
</script>

<template>
  <UPageSection>
    <UPageCTA
      :title="title"
      :description="description || `${brand} is free and MIT-licensed. When you need a hosted feature, a custom build, or a fast answer from the person who wrote it, there is a paid path — backed by the founder, not a ticket queue.`"
      variant="subtle"
      :links="links"
    >
      <template
        v-if="points.length"
        #default
      >
        <ul class="grid sm:grid-cols-2 gap-3 mt-6 text-left max-w-xl mx-auto">
          <li
            v-for="point in points"
            :key="point"
            class="flex items-start gap-2.5 text-sm text-muted"
          >
            <UIcon
              name="i-lucide-check-circle-2"
              class="size-4 text-primary mt-0.5 shrink-0"
            />
            <span>{{ point }}</span>
          </li>
        </ul>
      </template>
    </UPageCTA>
  </UPageSection>
</template>
