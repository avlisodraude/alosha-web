<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const user = useSupabaseUser()
const client = useSupabaseClient()
const API = PIXSQUEEZE_API

const apiKey = ref<string | null>(null)
const revealed = ref(false)
const copied = ref(false)
const error = ref('')
const regenerating = ref(false)
const showRegenerateConfirm = ref(false)

onMounted(() => {
  apiKey.value = user.value?.user_metadata?.pixsqueeze_api_key ?? null
})

const displayKey = computed(() => {
  if (!apiKey.value) return ''
  if (revealed.value) return apiKey.value
  return apiKey.value.slice(0, 6) + '••••••••••••••••••••••••••••'
})

async function copyKey() {
  if (!apiKey.value) return
  await navigator.clipboard.writeText(apiKey.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

async function regenerateKey() {
  if (!user.value?.email) return
  regenerating.value = true
  error.value = ''
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.value.email })
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = await res.json()
    const key = data.apiKey
    if (!key) throw new Error('No key returned')

    await client.auth.updateUser({ data: { pixsqueeze_api_key: key } })
    apiKey.value = key
    revealed.value = true
    showRegenerateConfirm.value = false
  } catch (e) {
    error.value = `Could not regenerate key: ${e instanceof Error ? e.message : e}`
  } finally {
    regenerating.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold">
        API Key
      </h1>
      <p class="text-muted text-sm mt-1">
        Use this key to authenticate your API requests.
      </p>
    </div>

    <UAlert
      v-if="error"
      color="error"
      :description="error"
    />

    <!-- Key display -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">Your API key</span>
          <UBadge
            color="success"
            variant="subtle"
            size="sm"
          >
            Active
          </UBadge>
        </div>
      </template>

      <div
        v-if="apiKey"
        class="space-y-3"
      >
        <div class="flex items-center gap-2">
          <UInput
            :model-value="displayKey"
            readonly
            class="flex-1 font-mono text-sm"
          />
          <UTooltip :text="revealed ? 'Hide' : 'Reveal'">
            <UButton
              :icon="revealed ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="revealed = !revealed"
            />
          </UTooltip>
          <UTooltip :text="copied ? 'Copied!' : 'Copy'">
            <UButton
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              :color="copied ? 'success' : 'neutral'"
              variant="ghost"
              size="sm"
              @click="copyKey"
            />
          </UTooltip>
        </div>
      </div>
      <div
        v-else
        class="text-sm text-muted"
      >
        No API key found. Go to the Overview page to provision one.
      </div>

      <template #footer>
        <p class="text-xs text-muted">
          Pass this key in the <code class="font-mono bg-muted/20 px-1 rounded">Authorization</code> header:
          <code class="font-mono bg-muted/20 px-1 rounded">Authorization: Bearer &lt;key&gt;</code>
        </p>
      </template>
    </UCard>

    <!-- Usage example -->
    <UCard>
      <template #header>
        <span class="font-semibold">Example request</span>
      </template>
      <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto">
        <pre>curl -X POST {{ API }}/compress/batch \
  -H "Authorization: Bearer {{ revealed && apiKey ? apiKey : 'psx_your_key_here' }}" \
  -F "files[]=@photo1.jpg" \
  -F "files[]=@photo2.heic" \
  -F "quality=0.7" \
  -F "maxWidth=1280"</pre>
      </div>
      <p class="text-xs text-muted mt-2">
        Full reference in the <NuxtLink
          to="/docs"
          class="text-primary hover:underline"
        >API docs</NuxtLink>.
      </p>
    </UCard>

    <!-- Security notice -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-shield-alert"
            class="text-warning"
          />
          <span class="font-semibold">Security</span>
        </div>
      </template>
      <ul class="space-y-2 text-sm text-muted">
        <li class="flex items-start gap-2">
          <UIcon
            name="i-lucide-x-circle"
            class="text-error mt-0.5 shrink-0"
          />
          Never expose your API key in client-side code, browser extensions, or public repositories.
        </li>
        <li class="flex items-start gap-2">
          <UIcon
            name="i-lucide-check-circle"
            class="text-success mt-0.5 shrink-0"
          />
          Always make API calls from a server-side environment (Node, Python, etc.).
        </li>
        <li class="flex items-start gap-2">
          <UIcon
            name="i-lucide-check-circle"
            class="text-success mt-0.5 shrink-0"
          />
          Store the key in environment variables, never hardcoded.
        </li>
      </ul>

      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-xs text-muted">
            If your key is compromised, regenerate it immediately.
          </p>
          <UButton
            size="sm"
            color="error"
            variant="soft"
            icon="i-lucide-refresh-cw"
            @click="showRegenerateConfirm = true"
          >
            Regenerate key
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- Regenerate confirm modal -->
    <UModal v-model:open="showRegenerateConfirm">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold text-lg">
              Regenerate API key?
            </h3>
          </template>
          <p class="text-sm text-muted">
            Your current key will be invalidated immediately. Any app using it will stop working until you update it with the new key.
          </p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                variant="ghost"
                @click="showRegenerateConfirm = false"
              >
                Cancel
              </UButton>
              <UButton
                color="error"
                :loading="regenerating"
                @click="regenerateKey"
              >
                Yes, regenerate
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
