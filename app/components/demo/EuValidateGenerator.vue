<script setup lang="ts">
/**
 * Mock compliance-data generator for eu-validate. Produces realistic VALID and
 * INVALID test identifiers (VAT, IBAN, BSN, KvK) entirely in the browser, so
 * developers can seed integration and unit tests with data that genuinely
 * passes — or fails — the same offline checks eu-validate ships.
 *
 * Every generated value is verified against the real library before it is shown
 * (generate-then-verify): the "valid" output always passes the matching
 * validator, the "invalid" output always fails it. The library and its data
 * (EU_COUNTRIES / IBAN_LENGTHS / VAT_PATTERNS / VAT_CHECKSUM_SUPPORTED) drive
 * the UI, so this tool can never advertise a capability the package lacks.
 */

type GenType = 'vat' | 'iban' | 'bsn' | 'kvk'

interface ValidationResult { valid: boolean }

interface EuValidateApi {
  validateVAT: (v: string) => ValidationResult
  validateIBAN: (v: string) => ValidationResult
  validateBSN: (v: string) => ValidationResult
  validateKvK: (v: string) => ValidationResult
  EU_COUNTRIES: string[]
  IBAN_LENGTHS: Record<string, number>
  VAT_PATTERNS: Record<string, RegExp>
  VAT_CHECKSUM_SUPPORTED: string[]
}

const types: { key: GenType, label: string, note: string }[] = [
  { key: 'vat', label: 'VAT', note: 'EU VAT number' },
  { key: 'iban', label: 'IBAN', note: 'Bank account number' },
  { key: 'bsn', label: 'BSN', note: 'Dutch citizen number' },
  { key: 'kvk', label: 'KvK', note: 'Dutch company number' }
]

const lib = ref<EuValidateApi | null>(null)
const loadError = ref('')
const genError = ref('')
const type = ref<GenType>('vat')
const country = ref('NL')
const validOut = ref('')
const invalidOut = ref('')

function loadLib(): Promise<EuValidateApi> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { EuValidate?: EuValidateApi }
    if (w.EuValidate) return resolve(w.EuValidate)
    const s = document.createElement('script')
    s.src = '/lib/eu-validate.js'
    s.onload = () => (w.EuValidate ? resolve(w.EuValidate) : reject(new Error('eu-validate failed to initialise')))
    s.onerror = () => reject(new Error('Could not load the eu-validate library'))
    document.head.appendChild(s)
  })
}

// ---- random helpers ----
const DIG = '0123456789'
function ri(n: number): number {
  return Math.floor(Math.random() * n)
}
function pick(set: string): string {
  return set.charAt(ri(set.length))
}
function digits(n: number): string {
  let out = ''
  for (let i = 0; i < n; i++) out += pick(DIG)
  return out
}

// ISO 13616 mod-97 check digits for an all-digit BBAN.
function ibanCheck(cc: string, bban: string): string {
  const rearranged = (bban + cc + '00').replace(/[A-Z]/g, c => String(c.charCodeAt(0) - 55))
  let rem = 0
  for (const ch of rearranged) rem = (rem * 10 + (ch.charCodeAt(0) - 48)) % 97
  return String(98 - rem).padStart(2, '0')
}

// Expand a character-class body like "A-Z0-9" into its full set of characters.
function expandClass(cls: string): string {
  let out = ''
  for (let i = 0; i < cls.length; i++) {
    if (cls.charAt(i + 1) === '-' && i + 2 < cls.length) {
      for (let c = cls.charCodeAt(i); c <= cls.charCodeAt(i + 2); c++) out += String.fromCharCode(c)
      i += 2
    } else {
      out += cls.charAt(i)
    }
  }
  return out
}

// Resolve every (a|b|c) group to one random branch, repeatedly (e.g. LT VAT).
function chooseGroups(s: string): string {
  let prev: string
  do {
    prev = s
    s = s.replace(/\(([^()]*)\)/, (group) => {
      const opts = group.slice(1, -1).split('|')
      return opts[ri(opts.length)] ?? ''
    })
  } while (s !== prev)
  return s
}

// Sample a random string from a VAT body pattern (the part after the prefix).
// Handles the full token set used by VAT_PATTERNS: \d, [..] classes with ranges,
// literals, {n} / {m,n} quantifiers, groups and top-level alternation (IE/LT).
function sampleVat(re: RegExp): string {
  let src = re.source.replace(/[\^$]/g, '')
  src = chooseGroups(src)
  const alts = src.split('|')
  src = alts[ri(alts.length)] ?? ''
  const rx = /(\\d|\[([^\]]+)\]|[A-Za-z0-9])(\{(\d+)(?:,(\d+))?\})?/g
  let out = ''
  let m: RegExpExecArray | null
  while ((m = rx.exec(src))) {
    const tok = m[1]
    if (!tok) continue
    const clsInner = m[2]
    const min = m[4] ? Number(m[4]) : 1
    const max = m[5] ? Number(m[5]) : min
    const n = min + ri(max - min + 1)
    const set = tok === '\\d' ? DIG : (clsInner != null ? expandClass(clsInner) : tok)
    for (let i = 0; i < n; i++) out += pick(set)
  }
  return out
}

function check(value: string, t: GenType): boolean {
  const api = lib.value
  if (!api) return false
  if (t === 'vat') return api.validateVAT(value).valid
  if (t === 'iban') return api.validateIBAN(value).valid
  if (t === 'bsn') return api.validateBSN(value).valid
  return api.validateKvK(value).valid
}

// Build a value that PASSES the matching validator (verified before return).
function genValid(t: GenType, cc: string): string | null {
  const api = lib.value
  if (!api) return null
  if (t === 'iban') {
    const len = api.IBAN_LENGTHS[cc]
    if (!len) return null
    for (let a = 0; a < 80; a++) {
      const bban = digits(len - 4)
      const v = cc + ibanCheck(cc, bban) + bban
      if (check(v, 'iban')) return v
    }
    return null
  }
  if (t === 'vat') {
    const pat = api.VAT_PATTERNS[cc]
    if (!pat) return null
    // Brute-force then verify: format-only countries pass on the first sample,
    // checksum countries within a few hundred tries (measured worst case ~300).
    for (let a = 0; a < 8000; a++) {
      const v = cc + sampleVat(pat)
      if (check(v, 'vat')) return v
    }
    return null
  }
  if (t === 'bsn') {
    for (let a = 0; a < 500; a++) {
      const v = digits(9)
      if (v !== '000000000' && check(v, 'bsn')) return v
    }
    return null
  }
  for (let a = 0; a < 500; a++) {
    const v = digits(8)
    if (v !== '00000000' && check(v, 'kvk')) return v
  }
  return null
}

// Flip one digit to a different value.
function bumpDigit(s: string): string {
  const idx: number[] = []
  for (let i = 0; i < s.length; i++) if (/\d/.test(s.charAt(i))) idx.push(i)
  if (!idx.length) return s + '0'
  const p = idx[ri(idx.length)] ?? 0
  const d = (Number(s.charAt(p)) + 1 + ri(8)) % 10
  return s.slice(0, p) + String(d) + s.slice(p + 1)
}

// Build a value that FAILS the matching validator (verified before return).
// Digit mutations catch checksum types; format breaks catch the rest (KvK and
// format-only VAT countries have no checksum, so a flipped digit stays valid).
function genInvalid(t: GenType, valid: string): string | null {
  if (!valid) return null
  for (let a = 0; a < 40; a++) {
    const c = bumpDigit(valid)
    if (!check(c, t)) return c
  }
  const dropped = valid.slice(0, -1)
  if (dropped && !check(dropped, t)) return dropped
  const appended = valid + 'X'
  if (!check(appended, t)) return appended
  const reprefixed = 'Z' + valid.slice(1)
  if (!check(reprefixed, t)) return reprefixed
  return null
}

function generate(): void {
  genError.value = ''
  const t = type.value
  const cc = (t === 'bsn' || t === 'kvk') ? 'NL' : country.value
  const v = genValid(t, cc)
  if (!v) {
    genError.value = 'Could not generate a value for that selection — try another country.'
    validOut.value = ''
    invalidOut.value = ''
    return
  }
  validOut.value = v
  invalidOut.value = genInvalid(t, v) ?? ''
}

// ---- country lists (driven by the library) ----
const vatCountries = computed<string[]>(() =>
  lib.value ? [...lib.value.EU_COUNTRIES].sort() : ['NL']
)
// IBAN uses ISO codes (Greece = GR), VAT uses the EL prefix — normalise here.
const ibanCountries = computed<string[]>(() => {
  const api = lib.value
  if (!api) return ['NL']
  const iso = [...new Set(api.EU_COUNTRIES.map(c => (c === 'EL' ? 'GR' : c)))]
  return iso.filter(c => api.IBAN_LENGTHS[c]).sort()
})
const countries = computed<string[]>(() =>
  type.value === 'iban' ? ibanCountries.value : vatCountries.value
)
const showCountry = computed(() => type.value === 'vat' || type.value === 'iban')
const vatFormatOnly = computed(() =>
  type.value === 'vat' && !!lib.value && !lib.value.VAT_CHECKSUM_SUPPORTED.includes(country.value)
)

// Reset to a country valid for both VAT and IBAN when the type changes.
watch(type, () => {
  country.value = 'NL'
})
watch([type, country, lib], () => {
  if (lib.value) generate()
})

onMounted(async () => {
  try {
    lib.value = await loadLib()
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Could not load the library.'
  }
})

// ---- clipboard ----
const copied = ref<'valid' | 'invalid' | null>(null)
async function copy(which: 'valid' | 'invalid'): Promise<void> {
  const text = which === 'valid' ? validOut.value : invalidOut.value
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = which
    setTimeout(() => (copied.value = null), 1500)
  } catch { /* clipboard unavailable */ }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-10 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">
        <span class="text-primary">eu-validate</span> mock-data generator
      </h1>
      <p class="text-muted mt-2 max-w-xl mx-auto">
        Generate realistic <strong class="text-default">valid and invalid</strong> EU test
        identifiers for your integration and unit tests — VAT, IBAN, BSN and KvK. Every value is
        verified against the library in your browser before it is shown.
      </p>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        <ULink
          to="/demo"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-lucide-badge-check" />
          Validator demo
        </ULink>
        <ULink
          to="https://www.npmjs.com/package/@alosha/eu-validate"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-npm" />
          npm
        </ULink>
        <ULink
          to="https://github.com/avlisodraude/eu-validate"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-github" />
          GitHub
        </ULink>
      </div>
    </div>

    <UAlert
      v-if="loadError"
      color="error"
      variant="soft"
      icon="i-lucide-alert-triangle"
      :title="loadError"
    />

    <div class="rounded-xl border border-default p-5 sm:p-6 space-y-5">
      <!-- Type selector -->
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="t in types"
          :key="t.key"
          :color="type === t.key ? 'primary' : 'neutral'"
          :variant="type === t.key ? 'solid' : 'soft'"
          size="sm"
          :title="t.note"
          @click="type = t.key"
        >
          {{ t.label }}
        </UButton>
      </div>

      <!-- Country + regenerate -->
      <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div
          v-if="showCountry"
          class="flex items-center gap-2"
        >
          <span class="text-sm text-muted">Country</span>
          <USelect
            v-model="country"
            :items="countries"
            class="w-28"
          />
        </div>
        <span
          v-else
          class="text-sm text-muted"
        >Netherlands ({{ type.toUpperCase() }} is NL-specific)</span>

        <UButton
          icon="i-lucide-refresh-cw"
          size="sm"
          class="sm:ml-auto"
          :disabled="!lib"
          @click="generate"
        >
          Regenerate
        </UButton>
      </div>

      <p
        v-if="vatFormatOnly"
        class="text-xs text-muted flex gap-1.5"
      >
        <UIcon
          name="i-lucide-info"
          class="size-3.5 mt-0.5 shrink-0"
        />
        <span>
          This country has no public VAT checksum, so the offline check is format-only —
          “valid” here means structurally valid, not checksum-verified.
        </span>
      </p>

      <!-- Outputs -->
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="rounded-lg border border-primary/40 bg-primary/5 p-4">
          <div class="flex items-center gap-2 text-sm font-medium">
            <UIcon
              name="i-lucide-circle-check"
              class="size-4 text-primary"
            />
            Valid
          </div>
          <div class="mt-3 flex items-center gap-2">
            <code class="flex-1 font-mono text-sm break-all">{{ validOut || '—' }}</code>
            <UButton
              :icon="copied === 'valid' ? 'i-lucide-check' : 'i-lucide-copy'"
              color="neutral"
              variant="ghost"
              size="xs"
              :disabled="!validOut"
              :aria-label="'Copy valid ' + type.toUpperCase()"
              @click="copy('valid')"
            />
          </div>
        </div>

        <div class="rounded-lg border border-error/40 bg-error/5 p-4">
          <div class="flex items-center gap-2 text-sm font-medium">
            <UIcon
              name="i-lucide-circle-x"
              class="size-4 text-error"
            />
            Invalid
          </div>
          <div class="mt-3 flex items-center gap-2">
            <code class="flex-1 font-mono text-sm break-all">{{ invalidOut || '—' }}</code>
            <UButton
              :icon="copied === 'invalid' ? 'i-lucide-check' : 'i-lucide-copy'"
              color="neutral"
              variant="ghost"
              size="xs"
              :disabled="!invalidOut"
              :aria-label="'Copy invalid ' + type.toUpperCase()"
              @click="copy('invalid')"
            />
          </div>
        </div>
      </div>

      <UAlert
        v-if="genError"
        color="error"
        variant="soft"
        icon="i-lucide-alert-triangle"
        :title="genError"
      />

      <p class="text-xs text-muted text-center">
        Generated client-side and verified against <code>@alosha/eu-validate</code> — the valid
        value passes the matching validator, the invalid value fails it. Nothing is sent anywhere.
      </p>
    </div>

    <!-- Bookmark callout -->
    <div class="rounded-xl border border-default bg-elevated/30 p-5 flex items-start gap-3">
      <UIcon
        name="i-lucide-bookmark"
        class="size-5 text-primary mt-0.5 shrink-0"
      />
      <div class="text-sm">
        <p class="font-medium text-highlighted">
          Bookmark this utility for your dev team
        </p>
        <p class="text-muted mt-1">
          Keep <span class="font-mono text-default">eu-validate.alosha.dev/generator</span> handy
          for seeding test suites with checksum-accurate VAT, IBAN and BSN fixtures — no more
          hand-crafted magic numbers.
        </p>
      </div>
    </div>
  </div>
</template>
