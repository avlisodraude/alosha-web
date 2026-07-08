---
title: "Introducing @alosha/xlsx: a modern Excel library for TypeScript"
description: The npm spreadsheet shelf went stale. @alosha/xlsx is an ESM-first, dependency-light .xlsx reader and writer with an ExcelJS-compatible shim and a low-memory streaming writer.
date: 2026-07-08
author: Eduardo
---

Open `npm view exceljs time` and the newest real release is 4.4.0, published in October 2023. Open the SheetJS `xlsx` package and the story is worse — nothing has shipped there since March 2022, and the maintainers now point people at their own CDN instead of npm. Two of the packages half the Node ecosystem reaches for to read or write a spreadsheet have effectively gone stale, right as CommonJS-only, callback-shaped spreadsheet libraries increasingly clash with ESM-first, fully-typed codebases.

**@alosha/xlsx** is a rewrite for that gap — a modern .xlsx reader and writer built ESM-first in TypeScript, with one runtime dependency, full type declarations, and an API shaped like the ExcelJS most Node developers already know. Credit where it's due: ExcelJS got the object model right, and this library keeps that shape rather than reinventing it.

## Everything a real workbook needs

The API is `new Workbook()`, `addWorksheet`, `getCell`, `getRow` — the surface ExcelJS code already expects, addressing cells by A1 notation or `(row, col)`:

```js
import { Workbook } from '@alosha/xlsx'

const workbook = new Workbook()
const sheet = workbook.addWorksheet('Report')

sheet.getCell('A1').value = 'Item'
sheet.getCell('B1').value = 'Qty'
sheet.getCell('B2').value = 42
sheet.getCell('B2').numFmt = '#,##0'
sheet.mergeCells('A4:B4')

const bytes: Uint8Array = await workbook.xlsx.writeBuffer()
```

Beyond the basics, it round-trips the parts of a workbook that real reports actually use: fonts, fills, borders and number formats; frozen and split panes plus auto-filter ranges; conditional formatting, from `cellIs` and `top10` to self-visualising color scales, data bars and icon sets; data validation with list dropdowns and whole/decimal/date/custom rules; cell comments with a multi-author table; and embedded images with both two-cell-range and pixel-extent anchors. `writeBuffer()` and `readWorkbookBuffer()` never touch `node:fs`, so the same code runs in Node, a browser, or an edge function.

## A streaming writer for exports that don't fit in memory

The buffered writer holds the whole workbook — every row, style and shared string — in memory before it serializes anything, which is fine until an export hits hundreds of thousands of rows and a container with a memory limit. The `stream.xlsx.WorkbookWriter`-shaped streaming writer renders and deflates each row into the output archive the moment you call `row.commit()`, so peak memory stays roughly flat regardless of row count:

```js
import { WorkbookWriter } from '@alosha/xlsx'

const wb = new WorkbookWriter({ filename: 'big-report.xlsx' })
const ws = wb.addWorksheet('Data')

for (const record of hugeDataset) {
  ws.addRow([record.id, record.name, record.amount]).commit()
}
ws.commit()
await wb.commit()
```

On a representative 500,000-row × 5-column benchmark, that's roughly **14.2× less peak memory** than the buffered writer, at about **1.9× the throughput** — and it keeps the same styles, merges, panes, data validation, conditional formatting, comments and images the buffered writer supports. Pass a `Writable` instead of a filename to stream straight to an HTTP response, or omit both to consume the writer as an `AsyncIterable<Uint8Array>`.

## Change one import

For a codebase already built on ExcelJS, `@alosha/xlsx/compat` is meant to be a same-behaviour drop-in rather than a rewrite — matching ExcelJS's `cell.type` numbers, its whole-category style-setter precedence, and the `addRow`/`row.values`/`worksheet.columns` contract:

```diff
- import ExcelJS from "exceljs"
+ import ExcelJS from "@alosha/xlsx/compat"

const workbook = new ExcelJS.Workbook()
const sheet = workbook.addWorksheet('Report')

sheet.getCell('A1').value = 'Item'
sheet.getColumn(2).width = 12
sheet.getCell('B1').font = { bold: true }

await workbook.xlsx.writeFile('report.xlsx')
```

Everything below the import line keeps working unchanged. For projects on the streaming API specifically, `stream.xlsx.WorkbookWriter` is bridged the same way, so a nightly export job can move off a stalled dependency without touching its row-writing logic.

## Open source, MIT licensed

@alosha/xlsx ships both ESM and CJS with full `.d.ts` declarations, one runtime dependency, and no `node:fs` requirement on the write/read-buffer path. It's MIT licensed and built in the open, like the rest of the Alosha portfolio — the object model ExcelJS got right, kept current for the codebases that outgrew it.

```bash
npm install @alosha/xlsx
```
