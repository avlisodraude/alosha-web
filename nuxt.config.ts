// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
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
      exclude: ['/', '/login', '/docs', '/reset-password']
    }
  }
})
