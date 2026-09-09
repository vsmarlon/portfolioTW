import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@mui/x-data-grid')) return 'mui-data-grid'
          if (id.includes('@mui/') || id.includes('@emotion/')) return 'mui'
        },
      },
    },
  },
})
