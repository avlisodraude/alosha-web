---
title: "Introducing eu-validate: offline EU identifier validation"
description: Checksum-accurate VAT, IBAN, BSN and KvK validation that runs entirely on your own machine — no network calls, no dependencies.
date: 2026-06-15
author: Eduardo
---

Validating European business and personal identifiers usually means one of two bad options. You either write a regex that checks the *shape* of a VAT number but not whether it's actually valid, or you call a remote service like VIES and inherit its latency, rate limits, and downtime. Neither is a good fit for the place this validation usually belongs: a form submission, a billing flow, a data import.

So we built **eu-validate** — a small, dependency-free library that validates EU identifiers correctly and entirely offline.

## Checksums, not just regexes

The difference between a regex and real validation is the check digit. A regex will happily accept `NL999999999B01`; eu-validate runs the actual country-specific checksum and rejects it. The package covers VAT checksum rules for 14 EU member states, IBAN validation via the ISO 13616 mod-97 algorithm with per-country length rules, Dutch BSN (the 11-proef), KvK company numbers, and postal codes for several countries.

Every validator returns the same shape — a result object with a `valid` boolean and an `errors` array — so you can branch on the outcome or surface a specific reason to the user:

```js
import { validateVAT, validateIBAN, validateBSN } from '@alosha/eu-validate'

validateVAT('NL810433941B01').valid      // → true
validateIBAN('NL91ABNA0417164300').valid // → true
validateBSN('111222334').errors          // → ['CHECKSUM_FAILED']
```

## Why offline matters

Running locally isn't just faster — it's a different risk profile. There's no third-party endpoint that can go down in the middle of your checkout, no rate limit to budget around, and no identifier data leaving your servers to be validated. For a lot of products handling EU customers, that last point alone is the reason to keep validation in-process.

The package is written in TypeScript, ships ESM and full types, is tree-shakeable, and has zero runtime dependencies. It works the same in Node and in the browser, which is why the [live demo](https://eu-validate.alosha.dev/demo) can run every check client-side without uploading anything.

## Open source first

Like everything in the Alosha portfolio, eu-validate is MIT licensed and built in the open. VIES round-trips and a hosted batch tier may come later for teams that want them, but the core — the checksums that make the difference between "looks right" and "is right" — stays free.

You can install it today:

```bash
npm install @alosha/eu-validate
```
