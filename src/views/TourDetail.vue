<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TourCarousel from '@/components/tour/TourCarousel.vue'
import TourInfo from '@/components/tour/TourInfo.vue'
import BookingModal from '@/components/tour/BookingModal.vue'
import PaymentModal from '@/components/tour/PaymentModal.vue'
import SuccessModal from '@/components/tour/SuccessModal.vue'
import QRCodeModal from '@/components/tour/QRCodeModal.vue'
import TourReviews from '@/components/tour/TourReviews.vue'

// Initialize
const route = useRoute()
const router = useRouter()
const tour = ref(null)
const availableDates = ref([])
const prices = ref([])
const showBookingModal = ref(false)
const showPaymentModal = ref(false)
const showSuccessModal = ref(false)
const showQRModal = ref(false)
const bookingId = ref(null)
const vnpayUrl = ref('')
const bookingForm = ref({
  start_date: '',
  number_of_guests_adults: 1,
  number_of_children: 0,
  voucher_code: '',
  special_requests: '',
  contact_phone: '',
})
const errorMessage = ref('')
const voucherMessage = ref(null)
const totalPrice = ref(0)
const discount = ref(0)
const basePrice = ref(0)
const selectedPaymentMethod = ref(null)
const isAuthenticated = ref(!!localStorage.getItem('userToken'))
const loading = ref(false)
const voucherValidated = ref(false) // State to track voucher validation

const today = new Date().toISOString().split('T')[0]

// Payment methods
const paymentMethods = [
  { value: 'cash', label: 'Thanh toán sau (Liên hệ SDT/Zalo: 079.9076.901)' },
  { value: 'vnpay', label: 'VNPay' },
]

// Fetch tour data
const fetchTour = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    console.log('Fetching tour data...', route.params.id)
    const response = await axios.get(`${apiBaseUrl}/tours/${route.params.id}`)
    console.log('Tour data:', response.data)
    tour.value = response.data
    prices.value = response.data.price
    availableDates.value = response.data.availabilities.filter(
      (avail) =>
        avail.is_active && avail.available_slots > 0 && new Date(avail.date) >= new Date(today),
    )
  } catch (error) {
    console.error('Error fetching tour:', error)
    errorMessage.value = 'Không thể tải dữ liệu tour. Vui lòng thử lại.'
  }
}

// Fetch price for selected date
const fetchPrice = async () => {
  if (!bookingForm.value.start_date) {
    basePrice.value = tour.value?.price || 0
    calculateTotalPrice()
    return
  }
  try {
    basePrice.value = prices.value
    calculateTotalPrice()
  } catch (error) {
    basePrice.value = tour.value?.price || 0
    calculateTotalPrice()
    console.error('Error fetching price:', error)
  }
}

// Calculate total price
const calculateTotalPrice = () => {
  const adults = bookingForm.value.number_of_guests_adults || 0
  const children = bookingForm.value.number_of_children || 0
  const price = basePrice.value || tour.value?.price || 0
  totalPrice.value = price * (adults + children * 0.5)
  if (voucherMessage.value && !voucherMessage.value.isError) {
    totalPrice.value = Math.max(0, totalPrice.value - discount.value)
  }
}

// Validate voucher
const validateVoucher = async () => {
  if (!bookingForm.value.voucher_code) {
    voucherMessage.value = null
    discount.value = 0
    return true // No voucher is valid
  }

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const tempPrice =
      basePrice.value *
      (bookingForm.value.number_of_guests_adults + bookingForm.value.number_of_children * 0.5)

    const response = await axios.post(
      `${apiBaseUrl}/vouchers/apply`,
      {
        code: bookingForm.value.voucher_code,
        tour_id: tour.value.id,
        total_price: tempPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      },
    )

    console.log('Voucher response:', response.data)

    discount.value = response.data.data.discount_amount
    voucherMessage.value = {
      text: `Áp dụng voucher thành công! Giảm ${formatPrice(discount.value)}.`,
      isError: false,
    }
    return true
  } catch (error) {
    discount.value = 0
    voucherMessage.value = {
      text: error.response?.data?.message || 'Mã voucher không hợp lệ.',
      isError: true,
    }
    return false
  }
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('vi-VN') + '₫'
}

// Watch changes in number of guests
watch(
  [() => bookingForm.value.number_of_guests_adults, () => bookingForm.value.number_of_children],
  () => {
    calculateTotalPrice()
    voucherValidated.value = false // Reset voucher validation when guest numbers change
  },
)

// Watch changes in start date
watch(
  () => bookingForm.value.start_date,
  () => {
    fetchPrice()
    voucherValidated.value = false // Reset voucher validation when date changes
  },
)

// Watch changes in voucher code
watch(
  () => bookingForm.value.voucher_code,
  () => {
    voucherValidated.value = false // Reset voucher validation when voucher code changes
  },
)

// Open booking modal
const openBookingModal = () => {
  if (!isAuthenticated.value) {
    localStorage.setItem('redirectAfterLogin', route.fullPath)
    router.push('/login')
    return
  }
  showBookingModal.value = true
  voucherValidated.value = false // Reset voucher validation when opening modal
}

// Close booking modal
const closeBookingModal = () => {
  showBookingModal.value = false
  showPaymentModal.value = false
  bookingForm.value = {
    start_date: '',
    number_of_guests_adults: 1,
    number_of_children: 0,
    voucher_code: '',
    special_requests: '',
    contact_phone: '',
  }
  errorMessage.value = ''
  voucherMessage.value = null
  totalPrice.value = 0
  discount.value = 0
  basePrice.value = 0
  selectedPaymentMethod.value = null
  voucherValidated.value = false // Reset voucher validation
}

// Open payment modal with voucher validation
const openPaymentModal = async () => {
  // Clear previous messages
  errorMessage.value = ''
  voucherMessage.value = null

  // Check availability
  const selectedDate = availableDates.value.find(
    (avail) => avail.date === bookingForm.value.start_date,
  )
  if (
    selectedDate &&
    selectedDate.available_slots <
      bookingForm.value.number_of_guests_adults + bookingForm.value.number_of_children
  ) {
    errorMessage.value = 'Số chỗ yêu cầu vượt quá số chỗ còn lại cho ngày này.'
    return
  }

  if (bookingForm.value.voucher_code && !voucherValidated.value) {
    // If voucher code exists and hasn't been validated, validate it
    let isVoucherValid = await validateVoucher()
    if (!isVoucherValid) {
      errorMessage.value = voucherMessage.value.text
      return
    }
    calculateTotalPrice()
    voucherValidated.value = true // Mark voucher as validated
    return // Stay in BookingModal to show updated price/voucher message
  }

  // No voucher code or voucher already validated, proceed to payment modal
  showBookingModal.value = false
  showPaymentModal.value = true
}

// Close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false
  bookingId.value = null
  router.push('/tour')
}

// Close QR modal
const closeQRModal = () => {
  showQRModal.value = false
  router.push('/tour')
}

// Submit booking
const submitBooking = async () => {
  if (!selectedPaymentMethod.value) {
    errorMessage.value = 'Vui lòng chọn phương thức thanh toán.'
    return
  }
  loading.value = true
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    // console.log('Submitting booking with data:', bookingForm.value)
    // console.log('Selected payment method:', selectedPaymentMethod.value)
    const bookingResponse = await axios.post(
      `${apiBaseUrl}/bookings`,
      {
        tour_id: tour.value.id,
        start_date: bookingForm.value.start_date,
        number_of_guests_adults: bookingForm.value.number_of_guests_adults,
        number_of_children: bookingForm.value.number_of_children,
        voucher_code: bookingForm.value.voucher_code || null,
        special_requests: bookingForm.value.special_requests,
        contact_phone: bookingForm.value.contact_phone,
        payment_method: selectedPaymentMethod.value,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      },
    )
    bookingId.value = bookingResponse.data.booking.id
    if ('vnpay'.includes(selectedPaymentMethod.value)) {
      const vnpayResponse = await axios.post(
        `${apiBaseUrl}/payments/vnpay`,
        {
          booking_id: bookingResponse.data.booking.id,
          amount: totalPrice.value,
          method: selectedPaymentMethod.value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        },
      )
      vnpayUrl.value = vnpayResponse.data.vnpay_url
      showPaymentModal.value = false
      window.location.href = vnpayUrl.value
      const paymentId = vnpayResponse.data.payment.id
      const statusInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(`${apiBaseUrl}/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
          })
          if (statusResponse.data.payment.status === 'completed') {
            showSuccessModal.value = true
            clearInterval(statusInterval)
          } else if (statusResponse.data.payment.status === 'failed') {
            errorMessage.value = 'Thanh toán thất bại, vui lòng thử lại.'
            showBookingModal.value = true
            clearInterval(statusInterval)
          }
        } catch (error) {
          console.error('Error checking payment status:', error)
        }
      }, 5000)
    } else {
      showPaymentModal.value = false
      showSuccessModal.value = true
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Lỗi khi đặt tour, vui lòng thử lại.'
    showPaymentModal.value = false
    showBookingModal.value = true
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(() => {
  fetchTour()
})
</script>

<template>
  <TheHeader />
  <section class="py-16 bg-gray-100 min-h-screen mt-30">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      <div v-if="tour" class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <TourCarousel :images="tour.images" />
        <TourInfo :tour="tour" :availableDates="availableDates" />
        <div class="p-6 sm:p-8 flex gap-4">
          <router-link
            to="/tour"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
          >
            Quay lại
          </router-link>
          <button
            @click="openBookingModal"
            class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Đặt tour ngay
          </button>
        </div>
        <TourReviews
            :reviews="tour.reviews"
            :reviewableId="tour.id"
            :reviewableType="'App\\Models\\Tour'"
            title="Đánh giá tour"
          />
        <!-- <TourReviews :reviews="tour.reviews" :tourId="tour.id" /> -->
        <!-- <TourReviews :reviews="tour.reviews" /> -->
      </div>
      <div v-else class="text-center text-gray-500 py-12">
        <p class="text-lg">Đang tải dữ liệu...</p>
      </div>
    </div>
    <BookingModal
      :show="showBookingModal"
      :tour="tour"
      :availableDates="availableDates"
      :bookingForm="bookingForm"
      :totalPrice="totalPrice"
      :discount="discount"
      :voucherMessage="voucherMessage"
      :errorMessage="errorMessage"
      :voucherValidated="voucherValidated"
      @update:show="showBookingModal = $event"
      @update:bookingForm="((bookingForm = $event), calculateTotalPrice())"
      @submit="openPaymentModal"
    />
    <PaymentModal
      :show="showPaymentModal"
      :paymentMethods="paymentMethods"
      :selectedPaymentMethod="selectedPaymentMethod"
      :errorMessage="errorMessage"
      :loading="loading"
      @update:show="showPaymentModal = $event"
      @update:selectedPaymentMethod="selectedPaymentMethod = $event"
      @submit="submitBooking"
    />
    <SuccessModal
      :show="showSuccessModal"
      :bookingId="bookingId"
      @update:show="closeSuccessModal"
    />
    <QRCodeModal
      :show="showQRModal"
      :vnpayUrl="vnpayUrl"
      :totalPrice="totalPrice"
      :bookingId="bookingId"
      @update:show="closeQRModal"
    />
  </section>
  <TheFooter />
</template>

<style scoped>
:root {
  --teal-500: #2dd4bf;
  --teal-600: #0d9488;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
