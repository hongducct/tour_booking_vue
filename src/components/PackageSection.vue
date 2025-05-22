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
          <p class="text-gray-600">Các tour được đặt nhiều nhất trong tháng này.</p>
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

      <!-- Tour list -->
      <div v-else class="package-inner">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="tour in displayedTours" :key="tour.id">
            <TourCard :tour="tour" />
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

// Số lượng tour muốn hiển thị
const DISPLAY_LIMIT = 6

// Computed property để chỉ hiển thị số lượng tour theo giới hạn
const displayedTours = computed(() => {
  return tours.value.slice(0, DISPLAY_LIMIT)
})

onMounted(async () => {
  try {
    // Fetch tours (có thể lấy nhiều hơn để có dữ liệu dự phòng)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    const response = await axios.get(`${apiBaseUrl}/tours`)

    tours.value = response.data.data // Adjust based on your API response structure
    loading.value = false
  } catch (err) {
    console.error('Error fetching tours:', err)
    error.value = err.message
    loading.value = false
  }
})
</script>
