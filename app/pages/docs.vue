<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { isEuValidate } = useSite()
const docsRoute = useRoute()
const showEuValidate = computed(() => isEuValidate || docsRoute.query.product === 'eu-validate')

useSeoMeta({
  title: () => showEuValidate.value ? 'eu-validate 0.6.0 documentation — offline validation' : 'Documentation — PixSqueeze browser library and Batch API',
  description: () => showEuValidate.value ? 'eu-validate 0.6.0: 89 IBAN formats, VAT checksums, safe inputs, strict postal coverage and privacy-aware errors.' : 'PixSqueeze 1.5 browser compression, target sizes, TypeScript, and cancellation, plus the separate hosted Batch API reference.',
  ogTitle: () => showEuValidate.value ? 'eu-validate 0.6.0 API documentation' : 'API Documentation — PixSqueeze',
  ogDescription: () => showEuValidate.value ? 'Offline validators, errors, coverage and upgrade guidance for eu-validate 0.6.0.' : 'Complete reference for the PixSqueeze batch image compression API.',
  ogImage: 'https://alosha.dev/og.png',
  twitterCard: 'summary_large_image'
})

const browserExample = `import PixSqueeze from '@alosha/pixsqueeze'

const result = await PixSqueeze.compress(file, {
  mimeType: 'image/jpeg',
  targetSize: 500_000,
  allowResize: true,
  maxWidth: 1920
})

if (result.targetMet === false) {
  console.warn('Target could not be reached', result.outputSize)
} else {
  // result.file is ready to download or upload.
}`

const cancelExample = `const controller = new AbortController()
const pending = PixSqueeze.compress(file, {
  signal: controller.signal,
  timeout: 15_000
})
// Call controller.abort() from a cancel button while pending.
const result = await pending`

const browserOptions = [
  { name: 'targetSize', description: 'Positive byte target. Unmet targets return targetMet: false, with the best result found.' },
  { name: 'quality / minQuality', description: 'Initial quality and lower search bound; defaults 0.8 / 0.4. JPEG and WebP use quality search.' },
  { name: 'maxAttempts', description: 'Encoding budget from 1 to 20; default 8. Every attempt starts from the same source.' },
  { name: 'allowResize', description: 'Allow smaller dimensions to approach a target; default false. PNG can use this without a quality search.' },
  { name: 'signal / timeout', description: 'AbortSignal and total timeout in milliseconds (default 30000; 0 disables it). Late encoder output is discarded.' },
  { name: 'conversion', description: 'Explicit heic/tiff/raw endpoint URLs, plus optional headers and credentials. No upload occurs without a matching configured endpoint.' }
]

const registerExample = `curl -X POST ${PIXSQUEEZE_API}/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com"}'`

const registerResponse = `{
  "apiKey": "psx_...",
  "plan": "FREE",
  "monthlyLimit": 100,
  "message": "Account created. Keep your API key safe — it will not be shown again."
}`

const compressExample = `curl -X POST ${PIXSQUEEZE_API}/compress/batch \\
  -H "Authorization: Bearer psx_YOUR_API_KEY" \\
  -F "files=@photo1.jpg" \\
  -F "files=@photo2.heic" \\
  -F "quality=0.7" \\
  -F "maxWidth=1280"`

const compressResponse = `{
  "processed": 2,
  "failed": 0,
  "results": [
    { "name": "photo1.jpg", "originalName": "photo1.jpg",  "size": 84213, "mimeType": "image/jpeg", "data": "base64..." },
    { "name": "photo2.jpg", "originalName": "photo2.heic", "size": 91067, "mimeType": "image/jpeg", "data": "base64..." }
  ],
  "usage": { "used": 2, "limit": 100, "remaining": 98, "plan": "FREE" }
}`

const rotateExample = `curl -X POST ${PIXSQUEEZE_API}/auth/rotate-key \\
  -H "Authorization: Bearer psx_YOUR_CURRENT_KEY"`

const usageExample = `curl ${PIXSQUEEZE_API}/usage \\
  -H "Authorization: Bearer psx_YOUR_API_KEY"`

const usageResponse = `{
  "plan": "FREE",
  "used": 3,
  "limit": 100,
  "remaining": 97,
  "resetDate": "2026-07-01"
}`

const compressParams = [
  { name: 'files', type: 'file', required: true, description: 'One or more image files (multipart). Repeat the field for each file. JPEG, PNG, WebP, GIF, HEIC, TIFF and camera RAW are accepted (RAW is compressed from its embedded full-resolution preview).' },
  { name: 'quality', type: 'number', required: false, description: 'Compression quality between 0.1 and 1. Default 0.8.' },
  { name: 'maxWidth', type: 'number', required: false, description: 'Resize images wider than this to fit. Aspect ratio is preserved.' },
  { name: 'maxHeight', type: 'number', required: false, description: 'Resize images taller than this to fit. Aspect ratio is preserved.' },
  { name: 'mimeType', type: 'string', required: false, description: 'Output format: image/jpeg (default), image/png, or image/webp.' }
]

const errors = [
  { code: '401', meaning: 'Missing or invalid API key.' },
  { code: '409', meaning: 'An account with this email already exists. Keys are shown only once; rotate via /auth/rotate-key.' },
  { code: '413', meaning: 'Request body too large.' },
  { code: '422', meaning: 'Unsupported or unreadable image file.' },
  { code: '429', meaning: 'Monthly image limit reached. Upgrade your plan or wait for the reset date.' },
  { code: '500', meaning: 'Unexpected server error — retry with exponential backoff.' }
]
</script>

<template>
  <DocsEuValidate v-if="showEuValidate" />
  <UContainer
    v-else
    class="py-12 max-w-3xl"
  >
    <h1 class="text-3xl font-bold">
      PixSqueeze documentation
    </h1>
    <p class="text-muted mt-2">
      Everything you need to integrate the PixSqueeze batch compression API.
      All endpoints live under
      <code class="font-mono text-sm bg-muted/20 px-1 rounded">{{ PIXSQUEEZE_API }}</code>.
    </p>

    <section
      id="browser-library"
      class="mt-10"
    >
      <h2 class="text-xl font-semibold">
        Browser library · version 1.5.0
      </h2>
      <p class="text-sm text-muted mt-2">
        Install @alosha/pixsqueeze for local JPEG, PNG, and WebP compression. The existing callback constructor remains supported.
        The Promise API adds bounded byte targets and output information. These options belong to the browser library, not the hosted Batch API below.
      </p>
      <div class="bg-gray-900 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto mt-3">
        <pre>{{ browserExample }}</pre>
      </div>
      <div class="divide-y divide-default mt-4">
        <div
          v-for="option in browserOptions"
          :key="option.name"
          class="py-3 text-sm"
        >
          <code class="font-mono text-xs">{{ option.name }}</code>
          <p class="text-muted mt-1">
            {{ option.description }}
          </p>
        </div>
      </div>
      <h3 class="font-semibold mt-5">
        Results and cancellation
      </h3>
      <p class="text-sm text-muted mt-2">
        Results include file, originalSize, outputSize, actual mimeType, width, height, targetSize, targetMet, attempts, converted, and returnedOriginal.
        Without a target, targetMet is null. Processing errors reject; an unattainable byte target resolves with targetMet false.
        Standard cancellation rejects with AbortError and a deadline with TimeoutError.
      </p>
      <div class="bg-gray-900 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto mt-3">
        <pre>{{ cancelExample }}</pre>
      </div>
      <p class="text-sm text-muted mt-3">
        ESM and bundler consumers use the default import above. CommonJS uses require('@alosha/pixsqueeze'). TypeScript also supports
        import PixSqueeze = require('@alosha/pixsqueeze') and the PixSqueeze.Options, AsyncOptions, ConversionOptions, and CompressionResult types.
        Compression requires a browser DOM; importing the package does not provide a Node image encoder.
      </p>
      <p class="text-sm text-muted mt-3">
        HEIC, TIFF, and RAW workflows require your explicitly configured conversion server. The repository includes a local playground and /api/convert/* routes;
        those routes are not hosted by this browser-only demo. RAW conversion depends on installed codecs. Server conversion currently returns an intermediate JPEG.
        A returned original may retain its metadata even when retainExif is false. Inspect the actual result format because browser encoders can fall back to PNG.
      </p>
      <div class="flex flex-wrap gap-4 mt-4 text-sm">
        <NuxtLink
          to="/demo"
          class="text-primary hover:underline"
        >Try target-size compression</NuxtLink>
        <a
          href="https://github.com/avlisodraude/pixsqueeze/blob/main/README.md"
          class="text-primary hover:underline"
        >Full library reference and local setup</a>
      </div>
    </section>

    <p class="text-sm text-muted mt-6">
      Looking for eu-validate 0.6.0?
      <NuxtLink
        to="/docs?product=eu-validate"
        class="text-primary hover:underline"
      >Read the offline identifier validation documentation.</NuxtLink>
    </p>

    <!-- Authentication -->
    <section class="mt-10">
      <h2 class="text-xl font-semibold">
        Authentication
      </h2>
      <p class="text-sm text-muted mt-2">
        Create an account to get an API key, then pass it as a Bearer token in every request:
        <code class="font-mono bg-muted/20 px-1 rounded">Authorization: Bearer psx_...</code>.
        You can also sign up on this site and find your key in the
        <NuxtLink
          to="/dashboard/api-key"
          class="text-primary hover:underline"
        >dashboard</NuxtLink>.
      </p>

      <h3 class="font-mono text-sm font-semibold mt-5 flex items-center gap-2">
        <UBadge
          color="primary"
          variant="subtle"
          size="sm"
        >
          POST
        </UBadge> /auth/register
      </h3>
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto mt-2">
        <pre>{{ registerExample }}</pre>
      </div>
      <p class="text-xs text-muted mt-2">
        Response:
      </p>
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto mt-1">
        <pre>{{ registerResponse }}</pre>
      </div>
      <p class="text-xs text-muted mt-2">
        Your key is shown <strong class="text-default">only once</strong>. Registering an existing email returns
        <code class="font-mono bg-muted/20 px-1 rounded">409</code> — it never reveals the existing key.
      </p>

      <h3 class="font-mono text-sm font-semibold mt-5 flex items-center gap-2">
        <UBadge
          color="primary"
          variant="subtle"
          size="sm"
        >
          POST
        </UBadge> /auth/rotate-key
      </h3>
      <p class="text-sm text-muted mt-2">
        Lost or leaked your key? Rotate it using your current key. The old key is revoked immediately.
      </p>
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto mt-2">
        <pre>{{ rotateExample }}</pre>
      </div>
    </section>

    <!-- Compress -->
    <section class="mt-10">
      <h2 class="text-xl font-semibold">
        Compress images
      </h2>
      <h3 class="font-mono text-sm font-semibold mt-4 flex items-center gap-2">
        <UBadge
          color="primary"
          variant="subtle"
          size="sm"
        >
          POST
        </UBadge> /compress/batch
      </h3>
      <p class="text-sm text-muted mt-2">
        Send images as <strong class="text-default">multipart form data</strong>. Compressed results
        are returned as base64-encoded files in a single JSON response.
      </p>
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto mt-3">
        <pre>{{ compressExample }}</pre>
      </div>

      <h4 class="text-sm font-semibold mt-5">
        Form fields
      </h4>
      <div class="divide-y divide-default text-sm mt-1">
        <div
          v-for="p in compressParams"
          :key="p.name"
          class="py-2.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
        >
          <code class="font-mono text-xs bg-muted/20 px-1 rounded shrink-0 w-24">{{ p.name }}</code>
          <span class="text-xs text-muted shrink-0 w-20">{{ p.type }}{{ p.required ? ' · required' : '' }}</span>
          <span class="text-muted text-xs">{{ p.description }}</span>
        </div>
      </div>

      <p class="text-xs text-muted mt-4">
        Response:
      </p>
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto mt-1">
        <pre>{{ compressResponse }}</pre>
      </div>
      <p class="text-xs text-muted mt-3">
        Supported input formats: JPEG, PNG, WebP, GIF, HEIC/HEIF, TIFF, and camera RAW (CR2, NEF, ARW, DNG, and more).
      </p>
    </section>

    <!-- Usage -->
    <section class="mt-10">
      <h2 class="text-xl font-semibold">
        Check usage
      </h2>
      <h3 class="font-mono text-sm font-semibold mt-4 flex items-center gap-2">
        <UBadge
          color="success"
          variant="subtle"
          size="sm"
        >
          GET
        </UBadge> /usage
      </h3>
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto mt-3">
        <pre>{{ usageExample }}</pre>
      </div>
      <p class="text-xs text-muted mt-2">
        Response:
      </p>
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto mt-1">
        <pre>{{ usageResponse }}</pre>
      </div>
    </section>

    <!-- Billing -->
    <section class="mt-10">
      <h2 class="text-xl font-semibold">
        Billing
      </h2>
      <p class="text-sm text-muted mt-2">
        Plans are managed from the <NuxtLink
          to="/dashboard/billing"
          class="text-primary hover:underline"
        >dashboard</NuxtLink>,
        which uses these endpoints under the hood:
      </p>
      <ul class="text-sm text-muted mt-3 space-y-2">
        <li class="flex items-center gap-2">
          <UBadge
            color="primary"
            variant="subtle"
            size="sm"
          >
            POST
          </UBadge>
          <code class="font-mono text-xs">/billing/checkout</code> — start a Stripe Checkout session for a plan upgrade
        </li>
        <li class="flex items-center gap-2">
          <UBadge
            color="primary"
            variant="subtle"
            size="sm"
          >
            POST
          </UBadge>
          <code class="font-mono text-xs">/billing/portal</code> — open the Stripe customer portal
        </li>
      </ul>
    </section>

    <!-- Errors -->
    <section class="mt-10">
      <h2 class="text-xl font-semibold">
        Errors
      </h2>
      <div class="divide-y divide-default text-sm mt-2">
        <div
          v-for="e in errors"
          :key="e.code"
          class="py-2.5 flex items-baseline gap-4"
        >
          <code class="font-mono text-xs bg-muted/20 px-1.5 py-0.5 rounded shrink-0">{{ e.code }}</code>
          <span class="text-muted">{{ e.meaning }}</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mt-12">
      <UPageCTA
        title="Ready to try it?"
        description="100 free images per month. No credit card required."
        variant="subtle"
        :links="[
          { label: 'Get your API key', to: '/login?signup=1', trailingIcon: 'i-lucide-arrow-right' },
          { label: 'See pricing', to: '/#pricing', color: 'neutral', variant: 'outline' }
        ]"
      />
    </section>
  </UContainer>
</template>
