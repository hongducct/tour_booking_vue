<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import UserSidebar from '@/components/user/UserSidebar.vue'
import { 
  CalendarDaysIcon, 
  EyeIcon, 
  ClockIcon, 
  UserGroupIcon,
  CreditCardIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('userToken')
const bookingHistory = ref([])
const loading = ref(true)
const error = ref(null)

const fetchBookingHistory = async () => {
  try {
    loading.value = true
    const res = await axios.get(`${baseUrl}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setTimeout(() => {
      bookingHistory.value = res.data
      loading.value = false
    }, 1000)
  } catch (err) {
    console.error('Lấy lịch sử booking thất bại:', err)
    alert('Không thể lấy lịch sử booking.')
    loading.value = false
  }
}


const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'confirmed':
      return CheckCircleIcon
    case 'pending':
      return ClockIcon
    case 'cancelled':
      return XCircleIcon
    case 'failed':
      return ExclamationTriangleIcon
    default:
      return ClockIcon
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'text-green-600 bg-green-50'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50'
    case 'cancelled':
      return 'text-red-600 bg-red-50'
    case 'failed':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'completed':
    case 'success':
      return 'text-green-600 bg-green-50'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50'
    case 'failed':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

const sortedBookings = computed(() => {
  return [...bookingHistory.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

onMounted(() => {
  fetchBookingHistory()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 mt-27">
    <TheHeader />
    <div class="flex pt-16">
      <UserSidebar />
      
      <!-- Main Content -->
      <div class="flex-1 lg:ml-80 p-4 lg:p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Header Section -->
          <div class="mb-8">
            <div class="flex items-center space-x-3 mb-2">
              <CalendarDaysIcon class="h-8 w-8 text-blue-600" />
              <h1 class="text-3xl font-bold text-gray-900">Lịch sử đặt tour</h1>
            </div>
            <p class="text-gray-600">Quản lý và theo dõi các chuyến đi của bạn</p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="bg-white rounded-xl shadow-sm p-8">
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-white rounded-xl shadow-sm p-8">
            <div class="text-center">
              <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p class="text-red-600 font-medium">{{ error }}</p>
              <button @click="fetchBookingHistory" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Thử lại
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!sortedBookings.length" class="bg-white rounded-xl shadow-sm p-12">
            <div class="text-center">
              <CalendarDaysIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 class="text-xl font-semibold text-gray-700 mb-2">Chưa có booking nào</h3>
              <p class="text-gray-500 mb-6">Hãy bắt đầu khám phá và đặt tour đầu tiên của bạn!</p>
              <button @click="router.push('/tours')" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Khám phá tour
              </button>
            </div>
          </div>

          <!-- Bookings List -->
          <div v-else class="space-y-6">
            <!-- Desktop View -->
            <div class="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="booking in sortedBookings" :key="booking.id" class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4">
                        <div class="flex items-start space-x-3">
                          <div class="flex-shrink-0">
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center">
                              <!-- hiển thị ảnh tour -->
                              <img
                                v-if="booking.bookable.primary_image"
                                :src="booking.bookable.primary_image.image_url"
                                alt="Tour Image"
                                class="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </div>
                          <div class="min-w-0 flex-1">
                            <p class="text-sm font-medium text-gray-900 truncate">{{ booking.bookable.name }}</p>
                            <p class="text-sm text-gray-500">{{ booking.bookable.days }} ngày {{ booking.bookable.nights }} đêm</p>
                            <p class="text-xs text-gray-400">ID: #{{ booking.id }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm">
                          <p class="text-gray-900 font-medium">{{ formatDate(booking.start_date) }}</p>
                          <p class="text-gray-500">đến {{ formatDate(booking.end_date) }}</p>
                          <p class="text-xs text-gray-400 mt-1">Đặt: {{ formatDate(booking.created_at) }}</p>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center space-x-2">
                          <UserGroupIcon class="h-4 w-4 text-gray-400" />
                          <span class="text-sm text-gray-900">{{ booking.number_of_guests_adults + booking.number_of_children }}</span>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">
                          {{ booking.number_of_guests_adults }} người lớn
                          <span v-if="booking.number_of_children">, {{ booking.number_of_children }} trẻ em</span>
                        </p>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center space-x-2">
                          <component :is="getStatusIcon(booking.status)" class="h-4 w-4" :class="getStatusColor(booking.status).split(' ')[0]" />
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" :class="getStatusColor(booking.status)">
                            {{ booking.status }}
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center space-x-2">
                          <CreditCardIcon class="h-4 w-4 text-gray-400" />
                          <div class="text-sm">
                            <p class="text-gray-900 capitalize">{{ booking.payment.method }}</p>
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize" :class="getPaymentStatusColor(booking.payment.status)">
                              {{ booking.payment.status }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm">
                          <p class="text-gray-900 font-semibold">{{ formatPrice(booking.total_price) }}</p>
                          <p v-if="booking.voucher" class="text-xs text-green-600">Đã áp dụng voucher</p>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <button
                          @click="router.push(`/booking/${booking.id}`)"
                          class="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <EyeIcon class="h-4 w-4" />
                          <span>Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Mobile View -->
            <div class="lg:hidden space-y-4">
              <div v-for="booking in sortedBookings" :key="booking.id" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="p-4">
                  <!-- Header -->
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          v-if="booking.bookable.primary_image"
                          :src="booking.bookable.primary_image.image_url"
                          alt="Tour Image"
                          class="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div class="min-w-0 flex-1">
                        <h3 class="text-sm font-medium text-gray-900 truncate">{{ booking.bookable.name }}</h3>
                        <p class="text-xs text-gray-500">ID: #{{ booking.id }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-1">
                      <component :is="getStatusIcon(booking.status)" class="h-4 w-4" :class="getStatusColor(booking.status).split(' ')[0]" />
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize" :class="getStatusColor(booking.status)">
                        {{ booking.status }}
                      </span>
                    </div>
                  </div>

                  <!-- Details -->
                  <div class="space-y-2 mb-4">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-500">Thời gian:</span>
                      <span class="text-gray-900">{{ formatDate(booking.start_date) }} - {{ formatDate(booking.end_date) }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-500">Số khách:</span>
                      <span class="text-gray-900">{{ booking.number_of_guests_adults + booking.number_of_children }} người</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-500">Thanh toán:</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-gray-900 capitalize">{{ booking.payment.method }}</span>
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize" :class="getPaymentStatusColor(booking.payment.status)">
                          {{ booking.payment.status }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-500">Tổng tiền:</span>
                      <span class="text-gray-900 font-semibold">{{ formatPrice(booking.total_price) }}</span>
                    </div>
                  </div>

                  <!-- Action Button -->
                  <button
                    @click="router.push(`/booking/${booking.id}`)"
                    class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <EyeIcon class="h-4 w-4" />
                    <span>Xem chi tiết</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations and utilities */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>