<script setup lang="ts">
/**
 * Live, in-browser Stride demo. Loads the standalone @alosha/stride browser
 * bundle (/lib/stride.js) and Chart.js (CDN) on demand, parses a GPX file
 * entirely client-side, and renders the analysis dashboards. Nothing is
 * uploaded — the file never leaves the device.
 */

type Units = 'metric' | 'imperial'

interface Split { km: number, paceSecPerKm: number, elevationGainM: number, avgHeartRate?: number }
interface HrZones { z1: number, z2: number, z3: number, z4: number, z5: number }
interface StrideStats {
  distanceM: number
  elapsedTimeSec: number
  movingTimeSec: number
  avgPaceSecPerKm: number
  bestKmPaceSecPerKm: number | null
  elevationGainM: number
  elevationLossM: number
  avgHeartRate: number | null
  maxHeartRate: number | null
  hrZones: HrZones | null
  avgCadence: number | null
  splits: Split[]
}
interface StrideActivity { name?: string, format?: string, type?: string, startTime?: string, points: unknown[] }
interface StrideApi {
  parse: (input: string | Uint8Array) => StrideActivity
  analyze: (a: StrideActivity, maxHR?: number) => StrideStats
  formatPace: (s: number, u?: Units) => string
  formatDistance: (m: number, u?: Units) => string
  formatDuration: (s: number) => string
  paceChartConfig: (a: StrideActivity, s: StrideStats, o?: object) => ChartCfg
  elevationChartConfig: (a: StrideActivity, s: StrideStats, o?: object) => ChartCfg
  heartRateChartConfig: (a: StrideActivity, s: StrideStats) => ChartCfg
  hrZonesChartConfig: (s: StrideStats) => ChartCfg
  splitsChartConfig: (s: StrideStats, o?: object) => ChartCfg
}
interface ChartCfg { type: string, data: unknown, options?: Record<string, unknown> }
interface ChartInstance { destroy: () => void }
interface ChartCtor { new (ctx: HTMLCanvasElement, cfg: ChartCfg): ChartInstance }

const units = ref<Units>('metric')
const loading = ref(false)
const error = ref('')
const dragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref('')

const activity = shallowRef<StrideActivity | null>(null)
const stats = shallowRef<StrideStats | null>(null)

const copied = ref(false)
async function copyInstall() {
  try {
    await navigator.clipboard.writeText('npm i @alosha/stride')
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch { /* clipboard unavailable */ }
}

// ---- lazy library loading -------------------------------------------------

function loadStride(): Promise<StrideApi> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { Stride?: StrideApi }
    if (w.Stride) return resolve(w.Stride)
    const s = document.createElement('script')
    s.src = '/lib/stride.js'
    s.onload = () => (w.Stride ? resolve(w.Stride) : reject(new Error('Stride failed to initialise')))
    s.onerror = () => reject(new Error('Could not load the Stride library'))
    document.head.appendChild(s)
  })
}

function loadChart(): Promise<ChartCtor> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { Chart?: ChartCtor }
    if (w.Chart) return resolve(w.Chart)
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
    s.onload = () => (w.Chart ? resolve(w.Chart) : reject(new Error('Chart.js failed to initialise')))
    s.onerror = () => reject(new Error('Could not load Chart.js'))
    document.head.appendChild(s)
  })
}

// ---- parsing --------------------------------------------------------------

async function handleParse(input: string | Uint8Array, name: string) {
  error.value = ''
  loading.value = true
  try {
    const Stride = await loadStride()
    await loadChart()
    const act = Stride.parse(input)
    const st = Stride.analyze(act)
    activity.value = act
    stats.value = st
    fileName.value = name
    await nextTick()
    renderCharts()
  } catch (e) {
    activity.value = null
    stats.value = null
    error.value = e instanceof Error ? e.message : 'Could not parse that file.'
  } finally {
    loading.value = false
  }
}

function onFile(file: File) {
  const isGpx = /\.gpx$/i.test(file.name) || file.type === 'application/gpx+xml'
  const isTcx = /\.tcx$/i.test(file.name)
  const isFit = /\.fit$/i.test(file.name)
  if (!isGpx && !isTcx && !isFit) {
    error.value = 'Please choose a .gpx, .tcx or .fit file.'
    return
  }
  const reader = new FileReader()
  reader.onerror = () => (error.value = 'Could not read that file.')
  if (isFit) {
    // FIT is binary — read raw bytes and hand parse() a Uint8Array.
    reader.onload = () => handleParse(new Uint8Array(reader.result as ArrayBuffer), file.name)
    reader.readAsArrayBuffer(file)
  } else {
    // GPX and TCX are XML text.
    reader.onload = () => handleParse(String(reader.result), file.name)
    reader.readAsText(file)
  }
}

function onInputChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) onFile(f)
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) onFile(f)
}

async function loadSample() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('/demo/sample-run.gpx')
    if (!res.ok) throw new Error('Could not load the sample run.')
    const xml = await res.text()
    await handleParse(xml, 'sample-run.gpx')
  } catch (e) {
    loading.value = false
    error.value = e instanceof Error ? e.message : 'Could not load the sample run.'
  }
}

// ---- charts ---------------------------------------------------------------

const paceCanvas = ref<HTMLCanvasElement | null>(null)
const splitsCanvas = ref<HTMLCanvasElement | null>(null)
const elevationCanvas = ref<HTMLCanvasElement | null>(null)
const hrCanvas = ref<HTMLCanvasElement | null>(null)
const zonesCanvas = ref<HTMLCanvasElement | null>(null)

let charts: ChartInstance[] = []

function destroyCharts() {
  for (const c of charts) c.destroy()
  charts = []
}

function mount(Chart: ChartCtor, canvas: HTMLCanvasElement | null, cfg: ChartCfg) {
  if (!canvas) return
  cfg.options = { ...(cfg.options || {}), maintainAspectRatio: false }
  charts.push(new Chart(canvas, cfg))
}

async function renderCharts() {
  const Stride = (window as unknown as { Stride?: StrideApi }).Stride
  const Chart = (window as unknown as { Chart?: ChartCtor }).Chart
  const act = activity.value
  const st = stats.value
  if (!Stride || !Chart || !act || !st) return
  destroyCharts()
  const opts = { units: units.value }
  mount(Chart, paceCanvas.value, Stride.paceChartConfig(act, st, opts))
  mount(Chart, splitsCanvas.value, Stride.splitsChartConfig(st, opts))
  mount(Chart, elevationCanvas.value, Stride.elevationChartConfig(act, st, opts))
  if (st.hrZones) {
    mount(Chart, hrCanvas.value, Stride.heartRateChartConfig(act, st))
    mount(Chart, zonesCanvas.value, Stride.hrZonesChartConfig(st))
  }
}

watch(units, async () => {
  if (!stats.value) return
  await nextTick()
  renderCharts()
})

onBeforeUnmount(destroyCharts)

// ---- formatted summary ----------------------------------------------------

const Sapi = () => (window as unknown as { Stride?: StrideApi }).Stride

function fmtElev(m: number): string {
  return units.value === 'imperial' ? `${Math.round(m * 3.28084)} ft` : `${Math.round(m)} m`
}

interface Stat { label: string, value: string, icon: string }
const summary = computed<Stat[]>(() => {
  const st = stats.value
  const S = Sapi()
  if (!st || !S) return []
  const out: Stat[] = [
    { label: 'Distance', value: S.formatDistance(st.distanceM, units.value), icon: 'i-lucide-route' },
    { label: 'Moving time', value: S.formatDuration(st.movingTimeSec), icon: 'i-lucide-timer' },
    { label: 'Avg pace', value: S.formatPace(st.avgPaceSecPerKm, units.value), icon: 'i-lucide-gauge' }
  ]
  if (st.bestKmPaceSecPerKm != null)
    out.push({ label: 'Best km', value: S.formatPace(st.bestKmPaceSecPerKm, units.value), icon: 'i-lucide-zap' })
  out.push({ label: 'Elevation ↑', value: fmtElev(st.elevationGainM), icon: 'i-lucide-mountain' })
  if (st.avgHeartRate != null)
    out.push({ label: 'Avg HR', value: `${st.avgHeartRate} bpm`, icon: 'i-lucide-heart-pulse' })
  if (st.maxHeartRate != null)
    out.push({ label: 'Max HR', value: `${st.maxHeartRate} bpm`, icon: 'i-lucide-activity' })
  if (st.avgCadence != null)
    out.push({ label: 'Avg cadence', value: `${st.avgCadence} spm`, icon: 'i-lucide-footprints' })
  return out
})

const hasHr = computed(() => !!stats.value?.hrZones)

// ---- developer output: structured payload + the code that produced it -------

const devTab = ref<'json' | 'code'>('json')

// A clean, filtered payload — the analysis output plus an activity summary and a
// single sample point, instead of the full (potentially huge) points array.
const payload = computed(() => {
  const act = activity.value
  const st = stats.value
  if (!act || !st) return null
  return {
    activity: {
      name: act.name ?? null,
      format: act.format ?? null,
      type: act.type ?? null,
      startTime: act.startTime ?? null,
      points: act.points.length,
      samplePoint: act.points[0] ?? null
    },
    stats: st
  }
})

const payloadJson = computed(() => (payload.value ? JSON.stringify(payload.value, null, 2) : ''))

const codeSnippet = computed(() => {
  const act = activity.value
  if (!act) return ''
  const fmt = act.format ?? 'gpx'
  const isFit = fmt === 'fit'
  const hrLines = hasHr.value
    ? `\nnew Chart(zonesCanvas, hrZonesChartConfig(stats))`
    : ''
  const extraImport = hasHr.value ? ', hrZonesChartConfig' : ''
  return `import { parse, analyze, paceChartConfig${extraImport} } from '@alosha/stride'
import { Chart } from 'chart.js/auto'

// ${fileName.value || `your-run.${fmt}`} — format auto-detected (GPX · TCX · FIT)
const activity = parse(${isFit ? 'bytes' : 'xml'})   // ${isFit ? 'Uint8Array for binary FIT' : 'GPX / TCX as a string'}
const stats = analyze(activity)        // ← the payload shown on the right

new Chart(paceCanvas, paceChartConfig(activity, stats, { units: '${units.value}' }))${hrLines}`
})

const copiedDev = ref<'json' | 'code' | null>(null)
async function copyDev(which: 'json' | 'code') {
  const text = which === 'json' ? payloadJson.value : codeSnippet.value
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copiedDev.value = which
    setTimeout(() => (copiedDev.value = null), 1500)
  } catch { /* clipboard unavailable */ }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">
        Try <span class="text-primary">Stride</span>
      </h1>
      <p class="text-muted mt-2">
        Drop in a GPX, TCX or FIT run and get pace, splits, elevation and heart-rate analysis — computed
        right in your browser. Nothing is uploaded.
      </p>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        <button
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors"
          @click="copyInstall"
        >
          <span class="text-muted">$</span> npm i @alosha/stride
          <UIcon
            :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            class="ml-1 size-3.5 align-text-bottom"
            :class="copied ? 'text-primary' : 'text-muted'"
          />
        </button>
        <ULink
          to="https://www.npmjs.com/package/@alosha/stride"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-npm" />
          npm
        </ULink>
        <ULink
          to="https://github.com/avlisodraude/stride"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-github" />
          GitHub
        </ULink>
      </div>
    </div>

    <!-- Dropzone -->
    <div
      class="rounded-xl border-2 border-dashed transition-colors p-8 text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :class="dragging ? 'border-primary bg-primary/5' : 'border-default hover:border-primary/40'"
      role="button"
      tabindex="0"
      aria-label="Upload a GPX, TCX or FIT file to analyse"
      @click="fileInput?.click()"
      @keydown.enter.prevent="fileInput?.click()"
      @keydown.space.prevent="fileInput?.click()"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <UIcon
        name="i-lucide-upload-cloud"
        class="size-8 text-muted mx-auto"
      />
      <p class="mt-3 font-medium">
        Drop a <span class="font-mono text-primary">.gpx</span>,
        <span class="font-mono text-primary">.tcx</span> or
        <span class="font-mono text-primary">.fit</span> file here, or click to choose
      </p>
      <p class="text-muted text-sm mt-1">
        Exported from Garmin, Strava, Coros, Apple Health…
      </p>
      <div class="mt-4">
        <UButton
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-lucide-play"
          :loading="loading"
          @click.stop="loadSample"
        >
          Load a sample run
        </UButton>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept=".gpx,.tcx,.fit,application/gpx+xml"
        class="hidden"
        @change="onInputChange"
      >
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      icon="i-lucide-alert-triangle"
      :title="error"
    />

    <!-- Results -->
    <div
      v-if="stats"
      class="space-y-8"
    >
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <h2 class="text-lg font-semibold inline-flex items-center gap-2">
          <UIcon
            name="i-lucide-activity"
            class="text-primary"
          />
          {{ activity?.name || fileName || 'Your run' }}
        </h2>
        <div class="inline-flex rounded-md border border-default overflow-hidden text-sm">
          <button
            type="button"
            class="px-3 py-1 transition-colors"
            :class="units === 'metric' ? 'bg-primary text-inverted' : 'text-muted hover:text-default'"
            @click="units = 'metric'"
          >
            Metric
          </button>
          <button
            type="button"
            class="px-3 py-1 transition-colors"
            :class="units === 'imperial' ? 'bg-primary text-inverted' : 'text-muted hover:text-default'"
            @click="units = 'imperial'"
          >
            Imperial
          </button>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="s in summary"
          :key="s.label"
          class="rounded-lg border border-default bg-default p-3"
        >
          <div class="text-muted text-xs inline-flex items-center gap-1.5">
            <UIcon :name="s.icon" />
            {{ s.label }}
          </div>
          <div class="text-xl font-semibold mt-1 tabular-nums">
            {{ s.value }}
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="rounded-lg border border-default bg-default p-4">
          <div class="h-64">
            <canvas ref="paceCanvas" />
          </div>
        </div>
        <div class="rounded-lg border border-default bg-default p-4">
          <div class="h-64">
            <canvas ref="splitsCanvas" />
          </div>
        </div>
        <div
          class="rounded-lg border border-default bg-default p-4"
          :class="hasHr ? '' : 'md:col-span-2'"
        >
          <div class="h-64">
            <canvas ref="elevationCanvas" />
          </div>
        </div>
        <template v-if="hasHr">
          <div class="rounded-lg border border-default bg-default p-4">
            <div class="h-64">
              <canvas ref="hrCanvas" />
            </div>
          </div>
          <div class="rounded-lg border border-default bg-default p-4 md:col-span-2">
            <div class="h-72">
              <canvas ref="zonesCanvas" />
            </div>
          </div>
        </template>
      </div>

      <!-- Developer output: structured payload + the code that produced it -->
      <div class="rounded-lg border border-default bg-default overflow-hidden">
        <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-default">
          <div class="inline-flex items-center gap-2 text-sm font-medium">
            <UIcon
              name="i-lucide-braces"
              class="text-primary"
            />
            Developer output
          </div>
          <div class="flex items-center gap-2">
            <div class="inline-flex rounded-md border border-default overflow-hidden text-xs">
              <button
                type="button"
                class="px-2.5 py-1 transition-colors"
                :class="devTab === 'json' ? 'bg-primary text-inverted' : 'text-muted hover:text-default'"
                @click="devTab = 'json'"
              >
                JSON
              </button>
              <button
                type="button"
                class="px-2.5 py-1 transition-colors"
                :class="devTab === 'code' ? 'bg-primary text-inverted' : 'text-muted hover:text-default'"
                @click="devTab = 'code'"
              >
                Code
              </button>
            </div>
            <UButton
              :icon="copiedDev === devTab ? 'i-lucide-check' : 'i-lucide-copy'"
              color="neutral"
              variant="soft"
              size="xs"
              @click="copyDev(devTab)"
            >
              {{ copiedDev === devTab ? 'Copied' : (devTab === 'json' ? 'Copy JSON' : 'Copy code') }}
            </UButton>
          </div>
        </div>
        <pre class="bg-gray-900 dark:bg-gray-950 text-green-400 text-xs font-mono p-4 overflow-x-auto max-h-96">{{ devTab === 'json' ? payloadJson : codeSnippet }}</pre>
      </div>

      <p class="text-center text-muted text-sm">
        All of this is computed by the open-source
        <span class="font-mono text-default">@alosha/stride</span> package — the same
        <code class="text-primary">parse()</code>, <code class="text-primary">analyze()</code>
        and Chart.js configs you can <code>npm install</code> today.
      </p>
    </div>
  </div>
</template>
