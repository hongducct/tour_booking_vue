import { defineStore } from 'pinia'
import axios from 'axios'

export const useTourStore = defineStore('tour', {
  state: () => ({
    tours: [],
    loading: false,
    lastFetched: null,
  }),

  actions: {
    async fetchTours() {
      const cacheDuration = 24 * 60 * 60 * 1000 // 24 giờ
      if (this.lastFetched && Date.now() - this.lastFetched < cacheDuration) {
        return // Dùng cache nếu chưa hết hạn
      }

      await this._fetchTours()
    },

    async refreshTours() {
      // Làm mới danh sách tour, bỏ qua cache
      await this._fetchTours()
    },

    async _fetchTours() {
      this.loading = true
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        let allTours = []
        let currentPage = 1
        let lastPage = 1

        do {
          const response = await axios.get(`${apiBaseUrl}/tours?page=${currentPage}&per_page=50`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
              'Content-Type': 'application/json',
            },
          })
          allTours = [...allTours, ...response.data.data]
          lastPage = response.data.last_page
          currentPage++
        } while (currentPage <= lastPage)

        this.tours = allTours
        this.lastFetched = Date.now()
      } catch (err) {
        console.error('Lỗi khi lấy danh sách tour:', err)
        throw err // Để component xử lý lỗi
      } finally {
        this.loading = false
      }
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'tourStore',
        storage: localStorage,
      },
    ],
  },
})
