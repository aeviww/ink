import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const alias = {
  '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
  '~~': fileURLToPath(new URL('./', import.meta.url)),
}

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.test.ts'],
        },
      },
      {
        resolve: { alias },
        test: {
          name: 'e2e',
          environment: 'node',
          include: ['tests/e2e/**/*.test.ts'],
          testTimeout: 30_000,
          hookTimeout: 300_000,
        },
      },
    ],
  },
})
