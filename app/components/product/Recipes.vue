<script setup lang="ts">
/**
 * Problem-centric production recipes — the Phase-2 four-step formula:
 *   problem → solution (copy-paste code) → why it works → live sandbox.
 *
 * Reusable across every product landing. Pass an array of recipes:
 *
 *   <ProductRecipes :recipes="recipes" />
 */
export interface Recipe {
  /** Short engineering-problem title. */
  title: string
  /** One-line real-world problem statement. */
  problem: string
  /** Complete, copy-pasteable snippet — no boilerplate omitted. */
  code: string
  /** 2–3 sentence "why this works under stress" breakdown. */
  why: string
  /** Optional live playground (StackBlitz / CodeSandbox) URL. */
  sandbox?: string
}

withDefaults(
  defineProps<{
    recipes: Recipe[]
    title?: string
    description?: string
  }>(),
  {
    title: 'Production recipes',
    description: 'Real problems, complete solutions — copy, paste, ship.'
  }
)
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
  >
    <div class="grid gap-6 lg:gap-8 max-w-3xl mx-auto">
      <UCard
        v-for="recipe in recipes"
        :key="recipe.title"
        variant="subtle"
        class="overflow-hidden"
      >
        <template #header>
          <div class="flex items-start gap-3">
            <UIcon
              name="i-lucide-wrench"
              class="size-5 text-primary mt-0.5 shrink-0"
            />
            <div>
              <h3 class="font-semibold text-lg text-highlighted">
                {{ recipe.title }}
              </h3>
              <p class="text-sm text-muted mt-1">
                <span class="font-medium text-default">The problem:</span> {{ recipe.problem }}
              </p>
            </div>
          </div>
        </template>

        <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-5 text-sm font-mono text-green-400 overflow-x-auto shadow-lg">
          <pre>{{ recipe.code }}</pre>
        </div>

        <div class="flex gap-2.5 mt-4 text-sm text-muted">
          <UIcon
            name="i-lucide-lightbulb"
            class="size-4 text-primary mt-0.5 shrink-0"
          />
          <p><span class="font-medium text-default">Why it works:</span> {{ recipe.why }}</p>
        </div>

        <template
          v-if="recipe.sandbox"
          #footer
        >
          <UButton
            :to="recipe.sandbox"
            target="_blank"
            variant="link"
            color="primary"
            class="px-0"
            icon="i-lucide-play"
            trailing-icon="i-lucide-arrow-up-right"
          >
            Open live sandbox
          </UButton>
        </template>
      </UCard>
    </div>
  </UPageSection>
</template>
