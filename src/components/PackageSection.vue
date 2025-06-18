<template>
  <section class="package-section py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section heading -->
      <div class="section-heading text-center mb-12">
        <div class="max-w-3xl mx-auto">
          <h5
            class="text-yellow-500 font-medium text-sm mb-2 uppercase tracking-wider relative inline-block before:absolute before:w-8 before:h-0.5 before:bg-yellow-500 before:left-0 before:top-1/2 before:-translate-x-full before:-ml-2 after:absolute after:w-8 after:h-0.5 after:bg-yellow-500 after:right-0 after:top-1/2 after:translate-x-full after:-mr-2"
          >
            KHÁM PHÁ NHỮNG VÙNG ĐẤT TUYỆT VỜI
          </h5>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            NHỮNG TOUR ĐƯỢC YÊU THÍCH
          </h2>
          <p class="text-gray-600">
            {{ bookingPeriodText }}
          </p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"
        ></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center text-red-500 py-10">
        Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
      </div>

      <!-- No tours found -->
      <div v-else-if="tours.length === 0" class="text-center text-gray-500 py-10">
        <p class="text-lg mb-4">Chưa có tour nào được đặt trong tháng này.</p>
        <RouterLink
          to="/tour"
          class="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-md transition duration-300"
        >
          XEM TẤT CẢ TOUR
        </RouterLink>
      </div>

      <!-- Tour list -->
      <div v-else class="package-inner">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="tour in tours" :key="tour.id" class="relative">
            <TourCard :tour="tour" />
            <!-- Booking count badge -->
            <div
              v-if="tour.bookings_this_month_count || tour.total_bookings_count"
              class="absolute top-10 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10"
            >
              {{ tour.bookings_this_month_count || tour.total_bookings_count }} đặt
            </div>
          </div>
        </div>

        <!-- View more button -->
        <div class="text-center mt-12">
          <RouterLink
            to="/tour"
            class="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-md transition duration-300"
          >
            XEM THÊM GÓI TOUR
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import TourCard from './TourCard.vue'
import axios from 'axios'

const tours = ref([])
const loading = ref(true)
const error = ref(null)
const bookingType = ref('this-month') // 'this-month' or 'overall'

// Computed property for dynamic text
const bookingPeriodText = computed(() => {
  if (bookingType.value === 'this-month') {
    const currentMonth = new Date().toLocaleDateString('vi-VN', {
      month: 'long',
      year: 'numeric',
    })
    return `Các tour được đặt nhiều nhất trong ${currentMonth}.`
  }
  return 'Các tour được đặt nhiều nhất từ trước đến nay.'
})

const fetchMostBookedTours = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    // First try to get most booked tours this month
    let response = await axios.get(`${apiBaseUrl}/tours/most-booked/this-month?limit=6`)

    // If no tours found this month, fallback to overall most booked
    if (response.data.data.length === 0) {
      console.log('No tours booked this month, fetching overall most booked tours')
      response = await axios.get(`${apiBaseUrl}/tours/most-booked/overall?limit=6`)
      bookingType.value = 'overall'
    } else {
      bookingType.value = 'this-month'
    }

    tours.value = response.data.data
    loading.value = false

    console.log(`Loaded ${tours.value.length} most booked tours (${bookingType.value})`)
  } catch (err) {
    console.error('Error fetching most booked tours:', err)

    // Fallback to regular tours if both endpoints fail
    try {
      console.log('Falling back to regular tours')
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      const fallbackResponse = await axios.get(`${apiBaseUrl}/tours?perPage=6`)
      tours.value = fallbackResponse.data.data || []
      bookingType.value = 'fallback'
    } catch (fallbackErr) {
      console.error('Fallback also failed:', fallbackErr)
      error.value = 'Không thể tải dữ liệu tour'
    }

    loading.value = false
  }
}

onMounted(() => {
  fetchMostBookedTours()
})
</script>

<style scoped>
/* Add any additional styles if needed */
.package-section {
  position: relative;
}

/* Style for the booking count badge */
.absolute.top-2.right-2 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
