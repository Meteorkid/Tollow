import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': './src',
      '@core': './src/core',
      '@features': './src/features',
      '@shared': './src/shared',
      '@utils': './src/utils',
      '@hooks': './src/hooks',
      '@styles': './src/styles',
      '@types': './src/types',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 4000,
    open: true,
  },
})
