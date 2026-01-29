import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // REPLACE 'design-portfolio' with your exact GitHub repository name
  base: '/design-portfolio/',

  plugins: [react()],
  build: {
    target: 'es2020', // Modern browsers for smaller bundle
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
          'three-core': ['three'],
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],
          'motion-vendor': ['framer-motion'],
          'scroll-vendor': ['lenis']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Three.js is large by nature
  },
  esbuild: {
    legalComments: 'none'
  }
})