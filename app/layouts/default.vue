<script setup lang="ts">
const { auth } = useSupabaseClient()
const user = useSupabaseUser()
const { product, hubUrl } = useSite()

useCanonical()

// Package landings (Monitor, Stride, eu-validate, …) are open-source: no auth,
// no dashboard — just a brand, an npm link and a GitHub link. PixSqueeze is the
// one hosted-api product, so it keeps the auth nav. All metadata comes from the
// registry via the active `product`.
const isPackageSite = product?.kind === 'package'

const brand = product?.name ?? 'PixSqueeze'
const npmUrl = product?.npm ?? 'https://www.npmjs.com/package/@alosha/pixsqueeze'
const githubUrl = product?.repo ?? 'https://github.com/avlisodraude/pixsqueeze'

// Package sites (Monitor, Stride, eu-validate) have no docs page of their own —
// /docs is PixSqueeze-only — so they link to Demo · npm · GitHub instead.
const nav = computed(() =>
  isPackageSite
    ? [
        { label: 'Demo', to: '/demo' },
        { label: 'npm', to: npmUrl, target: '_blank' },
        { label: 'GitHub', to: githubUrl, target: '_blank' }
      ]
    : [
        { label: 'Pricing', to: '/#pricing' },
        { label: 'Docs', to: '/docs' }
      ]
)

async function handleSignOut() {
  await auth.signOut()
  await navigateTo('/')
}
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-bold text-lg"
        >
          <template v-if="isPackageSite">
            <span class="text-primary">{{ brand }}</span>
          </template>
          <template v-else>
            <span class="text-primary">Pix</span>Squeeze
          </template>
        </NuxtLink>
      </template>

      <template #right>
        <UNavigationMenu
          :items="nav"
          class="hidden lg:flex"
        />
        <div
          v-if="!isPackageSite"
          class="hidden lg:flex items-center gap-1.5"
        >
          <template v-if="user">
            <UButton
              to="/dashboard"
              size="sm"
              variant="subtle"
            >
              Dashboard
            </UButton>
            <UButton
              size="sm"
              variant="ghost"
              @click="handleSignOut"
            >
              Sign out
            </UButton>
          </template>
          <template v-else>
            <UButton
              to="/login"
              size="sm"
              variant="ghost"
            >
              Sign in
            </UButton>
            <UButton
              to="/login?signup=1"
              size="sm"
            >
              Get started
            </UButton>
          </template>
        </div>
        <UColorModeButton />
      </template>

      <!-- Mobile menu (opens from the hamburger toggle below lg) -->
      <template #body>
        <UNavigationMenu
          :items="nav"
          orientation="vertical"
          class="-mx-2.5"
        />
        <template v-if="!isPackageSite">
          <USeparator class="my-4" />
          <div class="flex flex-col gap-2">
            <template v-if="user">
              <UButton
                to="/dashboard"
                variant="subtle"
                block
              >
                Dashboard
              </UButton>
              <UButton
                variant="ghost"
                block
                @click="handleSignOut"
              >
                Sign out
              </UButton>
            </template>
            <template v-else>
              <UButton
                to="/login?signup=1"
                block
              >
                Get started
              </UButton>
              <UButton
                to="/login"
                variant="ghost"
                block
              >
                Sign in
              </UButton>
            </template>
          </div>
        </template>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <div class="flex items-center gap-2 text-sm text-muted">
          <span>© {{ new Date().getFullYear() }} {{ brand }}</span>
          <span aria-hidden="true">·</span>
          <UButton
            :to="hubUrl"
            variant="link"
            color="neutral"
            size="sm"
            class="px-0"
            trailing-icon="i-lucide-arrow-up-right"
          >
            Built by Alosha
          </UButton>
        </div>
      </template>
      <template #right>
        <UButton
          :to="npmUrl"
          target="_blank"
          icon="i-simple-icons-npm"
          color="neutral"
          variant="ghost"
          size="sm"
          :aria-label="`${brand} on npm`"
        />
        <UButton
          :to="githubUrl"
          target="_blank"
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          size="sm"
          :aria-label="`${brand} on GitHub`"
        />
      </template>
    </UFooter>
  </UApp>
</template>
