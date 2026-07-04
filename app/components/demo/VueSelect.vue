<script setup lang="ts">
/**
 * Live, in-browser vue-select demo — the real @alosha/vue-select component
 * imported and rendered here, not a screenshot or mockup. Four scenarios
 * exercise the actual v4 API: single-select with search, multi-select with
 * tagging, grouped options (new in v4), and virtual scrolling over a large
 * option list.
 */
import vSelect from '@alosha/vue-select'
import '@alosha/vue-select/dist/vue-select.css'

const copied = ref(false)
async function copyInstall() {
  try {
    await navigator.clipboard.writeText('npm install @alosha/vue-select')
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch { /* clipboard unavailable */ }
}

// 1. Basic single select with search — frontend frameworks & meta-frameworks.
const frameworks = [
  'Vue', 'React', 'Angular', 'Svelte', 'SolidJS', 'Qwik', 'Preact', 'Alpine.js',
  'Ember', 'Lit', 'Astro', 'Next.js', 'Nuxt', 'Remix', 'SvelteKit', 'Gatsby', 'Analog', 'Vike'
]
const framework = ref<string | null>(null)

// 2. Multi-select with tagging — GitHub-style issue labels, plus a custom
// deselect slot (swap the "x" icon on each tag).
const labelOptions = ref([
  'bug', 'enhancement', 'documentation', 'good first issue', 'help wanted',
  'question', 'wontfix', 'duplicate', 'invalid', 'dependencies', 'security'
])
const labels = ref<string[]>(['bug', 'help wanted'])

// 3. Grouped options (new in v4) — deploy regions grouped by cloud provider.
interface RegionOption { label: string, value: string }
const regionGroups: { label: string, options: RegionOption[] }[] = [
  {
    label: 'AWS',
    options: [
      { label: 'US East (N. Virginia) — us-east-1', value: 'aws:us-east-1' },
      { label: 'US West (Oregon) — us-west-2', value: 'aws:us-west-2' },
      { label: 'EU (Ireland) — eu-west-1', value: 'aws:eu-west-1' },
      { label: 'Asia Pacific (Singapore) — ap-southeast-1', value: 'aws:ap-southeast-1' }
    ]
  },
  {
    label: 'Google Cloud',
    options: [
      { label: 'us-central1 (Iowa)', value: 'gcp:us-central1' },
      { label: 'europe-west1 (Belgium)', value: 'gcp:europe-west1' },
      { label: 'asia-northeast1 (Tokyo)', value: 'gcp:asia-northeast1' }
    ]
  },
  {
    label: 'Azure',
    options: [
      { label: 'East US — eastus', value: 'azure:eastus' },
      { label: 'West Europe — westeurope', value: 'azure:westeurope' },
      { label: 'Southeast Asia — southeastasia', value: 'azure:southeastasia' }
    ]
  }
]
const region = ref<RegionOption | null>(null)

// 4. Virtual scroll — quick-open across a large synthetic file tree, in the
// spirit of an editor's "go to file". Only rows inside the viewport render.
const folders = ['src/components', 'src/pages', 'src/composables', 'src/utils', 'src/server/api', 'tests/unit', 'tests/e2e', 'docs/guide']
const bases = [
  'Button', 'Modal', 'Header', 'Footer', 'UserCard', 'SettingsPanel', 'Dashboard',
  'index', 'helpers', 'formatDate', 'useAuth', 'apiClient', 'validators', 'router'
]
const exts = ['.vue', '.ts', '.md']
const FILE_COUNT = 6000
const files = Array.from({ length: FILE_COUNT }, (_, i) => {
  const folder = folders[i % folders.length]
  const base = bases[Math.floor(i / folders.length) % bases.length]
  const ext = exts[i % exts.length]
  const suffix = Math.floor(i / (folders.length * bases.length))
  return suffix ? `${folder}/${base}-${suffix}${ext}` : `${folder}/${base}${ext}`
})
const file = ref<string | null>(null)
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-10 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">
        Try <span class="text-primary">vue-select</span>
      </h1>
      <p class="text-muted mt-2 max-w-xl mx-auto">
        Four real, interactive examples of the actual v4 component — search, tagging,
        grouped options and virtual scrolling. Everything below is live, not a mockup.
      </p>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        <button
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors"
          @click="copyInstall"
        >
          <span class="text-muted">$</span> npm install @alosha/vue-select
          <UIcon
            :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            class="ml-1 size-3.5 align-text-bottom"
            :class="copied ? 'text-primary' : 'text-muted'"
          />
        </button>
        <ULink
          to="https://www.npmjs.com/package/@alosha/vue-select"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-npm" />
          npm
        </ULink>
        <ULink
          to="https://github.com/avlisodraude/vue-select"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-github" />
          GitHub
        </ULink>
      </div>
    </div>

    <!-- 1. Single select with search -->
    <div class="vselect-demo rounded-xl border border-default p-5 sm:p-6 space-y-3">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-search"
          class="text-primary size-4"
        />
        <h2 class="font-semibold">
          Single select with search
        </h2>
      </div>
      <p class="text-sm text-muted">
        Type to filter the list — try "sve" or "next".
      </p>
      <v-select
        v-model="framework"
        :options="frameworks"
        placeholder="Search frameworks…"
      />
      <p class="text-sm text-muted">
        Selected: <span class="font-mono text-default">{{ framework ?? '—' }}</span>
      </p>
    </div>

    <!-- 2. Multi-select with tagging + custom deselect slot -->
    <div class="vselect-demo rounded-xl border border-default p-5 sm:p-6 space-y-3">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-tags"
          class="text-primary size-4"
        />
        <h2 class="font-semibold">
          Multi-select with tagging
        </h2>
      </div>
      <p class="text-sm text-muted">
        Pick existing labels, or type a new one and press Enter to create it.
      </p>
      <v-select
        v-model="labels"
        multiple
        taggable
        push-tags
        :close-on-select="false"
        :options="labelOptions"
        placeholder="Add labels…"
      >
        <template #deselect>
          <span
            aria-hidden="true"
            class="inline-flex"
          >
            <UIcon
              name="i-lucide-x"
              class="size-3"
            />
          </span>
        </template>
      </v-select>
      <p class="text-sm text-muted">
        Selected: <span class="font-mono text-default">{{ labels.length ? labels.join(', ') : '—' }}</span>
      </p>
    </div>

    <!-- 3. Grouped options -->
    <div class="vselect-demo rounded-xl border border-default p-5 sm:p-6 space-y-3">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-layers"
          class="text-primary size-4"
        />
        <h2 class="font-semibold">
          Grouped options
        </h2>
        <UBadge
          color="primary"
          variant="subtle"
          size="sm"
        >
          new in v4
        </UBadge>
      </div>
      <p class="text-sm text-muted">
        Deploy regions grouped by cloud provider — group headers aren't selectable, and search filters within each group.
      </p>
      <v-select
        v-model="region"
        :options="regionGroups"
        label="label"
        placeholder="Choose a deploy region…"
      />
      <p class="text-sm text-muted">
        Selected: <span class="font-mono text-default">{{ region?.value ?? '—' }}</span>
      </p>
    </div>

    <!-- 4. Virtual scroll -->
    <div class="vselect-demo rounded-xl border border-default p-5 sm:p-6 space-y-3">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-gauge"
          class="text-primary size-4"
        />
        <h2 class="font-semibold">
          Virtual scroll over {{ FILE_COUNT.toLocaleString() }} options
        </h2>
        <UBadge
          color="neutral"
          variant="subtle"
          size="sm"
        >
          experimental
        </UBadge>
      </div>
      <p class="text-sm text-muted">
        A "go to file" style quick-open across a large synthetic file tree — only the rows inside the viewport are ever rendered.
      </p>
      <v-select
        v-model="file"
        :options="files"
        virtual-scroll
        :virtual-scroll-row-height="34"
        placeholder="Jump to file…"
      />
      <p class="text-sm text-muted">
        Selected: <span class="font-mono text-default break-all">{{ file ?? '—' }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Retheme the shipped vue-select CSS (light-mode by default) to the site's
   own design tokens via its real --vs-* custom properties, so it matches
   both the light and dark theme automatically. */
.vselect-demo {
  --vs-dropdown-bg: var(--ui-bg-elevated);
  --vs-dropdown-color: var(--ui-text);
  --vs-dropdown-option-color: var(--ui-text);
  --vs-dropdown-option--active-bg: var(--ui-primary);
  --vs-dropdown-option--active-color: #fff;
  --vs-border-color: var(--ui-border);
  --vs-selected-bg: var(--ui-bg-muted);
  --vs-selected-color: var(--ui-text);
  --vs-controls-color: var(--ui-text-muted);
  --vs-search-input-color: var(--ui-text);
  --vs-search-input-placeholder-color: var(--ui-text-dimmed);
  --vs-state-disabled-bg: var(--ui-bg-muted);
}

.vselect-demo :deep(.vs__dropdown-toggle) {
  background: var(--ui-bg);
}

.vselect-demo :deep(.vs__dropdown-option--group) {
  color: var(--ui-text-dimmed);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
</style>
