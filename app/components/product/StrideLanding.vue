<script setup lang="ts">
useSeoMeta({
  title: 'Stride — GPX, TCX & FIT analytics for runners',
  description: 'Parse GPX, TCX and FIT files, compute running metrics — pace, HR zones, splits, elevation — and render Chart.js dashboards. Free open-source npm package.',
  ogTitle: 'Stride — GPX, TCX & FIT analytics for runners',
  ogDescription: 'Parse GPX, TCX and FIT files, compute running metrics, and render Chart.js dashboards — zero config. Free open-source npm package by Alosha.',
  ogImage: 'https://stride.alosha.dev/og-stride.png',
  ogUrl: 'https://stride.alosha.dev',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://stride.alosha.dev/og-stride.png'
})

const formats = ['gpx', 'tcx', 'fit']

const features = [
  {
    icon: 'i-lucide-file-text',
    title: 'GPX, TCX & FIT parser',
    description: 'Parse GPX, TCX or FIT files — Garmin, Strava, Coros, Wahoo and more — auto-detected, with full HR, cadence, and elevation support.'
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

const codeExample = `import { parse, analyze, paceChartConfig } from '@alosha/stride'
import { Chart } from 'chart.js/auto'

// Parse a GPX, TCX or FIT file from Garmin / Strava / Coros — format auto-detected
const activity = parse('./morning-run.fit')

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
      class="hero-glow"
      :links="[
        { label: 'Live demo', to: '/demo', icon: 'i-lucide-play', size: 'xl', class: 'btn-grad' },
        { label: 'Get started free', to: 'https://www.npmjs.com/package/@alosha/stride', target: '_blank', trailingIcon: 'i-lucide-arrow-right', size: 'xl', color: 'neutral', variant: 'subtle' },
        { label: 'View on GitHub', to: 'https://github.com/avlisodraude/stride', target: '_blank', size: 'xl', color: 'neutral', variant: 'subtle', icon: 'i-simple-icons-github' }
      ]"
    >
      <template #headline>
        <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-default bg-default font-mono text-xs text-muted">
          <span class="size-1.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(16,185,129,.25)]" />
          Open source · Free npm package
        </span>
      </template>
      <template #title>
        GPX, TCX &amp; FIT analytics<br><span class="text-grad">for runners</span>
      </template>
      <template #description>
        <p class="text-lg text-muted max-w-xl mx-auto">
          Parse GPX, TCX and FIT files, compute running metrics, and render Chart.js dashboards.
          <strong class="text-default">Zero config, zero dependencies.</strong>
        </p>
      </template>

      <template #default>
        <!-- Supported formats — the key differentiator vs GPX-only parsers -->
        <div class="flex flex-wrap justify-center items-center gap-2 mt-6">
          <UBadge
            v-for="fmt in formats"
            :key="fmt"
            color="primary"
            variant="subtle"
            size="lg"
            class="font-mono"
          >
            .{{ fmt }}
          </UBadge>
          <span class="text-muted text-sm ml-1">one API, auto-detected</span>
        </div>
      </template>
    </UPageHero>

    <!-- Code snippet -->
    <UPageSection
      title="Parse, analyse, chart"
      description="Three imports and a file path. You own the canvas; Stride does the maths."
    >
      <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-5 text-sm font-mono text-green-400 overflow-x-auto max-w-2xl mx-auto shadow-lg">
        <pre>{{ codeExample }}</pre>
      </div>
    </UPageSection>

    <!-- Features -->
    <UPageSection
      title="Everything you need to visualise a run"
      description="One package, no wrappers around wrappers. Works in the browser and in Node."
      :features="features"
    />

    <!-- CLI demo -->
    <UPageSection
      title="CLI — analyse a run in seconds"
      description="Point it at a file and get a full activity summary in your terminal."
    >
      <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-5 text-sm font-mono text-green-400 overflow-x-auto max-w-2xl mx-auto shadow-lg">
        <pre>$ npx stride analyze morning-run.gpx

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
      </div>
    </UPageSection>

    <!-- CTA -->
    <UPageSection>
      <UPageCTA
        title="Add Stride to your project"
        description="Open source, MIT licensed, zero config. Drop it in and start parsing GPX, TCX and FIT files in minutes."
        variant="subtle"
        :links="[
          { label: 'npm install @alosha/stride', to: 'https://www.npmjs.com/package/@alosha/stride', target: '_blank', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
          { label: 'View on GitHub', to: 'https://github.com/avlisodraude/stride', target: '_blank', icon: 'i-simple-icons-github', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageSection>
  </div>
</template>
