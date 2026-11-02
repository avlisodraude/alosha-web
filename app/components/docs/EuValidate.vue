<script setup lang="ts">
const { euValidateUrl } = useSite()
const quickStart = `import { validateVAT, validateIBAN, validateBSN } from '@alosha/eu-validate'

validateVAT('NL123456782B01').valid       // true
validateIBAN('NL91ABNA0417164300').valid   // true
validateBSN('111222334').errors          // ['CHECKSUM_FAILED']`

const postalExample = `import { validatePostalCode, validate } from '@alosha/eu-validate'

validatePostalCode('1011 AB', { country: 'NL', strict: true })
// valid: true, checks.formatSupported: true

validatePostalCode('D02 AF30', { country: 'IE', strict: true })
// valid: false, errors: ['FORMAT_NOT_SUPPORTED']

validate('D02 AF30', { type: 'postalCode', country: 'IE' })
// legacy acceptance: valid: true, checks.formatSupported: false`

const resultExample = `{
  valid: true,
  input: 'NL91 ABNA 0417 1643 00',
  normalized: 'NL91ABNA0417164300',
  country: 'NL',
  type: 'iban',
  checks: { format: true, checksum: true },
  errors: []
}`

const validators = [
  { name: 'validateVAT', checks: 'EU VAT format and available checksum rules for all 27 country prefixes. Documented FR, CZ and LV sub-cases have no offline-verifiable checksum.' },
  { name: 'validateIBAN', checks: 'National character layout, exact length and mod-97 for all 89 countries in SWIFT IBAN registry release 103 (September 2026).' },
  { name: 'validateBSN', checks: 'Dutch eight/nine-digit format and 11-proof; all-zero values fail.' },
  { name: 'validateKvK', checks: 'Eight-digit Dutch company-number format. It does not establish registration; checksum is null.' },
  { name: 'validatePostalCode', checks: 'Format rules for NL, DE, FR, BE, ES and IT, with explicit coverage and an optional strict mode.' },
  { name: 'validate', checks: 'Dispatch by type. Postal calls also accept country and strict options.' }
]

const errors = [
  ['INVALID_INPUT', 'A JavaScript caller supplied a non-string. The result has input: an empty string; no coercion is performed.'],
  ['INPUT_TOO_LONG', 'The raw identifier exceeds 256 UTF-16 code units, before trimming or normalization.'],
  ['EMPTY_INPUT', 'Empty or whitespace-only input within the raw length limit.'],
  ['INVALID_OPTIONS', 'Malformed dispatcher or postal options. An unknown dispatcher type returns type: null.'],
  ['COUNTRY_REQUIRED', 'Postal country is missing or blank.'],
  ['UNKNOWN_COUNTRY', 'VAT or IBAN country has no supported rule.'],
  ['UNSUPPORTED_COUNTRY', 'Postal country is outside the supported EU set.'],
  ['FORMAT_NOT_SUPPORTED', 'Postal strict mode found no format rule. This reports missing coverage, not a known bad postal code.'],
  ['INVALID_FORMAT', 'The identifier fails a supported character-layout or country-length rule.'],
  ['CHECKSUM_FAILED', 'A performed checksum failed.'],
  ['CHECKSUM_NOT_VERIFIABLE', 'Informational VAT checksum exception or a legacy postal coverage gap; valid can still be true.']
]
</script>

<template>
  <UContainer class="py-12 max-w-4xl space-y-10">
    <header>
      <UBadge
        color="primary"
        variant="subtle"
      >
        Version 0.6.0
      </UBadge>
      <h1 class="text-3xl font-bold mt-3">
        eu-validate documentation
      </h1>
      <p class="text-muted mt-3">
        Validate EU identifiers locally in Node or the browser. The offline library has zero runtime dependencies;
        its validators make no network requests. Hosted VIES and KvK registration lookups are planned separately.
      </p>
      <div class="flex flex-wrap gap-4 mt-4 text-sm">
        <NuxtLink
          :to="`${euValidateUrl}/demo`"
          class="text-primary hover:underline"
        >Try the validator</NuxtLink>
        <NuxtLink
          :to="`${euValidateUrl}/generator`"
          class="text-primary hover:underline"
        >Generate test data</NuxtLink>
        <a
          href="https://www.npmjs.com/package/@alosha/eu-validate"
          class="text-primary hover:underline"
        >Install from npm</a>
        <a
          href="https://github.com/avlisodraude/eu-validate/blob/main/docs/api.md"
          class="text-primary hover:underline"
        >Full API reference</a>
      </div>
    </header>

    <section id="quick-start">
      <h2 class="text-xl font-semibold">
        Install and validate
      </h2>
      <pre class="rounded-lg bg-gray-900 p-4 text-green-400 overflow-x-auto text-sm mt-3">npm install @alosha/eu-validate@^0.6.0</pre>
      <pre class="rounded-lg bg-gray-900 p-4 text-green-400 overflow-x-auto text-sm mt-3">{{ quickStart }}</pre>
      <p class="text-sm text-muted mt-3">
        ESM and CommonJS exports include TypeScript declarations. VAT, IBAN, BSN and KvK inputs are normalized by
        removing spaces, dots, dashes and slashes and converting letters to uppercase. Postal inputs are trimmed and uppercased.
      </p>
    </section>

    <section id="validators">
      <h2 class="text-xl font-semibold">
        Offline checks and coverage
      </h2>
      <dl class="divide-y divide-default mt-3">
        <div
          v-for="validator in validators"
          :key="validator.name"
          class="py-3"
        >
          <dt class="font-mono text-sm font-semibold">
            {{ validator.name }}
          </dt>
          <dd class="text-muted text-sm mt-1">
            {{ validator.checks }}
          </dd>
        </div>
      </dl>
      <p class="text-sm text-muted mt-3">
        Passing checks does not establish company registration, bank-account existence, identity or account ownership.
        IBAN validation does not implement every domestic account checksum.
      </p>
    </section>

    <section id="results">
      <h2 class="text-xl font-semibold">
        Read a validation result
      </h2>
      <pre class="rounded-lg bg-gray-900 p-4 text-green-400 overflow-x-auto text-sm mt-3">{{ resultExample }}</pre>
      <p class="text-sm text-muted mt-3">
        Check valid for the validator's outcome. Require checks.checksum === true when your application needs a confirmed checksum;
        null means the checksum did not run or cannot be checked for that case. For postal codes, also inspect checks.formatSupported.
        isValid narrows valid: true, while assertValid throws ValidationError when valid is false.
      </p>
    </section>

    <section id="postal-coverage">
      <h2 class="text-xl font-semibold">
        Postal coverage and strict mode
      </h2>
      <p class="text-sm text-muted mt-3">
        Default mode preserves historical acceptance for EU countries without a format pattern and reports formatSupported: false.
        That acceptance does not confirm the format. Choose strict: true to reject an unchecked format with FORMAT_NOT_SUPPORTED.
        Supported patterns behave the same in both modes.
      </p>
      <pre class="rounded-lg bg-gray-900 p-4 text-green-400 overflow-x-auto text-sm mt-3">{{ postalExample }}</pre>
      <p class="text-sm text-muted mt-3">
        Country codes are trimmed and uppercased. EU_COUNTRIES uses ISO GR for Greece; VAT-specific tables and results use EL.
        Postal validation accepts GR or the historical EL alias and returns GR.
      </p>
    </section>

    <section id="errors">
      <h2 class="text-xl font-semibold">
        Inputs, errors and privacy
      </h2>
      <p class="text-sm text-muted mt-3">
        MAX_INPUT_LENGTH is 256 raw UTF-16 code units. Length is checked before trimming, so an excessive whitespace-only string
        returns INPUT_TOO_LONG. Validation reports the first applicable failure. Handle type: null from malformed dispatcher options
        before passing the result to helpers that expect a known identifier type.
      </p>
      <dl class="divide-y divide-default mt-3">
        <div
          v-for="[code, meaning] in errors"
          :key="code"
          class="py-3"
        >
          <dt class="font-mono text-xs font-semibold">
            {{ code }}
          </dt>
          <dd class="text-muted text-sm mt-1">
            {{ meaning }}
          </dd>
        </div>
      </dl>
      <p class="text-sm text-muted mt-4">
        ValidationError messages omit the identifier. Its result property remains accessible but is non-enumerable.
        Validation results themselves contain the original and normalized values: avoid explicitly logging sensitive result fields.
      </p>
    </section>

    <section id="upgrade">
      <h2 class="text-xl font-semibold">
        Upgrade from 0.5.0
      </h2>
      <p class="text-sm text-muted mt-3">
        Review the new input and option errors, the 256-code-unit limit, Greek country metadata and stricter IBAN acceptance.
        Costa Rica's IBAN length is corrected to 22. Postal strict mode is opt-in; the default compatibility behavior is retained.
        The release is verified by 400 tests and installed-package runtime and type checks on Node 22, 24 and 26.
      </p>
      <div class="flex flex-wrap gap-4 mt-4 text-sm">
        <a
          href="https://github.com/avlisodraude/eu-validate/blob/main/docs/offline-validation.md"
          class="text-primary hover:underline"
        >Migration guide and IBAN sources</a>
        <a
          href="https://github.com/avlisodraude/eu-validate/blob/main/CHANGELOG.md"
          class="text-primary hover:underline"
        >Changelog</a>
        <a
          href="https://github.com/avlisodraude/eu-validate/blob/main/docs/cloud-service-plan.md"
          class="text-primary hover:underline"
        >Future Cloud service plan</a>
      </div>
    </section>
  </UContainer>
</template>
