<script setup lang="ts">
const { auth } = useSupabaseClient()
const user = useSupabaseUser()

async function handleSignOut() {
  await auth.signOut()
  await navigateTo('/')
}

const navLinks = [
  { label: 'Overview', icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
  { label: 'API Key', icon: 'i-lucide-key', to: '/dashboard/api-key' },
  { label: 'Usage', icon: 'i-lucide-bar-chart-2', to: '/dashboard/usage' },
  { label: 'Billing', icon: 'i-lucide-credit-card', to: '/dashboard/billing' }
]
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col">
      <!-- Top bar -->
      <header class="border-b border-default h-14 flex items-center px-6 gap-4 shrink-0">
        <NuxtLink to="/" class="font-bold text-lg">
          <span class="text-primary">Pix</span>Squeeze
        </NuxtLink>
        <span class="text-muted text-sm">/</span>
        <span class="text-sm font-medium">Dashboard</span>
        <div class="ml-auto flex items-center gap-3">
          <UColorModeButton size="sm" />
          <UDropdownMenu
            :items="[[
              { label: user?.email ?? 'Account', type: 'label' },
              { type: 'separator' },
              { label: 'Sign out', icon: 'i-lucide-log-out', onSelect: handleSignOut }
            ]]"
          >
            <UAvatar :alt="user?.email ?? 'U'" size="sm" />
          </UDropdownMenu>
        </div>
      </header>

      <div class="flex flex-1">
        <!-- Sidebar -->
        <aside class="w-56 border-r border-default p-4 hidden md:block shrink-0">
          <UNavigationMenu
            orientation="vertical"
            :items="navLinks"
            class="w-full"
          />
        </aside>

        <!-- Content -->
        <main class="flex-1 p-6 overflow-auto">
          <slot />
        </main>
      </div>
    </div>
  </UApp>
</template>
