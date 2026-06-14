<script setup lang="ts">
// '/' is shared between all sites. The host decides which home renders;
// the global `site` middleware selects the matching layout (hub vs default).
definePageMeta({ layout: 'default' })

const { isHub, isMonitor, isStride } = useSite()
</script>

<template>
  <HubHome v-if="isHub" />
  <ProductMonitorLanding v-else-if="isMonitor" />
  <ProductStrideLanding v-else-if="isStride" />
  <ProductLanding v-else />
</template>
