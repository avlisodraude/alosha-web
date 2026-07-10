---
title: Why we built Stride
description: Parsing a run sounds simple until you meet GPX, TCX and FIT in the wild. Stride turns any of them into clean metrics and charts with zero config.
date: 2026-06-16
author: Eduardo
---

If you want to do anything with your own running data, you hit the same wall almost immediately: the file formats. A Garmin watch exports FIT, Strava hands you GPX, an older device gives you TCX, and each one encodes distance, time, heart rate, cadence and elevation slightly differently. Before you can compute a single split, you've written a parser — and then a second one, and a third.

**Stride** exists so you don't have to. It parses GPX, TCX and FIT files behind one API, auto-detects the format, and gives you back clean, comparable metrics.

## One call, all the metrics

The goal was to make the common case trivial. You point Stride at a file and get an activity; you pass that activity to `analyze` and get everything a running app actually shows — distance, moving and elapsed time, average and best-kilometre pace, elevation gain and loss, heart-rate zones, cadence, and per-kilometre splits — in a single object.

```js
import { parse, analyze } from '@alosha/stride'
import { paceChartConfig } from '@alosha/stride/charts'   // charts are opt-in
import { Chart } from 'chart.js/auto'

const activity = parse('./morning-run.fit')   // format auto-detected
const stats = analyze(activity)
new Chart(canvas, paceChartConfig(activity, stats))
```

## Charts you own

Plenty of libraries either give you raw numbers or lock you into their own rendering. Stride does neither. It returns ready-made **Chart.js configurations** — for pace, elevation, heart rate, HR zones and splits — and hands you the canvas. You decide where and how they render, in the browser or in a Node canvas, and the charts stay yours to restyle. Metric and imperial units switch with a single option, so labels and formatters follow whichever your users expect.

## From the terminal, too

Not every use is a dashboard. Stride ships a CLI, so you can get a full activity summary without writing any code:

```bash
npx stride analyze morning-run.gpx
```

You can try the full thing — parsing and charts — in your browser on the [live demo](https://stride.alosha.dev/demo). Nothing is uploaded; the file is parsed entirely client-side.

## Open source, zero config

Stride is MIT licensed, dependency-light, and built to drop into an existing project without ceremony. It's the running-data layer we wanted ourselves — and like the rest of the Alosha portfolio, the core is free and open.

```bash
npm install @alosha/stride
```
