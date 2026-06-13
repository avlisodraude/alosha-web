<script setup lang="ts">
const { productUrl } = useSite()

const nav = [
  { label: 'Products', to: '/products' },
  { label: 'Open Source', to: '/open-source' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
]
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
        <UButton
          :to="productUrl"
          target="_blank"
          size="sm"
          variant="subtle"
          trailing-icon="i-lucide-arrow-up-right"
        >
          PixSqueeze
        </UButton>
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
