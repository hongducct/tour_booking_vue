<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import UserSidebar from '@/components/user/UserSidebar.vue'
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  CreditCardIcon,
  TicketIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  PhotoIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('userToken')
const booking = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchBooking = async () => {
  try {
    loading.value = true
    const res = await axios.get(`${baseUrl}/bookings/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    booking.value = res.data
    console.log('Booking data:', booking.value)
    // Using mock data for demonstration
    setTimeout(() => {
      booking.value = res.data
      loading.value = false
    }, 1000)
  } catch (err) {
    console.error('Lấy chi tiết booking thất bại:', err)
    error.value = 'Không thể lấy chi tiết booking.'
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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
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
      return 'text-green-600 bg-green-50 border-green-200'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'cancelled':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'completed':
    case 'success':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy',
    failed: 'Thất bại',
    completed: 'Hoàn thành',
  }
  return statusMap[status] || status
}

const getPaymentMethodText = (method) => {
  const methodMap = {
    vnpay: 'VNPay',
    cash: 'Tiền mặt',
    credit_card: 'Thẻ tín dụng',
    bank_transfer: 'Chuyển khoản',
  }
  return methodMap[method] || method
}

const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

onMounted(() => {
  fetchBooking()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 mt-27">
    <TheHeader />
    <div class="flex pt-16">
      <UserSidebar />

      <!-- Main Content -->
      <div class="flex-1 lg:ml-80 p-4 lg:p-6">
        <div class="max-w-6xl mx-auto">
          <!-- Back Button -->
          <button
            @click="router.push('/bookings')"
            class="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon class="h-5 w-5" />
            <span class="font-medium">Quay lại danh sách</span>
          </button>

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
              <button
                @click="fetchBooking"
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>

          <!-- Booking Details -->
          <div v-else-if="booking" class="space-y-6">
            <!-- Header Card with Tour Image -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <!-- Tour Image Section -->
              <div
                v-if="booking.bookable.primary_image"
                class="relative h-64 md:h-80 overflow-hidden"
              >
                <img
                  :src="booking.bookable.primary_image.image_url"
                  :alt="booking.bookable.primary_image.caption || booking.bookable.name"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                ></div>
                <!-- Overlay content -->
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div class="flex items-start justify-between">
                    <div>
                      <h1 class="text-2xl lg:text-3xl font-bold mb-2">
                        {{ booking.bookable.name }}
                      </h1>
                      <div class="flex items-center space-x-4 text-white/90">
                        <div class="flex items-center space-x-1">
                          <CalendarDaysIcon class="h-5 w-5" />
                          <span
                            >{{ booking.bookable.days }} ngày
                            {{ booking.bookable.nights }} đêm</span
                          >
                        </div>
                        <div class="flex items-center space-x-1">
                          <TicketIcon class="h-5 w-5" />
                          <span>Booking #{{ booking.id }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="flex items-center space-x-2 mb-2">
                        <component :is="getStatusIcon(booking.status)" class="h-6 w-6" />
                        <span class="text-xl font-semibold">{{
                          getStatusText(booking.status)
                        }}</span>
                      </div>
                      <p class="text-white/90">Đặt ngày {{ formatDate(booking.created_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Fallback Header without Image -->
              <div v-else class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
                <div class="flex items-start justify-between">
                  <div>
                    <h1 class="text-2xl lg:text-3xl font-bold mb-2">{{ booking.bookable.name }}</h1>
                    <div class="flex items-center space-x-4 text-blue-100">
                      <div class="flex items-center space-x-1">
                        <CalendarDaysIcon class="h-5 w-5" />
                        <span
                          >{{ booking.bookable.days }} ngày {{ booking.bookable.nights }} đêm</span
                        >
                      </div>
                      <div class="flex items-center space-x-1">
                        <TicketIcon class="h-5 w-5" />
                        <span>Booking #{{ booking.id }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="flex items-center space-x-2 mb-2">
                      <component :is="getStatusIcon(booking.status)" class="h-6 w-6" />
                      <span class="text-xl font-semibold">{{ getStatusText(booking.status) }}</span>
                    </div>
                    <p class="text-blue-100">Đặt ngày {{ formatDate(booking.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Left Column - Tour Details -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Tour Information -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <MapPinIcon class="h-6 w-6 text-blue-600" />
                    <h2 class="text-xl font-semibold text-gray-900">Thông tin tour</h2>
                  </div>

                  <div class="space-y-4">
                    <!-- Tour Image Info -->
                    <div v-if="booking.bookable.primary_image" class="bg-gray-50 rounded-lg p-4">
                      <h3 class="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <PhotoIcon class="h-5 w-5 text-gray-600" />
                        <span>Hình ảnh tour</span>
                      </h3>
                      <div class="flex items-center space-x-3">
                        <img
                          :src="booking.bookable.primary_image.image_url"
                          :alt="booking.bookable.primary_image.caption || booking.bookable.name"
                          class="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div class="flex-1">
                          <p class="text-sm text-gray-600">
                            {{
                              booking.bookable.primary_image.caption || 'Hình ảnh chính của tour'
                            }}
                          </p>
                          <p class="text-xs text-gray-500 mt-1">
                            Ảnh chính được sử dụng để minh họa cho tour
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4">
                      <h3 class="font-medium text-gray-900 mb-2">Mô tả tour</h3>
                      <p class="text-gray-600 leading-relaxed">
                        {{ booking.bookable.description }}
                      </p>
                    </div>

                    <div
                      v-if="booking.bookable.features && booking.bookable.features.length"
                      class="bg-gray-50 rounded-lg p-4"
                    >
                      <h3 class="font-medium text-gray-900 mb-3">Điểm nổi bật</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div
                          v-for="feature in booking.bookable.features"
                          :key="feature"
                          class="flex items-center space-x-2"
                        >
                          <CheckCircleIcon class="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span class="text-sm text-gray-700">{{ feature }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Booking Timeline -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <CalendarDaysIcon class="h-6 w-6 text-blue-600" />
                    <h2 class="text-xl font-semibold text-gray-900">Lịch trình</h2>
                  </div>

                  <div class="space-y-4">
                    <div
                      class="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div>
                        <h3 class="font-medium text-blue-900">Ngày khởi hành</h3>
                        <p class="text-blue-700">{{ formatDate(booking.start_date) }}</p>
                      </div>
                      <div class="text-right">
                        <h3 class="font-medium text-blue-900">Ngày kết thúc</h3>
                        <p class="text-blue-700">{{ formatDate(booking.end_date) }}</p>
                      </div>
                    </div>

                    <div class="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                      <div class="text-center">
                        <p class="text-sm text-gray-500">Tổng thời gian</p>
                        <p class="text-lg font-semibold text-gray-900">
                          {{ calculateDuration(booking.start_date, booking.end_date) }} ngày
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Special Requests -->
                <div
                  v-if="booking.special_requests"
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div class="flex items-center space-x-3 mb-4">
                    <DocumentTextIcon class="h-6 w-6 text-blue-600" />
                    <h2 class="text-xl font-semibold text-gray-900">Yêu cầu đặc biệt</h2>
                  </div>
                  <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p class="text-amber-800">{{ booking.special_requests }}</p>
                  </div>
                </div>
              </div>

              <!-- Right Column - Booking Details -->
              <div class="space-y-6">
                <!-- Guest Information -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <UserGroupIcon class="h-6 w-6 text-blue-600" />
                    <h2 class="text-lg font-semibold text-gray-900">Thông tin khách</h2>
                  </div>

                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Người lớn:</span>
                      <span class="font-semibold text-gray-900">{{
                        booking.number_of_guests_adults
                      }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Trẻ em:</span>
                      <span class="font-semibold text-gray-900">{{
                        booking.number_of_children
                      }}</span>
                    </div>
                    <div class="pt-2 border-t border-gray-200">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Tổng số khách:</span>
                        <span class="font-bold text-gray-900">{{
                          booking.number_of_guests_adults + booking.number_of_children
                        }}</span>
                      </div>
                    </div>
                    <div class="pt-2 border-t border-gray-200">
                      <div class="flex items-center space-x-2 text-sm text-gray-600">
                        <PhoneIcon class="h-4 w-4" />
                        <span>{{ booking.contact_phone }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment Information -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <CreditCardIcon class="h-6 w-6 text-blue-600" />
                    <h2 class="text-lg font-semibold text-gray-900">Thông tin thanh toán</h2>
                  </div>

                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Phương thức:</span>
                      <span class="font-semibold text-gray-900">{{
                        getPaymentMethodText(booking.payment.method)
                      }}</span>
                    </div>

                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Trạng thái:</span>
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        :class="getPaymentStatusColor(booking.payment.status)"
                      >
                        {{ getStatusText(booking.payment.status) }}
                      </span>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-3">
                      <div class="text-xs text-gray-500 mb-1">Mã giao dịch</div>
                      <div class="font-mono text-sm text-gray-900 break-all">
                        {{ booking.payment.transaction_id }}
                      </div>
                    </div>

                    <div class="text-xs text-gray-500">
                      Thanh toán lúc: {{ formatDateTime(booking.payment.created_at) }}
                    </div>
                  </div>
                </div>

                <!-- Voucher Information -->
                <div
                  v-if="booking.voucher"
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div class="flex items-center space-x-3 mb-4">
                    <TicketIcon class="h-6 w-6 text-green-600" />
                    <h2 class="text-lg font-semibold text-gray-900">Mã giảm giá</h2>
                  </div>

                  <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-green-700 font-medium">{{ booking.voucher.code }}</span>
                      <span class="text-green-600 font-semibold"
                        >-{{ formatPrice(booking.voucher.discount) }}</span
                      >
                    </div>
                    <p class="text-xs text-green-600">Áp dụng thành công</p>
                  </div>
                </div>

                <!-- Price Summary -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <CurrencyDollarIcon class="h-6 w-6 text-blue-600" />
                    <h2 class="text-lg font-semibold text-gray-900">Tổng kết chi phí</h2>
                  </div>

                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Giá tour:</span>
                      <span class="text-gray-900">{{ formatPrice(booking.payment.amount) }}</span>
                    </div>

                    <div
                      v-if="booking.voucher"
                      class="flex justify-between items-center text-green-600"
                    >
                      <span>Giảm giá:</span>
                      <span>-{{ formatPrice(booking.voucher.discount) }}</span>
                    </div>

                    <div class="pt-3 border-t border-gray-200">
                      <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                        <span class="text-xl font-bold text-blue-600">{{
                          formatPrice(booking.total_price)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contact Support -->
                <div
                  class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6"
                >
                  <div class="flex items-center space-x-3 mb-3">
                    <InformationCircleIcon class="h-6 w-6 text-blue-600" />
                    <h3 class="text-lg font-semibold text-gray-900">Cần hỗ trợ?</h3>
                  </div>
                  <p class="text-sm text-gray-600 mb-4">
                    Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về booking này.
                  </p>
                  <button
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Liên hệ hỗ trợ
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
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
