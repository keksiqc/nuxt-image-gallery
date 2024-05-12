// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    'nuxt-auth-utils'
  ],

  nitro: {
    storage: {
      blob: true
    }
  },

  ui: {
    icons: ['simple-icons']
  },

  experimental: {
    viewTransition: true
  },

  devtools: { enabled: true },

  eslint: {
    config: {
      rules: {
        'quotes': ['error', 'single'],
        'comma-dangle': ['error', 'never']
      }
    }
  }
})

