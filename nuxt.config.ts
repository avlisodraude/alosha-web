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

  // Multi-domain: alosha.dev = hub, pixsqueeze.alosha.dev = PixSqueeze, monitor.alosha.dev = Monitor.
  // Override per environment with NUXT_PUBLIC_HUB_URL / NUXT_PUBLIC_PRODUCT_URL /
  // NUXT_PUBLIC_MONITOR_URL / NUXT_PUBLIC_FORCE_SITE (hub|product|monitor for local dev).
  runtimeConfig: {
    public: {
      hubUrl: 'https://alosha.dev',
      productUrl: 'https://pixsqueeze.alosha.dev',
      monitorUrl: 'https://monitor.alosha.dev',
      strideUrl: 'https://stride.alosha.dev',
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

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      // '/' + all public hub routes must be excluded from the auth guard.
      exclude: [
        '/',
        '/login',
        '/docs',
        '/demo',
        '/reset-password',
        '/products',
        '/products/**',
        '/open-source',
        '/about',
        '/contact',
        '/blog',
        '/blog/**'
      ]
    }
  }
})
