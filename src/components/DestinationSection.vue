<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Section Heading -->
    <div class="mb-10">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between">
        <div class="lg:w-7/12">
          <h5 class="text-blue-600 font-semibold text-sm mb-2 flex items-center">
            <span class="inline-block w-8 h-0.5 bg-blue-600 mr-3"></span>
            POPULAR DESTINATION
          </h5>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800">ĐIỂM ĐẾN HÀNG ĐẦU</h2>
        </div>
        <div class="lg:w-5/12 mt-4 lg:mt-0">
          <p class="text-gray-600">
            Khám phá ngay các tour, hoạt động du lịch và địa điểm tham quan cho hành trình du lịch
            của bạn.
          </p>
        </div>
      </div>
    </div>

    <!-- Destinations Grid -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
    </div>

    <div v-else class="destination-grid">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- First column (larger destinations) - 2 ô chữ nhật dọc -->
        <div class="lg:col-span-7">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="(destination, index) in featuredDestinations.slice(0, 2)" :key="index">
              <DestinationItem
                :destination="destination"
                :is-featured="true"
                layout="vertical"
                @click="navigateToDestination(destination.id, destination.name)"
              />
            </div>
          </div>
        </div>

        <!-- Second column (smaller destinations) - 2 ô chữ nhật ngang -->
        <div class="lg:col-span-5">
          <div class="grid grid-cols-1 gap-4">
            <div v-for="(destination, index) in featuredDestinations.slice(2, 4)" :key="index">
              <DestinationItem
                :destination="destination"
                layout="horizontal"
                @click="navigateToDestination(destination.id, destination.name)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- View More Button -->
      <div class="text-center mt-6">
        <router-link
          to="/destination"
          class="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-sm transition duration-300"
        >
          XEM THÊM ĐIỂM ĐẾN
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import DestinationItem from './DestinationItem.vue'

const router = useRouter()
const destinations = ref([])
const loading = ref(true)

// Lấy base URL từ biến môi trường
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// Số lượng điểm đến muốn hiển thị trên trang chính
const FEATURED_LIMIT = 4

// Hàm tạo slug từ id và name
const createSlug = (id, name) => {
  return `${id}-${name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`
}

// Lấy các điểm đến nổi bật
const featuredDestinations = computed(() => {
  return destinations.value.slice(0, FEATURED_LIMIT).map((location) => ({
    id: location.id,
    name: location.name,
    img: location.image,
    city: location.city || '',
    url: `/destination/${createSlug(location.id, location.name)}`,
    title: location.description || location.name,
    rating: '100%',
  }))
})

// Chuyển hướng khi click vào điểm đến
const navigateToDestination = (id, name) => {
  router.push(`/destination/${createSlug(id, name)}`)
}

// Lấy dữ liệu từ API
const fetchDestinations = async () => {
  try {
    loading.value = true
    const res = await axios.get(`${apiBaseUrl}/locations`)

    // Kiểm tra cấu trúc dữ liệu trả về
    if (res.data && res.data.data) {
      destinations.value = res.data.data
    } else {
      destinations.value = res.data || []
    }
  } catch (err) {
    console.error('Error fetching destinations:', err.message)
  } finally {
    loading.value = false
  }
}

// Gọi API khi component được mount
onMounted(() => {
  fetchDestinations()
})
</script>

<style scoped>
/* Dash style cho tiêu đề section */
.dash-style {
  position: relative;
}
</style>
