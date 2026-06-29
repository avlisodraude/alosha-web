<script setup lang="ts">
const { products } = useSite()

useCanonical()

// Let feed readers and crawlers discover the blog RSS feed from any hub page.
useHead({
  link: [{
    rel: 'alternate',
    type: 'application/rss+xml',
    title: 'Alosha — Blog',
    href: 'https://alosha.dev/rss.xml'
  }]
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Alosha',
  'url': 'https://alosha.dev',
  'description': 'A software studio building privacy-first developer tools on open-source foundations.',
  'logo': 'https://alosha.dev/og.png',
  'sameAs': ['https://github.com/avlisodraude']
})
useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Alosha',
  'url': 'https://alosha.dev',
  'description': 'A software studio building privacy-first developer tools on open-source foundations.',
  'inLanguage': 'en',
  'publisher': { '@type': 'Organization', 'name': 'Alosha', 'url': 'https://alosha.dev' }
})

const nav = [
  { label: 'Products', to: '/products' },
  { label: 'Open Source', to: '/open-source' },
  { label: 'Demo', to: '/demo' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Support', to: '/support' },
  { label: 'Contact', to: '/contact' }
]

// Quick launcher for every live product subdomain — built from the registry.
const productMenu = [
  products.map(p => ({ label: p.name, icon: p.icon, to: p.url, target: '_blank' })),
  [{ label: 'All products', icon: 'i-lucide-layout-grid', to: '/products' }]
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
        class="hidden lg:flex"
      />

      <template #right>
        <UDropdownMenu
          :items="productMenu"
          :content="{ align: 'end' }"
          class="hidden lg:block"
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

      <!-- Mobile menu (opens from the hamburger toggle below lg) -->
      <template #body>
        <UNavigationMenu
          :items="nav"
          orientation="vertical"
          class="-mx-2.5"
        />

        <USeparator class="my-4" />

        <p class="px-2.5 text-xs font-semibold text-muted uppercase tracking-wide mb-1">
          Products
        </p>
        <UNavigationMenu
          :items="productMenu"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span>© {{ new Date().getFullYear() }} Alosha · Built in the open</span>
          <span aria-hidden="true">·</span>
          <ULink
            to="/privacy"
            class="hover:text-default"
          >
            Privacy
          </ULink>
          <ULink
            to="/terms"
            class="hover:text-default"
          >
            Terms
          </ULink>
        </div>
      </template>
      <template #right>
        <UButton
          to="/rss.xml"
          external
          target="_blank"
          icon="i-lucide-rss"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Subscribe to the blog RSS feed"
        />
        <UButton
          to="https://github.com/avlisodraude"
          target="_blank"
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Alosha on GitHub"
        />
      </template>
    </UFooter>
  </UApp>
</template>
