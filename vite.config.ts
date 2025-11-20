import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
