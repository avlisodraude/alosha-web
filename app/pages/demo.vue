<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'PixSqueeze — Live demo',
  description: 'Compress an image right in your browser. No upload, no signup. Powered by the open-source PixSqueeze library.',
  ogTitle: 'PixSqueeze — Live demo',
  ogDescription: 'Compress an image right in your browser. No upload, no signup.',
  ogUrl: 'https://pixsqueeze.alosha.dev/demo'
})

const { data: stats } = await useFetch('/api/oss-stats')

const copied = ref(false)
async function copyInstall() {
  try {
    await navigator.clipboard.writeText('npm i pixsqueeze')
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* clipboard unavailable */
  }
}

interface PixSqueezeResult extends Blob { name?: string }
interface PixSqueezeOptions {
  quality?: number
  mimeType?: string
  resize?: string
  strict?: boolean
  checkOrientation?: boolean
  retainExif?: boolean
  maxWidth?: number
  maxHeight?: number
  minWidth?: number
  minHeight?: number
  width?: number
  height?: number
  convertTypes?: string | string[]
  convertSize?: number
  success?: (result: PixSqueezeResult) => void
  error?: (err: Error) => void
}
interface PixSqueezeCtor { new (file: File, options: PixSqueezeOptions): unknown }

const quality = ref(0.6)
const showAdvanced = ref(false)
const dragging = ref(false)
const loading = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Advanced options. Numeric fields are kept as strings so "empty" can be
// distinguished from 0 — empty fields are omitted so PixSqueeze's defaults apply.
const adv = reactive({
  format: 'auto',
  resize: 'none',
  strict: true,
  checkOrientation: true,
  retainExif: false,
  maxWidth: '',
  maxHeight: '',
  minWidth: '',
  minHeight: '',
  width: '',
  height: '',
  convertPng: true,
  convertWebp: false,
  convertSize: ''
})

const numberFields = [
  { key: 'maxWidth', label: 'maxWidth (px)', ph: 'Infinity' },
  { key: 'maxHeight', label: 'maxHeight (px)', ph: 'Infinity' },
  { key: 'minWidth', label: 'minWidth (px)', ph: '0' },
  { key: 'minHeight', label: 'minHeight (px)', ph: '0' },
  { key: 'width', label: 'width (px)', ph: 'auto' },
  { key: 'height', label: 'height (px)', ph: 'auto' },
  { key: 'convertSize', label: 'convertSize (bytes)', ph: '5000000' }
] as const

type ImageInfo = { name: string, size: number, url: string }
const sourceFile = ref<File | null>(null)
const original = ref<ImageInfo | null>(null)
const compressed = ref<ImageInfo | null>(null)
const originalDims = ref('')
const compressedDims = ref('')
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

function onImgLoad(e: Event, target: 'orig' | 'comp') {
  const img = e.target as HTMLImageElement
  const dims = `${img.naturalWidth}×${img.naturalHeight}`
  if (target === 'orig') originalDims.value = dims
  else compressedDims.value = dims
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

function toNumber(raw: string): number | undefined {
  const n = Number(raw)
  return raw !== '' && !Number.isNaN(n) ? n : undefined
}

// Re-runs compression on the current source file with the current settings.
async function runCompression() {
  const file = sourceFile.value
  if (!file) return
  error.value = ''
  loading.value = true
  compressedDims.value = ''
  try {
    const PixSqueeze = await loadPixSqueeze()
    const options: PixSqueezeOptions = {
      quality: quality.value,
      mimeType: adv.format,
      resize: adv.resize,
      strict: adv.strict,
      checkOrientation: adv.checkOrientation,
      retainExif: adv.retainExif,
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
    }
    // Only pass numeric options the user actually set — passing undefined would
    // override PixSqueeze's defaults (Infinity / 0) and break the resize math.
    const mw = toNumber(adv.maxWidth)
    if (mw !== undefined) options.maxWidth = mw
    const mh = toNumber(adv.maxHeight)
    if (mh !== undefined) options.maxHeight = mh
    const nw = toNumber(adv.minWidth)
    if (nw !== undefined) options.minWidth = nw
    const nh = toNumber(adv.minHeight)
    if (nh !== undefined) options.minHeight = nh
    const w = toNumber(adv.width)
    if (w !== undefined) options.width = w
    const h = toNumber(adv.height)
    if (h !== undefined) options.height = h
    const cs = toNumber(adv.convertSize)
    if (cs !== undefined) options.convertSize = cs
    // Which source formats get re-encoded to JPEG when larger than convertSize.
    const convertTypes: string[] = []
    if (adv.convertPng) convertTypes.push('image/png')
    if (adv.convertWebp) convertTypes.push('image/webp')
    options.convertTypes = convertTypes

    job.value = new PixSqueeze(file, options)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    loading.value = false
  }
}

function loadFile(file: File) {
  sourceFile.value = file
  if (original.value) URL.revokeObjectURL(original.value.url)
  original.value = { name: file.name, size: file.size, url: URL.createObjectURL(file) }
  originalDims.value = ''
  compressed.value = null
  runCompression()
}

// Re-compress when quality or any advanced option changes (debounced).
let debounce: ReturnType<typeof setTimeout> | undefined
watch([quality, adv], () => {
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
  originalDims.value = ''
  compressedDims.value = ''
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

      <!-- Open-source origin: install command + package links -->
      <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        <button
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors"
          @click="copyInstall"
        >
          <span class="text-muted">$</span> npm i pixsqueeze
          <UIcon
            :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            class="ml-1 size-3.5 align-text-bottom"
            :class="copied ? 'text-primary' : 'text-muted'"
          />
        </button>
        <ULink
          to="https://www.npmjs.com/package/pixsqueeze"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-npm" />
          npm<span
            v-if="stats?.version"
            class="opacity-70"
          > v{{ stats.version }}</span>
        </ULink>
        <ULink
          to="https://github.com/avlisodraude/pixsqueeze"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-github" />
          GitHub
        </ULink>
      </div>
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

    <!-- Quality (always visible) -->
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

    <!-- Advanced options (slide-down) -->
    <div class="border border-default rounded-xl overflow-hidden">
      <button
        type="button"
        class="w-full flex items-center justify-between px-4 py-3 font-medium"
        @click="showAdvanced = !showAdvanced"
      >
        <span>Advanced options</span>
        <UIcon
          name="i-lucide-chevron-down"
          class="text-muted transition-transform duration-300"
          :class="showAdvanced ? 'rotate-180' : ''"
        />
      </button>
      <div
        class="grid transition-all duration-300 ease-out"
        :class="showAdvanced ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <div class="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div class="flex flex-col gap-1 text-sm">
              <label class="text-muted">Output format</label>
              <select
                v-model="adv.format"
                class="rounded-md border border-default bg-default px-2 py-1.5 text-sm"
              >
                <option value="auto">
                  auto
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
            <div
              v-for="f in numberFields"
              :key="f.key"
              class="flex flex-col gap-1 text-sm"
            >
              <label class="text-muted">{{ f.label }}</label>
              <input
                v-model="adv[f.key]"
                type="number"
                :placeholder="f.ph"
                class="rounded-md border border-default bg-default px-2 py-1.5 text-sm"
              >
            </div>
            <div class="flex flex-col gap-1 text-sm">
              <label class="text-muted">resize</label>
              <select
                v-model="adv.resize"
                class="rounded-md border border-default bg-default px-2 py-1.5 text-sm"
              >
                <option value="none">
                  none
                </option>
                <option value="contain">
                  contain
                </option>
                <option value="cover">
                  cover
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-1 text-sm">
              <label class="text-muted">convertTypes → JPEG</label>
              <div class="flex gap-3 mt-1.5">
                <label class="flex items-center gap-1.5 cursor-pointer">
                  <input
                    v-model="adv.convertPng"
                    type="checkbox"
                    class="accent-primary"
                  >
                  PNG
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer">
                  <input
                    v-model="adv.convertWebp"
                    type="checkbox"
                    class="accent-primary"
                  >
                  WebP
                </label>
              </div>
            </div>
          </div>
          <div class="px-4 pb-4 flex flex-wrap gap-4 text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="adv.strict"
                type="checkbox"
                class="accent-primary"
              >
              strict
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="adv.checkOrientation"
                type="checkbox"
                class="accent-primary"
              >
              checkOrientation
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="adv.retainExif"
                type="checkbox"
                class="accent-primary"
              >
              retainExif
            </label>
          </div>
        </div>
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
            <span class="text-sm text-muted">{{ (originalDims ? originalDims + ' · ' : '') + formatBytes(original.size) }}</span>
          </div>
        </template>
        <img
          :src="original.url"
          alt="Original"
          class="w-full rounded-md"
          @load="onImgLoad($event, 'orig')"
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
            @load="onImgLoad($event, 'comp')"
          >
          <div class="flex items-center justify-between mt-3">
            <span class="text-sm text-muted">{{ (compressedDims ? compressedDims + ' · ' : '') + formatBytes(compressed.size) }}</span>
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
