// import './assets/main.css'
import './style.css'
import './css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { initWebSocket } from "./services/websocket"

// Khởi tạo WebSocket trước khi mount ứng dụng
initWebSocket()

import { useMainStore } from '@/stores/main.js'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Init Pinia

// Create Vue app
createApp(App).use(router).use(pinia).mount('#app')

// Init main store
const mainStore = useMainStore(pinia)

// Fetch sample data
mainStore.fetchSampleClients()
mainStore.fetchSampleHistory()

// Set document title from route meta
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle
})
const defaultDocumentTitle = 'Travel Booking'
