import { defineConfig } from 'vite'

export default defineConfig({
  base: '/2D-port-game/',
  build: {
    minify: 'terser',
  },
})
