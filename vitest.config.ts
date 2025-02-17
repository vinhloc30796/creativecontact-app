import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'drizzle-orm': path.resolve(__dirname, './node_modules/drizzle-orm'),
      '@payload-config': path.resolve(__dirname, './app/payload.config.mts')
    }
  }
})