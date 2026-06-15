<script setup lang="ts">
useSeoMeta({
  title: 'eu-validate — offline EU identifier validation',
  description: 'Validate EU VAT numbers, IBANs, BSN and KvK numbers entirely offline — checksum-accurate, zero network calls. Free open-source npm package.',
  ogTitle: 'eu-validate — offline EU identifier validation',
  ogDescription: 'Validate EU VAT, IBAN, BSN and KvK numbers offline — checksum-accurate, zero dependencies. Free open-source npm package by Alosha.',
  ogUrl: 'https://eu-validate.alosha.dev',
  ogImage: 'https://eu-validate.alosha.dev/og.png',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://eu-validate.alosha.dev/og.png'
})

const features = [
  { icon: 'i-lucide-wifi-off', title: 'Fully offline', description: 'Every check runs locally with no network calls — no VIES round-trips, no rate limits, no data leaving your server.' },
  { icon: 'i-lucide-badge-check', title: 'VAT for 14 countries', description: 'Country-specific VAT checksum validation for 14 EU member states — structure and check digits, not just a regex.' },
  { icon: 'i-lucide-landmark', title: 'IBAN validation', description: 'ISO 13616 IBAN checks with mod-97 verification and per-country length rules.' },
  { icon: 'i-lucide-id-card', title: 'BSN & KvK', description: 'Dutch BSN (11-proef) and KvK number validation built in — handy for NL-focused products.' },
  { icon: 'i-lucide-feather', title: 'Zero dependencies', description: 'Tiny, tree-shakeable, and dependency-free. Ships ESM + types, works in Node and the browser.' },
  { icon: 'i-lucide-shield-check', title: 'Typed & tested', description: 'Written in TypeScript with full types and a green test suite covering every checksum path.' }
]

const codeExample = `# Install
npm install @alosha/eu-validate

# Use — every validator returns a ValidationResult
import { validateVAT, validateIBAN, validateBSN } from '@alosha/eu-validate'

validateVAT('NL810433941B01').valid      // → true
validateIBAN('NL91ABNA0417164300').valid // → true

const r = validateBSN('111222334')
r.valid   // → false
r.errors  // → ['CHECKSUM_FAILED']  (fails 11-proef)`
</script>

<template>
  <div>
    <!-- Hero -->
    <UPageHero
      class="hero-glow"
      :links="[
        { label: 'Live demo', to: '/demo', icon: 'i-lucide-play', size: 'xl', class: 'btn-grad' },
        { label: 'Get started free', to: 'https://www.npmjs.com/package/@alosha/eu-validate', target: '_blank', trailingIcon: 'i-lucide-arrow-right', size: 'xl', color: 'neutral', variant: 'subtle' },
        { label: 'View on GitHub', to: 'https://github.com/avlisodraude/eu-validate', target: '_blank', size: 'xl', color: 'neutral', variant: 'subtle', icon: 'i-simple-icons-github' }
      ]"
    >
      <template #headline>
        <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-default bg-default font-mono text-xs text-muted">
          <span class="size-1.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(16,185,129,.25)]" />
          Open source · Free npm package
        </span>
      </template>
      <template #title>
        Offline EU identifier<br><span class="text-grad">validation</span>
      </template>
      <template #description>
        <p class="text-lg text-muted max-w-xl mx-auto">
          Checksum-accurate VAT, IBAN, BSN and KvK validation that runs entirely on your machine.
          <strong class="text-default">No network calls, no dependencies.</strong>
        </p>
      </template>
    </UPageHero>

    <!-- Code snippet -->
    <UPageSection
      title="Three lines to a valid number"
      description="Import the check you need and call it. Synchronous, offline, done."
    >
      <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-5 text-sm font-mono text-green-400 overflow-x-auto max-w-2xl mx-auto shadow-lg">
        <pre>{{ codeExample }}</pre>
      </div>
    </UPageSection>

    <!-- Features -->
    <UPageSection
      title="Everything you need to validate EU data"
      description="Built for products that handle European business and personal identifiers."
      :features="features"
    />

    <!-- CTA -->
    <UPageSection>
      <UPageCTA
        title="Validate with confidence, offline"
        description="Install the package, import the checks you need, and stop trusting raw regexes."
        variant="subtle"
        :links="[
          { label: 'npm install @alosha/eu-validate', to: 'https://www.npmjs.com/package/@alosha/eu-validate', target: '_blank', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
          { label: 'View on GitHub', to: 'https://github.com/avlisodraude/eu-validate', target: '_blank', icon: 'i-simple-icons-github', color: 'neutral', variant: 'outline' }
        ]"
      />
    </UPageSection>
  </div>
</template>
