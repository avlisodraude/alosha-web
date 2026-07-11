// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/supabase'
  ],

  devtools: {
    enabled: false
  },

  app: {
    head: {
      script: [
        // Vercel Web Analytics (no-op until enabled in the Vercel dashboard)
        { src: '/_vercel/insights/script.js', defer: true }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  // Multi-domain: alosha.dev = hub, pixsqueeze.alosha.dev = PixSqueeze, monitor.alosha.dev = Monitor,
  // stride.alosha.dev = Stride, eu-validate.alosha.dev = eu-validate, vue-select.alosha.dev = vue-select,
  // xlsx.alosha.dev = xlsx. The legacy entries below override per environment with
  // NUXT_PUBLIC_HUB_URL / NUXT_PUBLIC_PRODUCT_URL / NUXT_PUBLIC_MONITOR_URL / NUXT_PUBLIC_STRIDE_URL /
  // NUXT_PUBLIC_EU_VALIDATE_URL; newer products (vue-select, xlsx) use the registry in app/utils/products.ts.
  // Override app domain detection for local dev with NUXT_PUBLIC_FORCE_SITE (hub|product|monitor|stride|eu-validate|vue-select|xlsx).
  runtimeConfig: {
    // Server-only. Override in prod via env: RESEND_API_KEY / NUXT_CONTACT_TO / NUXT_CONTACT_FROM
    resendApiKey: '',
    contactTo: 'hello@alosha.dev',
    contactFrom: 'Alosha Contact <noreply@alosha.dev>',
    public: {
      hubUrl: 'https://alosha.dev',
      productUrl: 'https://pixsqueeze.alosha.dev',
      monitorUrl: 'https://monitor.alosha.dev',
      strideUrl: 'https://stride.alosha.dev',
      euValidateUrl: 'https://eu-validate.alosha.dev',
      forceSite: ''
    }
  },

  compatibilityDate: '2025-01-15',

  typescript: {
    typeCheck: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Self-hosted Google Fonts (@nuxt/fonts, bundled with @nuxt/ui). 'Public Sans'
  // is auto-detected from main.css; the families below back the "How we build"
  // editorial section — declared explicitly so its weights + the Instrument
  // Serif italic are all fetched.
  fonts: {
    families: [
      { name: 'Instrument Serif', provider: 'google', weights: [400], styles: ['normal', 'italic'] },
      { name: 'Archivo', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'Space Grotesk', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 700] }
    ]
  },

  supabase: {
    // Typed database client: makes serverSupabaseServiceRole()/useSupabaseClient()
    // return SupabaseClient<Database> so table inserts are type-checked.
    // (~ = app/ srcDir; keep in sync with supabase/migrations/*.)
    types: '~/types/database.types.ts',
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      // '/' + all public hub routes must be excluded from the auth guard.
      exclude: [
        '/',
        '/login',
        '/docs',
        '/demo',
        '/generator',
        '/reset-password',
        '/products',
        '/products/**',
        '/open-source',
        '/about',
        '/support',
        '/contact',
        '/blog',
        '/blog/**',
        '/privacy',
        '/terms'
      ]
    }
  }
})
