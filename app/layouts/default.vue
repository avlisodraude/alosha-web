<script setup lang="ts">
const { auth } = useSupabaseClient()
const user = useSupabaseUser()
const { isMonitor, isStride, hubUrl } = useSite()

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
          <template v-if="isMonitor">
            <span class="text-primary">Monitor</span>
          </template>
          <template v-else-if="isStride">
            <span class="text-primary">Stride</span>
          </template>
          <template v-else>
            <span class="text-primary">Pix</span>Squeeze
          </template>
        </NuxtLink>
      </template>

      <template #right>
        <UNavigationMenu
          v-if="isMonitor"
          :items="[{ label: 'Docs', to: '/docs' }, { label: 'npm', to: 'https://www.npmjs.com/package/@alosha/monitor', target: '_blank' }]"
          class="hidden md:flex"
        />
        <UNavigationMenu
          v-else-if="isStride"
          :items="[{ label: 'Docs', to: '/docs' }, { label: 'npm', to: 'https://www.npmjs.com/package/@alosha/stride', target: '_blank' }]"
          class="hidden md:flex"
        />
        <UNavigationMenu
          v-else
          :items="[{ label: 'Pricing', to: '/#pricing' }, { label: 'Docs', to: '/docs' }]"
          class="hidden md:flex"
        />
        <template v-if="!isMonitor && !isStride">
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
          <span>© {{ new Date().getFullYear() }} {{ isMonitor ? 'Monitor' : isStride ? 'Stride' : 'PixSqueeze' }}</span>
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
          :to="isMonitor ? 'https://www.npmjs.com/package/@alosha/monitor' : isStride ? 'https://www.npmjs.com/package/@alosha/stride' : 'https://www.npmjs.com/package/pixsqueeze'"
          target="_blank"
          icon="i-simple-icons-npm"
          color="neutral"
          variant="ghost"
          size="sm"
        />
        <UButton
          :to="isMonitor ? 'https://github.com/avlisodraude/monitor' : isStride ? 'https://github.com/avlisodraude/stride' : 'https://github.com/avlisodraude/pixsqueeze'"
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
