<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const form = reactive({
  login: '',
  password: '',
})
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isValidEmail = ref(false)

// Validation
const isFormValid = computed(() => {
  return form.login.length > 0 && form.password.length >= 6
})

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isValidEmail.value = emailRegex.test(form.login)
}

const showSuccessMessage = () => {
  const toast = document.createElement('div')
  toast.className =
    'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
  toast.textContent = 'Đăng nhập thành công!'
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.remove('translate-x-full')
  }, 100)

  setTimeout(() => {
    toast.classList.add('translate-x-full')
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 2000)
}

onMounted(() => {
  // Check if user is already logged in
  const token = localStorage.getItem('userToken')
  if (token) {
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'
    router.push(redirectPath)
  }

  // Load remembered login if exists
  const rememberedLogin = localStorage.getItem('rememberedLogin')
  if (rememberedLogin) {
    form.login = rememberedLogin
    rememberMe.value = true
  }

  // Handle Google OAuth callback
  const code = route.query.code
  if (code) {
    handleGoogleCallback(code)
  }
})

const handleGoogleCallback = async (code) => {
  try {
    loading.value = true
    error.value = ''

    // Gửi code tới backend để lấy token
    const response = await axios.get(`${baseUrl}/auth/google/callback`, {
      params: { code },
    })

    const { token, user } = response.data

    // Lưu token và user info
    localStorage.setItem('userToken', token)
    localStorage.setItem('userData', JSON.stringify(user))

    // Hiển thị thông báo thành công
    showSuccessMessage()

    // Redirect tới trang trước đó hoặc trang chủ
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'
    localStorage.removeItem('redirectAfterLogin')

    setTimeout(() => {
      router.push(redirectPath)
    }, 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  error.value = ''

  try {
    const res = await axios.post(`${baseUrl}/user/login`, {
      login: form.login,
      password: form.password,
      remember_me: rememberMe.value,
    })

    // Save token
    localStorage.setItem('userToken', res.data.token)

    // Save user info
    localStorage.setItem('userData', JSON.stringify(res.data.user))

    // Handle remember me
    if (rememberMe.value) {
      localStorage.setItem('rememberedLogin', form.login)
    } else {
      localStorage.removeItem('rememberedLogin')
    }

    // Redirect
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'
    localStorage.removeItem('redirectAfterLogin')

    // Show success message briefly
    showSuccessMessage()

    setTimeout(() => {
      router.push(redirectPath)
    }, 1000)
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Đăng nhập thất bại. Vui lòng thử lại.'
    }
  } finally {
    loading.value = false
  }
}

const googleLogin = () => {
  // Redirect to Google OAuth endpoint
  window.location.href = `${baseUrl}/auth/google`
}

const goToRegister = () => {
  router.push('/register')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const forgotPassword = () => {
  router.push('/forgot-password')
}

const quickLogin = (type) => {
  if (type === 'admin') {
    form.login = 'admin@example.com'
    form.password = 'password123'
  } else if (type === 'user') {
    form.login = 'user@example.com'
    form.password = 'password123'
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-8 flex items-center justify-center"
  >
    <!-- Background Animation -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse delay-1000"
      ></div>
    </div>

    <div
      class="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md lg:max-w-lg animate-fadeInUp"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
        </div>
        <h2
          class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Chào mừng trở lại
        </h2>
        <p class="text-gray-600 mt-2 text-sm md:text-base">Đăng nhập để tiếp tục sử dụng dịch vụ</p>
      </div>

      <!-- Demo Quick Login (for development)
      <div class="mb-6 p-4 bg-gray-50 rounded-xl">
        <p class="text-xs text-gray-500 mb-2">Demo nhanh (môi trường phát triển):</p>
        <div class="flex gap-2">
          <button
            @click="quickLogin('admin')"
            class="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-md hover:bg-blue-200 transition"
          >
            Admin
          </button>
          <button
            @click="quickLogin('user')"
            class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-md hover:bg-green-200 transition"
          >
            User
          </button>
        </div>
      </div> -->

      <form @submit.prevent="submit" class="space-y-6">
        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
        >
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Username/Email Field -->
        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-700"
            >Tên đăng nhập hoặc Email</label
          >
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </span>
            <input
              v-model="form.login"
              @input="validateEmail"
              type="text"
              placeholder="Nhập tên đăng nhập hoặc email"
              class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              :class="{ 'border-green-300 bg-green-50': form.login && isValidEmail }"
              required
            />
            <!-- Email validation indicator -->
            <div
              v-if="form.login && isValidEmail"
              class="absolute inset-y-0 right-0 flex items-center pr-4"
            >
              <svg
                class="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <div class="flex justify-between mb-2">
            <label class="text-sm font-semibold text-gray-700">Mật khẩu</label>
            <button
              type="button"
              @click="forgotPassword"
              class="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none hover:underline transition"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </span>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Nhập mật khẩu của bạn"
              class="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none transition"
            >
              <svg
                v-if="showPassword"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                ></path>
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>
          </div>
          <!-- Password strength indicator -->
          <div v-if="form.password" class="mt-2">
            <div class="flex space-x-1">
              <div class="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-300"
                  :class="{
                    'bg-red-500 w-1/4': form.password.length < 6,
                    'bg-yellow-500 w-2/4': form.password.length >= 6 && form.password.length < 8,
                    'bg-green-500 w-full': form.password.length >= 8,
                  }"
                ></div>
              </div>
            </div>
            <p
              class="text-xs mt-1"
              :class="{
                'text-red-500': form.password.length < 6,
                'text-yellow-500': form.password.length >= 6 && form.password.length < 8,
                'text-green-500': form.password.length >= 8,
              }"
            >
              {{
                form.password.length < 6
                  ? 'Mật khẩu quá yếu'
                  : form.password.length < 8
                    ? 'Mật khẩu trung bình'
                    : 'Mật khẩu mạnh'
              }}
            </p>
          </div>
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition"
            />
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-700 select-none cursor-pointer"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="w-full flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95"
        >
          <svg
            v-if="loading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500 font-medium">Hoặc đăng nhập bằng</span>
          </div>
        </div>

        <!-- Social Login Buttons -->
        <div class="grid grid-cols-1 gap-4">
          <button
            type="button"
            @click="googleLogin"
            class="flex justify-center items-center bg-white border-2 border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200 transform hover:scale-105"
          >
            <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span class="text-sm font-medium text-gray-700">Google</span>
          </button>
        </div>

        <!-- Register Link -->
        <div class="text-center mt-8">
          <p class="text-sm text-gray-600">
            Chưa có tài khoản?
            <button
              type="button"
              @click="goToRegister"
              class="font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-none hover:underline transition ml-1"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
