<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const client = useSupabaseClient()
const isSignUp = computed(() => route.query.signup === '1')

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

async function handleSubmit() {
  error.value = ''
  successMsg.value = ''
  loading.value = true

  try {
    if (isSignUp.value) {
      const { error: err } = await client.auth.signUp({ email: email.value, password: password.value })
      if (err) throw err
      successMsg.value = 'Check your email to confirm your account.'
    } else {
      const { error: err } = await client.auth.signInWithPassword({ email: email.value, password: password.value })
      if (err) throw err
      await navigateTo('/dashboard')
    }
  } catch (e: any) {
    error.value = e.message ?? 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[70vh] px-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold">
          {{ isSignUp ? 'Create your account' : 'Sign in to PixSqueeze' }}
        </h1>
        <p class="text-sm text-muted mt-1">
          {{ isSignUp ? 'Start compressing images at scale.' : 'Welcome back.' }}
        </p>
      </template>

      <UForm class="space-y-4" @submit.prevent="handleSubmit">
        <UFormField label="Email">
          <UInput v-model="email" type="email" placeholder="you@example.com" required class="w-full" />
        </UFormField>
        <UFormField label="Password">
          <UInput v-model="password" type="password" placeholder="••••••••" required class="w-full" />
        </UFormField>
        <UAlert v-if="error" color="error" :description="error" />
        <UAlert v-if="successMsg" color="success" :description="successMsg" />
        <UButton type="submit" :loading="loading" class="w-full" block>
          {{ isSignUp ? 'Create account' : 'Sign in' }}
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-sm text-center text-muted">
          <template v-if="isSignUp">
            Already have an account?
            <NuxtLink to="/login" class="text-primary hover:underline">Sign in</NuxtLink>
          </template>
          <template v-else>
            No account yet?
            <NuxtLink to="/login?signup=1" class="text-primary hover:underline">Get started free</NuxtLink>
          </template>
        </p>
      </template>
    </UCard>
  </div>
</template>
