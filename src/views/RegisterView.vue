<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const form = reactive({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  first_name: '',
  last_name: '',
  phone_number: '',
})
const loading = ref(false)
const error = ref('')
const fieldErrors = reactive({})

const submit = async () => {
  loading.value = true
  error.value = ''
  Object.keys(fieldErrors).forEach(key => (fieldErrors[key] = ''))

  try {
    const res = await axios.post(`${baseUrl}/user/register`, form)
    console.log(res.data)
    localStorage.setItem('userToken', res.data.token)
    router.push('/')
  } catch (err) {
    if (err.response && err.response.data) {
      const data = err.response.data
      error.value = data.message || 'Register failed. Please try again.'

      if (data.errors) {
        Object.keys(data.errors).forEach(key => {
          fieldErrors[key] = data.errors[key][0]
        })
      }
    } else {
      error.value = 'Register failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-500">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center mb-4 text-gray-700">User Register</h2>

      <form @submit.prevent="submit">
        <!-- <div v-if="error" class="text-red-500 text-sm mb-4 text-center">
          {{ error }}
        </div> -->

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Username</label>
          <input v-model="form.username" type="text" class="w-full border rounded px-3 py-2" required />
          <div v-if="fieldErrors.username" class="text-red-500 text-xs mt-1">{{ fieldErrors.username }}</div>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full border rounded px-3 py-2" required />
          <div v-if="fieldErrors.email" class="text-red-500 text-xs mt-1">{{ fieldErrors.email }}</div>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">First Name</label>
          <input v-model="form.first_name" type="text" class="w-full border rounded px-3 py-2" required />
          <div v-if="fieldErrors.first_name" class="text-red-500 text-xs mt-1">{{ fieldErrors.first_name }}</div>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Last Name</label>
          <input v-model="form.last_name" type="text" class="w-full border rounded px-3 py-2" required />
          <div v-if="fieldErrors.last_name" class="text-red-500 text-xs mt-1">{{ fieldErrors.last_name }}</div>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Phone Number</label>
          <input v-model="form.phone_number" type="text" class="w-full border rounded px-3 py-2" required />
          <div v-if="fieldErrors.phone_number" class="text-red-500 text-xs mt-1">{{ fieldErrors.phone_number }}</div>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Password</label>
          <input v-model="form.password" type="password" class="w-full border rounded px-3 py-2" required />
          <div v-if="fieldErrors.password" class="text-red-500 text-xs mt-1">{{ fieldErrors.password }}</div>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Confirm Password</label>
          <input v-model="form.password_confirmation" type="password" class="w-full border rounded px-3 py-2" required />
          <div v-if="fieldErrors.password_confirmation" class="text-red-500 text-xs mt-1">{{ fieldErrors.password_confirmation }}</div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>
