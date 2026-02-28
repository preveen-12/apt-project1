import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// This tells Vite to handle all the Tailwind magic automatically
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})