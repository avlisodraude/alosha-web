<script setup lang="ts">
/**
 * Real-time package trust badges (shields.io), driven by the npm package name.
 * Reusable across every product landing — pass the scoped package name and,
 * optionally, the set of badges to show.
 *
 *   <ProductBadges pkg="@alosha/eu-validate" />
 */
import type { ProductBadgeKey as BadgeKey } from '~/utils/products'

const props = withDefaults(
  defineProps<{
    pkg: string
    badges?: BadgeKey[]
  }>(),
  {
    badges: () => ['version', 'minzip', 'types', 'downloads', 'license']
  }
)

// shields.io needs the scope `@` and slash `/` percent-encoded.
const enc = computed(() => props.pkg.replace('@', '%40').replace('/', '%2F'))

const style = 'flat-square'
const color = '00C16A' // matches the brand green (--color-green-500)

const src = computed<Record<BadgeKey, string>>(() => ({
  version: `https://img.shields.io/npm/v/${enc.value}?style=${style}&color=${color}&label=npm`,
  downloads: `https://img.shields.io/npm/dm/${enc.value}?style=${style}&color=${color}&label=downloads`,
  minzip: `https://img.shields.io/bundlephobia/minzip/${enc.value}?style=${style}&color=${color}&label=min%2Bgzip`,
  types: `https://img.shields.io/badge/types-included-${color}?style=${style}&logo=typescript&logoColor=white`,
  license: `https://img.shields.io/npm/l/${enc.value}?style=${style}&color=${color}`
}))

const alt: Record<BadgeKey, string> = {
  version: 'Latest npm version',
  downloads: 'Monthly npm downloads',
  minzip: 'Minified + gzipped bundle size',
  types: 'TypeScript types included',
  license: 'License'
}
</script>

<template>
  <div class="flex flex-wrap justify-center items-center gap-2">
    <img
      v-for="key in props.badges"
      :key="key"
      :src="src[key]"
      :alt="alt[key]"
      class="h-5"
      loading="lazy"
      decoding="async"
    >
  </div>
</template>
