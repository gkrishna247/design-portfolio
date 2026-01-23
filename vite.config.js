import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Use terser for better minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate heavy libraries into their own chunks
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'motion-vendor': ['framer-motion'],
          'scroll-vendor': ['lenis']
        }
      }
    },
    // Increase warning limit since Three.js is inherently large
    chunkSizeWarningLimit: 600
  },
  // Remove legal comments to reduce bundle size
  esbuild: {
    legalComments: 'none'
  }
})
