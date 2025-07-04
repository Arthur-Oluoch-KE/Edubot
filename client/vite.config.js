import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// tailwindcss configuration
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  esbuild: {
    loader: 'tsx', // Or 'jsx' depending on your needs
        include: [
          'src/**/*.jsx',
          'src/**/*.tsx',
          'src/**/*.js', // Add this line to include .js files
          'src/**/*.ts',  // Add this line to include .ts files
          // ... other paths if necessary
        ],
  },
})