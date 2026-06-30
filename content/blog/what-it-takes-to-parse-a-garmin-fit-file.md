---
title: What it takes to parse a Garmin .FIT file
description: FIT is a binary protocol, not a text format. Semicircles, scaled fields, self-describing messages and half-counted cadence — here's what's actually inside a .fit, and what Stride absorbs so you don't have to.
date: 2026-06-30
author: Eduardo
---

When we wrote [why we built Stride](/blog/why-we-built-stride), the short version was: the file formats are the wall. GPX and TCX are at least XML — verbose, but you can open them in a text editor and see what's going on. **FIT is different.** It's the native export from most Garmin, Coros, Wahoo and Suunto watches, and it's a compact *binary* protocol. Open one in a text editor and you get line noise. This post is a tour of what's actually inside, and why "just parse the run file" is a bigger job than it looks.

## A FIT file describes its own structure

The first surprise is that there's no fixed schema you can hard-code against. A FIT file is a stream of **messages**, and they come in two flavours that alternate:

- A **definition message** says, in effect, "the next records of this type have these fields, in this order, each this many bytes, in this base type, big- or little-endian."
- A **data message** is then a tight-packed row of bytes that only makes sense if you've read and remembered the definition that preceded it.

So you can't read field three of a record until you've parsed the definition that told you field three is a 4-byte unsigned integer at offset seven. A decoder has to carry that state forward as it walks the stream. Miss it, or get the endianness wrong, and every value after that point is garbage. This is before you've computed a single kilometre.

## Coordinates are stored as semicircles

GPS positions in FIT aren't degrees. They're **semicircles** — signed 32-bit integers where the full `int32` range maps onto ±180°. To get a latitude you can put on a map, you convert:

```js
const SEMICIRCLE_TO_DEG = 180 / 2 ** 31
const lat = rawLat * SEMICIRCLE_TO_DEG
```

It's a one-line conversion *once you know it exists* — and a silent disaster if you don't. Forget the factor and your runner's track plots somewhere in the Atlantic, or your distances come out off by orders of magnitude. There's no error; the numbers are just wrong.

## Half the fields are scaled and offset

Most numeric fields aren't raw values either. The FIT profile assigns each one a **scale** and an **offset**, so the real value is `raw / scale - offset`. Enhanced altitude, speed, distance and many others each carry their own pair. Get a scale wrong and your elevation gain is out by a factor of five, or your pace is a decimal point off — again, with no exception to tell you.

## Cadence is counted per foot

This one bites everyone. FIT records running cadence as **revolutions per minute — one foot.** Athletes, Garmin Connect and Strava all talk in **steps per minute**, which is double. So you have to know to multiply:

```js
// FIT stores running cadence as RPM (one foot); double to steps/min,
// and fold in the fractional part when the device provides it.
point.cadence = Math.round((cad + frac) * 2)
```

There's a separate `fractional_cadence` field for the half-step, so a faithful parser reads two fields and combines them. Skip the doubling and every cadence number you show is half what your users expect — plausible enough that you might not notice in testing, wrong enough to undermine trust.

## And then the rest

That's the highlight reel. A complete decoder also has to handle the file header and CRC, the FIT epoch (seconds since 1989-12-31, not the Unix epoch), compressed-timestamp record headers, developer-defined fields, and records with no GPS fix that you have to skip rather than plot at `(0, 0)`. None of it is conceptually hard. All of it is the kind of detail that's invisible until it's wrong, and that you only discover from a device you didn't happen to test.

## What Stride does with all of this

Stride leans on the official [`@garmin/fitsdk`](https://www.npmjs.com/package/@garmin/fitsdk) for the byte-level decode — there's no good reason to re-implement Garmin's own message profile — and then does the normalisation on top: semicircles to degrees, cadence to steps per minute, enhanced altitude preferred over the coarse field, GPS-less records dropped. The output is the **same normalised `Activity`** you get from a GPX or TCX file, so the rest of your code never branches on format:

```js
import { parse, analyze } from '@alosha/stride'

const activity = parse('./morning-run.fit')  // or .gpx, or .tcx — auto-detected
const stats = analyze(activity)              // distance, pace, splits, HR zones
```

You can try it end-to-end, in your browser, on the [live demo](https://stride.alosha.dev/demo) — drop in a real `.fit` and watch it become charts. Nothing is uploaded; the file is parsed entirely client-side.

The point isn't that any one of these conversions is difficult. It's that there are a dozen of them, each silent when wrong, and you inherit all of them the moment you decide to parse the file yourself. Stride is where we already paid that cost.
