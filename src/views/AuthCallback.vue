<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const baseUrl = import.meta.env.VITE_API_BASE_URL
const error = ref('')

const showSuccessMessage = () => {
  const toast = document.createElement('div')
  toast.className =
    'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
  toast.textContent = 'Đăng nhập bằng Google thành công!'
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

onMounted(async () => {
  const code = route.query.code

  if (code) {
    try {
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

      // Redirect về trang chủ
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      error.value =
        err.response?.data?.message || 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.'
    }
  } else {
    error.value = 'Không tìm thấy mã xác thực.'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-4">Đang xử lý đăng nhập...</h2>
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
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
      <p v-else class="text-center text-gray-600">Vui lòng đợi trong giây lát.</p>
    </div>
  </div>
</template>