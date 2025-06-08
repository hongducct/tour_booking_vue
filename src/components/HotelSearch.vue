<script setup>
import { ref, computed } from 'vue'
import {
  HomeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  StarIcon,
  WifiIcon,
  TruckIcon,
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CreditCardIcon,
} from '@heroicons/vue/24/outline'

// Form inputs
const cityCode = ref('SGN')
const checkInDate = ref('')
const checkOutDate = ref('')
const adults = ref(2)
const rooms = ref(1)

// API state
const hotels = ref([])
const isLoading = ref(false)
const error = ref(null)

// Booking modal state
const showBookingModal = ref(false)
const selectedHotel = ref(null)
const isBooking = ref(false)
const bookingSuccess = ref(false)

// Booking form data
const bookingForm = ref({
  // Guest information
  firstName: '',
  lastName: '',
  email: '',
  phone: '',

  // Contact information
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',

  // Payment information
  paymentMethod: 'credit_card',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  cardName: '',

  // Special requests
  specialRequests: '',
  roomType: 'standard', // 'standard', 'deluxe', 'suite'
  bedType: 'any', // 'single', 'double', 'twin', 'any'
})

// Vietnam cities for hotel search
const vietnamCities = [
  { code: 'SGN', name: 'TP. Hồ Chí Minh', nameEn: 'Ho Chi Minh City' },
  { code: 'HAN', name: 'Hà Nội', nameEn: 'Hanoi' },
  { code: 'DAD', name: 'Đà Nẵng', nameEn: 'Da Nang' },
  { code: 'NHA', name: 'Nha Trang', nameEn: 'Nha Trang' },
  { code: 'PQC', name: 'Phú Quốc', nameEn: 'Phu Quoc' },
  { code: 'HUE', name: 'Huế', nameEn: 'Hue' },
  { code: 'HOI', name: 'Hội An', nameEn: 'Hoi An' },
  { code: 'VTE', name: 'Vũng Tàu', nameEn: 'Vung Tau' },
  { code: 'DLT', name: 'Đà Lạt', nameEn: 'Da Lat' },
  { code: 'CTO', name: 'Cần Thơ', nameEn: 'Can Tho' },
]

// Date validation
const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

const minCheckOutDate = computed(() => {
  if (!checkInDate.value) return today.value
  const checkIn = new Date(checkInDate.value)
  checkIn.setDate(checkIn.getDate() + 1)
  return checkIn.toISOString().split('T')[0]
})

// Payment methods
const paymentMethods = [
  { value: 'credit_card', label: 'Thẻ tín dụng/ghi nợ', icon: '💳' },
  { value: 'vnpay', label: 'VNPay', icon: '🏦' },
  { value: 'momo', label: 'MoMo', icon: '📱' },
  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏛️' },
]

/**
 * Search for hotels
 */
const searchHotels = async () => {
  isLoading.value = true
  error.value = null
  hotels.value = []

  // Validation
  if (!cityCode.value || !checkInDate.value || !checkOutDate.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin tìm kiếm.'
    isLoading.value = false
    return
  }

  if (new Date(checkOutDate.value) <= new Date(checkInDate.value)) {
    error.value = 'Ngày trả phòng phải sau ngày nhận phòng.'
    isLoading.value = false
    return
  }

  try {
    const requestData = {
      cityCode: cityCode.value,
      checkInDate: checkInDate.value,
      checkOutDate: checkOutDate.value,
      adults: adults.value,
      rooms: rooms.value,
      currency: 'VND',
      lang: 'vi',
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${apiBaseUrl}/hotels/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      hotels.value = data.data || []
      if (hotels.value.length === 0) {
        error.value = 'Không tìm thấy khách sạn phù hợp. Vui lòng thử thay đổi tiêu chí tìm kiếm.'
      }
    } else {
      throw new Error(data.message || 'Có lỗi xảy ra khi tìm kiếm khách sạn')
    }
  } catch (err) {
    console.error('Hotel search error:', err)
    error.value = `Không thể tìm kiếm khách sạn: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

/**
 * Handle hotel selection - open booking modal
 */
const selectHotel = (hotel) => {
  selectedHotel.value = hotel
  showBookingModal.value = true
  bookingSuccess.value = false

  // Reset form
  Object.keys(bookingForm.value).forEach((key) => {
    if (typeof bookingForm.value[key] === 'string') {
      bookingForm.value[key] = ''
    }
  })
  bookingForm.value.paymentMethod = 'credit_card'
  bookingForm.value.roomType = 'standard'
  bookingForm.value.bedType = 'any'
}

/**
 * Process hotel booking
 */
const processBooking = async () => {
  isBooking.value = true

  try {
    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'contactEmail',
      'contactPhone',
    ]
    const missingFields = requiredFields.filter((field) => !bookingForm.value[field])

    if (missingFields.length > 0) {
      throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc.')
    }

    // Prepare booking data
    const bookingData = {
      hotel: selectedHotel.value,
      guest: {
        firstName: bookingForm.value.firstName,
        lastName: bookingForm.value.lastName,
        email: bookingForm.value.email,
        phone: bookingForm.value.phone,
      },
      contact: {
        firstName: bookingForm.value.contactFirstName || bookingForm.value.firstName,
        lastName: bookingForm.value.contactLastName || bookingForm.value.lastName,
        email: bookingForm.value.contactEmail,
        phone: bookingForm.value.contactPhone,
      },
      payment: {
        method: bookingForm.value.paymentMethod,
        cardNumber: bookingForm.value.cardNumber,
        cardExpiry: bookingForm.value.cardExpiry,
        cardCvv: bookingForm.value.cardCvv,
        cardName: bookingForm.value.cardName,
      },
      preferences: {
        roomType: bookingForm.value.roomType,
        bedType: bookingForm.value.bedType,
        specialRequests: bookingForm.value.specialRequests,
      },
      searchParams: {
        cityCode: cityCode.value,
        checkInDate: checkInDate.value,
        checkOutDate: checkOutDate.value,
        adults: adults.value,
        rooms: rooms.value,
      },
    }

    // Call booking API
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${apiBaseUrl}/hotels/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      bookingSuccess.value = true
      setTimeout(() => {
        showBookingModal.value = false
        // Optional: redirect to booking confirmation page
        // window.location.href = `/booking/confirmation/${result.bookingId}`
      }, 3000)
    } else {
      throw new Error(result.message || 'Có lỗi xảy ra khi đặt phòng')
    }
  } catch (err) {
    console.error('Booking error:', err)
    alert(`Lỗi đặt phòng: ${err.message}`)
  } finally {
    isBooking.value = false
  }
}

/**
 * Close booking modal
 */
const closeBookingModal = () => {
  showBookingModal.value = false
  selectedHotel.value = null
  bookingSuccess.value = false
}

/**
 * Calculate number of nights
 */
const numberOfNights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 0
  const checkIn = new Date(checkInDate.value)
  const checkOut = new Date(checkOutDate.value)
  const diffTime = Math.abs(checkOut - checkIn)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

/**
 * Format price in Vietnamese Dong
 */
const formatPrice = (price) => {
  if (!price) return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Generate star rating
 */
const getStarRating = (rating) => {
  return Array.from({ length: 5 }, (_, i) => i < rating)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="w-full max-w-6xl mx-auto px-4 mt-8">
      <!-- Search Form -->
      <div
        class="backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-white/20 p-8 mb-12"
      >
        <div class="flex items-center justify-between mb-6">
          <h2
            class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center"
          >
            <HomeIcon class="h-10 w-10 text-blue-600 mr-4" />
            Tìm kiếm Khách sạn
          </h2>
          <p class="text-sm font-normal text-gray-600 ml-6">
            Khám phá những khách sạn tuyệt vời nhất với giá cả phải chăng
          </p>
        </div>
        <form @submit.prevent="searchHotels" class="space-y-8">
          <!-- City Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider"
              >Điểm đến</label
            >
            <div class="relative group">
              <select
                v-model="cityCode"
                class="w-full p-4 pr-12 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:border-blue-300"
                required
              >
                <option value="">Chọn thành phố du lịch</option>
                <option v-for="city in vietnamCities" :key="city.code" :value="city.code">
                  {{ city.name }}
                </option>
              </select>
              <MapPinIcon
                class="absolute right-4 top-4 h-6 w-6 text-blue-500 pointer-events-none group-focus-within:scale-110 transition-transform mr-4"
              />
            </div>
          </div>

          <!-- Dates and Guests Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider"
                >Nhận phòng</label
              >
              <div class="relative group">
                <input
                  v-model="checkInDate"
                  type="date"
                  :min="today"
                  class="w-full p-4 pr-12 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:border-blue-300"
                  required
                />
                <CalendarDaysIcon
                  class="absolute right-4 top-4 h-6 w-6 text-blue-500 pointer-events-none group-focus-within:scale-110 transition-transform"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider"
                >Trả phòng</label
              >
              <div class="relative group">
                <input
                  v-model="checkOutDate"
                  type="date"
                  :min="minCheckOutDate"
                  class="w-full p-4 pr-12 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:border-blue-300"
                  required
                />
                <CalendarDaysIcon
                  class="absolute right-4 top-4 h-6 w-6 text-blue-500 pointer-events-none group-focus-within:scale-110 transition-transform"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider"
                >Số khách</label
              >
              <div class="relative group">
                <select
                  v-model.number="adults"
                  class="w-full p-4 pr-12 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:border-blue-300"
                  required
                >
                  <option v-for="n in 8" :key="n" :value="n">{{ n }} khách</option>
                </select>
                <UserGroupIcon
                  class="absolute right-4 top-4 h-6 w-6 text-blue-500 pointer-events-none group-focus-within:scale-110 transition-transform mr-4"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 uppercase tracking-wider"
                >Số phòng</label
              >
              <div class="relative group">
                <select
                  v-model.number="rooms"
                  class="w-full p-4 pr-12 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:border-blue-300"
                  required
                >
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} phòng</option>
                </select>
                <HomeIcon
                  class="absolute right-4 top-4 h-6 w-6 text-blue-500 pointer-events-none group-focus-within:scale-110 transition-transform mr-4"
                />
              </div>
            </div>
          </div>

          <!-- Nights Display -->
          <div v-if="numberOfNights > 0" class="text-center">
            <div
              class="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg"
            >
              <CalendarDaysIcon class="h-5 w-5 mr-2" />
              {{ numberOfNights }} đêm nghỉ dưỡng
            </div>
          </div>

          <!-- Search Button -->
          <div class="flex justify-center pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[280px] text-lg"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <div class="relative flex items-center justify-center">
                <MagnifyingGlassIcon
                  v-if="!isLoading"
                  class="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300"
                />
                <div
                  v-if="isLoading"
                  class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"
                ></div>
                {{ isLoading ? 'Đang khám phá...' : 'Tìm kiếm khách sạn' }}
              </div>
            </button>
          </div>
        </form>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-16">
        <div class="relative inline-block">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"
          ></div>
          <div
            class="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"
            style="animation-delay: -0.15s; animation-duration: 1.5s"
          ></div>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Đang tìm kiếm...</h3>
        <p class="text-gray-600 text-lg">
          Chúng tôi đang tìm những khách sạn tuyệt vời nhất cho bạn
        </p>
      </div>

      <!-- Error State -->
      <div
        v-if="error"
        class="backdrop-blur-sm bg-red-50/80 border-2 border-red-200 rounded-3xl p-8 mb-8"
      >
        <div class="flex items-center justify-center">
          <div class="flex items-center space-x-4">
            <div
              class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-red-800 mb-1">Oops! Có lỗi xảy ra</h3>
              <p class="text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Hotel Results -->
      <div v-if="hotels.length > 0 && !isLoading" class="space-y-8">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-3xl font-bold text-gray-800">
            Tìm thấy <span class="text-blue-600">{{ hotels.length }}</span> khách sạn
          </h3>
          <div class="text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border">
            Giá mỗi đêm, đã bao gồm thuế
          </div>
        </div>

        <div class="grid gap-8">
          <div
            v-for="hotel in hotels"
            :key="hotel.id"
            class="group backdrop-blur-sm bg-white/80 border border-white/20 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2"
          >
            <div class="lg:flex">
              <!-- Hotel Image -->
              <div class="lg:w-2/5 relative overflow-hidden">
                <img
                  :src="hotel.image || '/placeholder.svg?height=300&width=400'"
                  :alt="hotel.name"
                  class="w-full h-64 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </div>

              <!-- Hotel Details -->
              <div class="lg:w-3/5 p-8">
                <div class="flex justify-between items-start mb-6">
                  <div class="flex-1">
                    <h4
                      class="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300"
                    >
                      {{ hotel.name }}
                    </h4>

                    <!-- Star Rating -->
                    <div class="flex items-center mb-4">
                      <div class="flex space-x-1">
                        <StarIcon
                          v-for="(filled, index) in getStarRating(hotel.rating || 4)"
                          :key="index"
                          :class="[
                            'h-5 w-5 transition-colors duration-300',
                            filled ? 'text-yellow-400 fill-current' : 'text-gray-300',
                          ]"
                        />
                      </div>
                      <span class="ml-3 text-gray-600 font-medium"
                        >{{ hotel.rating || 4 }} sao</span
                      >
                    </div>

                    <!-- Location -->
                    <div class="flex items-center text-gray-600 mb-6">
                      <MapPinIcon class="h-5 w-5 mr-2 text-blue-500" />
                      <span class="font-medium">{{ hotel.address || 'Trung tâm thành phố' }}</span>
                    </div>

                    <!-- Amenities -->
                    <div class="flex flex-wrap gap-4 text-sm">
                      <div
                        class="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-full"
                      >
                        <WifiIcon class="h-4 w-4 mr-2" />
                        <span class="font-medium">WiFi miễn phí</span>
                      </div>
                      <div
                        class="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-full"
                      >
                        <TruckIcon class="h-4 w-4 mr-2" />
                        <span class="font-medium">Đỗ xe</span>
                      </div>
                      <div
                        class="flex items-center bg-purple-50 text-purple-700 px-3 py-2 rounded-full"
                      >
                        <svg
                          class="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span class="font-medium">Hồ bơi</span>
                      </div>
                    </div>
                  </div>

                  <!-- Price -->
                  <div class="text-right ml-6">
                    <div
                      class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1"
                    >
                      {{ formatPrice(hotel.price?.total || 1500000) }}
                    </div>
                    <div class="text-sm text-gray-500 mb-2">mỗi đêm</div>
                    <div class="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      Tổng: {{ formatPrice((hotel.price?.total || 1500000) * numberOfNights) }}
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                  {{
                    hotel.description ||
                    'Khách sạn hiện đại với đầy đủ tiện nghi, phục vụ chu đáo và vị trí thuận lợi, mang đến trải nghiệm nghỉ dưỡng tuyệt vời.'
                  }}
                </p>

                <!-- Action Button -->
                <div class="flex justify-end">
                  <button
                    @click="selectHotel(hotel)"
                    class="group/btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div class="flex items-center">
                      <span>Đặt phòng ngay</span>
                      <svg
                        class="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="
          !isLoading && !error && hotels.length === 0 && (cityCode || checkInDate || checkOutDate)
        "
        class="text-center py-16 backdrop-blur-sm bg-white/60 rounded-3xl border border-white/20"
      >
        <div
          class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <HomeIcon class="h-12 w-12 text-gray-400" />
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy khách sạn</h3>
        <p class="text-gray-600 text-lg max-w-md mx-auto">
          Vui lòng thử thay đổi tiêu chí tìm kiếm hoặc chọn ngày khác.
        </p>
      </div>
    </div>

    <!-- Booking Modal -->
    <div
      v-if="showBookingModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-2xl font-bold text-gray-800">Đặt phòng khách sạn</h3>
          <button @click="closeBookingModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="bookingSuccess" class="p-6 text-center">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600"
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
          <h4 class="text-xl font-bold text-green-600 mb-2">Đặt phòng thành công!</h4>
          <p class="text-gray-600 mb-4">Chúng tôi đã gửi thông tin đặt phòng đến email của bạn.</p>
          <p class="text-sm text-gray-500">Cửa sổ này sẽ tự động đóng sau 3 giây...</p>
        </div>

        <!-- Booking Form -->
        <form v-else @submit.prevent="processBooking" class="p-6 space-y-6">
          <!-- Hotel Summary -->
          <div class="bg-green-50 rounded-lg p-4 mb-6">
            <h4 class="font-bold text-green-800 mb-2">Thông tin khách sạn</h4>
            <div v-if="selectedHotel" class="text-sm text-green-700">
              <p><strong>Khách sạn:</strong> {{ selectedHotel.name }}</p>
              <p><strong>Địa chỉ:</strong> {{ selectedHotel.address || 'Trung tâm thành phố' }}</p>
              <p>
                <strong>Ngày:</strong> {{ formatDate(checkInDate) }} -
                {{ formatDate(checkOutDate) }}
              </p>
              <p><strong>Số đêm:</strong> {{ numberOfNights }} đêm</p>
              <p>
                <strong>Giá:</strong>
                {{ formatPrice((selectedHotel.price?.total || 1500000) * numberOfNights) }}
              </p>
            </div>
          </div>

          <!-- Guest Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <UserIcon class="h-5 w-5 mr-2" />
                Thông tin khách hàng
              </h4>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Họ *</label>
                    <input
                      v-model="bookingForm.firstName"
                      type="text"
                      required
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Nguyễn"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                    <input
                      v-model="bookingForm.lastName"
                      type="text"
                      required
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Văn A"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    v-model="bookingForm.email"
                    type="email"
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại *</label
                  >
                  <input
                    v-model="bookingForm.phone"
                    type="tel"
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0901234567"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Loại phòng</label>
                  <select
                    v-model="bookingForm.roomType"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="standard">Phòng tiêu chuẩn</option>
                    <option value="deluxe">Phòng deluxe</option>
                    <option value="suite">Phòng suite</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Loại giường</label>
                  <select
                    v-model="bookingForm.bedType"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="any">Bất kỳ</option>
                    <option value="single">Giường đơn</option>
                    <option value="double">Giường đôi</option>
                    <option value="twin">Hai giường đơn</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <PhoneIcon class="h-5 w-5 mr-2" />
                Thông tin liên hệ
              </h4>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Họ người liên hệ</label
                    >
                    <input
                      v-model="bookingForm.contactFirstName"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Để trống nếu giống khách hàng"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Tên người liên hệ</label
                    >
                    <input
                      v-model="bookingForm.contactLastName"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Để trống nếu giống khách hàng"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Email liên hệ *</label
                  >
                  <input
                    v-model="bookingForm.contactEmail"
                    type="email"
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại liên hệ *</label
                  >
                  <input
                    v-model="bookingForm.contactPhone"
                    type="tel"
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0901234567"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Yêu cầu đặc biệt</label
                  >
                  <textarea
                    v-model="bookingForm.specialRequests"
                    rows="4"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ví dụ: Tầng cao, view biển, giường phụ cho trẻ em..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCardIcon class="h-5 w-5 mr-2" />
              Thông tin thanh toán
            </h4>

            <!-- Payment Method Selection -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div
                v-for="method in paymentMethods"
                :key="method.value"
                @click="bookingForm.paymentMethod = method.value"
                :class="[
                  'border-2 rounded-lg p-4 cursor-pointer transition-all text-center',
                  bookingForm.paymentMethod === method.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <div class="text-2xl mb-2">{{ method.icon }}</div>
                <div class="text-sm font-medium">{{ method.label }}</div>
              </div>
            </div>

            <!-- Credit Card Form -->
            <div
              v-if="bookingForm.paymentMethod === 'credit_card'"
              class="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Tên trên thẻ</label>
                <input
                  v-model="bookingForm.cardName"
                  type="text"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="NGUYEN VAN A"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Số thẻ</label>
                <input
                  v-model="bookingForm.cardNumber"
                  type="text"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                <input
                  v-model="bookingForm.cardExpiry"
                  type="text"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  v-model="bookingForm.cardCvv"
                  type="text"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="123"
                />
              </div>
            </div>

            <!-- Other Payment Methods Info -->
            <div v-else class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-600 text-sm">
                <span v-if="bookingForm.paymentMethod === 'vnpay'">
                  Bạn sẽ được chuyển đến trang VNPay để hoàn tất thanh toán.
                </span>
                <span v-else-if="bookingForm.paymentMethod === 'momo'">
                  Bạn sẽ được chuyển đến ứng dụng MoMo để hoàn tất thanh toán.
                </span>
                <span v-else-if="bookingForm.paymentMethod === 'bank_transfer'">
                  Thông tin chuyển khoản sẽ được gửi đến email sau khi đặt phòng.
                </span>
              </p>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="bg-gray-50 rounded-lg p-4">
            <label class="flex items-start">
              <input type="checkbox" required class="mt-1 mr-3" />
              <span class="text-sm text-gray-600">
                Tôi đồng ý với
                <a href="#" class="text-green-600 hover:underline">điều khoản và điều kiện</a> và
                <a href="#" class="text-green-600 hover:underline">chính sách bảo mật</a> của Travel
                Booking.
              </span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              @click="closeBookingModal"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="isBooking"
              class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <div
                v-if="isBooking"
                class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
              ></div>
              {{ isBooking ? 'Đang xử lý...' : 'Xác nhận đặt phòng' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles similar to FlightSearch */
input[type='date']::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
