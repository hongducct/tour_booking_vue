import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    allowedHosts: [
      'localhost',
      '.test',
      'hongducct.id.vn',
      '*.hongducct.id.vn',
      'travel-booking.hongducct.id.vn',
    ],
    // hmr: {
    //   host: 'localhost', // Hoặc 'travel-booking.hongducct.id.vn' nếu chạy qua proxy
    //   port: 5173,
    //   protocol: 'ws', // Sử dụng ws thay vì wss nếu không có SSL cục bộ
    //   clientPort: 5173, // Cổng WebSocket mà client nên kết nối
    // },
    // host: '0.0.0.0', // Cho phép truy cập từ ngoài
    // port: 5173,
  },
})
