<script setup lang="ts">
definePageMeta({ layout: 'default' })

// /generator is an eu-validate utility. On the eu-validate subdomain it renders
// the mock-data generator; on any other site it points visitors to the canonical
// tool and is excluded from indexing to avoid duplicate, off-topic routes.
const { isEuValidate, euValidateUrl } = useSite()

const generatorUrl = `${euValidateUrl}/generator`

useSeoMeta({
  title: 'eu-validate — EU mock-data generator (VAT · IBAN · BSN · KvK)',
  description: 'Generate valid and invalid EU test identifiers — VAT numbers, IBANs, Dutch BSN and KvK — for your integration and unit tests. Checksum-accurate VAT, IBAN & BSN, in your browser, free.',
  ogTitle: 'eu-validate — EU mock-data generator',
  ogDescription: 'Generate valid and invalid VAT, IBAN, BSN and KvK test data for your test suites — checksum-accurate where a checksum exists, entirely in the browser.',
  ogUrl: generatorUrl,
  robots: isEuValidate ? 'index,follow' : 'noindex,follow'
})
</script>

<template>
  <DemoEuValidateGenerator v-if="isEuValidate" />
  <div
    v-else
    class="max-w-xl mx-auto px-4 py-20 text-center space-y-5"
  >
    <UIcon
      name="i-lucide-wand-sparkles"
      class="size-10 text-primary mx-auto"
    />
    <h1 class="text-2xl font-bold tracking-tight">
      EU mock-data generator
    </h1>
    <p class="text-muted">
      The generator for valid and invalid VAT, IBAN, BSN and KvK test data lives on the
      eu-validate site.
    </p>
    <UButton
      :to="generatorUrl"
      trailing-icon="i-lucide-arrow-right"
      class="btn-grad"
    >
      Open the generator
    </UButton>
  </div>
</template>
