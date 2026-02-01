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
      statements: 75,
      branches: 60,
      functions: 70,
      lines: 75,
    },
    include: ['tests/**/*.test.*', 'app/**/(*.)test.*', 'lib/**/(*.)test.*'],
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any) 
