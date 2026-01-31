import { defineConfig } from 'vitest/config'
import * as path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      reporter: ['text', 'lcov'],
      100: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
    include: ['tests/**/*.test.*', 'app/**/(*.)test.*', 'lib/**/(*.)test.*'],
  },
})
