<script setup lang="ts">
const features = [
  {
    icon: 'i-lucide-file-text',
    title: 'GPX parser',
    description: 'Parse any GPX file — Garmin, Strava export, or raw XML — with full support for HR, cadence, and elevation extensions.'
  },
  {
    icon: 'i-lucide-ruler',
    title: 'Running metrics',
    description: 'Distance, moving time, avg/best pace, elevation gain/loss, HR zones, cadence, and per-km splits — all in one call.'
  },
  {
    icon: 'i-lucide-bar-chart-2',
    title: 'Chart.js configs',
    description: 'Five ready-made chart configs (pace, elevation, HR, HR zones, splits) that work in any environment — browser or Node canvas.'
  },
  {
    icon: 'i-lucide-heart-pulse',
    title: 'Heart rate zones',
    description: 'Automatic Z1–Z5 zone breakdown based on configurable max HR. Seconds in each zone, ready for a doughnut chart.'
  },
  {
    icon: 'i-lucide-globe',
    title: 'Metric & imperial',
    description: 'All formatters and chart labels switch between km/min·km and mi/min·mi via a single units option.'
  },
  {
    icon: 'i-lucide-terminal',
    title: 'CLI included',
    description: 'Run `stride analyze run.gpx` to get a full activity summary in your terminal. No config needed.'
  }
]

const codeSnippet = `import { parse, analyze, paceChartConfig } from '@alosha/stride'
import { Chart } from 'chart.js/auto'

// Parse a GPX file from Garmin / Strava
const activity = parse('./morning-run.gpx')

// Compute all metrics in one call
const stats = analyze(activity)
console.log(stats.distanceM, stats.avgPaceSecPerKm, stats.hrZones)

// Render a pace chart — Chart.js config returned, you own the canvas
new Chart(canvas, paceChartConfig(activity, stats))`
</script>

<template>
  <div>
    <!-- Hero -->
    <UPageHero
      title="GPX analytics for runners"
      description="Parse GPX files, compute running metrics, and render Chart.js dashboards — zero config."
      :ui="{ wrapper: 'py-16 sm:py-24' }"
    >
      <template #links>
        <UButton
          to="https://www.npmjs.com/package/@alosha/stride"
          target="_blank"
          size="lg"
          trailing-icon="i-lucide-arrow-right"
        >
          View on npm
        </UButton>
        <UButton
          to="https://github.com/avlisodraude/stride"
          target="_blank"
          size="lg"
          color="neutral"
          variant="subtle"
          icon="i-simple-icons-github"
        >
          GitHub
        </UButton>
      </template>

      <template #default>
        <!-- npm badge -->
        <div class="flex justify-center gap-3 mt-4">
          <img
            src="https://img.shields.io/npm/v/@alosha/stride?style=flat-square"
            alt="npm version"
            class="h-5"
          >
          <img
            src="https://img.shields.io/npm/dm/@alosha/stride?style=flat-square"
            alt="monthly downloads"
            class="h-5"
          >
          <img
            src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square"
            alt="MIT License"
            class="h-5"
          >
        </div>
      </template>
    </UPageHero>

    <!-- Code snippet -->
    <UContainer class="pb-16">
      <div class="max-w-3xl mx-auto">
        <UCard :ui="{ body: 'p-0' }">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-default">
            <span class="text-xs text-muted font-mono">install</span>
            <UBadge color="neutral" variant="subtle" size="xs">
              npm install @alosha/stride
            </UBadge>
          </div>
          <pre class="p-4 text-sm font-mono overflow-x-auto text-highlighted leading-relaxed">{{ codeSnippet }}</pre>
        </UCard>
      </div>
    </UContainer>

    <!-- Features -->
    <UContainer class="pb-24">
      <div class="text-center mb-12">
        <h2 class="text-2xl font-bold tracking-tight">
          Everything you need to visualise a run
        </h2>
        <p class="mt-2 text-muted">
          One package. No wrappers around wrappers.
        </p>
      </div>
      <UPageGrid>
        <UPageCard
          v-for="f in features"
          :key="f.title"
          :title="f.title"
          :description="f.description"
          :icon="f.icon"
        />
      </UPageGrid>
    </UContainer>

    <!-- CLI demo -->
    <div class="bg-elevated py-16">
      <UContainer>
        <div class="max-w-2xl mx-auto">
          <h2 class="text-xl font-bold mb-6 text-center">
            CLI — analyze a run in seconds
          </h2>
          <UCard :ui="{ body: 'p-0' }">
            <pre class="p-5 text-sm font-mono text-highlighted leading-relaxed overflow-x-auto">$ npx stride analyze morning-run.gpx

🏃 @alosha/stride — Morning Run

  Distance:      10.24 km
  Moving time:   51:32
  Elapsed time:  52:14
  Avg pace:      5:02/km
  Best km pace:  4:44/km
  Elevation ↑:   142m
  Elevation ↓:   138m
  Avg HR:        158 bpm
  Max HR:        178 bpm

  Splits:
    km  1  4:55/km  ↑12m  HR 152bpm
    km  2  5:03/km  ↑8m   HR 156bpm
    km  3  4:58/km  ↑5m   HR 159bpm
    ...</pre>
          </UCard>
        </div>
      </UContainer>
    </div>

    <!-- CTA -->
    <UContainer class="py-20 text-center">
      <h2 class="text-2xl font-bold mb-4">
        Add Stride to your project
      </h2>
      <p class="text-muted mb-8 max-w-md mx-auto">
        Open source, MIT licensed, zero config. Drop it in and start parsing GPX files in minutes.
      </p>
      <div class="flex justify-center gap-4 flex-wrap">
        <UButton
          to="https://github.com/avlisodraude/stride"
          target="_blank"
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-simple-icons-github"
        >
          View source
        </UButton>
        <UButton
          to="https://www.npmjs.com/package/@alosha/stride"
          target="_blank"
          size="lg"
          trailing-icon="i-lucide-arrow-right"
        >
          npm install @alosha/stride
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
