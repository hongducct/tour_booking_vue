<template>
  <!-- Footer -->
  <footer
    class="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"
      ></div>
    </div>

    <!-- Main Footer Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <!-- Company Info -->
        <div class="lg:col-span-1">
          <div class="flex items-center mb-6">
            <img
              src="../../public/hongducct (7).svg"
              alt="Travel Booking Logo"
              class="w-10 h-10 rounded-lg mr-3 object-contain bg-white p-1"
            />
            <h3
              class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent"
            >
              Travel Booking
            </h3>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed mb-6">
            Khám phá vẻ đẹp thiên nhiên Việt Nam cùng chúng tôi. Chuyên tổ chức các tour du lịch
            chất lượng cao với dịch vụ tận tâm và giá cả hợp lý.
          </p>
          <div class="flex space-x-4">
            <a
              href="https://www.facebook.com/hongducct23"
              target="_blank"
              class="w-10 h-10 bg-gray-800/50 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <i class="fab fa-facebook-f text-sm"></i>
            </a>
            <a
              href="https://www.instagram.com/hongducct"
              target="_blank"
              class="w-10 h-10 bg-gray-800/50 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25"
            >
              <i class="fab fa-instagram text-sm"></i>
            </a>
            <a
              href="https://github.com/hongducct"
              target="_blank"
              class="w-10 h-10 bg-gray-800/50 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25"
            >
              <i class="fab fa-github text-sm"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-gray-800/50 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <i class="fab fa-linkedin text-sm"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-6 text-white flex items-center">
            <i class="fas fa-compass mr-2 text-teal-400"></i>
            Liên Kết Nhanh
          </h4>
          <ul class="space-y-3">
            <li>
              <a
                href="#"
                class="text-gray-300 hover:text-teal-400 transition-all duration-300 flex items-center group"
              >
                <i
                  class="fas fa-chevron-right text-xs mr-2 text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                ></i>
                <span class="group-hover:translate-x-1 transition-transform duration-300"
                  >Trang Chủ</span
                >
              </a>
            </li>
            <li>
              <a
                href="/tour"
                class="text-gray-300 hover:text-teal-400 transition-all duration-300 flex items-center group"
              >
                <i
                  class="fas fa-chevron-right text-xs mr-2 text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                ></i>
                <span class="group-hover:translate-x-1 transition-transform duration-300"
                  >Tour Du Lịch</span
                >
              </a>
            </li>
            <li>
              <a
                href="/destination"
                class="text-gray-300 hover:text-teal-400 transition-all duration-300 flex items-center group"
              >
                <i
                  class="fas fa-chevron-right text-xs mr-2 text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                ></i>
                <span class="group-hover:translate-x-1 transition-transform duration-300"
                  >Điểm Đến</span
                >
              </a>
            </li>
            <li>
              <a
                href="/blog"
                class="text-gray-300 hover:text-teal-400 transition-all duration-300 flex items-center group"
              >
                <i
                  class="fas fa-chevron-right text-xs mr-2 text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                ></i>
                <span class="group-hover:translate-x-1 transition-transform duration-300"
                  >Tin Tức</span
                >
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-gray-300 hover:text-teal-400 transition-all duration-300 flex items-center group"
              >
                <i
                  class="fas fa-chevron-right text-xs mr-2 text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                ></i>
                <span class="group-hover:translate-x-1 transition-transform duration-300"
                  >Liên Hệ</span
                >
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-semibold mb-6 text-white flex items-center">
            <i class="fas fa-phone-alt mr-2 text-teal-400"></i>
            Thông Tin Liên Hệ
          </h4>
          <ul class="space-y-4">
            <li class="flex items-start group">
              <div
                class="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-teal-500/30 transition-colors duration-300"
              >
                <i class="fas fa-map-marker-alt text-teal-400 text-sm"></i>
              </div>
              <div>
                <p class="text-gray-300 text-sm leading-relaxed">Hà Nội, Việt Nam</p>
              </div>
            </li>
            <li class="flex items-start group">
              <div
                class="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-teal-500/30 transition-colors duration-300"
              >
                <i class="fas fa-envelope text-teal-400 text-sm"></i>
              </div>
              <div>
                <a
                  href="mailto:hongducct23@gmail.com"
                  class="text-gray-300 text-sm hover:text-teal-400 transition-colors duration-300"
                >
                  hongducct23@gmail.com
                </a>
              </div>
            </li>
            <li class="flex items-start group">
              <div
                class="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-teal-500/30 transition-colors duration-300"
              >
                <i class="fas fa-phone text-teal-400 text-sm"></i>
              </div>
              <div>
                <a
                  href="tel:+84799076901"
                  class="text-gray-300 text-sm hover:text-teal-400 transition-colors duration-300"
                >
                  +84 799 076 901
                </a>
              </div>
            </li>
            <li class="flex items-start group">
              <div
                class="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-teal-500/30 transition-colors duration-300"
              >
                <i class="fas fa-mobile-alt text-teal-400 text-sm"></i>
              </div>
              <div>
                <a
                  href="tel:+84388424835"
                  class="text-gray-300 text-sm hover:text-teal-400 transition-colors duration-300"
                >
                  +84 388 424 835
                </a>
              </div>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-lg font-semibold mb-6 text-white flex items-center">
            <i class="fas fa-paper-plane mr-2 text-teal-400"></i>
            Nhận Tin Khuyến Mãi
          </h4>
          <p class="text-gray-300 text-sm mb-6 leading-relaxed">
            Đăng ký nhận thông tin về các tour mới, ưu đãi đặc biệt và cẩm nang du lịch hữu ích.
          </p>

          <div class="relative">
            <input
              v-model="email"
              type="email"
              class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              placeholder="Nhập email của bạn..."
              @keyup.enter="subscribe"
            />
            <button
              @click="subscribe"
              :disabled="isLoading"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
            </button>
          </div>

          <transition name="fade">
            <div
              v-if="message"
              class="mt-4 p-3 rounded-lg text-sm flex items-center"
              :class="
                messageType === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              "
            >
              <i
                :class="
                  messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
                "
                class="mr-2"
              ></i>
              {{ message }}
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="relative z-10 border-t border-gray-700/50 bg-black/20 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <!-- Copyright -->
          <div class="flex items-center text-sm text-gray-400">
            <i class="fas fa-copyright mr-2"></i>
            <span>2025 Bản quyền thuộc về </span>
            <a
              href="#"
              class="text-teal-400 hover:text-teal-300 transition-colors duration-300 ml-1 font-medium"
            >
              Travel Booking Vietnam
            </a>
          </div>

          <!-- Additional Links -->
          <div class="flex items-center space-x-6 text-sm">
            <a href="#" class="text-gray-400 hover:text-teal-400 transition-colors duration-300">
              Điều Khoản Sử Dụng
            </a>
            <a href="#" class="text-gray-400 hover:text-teal-400 transition-colors duration-300">
              Chính Sách Bảo Mật
            </a>
            <a href="#" class="text-gray-400 hover:text-teal-400 transition-colors duration-300">
              Hỗ Trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const message = ref('')
const messageType = ref('')
const isLoading = ref(false)

const subscribe = async () => {
  if (isLoading.value) return

  // Clear previous messages
  message.value = ''
  messageType.value = ''

  // Validate email
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    message.value = 'Vui lòng nhập địa chỉ email hợp lệ.'
    messageType.value = 'error'
    return
  }

  isLoading.value = true

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL
    const response = await fetch(`${apiUrl}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    })

    const data = await response.json()

    if (response.ok) {
      message.value = 'Cảm ơn bạn đã đăng ký! Kiểm tra email để nhận các ưu đãi du lịch.'
      messageType.value = 'success'
      email.value = ''
    } else {
      message.value = data.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    messageType.value = 'error'
  }

  // Clear message after 5 seconds
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 5000)

  isLoading.value = false
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(20, 184, 166, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(20, 184, 166, 0.7);
}
</style>
