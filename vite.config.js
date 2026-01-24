import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // REPLACE 'design-portfolio' with your exact GitHub repository name
  base: '/design-portfolio/',

  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
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