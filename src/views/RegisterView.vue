<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { UserIcon, PhoneIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const form = reactive({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  agree_terms: false,
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const fieldErrors = reactive({})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const step = ref(1)
const isValidEmail = ref(false)
const avatarPreview = ref('')

// Computed properties for validation
const isStep1Valid = computed(() => {
  return (
    form.first_name.length > 0 &&
    form.last_name.length > 0 &&
    form.phone_number.length >= 8 &&
    /^[0-9]+$/.test(form.phone_number)
  )
})

const isStep2Valid = computed(() => {
  return form.username.length >= 3 && form.email.length > 0 && isValidEmail.value
})

const isStep3Valid = computed(() => {
  return (
    form.password.length >= 6 && form.password === form.password_confirmation && form.agree_terms
  )
})

const passwordStrength = computed(() => {
  const password = form.password
  if (password.length === 0) return { level: '', color: 'gray' }
  if (password.length < 6) return { level: 'weak', color: 'red' }
  if (password.length < 8) return { level: 'medium', color: 'yellow' }
  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)) {
    return { level: 'very-strong', color: 'green' }
  }
  return { level: 'strong', color: 'blue' }
})

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isValidEmail.value = emailRegex.test(form.email)
}

const validateUsername = async () => {
  if (form.username.length >= 3) {
    try {
      const response = await axios.get(`${baseUrl}/check-username/${form.username}`)
      fieldErrors.username = response.data.available ? '' : 'Tên đăng nhập đã được sử dụng'
    } catch (err) {
      fieldErrors.username = 'Không thể kiểm tra tên đăng nhập'
    }
  }
}

const updateAvatarPreview = () => {
  avatarPreview.value = form.email ? `https://i.pravatar.cc/300?u=${form.email}` : ''
}

const nextStep = () => {
  if (step.value === 1 && isStep1Valid.value) {
    step.value = 2
    updateAvatarPreview()
  } else if (step.value === 2 && isStep2Valid.value) {
    step.value = 3
  }
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

const submit = async () => {
  if (!isStep3Valid.value) return

  loading.value = true
  error.value = ''
  success.value = ''
  Object.keys(fieldErrors).forEach((key) => (fieldErrors[key] = ''))

  try {
    const res = await axios.post(`${baseUrl}/user/register`, {
      username: form.username,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      first_name: form.first_name,
      last_name: form.last_name,
      phone_number: form.phone_number,
    })

    // Update auth store
    authStore.isLoggedIn = true
    authStore.user = res.data.user
    localStorage.setItem('userToken', res.data.token)
    localStorage.setItem('userData', JSON.stringify(res.data.user))

    success.value = 'Đăng ký thành công! Đang chuyển hướng...'
    showSuccessMessage()

    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (err) {
    if (err.response && err.response.data) {
      const data = err.response.data
      error.value = data.message || 'Đăng ký thất bại. Vui lòng thử lại.'

      if (data.errors) {
        Object.keys(data.errors).forEach((key) => {
          fieldErrors[key] = data.errors[key][0]
        })
        if (fieldErrors.first_name || fieldErrors.last_name || fieldErrors.phone_number) {
          step.value = 1
        } else if (fieldErrors.username || fieldErrors.email) {
          step.value = 2
        } else {
          step.value = 3
        }
      }
    } else {
      error.value = 'Đăng ký thất bại. Vui lòng thử lại.'
    }
  } finally {
    loading.value = false
  }
}

const handleGoogleCallback = async (code) => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    const response = await axios.get(`${baseUrl}/auth/google/callback`, {
      params: { code },
    })

    const { token, user } = response.data

    // Update auth store
    authStore.isLoggedIn = true
    authStore.user = user
    localStorage.setItem('userToken', token)
    localStorage.setItem('userData', JSON.stringify(user))

    success.value = 'Đăng ký/Đăng nhập bằng Google thành công!'
    showSuccessMessage()

    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

const showSuccessMessage = () => {
  const toast = document.createElement('div')
  toast.className =
    'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
  toast.textContent = success.value || 'Đăng ký thành công!'
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

const goToLogin = () => {
  router.push('/login')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const googleRegister = () => {
  window.location.href = `${baseUrl}/auth/google`
}

onMounted(() => {
  // Check if user is already logged in
  if (authStore.isLoggedIn) {
    router.push('/')
  }

  // Handle Google OAuth callback
  const code = route.query.code
  if (code) {
    handleGoogleCallback(code)
  }

  // Initialize avatar preview
  updateAvatarPreview()
})
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
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white bg-opacity-5 rounded-full blur-3xl animate-pulse delay-500"
      ></div>
    </div>

    <div
      class="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md sm:max-w-lg lg:max-w-xl animate-fadeInUp"
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            ></path>
          </svg>
        </div>
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Tạo tài khoản mới
        </h2>
        <p class="text-gray-600 mt-2 text-sm md:text-base">Bước {{ step }} / 3</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-medium text-gray-500">Thông tin cá nhân</span>
          <span class="text-xs font-medium text-gray-500">Tài khoản</span>
          <span class="text-xs font-medium text-gray-500">Bảo mật</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            :style="{ width: `${(step / 3) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6"
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

      <!-- Success Message -->
      <div
        v-if="success"
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-6"
      >
        <div class="flex items-center">
          <svg class="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span>{{ success }}</span>
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-6">
        <!-- Step 1: Personal Information -->
        <div v-if="step === 1" class="space-y-6">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>

          <!-- Avatar Preview -->
          <div class="flex justify-center mb-6">
            <img
              :src="avatarPreview || 'https://i.pravatar.cc/300?u=default'"
              class="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
              alt="Avatar Preview"
            />
          </div>

          <!-- First Name -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700">Tên</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <UserIcon class="w-5 h-5" />
              </span>
              <input
                v-model="form.first_name"
                type="text"
                placeholder="Nhập tên của bạn"
                class="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                :class="{
                  'border-red-300 bg-red-50': fieldErrors.first_name,
                  'border-green-300 bg-green-50': form.first_name,
                }"
                required
              />
              <div v-if="form.first_name" class="absolute inset-y-0 right-0 flex items-center pr-4">
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
            <div v-if="fieldErrors.first_name" class="text-red-500 text-xs mt-1">
              {{ fieldErrors.first_name }}
            </div>
          </div>

          <!-- Last Name -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700">Họ và tên đệm</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <UserIcon class="w-5 h-5" />
              </span>
              <input
                v-model="form.last_name"
                type="text"
                placeholder="Nhập họ và tên đệm"
                class="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                :class="{
                  'border-red-300 bg-red-50': fieldErrors.last_name,
                  'border-green-300 bg-green-50': form.last_name,
                }"
                required
              />
              <div v-if="form.last_name" class="absolute inset-y-0 right-0 flex items-center pr-4">
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
            <div v-if="fieldErrors.last_name" class="text-red-500 text-xs mt-1">
              {{ fieldErrors.last_name }}
            </div>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700">Số điện thoại</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <PhoneIcon class="w-5 h-5" />
              </span>
              <input
                v-model="form.phone_number"
                type="tel"
                placeholder="Nhập số điện thoại"
                class="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                :class="{
                  'border-red-300 bg-red-50': fieldErrors.phone_number,
                  'border-green-300 bg-green-50':
                    form.phone_number && /^[0-9]+$/.test(form.phone_number),
                }"
                pattern="[0-9]+"
                required
              />
              <div
                v-if="form.phone_number && /^[0-9]+$/.test(form.phone_number)"
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
            <div v-if="fieldErrors.phone_number" class="text-red-500 text-xs mt-1">
              {{ fieldErrors.phone_number }}
            </div>
            <div
              v-else-if="form.phone_number && !/^[0-9]+$/.test(form.phone_number)"
              class="text-red-500 text-xs mt-1"
            >
              Số điện thoại chỉ được chứa các chữ số
            </div>
          </div>
        </div>

        <!-- Step 2: Account Information -->
        <div v-if="step === 2" class="space-y-6">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Thông tin tài khoản</h3>

          <!-- Username -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700">Tên đăng nhập</label>
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
                v-model="form.username"
                @input="validateUsername"
                type="text"
                placeholder="Nhập tên đăng nhập (tối thiểu 3 ký tự)"
                class="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                :class="{
                  'border-red-300 bg-red-50': fieldErrors.username,
                  'border-green-300 bg-green-50':
                    form.username.length >= 3 && !fieldErrors.username,
                }"
                minlength="3"
                required
              />
              <div
                v-if="form.username.length >= 3 && !fieldErrors.username"
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
            <div v-if="fieldErrors.username" class="text-red-500 text-xs mt-1">
              {{ fieldErrors.username }}
            </div>
            <div
              v-else-if="form.username.length > 0 && form.username.length < 3"
              class="text-red-500 text-xs mt-1"
            >
              Tên đăng nhập phải có ít nhất 3 ký tự
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700">Email</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  ></path>
                </svg>
              </span>
              <input
                v-model="form.email"
                @input="validateEmail"
                type="email"
                placeholder="Nhập địa chỉ email"
                class="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                :class="{
                  'border-red-300 bg-red-50': fieldErrors.email,
                  'border-green-300 bg-green-50': form.email && isValidEmail,
                }"
                required
              />
              <div
                v-if="form.email && isValidEmail && !fieldErrors.email"
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
            <div v-if="fieldErrors.email" class="text-red-500 text-xs mt-1">
              {{ fieldErrors.email }}
            </div>
            <div v-else-if="form.email && !isValidEmail" class="text-red-500 text-xs mt-1">
              Vui lòng nhập địa chỉ email hợp lệ
            </div>
          </div>
        </div>

        <!-- Step 3: Security -->
        <div v-if="step === 3" class="space-y-6">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Thiết lập bảo mật</h3>

          <!-- Password -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700">Mật khẩu</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 23">
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
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                class="w-full pl-12 pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                :class="{ 'border-red-300 bg-red-50': fieldErrors.password }"
                minlength="6"
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
                <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-300"
                    :class="{
                      'bg-red-500 w-1/4': passwordStrength.level === 'weak',
                      'bg-yellow-500 w-2/4': passwordStrength.level === 'medium',
                      'bg-blue-500 w-3/4': passwordStrength.level === 'strong',
                      'bg-green-500 w-full': passwordStrength.level === 'very-strong',
                    }"
                  ></div>
                </div>
              </div>
              <p class="text-xs mt-1" :class="`text-${passwordStrength.color}-500`">
                {{
                  passwordStrength.level === 'weak'
                    ? 'Mật khẩu quá yếu'
                    : passwordStrength.level === 'medium'
                      ? 'Mật khẩu trung bình'
                      : passwordStrength.level === 'strong'
                        ? 'Mật khẩu mạnh'
                        : 'Mật khẩu rất mạnh'
                }}
              </p>
            </div>
            <div v-if="fieldErrors.password" class="text-red-500 text-xs mt-1">
              {{ fieldErrors.password }}
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
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
                v-model="form.password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Xác nhận mật khẩu"
                class="w-full pl-12 pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                :class="{
                  'border-red-300 bg-red-50': fieldErrors.password_confirmation,
                  'border-green-300 bg-green-50':
                    form.password_confirmation && form.password === form.password_confirmation,
                }"
                required
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none transition"
              >
                <svg
                  v-if="showConfirmPassword"
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
            <div
              v-if="form.password_confirmation && form.password !== form.password_confirmation"
              class="text-red-500 text-xs mt-1"
            >
              Mật khẩu xác nhận không khớp
            </div>
            <div v-if="fieldErrors.password_confirmation" class="text-red-500 text-xs mt-1">
              {{ fieldErrors.password_confirmation }}
            </div>
          </div>

          <!-- Terms Agreement -->
          <div class="flex items-center">
            <input
              id="agree-terms"
              v-model="form.agree_terms"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition"
              required
            />
            <label
              for="agree-terms"
              class="ml-2 block text-sm text-gray-700 select-none cursor-pointer"
            >
              Tôi đồng ý với
              <a href="/privacy-policy" target="_blank" class="text-indigo-600 hover:underline"
                >Điều khoản dịch vụ</a
              >
              và
              <a href="/privacy-policy" target="_blank" class="text-indigo-600 hover:underline"
                >Chính sách bảo mật</a
              >
            </label>
          </div>
          <div v-if="!form.agree_terms && step === 3" class="text-red-500 text-xs mt-1">
            Vui lòng đồng ý với các điều khoản
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8 gap-4">
          <button
            v-if="step > 1"
            type="button"
            @click="prevStep"
            class="flex-1 bg-gray-200 text-gray-700 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105"
          >
            Quay lại
          </button>
          <button
            v-if="step < 3"
            type="button"
            @click="nextStep"
            :disabled="step === 1 ? !isStep1Valid : !isStep2Valid"
            class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Tiếp tục
          </button>
          <button
            v-if="step === 3"
            type="submit"
            :disabled="loading || !isStep3Valid"
            class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
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
            {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>
        </div>
      </form>

      <!-- Social Login -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500 font-medium">Hoặc đăng ký bằng</span>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <button
          type="button"
          @click="googleRegister"
          class="flex justify-center items-center bg-white border-2 border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 transform hover:scale-105"
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

      <!-- Login Link -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-600">
          Đã có tài khoản?
          <button
            type="button"
            @click="goToLogin"
            class="font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-none hover:underline transition ml-1"
          >
            Đăng nhập
          </button>
        </p>
      </div>
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

/* Responsive adjustments */
@media (max-width: 640px) {
  .max-w-md {
    max-width: 100%;
  }
}

@media (min-width: 1024px) {
  .max-w-xl {
    max-width: 32rem;
  }
}
</style>
