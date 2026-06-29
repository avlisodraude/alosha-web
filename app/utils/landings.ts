/**
 * Landing CONTENT registry for open-source package products.
 *
 * Each package's marketing page is data, not a bespoke component: the generic
 * `ProductPageLanding` component renders any of these. Adding a package's page
 * is a registry entry here (keyed by the product `slug` from products.ts) —
 * no new `.vue` file.
 *
 * Hero action links (Live demo · npm · GitHub) and SEO URLs are DERIVED from
 * the product registry at render time, so they are not repeated here.
 */
import type { ProductBadgeKey } from './products'

export interface LandingFeature {
  icon: string
  title: string
  description: string
}

export interface LandingRecipe {
  /** Short engineering-problem title. */
  title: string
  /** One-line real-world problem statement. */
  problem: string
  /** Complete, copy-pasteable snippet. */
  code: string
  /** 2–3 sentence "why this works" breakdown. */
  why: string
  /** Optional live playground (StackBlitz / CodeSandbox) URL. */
  sandbox?: string
}

export interface LandingTrustRow {
  icon?: string
  metric: string
  target: string
  value: string
}

export interface LandingConfig {
  /** Pill text above the hero title. */
  headline: string
  /** Hero title: lead text + gradient accent (rendered on a second line). */
  titleLead: string
  titleAccent: string
  /** Hero description, with an optional emphasised tail clause. */
  description: string
  descriptionStrong?: string
  /** Which shields.io badges to show (defaults to the full set). */
  badges?: ProductBadgeKey[]
  /** Optional mono chips under the hero (e.g. supported formats). */
  heroChips?: string[]
  heroChipsNote?: string

  /** Quickstart code section. */
  codeTitle: string
  codeDescription: string
  code: string

  /** Features grid. */
  featuresTitle: string
  featuresDescription: string
  features: LandingFeature[]

  /** Optional CLI/extra code demo rendered after the features. */
  cliDemo?: { title: string, description: string, code: string }

  /** Production recipes. */
  recipesTitle: string
  recipesDescription: string
  recipes: LandingRecipe[]

  /** Trust / compliance matrix rows. */
  trustRows: LandingTrustRow[]

  /** Commercial gateway. `links` overrides the default npm + GitHub buttons. */
  supportTitle?: string
  supportPoints: string[]
  supportPrimary?: { label: string, to: string }

  /** SEO / structured data. */
  seo: { title: string, description: string }
  /** operatingSystem for the SoftwareApplication JSON-LD. */
  os: string
}

const FULL_BADGES: ProductBadgeKey[] = ['version', 'minzip', 'types', 'downloads', 'license']

export const LANDINGS: Record<string, LandingConfig> = {
  'eu-validate': {
    headline: 'Open source · Free npm package',
    titleLead: 'Offline EU identifier',
    titleAccent: 'validation',
    description: 'Checksum-accurate VAT, IBAN, BSN and KvK validation that runs entirely on your machine.',
    descriptionStrong: 'No network calls, no dependencies.',
    badges: FULL_BADGES,
    codeTitle: 'Three lines to a valid number',
    codeDescription: 'Import the check you need and call it. Synchronous, offline, done.',
    code: `# Install
npm install @alosha/eu-validate

# Use — every validator returns a ValidationResult
import { validateVAT, validateIBAN, validateBSN } from '@alosha/eu-validate'

validateVAT('NL810433941B01').valid      // → true
validateIBAN('NL91ABNA0417164300').valid // → true

const r = validateBSN('111222334')
r.valid   // → false
r.errors  // → ['CHECKSUM_FAILED']  (fails 11-proef)`,
    featuresTitle: 'Everything you need to validate EU data',
    featuresDescription: 'Built for products that handle European business and personal identifiers.',
    features: [
      { icon: 'i-lucide-wifi-off', title: 'Fully offline', description: 'Every check runs locally with no network calls — no VIES round-trips, no rate limits, no data leaving your server.' },
      { icon: 'i-lucide-badge-check', title: 'VAT for 14 countries', description: 'Country-specific VAT checksum validation for 14 EU member states — structure and check digits, not just a regex.' },
      { icon: 'i-lucide-landmark', title: 'IBAN validation', description: 'ISO 13616 IBAN checks with mod-97 verification and per-country length rules.' },
      { icon: 'i-lucide-id-card', title: 'BSN & KvK', description: 'Dutch BSN (11-proef) and KvK number validation built in — handy for NL-focused products.' },
      { icon: 'i-lucide-feather', title: 'Zero dependencies', description: 'Tiny, tree-shakeable, and dependency-free. Ships ESM + types, works in Node and the browser.' },
      { icon: 'i-lucide-shield-check', title: 'Typed & tested', description: 'Written in TypeScript with full types and a green test suite covering every checksum path.' }
    ],
    recipesTitle: 'Production recipes',
    recipesDescription: 'Real problems your product hits in EU markets — solved with the published API.',
    recipes: [
      {
        title: 'Reject bad VAT numbers before you ever call VIES',
        problem: 'A B2B checkout must apply reverse-charge VAT, but VIES is slow, rate-limited, and rejects malformed input anyway.',
        code: `import { validateVAT } from '@alosha/eu-validate'
import { createClient } from '@alosha/eu-validate/cloud'

const eu = createClient({ apiKey: process.env.ALOSHA_KEY! })

export async function resolveVat(input: string) {
  // 1. Offline first — structure + checksum, zero network, instant.
  const offline = validateVAT(input)
  if (!offline.valid) {
    return { ok: false, reason: offline.errors[0] } // e.g. 'CHECKSUM_FAILED'
  }

  // 2. Spend a VIES round-trip only on numbers that already pass the checksum.
  const live = await eu.verifyVAT(offline.normalized!)
  return { ok: live.registered, company: live.name }
}`,
        why: 'The offline checksum filters out typos and fabricated numbers for free, so the slow, rate-limited VIES call only ever runs on structurally valid input. You cut checkout latency and stop burning your VIES quota on garbage.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/eu-validate/tree/main/examples/reject-bad-vat'
      },
      {
        title: 'Validate Dutch BSN and IBAN without sending PII anywhere',
        problem: 'An onboarding form collects a BSN and IBAN, but shipping those to a third-party validation API is a GDPR data-egress problem.',
        code: `import { validateBSN, validateIBAN } from '@alosha/eu-validate'

// Pure, synchronous, offline — the values never leave the user's session.
export function validateOnboarding(form: { bsn: string; iban: string }) {
  const bsn = validateBSN(form.bsn)
  const iban = validateIBAN(form.iban)

  return {
    valid: bsn.valid && iban.valid,
    fields: {
      bsn: bsn.valid ? null : bsn.errors[0],   // e.g. 'CHECKSUM_FAILED'
      iban: iban.valid ? null : iban.errors[0] // e.g. 'INVALID_FORMAT'
    }
  }
}`,
        why: 'Every validator is a pure function with no network call, so sensitive identifiers like a BSN never reach an external processor. You get instant inline form feedback and one fewer data-processing agreement to sign.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/eu-validate/tree/main/examples/validate-onboarding'
      }
    ],
    trustRows: [
      { icon: 'i-lucide-gauge', metric: 'Performance', target: '0 ms network · synchronous', value: 'Offline checksum runs in-process — no VIES round-trip, no latency, 100% uptime.' },
      { icon: 'i-lucide-wifi-off', metric: 'Data isolation', target: 'No network in core', value: 'Identifiers never leave your environment — simpler GDPR posture.' },
      { icon: 'i-lucide-feather', metric: 'Bundle size', target: '~3 KB min+gzip', value: 'Negligible impact on your app’s Core Web Vitals.' },
      { icon: 'i-lucide-package-x', metric: 'Dependencies', target: '0 runtime deps', value: 'No third-party supply-chain surface added to your build.' },
      { icon: 'i-lucide-file-code-2', metric: 'Type safety', target: 'Ships .d.ts (ESM + CJS)', value: 'Autocompletion and compile-time safety out of the box.' },
      { icon: 'i-lucide-scale', metric: 'Licensing', target: 'MIT (core)', value: 'MIT-licensed core runs entirely in your infra — clears legal review and never breaks if alosha.dev goes away.' },
      { icon: 'i-lucide-cloud', metric: 'Live lookups', target: 'Optional /cloud, API-key', value: 'Opt-in VIES & KvK registration checks when you need them.' }
    ],
    supportPoints: [
      'Hosted VIES VAT registration lookups via @alosha/eu-validate/cloud (coming soon)',
      'KvK company-register lookups with a single API key',
      'Priority bug fixes and answers straight from the maintainer',
      'Custom validators or extra country coverage on request'
    ],
    supportPrimary: { label: 'Talk about commercial use', to: 'mailto:hello@alosha.dev' },
    seo: {
      title: 'eu-validate — offline EU identifier validation',
      description: 'Validate EU VAT numbers, IBANs, BSN and KvK numbers entirely offline — checksum-accurate, zero network calls. Free open-source npm package.'
    },
    os: 'Node.js, Browser'
  },

  'monitor': {
    headline: 'Open source · Free npm package',
    titleLead: 'Website monitoring',
    titleAccent: 'for developers',
    description: 'Playwright-based checks with retries, screenshots, alerts, and HTML reports.',
    descriptionStrong: 'Zero config to get started.',
    badges: ['version', 'downloads', 'types', 'license'],
    codeTitle: 'Up and running in minutes',
    codeDescription: 'One config file. Two commands. Your sites are being watched.',
    code: `# Install
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
npx monitor watch`,
    featuresTitle: 'Everything you need to ship with confidence',
    featuresDescription: 'Built for developers who want monitoring handled and out of the way.',
    features: [
      { icon: 'i-lucide-eye', title: 'Real browser checks', description: 'Uses Playwright under the hood — catches JS errors, redirects, and anything a headless Chrome would catch.' },
      { icon: 'i-lucide-refresh-cw', title: 'Automatic retries', description: 'Configurable retry attempts before marking a check as failed. No false alarms from flaky networks.' },
      { icon: 'i-lucide-camera', title: 'Screenshots on failure', description: 'Automatically saves a full-page screenshot whenever a check fails. Know exactly what went wrong.' },
      { icon: 'i-lucide-bell', title: 'Multi-channel alerts', description: 'Email, Slack, Discord, or any webhook. Get notified where your team already lives.' },
      { icon: 'i-lucide-clock', title: 'Built-in scheduler', description: 'Run `monitor watch` and each check fires on its own interval — no cron, no external scheduler needed.' },
      { icon: 'i-lucide-file-text', title: 'HTML reports', description: 'Auto-generated report after every run. Open it in your browser, share it with your team.' }
    ],
    recipesTitle: 'Production recipes',
    recipesDescription: 'The monitoring problems real teams hit — solved with the published API.',
    recipes: [
      {
        title: 'Fail your CI build when a critical user journey breaks',
        problem: 'A deploy can pass unit tests but still break login or checkout in a real browser — and you find out from a customer.',
        code: `import { run } from '@alosha/monitor'

const report = await run({
  checks: [{
    name: 'Login flow',
    url: 'https://app.example.com/login',
    steps: [
      { action: 'fill',  selector: '#email',    value: process.env.TEST_EMAIL! },
      { action: 'fill',  selector: '#password', value: process.env.TEST_PASS! },
      { action: 'click', selector: 'button[type=submit]' },
      { action: 'waitForURL', value: '**/dashboard' }
    ],
    assertions: [{ type: 'visible', selector: '[data-test=user-menu]' }]
  }]
})

// Break the build if any check failed.
if (report.failed > 0) process.exit(1)`,
        why: 'run() drives a real Chromium session through the journey and returns a structured RunReport, so a single exit-code check turns "does login still work?" into a CI gate that blocks the deploy before users ever see the break.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/monitor/tree/main/examples/ci-gate'
      },
      {
        title: 'Get a Slack alert with a screenshot the moment a page goes down',
        problem: 'Uptime pings tell you a URL returns 200, not that the page actually rendered — and they rarely show you what the user saw.',
        code: `import { watch } from '@alosha/monitor'

// Runs continuously, firing each check on its own interval.
await watch({
  checks: [
    { name: 'Homepage', url: 'https://example.com', interval: '1m', maxResponseTimeMs: 2000 },
    { name: 'Checkout', url: 'https://example.com/checkout', interval: '5m' }
  ],
  notify: { slack: { webhookUrl: process.env.SLACK_WEBHOOK_URL! } }
})`,
        why: 'watch() schedules each check independently and, on failure, captures a full-page screenshot before posting to Slack — so your first signal of an outage is an alert with visual proof, not a support ticket.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/monitor/tree/main/examples/slack-alert'
      }
    ],
    trustRows: [
      { icon: 'i-lucide-chrome', metric: 'Check engine', target: 'Playwright (Chromium)', value: 'Catches JS errors, redirects and broken renders a curl ping never would.' },
      { icon: 'i-lucide-server', metric: 'Data isolation', target: 'Runs in your CI / infra', value: 'Check results and failure screenshots never leave your environment.' },
      { icon: 'i-lucide-file-code-2', metric: 'Type safety', target: 'Ships .d.ts (ESM + CJS)', value: 'Fully typed config, results and assertions — autocompletion out of the box.' },
      { icon: 'i-lucide-git-branch', metric: 'Install model', target: 'devDependency + CLI', value: 'Lives in your repo and runs in CI — nothing hosted to trust or pay for.' },
      { icon: 'i-lucide-bell', metric: 'Alerting', target: 'Slack · Discord · email · webhook', value: 'Notify where your team already works, with no extra service.' },
      { icon: 'i-lucide-scale', metric: 'Licensing', target: 'MIT', value: 'MIT-licensed and runs entirely in your infra — clears legal review and never breaks if alosha.dev goes away.' }
    ],
    supportTitle: 'Start monitoring in minutes',
    supportPoints: [
      'Custom checks, assertions or notifier integrations on request',
      'Help wiring Monitor into your CI/CD pipeline',
      'Priority bug fixes and answers straight from the maintainer'
    ],
    seo: {
      title: 'Monitor — Playwright-based website monitoring',
      description: 'Define checks, get notified on failures, and generate HTML reports — all from your terminal or CI pipeline. Free open-source npm package.'
    },
    os: 'Node.js'
  },

  'stride': {
    headline: 'Open source · Free npm package',
    titleLead: 'GPX, TCX & FIT analytics',
    titleAccent: 'for runners',
    description: 'Parse GPX, TCX and FIT files, compute running metrics, and render Chart.js dashboards.',
    descriptionStrong: 'Zero config — one API for every format.',
    badges: ['version', 'downloads', 'types', 'license'],
    heroChips: ['gpx', 'tcx', 'fit'],
    heroChipsNote: 'one API, auto-detected',
    codeTitle: 'Parse, analyse, chart',
    codeDescription: 'Three imports and a file path. You own the canvas; Stride does the maths.',
    code: `import { parse, analyze, paceChartConfig } from '@alosha/stride'
import { Chart } from 'chart.js/auto'

// Parse a GPX, TCX or FIT file from Garmin / Strava / Coros — format auto-detected
const activity = parse('./morning-run.fit')

// Compute all metrics in one call
const stats = analyze(activity)
console.log(stats.distanceM, stats.avgPaceSecPerKm, stats.hrZones)

// Render a pace chart — Chart.js config returned, you own the canvas
new Chart(canvas, paceChartConfig(activity, stats))`,
    featuresTitle: 'Everything you need to visualise a run',
    featuresDescription: 'One package, no wrappers around wrappers. Works in the browser and in Node.',
    features: [
      { icon: 'i-lucide-file-text', title: 'GPX, TCX & FIT parser', description: 'Parse GPX, TCX or FIT files — Garmin, Strava, Coros, Wahoo and more — auto-detected, with full HR, cadence, and elevation support.' },
      { icon: 'i-lucide-ruler', title: 'Running metrics', description: 'Distance, moving time, avg/best pace, elevation gain/loss, HR zones, cadence, and per-km splits — all in one call.' },
      { icon: 'i-lucide-bar-chart-2', title: 'Chart.js configs', description: 'Five ready-made chart configs (pace, elevation, HR, HR zones, splits) that work in any environment — browser or Node canvas.' },
      { icon: 'i-lucide-heart-pulse', title: 'Heart rate zones', description: 'Automatic Z1–Z5 zone breakdown based on configurable max HR. Seconds in each zone, ready for a doughnut chart.' },
      { icon: 'i-lucide-globe', title: 'Metric & imperial', description: 'All formatters and chart labels switch between km/min·km and mi/min·mi via a single units option.' },
      { icon: 'i-lucide-terminal', title: 'CLI included', description: 'Run `stride analyze run.gpx` to get a full activity summary in your terminal. No config needed.' }
    ],
    cliDemo: {
      title: 'CLI — analyse a run in seconds',
      description: 'Point it at a file and get a full activity summary in your terminal.',
      code: `$ npx stride analyze morning-run.gpx

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
    ...`
    },
    recipesTitle: 'Production recipes',
    recipesDescription: 'Real things you’d build with run data — solved with the published API.',
    recipes: [
      {
        title: 'Turn a Garmin .FIT upload into a pace chart in the browser',
        problem: 'Users export runs from Garmin, Strava, Coros and Wahoo in different formats — and FIT is binary, not text.',
        code: `import { parse, analyze, paceChartConfig } from '@alosha/stride'
import { Chart } from 'chart.js/auto'

// A user drops a .fit / .gpx / .tcx export onto your page.
async function renderUpload(file: File, canvas: HTMLCanvasElement) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const activity = parse(bytes)     // format auto-detected: GPX / TCX / FIT
  const stats = analyze(activity)   // distance, pace, HR zones, splits

  new Chart(canvas, paceChartConfig(activity, stats))
  return stats
}`,
        why: 'parse() auto-detects the format and returns one normalised Activity, so the same analyze() and chart configs work no matter which watch produced the file — no per-vendor branching in your upload handler.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/stride/tree/main/examples/pace-chart'
      },
      {
        title: 'Build a heart-rate zone breakdown without writing the maths',
        problem: 'Time-in-zone is a core training metric, but computing Z1–Z5 from a raw HR stream by hand is fiddly and error-prone.',
        code: `import { parse, analyze, hrZonesChartConfig } from '@alosha/stride'
import { Chart } from 'chart.js/auto'

const activity = parse('./tempo-run.tcx')
const stats = analyze(activity, 188)   // pass the athlete's max HR

// Seconds spent in each zone, ready for a doughnut chart.
console.log(stats.hrZones)             // { z1, z2, z3, z4, z5 } | null
new Chart(canvas, hrZonesChartConfig(stats))`,
        why: 'analyze() computes Z1–Z5 time-in-zone from the HR stream against the max HR you pass and returns a ready Chart.js config — you get a training-quality breakdown without ever touching the zone formula.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/stride/tree/main/examples/hr-zones'
      }
    ],
    trustRows: [
      { icon: 'i-lucide-file-stack', metric: 'Formats', target: 'GPX · TCX · FIT', value: 'One API across Garmin, Strava, Coros and Wahoo exports — auto-detected.' },
      { icon: 'i-lucide-wifi-off', metric: 'Data isolation', target: 'Parsed locally, never uploaded', value: 'Runs in the browser or Node — activity files are parsed in-process and never sent anywhere.' },
      { icon: 'i-lucide-globe', metric: 'Runtime', target: 'Browser + Node', value: 'Ships a prebuilt browser bundle plus ESM/CJS — no build step required.' },
      { icon: 'i-lucide-bar-chart-2', metric: 'Charts', target: 'Side-effect-free configs', value: 'Returns plain Chart.js configs; you own the canvas and keep it tree-shakeable.' },
      { icon: 'i-lucide-package', metric: 'Dependencies', target: 'chart.js + 2 parsers', value: 'Built on chart.js and battle-tested parsers — nothing exotic in your tree.' },
      { icon: 'i-lucide-file-code-2', metric: 'Type safety', target: 'Ships .d.ts (ESM + CJS)', value: 'Fully typed Activity and stats — autocompletion out of the box.' },
      { icon: 'i-lucide-scale', metric: 'Licensing', target: 'MIT', value: 'MIT-licensed and runs entirely in your infra — clears legal review and never breaks if alosha.dev goes away.' }
    ],
    supportTitle: 'Add Stride to your project',
    supportPoints: [
      'Custom chart types or running metrics for your product',
      'Help integrating Stride into your app or platform',
      'Priority fixes and feature requests from the maintainer'
    ],
    seo: {
      title: 'Stride — GPX, TCX & FIT analytics for runners',
      description: 'Parse GPX, TCX and FIT files, compute running metrics — pace, HR zones, splits, elevation — and render Chart.js dashboards. Free open-source npm package.'
    },
    os: 'Node.js'
  }
}

/** The landing content for a product slug, or null if it has no generic page. */
export function getLanding(slug: string): LandingConfig | null {
  return LANDINGS[slug] ?? null
}
