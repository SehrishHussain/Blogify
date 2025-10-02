import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env vars from .env files + system
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Make sure VITE_USE_MOCK is always defined (stringified because Vite replaces code at build time)
      'import.meta.env.VITE_USE_MOCK': JSON.stringify(env.VITE_USE_MOCK || 'false'),
    },
    base: process.env.VITE_BASE_PATH || "/Blogify"
  }
})
