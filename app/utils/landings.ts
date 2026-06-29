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

/** A single risk of the network-based / status-quo approach. */
export interface UseCaseRisk {
  icon: string
  /** Short risk header, e.g. "Latency". */
  label: string
  /** One-sentence explanation of the risk. */
  detail: string
}

export interface UseCase {
  icon: string
  /** Risk-assessment title. */
  title: string
  /** 1–2 sentence framing of the business problem. */
  lead: string
  /** What goes wrong with the network/external-API approach. */
  risks: UseCaseRisk[]
  /** How the offline package removes those risks. */
  mitigation: string
}

/** One bar in a comparison chart (latency in ms, or monthly cost in USD). */
export interface CompareBar {
  label: string
  /** Numeric value — milliseconds when unit is 'ms', US dollars when 'usd'. */
  value: number
  /** Optional caption shown next to the value. */
  note?: string
  /** Highlight this bar as the winning option. */
  highlight?: boolean
}

export interface CompareChart {
  title: string
  description: string
  /** How bar values are formatted: 'ms' (latency) or 'usd' (monthly cost). */
  unit: 'ms' | 'usd'
  bars: CompareBar[]
}

export interface UseCasesConfig {
  title: string
  description: string
  /** Brand name used in the "With <brand>:" mitigation footer of each case. */
  mitigationBrand: string
  /** Heading above each case's risk grid (e.g. risk of the SaaS/network approach). */
  risksLabel: string
  cases: UseCase[]
  /** Comparison chart (network vs offline latency, or hosted vs self-run cost). */
  chart: CompareChart
  /** Optional architecture flow comparison (network/offline trust-boundary story). */
  flow?: { networkLabel: string, networkNote: string, offlineLabel: string, offlineNote: string }
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

  /** Optional business use-case section (risk assessment + latency/flow visuals). */
  useCases?: UseCasesConfig

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
    useCases: {
      title: 'The business case for offline validation',
      description: 'Why engineering leads at EU fintech, billing and B2B-checkout teams move identifier validation off the network.',
      mitigationBrand: 'eu-validate',
      risksLabel: 'Risk of the network-based approach',
      cases: [
        {
          icon: 'i-lucide-timer',
          title: 'Eliminate checkout friction and 5xx errors from external API networks',
          lead: 'Calling VIES or a third-party VAT API in the hot path of a payment ties your checkout’s success rate to someone else’s uptime — and to the public internet on a bad day.',
          risks: [
            { icon: 'i-lucide-gauge', label: 'Latency', detail: 'A live VAT/IBAN lookup adds 400–2000 ms to the request — paid for on every submit, right when the user is about to convert.' },
            { icon: 'i-lucide-server-crash', label: 'Single point of failure', detail: 'VIES has scheduled downtime and per-member-state outages; when it 5xxs or times out, your checkout inherits the failure.' },
            { icon: 'i-lucide-thermometer-snowflake', label: 'Rate limits', detail: 'Government endpoints throttle aggressively, so traffic spikes — exactly when revenue is highest — get rejected.' }
          ],
          mitigation: 'eu-validate runs the structural and checksum validation in-process (Modulo-97 for IBAN, 11-proef for BSN, country VAT rules) with zero network calls — instant, 100% uptime. You only ever spend a VIES round-trip on numbers that already passed the offline checksum, so live lookups become rare and non-blocking.'
        },
        {
          icon: 'i-lucide-shield-alert',
          title: 'GDPR alignment: network-based VAT lookups leak user data',
          lead: 'Every mid-checkout call to a third-party validation network ships personal and transactional metadata off your infrastructure — a data-egress event you have to account for under audit.',
          risks: [
            { icon: 'i-lucide-share-2', label: 'Data egress', detail: 'The VAT/BSN/IBAN, plus the originating client IP and request timing, land in an external provider’s infrastructure logs.' },
            { icon: 'i-lucide-file-warning', label: 'Extra DPAs', detail: 'Each external validator becomes a sub-processor you must disclose, contract with, and defend in a data-protection review.' },
            { icon: 'i-lucide-map-pin', label: 'Location leakage', detail: 'Client IPs exposed to downstream networks reveal user location to parties outside your trust boundary.' }
          ],
          mitigation: 'Because every core validator is a pure, synchronous function, sensitive identifiers never leave the user’s session or your server. There is no external sub-processor, no IP exposure and no egress to document — the simplest possible GDPR posture for identifier validation.'
        }
      ],
      chart: {
        title: 'Network round-trip vs offline computation',
        description: 'Representative time added to a single validation. Offline checksums run in-process; network lookups pay for the public internet on every call.',
        unit: 'ms',
        bars: [
          { label: 'eu-validate (offline checksum)', value: 0.05, note: '~0 ms · no network', highlight: true },
          { label: 'VIES lookup — best case', value: 400, note: 'healthy, uncongested' },
          { label: 'VIES lookup — typical', value: 900, note: 'normal load' },
          { label: 'VIES lookup — under load / retry', value: 2000, note: 'throttled or degraded' }
        ]
      },
      flow: {
        networkLabel: 'Network-based lookup',
        networkNote: 'Identifier + client IP leave your trust boundary, cross the public internet to an external validator, and land in its logs — added latency and a new sub-processor.',
        offlineLabel: 'Offline validation (eu-validate)',
        offlineNote: 'Identifier is validated in-process against the checksum algorithm and never leaves your environment — no network, no egress, instant result.'
      }
    },
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
    useCases: {
      title: 'The "Datadog tax": what hosted synthetics really cost',
      description: 'Why teams move browser-level uptime checks off per-run SaaS pricing and into their own CI and infrastructure.',
      mitigationBrand: 'Monitor',
      risksLabel: 'The cost of the hosted-SaaS approach',
      cases: [
        {
          icon: 'i-lucide-receipt',
          title: 'Per-run pricing punishes you for monitoring well',
          lead: 'Hosted synthetic monitoring meters every browser run, so the exact levers that improve reliability — higher frequency, more regions, deeper journeys — are the levers that inflate the bill.',
          risks: [
            { icon: 'i-lucide-gauge', label: 'Frequency = cost', detail: 'Moving a check from 5-minute to 1-minute intervals multiplies its billed runs by five. Better detection time, five times the bill.' },
            { icon: 'i-lucide-globe', label: 'Per-region multiplier', detail: 'Each location you check from re-bills the same run, so multi-region coverage scales cost linearly with geography.' },
            { icon: 'i-lucide-list-checks', label: 'Per-step browser pricing', detail: 'Browser tests are billed per scripted step, so a realistic login-to-checkout journey costs more than a single page load.' }
          ],
          mitigation: 'Monitor runs as a devDependency in your CI or on a small box you already own. Frequency, regions and journey length change how thorough you are — not what you pay. The marginal cost of one more check run is zero.'
        },
        {
          icon: 'i-lucide-lock',
          title: 'Your checks and history live in someone else’s product',
          lead: 'Synthetic tests authored in a vendor’s recorder — plus the failure history and screenshots — are trapped there. Leaving means re-writing every journey and losing the timeline, which is exactly what keeps the renewal quote climbing.',
          risks: [
            { icon: 'i-lucide-file-lock-2', label: 'Trapped scripts', detail: 'Journeys built in a proprietary recorder don’t export into anything you can run yourself.' },
            { icon: 'i-lucide-database', label: 'History stays behind', detail: 'Run history and failure screenshots live in the vendor; churning the subscription loses the record.' },
            { icon: 'i-lucide-plug', label: 'Switching cost', detail: 'Migrating providers means re-authoring every check in a new DSL — so the renewal always wins the build-vs-buy argument.' }
          ],
          mitigation: 'Checks are plain TypeScript in your repo, versioned alongside the app they test. Results, screenshots and HTML reports are written to your own storage. There is nothing to export and no renewal holding your monitoring hostage.'
        }
      ],
      chart: {
        title: 'What 5 browser checks cost per month',
        description: 'Same workload — 5 checks at 5-minute intervals — priced three ways. Hosted figures use Datadog’s published list rate of $12 per 1,000 browser-test runs (~8,640 runs per check per month).',
        unit: 'usd',
        bars: [
          { label: 'Hosted synthetics — 5 checks · 3 regions', value: 1555, note: '~129,600 browser runs/mo × $0.012' },
          { label: 'Hosted synthetics — 5 checks · 1 region', value: 518, note: '~43,200 browser runs/mo × $0.012' },
          { label: 'Monitor — watch on a $6/mo VPS', value: 6, note: 'flat — runs, regions and journeys don’t change it', highlight: true }
        ]
      }
    },
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
        title: 'Run synthetic checks on a schedule with no server to babysit',
        problem: 'You want real browser checks every few minutes, but you don’t want to own a box, a cron daemon, or a per-run monitoring bill to get them.',
        code: `# .github/workflows/synthetics.yml
name: Synthetics
on:
  schedule:
    - cron: '*/15 * * * *'   # every 15 minutes
  workflow_dispatch:          # ...and on demand

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      # 'monitor run' exits 1 on failure — the run goes red AND
      # the Slack notifier in monitor.config.ts fires.
      - run: npx monitor run
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}`,
        why: 'GitHub schedules and runs the job for you — no server, no cron daemon, no hosted bill. monitor run exits non-zero when any check fails, so the workflow goes red and your config’s Slack notifier alerts at the same moment. (GitHub cron is best-effort, so treat very short intervals as approximate.)',
        sandbox: 'https://stackblitz.com/github/avlisodraude/monitor/tree/main/examples/github-actions'
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
      },
      {
        title: 'Page on-call through PagerDuty when a critical check fails',
        problem: 'A failed checkout at 3am needs to wake someone. Monitor ships Slack, Discord, email and webhook notifiers — but no native PagerDuty integration.',
        code: `import { run } from '@alosha/monitor'

const report = await run({
  checks: [
    { name: 'Checkout', url: 'https://app.example.com/checkout', maxResponseTimeMs: 3000 }
  ]
})

// No built-in PagerDuty notifier — page on-call yourself from the
// structured report via the Events API v2.
const down = report.results.filter((r) => r.status === 'fail')

await Promise.all(down.map((r) =>
  fetch('https://events.pagerduty.com/v2/enqueue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      routing_key: process.env.PAGERDUTY_ROUTING_KEY,
      event_action: 'trigger',
      dedup_key: \`monitor-\${r.name}\`,        // collapse repeats into one incident
      payload: {
        summary: \`\${r.name} is DOWN — \${r.error ?? 'check failed'}\`,
        source: r.url,
        severity: 'critical'
      }
    })
  })
))

if (report.failed > 0) process.exit(1)`,
        why: 'run() returns every check as a structured CheckResult, so mapping failures onto PagerDuty’s Events API v2 is a few lines — a trigger event plus a stable dedup_key that collapses repeat alerts into a single incident. You get real on-call escalation without waiting for a built-in integration.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/monitor/tree/main/examples/pagerduty'
      }
    ],
    trustRows: [
      { icon: 'i-lucide-chrome', metric: 'Check engine', target: 'Playwright (Chromium)', value: 'Catches JS errors, redirects and broken renders a curl ping never would.' },
      { icon: 'i-lucide-server', metric: 'Data isolation', target: 'Runs in your CI / infra', value: 'Check results and failure screenshots never leave your environment.' },
      { icon: 'i-lucide-file-code-2', metric: 'Type safety', target: 'Ships .d.ts (ESM + CJS)', value: 'Fully typed config, results and assertions — autocompletion out of the box.' },
      { icon: 'i-lucide-git-branch', metric: 'Install model', target: 'devDependency + CLI', value: 'Lives in your repo and runs in CI — nothing hosted to trust or pay for.' },
      { icon: 'i-lucide-bell', metric: 'Alerting', target: 'Slack · Discord · email · webhook', value: 'Notify where your team already works, with no extra service.' },
      { icon: 'i-lucide-banknote', metric: 'Cost model', target: 'Flat · $0 per run', value: 'Runs on CI or infra you already own — no per-run, per-region or per-seat metering as you add checks.' },
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
