<script setup lang="ts">
const { productUrl, monitorUrl, strideUrl, euValidateUrl } = useSite()

const nav = [
  { label: 'Products', to: '/products' },
  { label: 'Open Source', to: '/open-source' },
  { label: 'Demo', to: '/demo' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
]

// Quick launcher for every live product subdomain.
const productMenu = [[
  { label: 'PixSqueeze', icon: 'i-lucide-image', to: productUrl, target: '_blank' },
  { label: 'Monitor', icon: 'i-lucide-activity', to: monitorUrl, target: '_blank' },
  { label: 'Stride', icon: 'i-lucide-footprints', to: strideUrl, target: '_blank' },
  { label: 'eu-validate', icon: 'i-lucide-badge-check', to: euValidateUrl, target: '_blank' }
], [
  { label: 'All products', icon: 'i-lucide-layout-grid', to: '/products' }
]]
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="font-bold text-lg"
        >
          Alosha
        </NuxtLink>
      </template>

      <UNavigationMenu
        :items="nav"
        class="hidden md:flex"
      />

      <template #right>
        <UDropdownMenu
          :items="productMenu"
          :content="{ align: 'end' }"
        >
          <UButton
            size="sm"
            variant="subtle"
            trailing-icon="i-lucide-chevron-down"
          >
            Products
          </UButton>
        </UDropdownMenu>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} Alosha · Built in the open
        </p>
      </template>
      <template #right>
        <UButton
          to="https://github.com/avlisodraude"
          target="_blank"
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          size="sm"
        />
      </template>
    </UFooter>
  </UApp>
</template>
