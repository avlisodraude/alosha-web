<script setup lang="ts">
const { auth } = useSupabaseClient()
const user = useSupabaseUser()
const { hubUrl } = useSite()

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
          <span class="text-primary">Pix</span>Squeeze
        </NuxtLink>
      </template>

      <template #right>
        <UNavigationMenu
          :items="[{ label: 'Pricing', to: '/#pricing' }, { label: 'Docs', to: '/docs' }]"
          class="hidden md:flex"
        />
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
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <div class="flex items-center gap-2 text-sm text-muted">
          <span>© {{ new Date().getFullYear() }} PixSqueeze</span>
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
          to="https://www.npmjs.com/package/pixsqueeze"
          target="_blank"
          icon="i-simple-icons-npm"
          color="neutral"
          variant="ghost"
          size="sm"
        />
        <UButton
          to="https://github.com/avlisodraude/pixsqueeze"
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
