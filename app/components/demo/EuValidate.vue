<script setup lang="ts">
/**
 * Live, in-browser eu-validate demo. Loads the standalone @alosha/eu-validate
 * browser bundle (/lib/eu-validate.js) on demand and validates VAT / IBAN /
 * BSN / KvK / postal codes entirely client-side. Nothing is sent anywhere —
 * the library makes zero network calls by design.
 */

type IdentifierType = 'vat' | 'iban' | 'bsn' | 'kvk' | 'postalCode'
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
}

const tabs: { key: IdentifierType, label: string, placeholder: string }[] = [
  { key: 'vat', label: 'VAT', placeholder: 'NL810433941B01' },
  { key: 'iban', label: 'IBAN', placeholder: 'NL91ABNA0417164300' },
  { key: 'bsn', label: 'BSN', placeholder: '111222333' },
  { key: 'kvk', label: 'KvK', placeholder: '69599084' },
  { key: 'postalCode', label: 'Postal code', placeholder: '1011 AB' }
]

// Curated, real examples (verified against the library): a valid and an invalid one each.
const examples: Record<IdentifierType, { valid: string[], invalid: string }> = {
  vat: { valid: ['NL810433941B01', 'BE0477472701', 'DE136695976'], invalid: 'NL000099998B57' },
  iban: { valid: ['NL91ABNA0417164300', 'DE89370400440532013000'], invalid: 'NL00ABNA0417164300' },
  bsn: { valid: ['111222333'], invalid: '111222334' },
  kvk: { valid: ['69599084'], invalid: '810000000' },
  postalCode: { valid: ['1011 AB'], invalid: 'ABCDEF' }
}

const errorLabels: Record<ErrorCode, string> = {
  EMPTY_INPUT: 'No input provided',
  INVALID_FORMAT: 'Format does not match this identifier',
  UNKNOWN_COUNTRY: 'Country could not be determined',
  UNSUPPORTED_COUNTRY: 'Checksum not implemented for this country',
  CHECKSUM_FAILED: 'Checksum / check-digit failed',
  COUNTRY_REQUIRED: 'A country is required for this check'
}

const type = ref<IdentifierType>('vat')
const value = ref('')
const country = ref('NL')
const lib = ref<EuValidateApi | null>(null)
const loadError = ref('')

const postalCountries = ['NL', 'BE', 'DE', 'FR', 'ES', 'IT', 'PT', 'AT', 'PL', 'SE', 'DK', 'FI']

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

const result = computed<ValidationResult | null>(() => {
  if (!lib.value || !value.value.trim()) return null
  const opts = type.value === 'postalCode' ? { type: type.value, country: country.value } : { type: type.value }
  try {
    return lib.value.validate(value.value, opts)
  } catch {
    return null
  }
})

const supported = computed(() => lib.value?.VAT_CHECKSUM_SUPPORTED ?? [])

function selectType(t: IdentifierType) {
  type.value = t
  value.value = ''
}

function use(v: string) {
  value.value = v
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
          :color="type === t.key ? 'primary' : 'neutral'"
          :variant="type === t.key ? 'solid' : 'soft'"
          size="sm"
          @click="selectType(t.key)"
        >
          {{ t.label }}
        </UButton>
      </div>

      <!-- Input row -->
      <div class="flex flex-col sm:flex-row gap-3">
        <USelect
          v-if="type === 'postalCode'"
          v-model="country"
          :items="postalCountries"
          class="sm:w-32"
        />
        <UInput
          v-model="value"
          :placeholder="tabs.find(t => t.key === type)?.placeholder"
          size="lg"
          class="flex-1 font-mono"
          autofocus
        />
      </div>

      <!-- Examples -->
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <span class="text-muted">Try:</span>
        <button
          v-for="ex in examples[type].valid"
          :key="ex"
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-2 py-1 hover:border-primary/50 transition-colors"
          @click="use(ex)"
        >
          {{ ex }}
        </button>
        <button
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-2 py-1 hover:border-error/50 text-muted transition-colors"
          @click="use(examples[type].invalid)"
        >
          {{ examples[type].invalid }} <span class="opacity-60">(invalid)</span>
        </button>
      </div>

      <!-- Result -->
      <Transition name="fade">
        <div
          v-if="result"
          class="rounded-lg border p-4"
          :class="result.valid ? 'border-primary/40 bg-primary/5' : 'border-error/40 bg-error/5'"
        >
          <div class="flex items-center gap-2">
            <UIcon
              :name="result.valid ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
              class="size-5"
              :class="result.valid ? 'text-primary' : 'text-error'"
            />
            <span class="font-semibold">{{ result.valid ? 'Valid' : 'Invalid' }}</span>
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
        </div>
      </Transition>

      <p
        v-if="!result && !loadError"
        class="text-sm text-muted text-center py-2"
      >
        Enter a value above to see the result.
      </p>
    </div>

    <!-- VAT checksum coverage -->
    <div
      v-if="type === 'vat' && supported.length"
      class="text-center text-sm text-muted"
    >
      Full VAT checksum validation for {{ supported.length }} countries:
      <span class="font-mono text-default">{{ supported.join(' · ') }}</span>.
      Other EU countries are format-checked.
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
