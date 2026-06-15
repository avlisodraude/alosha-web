/**
 * Regenerate the browser bundle used by the /demo eu-validate playground.
 *
 * The demo loads public/lib/eu-validate.js as a global (window.EuValidate).
 * That file is a GENERATED artifact — do not edit it by hand. Run this script
 * whenever @alosha/eu-validate is bumped so the demo always reflects exactly
 * what `npm i @alosha/eu-validate` ships, instead of silently drifting from it.
 *
 *   pnpm add -D esbuild @alosha/eu-validate   # one-time
 *   pnpm gen:eu-validate
 *
 * It bundles the installed package (resolved from node_modules) into an IIFE
 * exposing every named export on the global `EuValidate`, and stamps the
 * resolved version into the banner.
 */
import { build } from 'esbuild'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const outfile = resolve(here, '../public/lib/eu-validate.js')

// Read the package version straight from node_modules — the package's exports
// map doesn't expose ./package.json, so require()/import of it is blocked.
const pkgJsonPath = resolve(here, '../node_modules/@alosha/eu-validate/package.json')
const version = JSON.parse(readFileSync(pkgJsonPath, 'utf8')).version

await build({
  // Re-export everything from the installed package as the bundle entry.
  stdin: {
    contents: `export * from '@alosha/eu-validate'`,
    resolveDir: here,
    loader: 'ts'
  },
  bundle: true,
  format: 'iife',
  globalName: 'EuValidate',
  platform: 'browser',
  minify: true,
  outfile,
  banner: {
    js: `/* GENERATED — do not edit. Built from @alosha/eu-validate@${version} via scripts/gen-eu-validate-bundle.mjs */`
  }
})

console.log(`✓ Wrote ${outfile} from @alosha/eu-validate@${version}`)
