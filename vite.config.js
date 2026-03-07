import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // REPLACE 'design-portfolio' with your exact GitHub repository name
  base: '/design-portfolio/',

  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Perf: three-vendor removed — selective imports enable tree-shaking
          'motion-vendor': ['framer-motion'],
          'scroll-vendor': ['lenis']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  esbuild: {
    legalComments: 'none'
  }
})