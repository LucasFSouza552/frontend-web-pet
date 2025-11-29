import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.test.*',
        '**/*.spec.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/shared/api'),
      '@assets': path.resolve(__dirname, './src/shared/assets'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@styles': path.resolve(__dirname, './src/shared/styles'),
      '@interfaces': path.resolve(__dirname, './src/shared/interfaces'),
      '@models': path.resolve(__dirname, './src/shared/models'),
      '@types': path.resolve(__dirname, './src/shared/types'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@contexts': path.resolve(__dirname, './src/shared/contexts'),
      '@features': path.resolve(__dirname, './src/features'),
      '@Error': path.resolve(__dirname, './src/shared/Error')
    }
  }
})

