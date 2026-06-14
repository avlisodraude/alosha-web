<script setup lang="ts">
useSeoMeta({
  title: 'Monitor — Playwright-based website monitoring',
  description: 'Define checks, get notified on failures, and generate HTML reports — all from your terminal or CI pipeline. Free open-source npm package.',
  ogTitle: 'Monitor — Playwright-based website monitoring',
  ogDescription: 'Define checks, get notified on failures, and generate HTML reports — free open-source npm package by Alosha.',
  ogUrl: 'https://monitor.alosha.dev',
  twitterCard: 'summary_large_image'
})

const features = [
  { icon: 'i-lucide-eye', title: 'Real browser checks', description: 'Uses Playwright under the hood — catches JS errors, redirects, and anything a headless Chrome would catch.' },
  { icon: 'i-lucide-refresh-cw', title: 'Automatic retries', description: 'Configurable retry attempts before marking a check as failed. No false alarms from flaky networks.' },
  { icon: 'i-lucide-camera', title: 'Screenshots on failure', description: 'Automatically saves a full-page screenshot whenever a check fails. Know exactly what went wrong.' },
  { icon: 'i-lucide-bell', title: 'Multi-channel alerts', description: 'Email, Slack, Discord, or any webhook. Get notified where your team already lives.' },
  { icon: 'i-lucide-clock', title: 'Built-in scheduler', description: 'Run `monitor watch` and each check fires on its own interval — no cron, no external scheduler needed.' },
  { icon: 'i-lucide-file-text', title: 'HTML reports', description: 'Auto-generated report after every run. Open it in your browser, share it with your team.' }
]

const codeExample = `# Install
npm install -D @alosha/monitor

# monitor.config.ts
export default {
  checks: [
    { name: 'Homepage', url: 'https://yoursite.com', interval: '5m' },
    { name: 'API',      url: 'https://api.yoursite.com/health', interval: '1m' },
  ],
  notify: { slack: { webhookUrl: process.env.SLACK_WEBHOOK_URL } }
}

# Run once
npx monitor run

# Or watch continuously
npx monitor watch`
</script>

<template>
  <div>
    <!-- Hero -->
    <UPageHero
      class="hero-glow"
      :links="[
        { label: 'Live demo', to: '/demo', icon: 'i-lucide-play', size: 'xl', class: 'btn-grad' },
        { label: 'Get started free', to: 'https://www.npmjs.com/package/@alosha/monitor', target: '_blank', trailingIcon: 'i-lucide-arrow-right', size: 'xl', color: 'neutral', variant: 'subtle' },
        { label: 'View on GitHub', to: 'https://github.com/avlisodraude/monitor', target: '_blank', size: 'xl', color: 'neutral', variant: 'subtle', icon: 'i-simple-icons-github' }
      ]"
    >
      <template #headline>
        <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-default bg-default font-mono text-xs text-muted">
          <span class="size-1.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(16,185,129,.25)]" />
          Open source · Free npm package
        </span>
      </template>
      <template #title>
        Website monitoring<br><span class="text-grad">for developers</span>
      </template>
      <template #description>
        <p class="text-lg text-muted max-w-xl mx-auto">
          Playwright-based checks with retries, screenshots, alerts, and HTML reports.
          <strong class="text-default">Zero config to get started.</strong>
        </p>
      </template>
    </UPageHero>

    <!-- Code snippet -->
    <UPageSection
      title="Up and running in minutes"
      description="One config file. Two commands. Your sites are being watched."
    >
      <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-5 text-sm font-mono text-green-400 overflow-x-auto max-w-2xl mx-auto shadow-lg">
        <pre>{{ codeExample }}</pre>
      </div>
    </UPageSection>

    <!-- Features -->
    <UPageSection
      title="Everything you need to ship with confidence"
      description="Built for developers who want monitoring handled and out of the way."
      :features="features"
    />

    <!-- CTA -->
    <UPageSection>
      <UPageCTA
        title="Start monitoring in minutes"
        description="Install the package, define your checks, run monitor watch. That's it."
        variant="subtle"
        :links="[
          { label: 'npm install @alosha/monitor', to: 'https://www.npmjs.com/package/@alosha/monitor', target: '_blank', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
          { label: 'View on GitHub', to: 'https://github.com/avlisodraude/monitor', target: '_blank', icon: 'i-simple-icons-github', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageSection>
  </div>
</template>
