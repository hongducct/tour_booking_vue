import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useMainStore = defineStore('main', () => {
  // Admin state
  const admin = ref({
    id: null,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: null,
    avatar: null,
    admin_status: 'active',
  })

  const adminToken = ref(null)

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const history = ref([])

  // Computed property for admin avatar
  const adminAvatar = computed(() =>
    admin.value.avatar
      ? admin.value.avatar
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.value.email.replace(
          /[^a-z0-9]+/gi,
          '-',
        )}`,
  )

  // Initialize admin state from localStorage
  const initializeAdmin = () => {
    const storedToken = localStorage.getItem('adminToken')
    const storedAdmin = localStorage.getItem('admin')
    if (storedToken) {
      adminToken.value = storedToken
    }
    if (storedAdmin) {
      try {
        admin.value = JSON.parse(storedAdmin)
      } catch (e) {
        console.error('Failed to parse stored admin data:', e)
      }
    }
  }

  // Fetch admin profile from backend
  const fetchAdminProfile = async () => {
    if (!adminToken.value) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/profile`, {
        headers: {
          Authorization: `Bearer ${adminToken.value}`,
        },
      })
      setAdmin(response.data)
    } catch (error) {
      console.error('Failed to fetch admin profile:', error)
      clearAdmin() // Clear if token is invalid
    }
  }

  // Call initializeAdmin on store creation
  initializeAdmin()

  // Admin actions
  function setAdmin(payload) {
    admin.value = {
      id: payload.id || admin.value.id,
      username: payload.username || admin.value.username,
      email: payload.email || admin.value.email,
      first_name: payload.first_name || admin.value.first_name,
      last_name: payload.last_name || admin.value.last_name,
      phone_number: payload.phone_number || admin.value.phone_number,
      avatar: payload.avatar || admin.value.avatar,
      admin_status: payload.admin_status || admin.value.admin_status,
    }
    if (payload.token) {
      adminToken.value = payload.token
      localStorage.setItem('adminToken', payload.token)
    }
    // Persist admin data to localStorage
    localStorage.setItem('admin', JSON.stringify(admin.value))
  }

  function clearAdmin() {
    admin.value = {
      id: null,
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone_number: null,
      avatar: null,
      admin_status: 'active',
    }
    adminToken.value = null
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
  }

  // Sample data actions
  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // Getters
  const isAdminAuthenticated = computed(() => !!adminToken.value)
  const adminFullName = computed(() => `${admin.value.first_name} ${admin.value.last_name}`)

  return {
    admin,
    adminToken,
    adminAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    setAdmin,
    clearAdmin,
    fetchAdminProfile,
    fetchSampleClients,
    fetchSampleHistory,
    isAdminAuthenticated,
    adminFullName,
  }
})
