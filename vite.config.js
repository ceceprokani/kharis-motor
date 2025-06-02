import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // server: {
  //   host: true, // bisa diganti jadi '0.0.0.0' untuk akses dari IP LAN
  //   port: 5173, // atau sesuaikan
  //   strictPort: true,
  //   origin: 'https://fbaa-103-113-50-210.ngrok-free.app'
  // },
})
