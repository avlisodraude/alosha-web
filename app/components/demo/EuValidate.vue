<script setup lang="ts">
/**
 * Live, in-browser eu-validate demo. Loads the standalone @alosha/eu-validate
 * browser bundle (/lib/eu-validate.js) on demand and validates VAT / IBAN /
 * BSN / KvK / postal codes entirely client-side. Nothing is sent anywhere —
 * the library makes zero network calls by design.
 *
 * The supported postal-code countries and VAT checksum coverage are read from
 * the library itself (POSTAL_PATTERNS / VAT_CHECKSUM_SUPPORTED) so this UI can
 * never advertise a capability the shipped package doesn't have.
 */

type IdentifierType = 'vat' | 'iban' | 'bsn' | 'kvk' | 'postalCode'
type Mode = 'auto' | IdentifierType
type ErrorCode = 'EMPTY_INPUT' | 'INVALID_FORMAT' | 'UNKNOWN_COUNTRY' | 'UNSUPPORTED_COUNTRY' | 'CHECKSUM_FAILED' | 'COUNTRY_REQUIRED'

interface ValidationResult {
  valid: boolean
  input: string
  normalized: string | null
  country: string | null
  type: IdentifierType
  checks: { format: boolean, checksum: boolean | null }
  errors: ErrorCode[]
}

interface EuValidateApi {
  validate: (value: string, opts: { type: IdentifierType, country?: string }) => ValidationResult
  VAT_CHECKSUM_SUPPORTED: string[]
  POSTAL_PATTERNS: Record<string, unknown>
}

const tabs: { key: Mode, label: string, placeholder: string }[] = [
  { key: 'auto', label: 'Auto', placeholder: 'Paste any EU identifier — the type is detected for you' },
  { key: 'vat', label: 'VAT', placeholder: 'NL810433941B01' },
  { key: 'iban', label: 'IBAN', placeholder: 'NL91ABNA0417164300' },
  { key: 'bsn', label: 'BSN', placeholder: '111222333' },
  { key: 'kvk', label: 'KvK', placeholder: '69599084' },
  { key: 'postalCode', label: 'Postal code', placeholder: '1011 AB' }
]

// Curated, real examples (verified against the library): valid ones and an invalid one each.
const examples: Record<IdentifierType, { valid: string[], invalid: string }> = {
  vat: { valid: ['NL810433941B01', 'BE0477472701', 'DE136695976'], invalid: 'NL000099998B57' },
  iban: { valid: ['NL91ABNA0417164300', 'DE89370400440532013000'], invalid: 'NL00ABNA0417164300' },
  bsn: { valid: ['111222333'], invalid: '111222334' },
  kvk: { valid: ['69599084'], invalid: '810000000' },
  postalCode: { valid: ['1011 AB'], invalid: 'ABCDEF' }
}

// Mixed examples shown in Auto mode — one of each common identifier.
const autoExamples = ['NL810433941B01', 'NL91ABNA0417164300', '111222333', '69599084']

// Per-country postal-code examples (also drive the placeholder) so the hint
// matches the selected country instead of always showing the NL format.
const postalExamples: Record<string, string> = {
  NL: '1011 AB', DE: '10115', FR: '75008', BE: '1000', ES: '28013', IT: '00184'
}

const errorLabels: Record<ErrorCode, string> = {
  EMPTY_INPUT: 'No input provided',
  INVALID_FORMAT: 'Format does not match this identifier',
  UNKNOWN_COUNTRY: 'Country could not be determined',
  UNSUPPORTED_COUNTRY: 'Checksum not implemented for this country',
  CHECKSUM_FAILED: 'Checksum / check-digit failed',
  COUNTRY_REQUIRED: 'A country is required for this check'
}

const typeLabels: Record<IdentifierType, string> = {
  vat: 'VAT', iban: 'IBAN', bsn: 'BSN', kvk: 'KvK', postalCode: 'Postal code'
}

const fnNames: Record<IdentifierType, string> = {
  vat: 'validateVAT', iban: 'validateIBAN', bsn: 'validateBSN', kvk: 'validateKvK', postalCode: 'validate'
}

const mode = ref<Mode>('auto')
const value = ref('')
const country = ref('NL')
const lib = ref<EuValidateApi | null>(null)
const loadError = ref('')
const showCode = ref(false)
const inputWrap = ref<HTMLElement | null>(null)

// Postal countries come straight from the library so the dropdown can never
// offer a country the shipped package doesn't actually support.
const postalCountries = computed(() => Object.keys(lib.value?.POSTAL_PATTERNS ?? { NL: 1 }))

// Placeholder + "Try" examples follow the selected postal country.
const placeholder = computed(() => {
  if (mode.value === 'postalCode') return postalExamples[country.value] ?? '1011 AB'
  return tabs.find(t => t.key === mode.value)?.placeholder ?? ''
})

const validExamples = computed<string[]>(() => {
  if (mode.value === 'auto') return autoExamples
  if (mode.value === 'postalCode') return [postalExamples[country.value] ?? '1011 AB']
  return examples[mode.value].valid
})

const invalidExample = computed(() => (mode.value === 'auto' ? null : examples[mode.value].invalid))

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

onMounted(async () => {
  try {
    lib.value = await loadLib()
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Could not load the library.'
  }
})

// Best-effort type detection for Auto mode, driven by the library's own
// validators rather than a parallel set of regexes.
function detectType(raw: string): IdentifierType {
  const api = lib.value
  const cleaned = raw.replace(/[\s.\-/]/g, '').toUpperCase()
  if (!api) return 'vat'
  if (/^[A-Z]{2}\d{2}/.test(cleaned)) {
    if (api.validate(raw, { type: 'iban' }).valid) return 'iban'
    if (api.validate(raw, { type: 'vat' }).valid) return 'vat'
    // Neither passes fully — prefer whichever at least matches the format.
    if (api.validate(raw, { type: 'vat' }).checks.format) return 'vat'
    return 'iban'
  }
  if (/^\d+$/.test(cleaned)) {
    if (api.validate(raw, { type: 'bsn' }).valid) return 'bsn'
    if (cleaned.length === 8) return 'kvk'
    return 'bsn'
  }
  return 'vat'
}

interface Evaluation {
  result: ValidationResult | null
  error: string | null
  resolvedType: IdentifierType | null
}

const evaluation = computed<Evaluation>(() => {
  if (!lib.value || !value.value.trim()) return { result: null, error: null, resolvedType: null }
  const t: IdentifierType = mode.value === 'auto' ? detectType(value.value) : mode.value
  const opts = t === 'postalCode' ? { type: t, country: country.value } : { type: t }
  try {
    return { result: lib.value.validate(value.value, opts), error: null, resolvedType: t }
  } catch {
    return { result: null, error: 'Could not validate that input. Please try a different value.', resolvedType: t }
  }
})

const result = computed(() => evaluation.value.result)
const resolvedType = computed(() => evaluation.value.resolvedType)
const runtimeError = computed(() => evaluation.value.error)

const supported = computed(() => lib.value?.VAT_CHECKSUM_SUPPORTED ?? [])

// Surface the documented NL VAT caveat exactly when it bites: a NL number that
// passes the format check but fails the offline 11-proof.
const showNlVatCaveat = computed(() =>
  resolvedType.value === 'vat'
  && result.value?.country === 'NL'
  && result.value?.checks.format === true
  && result.value?.errors.includes('CHECKSUM_FAILED')
)

const codeSnippet = computed(() => {
  const t = resolvedType.value
  const r = result.value
  if (!t || !r) return ''
  const fn = fnNames[t]
  const call = t === 'postalCode'
    ? `validate('${value.value}', { type: 'postalCode', country: '${country.value}' })`
    : `${fn}('${value.value}')`
  return `import { ${fn} } from '@alosha/eu-validate'\n\n${call}\n// →\n${JSON.stringify(r, null, 2)}`
})

function focusInput() {
  nextTick(() => inputWrap.value?.querySelector('input')?.focus())
}

function selectMode(m: Mode) {
  mode.value = m
  value.value = ''
  focusInput()
}

function use(v: string) {
  value.value = v
  focusInput()
}

const copied = ref(false)
async function copyInstall() {
  try {
    await navigator.clipboard.writeText('npm i @alosha/eu-validate')
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch { /* clipboard unavailable */ }
}

function checkLabel(c: boolean | null) {
  return c === null ? 'n/a' : c ? 'pass' : 'fail'
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-10 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">
        Try <span class="text-primary">eu-validate</span>
      </h1>
      <p class="text-muted mt-2 max-w-xl mx-auto">
        Validate a VAT number, IBAN, BSN, KvK number or postal code — checked
        right in your browser. Nothing is sent anywhere; the library makes zero network calls.
      </p>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        <button
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors"
          @click="copyInstall"
        >
          <span class="text-muted">$</span> npm i @alosha/eu-validate
          <UIcon
            :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            class="ml-1 size-3.5 align-text-bottom"
            :class="copied ? 'text-primary' : 'text-muted'"
          />
        </button>
        <span
          class="sr-only"
          aria-live="polite"
        >{{ copied ? 'Install command copied to clipboard' : '' }}</span>
        <ULink
          to="/generator"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-lucide-wand-sparkles" />
          Generator
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
      <!-- Type tabs -->
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="t in tabs"
          :key="t.key"
          :color="mode === t.key ? 'primary' : 'neutral'"
          :variant="mode === t.key ? 'solid' : 'soft'"
          size="sm"
          :title="t.key === 'auto' ? 'Detect the identifier type automatically' : undefined"
          @click="selectMode(t.key)"
        >
          {{ t.label }}
        </UButton>
      </div>

      <p
        v-if="mode === 'auto'"
        class="text-sm text-muted -mt-1"
      >
        <span class="text-default font-medium">Auto-detect</span> figures out whether your
        input is a VAT, IBAN, BSN or KvK number — just paste and go. Pick a tab to force a
        specific check.
      </p>

      <!-- Input row -->
      <div class="flex flex-col sm:flex-row gap-3">
        <USelect
          v-if="mode === 'postalCode'"
          v-model="country"
          :items="postalCountries"
          class="sm:w-32"
        />
        <div
          ref="inputWrap"
          class="flex-1"
        >
          <UInput
            v-model="value"
            :placeholder="placeholder"
            size="lg"
            class="w-full font-mono"
            autofocus
          />
        </div>
      </div>

      <!-- Examples -->
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <span class="text-muted">Try:</span>
        <button
          v-for="ex in validExamples"
          :key="ex"
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-2 py-1 hover:border-primary/50 transition-colors"
          @click="use(ex)"
        >
          {{ ex }}
        </button>
        <button
          v-if="invalidExample"
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-2 py-1 hover:border-error/50 text-muted transition-colors"
          @click="use(invalidExample)"
        >
          {{ invalidExample }} <span class="opacity-60">(invalid)</span>
        </button>
      </div>

      <!-- Result -->
      <div
        aria-live="polite"
        role="status"
      >
        <Transition name="fade">
          <div
            v-if="result"
            class="rounded-lg border p-4"
            :class="result.valid ? 'border-primary/40 bg-primary/5' : 'border-error/40 bg-error/5'"
          >
            <div class="flex flex-wrap items-center gap-2">
              <UIcon
                :name="result.valid ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                class="size-5"
                :class="result.valid ? 'text-primary' : 'text-error'"
              />
              <span class="font-semibold">{{ result.valid ? 'Valid' : 'Invalid' }}</span>
              <UBadge
                v-if="mode === 'auto' && resolvedType"
                color="primary"
                variant="subtle"
                size="sm"
                :title="`Detected identifier type: ${typeLabels[resolvedType]}`"
              >
                detected: {{ typeLabels[resolvedType] }}
              </UBadge>
              <UBadge
                v-if="result.country"
                color="neutral"
                variant="subtle"
                size="sm"
              >
                {{ result.country }}
              </UBadge>
              <span class="text-xs text-muted ml-auto">offline · format + checksum only</span>
            </div>

            <dl class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-4 text-sm">
              <div>
                <dt class="text-xs text-muted uppercase tracking-wide">
                  Normalized
                </dt>
                <dd class="font-mono break-all">
                  {{ result.normalized ?? '—' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs text-muted uppercase tracking-wide">
                  Type
                </dt>
                <dd class="font-mono">
                  {{ result.type }}
                </dd>
              </div>
              <div>
                <dt class="text-xs text-muted uppercase tracking-wide">
                  Format
                </dt>
                <dd
                  class="font-mono"
                  :class="result.checks.format ? 'text-primary' : 'text-error'"
                >
                  {{ checkLabel(result.checks.format) }}
                </dd>
              </div>
              <div>
                <dt class="text-xs text-muted uppercase tracking-wide">
                  Checksum
                </dt>
                <dd
                  class="font-mono"
                  :class="result.checks.checksum === null ? 'text-muted' : result.checks.checksum ? 'text-primary' : 'text-error'"
                >
                  {{ checkLabel(result.checks.checksum) }}
                </dd>
              </div>
            </dl>

            <div
              v-if="result.errors.length"
              class="mt-3 flex flex-wrap gap-2"
            >
              <UBadge
                v-for="err in result.errors"
                :key="err"
                color="error"
                variant="subtle"
                size="sm"
                :title="errorLabels[err]"
              >
                {{ err }}
              </UBadge>
            </div>

            <!-- Documented NL VAT caveat -->
            <p
              v-if="showNlVatCaveat"
              class="mt-3 text-xs text-muted flex gap-1.5"
            >
              <UIcon
                name="i-lucide-info"
                class="size-3.5 mt-0.5 shrink-0"
              />
              <span>
                Some post-2020 Dutch sole-trader BTW-IDs are randomised and won't satisfy the
                offline 11-proof. Confirm these against VIES (the hosted <code>verifyVAT()</code>)
                before treating them as invalid.
              </span>
            </p>

            <!-- Show-the-code toggle -->
            <div class="mt-4 pt-3 border-t border-default">
              <button
                type="button"
                class="text-xs text-muted hover:text-default inline-flex items-center gap-1"
                @click="showCode = !showCode"
              >
                <UIcon
                  :name="showCode ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                  class="size-3.5"
                />
                {{ showCode ? 'Hide code' : 'Show the code' }}
              </button>
              <Transition name="fade">
                <pre
                  v-if="showCode"
                  class="mt-2 bg-gray-900 dark:bg-gray-950 rounded-lg p-3 text-xs font-mono text-green-400 overflow-x-auto"
                >{{ codeSnippet }}</pre>
              </Transition>
            </div>
          </div>
        </Transition>
      </div>

      <UAlert
        v-if="runtimeError"
        color="error"
        variant="soft"
        icon="i-lucide-alert-triangle"
        :title="runtimeError"
      />

      <p
        v-if="!result && !runtimeError && !loadError"
        class="text-sm text-muted text-center py-2"
      >
        Enter a value above to see the result.
      </p>
    </div>

    <!-- VAT checksum coverage -->
    <div
      v-if="(mode === 'vat' || resolvedType === 'vat') && supported.length"
      class="text-center text-sm text-muted"
    >
      Full VAT checksum validation for {{ supported.length }} countries:
      <span class="font-mono text-default">{{ supported.join(' · ') }}</span>.
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
