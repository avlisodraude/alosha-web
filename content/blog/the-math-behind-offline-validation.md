---
title: "The math behind offline validation: Modulo 97 and the 11-proef"
description: A regex checks the shape of an IBAN or a BSN. The check digit proves it could be real. Here's the arithmetic that makes offline validation possible — worked out by hand.
date: 2026-06-29
author: Eduardo
---

When [eu-validate](https://eu-validate.alosha.dev) rejects `NL999999999B01` or accepts `NL91ABNA0417164300`, it isn't calling a server and it isn't matching a fancier regex. It's doing arithmetic. Every well-designed identifier — IBANs, VAT numbers, the Dutch BSN — carries a *check digit*: one or more digits computed from the rest of the number, specifically so that a typo or a fabricated value almost always fails the sum.

That single idea is what lets you validate these numbers correctly with zero network calls. A regex can tell you a string is *shaped* like an IBAN. The checksum is the difference between "looks right" and "is arithmetically consistent with being real." This post works through the two algorithms that do most of the heavy lifting: **Modulo 97** for IBANs, and the **11-proef** (eleven-test) for the Dutch BSN.

## The check digit, in one sentence

A check digit is a small amount of redundancy baked into a number. You take all the other digits, run a fixed calculation, and the result *is* the check digit (or determines whether the whole thing is valid). Change any one digit by accident and the calculation no longer agrees — so the error is caught before it ever reaches your database.

The art is in choosing a calculation that catches the mistakes humans actually make: a wrong digit, or two adjacent digits swapped. A plain sum-of-digits catches the first but not the second (1+2 and 2+1 are equal). The two schemes below are chosen precisely because they catch both.

## Modulo 97: how IBANs check themselves

An IBAN is a country code, two check digits, and the domestic account number (the BBAN). The validation rule from ISO 13616 is deceptively small:

1. Move the first four characters (country code + check digits) to the **end** of the string.
2. Replace every letter with two digits: `A` = 10, `B` = 11, … `Z` = 35.
3. Interpret the whole thing as one big integer and take it **mod 97**.
4. A valid IBAN gives a remainder of exactly **1**.

Let's do a real one: `DE89370400440532013000` (a valid German IBAN).

Move `DE89` to the end:

```
370400440532013000DE89
```

Substitute `D` = 13 and `E` = 14:

```
370400440532013000131489
```

Now take that 24-digit number mod 97. You don't need bignum support to do it — you fold digit by digit, carrying the running remainder, which is exactly how the library does it:

```js
function mod97(numericString) {
  let remainder = 0
  for (const ch of numericString) {
    remainder = (remainder * 10 + (ch.charCodeAt(0) - 48)) % 97
  }
  return remainder
}

mod97('370400440532013000131489') // → 1  ✅ valid
```

It comes out to **1**, so the IBAN checks out. The same procedure works with letters inside the account number too — `NL91ABNA0417164300` rearranges to `ABNA0417164300NL91`, expands to `101123100417164300232191`, and also reduces to **1**.

Now fat-finger the last digit, `...4300` → `...4301`:

```js
mod97(/* NL91ABNA0417164301 rearranged + expanded */) // → 28  ❌ invalid
```

The remainder jumps to 28, nowhere near 1, and the number is rejected. That's the whole point of choosing 97: because it's a prime close to 100, *every* single-digit error and *every* transposition of two digits changes the remainder, so essentially all the common typos are caught. The two check digits in the IBAN are simply whatever values make the final remainder land on 1.

## The 11-proef: how the Dutch BSN checks itself

The BSN (Burgerservicenummer) is nine digits, and it uses a different but related trick: a **weighted** sum that must be divisible by 11. Each position has a weight — `9, 8, 7, 6, 5, 4, 3, 2, -1` from left to right (note the last one is negative) — and the sum of digit × weight has to be a multiple of 11.

Take `111222333`:

```
1×9  1×8  1×7  2×6  2×5  2×4  3×3  3×2  3×-1
 9  + 8  + 7  +12  +10  + 8  + 9  + 6  + -3   =  66
```

66 is divisible by 11 (66 = 6 × 11), so the BSN is valid. In code:

```js
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2, -1]

function elfproef(bsn) {
  const digits = [...bsn].map(Number)
  const sum = digits.reduce((acc, d, i) => acc + d * WEIGHTS[i], 0)
  return sum % 11 === 0
}

elfproef('111222333') // → true   (sum 66)
elfproef('111222334') // → false  (sum 65)
```

Change just the final digit from 3 to 4 and the sum drops to 65, which leaves a remainder of 10 — not divisible by 11 — so `111222334` is rejected.

Why weights instead of a flat sum? Because the weights are all different, swapping two adjacent digits changes the total (you'd be multiplying those two digits by each other's weights). A naive sum would treat `12` and `21` as identical; the weighting makes transpositions visible, which is exactly the error a person typing a nine-digit number is most likely to make.

## Why do this in-process at all

None of this requires a network. The arithmetic above runs in microseconds, which is the real argument for keeping validation local. A round-trip to a government lookup service like VIES adds hundreds of milliseconds to a checkout, can rate-limit or 5xx at the worst possible moment, and — for identifiers like a BSN or IBAN — ships personal data off your infrastructure to be checked. (We laid out that [risk trade-off in more detail](https://eu-validate.alosha.dev) on the eu-validate site.)

A checksum can't tell you a number is *registered* to a real company or person — that genuinely needs a register lookup. But it can reject everything that *can't* be real, instantly and privately, so the slow online check only ever runs on input that already passed the math. That filtering is most of the value, and it costs nothing per call.

All of this — mod-97 for IBANs, the 11-proef for BSN, the country-specific VAT checksums, and more — is implemented and tested in [eu-validate](https://www.npmjs.com/package/@alosha/eu-validate), MIT licensed and dependency-free:

```bash
npm install @alosha/eu-validate
```

And if you need realistic valid and invalid numbers to seed your own test suite, the [generator](https://eu-validate.alosha.dev/generator) produces them straight from these same algorithms.
