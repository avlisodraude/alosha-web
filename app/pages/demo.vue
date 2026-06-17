<script setup lang="ts">
definePageMeta({ layout: 'default' })

// /demo is a shared route: each product subdomain renders its own demo, and the
// hub (alosha.dev) renders a landing that links out to all of them.
const { isHub, isStride, isMonitor, isEuValidate } = useSite()

const seo = computed(() => {
  if (isHub) return {
    title: 'Live demos — Alosha',
    description: 'Try every Alosha product in your browser — compress images with PixSqueeze, analyse runs with Stride, validate EU identifiers with eu-validate, and more.',
    url: 'https://alosha.dev/demo'
  }
  if (isStride) return {
    title: 'Stride — Live demo',
    description: 'Analyse a GPX, TCX or FIT run right in your browser — pace, splits, elevation and heart-rate zones. Powered by the open-source Stride library.',
    url: 'https://stride.alosha.dev/demo'
  }
  if (isMonitor) return {
    title: 'Monitor — Live demo',
    description: 'See what a Monitor run looks like: multi-step checks, assertions, alerts and HTML reports. Powered by the open-source Monitor library.',
    url: 'https://monitor.alosha.dev/demo'
  }
  if (isEuValidate) return {
    title: 'eu-validate — Live demo',
    description: 'Validate EU VAT, IBAN, BSN, KvK and postal codes right in your browser — offline, checksum-accurate. Powered by the open-source eu-validate library.',
    url: 'https://eu-validate.alosha.dev/demo'
  }
  return {
    title: 'PixSqueeze — Live demo',
    description: 'Compress an image right in your browser. No upload, no signup. Powered by the open-source PixSqueeze library.',
    url: 'https://pixsqueeze.alosha.dev/demo'
  }
})

useSeoMeta({
  title: () => seo.value.title,
  description: () => seo.value.description,
  ogTitle: () => seo.value.title,
  ogDescription: () => seo.value.description,
  ogUrl: () => seo.value.url
})

const infoKey = ref<string | null>(null)
function openInfo(key: string) {
  infoKey.value = key
}
function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') infoKey.value = null
}
onMounted(() => window.addEventListener('keydown', onEsc))
onUnmounted(() => window.removeEventListener('keydown', onEsc))

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

type ImageInfo = { name: string, size: number, url: string, type: string }
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

function shortType(t: string): string {
  return t ? t.replace('image/', '').toUpperCase() : ''
}

function metaLine(dims: string, type: string, size: number): string {
  return [dims, shortType(type), formatBytes(size)].filter(Boolean).join(' · ')
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
          url: URL.createObjectURL(result),
          type: result.type
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
  original.value = { name: file.name, size: file.size, url: URL.createObjectURL(file), type: file.type }
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

// Per-option documentation shown in the explainer modal. `backtick` spans render
// as inline code; the parser below turns them into <code> elements.
type DocBlock = { t: 'p' | 'rule' | 'code', text: string }
type OptionDoc = { title: string, body: DocBlock[] }

const dimMaxDoc: OptionDoc = {
  title: 'maxWidth / maxHeight',
  body: [
    { t: 'p', text: 'Upper bounds on the output size, in pixels (default `Infinity` = no limit). If the image is larger, it is scaled down proportionally to fit.' },
    { t: 'p', text: 'This is the main lever for shrinking big photos — capping `maxWidth` to e.g. `1920` often cuts file size far more than quality alone.' },
    { t: 'code', text: 'new PixSqueeze(file, {\n  maxWidth: 1920,\n  maxHeight: 1080\n})' }
  ]
}
const dimMinDoc: OptionDoc = {
  title: 'minWidth / minHeight',
  body: [
    { t: 'p', text: 'Lower bounds on the output size (default `0`). If the image is smaller, it is scaled up to meet the minimum.' },
    { t: 'p', text: 'These are floors, not caps — on a large image they do nothing, so use `maxWidth` / `maxHeight` to shrink.' },
    { t: 'code', text: 'new PixSqueeze(file, {\n  minWidth: 320,\n  minHeight: 320\n})' }
  ]
}
const dimExactDoc: OptionDoc = {
  title: 'width / height',
  body: [
    { t: 'p', text: 'Force an exact output width or height in pixels (default: unset, so the natural size is used).' },
    { t: 'p', text: 'Set only one and the other follows the aspect ratio. Set both and the `resize` option decides how the image fills that box.' },
    { t: 'code', text: 'new PixSqueeze(file, {\n  width: 800,\n  height: 600,\n  resize: \'cover\'\n})' }
  ]
}

const optionDocs: Record<string, OptionDoc> = {
  quality: {
    title: 'quality',
    body: [
      { t: 'p', text: 'Compression quality for JPEG and WebP output, from `0` to `1` (default `0.8`). Lower means a smaller file with more visible artifacts; `0.6`–`0.8` is the usual sweet spot for photos.' },
      { t: 'p', text: 'Has no effect on PNG, which is lossless — to shrink a PNG, convert it to JPEG or WebP instead.' },
      { t: 'code', text: 'new PixSqueeze(file, {\n  quality: 0.6\n})' }
    ]
  },
  mimeType: {
    title: 'mimeType (Output format)',
    body: [
      { t: 'p', text: 'Sets the format of the compressed image. Default `auto` keeps the original format; set it explicitly to convert — e.g. `image/webp` for the best size, or `image/jpeg` for universal support.' },
      { t: 'p', text: 'Note: Safari cannot output WebP, so `auto` is the safe default for broad compatibility. Quality only applies to JPEG and WebP.' },
      { t: 'code', text: 'new PixSqueeze(file, {\n  mimeType: \'image/webp\'\n})' }
    ]
  },
  maxWidth: dimMaxDoc,
  maxHeight: dimMaxDoc,
  minWidth: dimMinDoc,
  minHeight: dimMinDoc,
  width: dimExactDoc,
  height: dimExactDoc,
  resize: {
    title: 'resize',
    body: [
      { t: 'p', text: 'Controls how the image fits when both `width` and `height` are set (default `none`).' },
      { t: 'p', text: '`contain` fits the whole image inside the box (may letterbox); `cover` fills the box and crops the overflow. Ignored unless both `width` and `height` are provided.' },
      { t: 'code', text: 'new PixSqueeze(file, {\n  width: 800,\n  height: 600,\n  resize: \'cover\'\n})' }
    ]
  },
  convertSize: {
    title: 'convertSize',
    body: [
      { t: 'p', text: 'The size threshold in bytes (default `5000000` = 5 MB) used with `convertTypes`: images of those types larger than this are re-encoded to JPEG.' },
      { t: 'p', text: 'Lower it to convert smaller PNGs too; raise it (or set `Infinity`) to disable size-based conversion.' },
      { t: 'code', text: 'new PixSqueeze(file, {\n  convertTypes: [\'image/png\'],\n  convertSize: 1000000 // 1 MB\n})' }
    ]
  },
  convertTypes: {
    title: 'convertTypes',
    body: [
      { t: 'p', text: 'Re-encodes large images of certain formats to JPEG. It works together with `convertSize`:' },
      { t: 'rule', text: 'Any input image whose type is listed in `convertTypes` and whose size exceeds `convertSize` is converted to JPEG.' },
      { t: 'p', text: 'Defaults: `["image/png"]`, with `convertSize` = 5 MB. The conversion target is always JPEG — this only chooses which source formats are eligible.' },
      { t: 'p', text: 'Why: PNG is lossless, so photos saved as PNG are enormous. JPEG compresses photos far better — big PNGs get auto-rescued, while small PNGs (logos, icons, transparency) stay PNG.' },
      { t: 'code', text: 'new PixSqueeze(file, {\n  convertTypes: [\'image/png\', \'image/webp\'],\n  convertSize: 1000000 // 1 MB\n})' },
      { t: 'p', text: 'Valid values: only `image/png` and `image/webp` — where converting to JPEG is meaningful. `image/jpeg` is pointless, and other types are not part of this feature.' }
    ]
  },
  strict: {
    title: 'strict',
    body: [
      { t: 'p', text: 'When `true` (default), if compression somehow produces a larger file than the original, PixSqueeze returns the original instead — so you never end up bigger.' },
      { t: 'p', text: 'Turn it off only if you always want the re-encoded output regardless of size.' },
      { t: 'code', text: 'new PixSqueeze(file, {\n  strict: false\n})' }
    ]
  },
  checkOrientation: {
    title: 'checkOrientation',
    body: [
      { t: 'p', text: 'When `true` (default), reads the image Exif orientation flag and rotates or flips the output so it displays upright — important for iPhone photos, which are often stored sideways.' },
      { t: 'p', text: 'Disable only if you are certain orientation is already correct and want to skip the work.' },
      { t: 'code', text: 'new PixSqueeze(file, {\n  checkOrientation: true\n})' }
    ]
  },
  retainExif: {
    title: 'retainExif',
    body: [
      { t: 'p', text: 'When `true`, preserves the Exif metadata (camera info, GPS, timestamp) in the output; default `false` strips it. Only applies to JPEG output.' },
      { t: 'p', text: 'Keep it off for privacy and smaller files unless you specifically need the metadata.' },
      { t: 'code', text: 'new PixSqueeze(file, {\n  mimeType: \'image/jpeg\',\n  retainExif: true\n})' }
    ]
  }
}

const currentDoc = computed<OptionDoc | null>(() => {
  return infoKey.value ? (optionDocs[infoKey.value] ?? null) : null
})

function parseInline(text: string): { code: boolean, value: string }[] {
  return text.split(/(`[^`]+`)/).filter(s => s !== '').map((part) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return { code: true, value: part.slice(1, -1) }
    }
    return { code: false, value: part }
  })
}
</script>

<template>
  <DemoHub v-if="isHub" />
  <DemoStride v-else-if="isStride" />
  <DemoMonitor v-else-if="isMonitor" />
  <DemoEuValidate v-else-if="isEuValidate" />
  <div
    v-else
    class="max-w-4xl mx-auto px-4 py-10 space-y-8"
  >
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
      <div class="text-sm font-medium flex justify-between items-center">
        <span class="flex items-center gap-1.5">
          Quality
          <button
            type="button"
            class="inline-flex text-muted hover:text-primary transition-colors"
            aria-label="About quality"
            @click="openInfo('quality')"
          >
            <UIcon
              name="i-lucide-info"
              class="size-3.5"
            />
          </button>
        </span>
        <span class="text-muted">{{ quality.toFixed(2) }}</span>
      </div>
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
              <span class="text-muted flex items-center gap-1.5">
                Output format
                <button
                  type="button"
                  class="inline-flex text-muted hover:text-primary transition-colors"
                  aria-label="About mimeType"
                  @click="openInfo('mimeType')"
                >
                  <UIcon
                    name="i-lucide-info"
                    class="size-3.5"
                  />
                </button>
              </span>
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
              <span class="text-muted flex items-center gap-1.5">
                {{ f.label }}
                <button
                  type="button"
                  class="inline-flex text-muted hover:text-primary transition-colors"
                  :aria-label="`About ${f.key}`"
                  @click="openInfo(f.key)"
                >
                  <UIcon
                    name="i-lucide-info"
                    class="size-3.5"
                  />
                </button>
              </span>
              <input
                v-model="adv[f.key]"
                type="number"
                :placeholder="f.ph"
                class="rounded-md border border-default bg-default px-2 py-1.5 text-sm"
              >
            </div>
            <div class="flex flex-col gap-1 text-sm">
              <span class="text-muted flex items-center gap-1.5">
                resize
                <button
                  type="button"
                  class="inline-flex text-muted hover:text-primary transition-colors"
                  aria-label="About resize"
                  @click="openInfo('resize')"
                >
                  <UIcon
                    name="i-lucide-info"
                    class="size-3.5"
                  />
                </button>
              </span>
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
              <span class="text-muted flex items-center gap-1.5">
                convertTypes → JPEG
                <button
                  type="button"
                  class="inline-flex text-muted hover:text-primary transition-colors"
                  aria-label="About convertTypes"
                  @click="openInfo('convertTypes')"
                >
                  <UIcon
                    name="i-lucide-info"
                    class="size-3.5"
                  />
                </button>
              </span>
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
            <div class="flex items-center gap-1.5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="adv.strict"
                  type="checkbox"
                  class="accent-primary"
                >
                strict
              </label>
              <button
                type="button"
                class="inline-flex text-muted hover:text-primary transition-colors"
                aria-label="About strict"
                @click="openInfo('strict')"
              >
                <UIcon
                  name="i-lucide-info"
                  class="size-3.5"
                />
              </button>
            </div>
            <div class="flex items-center gap-1.5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="adv.checkOrientation"
                  type="checkbox"
                  class="accent-primary"
                >
                checkOrientation
              </label>
              <button
                type="button"
                class="inline-flex text-muted hover:text-primary transition-colors"
                aria-label="About checkOrientation"
                @click="openInfo('checkOrientation')"
              >
                <UIcon
                  name="i-lucide-info"
                  class="size-3.5"
                />
              </button>
            </div>
            <div class="flex items-center gap-1.5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="adv.retainExif"
                  type="checkbox"
                  class="accent-primary"
                >
                retainExif
              </label>
              <button
                type="button"
                class="inline-flex text-muted hover:text-primary transition-colors"
                aria-label="About retainExif"
                @click="openInfo('retainExif')"
              >
                <UIcon
                  name="i-lucide-info"
                  class="size-3.5"
                />
              </button>
            </div>
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
            <span class="text-sm text-muted">{{ metaLine(originalDims, original.type, original.size) }}</span>
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
            <span class="text-sm text-muted">{{ metaLine(compressedDims, compressed.type, compressed.size) }}</span>
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

    <!-- Option explainer modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="currentDoc"
          class="modal-overlay"
          @click.self="infoKey = null"
        >
          <div
            class="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="opt-title"
          >
            <div class="flex items-start justify-between gap-4 mb-3">
              <h3
                id="opt-title"
                class="font-mono text-primary text-base"
              >
                {{ currentDoc.title }}
              </h3>
              <button
                type="button"
                class="text-muted hover:text-default"
                aria-label="Close"
                @click="infoKey = null"
              >
                <UIcon
                  name="i-lucide-x"
                  class="size-4"
                />
              </button>
            </div>
            <div class="space-y-2.5 text-sm text-muted">
              <template
                v-for="(block, i) in currentDoc.body"
                :key="i"
              >
                <pre v-if="block.t === 'code'">{{ block.text }}</pre>
                <p
                  v-else
                  :class="block.t === 'rule' ? 'ct-rule text-default' : ''"
                >
                  <template
                    v-for="(seg, j) in parseInline(block.text)"
                    :key="j"
                  >
                    <code v-if="seg.code">{{ seg.value }}</code>
                    <span v-else>{{ seg.value }}</span>
                  </template>
                </p>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(5, 7, 12, 0.6);
  backdrop-filter: blur(3px);
}

.modal-card {
  width: 100%;
  max-width: 28rem;
  padding: 1.5rem;
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-card code {
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  background: var(--ui-bg-elevated);
  color: var(--ui-primary);
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
}

.modal-card pre {
  background: var(--ui-bg-muted);
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  padding: 0.7rem;
  font-size: 0.72rem;
  overflow-x: auto;
  color: var(--ui-primary);
}

.ct-rule {
  background: color-mix(in srgb, var(--ui-primary) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--ui-primary) 30%, transparent);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
}

/* Soft scale-in / fade animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-card {
  transition: transform 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modal-card {
  transform: scale(0.95) translateY(8px);
}

.modal-leave-active .modal-card {
  transition: transform 0.18s ease;
}

.modal-leave-to .modal-card {
  transform: scale(0.98);
}
</style>
