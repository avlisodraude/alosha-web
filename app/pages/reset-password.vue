<script setup lang="ts">
definePageMeta({ layout: 'default' })

const client = useSupabaseClient()
const user = useSupabaseUser()

const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')
const done = ref(false)

async function handleSubmit() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  loading.value = true
  try {
    const { error: err } = await client.auth.updateUser({ password: password.value })
    if (err) throw err
    done.value = true
    setTimeout(() => navigateTo('/dashboard'), 1500)
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
          Choose a new password
        </h1>
        <p class="text-sm text-muted mt-1">
          {{ user ? `Signed in as ${user.email}` : 'Follow the link from your reset email to land here.' }}
        </p>
      </template>

      <div
        v-if="done"
        class="text-center py-4"
      >
        <UIcon
          name="i-lucide-check-circle"
          class="text-3xl text-success mx-auto mb-2"
        />
        <p class="text-sm text-muted">
          Password updated. Redirecting…
        </p>
      </div>

      <UForm
        v-else
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <UFormField label="New password">
          <UInput
            v-model="password"
            type="password"
            autocomplete="new-password"
            placeholder="••••••••"
            required
            class="w-full"
          />
        </UFormField>
        <UFormField label="Confirm new password">
          <UInput
            v-model="confirm"
            type="password"
            autocomplete="new-password"
            placeholder="••••••••"
            required
            class="w-full"
          />
        </UFormField>
        <UAlert
          v-if="error"
          color="error"
          :description="error"
        />
        <UAlert
          v-if="!user"
          color="warning"
          description="No active session. Open this page via the link in your password-reset email."
        />
        <UButton
          type="submit"
          :loading="loading"
          :disabled="!user"
          class="w-full"
          block
        >
          Update password
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
