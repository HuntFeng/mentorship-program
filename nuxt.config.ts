// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/mentorship-program/'
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/scripts',
    '@nuxtjs/supabase',
  ],
  css: ['~/assets/css/main.css'],
  supabase: {
    redirect: false,
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY || '',
    secreteKey: process.env.NUXT_SUPABASE_SECRET_KEY || '',
  },
})
