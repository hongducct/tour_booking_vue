import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: { name: '', avatar: '' },
    isLoading: false,
  }),
  actions: {
    async checkAuth() {
      if (this.isLoggedIn) return
      const token = localStorage.getItem('userToken')
      const cachedUser = localStorage.getItem('userData')

      if (cachedUser) {
        this.user = JSON.parse(cachedUser)
        this.isLoggedIn = true
        return
      }

      if (!token) return

      this.isLoading = true
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL
        const res = await axios.get(`${baseUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.user = res.data
        this.isLoggedIn = true
        localStorage.setItem('userData', JSON.stringify(res.data))
      } catch (err) {
        console.error('Auth check failed', err)
        this.isLoggedIn = false
        this.user = { name: '', avatar: '' }
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      this.isLoggedIn = false
      this.user = { name: '', avatar: '' }
      localStorage.removeItem('userToken')
      localStorage.removeItem('userData')
      localStorage.removeItem('rememberedLogin')
    },
  },
})
