<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const client = useSupabaseClient()

type Mode = 'signin' | 'signup' | 'forgot'
const mode = ref<Mode>(route.query.signup === '1' ? 'signup' : 'signin')
const isSignUp = computed(() => mode.value === 'signup')

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

const heading = computed(() => ({
  signin: 'Sign in to PixSqueeze',
  signup: 'Create your account',
  forgot: 'Reset your password'
})[mode.value])

const subheading = computed(() => ({
  signin: 'Welcome back.',
  signup: 'Start compressing images at scale.',
  forgot: 'We\'ll email you a reset link.'
})[mode.value])

function switchMode(m: Mode) {
  mode.value = m
  error.value = ''
  successMsg.value = ''
}

async function handleSubmit() {
  error.value = ''
  successMsg.value = ''
  loading.value = true

  try {
    if (mode.value === 'signup') {
      const { error: err } = await client.auth.signUp({ email: email.value, password: password.value })
      if (err) throw err
      successMsg.value = 'Check your email to confirm your account.'
    } else if (mode.value === 'forgot') {
      const { error: err } = await client.auth.resetPasswordForEmail(email.value, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (err) throw err
      successMsg.value = 'If an account exists for that email, a reset link is on its way.'
    } else {
      const { error: err } = await client.auth.signInWithPassword({ email: email.value, password: password.value })
      if (err) throw err
      await navigateTo('/dashboard')
    }
  } catch (e) {
    error.value = (e instanceof Error ? e.message : null) ?? 'Something went wrong.'
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
          {{ heading }}
        </h1>
        <p class="text-sm text-muted mt-1">
          {{ subheading }}
        </p>
      </template>

      <UForm
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <UFormField label="Email">
          <UInput
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-if="mode !== 'forgot'"
          label="Password"
        >
          <UInput
            v-model="password"
            type="password"
            :autocomplete="isSignUp ? 'new-password' : 'current-password'"
            placeholder="••••••••"
            required
            class="w-full"
          />
        </UFormField>
        <div
          v-if="mode === 'signin'"
          class="text-right -mt-2"
        >
          <button
            type="button"
            class="text-xs text-muted hover:text-primary hover:underline"
            @click="switchMode('forgot')"
          >
            Forgot password?
          </button>
        </div>
        <UAlert
          v-if="error"
          color="error"
          :description="error"
        />
        <UAlert
          v-if="successMsg"
          color="success"
          :description="successMsg"
        />
        <UButton
          type="submit"
          :loading="loading"
          class="w-full"
          block
        >
          {{ { signin: 'Sign in', signup: 'Create account', forgot: 'Send reset link' }[mode] }}
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-sm text-center text-muted">
          <template v-if="mode === 'signup'">
            Already have an account?
            <button
              type="button"
              class="text-primary hover:underline"
              @click="switchMode('signin')"
            >
              Sign in
            </button>
          </template>
          <template v-else-if="mode === 'forgot'">
            Remembered it?
            <button
              type="button"
              class="text-primary hover:underline"
              @click="switchMode('signin')"
            >
              Back to sign in
            </button>
          </template>
          <template v-else>
            No account yet?
            <button
              type="button"
              class="text-primary hover:underline"
              @click="switchMode('signup')"
            >
              Get started free
            </button>
          </template>
        </p>
      </template>
    </UCard>
  </div>
</template>
