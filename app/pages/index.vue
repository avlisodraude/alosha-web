<script setup lang="ts">
// '/' is shared between all sites. The host decides which home renders;
// the global `site` middleware selects the matching layout (hub vs default).
definePageMeta({ layout: 'default' })

const { isHub, isProduct, product } = useSite()

// Package products (Monitor, Stride, eu-validate, …) render the generic,
// data-driven landing from their registry slug. PixSqueeze (hosted API) keeps
// its bespoke landing with pricing.
const landing = computed(() => (product ? getLanding(product.slug) : null))
</script>

<template>
  <HubHome v-if="isHub" />
  <ProductLanding v-else-if="isProduct" />
  <ProductPageLanding
    v-else-if="product && landing"
    :config="landing"
    :product="product"
  />
  <ProductLanding v-else />
</template>
