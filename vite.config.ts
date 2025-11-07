/// <reference types="vitest" />
// vite.config.ts — wires up Vite with React, Chakra aliases, and Vitest hooks.
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const repoName = 'table2table'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_DEPLOY_BASE ?? `/${repoName}/`,
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    pool: 'threads',
  },
})
