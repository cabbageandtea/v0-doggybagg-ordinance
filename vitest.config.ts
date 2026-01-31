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
      provider: 'v8',
      reporter: ['text', 'lcov'],
      statements: 70,
      branches: 60,
      functions: 60,
      lines: 70,
    },
    include: ['tests/**/*.test.*', 'app/**/(*.)test.*', 'lib/**/(*.)test.*'],
  },
})
