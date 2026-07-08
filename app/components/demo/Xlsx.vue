<script setup lang="ts">
/**
 * Live, in-browser @alosha/xlsx demo — the real library, run client-side, not a
 * screenshot. Five panels:
 *   1. Build & download — toggle real OOXML features, then writeBuffer() a file.
 *   2. Read it back — drop an .xlsx, xlsx.load() it, render the grid.
 *   3. Drop-in for ExcelJS — the one-line `@alosha/xlsx/compat` import swap.
 *   4. Why @alosha/xlsx — a factual, evenhanded comparison.
 *   5. Install + links.
 *
 * The library is imported lazily inside the client-only handlers (`await
 * import('@alosha/xlsx/compat')`) so it never touches the SSR bundle — its single
 * transitive dep is fflate, and everything here runs in the browser.
 */

// --- feature toggles for panel 1 -----------------------------------------------------------------
const features = reactive({
  styledHeader: true,
  numberFormats: true,
  formula: true,
  mergedCells: true,
  freezePanes: true,
  autoFilter: true,
  conditionalFormatting: true,
  dataValidation: true,
  comment: true,
  image: true,
  multipleSheets: true
})

const toggles = [
  { key: 'styledHeader', label: 'Styled header', hint: 'Bold white text on a filled, centered header row' },
  { key: 'numberFormats', label: 'Number formats', hint: 'Currency (`$#,##0.00`) on the price & revenue columns' },
  { key: 'formula', label: 'Formula', hint: 'Per-row `Units × Price` plus a `SUM()` total, with cached results' },
  { key: 'mergedCells', label: 'Merged cells', hint: 'A merged "Total" label spanning the first four columns' },
  { key: 'freezePanes', label: 'Freeze panes', hint: 'Freeze the header row so it stays put while scrolling' },
  { key: 'autoFilter', label: 'Auto-filter', hint: 'Filter dropdowns on the header range' },
  { key: 'conditionalFormatting', label: 'Conditional formatting', hint: 'A colour scale on revenue + a highlight rule on units' },
  { key: 'dataValidation', label: 'Data-validation dropdown', hint: 'A list dropdown (`Approved / Pending / Rejected`)' },
  { key: 'comment', label: 'Cell comment', hint: 'A note attached to the Revenue header cell' },
  { key: 'image', label: 'Embedded image', hint: 'A generated PNG logo anchored beside the table' },
  { key: 'multipleSheets', label: 'Multiple sheets', hint: 'A second "About" worksheet' }
] as const

const building = ref(false)
const buildError = ref('')

// Sample dataset for the generated sheet.
const rows = [
  ['North', 'Widgets', 1200, 4.5],
  ['North', 'Gadgets', 860, 12.0],
  ['South', 'Widgets', 2010, 4.5],
  ['South', 'Sprockets', 430, 27.5],
  ['East', 'Gadgets', 1580, 12.0],
  ['East', 'Sprockets', 690, 27.5],
  ['West', 'Widgets', 1740, 4.5],
  ['West', 'Gadgets', 920, 12.0]
] as const

// A small PNG generated on a canvas, returned as raw bytes for workbook.addImage.
function makeLogoPng(): Uint8Array {
  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 80
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 160, 80)
  grad.addColorStop(0, '#6366f1')
  grad.addColorStop(1, '#22d3ee')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 160, 80)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('@alosha/xlsx', 80, 42)
  const dataUrl = canvas.toDataURL('image/png')
  const b64 = dataUrl.split(',')[1] ?? ''
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function generate() {
  buildError.value = ''
  building.value = true
  try {
    const { Workbook } = await import('@alosha/xlsx/compat')
    const wb = new Workbook()
    wb.creator = '@alosha/xlsx demo'
    wb.created = new Date()

    const ws = wb.addWorksheet('Sales')
    ws.getColumn(1).width = 12
    ws.getColumn(2).width = 14
    ws.getColumn(4).width = 12
    ws.getColumn(5).width = 14

    // Header row.
    const headers = ['Region', 'Product', 'Units', 'Price', 'Revenue']
    headers.forEach((h, i) => {
      const cell = ws.getCell(1, i + 1)
      cell.value = h
      if (features.styledHeader) {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
      }
    })

    // Data rows.
    rows.forEach((r, idx) => {
      const rowNum = idx + 2
      ws.getCell(rowNum, 1).value = r[0]
      ws.getCell(rowNum, 2).value = r[1]
      ws.getCell(rowNum, 3).value = r[2]

      const price = ws.getCell(rowNum, 4)
      price.value = r[3]
      if (features.numberFormats) price.numFmt = '$#,##0.00'

      const revenue = ws.getCell(rowNum, 5)
      const amount = r[2] * r[3]
      if (features.formula) revenue.value = { formula: `C${rowNum}*D${rowNum}`, result: amount }
      else revenue.value = amount
      if (features.numberFormats) revenue.numFmt = '$#,##0.00'
    })

    const lastDataRow = rows.length + 1 // e.g. 9
    const totalRow = lastDataRow + 1 // e.g. 10
    const total = rows.reduce((s, r) => s + r[2] * r[3], 0)

    // Total row (+ optional merged label).
    if (features.mergedCells) {
      ws.getCell(totalRow, 1).value = 'Total'
      ws.getCell(totalRow, 1).font = { bold: true }
      ws.getCell(totalRow, 1).alignment = { horizontal: 'right' }
      ws.mergeCells(`A${totalRow}:D${totalRow}`)
    } else {
      ws.getCell(totalRow, 4).value = 'Total'
      ws.getCell(totalRow, 4).font = { bold: true }
    }
    const totalCell = ws.getCell(totalRow, 5)
    if (features.formula) totalCell.value = { formula: `SUM(E2:E${lastDataRow})`, result: total }
    else totalCell.value = total
    totalCell.font = { bold: true }
    if (features.numberFormats) totalCell.numFmt = '$#,##0.00'

    // Freeze the header row.
    if (features.freezePanes) {
      ws.views = [{ state: 'frozen', ySplit: 1, topLeftCell: 'A2' }]
    }

    // Auto-filter over the header range.
    if (features.autoFilter) {
      ws.autoFilter = `A1:E${lastDataRow}`
    }

    // Conditional formatting: colour scale on revenue, highlight big unit counts.
    if (features.conditionalFormatting) {
      ws.addConditionalFormatting({
        ref: `E2:E${lastDataRow}`,
        rules: [
          {
            type: 'colorScale',
            priority: 1,
            cfvo: [{ type: 'min' }, { type: 'max' }],
            color: ['FFF8696B', 'FF63BE7B']
          }
        ]
      })
      ws.addConditionalFormatting({
        ref: `C2:C${lastDataRow}`,
        rules: [
          {
            type: 'cellIs',
            operator: 'greaterThan',
            formulae: [1500],
            priority: 2,
            style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFFEB9C' } } }
          }
        ]
      })
    }

    // Data-validation dropdown in a small sign-off area.
    if (features.dataValidation) {
      const dvRow = totalRow + 2
      ws.getCell(dvRow, 1).value = 'Status'
      ws.getCell(dvRow, 1).font = { bold: true }
      const dv = ws.getCell(dvRow, 2)
      dv.value = 'Pending'
      dv.dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: ['"Approved,Pending,Rejected"']
      }
    }

    // A cell comment on the Revenue header.
    if (features.comment) {
      ws.getCell(1, 5).note = { texts: 'Revenue = Units × Price, computed as a live formula.' }
    }

    // An embedded PNG, anchored beside the table.
    if (features.image) {
      const imageId = wb.addImage({ extension: 'png', buffer: makeLogoPng() })
      ws.addImage(imageId, { tl: { col: 6, row: 1 }, ext: { width: 160, height: 80 } })
    }

    // A second worksheet.
    if (features.multipleSheets) {
      const about = wb.addWorksheet('About')
      about.getColumn(1).width = 60
      about.getCell('A1').value = 'Generated with @alosha/xlsx'
      about.getCell('A1').font = { bold: true, size: 14 }
      about.getCell('A2').value = 'A modern TypeScript library for reading & writing .xlsx.'
      about.getCell('A3').value = { text: 'https://xlsx.alosha.dev', hyperlink: 'https://xlsx.alosha.dev' }
      about.getCell('A4').value = `Created ${new Date().toISOString().slice(0, 10)}`
    }

    const bytes = await (wb as unknown as { xlsx: { writeBuffer(): Promise<Uint8Array> } }).xlsx.writeBuffer()
    const blob = new Blob([bytes as unknown as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'alosha-xlsx-demo.xlsx'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
  } catch (e) {
    buildError.value = e instanceof Error ? e.message : String(e)
  } finally {
    building.value = false
  }
}

// --- panel 2: read an .xlsx back -----------------------------------------------------------------
interface SheetGrid {
  name: string
  header: string[]
  rows: string[][]
}

const reading = ref(false)
const readError = ref('')
const dragging = ref(false)
const readFileName = ref('')
const grids = ref<SheetGrid[]>([])
const activeSheet = ref(0)
const readFileInput = ref<HTMLInputElement | null>(null)

// Turn any core cell value into a display string for the grid.
function cellText(cell: { value: unknown, text: string }): string {
  const v = cell.value
  if (v == null) return ''
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    if ('formula' in o) return String(o.result ?? cell.text ?? '')
    if ('richText' in o) return cell.text
    if ('text' in o) return String(o.text)
    if ('error' in o) return String(o.error)
    if (v instanceof Date) return v.toLocaleDateString()
  }
  return cell.text || String(v)
}

async function readWorkbook(file: File) {
  readError.value = ''
  reading.value = true
  grids.value = []
  readFileName.value = file.name
  try {
    const { Workbook } = await import('@alosha/xlsx/compat')
    const wb = new Workbook()
    const buf = new Uint8Array(await file.arrayBuffer())
    await (wb as unknown as { xlsx: { load(buffer: Uint8Array): Promise<void> } }).xlsx.load(buf)

    const out: SheetGrid[] = []
    for (const ws of wb.worksheets) {
      const colCount = Math.max(ws.columnCount, 1)
      const rowCount = ws.rowCount
      const all: string[][] = []
      for (let r = 1; r <= rowCount; r++) {
        const line: string[] = []
        for (let c = 1; c <= colCount; c++) line.push(cellText(ws.getCell(r, c)))
        all.push(line)
      }
      out.push({
        name: ws.name,
        header: all[0] ?? [],
        rows: all.slice(1)
      })
    }
    grids.value = out
    activeSheet.value = 0
    if (!out.length) readError.value = 'That workbook has no sheets.'
  } catch (e) {
    readError.value = e instanceof Error ? e.message : String(e)
  } finally {
    reading.value = false
  }
}

function onReadInput(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) readWorkbook(file)
}
function onReadDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) readWorkbook(file)
}

// --- panel 3: copy-to-clipboard for the migration snippet + install -----------------------------
const copiedKey = ref('')
async function copy(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => (copiedKey.value = ''), 1500)
  } catch { /* clipboard unavailable */ }
}

const migrationSnippet = `- import ExcelJS from 'exceljs'
+ import ExcelJS from '@alosha/xlsx/compat'`

const comparison = [
  { label: 'Module format', xlsx: 'ESM + CJS builds', note: 'Import or require — both ship.' },
  { label: 'TypeScript', xlsx: 'Strict, first-class types', note: 'A discriminated-union value model, not `any`.' },
  { label: 'Dependencies', xlsx: 'One (fflate)', note: 'A single tiny zip dep — no transitive baggage.' },
  { label: 'Distribution', xlsx: 'npm-native, maintained', note: 'Published to npm and actively maintained.' },
  { label: 'Peak memory @ 500k rows', xlsx: '188 MiB (streaming)', note: '≈15.6× lower than a buffered write (2.9 GiB), from BENCHMARKS.md.' }
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight">
        Try <span class="text-primary">@alosha/xlsx</span>
      </h1>
      <p class="text-muted mt-2 max-w-2xl mx-auto">
        Build a real <code class="font-mono text-xs">.xlsx</code> workbook with styles, formulas,
        conditional formatting, comments and images — then read one back — entirely in your browser.
        Nothing is uploaded.
      </p>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        <button
          type="button"
          class="font-mono text-xs bg-default border border-default rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors"
          @click="copy('npm install @alosha/xlsx', 'install-top')"
        >
          <span class="text-muted">$</span> npm install @alosha/xlsx
          <UIcon
            :name="copiedKey === 'install-top' ? 'i-lucide-check' : 'i-lucide-copy'"
            class="ml-1 size-3.5 align-text-bottom"
            :class="copiedKey === 'install-top' ? 'text-primary' : 'text-muted'"
          />
        </button>
        <ULink
          to="https://www.npmjs.com/package/@alosha/xlsx"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-npm" />
          npm
        </ULink>
        <ULink
          to="https://github.com/avlisodraude/alosha-xlsx"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-github" />
          GitHub
        </ULink>
      </div>
    </div>

    <!-- Panel 1: build & download -->
    <section class="rounded-xl border border-default p-5 sm:p-6 space-y-4">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-file-spreadsheet"
          class="text-primary size-5"
        />
        <h2 class="font-semibold text-lg">
          Build &amp; download
        </h2>
      </div>
      <p class="text-sm text-muted">
        Pick the features to include, then generate a genuine, spec-valid workbook — open it in Excel,
        Numbers, Google Sheets or LibreOffice.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label
          v-for="t in toggles"
          :key="t.key"
          class="flex items-start gap-2.5 rounded-lg border border-default px-3 py-2.5 cursor-pointer hover:border-primary/40 transition-colors"
          :class="features[t.key] ? 'bg-primary/5 border-primary/40' : ''"
        >
          <input
            v-model="features[t.key]"
            type="checkbox"
            class="mt-0.5 accent-primary"
          >
          <span class="text-sm">
            <span class="font-medium block">{{ t.label }}</span>
            <span class="text-muted text-xs">{{ t.hint }}</span>
          </span>
        </label>
      </div>

      <UAlert
        v-if="buildError"
        color="error"
        icon="i-lucide-triangle-alert"
        :description="buildError"
      />

      <div class="flex justify-center pt-1">
        <UButton
          size="lg"
          icon="i-lucide-download"
          :loading="building"
          @click="generate"
        >
          Generate &amp; download .xlsx
        </UButton>
      </div>
    </section>

    <!-- Panel 2: read it back -->
    <section class="rounded-xl border border-default p-5 sm:p-6 space-y-4">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-table-2"
          class="text-primary size-5"
        />
        <h2 class="font-semibold text-lg">
          Read it back
        </h2>
      </div>
      <p class="text-sm text-muted">
        Drop the file you just generated (or any <code class="font-mono text-xs">.xlsx</code>) —
        it's parsed with <code class="font-mono text-xs">workbook.xlsx.load()</code> and rendered below.
      </p>

      <div
        role="button"
        tabindex="0"
        aria-label="Upload an .xlsx to read"
        class="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        :class="dragging ? 'border-primary bg-primary/5' : 'border-default hover:border-primary/50'"
        @click="readFileInput?.click()"
        @keydown.enter.prevent="readFileInput?.click()"
        @keydown.space.prevent="readFileInput?.click()"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onReadDrop"
      >
        <input
          ref="readFileInput"
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          class="hidden"
          @change="onReadInput"
        >
        <UIcon
          name="i-lucide-upload"
          class="size-7 mx-auto text-muted"
        />
        <p class="mt-2 font-medium text-sm">
          Drop an .xlsx here, or click to browse
        </p>
        <p class="text-xs text-muted mt-1">
          Parsed locally — nothing leaves your device
        </p>
      </div>

      <UAlert
        v-if="readError"
        color="error"
        icon="i-lucide-triangle-alert"
        :description="readError"
      />

      <div
        v-if="reading"
        class="flex items-center justify-center gap-2 text-sm text-muted py-6"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="animate-spin"
        />
        Reading…
      </div>

      <div
        v-else-if="grids.length"
        class="space-y-3"
      >
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-1.5 flex-wrap">
            <button
              v-for="(g, i) in grids"
              :key="g.name"
              type="button"
              class="px-2.5 py-1 rounded-md text-xs font-medium border transition-colors"
              :class="i === activeSheet ? 'border-primary text-primary bg-primary/5' : 'border-default text-muted hover:text-default'"
              @click="activeSheet = i"
            >
              {{ g.name }}
            </button>
          </div>
          <span class="text-xs text-muted font-mono">{{ readFileName }}</span>
        </div>

        <div class="overflow-x-auto rounded-lg border border-default">
          <table class="w-full text-sm border-collapse">
            <thead v-if="grids[activeSheet]">
              <tr>
                <th class="bg-elevated text-muted text-xs font-mono px-2 py-1.5 border-b border-r border-default w-10 text-center">
                  #
                </th>
                <th
                  v-for="(h, ci) in grids[activeSheet]!.header"
                  :key="ci"
                  class="bg-elevated text-left font-semibold px-3 py-1.5 border-b border-default whitespace-nowrap"
                >
                  {{ h || '—' }}
                </th>
              </tr>
            </thead>
            <tbody v-if="grids[activeSheet]">
              <tr
                v-for="(r, ri) in grids[activeSheet]!.rows"
                :key="ri"
                class="odd:bg-default even:bg-muted/30"
              >
                <td class="text-muted text-xs font-mono px-2 py-1.5 border-r border-default text-center">
                  {{ ri + 2 }}
                </td>
                <td
                  v-for="(cell, ci) in r"
                  :key="ci"
                  class="px-3 py-1.5 whitespace-nowrap"
                >
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Panel 3: drop-in for ExcelJS -->
    <section class="rounded-xl border border-default p-5 sm:p-6 space-y-4">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-replace"
          class="text-primary size-5"
        />
        <h2 class="font-semibold text-lg">
          Drop-in for ExcelJS
        </h2>
      </div>
      <p class="text-sm text-muted">
        Already using ExcelJS? <code class="font-mono text-xs">@alosha/xlsx/compat</code> is an
        ExcelJS-shaped facade — same <code class="font-mono text-xs">cell.type</code> numbers, same
        style setters, same <code class="font-mono text-xs">addRow</code> behaviour. For most code, the
        migration is a single line:
      </p>
      <div class="relative">
        <pre class="code-block"><span class="text-red-400">- import ExcelJS from 'exceljs'</span>
<span class="text-green-400">+ import ExcelJS from '@alosha/xlsx/compat'</span></pre>
        <button
          type="button"
          class="absolute top-2 right-2 text-muted hover:text-primary transition-colors"
          aria-label="Copy import"
          @click="copy(migrationSnippet, 'migrate')"
        >
          <UIcon
            :name="copiedKey === 'migrate' ? 'i-lucide-check' : 'i-lucide-copy'"
            class="size-4"
          />
        </button>
      </div>
      <p class="text-xs text-muted">
        A few behaviours differ (bytes instead of a Node <code class="font-mono">Buffer</code>, a dense
        0-based <code class="font-mono">worksheets</code> array, and a couple of deferred features) —
        the migration guide lists them.
      </p>
    </section>

    <!-- Panel 4: why @alosha/xlsx -->
    <section class="rounded-xl border border-default p-5 sm:p-6 space-y-4">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-scale"
          class="text-primary size-5"
        />
        <h2 class="font-semibold text-lg">
          Why @alosha/xlsx
        </h2>
      </div>
      <p class="text-sm text-muted">
        <a
          href="https://github.com/exceljs/exceljs"
          target="_blank"
          class="text-primary hover:underline"
        >ExcelJS</a>
        is excellent, MIT-licensed prior art — <code class="font-mono text-xs">@alosha/xlsx</code> is a
        clean-room rewrite that keeps the familiar API shape while modernising the internals. An
        honest, like-for-like comparison:
      </p>

      <div class="overflow-x-auto rounded-lg border border-default">
        <table class="w-full text-sm border-collapse">
          <tbody>
            <tr
              v-for="c in comparison"
              :key="c.label"
              class="border-b border-default last:border-b-0"
            >
              <th class="text-left font-medium px-3 py-2.5 align-top whitespace-nowrap bg-elevated/50 w-48">
                {{ c.label }}
              </th>
              <td class="px-3 py-2.5 align-top">
                <span class="font-mono text-primary text-xs">{{ c.xlsx }}</span>
                <span class="text-muted text-xs block mt-0.5">{{ c.note }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-muted">
        Memory figures are the library's own published
        <a
          href="https://github.com/avlisodraude/alosha-xlsx/blob/main/BENCHMARKS.md"
          target="_blank"
          class="text-primary hover:underline"
        >BENCHMARKS.md</a>
        (500,000 rows × 5 cols): the streaming writer holds ≈15.6× less peak memory than a buffered
        write while sustaining ≈1.9× the throughput.
      </p>
    </section>

    <!-- Panel 5: install + links -->
    <section class="rounded-xl border border-default p-5 sm:p-6 space-y-4 text-center">
      <h2 class="font-semibold text-lg">
        Install
      </h2>
      <button
        type="button"
        class="font-mono text-sm bg-default border border-default rounded-md px-4 py-2 hover:border-primary/50 transition-colors mx-auto inline-block"
        @click="copy('npm install @alosha/xlsx', 'install-bottom')"
      >
        <span class="text-muted">$</span> npm install @alosha/xlsx
        <UIcon
          :name="copiedKey === 'install-bottom' ? 'i-lucide-check' : 'i-lucide-copy'"
          class="ml-1 size-4 align-text-bottom"
          :class="copiedKey === 'install-bottom' ? 'text-primary' : 'text-muted'"
        />
      </button>
      <p class="text-xs text-muted">
        Ships ESM + CJS + type declarations. One runtime dependency: fflate.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm pt-1">
        <ULink
          to="https://www.npmjs.com/package/@alosha/xlsx"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-npm" />
          npm
        </ULink>
        <ULink
          to="https://github.com/avlisodraude/alosha-xlsx"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-simple-icons-github" />
          GitHub
        </ULink>
        <ULink
          to="https://github.com/avlisodraude/alosha-xlsx/blob/main/README.md"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-muted hover:text-default"
        >
          <UIcon name="i-lucide-book-open" />
          Docs
        </ULink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.code-block {
  background: var(--ui-bg-muted);
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  padding: 0.9rem 1rem;
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
  line-height: 1.5;
  overflow-x: auto;
}
</style>
