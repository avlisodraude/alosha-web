<script setup lang="ts">
// '/' is shared between all sites. The host decides which home renders;
// the global `site` middleware selects the matching layout (hub vs default).
definePageMeta({ layout: 'default' })

const { isHub, isMonitor } = useSite()
</script>

<template>
  <HubHome v-if="isHub" />
  <ProductMonitorLanding v-else-if="isMonitor" />
  <ProductLanding v-else />
</template>
