import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(),
  ],
  server: {
    host: true, // Expose to local network
    // Set aggressive caching for image assets during development
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  build: {
    // Increase chunk warning limit since we have heavy 3D dependencies
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/@react-three')) return 'react-three';
          if (id.includes('node_modules/framer-motion')) return 'framer';
        },
      },
    },
  },
})
