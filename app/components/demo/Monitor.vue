<script setup lang="ts">
/**
 * Monitor demo — a *simulated* run. Monitor drives Playwright, which only runs
 * server-side, so a real check can't execute in the visitor's browser. This
 * animates a representative run from canned data to show what `monitor run`
 * produces: multi-step journeys, assertions, timings, failure + screenshot,
 * and the summary report.
 */

type Status = 'pending' | 'running' | 'pass' | 'fail'

interface Assertion { label: string, ok: boolean }
interface Check {
  name: string
  url: string
  steps: string[]
  assertions: Assertion[]
  responseMs: number
  ok: boolean
  failReason?: string
  screenshot?: string
  // runtime animation state
  status: Status
  shownSteps: number
  shownAssertions: number
}

function makeChecks(): Check[] {
  return [
    {
      name: 'Homepage',
      url: 'https://acme.example.com',
      steps: [],
      assertions: [
        { label: 'status is 200', ok: true },
        { label: 'responseTime < 3000ms', ok: true }
      ],
      responseMs: 412,
      ok: true,
      status: 'pending', shownSteps: 0, shownAssertions: 0
    },
    {
      name: 'Login flow',
      url: 'https://acme.example.com/login',
      steps: [
        'fill  #email  ‹test@acme.example.com›',
        'fill  #password  ‹••••••••›',
        'click  button[type=submit]',
        'waitForURL  /dashboard'
      ],
      assertions: [
        { label: 'title contains \'Dashboard\'', ok: true },
        { label: 'visible  .welcome-message', ok: true }
      ],
      responseMs: 1840,
      ok: true,
      status: 'pending', shownSteps: 0, shownAssertions: 0
    },
    {
      name: 'Checkout',
      url: 'https://acme.example.com/cart',
      steps: [
        'click  [data-test=cart]',
        'click  [data-test=checkout]',
        'waitForSelector  .payment-form'
      ],
      assertions: [
        { label: 'visible  .payment-form', ok: true },
        { label: 'responseTime < 3000ms', ok: false }
      ],
      responseMs: 4210,
      ok: false,
      failReason: 'responseTime 4210ms exceeded max 3000ms',
      screenshot: 'monitor-screenshots/checkout-fail.png',
      status: 'pending', shownSteps: 0, shownAssertions: 0
    }
  ]
}

const checks = reactive<Check[]>(makeChecks())
const phase = ref<'idle' | 'running' | 'done'>('idle')
const elapsed = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const copied = ref(false)
async function copyInstall() {
  try {
    await navigator.clipboard.writeText('npm i -D @alosha/monitor')
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch { /* clipboard unavailable */ }
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

async function run() {
  if (phase.value === 'running') return
  const fresh = makeChecks()
  checks.splice(0, checks.length, ...fresh)
  phase.value = 'running'
  elapsed.value = 0
  timer = setInterval(() => (elapsed.value += 0.1), 100)

  for (const c of checks) {
    c.status = 'running'
    await delay(450)
    for (let i = 0; i < c.steps.length; i++) {
      c.shownSteps = i + 1
      await delay(300)
    }
    for (let i = 0; i < c.assertions.length; i++) {
      c.shownAssertions = i + 1
      await delay(280)
    }
    await delay(200)
    c.status = c.ok ? 'pass' : 'fail'
    await delay(380)
  }

  if (timer) {
    clearInterval(timer)
    timer = null
  }
  phase.value = 'done'
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const passed = computed(() => checks.filter(c => c.status === 'pass').length)
const failed = computed(() => checks.filter(c => c.status === 'fail').length)
const totalMs = computed(() => checks.reduce((a, c) => a + c.responseMs, 0))

function statusIcon(s: Status): string {
  return s === 'pass'
    ? 'i-lucide-check-circle-2'
    : s === 'fail'
      ? 'i-lucide-x-circle'
      : s === 'running'
        ? 'i-lucide-loader-circle'
        : 'i-lucide-circle-dashed'
}
function statusColor(s: Status): string {
  return s === 'pass'
    ? 'text-green-500'
    : s === 'fail'
      ? 'text-red-500'
      : s === 'running'
        ? 'text-primary'
        : 'text-muted'
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">
        Try <span class="text-primary">Monitor</span>
      </h1>
      <p class="text-muted mt-2">
        Define checks, run multi-step journeys, assert on content, and get notified when
        something breaks. Here's what a <span class="font-mono text-default">monitor run</span> looks like.
      </p>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        <button
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors"
          @click="copyInstall"
        >
          <span class="text-muted">$</span> npm i -D @alosha/monitor
          <UIcon
            :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            class="ml-1 size-3.5 align-text-bottom"
            :class="copied ? 'text-primary' : 'text-muted'"
          />
        </button>
        <ULink
          to="https://www.npmjs.com/package/@alosha/monitor"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-npm" />
          npm
        </ULink>
        <ULink
          to="https://github.com/avlisodraude/monitor"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-github" />
          GitHub
        </ULink>
      </div>
    </div>

    <UAlert
      color="neutral"
      variant="soft"
      icon="i-lucide-info"
      class="text-sm"
      title="Simulated run"
      description="Monitor drives a real Playwright browser, which runs server-side or in CI — so this demo replays a representative run rather than checking a live site from your browser."
    />

    <!-- Run bar -->
    <div class="flex items-center justify-between gap-4 flex-wrap rounded-lg border border-default bg-default p-4">
      <div class="font-mono text-sm">
        <span class="text-muted">$</span> npx monitor run
      </div>
      <div class="flex items-center gap-3">
        <span
          v-if="phase !== 'idle'"
          class="text-sm text-muted tabular-nums"
        >
          {{ elapsed.toFixed(1) }}s
        </span>
        <UButton
          :icon="phase === 'running' ? 'i-lucide-loader-circle' : 'i-lucide-play'"
          :loading="phase === 'running'"
          @click="run"
        >
          {{ phase === 'idle' ? 'Run checks' : phase === 'running' ? 'Running…' : 'Run again' }}
        </UButton>
      </div>
    </div>

    <!-- Checks -->
    <div class="space-y-3">
      <div
        v-for="c in checks"
        :key="c.name"
        class="rounded-lg border bg-default p-4 transition-colors"
        :class="c.status === 'fail' ? 'border-red-500/40' : c.status === 'pass' ? 'border-green-500/30' : 'border-default'"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <UIcon
              :name="statusIcon(c.status)"
              class="size-5 shrink-0"
              :class="[statusColor(c.status), c.status === 'running' ? 'animate-spin' : '']"
            />
            <div class="min-w-0">
              <div class="font-medium truncate">
                {{ c.name }}
              </div>
              <div class="text-muted text-xs font-mono truncate">
                {{ c.url }}
              </div>
            </div>
          </div>
          <div
            v-if="c.status === 'pass' || c.status === 'fail'"
            class="text-sm tabular-nums shrink-0"
            :class="c.responseMs > 3000 ? 'text-red-500' : 'text-muted'"
          >
            {{ c.responseMs }}ms
          </div>
        </div>

        <!-- Steps + assertions reveal while running/after -->
        <div
          v-if="c.status !== 'pending'"
          class="mt-3 pl-7 space-y-1 text-sm"
        >
          <div
            v-for="(step, i) in c.steps.slice(0, c.shownSteps)"
            :key="'s' + i"
            class="font-mono text-xs text-muted flex items-center gap-2"
          >
            <UIcon
              name="i-lucide-corner-down-right"
              class="size-3 opacity-60"
            />
            {{ step }}
          </div>
          <div
            v-for="(a, i) in c.assertions.slice(0, c.shownAssertions)"
            :key="'a' + i"
            class="flex items-center gap-2 text-xs"
            :class="a.ok ? 'text-muted' : 'text-red-500'"
          >
            <UIcon
              :name="a.ok ? 'i-lucide-check' : 'i-lucide-x'"
              class="size-3.5"
            />
            {{ a.label }}
          </div>
          <div
            v-if="c.status === 'fail' && c.failReason"
            class="mt-2 text-xs text-red-500 flex items-start gap-2"
          >
            <UIcon
              name="i-lucide-alert-triangle"
              class="size-3.5 mt-0.5 shrink-0"
            />
            <span>
              {{ c.failReason }}
              <span
                v-if="c.screenshot"
                class="block text-muted mt-0.5"
              >
                <UIcon
                  name="i-lucide-camera"
                  class="size-3 align-text-bottom"
                /> screenshot saved → <span class="font-mono">{{ c.screenshot }}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary report -->
    <div
      v-if="phase === 'done'"
      class="rounded-lg border border-default bg-elevated p-5"
    >
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div class="inline-flex items-center gap-2 font-semibold">
          <UIcon
            name="i-lucide-file-text"
            class="text-primary"
          />
          monitor-report.html
        </div>
        <div class="flex items-center gap-4 text-sm tabular-nums">
          <span class="inline-flex items-center gap-1.5 text-green-500">
            <UIcon name="i-lucide-check-circle-2" /> {{ passed }} passed
          </span>
          <span
            class="inline-flex items-center gap-1.5"
            :class="failed ? 'text-red-500' : 'text-muted'"
          >
            <UIcon name="i-lucide-x-circle" /> {{ failed }} failed
          </span>
          <span class="text-muted">{{ totalMs }}ms total</span>
        </div>
      </div>
      <p class="text-muted text-sm mt-3">
        Every run writes a self-contained <span class="font-mono text-default">monitor-report.html</span>,
        saves a screenshot for each failure, and fires your configured alerts (Slack, Discord, email or
        webhook). Drop it into GitHub Actions to run on a schedule — all from the open-source
        <span class="font-mono text-default">@alosha/monitor</span> package.
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <UButton
          to="https://github.com/avlisodraude/monitor#github-actions"
          target="_blank"
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-simple-icons-githubactions"
        >
          Run it in CI
        </UButton>
        <UButton
          to="https://monitor.alosha.dev"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-arrow-right"
          trailing
        >
          Hosted monitoring &amp; dashboards
        </UButton>
      </div>
    </div>
  </div>
</template>
