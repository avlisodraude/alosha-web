<script setup lang="ts">
/**
 * Business use-case section for a package landing (Phase-2 commercial surface).
 *
 * Renders risk-assessment use cases plus two self-contained visuals — a latency
 * comparison chart and an architecture flow diagram — driven entirely by a
 * UseCasesConfig. Built with Nuxt UI + Tailwind only; no charting dependency.
 *
 *   <ProductUseCases :config="config.useCases" />
 */
import type { UseCasesConfig } from '~/utils/landings'

const props = defineProps<{ config: UseCasesConfig }>()

const maxVal = computed(() =>
  Math.max(...props.config.chart.bars.map(b => b.value))
)

/** Bar width as a % of the largest bar, with a visible minimum sliver. */
function barWidth(value: number): string {
  return `${Math.max((value / maxVal.value) * 100, 1.5)}%`
}

/** Format a bar value according to the chart's unit. */
function fmtValue(value: number): string {
  if (props.config.chart.unit === 'usd') {
    return `$${Math.round(value).toLocaleString('en-US')}/mo`
  }
  if (props.config.chart.unit === 'days') {
    return value < 1 ? '~0 days' : `~${Math.round(value).toLocaleString('en-US')} dev-days`
  }
  return value < 1 ? '~0 ms' : `${Math.round(value).toLocaleString('en-US')} ms`
}
</script>

<template>
  <UPageSection
    :title="config.title"
    :description="config.description"
  >
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Risk-assessment use cases -->
      <UCard
        v-for="uc in config.cases"
        :key="uc.title"
        variant="subtle"
      >
        <template #header>
          <div class="flex items-start gap-3">
            <UIcon
              :name="uc.icon"
              class="size-5 text-primary mt-0.5 shrink-0"
            />
            <div>
              <h3 class="font-semibold text-lg text-highlighted">
                {{ uc.title }}
              </h3>
              <p class="text-sm text-muted mt-1">
                {{ uc.lead }}
              </p>
            </div>
          </div>
        </template>

        <p class="text-xs font-medium uppercase tracking-wide text-muted mb-3">
          {{ config.risksLabel }}
        </p>
        <ul class="grid sm:grid-cols-3 gap-3">
          <li
            v-for="risk in uc.risks"
            :key="risk.label"
            class="rounded-lg border border-default bg-elevated/40 p-3"
          >
            <div class="flex items-center gap-2 text-default font-medium text-sm">
              <UIcon
                :name="risk.icon"
                class="size-4 text-amber-500 shrink-0"
              />
              {{ risk.label }}
            </div>
            <p class="text-xs text-muted mt-1.5">
              {{ risk.detail }}
            </p>
          </li>
        </ul>

        <template #footer>
          <div class="flex gap-2.5 text-sm">
            <UIcon
              name="i-lucide-shield-check"
              class="size-4 text-primary mt-0.5 shrink-0"
            />
            <p class="text-muted">
              <span class="font-medium text-default">With {{ config.mitigationBrand }}:</span> {{ uc.mitigation }}
            </p>
          </div>
        </template>
      </UCard>

      <!-- Comparison chart (latency or cost) -->
      <UCard variant="subtle">
        <template #header>
          <h3 class="font-semibold text-base text-highlighted">
            {{ config.chart.title }}
          </h3>
          <p class="text-sm text-muted mt-1">
            {{ config.chart.description }}
          </p>
        </template>

        <div class="space-y-3.5">
          <div
            v-for="bar in config.chart.bars"
            :key="bar.label"
          >
            <div class="flex items-baseline justify-between gap-3 mb-1">
              <span
                class="text-sm"
                :class="bar.highlight ? 'font-semibold text-highlighted' : 'text-default'"
              >{{ bar.label }}</span>
              <span
                class="font-mono text-xs shrink-0"
                :class="bar.highlight ? 'text-primary' : 'text-muted'"
              >{{ fmtValue(bar.value) }}</span>
            </div>
            <div class="h-2.5 w-full rounded-full bg-elevated overflow-hidden">
              <div
                class="h-full rounded-full"
                :class="bar.highlight ? 'bg-primary' : 'bg-amber-500/80'"
                :style="{ width: barWidth(bar.value) }"
              />
            </div>
            <p
              v-if="bar.note"
              class="text-xs text-muted mt-1"
            >
              {{ bar.note }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Architecture flow diagram (optional) -->
      <UCard
        v-if="config.flow"
        variant="subtle"
      >
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Network path -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <UIcon
                name="i-lucide-shield-alert"
                class="size-4 text-amber-500"
              />
              <span class="font-medium text-sm text-highlighted">{{ config.flow?.networkLabel }}</span>
            </div>
            <div class="rounded-lg border border-dashed border-amber-500/50 p-3">
              <span class="text-xs uppercase tracking-wide text-muted">Your trust boundary</span>
              <div class="mt-2 inline-flex items-center gap-2 rounded-md border border-default bg-elevated/50 px-3 py-2 text-sm">
                <UIcon
                  name="i-lucide-app-window"
                  class="size-4 text-muted"
                />
                Your app
              </div>
            </div>
            <div class="flex items-center justify-center gap-2 my-2 text-amber-500">
              <UIcon
                name="i-lucide-arrow-down"
                class="size-4 shrink-0"
              />
              <span class="text-xs">ID + client IP leave the boundary</span>
            </div>
            <div class="inline-flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
              <UIcon
                name="i-lucide-cloud"
                class="size-4 text-amber-500 shrink-0"
              />
              External validator (VIES / API)
            </div>
            <p class="text-xs text-muted mt-3">
              {{ config.flow?.networkNote }}
            </p>
          </div>

          <!-- Offline path -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <UIcon
                name="i-lucide-shield-check"
                class="size-4 text-primary"
              />
              <span class="font-medium text-sm text-highlighted">{{ config.flow?.offlineLabel }}</span>
            </div>
            <div class="rounded-lg border border-dashed border-primary/50 p-3">
              <span class="text-xs uppercase tracking-wide text-muted">Your trust boundary</span>
              <div class="mt-2 flex flex-col gap-2">
                <div class="inline-flex items-center gap-2 rounded-md border border-default bg-elevated/50 px-3 py-2 text-sm w-fit">
                  <UIcon
                    name="i-lucide-app-window"
                    class="size-4 text-muted shrink-0"
                  />
                  Your app
                </div>
                <div class="flex items-center gap-2 pl-3 text-primary">
                  <UIcon
                    name="i-lucide-corner-down-right"
                    class="size-4 shrink-0"
                  />
                  <span class="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-mono text-default">
                    validate()
                    <UIcon
                      name="i-lucide-check"
                      class="size-4 text-primary shrink-0"
                    />
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center gap-2 my-2 text-primary">
              <UIcon
                name="i-lucide-wifi-off"
                class="size-4 shrink-0"
              />
              <span class="text-xs">nothing leaves the boundary</span>
            </div>
            <p class="text-xs text-muted mt-3">
              {{ config.flow?.offlineNote }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </UPageSection>
</template>
