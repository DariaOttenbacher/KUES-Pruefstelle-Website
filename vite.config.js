import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/KUES-Pruefstelle-Website/',

  plugins: [
    tailwindcss(),
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kontakt: resolve(__dirname, 'kontakt.html'),
        leistungen: resolve(__dirname, 'leistungen.html'),
        termin: resolve(__dirname, 'termin.html'),
        profile: resolve(__dirname, 'profile.html'),
      },
    },
  },
})