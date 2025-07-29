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
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  esbuild: {
    loader: 'tsx',  
        include: [
          'src/**/*.jsx',
          'src/**/*.tsx',
          'src/**/*.js',  
          'src/**/*.ts',   
           
        ],
  },
  build: {
    outDir: 'dist'   
  },
})