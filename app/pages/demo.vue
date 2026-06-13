<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'PixSqueeze — Live demo',
  description: 'Compress an image right in your browser. No upload, no signup. Powered by the open-source PixSqueeze library.',
  ogTitle: 'PixSqueeze — Live demo',
  ogDescription: 'Compress an image right in your browser. No upload, no signup.',
  ogUrl: 'https://pixsqueeze.alosha.dev/demo'
})

interface PixSqueezeResult extends Blob { name?: string }
interface PixSqueezeOptions {
  quality?: number
  mimeType?: string
  maxWidth?: number
  success?: (result: PixSqueezeResult) => void
  error?: (err: Error) => void
}
interface PixSqueezeCtor { new (file: File, options: PixSqueezeOptions): unknown }

const quality = ref(0.6)
const format = ref('auto')
const dragging = ref(false)
const loading = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

type ImageInfo = { name: string, size: number, url: string }
const sourceFile = ref<File | null>(null)
const original = ref<ImageInfo | null>(null)
const compressed = ref<ImageInfo | null>(null)
const job = ref<unknown>(null)

const savings = computed(() => {
  if (!original.value || !compressed.value || original.value.size === 0) return null
  return Math.max(0, (1 - compressed.value.size / original.value.size) * 100)
})

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// Load the standalone browser bundle on demand (client only).
function loadPixSqueeze(): Promise<PixSqueezeCtor> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { PixSqueeze?: PixSqueezeCtor }
    if (w.PixSqueeze) return resolve(w.PixSqueeze)
    const s = document.createElement('script')
    s.src = '/lib/pixsqueeze.js'
    s.onload = () => (w.PixSqueeze ? resolve(w.PixSqueeze) : reject(new Error('PixSqueeze failed to initialise')))
    s.onerror = () => reject(new Error('Could not load the PixSqueeze library'))
    document.head.appendChild(s)
  })
}

// Re-runs compression on the current source file with the current settings.
async function runCompression() {
  const file = sourceFile.value
  if (!file) return
  error.value = ''
  loading.value = true
  try {
    const PixSqueeze = await loadPixSqueeze()
    job.value = new PixSqueeze(file, {
      quality: quality.value,
      mimeType: format.value,
      maxWidth: 4096,
      success: (result: PixSqueezeResult) => {
        if (compressed.value) URL.revokeObjectURL(compressed.value.url)
        compressed.value = {
          name: result.name ?? file.name,
          size: result.size,
          url: URL.createObjectURL(result)
        }
        loading.value = false
      },
      error: (err: Error) => {
        error.value = err.message
        loading.value = false
      }
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    loading.value = false
  }
}

function loadFile(file: File) {
  sourceFile.value = file
  if (original.value) URL.revokeObjectURL(original.value.url)
  original.value = { name: file.name, size: file.size, url: URL.createObjectURL(file) }
  compressed.value = null
  runCompression()
}

// Re-compress when the user changes quality or format (debounced for slider drags).
let debounce: ReturnType<typeof setTimeout> | undefined
watch([quality, format], () => {
  if (!sourceFile.value) return
  clearTimeout(debounce)
  debounce = setTimeout(runCompression, 200)
})

function pickFirstImage(files?: FileList | null): File | undefined {
  if (!files) return undefined
  return Array.from(files).find(f => f.type.startsWith('image/'))
}

function onInput(e: Event) {
  const file = pickFirstImage((e.target as HTMLInputElement).files)
  if (file) loadFile(file)
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const file = pickFirstImage(e.dataTransfer?.files)
  if (file) loadFile(file)
}

function reset() {
  sourceFile.value = null
  original.value = null
  compressed.value = null
  error.value = ''
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">
        Try <span class="text-primary">PixSqueeze</span>
      </h1>
      <p class="text-muted mt-2">
        Compress an image right in your browser. No upload, no signup — it never leaves your device.
      </p>
    </div>

    <!-- Drop zone -->
    <div
      class="rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors"
      :class="dragging ? 'border-primary bg-primary/5' : 'border-default hover:border-primary/50'"
      @click="fileInput?.click()"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onInput"
      >
      <UIcon
        name="i-lucide-image-up"
        class="size-8 mx-auto text-muted"
      />
      <p class="mt-3 font-medium">
        Drop an image here, or click to browse
      </p>
      <p class="text-xs text-muted mt-1">
        JPEG · PNG · WebP — compressed locally with the open-source library
      </p>
    </div>

    <!-- Controls -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
      <div>
        <label class="text-sm font-medium flex justify-between">
          <span>Quality</span>
          <span class="text-muted">{{ quality.toFixed(2) }}</span>
        </label>
        <input
          v-model.number="quality"
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          class="w-full mt-2 accent-primary"
        >
      </div>
      <div>
        <label class="text-sm font-medium">Output format</label>
        <select
          v-model="format"
          class="w-full mt-2 rounded-md border border-default bg-default px-3 py-2 text-sm"
        >
          <option value="auto">
            Auto (keep original)
          </option>
          <option value="image/jpeg">
            JPEG
          </option>
          <option value="image/png">
            PNG
          </option>
          <option value="image/webp">
            WebP
          </option>
        </select>
      </div>
    </div>

    <UAlert
      v-if="error"
      color="error"
      icon="i-lucide-triangle-alert"
      :description="error"
    />

    <!-- Results -->
    <div
      v-if="original"
      class="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold text-sm">Original</span>
            <span class="text-sm text-muted">{{ formatBytes(original.size) }}</span>
          </div>
        </template>
        <img
          :src="original.url"
          alt="Original"
          class="w-full rounded-md"
        >
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold text-sm">Compressed</span>
            <UBadge
              v-if="savings != null"
              color="primary"
              variant="subtle"
              size="sm"
            >
              −{{ savings.toFixed(1) }}%
            </UBadge>
          </div>
        </template>
        <div
          v-if="loading"
          class="flex items-center justify-center gap-2 text-sm text-muted py-16"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="animate-spin"
          />
          Compressing…
        </div>
        <template v-else-if="compressed">
          <img
            :src="compressed.url"
            alt="Compressed"
            class="w-full rounded-md"
          >
          <div class="flex items-center justify-between mt-3">
            <span class="text-sm text-muted">{{ formatBytes(compressed.size) }}</span>
            <UButton
              :to="compressed.url"
              :download="compressed.name"
              icon="i-lucide-download"
              size="sm"
            >
              Download
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <div
      v-if="original"
      class="text-center"
    >
      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        icon="i-lucide-rotate-ccw"
        @click="reset"
      >
        Try another image
      </UButton>
    </div>

    <!-- Paid CTA -->
    <UPageCTA
      title="Need HEIC, TIFF & RAW — or batch at scale?"
      description="This demo runs locally on JPEG/PNG/WebP. The hosted PixSqueeze API converts iPhone HEIC, TIFF and camera RAW and compresses up to 1,000 images per request. 100 free every month."
      variant="subtle"
      :links="[
        { label: 'See the hosted API', to: '/#pricing', trailingIcon: 'i-lucide-arrow-right', class: 'btn-grad' },
        { label: 'Read the docs', to: '/docs', color: 'neutral', variant: 'outline' }
      ]"
    />
  </div>
</template>
