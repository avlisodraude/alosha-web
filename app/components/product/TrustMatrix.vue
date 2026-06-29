<script setup lang="ts">
/**
 * Enterprise risk & compliance matrix (Phase-2). Reassures technical
 * decision-makers evaluating a third-party dependency. Every row should state
 * a TRUE, verifiable fact about the package.
 *
 *   <ProductTrustMatrix :rows="rows" />
 */
export interface TrustRow {
  /** Metric or concern, e.g. "Bundle size". */
  metric: string
  /** The concrete target/standard met, e.g. "~3 KB min+gzip". */
  target: string
  /** Why a commercial evaluator should care. */
  value: string
  /** Optional lucide icon name. */
  icon?: string
}

withDefaults(
  defineProps<{
    rows: TrustRow[]
    title?: string
    description?: string
  }>(),
  {
    title: 'Built to pass a dependency review',
    description: 'The questions a CTO asks before adding a package to production — answered up front.'
  }
)
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
  >
    <div class="max-w-3xl mx-auto overflow-x-auto rounded-xl border border-default">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="bg-elevated/50 text-muted">
          <tr>
            <th class="font-semibold px-4 py-3">
              Metric / concern
            </th>
            <th class="font-semibold px-4 py-3">
              What ships
            </th>
            <th class="font-semibold px-4 py-3 hidden sm:table-cell">
              Why it matters
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.metric"
            class="border-t border-default align-top"
          >
            <td class="px-4 py-3 font-medium text-highlighted whitespace-nowrap">
              <span class="inline-flex items-center gap-2">
                <UIcon
                  v-if="row.icon"
                  :name="row.icon"
                  class="size-4 text-primary shrink-0"
                />
                {{ row.metric }}
              </span>
            </td>
            <td class="px-4 py-3 text-default font-mono text-xs">
              {{ row.target }}
            </td>
            <td class="px-4 py-3 text-muted hidden sm:table-cell">
              {{ row.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UPageSection>
</template>
