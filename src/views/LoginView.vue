<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const form = reactive({
  login: '', // username hoặc email
  password: '',
})
const loading = ref(false)
const error = ref('')

const submit = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.post(`${baseUrl}/user/login`, {
      login: form.login,
      password: form.password,
    })

    localStorage.setItem('userToken', res.data.token)
    router.push(localStorage.getItem('redirectAfterLogin')) // hoặc bất cứ route nào bạn muốn
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-blue-500">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center mb-4 text-gray-700">User Login</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-600">Username or Email</label>
          <input
            v-model="form.login"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-600">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div v-if="error" class="mb-2 text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>
