<script setup lang="ts">
// '/' is shared between the two sites. The host decides which home renders;
// the global `site` middleware selects the matching layout (hub vs default).
definePageMeta({ layout: 'default' })

const { isHub } = useSite()
</script>

<template>
  <HubHome v-if="isHub" />
  <ProductLanding v-else />
</template>
