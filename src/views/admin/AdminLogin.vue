<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useMainStore } from '@/stores/main'
import {
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const mainStore = useMainStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const form = reactive({
  username: '',
  password: '',
})
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const submit = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.post(`${baseUrl}/admin/login`, {
      username: form.username,
      password: form.password,
    })

    // Store admin data and token in Pinia
    mainStore.setAdmin({
      id: res.data.admin.id,
      username: res.data.admin.username,
      email: res.data.admin.email,
      first_name: res.data.admin.first_name,
      last_name: res.data.admin.last_name,
      phone_number: res.data.admin.phone_number,
      avatar: res.data.admin.avatar,
      admin_status: res.data.admin.admin_status,
      token: res.data.token,
    })

    router.push('/admin/dashboard')
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

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 w-full h-full">
      <div
        class="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"
      ></div>
    </div>

    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 opacity-30">
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(156, 146, 172, 0.15) 1px,
            transparent 0
          );
          background-size: 20px 20px;
        "
      ></div>
    </div>

    <div class="relative z-10 w-full max-w-md mx-4 sm:mx-6 lg:mx-8">
      <!-- Main card -->
      <div
        class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10"
      >
        <!-- Header -->
        <div class="text-center mb-8">
          <!-- Logo/Icon -->
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg"
          >
            <LockClosedIcon class="h-8 w-8 text-white" />
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">Admin Panel</h1>
          <p class="text-gray-300 text-sm sm:text-base">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="space-y-6">
          <!-- Username field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-200">Username</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="form.username"
                type="text"
                class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <!-- Password field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-200">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-purple-300 transition-colors duration-200"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <!-- Error message -->
          <div
            v-if="error"
            class="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm"
          >
            <div class="flex items-center space-x-2">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
              <span class="text-red-300 text-sm font-medium">{{ error }}</span>
            </div>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading || !form.username || !form.password"
            class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            <span v-if="loading" class="flex items-center justify-center space-x-2">
              <ArrowPathIcon class="h-5 w-5 text-white animate-spin" />
              <span>Signing in...</span>
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-gray-400 text-sm">Protected by enterprise security</p>
        </div>
      </div>

      <!-- Bottom decorative element -->
      <div class="text-center mt-6">
        <div class="inline-flex items-center space-x-2 text-gray-400 text-xs">
          <LockClosedIcon class="h-5 w-5" />
          <span>Secure Admin Access</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
