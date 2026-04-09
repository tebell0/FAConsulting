import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // '@' resolves to the VueFrontend root so imports like
      // '@/services/api.js', '@/pages/...', '@/assets/...' all work.
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
})
