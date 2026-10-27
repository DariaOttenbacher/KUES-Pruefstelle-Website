import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base:'/KUES-Pruefstelle-Website/',
  plugins: [
    tailwindcss(),
  ],
})