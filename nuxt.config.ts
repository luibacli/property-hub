export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false, // enable after initial setup
  },

  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
    domains: ['images.unsplash.com'],
    alias: {
      unsplash: 'https://images.unsplash.com',
    },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production-32chars',
    public: {
      appName: 'Property Hub',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    preset: process.env.NITRO_PRESET || 'node-server',
    compressPublicAssets: true,
  },

  routeRules: {
    // Public listing pages: serve fresh but revalidate in background (SWR)
    '/listings': { swr: 60 },
    '/listings/rent': { swr: 60 },
    '/listings/sale': { swr: 60 },
    '/listings/**': { swr: 30 },
    '/offers': { swr: 60 },
    '/': { swr: 120 },
    '/api/**': { cors: false },
  },

  app: {
    head: {
      titleTemplate: '%s — Property Hub',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Discover premium properties for rent and sale across the US.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
})
