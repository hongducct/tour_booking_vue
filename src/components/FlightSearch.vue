<script setup>
import { ref, computed } from 'vue'
import {
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CreditCardIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Set minimum date to today
const today = computed(() => {
  const date = new Date()
  // Đảm bảo lấy giờ hiện tại theo múi giờ hệ thống, không bị lệch múi giờ UTC
  const offset = date.getTimezoneOffset()
  date.setMinutes(date.getMinutes() - offset)
  // console.log('Today:', date.toISOString())
  return date.toISOString().split('T')[0]
})

// Reactive variables for form inputs
const originLocationCode = ref('SGN')
const destinationLocationCode = ref('HAN')
const departureDate = ref(today.value)
const returnDate = ref('')
const adults = ref(1)
const tripType = ref('one-way')

// Reactive variables for API response and state
const flights = ref([])
const isLoading = ref(false)
const error = ref(null)

// Booking modal state
const showBookingModal = ref(false)
const selectedFlight = ref(null)
const isBooking = ref(false)
const bookingSuccess = ref(false)
const bookingResult = ref(null)
const showNoResults = ref(false)

// Booking form data
const bookingForm = ref({
  // Passenger information
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  passportNumber: '',

  // Contact information
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',

  // Payment information
  paymentMethod: 'vnpay', // 'credit_card', 'vnpay', 'momo'
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  cardName: '',

  // Special requests
  specialRequests: '',
  seatPreference: 'any', // 'window', 'aisle', 'any'
})

// Vietnam airport codes for quick selection
const vietnamAirports = [
  { code: 'SGN', name: 'TP. Hồ Chí Minh (Tân Sơn Nhất)', city: 'Ho Chi Minh City' },
  { code: 'HAN', name: 'Hà Nội (Nội Bài)', city: 'Hanoi' },
  { code: 'DAD', name: 'Đà Nẵng', city: 'Da Nang' },
  { code: 'CXR', name: 'Nha Trang (Cam Ranh)', city: 'Nha Trang' },
  { code: 'PQC', name: 'Phú Quốc', city: 'Phu Quoc' },
  { code: 'VCA', name: 'Cần Thơ', city: 'Can Tho' },
  { code: 'HPH', name: 'Hải Phòng (Cát Bi)', city: 'Hai Phong' },
  { code: 'BMV', name: 'Buôn Ma Thuột', city: 'Buon Ma Thuot' },
]

// Validate return date
const minReturnDate = computed(() => {
  return departureDate.value || today.value
})

// Payment methods
const paymentMethods = [
  { value: 'vnpay', label: 'VNPay', icon: '🏦' },
  { value: 'credit_card', label: 'Thẻ tín dụng/ghi nợ', icon: '💳' },
  { value: 'momo', label: 'MoMo', icon: '📱' },
  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏛️' },
]

/**
 * Search for flights using your Laravel backend
 */
const searchFlights = async () => {
  isLoading.value = true
  error.value = null
  flights.value = []

  // Validation
  if (!originLocationCode.value || !destinationLocationCode.value || !departureDate.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin tìm kiếm.'
    isLoading.value = false
    return
  }

  if (tripType.value === 'round-trip' && !returnDate.value) {
    error.value = 'Vui lòng chọn ngày về cho chuyến khứ hồi.'
    isLoading.value = false
    return
  }

  try {
    const requestData = {
      originLocationCode: originLocationCode.value,
      destinationLocationCode: destinationLocationCode.value,
      departureDate: departureDate.value,
      adults: adults.value,
      currencyCode: 'VND',
      max: 10,
    }

    if (tripType.value === 'round-trip' && returnDate.value) {
      requestData.returnDate = returnDate.value
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${apiBaseUrl}/flights/search`, {
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
      flights.value = data.data || []
      if (flights.value.length === 0) {
        error.value = 'Không tìm thấy chuyến bay phù hợp. Vui lòng thử thay đổi tiêu chí tìm kiếm.'
      }
    } else {
      throw new Error(data.message || 'Có lỗi xảy ra khi tìm kiếm chuyến bay')
    }
  } catch (err) {
    console.error('Flight search error:', err)
    error.value = `Không thể tìm kiếm chuyến bay: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

/**
 * Handle flight selection - open booking modal
 */
const selectFlight = (flight) => {
  selectedFlight.value = flight
  showBookingModal.value = true
  bookingSuccess.value = false
  bookingResult.value = null

  // Reset form
  Object.keys(bookingForm.value).forEach((key) => {
    if (typeof bookingForm.value[key] === 'string') {
      bookingForm.value[key] = ''
    }
  })
  bookingForm.value.paymentMethod = 'credit_card'
  bookingForm.value.seatPreference = 'any'
}

/**
 * Process flight booking
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

    // Validate credit card fields if payment method is credit card
    if (bookingForm.value.paymentMethod === 'credit_card') {
      const cardFields = ['cardNumber', 'cardExpiry', 'cardCvv', 'cardName']
      const missingCardFields = cardFields.filter((field) => !bookingForm.value[field])

      if (missingCardFields.length > 0) {
        throw new Error('Vui lòng điền đầy đủ thông tin thẻ tín dụng.')
      }
    }

    // Prepare booking data
    const bookingData = {
      flight: selectedFlight.value,
      passenger: {
        firstName: bookingForm.value.firstName,
        lastName: bookingForm.value.lastName,
        email: bookingForm.value.email,
        phone: bookingForm.value.phone,
        dateOfBirth: bookingForm.value.dateOfBirth,
        passportNumber: bookingForm.value.passportNumber,
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
        seatPreference: bookingForm.value.seatPreference,
        specialRequests: bookingForm.value.specialRequests,
      },
      searchParams: {
        originLocationCode: originLocationCode.value,
        destinationLocationCode: destinationLocationCode.value,
        departureDate: departureDate.value,
        returnDate: returnDate.value,
        adults: adults.value,
        tripType: tripType.value,
      },
    }

    // Call booking API
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const response = await fetch(`${apiBaseUrl}/flights/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      bookingResult.value = result
      bookingSuccess.value = true

      // Handle different payment methods
      if (result.paymentUrl) {
        // For VNPay, MoMo - redirect to payment gateway
        setTimeout(() => {
          window.open(result.paymentUrl, '_blank')
        }, 2000)
      } else if (bookingForm.value.paymentMethod === 'bank_transfer') {
        // For bank transfer - show bank details
        console.log('Bank transfer booking completed')
      } else if (bookingForm.value.paymentMethod === 'credit_card') {
        // For credit card - payment already processed
        console.log('Credit card payment completed')
      }

      // Auto close modal after 5 seconds
      setTimeout(() => {
        showBookingModal.value = false
      }, 5000)
    } else {
      throw new Error(result.message || 'Có lỗi xảy ra khi đặt vé')
    }
  } catch (err) {
    console.error('Booking error:', err)
    alert(`Lỗi đặt vé: ${err.message}`)
  } finally {
    isBooking.value = false
  }
}

/**
 * Close booking modal
 */
const closeBookingModal = () => {
  showBookingModal.value = false
  selectedFlight.value = null
  bookingSuccess.value = false
  bookingResult.value = null
}

/**
 * Format duration from ISO 8601 to readable format
 */
const formatDuration = (duration) => {
  if (!duration) return ''
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return duration
  const hours = match[1] ? `${match[1]}h` : ''
  const minutes = match[2] ? `${match[2]}m` : ''
  return `${hours} ${minutes}`.trim()
}

/**
 * Format time from ISO string
 */
const formatTime = (dateTime) => {
  if (!dateTime) return ''
  return new Date(dateTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format date from ISO string
 */
const formatDate = (dateTime) => {
  if (!dateTime) return ''
  return new Date(dateTime).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

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
 * Get airline name from carrier code
 */
const getAirlineName = (carrierCode) => {
  const airlines = {
    VN: 'Vietnam Airlines',
    VJ: 'VietJet Air',
    BL: 'Jetstar Pacific',
    QH: 'Bamboo Airways',
    VU: 'Vietravel Airlines',
  }
  return airlines[carrierCode] || carrierCode
}

/**
 * Swap origin and destination
 */
const swapLocations = () => {
  const temp = originLocationCode.value
  originLocationCode.value = destinationLocationCode.value
  destinationLocationCode.value = temp
}
</script>

<template>
  <div class="w-full max-w-6xl mx-auto px-4">
    <div class="mt-8 w-full">
      <!-- Search Form -->
      <div class="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-2xl p-8 mb-12 border border-blue-100">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center">
            <PaperAirplaneIcon class="h-10 w-10 text-blue-600 mr-4 transform rotate-45" />
            Tìm kiếm Chuyến bay
          </h2>

          <!-- Trip Type Toggle -->
          <div class="flex bg-white rounded-xl p-1.5 shadow-lg border border-gray-200">
            <button
              @click="tripType = 'one-way'"
              :class="[
                'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105',
                tripType === 'one-way'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
              ]"
            >
              Một chiều
            </button>
            <button
              @click="tripType = 'round-trip'"
              :class="[
                'px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105',
                tripType === 'round-trip'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
              ]"
            >
              Khứ hồi
            </button>
          </div>
        </div>

        <form @submit.prevent="searchFlights" class="space-y-8">
          <!-- Origin and Destination Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 flex items-center">
                <PaperAirplaneIcon class="h-4 w-4 mr-2 text-blue-600" />
                Điểm đi
              </label>
              <div class="relative">
                <select
                  v-model="originLocationCode"
                  class="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  required
                >
                  <option value="">Chọn điểm đi</option>
                  <option
                    v-for="airport in vietnamAirports"
                    :key="airport.code"
                    :value="airport.code"
                  >
                    {{ airport.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Swap Button -->
            <button
              type="button"
              @click="swapLocations"
              class="absolute left-1/2 top-9 transform -translate-x-1/2 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 md:block hidden"
            >
              <ArrowsRightLeftIcon class="h-5 w-5" />
            </button>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 flex items-center">
                <BuildingOfficeIcon class="h-4 w-4 mr-2 text-blue-600" />
                Điểm đến
              </label>
              <div class="relative">
                <select
                  v-model="destinationLocationCode"
                  class="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  required
                >
                  <option value="">Chọn điểm đến</option>
                  <option
                    v-for="airport in vietnamAirports"
                    :key="airport.code"
                    :value="airport.code"
                  >
                    {{ airport.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Dates and Passengers Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 flex items-center">
                <CalendarDaysIcon class="h-4 w-4 mr-2 text-blue-600" />
                Ngày đi
              </label>
              <div class="relative">
                <input
                  v-model="departureDate"
                  type="date"
                  :min="today"
                  class="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div v-if="tripType === 'round-trip'" class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 flex items-center">
                <CalendarDaysIcon class="h-4 w-4 mr-2 text-blue-600" />
                Ngày về
              </label>
              <div class="relative">
                <input
                  v-model="returnDate"
                  type="date"
                  :min="minReturnDate"
                  class="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300"
                  :required="tripType === 'round-trip'"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 flex items-center">
                <UsersIcon class="h-4 w-4 mr-2 text-blue-600" />
                Số hành khách
              </label>
              <div class="relative">
                <select
                  v-model.number="adults"
                  class="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  required
                >
                  <option v-for="n in 9" :key="n" :value="n">{{ n }} người lớn</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Search Button -->
          <div class="flex justify-center pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              @click="showNoResults = true"
              class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[250px] hover:shadow-blue-500/25"
            >
              <MagnifyingGlassIcon v-if="!isLoading" class="h-6 w-6 mr-3" />
              <div
                v-if="isLoading"
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"
              ></div>
              <span class="text-lg">{{ isLoading ? 'Đang tìm kiếm...' : 'Tìm chuyến bay' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-16">
        <div class="relative">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <PaperAirplaneIcon class="h-8 w-8 text-blue-600 animate-pulse transform rotate-45" />
          </div>
        </div>
        <p class="text-gray-600 text-xl font-medium">Đang tìm kiếm chuyến bay tốt nhất cho bạn...</p>
        <div class="flex justify-center mt-4 space-x-1">
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 mb-8 shadow-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-8 w-8 text-red-500" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-bold text-red-800">Có lỗi xảy ra</h3>
            <p class="text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Flight Results -->
      <div v-if="flights.length > 0 && !isLoading" class="space-y-6">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-2xl font-bold text-gray-800 flex items-center">
            <CheckCircleIcon class="h-8 w-8 text-green-600 mr-3" />
            Tìm thấy {{ flights.length }} chuyến bay
          </h3>
          <div class="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">Giá đã bao gồm thuế và phí</div>
        </div>

        <div
          v-for="flight in flights"
          :key="flight.id"
          class="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div v-for="(itinerary, index) in flight.itineraries" :key="index" class="mb-6 last:mb-0">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-6">
                <div class="text-2xl font-bold text-gray-800">
                  {{ formatTime(itinerary.segments[0].departure.at) }}
                </div>
                <div class="flex items-center text-gray-400">
                  <div class="w-12 h-px bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                  <ClockIcon class="h-5 w-5 mx-3 text-blue-600" />
                  <div class="w-12 h-px bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                </div>
                <div class="text-2xl font-bold text-gray-800">
                  {{ formatTime(itinerary.segments[itinerary.segments.length - 1].arrival.at) }}
                </div>
              </div>

              <div class="text-right">
                <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {{ formatPrice(flight.price.total) }}
                </div>
                <div class="text-sm text-gray-500 font-medium mt-1">
                  {{ formatDuration(itinerary.duration) }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 mb-6 bg-gray-50 rounded-xl p-4">
              <div class="flex items-center">
                <span class="font-semibold text-gray-700">Hãng bay:</span>
                <span class="ml-2">{{ getAirlineName(itinerary.segments[0].carrierCode) }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold text-gray-700">Số hiệu:</span>
                <span class="ml-2">{{ itinerary.segments[0].carrierCode }}{{ itinerary.segments[0].number }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold text-gray-700">Ngày bay:</span>
                <span class="ml-2">{{ formatDate(itinerary.segments[0].departure.at) }}</span>
              </div>
            </div>

            <!-- Segment Details -->
            <div v-if="itinerary.segments.length > 1" class="border-t border-gray-200 pt-4 mt-4">
              <p class="text-sm text-orange-600 font-semibold mb-3 flex items-center">
                <ExclamationTriangleIcon class="h-4 w-4 mr-2" />
                Chuyến bay có {{ itinerary.segments.length - 1 }} điểm dừng
              </p>
              <div class="space-y-2">
                <div
                  v-for="(segment, segIndex) in itinerary.segments"
                  :key="segIndex"
                  class="text-xs text-gray-500 bg-orange-50 rounded-lg p-2"
                >
                  {{ segment.departure.iataCode }} → {{ segment.arrival.iataCode }} ({{
                    formatTime(segment.departure.at)
                  }}
                  - {{ formatTime(segment.arrival.at) }})
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-gray-200">
            <button
              @click="selectFlight(flight)"
              class="bg-gradient-to-r from-green-600 to-green-700 text-white px-10 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Đặt vé ngay
            </button>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="
          !isLoading &&
          !error &&
          showNoResults == true &&
          flights.length === 0 &&
          (originLocationCode || destinationLocationCode || departureDate)
        "
        class="text-center py-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2"
      >
        <svg class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 48 48" stroke="currentColor">
          <path
            d="M6 34l36 0M8 30l4-12c.5-1.5 2-2.5 3.6-2.1l13.7 3.2 7.2-7.2c.8-.8 2.1-.8 2.9 0l1.4 1.4c.8.8.8 2.1 0 2.9l-7.2 7.2 3.2 13.7c.4 1.6-.6 3.1-2.1 3.6l-12 4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy chuyến bay</h3>
        <p class="text-gray-600">Vui lòng thử thay đổi tiêu chí tìm kiếm hoặc chọn ngày khác.</p>
      </div>
    </div>

    <!-- Booking Modal -->
    <div
      v-if="showBookingModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 p-4"
    >
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-2xl font-bold text-gray-800">Đặt vé máy bay</h3>
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
          <h4 class="text-xl font-bold text-green-600 mb-2">Đặt vé thành công!</h4>
          <div v-if="bookingResult" class="space-y-2 text-gray-600">
            <p><strong>Mã đặt vé:</strong> {{ bookingResult.bookingReference }}</p>
            <p>Email xác nhận đã được gửi đến hộp thư của bạn.</p>

            <!-- Payment URL handling -->
            <div v-if="bookingResult.paymentUrl" class="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p class="text-yellow-800 font-medium">Đang chuyển hướng đến trang thanh toán...</p>
              <p class="text-sm text-yellow-600 mt-1">
                Nếu không tự động chuyển hướng,
                <a :href="bookingResult.paymentUrl" target="_blank" class="underline"
                  >click vào đây</a
                >
              </p>
            </div>

            <!-- Bank transfer info -->
            <div
              v-else-if="bookingForm.paymentMethod === 'bank_transfer'"
              class="mt-4 p-4 bg-blue-50 rounded-lg"
            >
              <p class="text-blue-800 font-medium">
                Thông tin chuyển khoản đã được gửi đến email của bạn.
              </p>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-4">Cửa sổ này sẽ tự động đóng sau 5 giây...</p>
        </div>

        <!-- Booking Form -->
        <form v-else @submit.prevent="processBooking" class="p-6 space-y-6">
          <!-- Flight Summary -->
          <div class="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 class="font-bold text-blue-800 mb-2">Thông tin chuyến bay</h4>
            <div v-if="selectedFlight" class="text-sm text-blue-700">
              <p>
                <strong>Chuyến bay:</strong>
                {{ getAirlineName(selectedFlight.itineraries[0].segments[0].carrierCode) }}
              </p>
              <p>
                <strong>Tuyến:</strong> {{ originLocationCode }} → {{ destinationLocationCode }}
              </p>
              <p>
                <strong>Ngày:</strong>
                {{ formatDate(selectedFlight.itineraries[0].segments[0].departure.at) }}
              </p>
              <p><strong>Giá:</strong> {{ formatPrice(selectedFlight.price.total) }}</p>
            </div>
          </div>

          <!-- Passenger Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <UserIcon class="h-5 w-5 mr-2" />
                Thông tin hành khách
              </h4>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Họ *</label>
                    <input
                      v-model="bookingForm.firstName"
                      type="text"
                      required
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nguyễn"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                    <input
                      v-model="bookingForm.lastName"
                      type="text"
                      required
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0901234567"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    v-model="bookingForm.dateOfBirth"
                    type="date"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-input"
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số hộ chiếu</label>
                  <input
                    v-model="bookingForm.passportNumber"
                    type="text"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="A1234567"
                  />
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
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Để trống nếu giống hành khách"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Tên người liên hệ</label
                    >
                    <input
                      v-model="bookingForm.contactLastName"
                      type="text"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Để trống nếu giống hành khách"
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
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0901234567"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Ưu tiên chỗ ngồi</label
                  >
                  <select
                    v-model="bookingForm.seatPreference"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="any">Bất kỳ</option>
                    <option value="window">Cửa sổ</option>
                    <option value="aisle">Lối đi</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Yêu cầu đặc biệt</label
                  >
                  <textarea
                    v-model="bookingForm.specialRequests"
                    rows="3"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ví dụ: Suất ăn chay, hỗ trợ xe lăn..."
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
                    ? 'border-blue-500 bg-blue-50'
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Tên trên thẻ *</label>
                <input
                  v-model="bookingForm.cardName"
                  type="text"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="NGUYEN VAN A"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Số thẻ *</label>
                <input
                  v-model="bookingForm.cardNumber"
                  type="text"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn *</label>
                <input
                  v-model="bookingForm.cardExpiry"
                  type="text"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                <input
                  v-model="bookingForm.cardCvv"
                  type="text"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Thông tin chuyển khoản sẽ được gửi đến email sau khi đặt vé.
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
                <a href="#" class="text-blue-600 hover:underline">điều khoản và điều kiện</a> và
                <a href="#" class="text-blue-600 hover:underline">chính sách bảo mật</a> của Travel
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
              class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <div
                v-if="isBooking"
                class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
              ></div>
              {{ isBooking ? 'Đang xử lý...' : 'Xác nhận đặt vé' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fix date input calendar picker */
.date-input {
  position: relative;
}

.date-input::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0;
  z-index: 1;
}

.date-input::-webkit-inner-spin-button,
.date-input::-webkit-clear-button {
  display: none;
}

/* Custom select arrow */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Prevent date picker from extending beyond input boundaries */
input[type='date'] {
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

input[type='date']:focus::-webkit-calendar-picker-indicator {
  opacity: 1;
}
.fixed.inset-0.bg-black.bg-opacity-50.z-100 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
