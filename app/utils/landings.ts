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

/** One bar in a comparison chart (latency in ms, monthly cost in USD, build effort in dev-days, or peak memory in MiB). */
export interface CompareBar {
  label: string
  /** Numeric value — ms when unit is 'ms', US dollars when 'usd', dev-days when 'days', MiB when 'mib'. */
  value: number
  /** Optional caption shown next to the value. */
  note?: string
  /** Highlight this bar as the winning option. */
  highlight?: boolean
}

export interface CompareChart {
  title: string
  description: string
  /** How bar values are formatted: 'ms' (latency), 'usd' (monthly cost), 'days' (build effort), or 'mib' (peak memory). */
  unit: 'ms' | 'usd' | 'days' | 'mib'
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
      { icon: 'i-lucide-id-card', title: 'BSN & KvK', description: 'Dutch BSN checksum validation (11-proef) plus KvK format validation (8 digits) — handy for NL-focused products. KvK has no public checksum, so it\'s format-only; use the Cloud client to confirm a number is registered.' },
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
// Hosted VIES lookups (@alosha/eu-validate/cloud) ship in Phase 3 — coming soon.
// The offline validateVAT() below works today; the createClient()/verifyVAT() calls
// are forward-looking. See "Confirm VAT registration…" below for graceful fallback.
import { createClient } from '@alosha/eu-validate/cloud'

const eu = createClient({ apiKey: process.env.ALOSHA_KEY! })

export async function resolveVat(input: string) {
  // 1. Offline first — structure + checksum, zero network, instant. Works today.
  const offline = validateVAT(input)
  if (!offline.valid) {
    return { ok: false, reason: offline.errors[0] } // e.g. 'CHECKSUM_FAILED'
  }

  // 2. Spend a VIES round-trip only on numbers that already pass the checksum.
  //    (Requires the hosted /cloud tier — coming soon.)
  const live = await eu.verifyVAT(offline.normalized!)
  return { ok: live.registered, company: live.name }
}`,
        why: 'The offline checksum filters out typos and fabricated numbers for free, so the slow, rate-limited VIES call only ever runs on structurally valid input. You cut checkout latency and stop burning your VIES quota on garbage. (The hosted VIES step uses @alosha/eu-validate/cloud, which ships in Phase 3 — the offline validation works today.)',
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
      },
      {
        title: 'Confirm VAT registration when you can, fall back gracefully when you can’t',
        problem: 'A live VIES registration check on top of the offline checksum can fail for reasons that have nothing to do with the VAT number — the hosted endpoint isn’t live yet, a timeout, a bad response — and none of those should look like "this VAT is invalid."',
        code: `import { validateVAT } from '@alosha/eu-validate'
import { createClient, CloudNotAvailableError, CloudTimeoutError, CloudApiError } from '@alosha/eu-validate/cloud'

const eu = createClient({ apiKey: process.env.ALOSHA_KEY! })

export async function checkVat(input: string) {
  const offline = validateVAT(input)
  if (!offline.valid) {
    return { status: 'invalid' as const, reason: offline.errors[0] }
  }

  try {
    const live = await eu.verifyVAT(offline.normalized!)
    return { status: (live.registered ? 'registered' : 'not_registered') as const, company: live.name }
  } catch (err) {
    if (err instanceof CloudNotAvailableError) {
      // Hosted lookups aren't live yet — the offline checksum already passed, so degrade
      // instead of failing the request.
      return { status: 'format_valid_unconfirmed' as const, reason: 'cloud_not_available' }
    }
    if (err instanceof CloudTimeoutError || err instanceof CloudApiError) {
      // Transient — don't tell the user their VAT number is wrong because VIES hiccuped.
      return { status: 'format_valid_unconfirmed' as const, reason: 'cloud_error' }
    }
    throw err
  }
}`,
        why: 'verifyVAT() throws typed errors instead of a generic Error, so a Cloud outage or the not-yet-shipped Phase 3 endpoint never gets confused with "the VAT number is wrong." The offline checksum already did the hard rejection work, so every Cloud failure mode here degrades to "unconfirmed" instead of blocking the user.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/eu-validate/tree/main/examples/confirm-vat-with-fallback'
      },
      {
        title: 'Reject malformed identifiers at the edge of your API',
        problem: 'Every route that accepts a VAT, IBAN or BSN re-implements the same `if (!result.valid) return res.status(400)...` boilerplate, and it\'s easy for one route to forget a field.',
        code: `import express from 'express'
import { validateIBAN, validateVAT, assertValid, ValidationError } from '@alosha/eu-validate'

const app = express()
app.use(express.json())

app.post('/payouts', (req, res) => {
  try {
    const iban = assertValid(validateIBAN(req.body.iban))
    const vat = assertValid(validateVAT(req.body.vat))
    return res.json({ ok: true, iban: iban.normalized, vat: vat.normalized })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ ok: false, type: err.result.type, errors: err.result.errors })
    }
    throw err
  }
})`,
        why: 'assertValid() turns the usual "check .valid, then branch" dance into a single throw, so one catch block at the route boundary handles every identifier field the same way. ValidationError carries the full failing ValidationResult, so the 400 response tells the caller exactly which field and error code failed — no per-route boilerplate.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/eu-validate/tree/main/examples/fail-fast-middleware'
      },
      {
        title: 'Validate a full Dutch company-onboarding form in one pass',
        problem: 'A B2B signup form for the Netherlands collects four different identifier types — KvK, BSN, IBAN, VAT — and hand-wiring four separate validateX() calls means the field list and the validator list drift apart as the form grows.',
        code: `import { validate, type ValidateOptions } from '@alosha/eu-validate'

const ONBOARDING_FIELDS: Record<string, ValidateOptions> = {
  kvkNumber: { type: 'kvk' },
  bsn: { type: 'bsn' },
  iban: { type: 'iban' },
  vatNumber: { type: 'vat' }
}

export function validateOnboardingForm(form: Record<string, string>) {
  const fields = Object.fromEntries(
    Object.entries(ONBOARDING_FIELDS).map(([field, options]) => [
      field,
      validate(form[field] ?? '', options)
    ])
  )

  return {
    valid: Object.values(fields).every((r) => r.valid),
    fields // each entry is a full ValidationResult — keep \`errors\` for inline form feedback
  }
}`,
        why: 'The dispatcher means the field list is the single source of truth — add a row to ONBOARDING_FIELDS and the loop picks it up, instead of a fifth hand-written validateX() call drifting out of sync with the form. Every field still gets the same typed ValidationResult, so existing per-field error rendering keeps working unchanged.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/eu-validate/tree/main/examples/dutch-kyc-bundle'
      },
      {
        title: 'Clean up a customer VAT list before a VIES batch run',
        problem: 'A finance team exports thousands of customer VAT numbers for a quarterly VIES re-verification, and running every row through VIES — typos, copy-paste artifacts and all — wastes the rate-limited quota on input that was never going to pass.',
        code: `import { readFileSync, writeFileSync } from 'node:fs'
import { validateVAT } from '@alosha/eu-validate'

const rows = readFileSync('customers.csv', 'utf8')
  .trim()
  .split('\\n')
  .slice(1) // drop header
  .map((line) => line.split(','))

const clean: string[] = ['customer_id,vat_number']
const rejected: string[] = ['customer_id,vat_number,error']

for (const [customerId, vat] of rows) {
  const result = validateVAT(vat)
  if (result.valid) {
    clean.push(\`\${customerId},\${result.normalized}\`)
  } else {
    rejected.push(\`\${customerId},\${vat},\${result.errors[0]}\`)
  }
}

writeFileSync('clean.csv', clean.join('\\n'))
writeFileSync('rejected.csv', rejected.join('\\n'))
console.log(\`\${clean.length - 1} clean, \${rejected.length - 1} rejected — only clean.csv needs a VIES call.\`)`,
        why: 'The checksum pass is synchronous and free, so a list of 10,000 numbers is sorted into "worth a VIES call" and "already known bad" in milliseconds, with the specific error code attached to every rejected row for the finance team to act on. You spend VIES quota only on numbers that have a chance of being real.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/eu-validate/tree/main/examples/bulk-vat-cleanup'
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
    useCases: {
      title: 'Should you parse it yourself?',
      description: 'Reading an activity file looks like a weekend job — until you meet the formats. Here is what you would actually take on, and what Stride absorbs.',
      mitigationBrand: 'Stride',
      risksLabel: 'What you’d own building it yourself',
      cases: [
        {
          icon: 'i-lucide-file-cog',
          title: 'Binary FIT decoding is a project, not a parse()',
          lead: 'FIT is Garmin’s binary format — the native export from most watches. There is no XML to read: you decode a typed message stream and convert every field by hand.',
          risks: [
            { icon: 'i-lucide-binary', label: 'Binary message stream', detail: 'FIT is a compact binary protocol of definition and data messages — you need the Garmin SDK or a full decoder, not a string parser.' },
            { icon: 'i-lucide-compass', label: 'Semicircle coordinates', detail: 'Latitude and longitude are stored as int32 semicircles; miss the 180 / 2³¹ conversion and the GPS track lands in the ocean.' },
            { icon: 'i-lucide-footprints', label: 'Cadence half-counts', detail: 'Running cadence is recorded per foot (RPM); double it to steps per minute or every cadence figure reads half what athletes expect.' }
          ],
          mitigation: 'parse() auto-detects FIT, decodes the message stream with the official Garmin SDK, applies the semicircle conversion and cadence doubling, and returns the same normalised Activity you get from GPX or TCX — no per-format branching in your code.'
        },
        {
          icon: 'i-lucide-ruler',
          title: 'The running metrics hide the real work',
          lead: 'Distance and pace look trivial until pauses, GPS noise and zone boundaries turn each metric into a pile of edge cases.',
          risks: [
            { icon: 'i-lucide-pause', label: 'Moving vs elapsed', detail: 'Stop at a crossing and naive elapsed time wrecks your average pace — you need a speed threshold to separate moving time from pauses.' },
            { icon: 'i-lucide-heart-pulse', label: 'HR zone boundaries', detail: 'Z1–Z5 time-in-zone means bucketing every sample against %-of-max-HR thresholds and summing seconds — fiddly and easy to off-by-one.' },
            { icon: 'i-lucide-split', label: 'Per-km splits', detail: 'Splits don’t fall on sample boundaries; you accumulate distance and time across points and emit a split exactly at each kilometre.' }
          ],
          mitigation: 'analyze() returns distance, moving vs elapsed time, avg and best pace, per-km splits, elevation and Z1–Z5 HR zones in one call — the pause threshold, zone bucketing and split accounting are already handled and tested.'
        }
      ],
      chart: {
        title: 'Build vs adopt: the engineering you’d take on',
        description: 'A rough estimate of the work to build and own equivalent parsing and metrics in-house — before the first bug report from a watch you never tested.',
        unit: 'days',
        bars: [
          { label: 'Build & own it yourself', value: 12, note: 'GPX/TCX/FIT decoders + metrics engine + 5 chart configs + ongoing format upkeep — rough estimate' },
          { label: '@alosha/stride', value: 0, note: 'npm install — parse(), analyze() and charts included', highlight: true }
        ]
      }
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
      },
      {
        title: 'Flag a negative split (or a late-race fade) from any run',
        problem: 'Coaching and race-recap features want to know whether the second half was faster than the first — but pacing lives in the raw GPS stream, not in a tidy field.',
        code: `import { parse, analyze, formatPace } from '@alosha/stride'

// Did the runner finish faster than they started? (a "negative split")
function splitAnalysis(activity) {
  const { splits } = analyze(activity)     // clean per-km splits
  if (splits.length < 2) return null

  const mid = Math.floor(splits.length / 2)
  const avgPace = (arr) =>
    arr.reduce((sum, s) => sum + s.paceSecPerKm, 0) / arr.length

  const firstHalf = avgPace(splits.slice(0, mid))
  const secondHalf = avgPace(splits.slice(mid))
  const deltaSec = Math.round(firstHalf - secondHalf)  // > 0 => back half quicker

  return {
    negativeSplit: deltaSec > 0,
    firstHalfPace: formatPace(firstHalf),    // "6:00/km"
    secondHalfPace: formatPace(secondHalf),  // "5:00/km"
    swingSecPerKm: Math.abs(deltaSec),
  }
}`,
        why: 'analyze() already emits clean per-km splits, so classifying the run is a couple of array reductions over stats.splits and a formatPace() call — you never re-derive pace from raw GPS points or reinvent the split accounting.',
        sandbox: 'https://stackblitz.com/github/avlisodraude/stride/tree/main/examples/negative-split'
      }
    ],
    trustRows: [
      { icon: 'i-lucide-file-stack', metric: 'Formats', target: 'GPX · TCX · FIT', value: 'One API across Garmin, Strava, Coros and Wahoo exports — auto-detected.' },
      { icon: 'i-lucide-wifi-off', metric: 'Data isolation', target: 'Parsed locally, never uploaded', value: 'Runs in the browser or Node — activity files are parsed in-process and never sent anywhere.' },
      { icon: 'i-lucide-globe', metric: 'Runtime', target: 'Browser + Node', value: 'Ships ESM and CJS builds — drops into any bundler (Vite, webpack, Next) and runs server-side in Node too.' },
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
  },
  'vue-select': {
    headline: 'Open source · Free npm package',
    titleLead: 'Vue 3 select, dropdown',
    titleAccent: '& typeahead',
    description: 'A maintained Vue 3 fork of the classic vue-select — grouped options, a full WAI-ARIA 1.2 combobox, and native TypeScript types.',
    descriptionStrong: 'Zero runtime dependencies, 7.42 KiB gzip.',
    badges: FULL_BADGES,
    heroChips: ['single', 'multi', 'tags', 'async'],
    heroChipsNote: 'one component, every select pattern',
    codeTitle: 'Install, register, select',
    codeDescription: 'Vue 3 removed the global Vue object, so registration happens once on the app instance — then it behaves like any other v-model input.',
    code: `# Install
npm install @alosha/vue-select

// main.ts — register once
import { createApp } from 'vue'
import vSelect from '@alosha/vue-select'
import '@alosha/vue-select/dist/vue-select.css'

createApp(App).component('v-select', vSelect).mount('#app')

<!-- anywhere in your templates -->
<v-select v-model="selected" :options="['Canada', 'Mexico', 'United States']" />`,
    featuresTitle: 'Everything the stalled beta line never finished',
    featuresDescription: 'This fork ships the accessibility, typing and stability work the Vue 3 line needed to leave beta.',
    features: [
      { icon: 'i-lucide-list-tree', title: 'Grouped options', description: 'Pass { label, options } group objects alongside flat options in the same array — group headers render as non-selectable, non-highlightable rows, and search filters within each group.' },
      { icon: 'i-lucide-accessibility', title: 'WAI-ARIA 1.2 combobox', description: 'combobox role and aria-expanded live on the search input, aria-activedescendant tracks the highlighted option, and focus stays put after selecting or pressing Escape — spec-correct, not an approximation.' },
      { icon: 'i-lucide-sliders-horizontal', title: 'Clear, deselect & dropdown control', description: 'A clear slot and deselect slot customize the × controls, and openDropdown()/closeDropdown()/toggleDropdown() are exposed on the instance so a parent can drive the dropdown through a template ref.' },
      { icon: 'i-lucide-file-code-2', title: 'Native TypeScript types', description: 'Hand-authored dist/vue-select.d.ts resolves automatically through the package\'s types/exports fields — no @types/vue-select needed, and installing it would only shadow the accurate bundled types.' },
      { icon: 'i-lucide-move', title: 'Positioning without a required dependency', description: 'Default positioning is plain JS with zero dependencies; opt into appendToBody plus a calculatePosition built on @floating-ui/dom (replacing the old Popper.js docs example) for auto-flip, scroll-aware placement.' },
      { icon: 'i-lucide-tags', title: 'Tagging & SSR out of the box', description: 'Turn on taggable to let users create new options from free text, and render the same component server-side — SSR support ships alongside the browser build.' },
      { icon: 'i-lucide-feather', title: 'Zero deps, opt-in virtual scroll', description: '7.42 KiB gzip (ES) / 6.56 KiB (UMD) with no runtime dependencies; flip on virtual-scroll to window very large option lists so only visible rows hit the DOM (experimental, fixed row height).' }
    ],
    useCases: {
      title: 'Should you build your own select component?',
      description: 'Why Vue 3 teams reach for a maintained package instead of hand-rolling an accessible combobox for every form.',
      mitigationBrand: 'vue-select',
      risksLabel: 'What you would own building it yourself',
      cases: [
        {
          icon: 'i-lucide-accessibility',
          title: 'WAI-ARIA combobox compliance is its own project',
          lead: 'A filterable dropdown looks like a weekend component — until a screen reader gets involved.',
          risks: [
            { icon: 'i-lucide-file-warning', label: 'ARIA roles & states', detail: 'combobox role, aria-expanded, aria-activedescendant and aria-selected all have to move in lockstep with keyboard and mouse interaction, or assistive tech reports the wrong state.' },
            { icon: 'i-lucide-keyboard', label: 'Keyboard contract', detail: 'Arrow keys, Escape, Tab and typeahead all need spec-correct focus handling — get the blur behavior wrong and Escape silently steals focus from the input.' },
            { icon: 'i-lucide-scale', label: 'Ongoing spec drift', detail: 'Browser behavior changes (like Chrome\'s keyboard-focusable scrollers) keep breaking ARIA-compliant comboboxes that were correct when they shipped.' }
          ],
          mitigation: 'vue-select implements the WAI-ARIA 1.2 combobox pattern out of the box — combobox role and aria-expanded on the input, aria-activedescendant for the highlighted option, and blur handling that keeps focus in the input after selection or Escape. You inherit a maintained implementation instead of re-deriving the spec.'
        },
        {
          icon: 'i-lucide-move-3d',
          title: 'Dropdown positioning breaks the moment it needs to escape overflow',
          lead: 'A dropdown that renders inline collides with modals, tables and any container with overflow:hidden — so real apps need to append it to the body and calculate its position by hand.',
          risks: [
            { icon: 'i-lucide-square-stack', label: 'Overflow clipping', detail: 'A dropdown menu inside a scrollable card or modal gets clipped unless it is portaled out and repositioned relative to the viewport.' },
            { icon: 'i-lucide-ruler', label: 'Position math', detail: 'Flipping the menu above the input when there is no room below, and keeping its width in sync with the input, is nontrivial layout math to hand-roll.' },
            { icon: 'i-lucide-package-minus', label: 'A whole extra dependency', detail: 'Getting this right from scratch usually means reaching for a positioning library and a ResizeObserver, just to solve dropdown placement.' }
          ],
          mitigation: 'vue-select exposes appendToBody plus a calculatePosition hook, with a documented recipe wired to @floating-ui/dom — so the menu can escape overflow and reposition itself on scroll and resize without shipping a positioning library in the core bundle.'
        }
      ],
      chart: {
        title: 'Build vs adopt: the engineering you\'d take on',
        description: 'A rough estimate of the work to build and own an equivalent accessible, positioned, groupable select component in-house.',
        unit: 'days',
        bars: [
          { label: 'Build & own an accessible combobox yourself', value: 8, note: 'ARIA compliance + keyboard handling + positioning + grouping + tests — rough estimate' },
          { label: '@alosha/vue-select', value: 0, note: 'npm install — accessibility, positioning and grouping included', highlight: true }
        ]
      }
    },
    recipesTitle: 'Production recipes',
    recipesDescription: 'Real problems Vue 3 forms hit — solved with the published API.',
    recipes: [
      {
        title: 'Bind a controlled multi-select to a form library without fighting v-model',
        problem: 'A multi-select tags field needs to participate in form validation state (touched, errors, submit) instead of owning its own local ref.',
        code: `<script setup lang="ts">
import { useField } from 'vee-validate'

const { value, errorMessage, handleBlur } = useField<string[]>('skills', undefined, {
  initialValue: []
})
</script>

<template>
  <v-select
    v-model="value"
    multiple
    :options="['vue', 'react', 'svelte', 'angular']"
    @search:blur="handleBlur"
  />
  <span v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</span>
</template>`,
        why: 'modelValue/update:modelValue is a real Vue 3 v-model pair, so VeeValidate\'s useField() ref binds directly with no adapter layer. Forwarding the component\'s own search:blur event into handleBlur fires the field\'s touched/validate-on-blur behavior on the same interaction a native <select> would.'
      },
      {
        title: 'Build a country/region picker with grouped options',
        problem: 'A signup form needs a country picker with regional sub-groups, and hand-rolling grouped `<optgroup>`-style rendering means reimplementing filtering and keyboard navigation per group.',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const country = ref<string | null>(null)

const options = [
  { label: 'Canada', code: 'CA' },
  { label: 'United States', code: 'US' },
  {
    label: 'Europe',
    options: [
      { label: 'France', code: 'FR' },
      { label: 'Germany', code: 'DE' },
      { label: 'Netherlands', code: 'NL' }
    ]
  }
]
</script>

<template>
  <v-select
    v-model="country"
    :options="options"
    :reduce="(option) => option.code"
    label="label"
  />
</template>`,
        why: 'Group objects ({ label, options }) mix freely with flat options in the same array, and group headers render as non-selectable, non-highlightable rows automatically — so a regionally-grouped picker needs no custom grouping logic, just a shaped options array. reduce keeps the bound value a plain country code instead of the whole option object.'
      },
      {
        title: 'Search a remote API with debounce instead of filtering a static list',
        problem: 'An options list of thousands of records can\'t ship to the client up front — the dropdown needs to query an API as the user types, without firing a request on every keystroke.',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const options = ref<{ id: number; name: string }[]>([])
let debounceTimer: ReturnType<typeof setTimeout>

function onSearch(search: string, loading: (state: boolean) => void) {
  clearTimeout(debounceTimer)
  if (!search) return

  loading(true)
  debounceTimer = setTimeout(async () => {
    const res = await fetch(\`/api/repos?q=\${encodeURIComponent(search)}\`)
    options.value = await res.json()
    loading(false)
  }, 300)
}
</script>

<template>
  <v-select
    :options="options"
    :filterable="false"
    label="name"
    @search="onSearch"
  />
</template>`,
        why: 'The search event hands you the raw query string plus a loading toggle, so debouncing and fetching are just your own setTimeout and fetch — no separate async mode to configure. filterable="false" turns off client-side filtering so the server\'s results are trusted as-is instead of being re-filtered against a label the API already matched.'
      },
      {
        title: 'Render a richer option row without losing keyboard accessibility',
        problem: 'A staff picker needs to show a person\'s team next to their name, but replacing the default row risks breaking the keyboard-highlight and selection behavior that makes the dropdown accessible.',
        code: `<script setup lang="ts">
import { ref } from 'vue'

interface Person { id: number; name: string; team: string }

const selected = ref<Person | null>(null)
const people: Person[] = [
  { id: 1, name: 'Amara Diallo', team: 'Platform' },
  { id: 2, name: 'Kenji Watanabe', team: 'Design' }
]
</script>

<template>
  <v-select v-model="selected" :options="people" label="name">
    <template #option="{ option }">
      <div class="flex items-center justify-between gap-2">
        <span>{{ option.name }}</span>
        <span class="text-xs text-muted">{{ option.team }}</span>
      </div>
    </template>
    <template #selected-option="{ option }">
      {{ option.name }}
    </template>
  </v-select>
</template>`,
        why: 'The option and selected-option slots receive slotProps.option — the original object by reference, not a cloned plain object — so a person\'s team renders next to their name without losing object identity. Keyboard navigation, aria-activedescendant and selection state are untouched by the slot — only what\'s painted changes, not how the combobox behaves.'
      },
      {
        title: 'Keep a 50,000-row dropdown fast with virtual scrolling',
        problem: 'A product picker backed by a large catalog renders one DOM node per option by default — at tens of thousands of rows, opening the dropdown itself becomes the bottleneck.',
        code: `<script setup lang="ts">
const bigList = Array.from({ length: 50000 }, (_, i) => \`Product #\${i + 1}\`)
</script>

<template>
  <v-select
    :options="bigList"
    virtual-scroll
    :virtual-scroll-row-height="36"
  />
</template>`,
        why: 'With virtual-scroll on, only the rows inside the visible viewport (plus a small buffer) are actually rendered, so 50,000 options never hit the DOM at once and opening the dropdown stays fast regardless of list size. It\'s foundation-only today (fixed row height, no grouped-option support yet), so keep virtualScrollRowHeight matched to your option row\'s real rendered height and verify it before shipping.'
      }
    ],
    trustRows: [
      { icon: 'i-lucide-feather', metric: 'Bundle size', target: '7.42 KiB gzip (ES) · 6.56 KiB (UMD)', value: 'Small enough to drop into any form without a bundle-size conversation — plus 1.82 KiB gzip CSS.' },
      { icon: 'i-lucide-package-x', metric: 'Dependencies', target: '0 runtime deps', value: 'No Popper.js, no floating-ui in the core bundle — advanced positioning via calculatePosition is opt-in, not bundled.' },
      { icon: 'i-lucide-accessibility', metric: 'Accessibility', target: 'WAI-ARIA 1.2 combobox', value: 'combobox role, aria-expanded, aria-activedescendant and focus handling all follow the spec out of the box.' },
      { icon: 'i-lucide-file-code-2', metric: 'Type safety', target: 'Ships .d.ts, no @types package', value: 'Hand-authored native TypeScript types resolve automatically — remove the community @types/vue-select package if you have it installed.' },
      { icon: 'i-lucide-flask-conical', metric: 'Test coverage', target: '246 passing tests · 24 files', value: 'Expanded from 176 tests in this release, closing gaps in scroll and appendToBody behavior.' },
      { icon: 'i-lucide-git-branch', metric: 'Provenance', target: 'MIT fork, full attribution', value: 'Builds on sagalbot/vue-select with MIT attribution preserved — the Vue 3 line reaches a real 4.0.0 stable instead of a beta stuck since late 2022.' },
      { icon: 'i-lucide-scale', metric: 'Licensing', target: 'MIT', value: 'MIT-licensed and ships entirely in your bundle — clears legal review and never breaks if alosha.dev goes away.' }
    ],
    supportTitle: 'Add vue-select to your project',
    supportPoints: [
      'Custom slots, positioning or theming help for your design system',
      'Migration help moving off the abandoned vue-select@beta line',
      'Priority bug fixes and answers straight from the maintainer'
    ],
    seo: {
      title: 'vue-select — Vue 3 select, dropdown & typeahead component',
      description: 'A maintained Vue 3 fork of vue-select with grouped options, WAI-ARIA 1.2 accessibility and native TypeScript types. Free open-source npm package.'
    },
    os: 'Browser, Node.js (SSR)'
  },

  'xlsx': {
    headline: 'Open source · Free npm package',
    titleLead: 'Modern TypeScript',
    titleAccent: 'Excel reader & writer',
    description: 'Read and write real .xlsx workbooks from a single ESM-first document model — an ExcelJS-shaped rewrite with a low-memory streaming writer for exports too big to buffer.',
    descriptionStrong: 'One runtime dependency, full type declarations.',
    badges: FULL_BADGES,
    heroChips: ['styles', 'formulas', 'conditional formatting', 'data validation', 'comments', 'images', 'streaming'],
    heroChipsNote: 'one package, the whole workbook',
    codeTitle: 'Write, then read it back',
    codeDescription: 'A Workbook instance, cells addressed by A1 or (row, col), and a Uint8Array out — no Node Buffer required.',
    code: `# Install
npm install @alosha/xlsx

import { Workbook } from '@alosha/xlsx'

const workbook = new Workbook()
const sheet = workbook.addWorksheet('Report')

sheet.getCell('A1').value = 'Item'
sheet.getCell('B1').value = 'Qty'
sheet.getCell('B2').value = 42
sheet.getCell('B2').numFmt = '#,##0'
sheet.mergeCells('A4:B4')

// Browser-safe — never touches node:fs.
const bytes: Uint8Array = await workbook.xlsx.writeBuffer()

// Node convenience wrapper.
await workbook.xlsx.writeFile('report.xlsx')

// Read it back.
const loaded = new Workbook()
await loaded.xlsx.load(bytes)
loaded.getWorksheet('Report')?.getCell('B2').value // → 42`,
    featuresTitle: 'Everything a real workbook needs',
    featuresDescription: 'Built to be the package you reach for instead of hand-rolling OOXML or fighting ExcelJS internals.',
    features: [
      { icon: 'i-lucide-file-diff', title: 'ExcelJS-shaped API', description: 'new Workbook(), addWorksheet, getCell, getRow and the workbook.xlsx.writeBuffer/writeFile/load/readFile accessor all behave the way ExcelJS code already expects.' },
      { icon: 'i-lucide-replace', title: 'Drop-in @alosha/xlsx/compat', description: 'Swap the import — `import ExcelJS from "@alosha/xlsx/compat"` — and most of an ExcelJS codebase keeps working unchanged: same cell.type numbers, same style-setter precedence, same addRow/row.values behaviour. A few behaviours differ (a Uint8Array instead of a Node Buffer, a 0-based worksheets array, a couple of deferred features) — the migration guide lists them.' },
      { icon: 'i-lucide-paintbrush', title: 'Styles, number formats & merges', description: 'Fonts, fills, borders, alignment, protection and number formats round-trip on read and write, with mergeCells and a useStyles toggle for lean exports.' },
      { icon: 'i-lucide-table-properties', title: 'Freeze panes & auto-filter', description: 'worksheet.views for frozen/split panes and worksheet.autoFilter for the header-row filter range both round-trip as data, not just on write.' },
      { icon: 'i-lucide-palette', title: 'Conditional formatting', description: 'cellIs, expression, the text-contains family, top10, aboveAverage/belowAverage, duplicateValues/uniqueValues, plus self-visualising colorScale, dataBar and iconSet rules.' },
      { icon: 'i-lucide-list-checks', title: 'Data validation', description: 'List dropdowns and whole/decimal/date/time/text-length/custom constraints, settable per cell or per range via worksheet.dataValidations.add(sqref, dv).' },
      { icon: 'i-lucide-message-square', title: 'Cell comments', description: 'cell.note round-trips plain-string and rich-text notes with a multi-author table — real comments{n}.xml plus the legacy VML anchor Excel expects.' },
      { icon: 'i-lucide-image', title: 'Embedded images', description: 'workbook.addImage + worksheet.addImage support two-cell range anchors and one-cell/pixel-extent anchors for logos, charts-as-images and photo grids.' },
      { icon: 'i-lucide-gauge', title: 'Low-memory streaming writer', description: 'The stream.xlsx.WorkbookWriter-shaped API renders and deflates each row as you commit it — ~14.2× less peak memory than the buffered writer at ~1.9× the throughput on 500k-row exports.' }
    ],
    useCases: {
      title: 'Why teams move off ExcelJS or a home-grown OOXML writer',
      description: 'The engineering cost of hand-rolling spreadsheet export/import, or staying on a stalled dependency, compared to a maintained, typed alternative.',
      mitigationBrand: '@alosha/xlsx',
      risksLabel: 'What you take on building or maintaining it yourself',
      cases: [
        {
          icon: 'i-lucide-memory-stick',
          title: 'Large exports blow up memory on the buffered path',
          lead: 'A finance or reporting export with hundreds of thousands of rows built as one in-memory workbook can push a Node process into GC thrash or an OOM kill, right when the report matters most.',
          risks: [
            { icon: 'i-lucide-server-crash', label: 'Peak memory', detail: 'Holding every row, style and shared string in memory before serializing means peak RSS scales linearly with row count.' },
            { icon: 'i-lucide-hourglass', label: 'Time to first byte', detail: 'Nothing streams to the client until the entire workbook has been built and zipped, so large exports feel frozen.' },
            { icon: 'i-lucide-cpu', label: 'Container limits', detail: 'A report that worked in dev OOMs in a memory-capped serverless function or container once real production data volume hits it.' }
          ],
          mitigation: 'The streaming WorkbookWriter renders and deflates each row into the output archive the moment you call row.commit(), keeping peak memory roughly flat regardless of row count — with the same styles, merges, panes, data validation, conditional formatting, comments and images as the buffered writer.'
        },
        {
          icon: 'i-lucide-git-pull-request-arrow',
          title: 'Porting off ExcelJS usually means a rewrite, not a swap',
          lead: 'Most alternatives to ExcelJS have a different API shape, so migrating existing spreadsheet code means touching every call site — a project few teams have time to start.',
          risks: [
            { icon: 'i-lucide-file-code-2', label: 'API drift', detail: 'Different constructor, cell-access and serialization surfaces mean every getCell/addRow/style call needs to be rewritten and re-tested.' },
            { icon: 'i-lucide-bug', label: 'Silent behaviour changes', detail: 'Subtle differences — style-setter merge vs replace semantics, cell.type numbering — can pass a smoke test and still corrupt output in production.' },
            { icon: 'i-lucide-clock-4', label: 'Migration cost', detail: 'A full rewrite of the spreadsheet layer competes with every other roadmap item, so teams stay on an unmaintained dependency instead.' }
          ],
          mitigation: '@alosha/xlsx/compat is built to be a same-behaviour drop-in — matching cell.type numbers, ExcelJS\'s whole-category style-setter precedence, and the addRow/row.values/worksheet.columns contract — so most codebases port with a single import-line change, not a rewrite.'
        }
      ],
      chart: {
        title: 'Peak memory: buffered vs streaming writer',
        description: 'Representative peak memory writing 500,000 rows × 5 columns. Streaming keeps memory roughly flat regardless of row count; buffered scales with it.',
        unit: 'mib',
        bars: [
          { label: 'Buffered writer — full workbook in memory', value: 2718, note: '≈2.7 GiB peak — scales with row count' },
          { label: 'Streaming WorkbookWriter', value: 191, note: '≈14.2× less peak memory, ~1.9× the throughput', highlight: true }
        ]
      }
    },
    recipesTitle: 'Production recipes',
    recipesDescription: 'Real spreadsheet problems, solved with the published API.',
    recipes: [
      {
        title: 'Swap ExcelJS for @alosha/xlsx without touching the rest of the file',
        problem: 'An existing report generator is built on ExcelJS, but the dependency has gone quiet and a full rewrite of every getCell/style call isn\'t on the roadmap.',
        code: `- import ExcelJS from "exceljs"
+ import ExcelJS from "@alosha/xlsx/compat"

const workbook = new ExcelJS.Workbook()
const sheet = workbook.addWorksheet('Report')

sheet.getCell('A1').value = 'Item'
sheet.getColumn(2).width = 12
sheet.getCell('B1').font = { bold: true }

await workbook.xlsx.writeFile('report.xlsx')`,
        why: '@alosha/xlsx/compat backs the same new Workbook()/addWorksheet/getCell surface with @alosha/xlsx\'s model and writer, matching ExcelJS\'s cell.type numbers and whole-category style-setter precedence — so everything below the import line keeps working unchanged.'
      },
      {
        title: 'Export 500,000 rows without holding the workbook in memory',
        problem: 'A nightly export job builds a report so large that the buffered writer\'s in-memory workbook risks OOM-killing the container it runs in.',
        code: `import { WorkbookWriter } from '@alosha/xlsx'

const wb = new WorkbookWriter({ filename: 'big-report.xlsx' })
const ws = wb.addWorksheet('Data')

for (const record of hugeDataset) {
  ws.addRow([record.id, record.name, record.amount]).commit() // flushed now
}
ws.commit()
await wb.commit()`,
        why: 'row.commit() renders and deflates that row into the output archive immediately instead of retaining it, so peak memory stays roughly flat regardless of row count — about 14.2× less peak memory than the buffered writer at 1.9× the throughput on a 500k-row benchmark. Pass a Writable instead of a filename to stream straight to an HTTP response, or omit both to consume the writer as an AsyncIterable<Uint8Array>.'
      },
      {
        title: 'Write a formula, rich text, a hyperlink and an error code — all as plain cell values',
        problem: 'A dashboard row needs a cached formula result, mixed-format text in one cell, a clickable link and a native #DIV/0! — without reaching for a different API per cell type.',
        code: `const ws = workbook.addWorksheet('Dashboard')
const row = ws.addRow([])

// Formula with a cached result
row.getCell('A').value = { formula: 'SUM(B2:B10)', result: 420 }

// Inline rich text within a single cell
row.getCell('B').value = {
  richText: [
    { text: 'Status: ', font: { bold: true } },
    { text: 'Critical Failure', font: { color: { argb: 'FFFF0000' } } }
  ]
}

// Hyperlink with a tooltip
row.getCell('C').value = {
  text: 'Open Issue',
  hyperlink: 'https://github.com/avlisodraude/alosha-xlsx/issues/1',
  tooltip: 'Click to view issue tracker'
}

// Native Excel error code
row.getCell('D').value = { error: '#DIV/0!' }`,
        why: 'cell.value is a TypeScript discriminated union, so every advanced shape — formula, richText, hyperlink, error — is just an object you assign, with autocomplete narrowing the fields for each. There is no per-type setter to memorise, and each shape round-trips through readWorkbookBuffer as the same object you wrote.'
      },
      {
        title: 'Append hundreds of rows that inherit the header\'s fonts and borders',
        problem: 'A ledger export re-declares the same font and border on every row of the loop, because porting ExcelJS\'s cryptic i / o / i+ inheritance flags never felt worth it.',
        code: `const ws = workbook.addWorksheet('Ledger')

// Style a baseline row once
const header = ws.addRow(['Date', 'Account', 'Amount'])
header.font = { bold: true, size: 12 }
header.border = { bottom: { style: 'medium' } }

// New rows inherit the row above's structure — no re-styling per iteration
ws.addRow(['2026-07-08', 'Operating Costs', 1250.0], { inheritFrom: 'above' })
ws.addRow(['2026-07-09', 'SaaS Licensing', 450.0], { inheritFrom: 'above' })`,
        why: 'inheritFrom takes a readable { inheritFrom: "above" | "below", includeEmpty? } object instead of ExcelJS\'s i / o / i+ / o+ DSL, and copies the source row\'s style (and, with includeEmpty, its per-cell styles) — so a long write loop stays declarative without re-setting fonts and borders each pass.'
      },
      {
        title: 'Generate a workbook synchronously, with a tree-shakeable import',
        problem: 'An edge function or a bundle-size-sensitive frontend needs to emit a spreadsheet without the overhead of an async accessor or pulling the whole library into the bundle.',
        code: `import { Workbook, writeWorkbookBuffer, readWorkbookBuffer } from '@alosha/xlsx'

const wb = new Workbook()
wb.addWorksheet('SyncReport').getCell('A1').value = 'Instant Export'

// Pure, synchronous serialization — returns a Uint8Array
const bytes: Uint8Array = writeWorkbookBuffer(wb)

// Read it back, also synchronously
const roundTripped = readWorkbookBuffer(bytes)`,
        why: 'writeWorkbookBuffer/readWorkbookBuffer are the environment-agnostic core the workbook.xlsx.* accessor wraps — fully synchronous (no promise/microtask overhead) and tree-shakeable, so a bundler drops the reader when you only write. Neither touches node:fs, so the same call runs in a browser, worker or edge runtime.'
      },
      {
        title: 'Drop a logo or chart image into a report',
        problem: 'An invoice or branded report needs an embedded image placed precisely — either spanning a block of cells or pinned at an exact pixel size.',
        code: `// Intern the raw bytes once on the workbook
const imageId = workbook.addImage({ buffer: companyLogoBytes, extension: 'png' })

const ws = workbook.addWorksheet('Invoice')

// Option A: span a two-cell range
ws.addImage(imageId, 'A1:C3')

// Option B: pin a top-left cell with an explicit pixel size
ws.addImage(imageId, { tl: { col: 5, row: 1 }, ext: { width: 180, height: 60 } })`,
        why: 'workbook.addImage interns the bytes once and returns a numeric id, so the same image placed on several sheets is stored only once. worksheet.addImage accepts either a two-cell range string or a one-cell pixel-extent anchor — the two placement forms ExcelJS reports covering in day-to-day use.'
      },
      {
        title: 'Convert between A1 strings and row/column indexes without hand-rolling the math',
        problem: 'A dynamic sheet builder keeps re-implementing "turn (row, col) into C10" and "how many rows does B2:G15 span" — fiddly code that\'s easy to get subtly wrong.',
        code: `import { colLetterToNumber, colNumberToLetter, encodeAddress, decodeAddress, Range } from '@alosha/xlsx'

colLetterToNumber('AA')  // 27
colNumberToLetter(5)     // 'E'
encodeAddress(10, 3)     // 'C10'  (args are row, col)
decodeAddress('C10')     // { row: 10, col: 3, address: 'C10' }

const range = new Range('B2:G15')
range.range                   // 'B2:G15'
range.tl                      // 'B2'  top-left address
range.br                      // 'G15' bottom-right address
range.top                     // 2   first row
range.left                    // 2   first column (B)
range.count                   // 84  total cells
range.bottom - range.top + 1  // 14  row count`,
        why: 'The same cached A1 codecs the library uses internally are exported, so an index-to-address conversion is one call instead of a bespoke helper. Range normalises any A1 range into 1-based top/left/bottom/right bounds with tl/br/range/count accessors — construct it with new Range(\'B2:G15\') or new Range(top, left, bottom, right).'
      },
      {
        title: 'Highlight out-of-range values with conditional formatting',
        problem: 'A QA dashboard needs failing measurements to visually stand out, without a client-side pass recomputing which cells are out of spec on every render.',
        code: `const ws = workbook.addWorksheet('Measurements')

ws.addConditionalFormatting({
  ref: 'B2:B500',
  rules: [
    { type: 'cellIs', operator: 'greaterThan', formulae: [100], style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } } } },
    { type: 'colorScale', cfvo: [{ type: 'min' }, { type: 'max' }], color: ['FFF8696B', 'FF63BE7B'] }
  ]
})`,
        why: 'Conditional formatting rules are written straight into the sheet\'s <conditionalFormatting> blocks with differential styles deduped into a shared <dxfs> pool, so Excel and LibreOffice recompute the highlighting themselves from the live cell values — no client-side re-derivation, and the rules survive a round-trip through readWorkbookBuffer.'
      },
      {
        title: 'Constrain input to a dropdown list with a same-sheet data validation',
        problem: 'A generated order-entry template needs a status column restricted to a fixed set of values, enforced by Excel itself, not just documented in a comment.',
        code: `const ws = workbook.addWorksheet('Orders')

ws.dataValidations.add('C2:C200', {
  type: 'list',
  allowBlank: true,
  showInputMessage: true,
  showErrorMessage: true,
  formulae: ['"Pending,Shipped,Cancelled"']
})`,
        why: 'The <dataValidations> block is emitted in the correct CT_Worksheet position, so Excel renders a real in-cell dropdown and rejects free-text input on that range — enforcement lives in the file itself, so it holds even if the workbook is edited outside your app.'
      },
      {
        title: 'Freeze the header row and add an auto-filter in one pass',
        problem: 'A generated report is unreadable once scrolled — the header row disappears and there\'s no way to filter columns without manually re-adding both in Excel after every export.',
        code: `const ws = workbook.addWorksheet('Report')

ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'A2' }]
ws.autoFilter = 'A1:F1'`,
        why: 'views and autoFilter are real worksheet state, not writer-only options — they round-trip on read the same way ExcelJS\'s do, so a workbook you generate and then re-open programmatically still reports the frozen pane and filter range exactly as written.'
      },
      {
        title: 'Attach a reviewer note to a cell without a full comments library',
        problem: 'A generated audit spreadsheet needs to flag specific cells with a reviewer\'s explanation, in a form Excel\'s native comment popup understands — not a sidecar column.',
        code: `const ws = workbook.addWorksheet('Audit')

ws.getCell('D12').note = {
  texts: { richText: [{ text: 'Flagged: ', font: { bold: true } }, { text: 'exceeds threshold by 12%' }] },
  author: 'Compliance'
}`,
        why: 'cell.note writes a real comments{n}.xml note/author table plus the legacy VML anchor Excel\'s comment UI expects, so the note shows up as a native comment bubble with the author attributed — no sidecar sheet or custom popover to build and keep in sync.'
      }
    ],
    trustRows: [
      { icon: 'i-lucide-feather', metric: 'Dependencies', target: '1 runtime dep (fflate)', value: 'A single deflate dependency — no ExcelJS-style dependency sprawl to audit.' },
      { icon: 'i-lucide-file-code-2', metric: 'Type safety', target: 'Full .d.ts, ESM + CJS', value: 'Ships both module formats with complete type declarations — no separate @types package.' },
      { icon: 'i-lucide-gauge', metric: 'Streaming writer', target: '~14.2× less peak memory', value: 'At ~1.9× the throughput of the buffered writer on a 500k-row × 5-col benchmark.' },
      { icon: 'i-lucide-replace', metric: 'ExcelJS parity', target: '@alosha/xlsx/compat drop-in', value: 'Same cell.type numbers, same style-setter precedence, same addRow/row.values contract.' },
      { icon: 'i-lucide-table', metric: 'Feature coverage', target: 'Styles, CF, validation, comments, images', value: 'Read and write for the workbook features real reports and templates actually use.' },
      { icon: 'i-lucide-server', metric: 'Runtime targets', target: 'Node ≥ 22, browser, edge', value: 'writeBuffer()/readWorkbookBuffer() never touch node:fs, so the same code runs in a worker or edge function.' },
      { icon: 'i-lucide-scale', metric: 'Licensing', target: 'MIT', value: 'MIT-licensed and ships entirely in your bundle — clears legal review and never breaks if alosha.dev goes away.' }
    ],
    supportPoints: [
      'Migration help porting a large ExcelJS codebase onto @alosha/xlsx/compat',
      'Guidance wiring the streaming writer into an existing export pipeline',
      'Priority bug fixes and answers straight from the maintainer'
    ],
    seo: {
      title: '@alosha/xlsx — modern TypeScript Excel (.xlsx) reader & writer',
      description: 'ESM-first, ExcelJS-compatible Excel (.xlsx) reader and writer for TypeScript — styles, conditional formatting, data validation, comments, images and a low-memory streaming writer. Free open-source npm package.'
    },
    os: 'Node.js, Browser'
  }
}

/** The landing content for a product slug, or null if it has no generic page. */
export function getLanding(slug: string): LandingConfig | null {
  return LANDINGS[slug] ?? null
}
