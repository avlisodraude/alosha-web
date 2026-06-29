<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'API Documentation — PixSqueeze',
  description: 'Complete reference for the PixSqueeze batch image compression API: authentication, endpoints, request formats, and error codes.',
  ogTitle: 'API Documentation — PixSqueeze',
  ogDescription: 'Complete reference for the PixSqueeze batch image compression API.',
  ogImage: 'https://alosha.dev/og.png',
  twitterCard: 'summary_large_image'
})

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
  <UContainer class="py-12 max-w-3xl">
    <h1 class="text-3xl font-bold">
      API Documentation
    </h1>
    <p class="text-muted mt-2">
      Everything you need to integrate the PixSqueeze batch compression API.
      All endpoints live under
      <code class="font-mono text-sm bg-muted/20 px-1 rounded">{{ PIXSQUEEZE_API }}</code>.
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
