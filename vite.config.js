import { defineConfig } from 'vite'

export default defineConfig({
  base: './2d-port-game/',
  build: {
    minify: 'terser',
  },
})
