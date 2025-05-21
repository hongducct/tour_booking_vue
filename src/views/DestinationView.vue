<template>
  <TheHeader />

  <!-- Hero Section -->
  <div
    class="relative w-full h-64 lg:h-80 bg-cover bg-center mt-24"
    style="
      background-image: url('https://res.cloudinary.com/dlhra4ihw/image/upload/v1747734951/o3jn0zgirfrmxttw5wkd.jpg');
    "
  >
    <div class="absolute inset-0 bg-black/50"></div>
    <div
      class="container mx-auto px-8 md:px-16 h-full flex flex-col justify-center items-center relative z-10"
    >
      <h1 class="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">
        Khám Phá Điểm Đến
      </h1>
      <p class="text-white text-lg md:text-xl max-w-2xl text-center">
        Trải nghiệm những chuyến du lịch tuyệt vời đến các điểm đến hấp dẫn trên khắp thế giới
      </p>
    </div>
  </div>

  <!-- Search & Filter Section -->
  <div class="bg-gray-50 border-b">
    <div class="container mx-auto px-8 md:px-16 py-6 max-w-5xl">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <!-- Search Input -->
        <div class="w-full md:w-2/3 lg:w-1/2">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm điểm đến..."
              class="w-full px-4 py-3 pl-12 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
              @input="handleSearch"
            />
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="w-full md:w-1/3 lg:w-1/2 flex gap-3 max-w-md">
          <!-- City Filter -->
          <div class="w-full md:w-1/2">
            <select
              v-model="selectedCity"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer bg-white"
              @change="handleFilter"
            >
              <option value="">Tất cả thành phố</option>
              <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>

          <!-- Sort Options -->
          <div class="w-full md:w-1/2">
            <select
              v-model="sortOption"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer bg-white"
              @change="handleFilter"
            >
              <option value="name">Sắp xếp theo tên (A-Z)</option>
              <option value="nameDesc">Sắp xếp theo tên (Z-A)</option>
              <option value="newest">Mới nhất trước</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Destinations Section -->
  <div class="container mx-auto px-10 md:px-20 py-10 max-w-7xl">
    <!-- Results Count & Reset Filters -->
    <div class="flex justify-between items-center mb-6">
      <div class="text-gray-700">
        <p v-if="filteredLocations.length > 0">
          Hiển thị <span class="font-bold">{{ filteredLocations.length }}</span> điểm đến
        </p>
        <p v-else class="text-gray-500">Không tìm thấy điểm đến nào phù hợp</p>
      </div>
      <button
        v-if="isFiltered"
        @click="resetFilters"
        class="text-blue-600 hover:text-blue-800 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Xóa bộ lọc
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
    </div>

    <!-- No Results -->
    <div
      v-else-if="filteredLocations.length === 0"
      class="flex flex-col items-center justify-center py-16"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="text-xl font-medium text-gray-700 mt-4">Không tìm thấy điểm đến</h3>
      <p class="text-gray-500 mt-2">Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
    </div>

    <!-- Destinations Grid -->
    <div v-else class="destination-grid">
      <router-link
        v-for="(loc, index) in filteredLocations"
        :key="loc.id"
        :to="`/destination/${createSlug(loc.id, loc.name)}`"
        :class="[
          'destination-card relative rounded-lg overflow-hidden shadow-lg group block hover:shadow-xl transition-all duration-300',
          getCardSize(index),
        ]"
      >
        <!-- Badge for new destinations -->
        <div
          v-if="isNewDestination(loc)"
          class="absolute right-3 top-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10"
        >
          MỚI
        </div>

        <!-- Image -->
        <div class="relative h-full overflow-hidden">
          <img
            :src="`${loc.image}`"
            :alt="loc.name"
            class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>

        <!-- Badge City -->
        <div
          class="absolute top-4 left-4 bg-blue-500 text-white text-sm px-3 py-1 rounded-sm font-medium"
        >
          {{ loc.city ? loc.city.toUpperCase() : 'TOUR' }}
        </div>

        <!-- Content -->
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <h3 class="text-white text-lg font-semibold line-clamp-2">{{ loc.name }}</h3>
          <!-- Rating -->
          <div class="flex items-center mt-1">
            <span v-for="star in 5" :key="star" class="text-yellow-400">★</span>
          </div>

          <!-- Details button -->
          <div
            class="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 mt-3"
          >
            <div class="inline-flex items-center text-white text-sm font-medium">
              Xem chi tiết
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="flex justify-center mt-10">
      <nav class="flex items-center space-x-2">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.current_page === 1 }"
          class="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <template v-for="page in displayedPages" :key="page">
          <button v-if="page === '...'" class="px-4 py-2 text-gray-600">...</button>
          <button
            v-else
            @click="changePage(page)"
            :class="{
              'bg-blue-600 text-white': pagination.current_page === page,
              'bg-gray-100 hover:bg-gray-200 text-gray-600': pagination.current_page !== page,
            }"
            class="px-4 py-2 rounded-md font-medium"
          >
            {{ page }}
          </button>
        </template>

        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          :class="{
            'opacity-50 cursor-not-allowed': pagination.current_page === pagination.last_page,
          }"
          class="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </nav>
    </div>
  </div>

  <!-- Newsletter Section -->
  <div class="bg-blue-600 py-12">
    <div class="container mx-auto px-10 md:px-20">
      <div class="max-w-3xl mx-auto text-center">
        <h3 class="text-white text-2xl md:text-3xl font-bold mb-4">
          Đăng ký nhận thông tin ưu đãi
        </h3>
        <p class="text-blue-100 mb-6">Nhận thông báo về những điểm đến mới và ưu đãi đặc biệt</p>
        <div class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            v-model="email"
            type="email"
            placeholder="Email của bạn"
            class="flex-grow px-4 py-3 rounded-md focus:outline-none"
            @keyup.enter="subscribe"
          />
          <button
            @click="subscribe"
            :disabled="isLoadingSubscribe"
            class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-6 py-3 rounded-md transition duration-300"
          >
            {{ isLoadingSubscribe ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>
        </div>
        <p
          v-if="message"
          class="mt-2 text-sm"
          :class="messageType === 'success' ? 'text-green-400' : 'text-red-400'"
        >
          {{ message }}
        </p>
      </div>
    </div>
  </div>

  <TheFooter />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'

const router = useRouter()
const locations = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCity = ref('')
const sortOption = ref('name')
const searchTimeout = ref(null)
const email = ref('')
const message = ref('')
const messageType = ref('')
const isLoadingSubscribe = ref(false)

// Hàm tạo slug từ id và name
const createSlug = (id, name) => {
  return `${id}-${name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`
}

// Hàm xác định kích thước card dựa vào index
const getCardSize = (index) => {
  // Pattern để tạo layout như trong ảnh
  // Cho phép card có nhiều kích thước khác nhau theo vị trí
  const pattern = index % 12

  if (pattern === 0 || pattern === 6) {
    return 'card-large-horizontal' // Card lớn chiếm 2 cột
  } else if (pattern === 1 || pattern === 7) {
    return 'card-normal' // Card thường
  } else if (pattern === 2 || pattern === 8) {
    return 'card-normal' // Card thường
  } else if (pattern === 3 || pattern === 9) {
    return 'card-small' // Card nhỏ
  } else if (pattern === 4 || pattern === 10) {
    return 'card-tall' // Card cao
  } else {
    return 'card-normal' // Card thường
  }
}

// Danh sách các thành phố có sẵn
const availableCities = computed(() => {
  const cities = [...new Set(locations.value.map((loc) => loc.city).filter(Boolean))]
  return cities.sort()
})

// Kiểm tra xem đã áp dụng bộ lọc nào chưa
const isFiltered = computed(() => {
  return searchQuery.value !== '' || selectedCity.value !== '' || sortOption.value !== 'name'
})

// Lọc và sắp xếp các điểm đến
const filteredLocations = computed(() => {
  let result = [...locations.value]

  // Lọc theo từ khóa tìm kiếm
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (loc) =>
        loc.name.toLowerCase().includes(query) ||
        (loc.city && loc.city.toLowerCase().includes(query)) ||
        (loc.description && loc.description.toLowerCase().includes(query)),
    )
  }

  // Lọc theo thành phố
  if (selectedCity.value) {
    result = result.filter((loc) => loc.city === selectedCity.value)
  }

  // Sắp xếp
  if (sortOption.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOption.value === 'nameDesc') {
    result.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
  }

  return result
})

// Xác định điểm đến mới (trong vòng 30 ngày)
const isNewDestination = (location) => {
  if (!location.created_at) return false
  const createdDate = new Date(location.created_at)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return createdDate >= thirtyDaysAgo
}

// Thiết lập phân trang
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})

// Tính toán các trang sẽ hiển thị trong phân trang
const displayedPages = computed(() => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const delta = 1 // Số trang hiển thị trước và sau trang hiện tại
  const pages = []

  // Luôn hiển thị trang đầu tiên
  pages.push(1)

  // Hiển thị "..." nếu cần
  if (current - delta > 2) {
    pages.push('...')
  }

  // Thêm các trang trước trang hiện tại
  for (let i = Math.max(2, current - delta); i < current; i++) {
    pages.push(i)
  }

  // Thêm trang hiện tại nếu không phải trang đầu
  if (current !== 1) {
    pages.push(current)
  }

  // Thêm các trang sau trang hiện tại
  for (let i = current + 1; i <= Math.min(last, current + delta); i++) {
    pages.push(i)
  }

  // Hiển thị "..." nếu cần
  if (current + delta < last - 1) {
    pages.push('...')
  }

  // Luôn hiển thị trang cuối cùng nếu khác trang đầu
  if (last > 1 && !pages.includes(last)) {
    pages.push(last)
  }

  return pages
})

// API functions
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const fetchLocations = async (page = 1) => {
  try {
    loading.value = true
    const res = await axios.get(`${apiBaseUrl}/locations?page=${page}`)

    // Xử lý dữ liệu trả về
    if (res.data && res.data.data) {
      locations.value = res.data.data

      pagination.value = {
        current_page: res.data.current_page || 1,
        last_page: res.data.last_page || 1,
        next_page_url: res.data.next_page_url || null,
        prev_page_url: res.data.prev_page_url || null,
      }
    } else {
      locations.value = res.data || []
      pagination.value.last_page = 1
    }

    console.log('Destinations loaded:', locations.value.length)
  } catch (err) {
    console.error('Error fetching locations:', err.message)
  } finally {
    loading.value = false
  }
}

// Thay đổi trang
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  pagination.value.current_page = page
  fetchLocations(page)
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Xử lý tìm kiếm với debounce
const handleSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    pagination.value.current_page = 1
  }, 300)
}

// Xử lý lọc
const handleFilter = () => {
  pagination.value.current_page = 1
}

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  selectedCity.value = ''
  sortOption.value = 'name'
  pagination.value.current_page = 1
}

const subscribe = async () => {
  if (isLoadingSubscribe.value) return
  isLoadingSubscribe.value = true
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    message.value = 'Please enter a valid email address.'
    messageType.value = 'error'
    return
  }

  try {
    const response = await fetch(`${apiBaseUrl}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    })

    const data = await response.json()
    if (response.ok) {
      message.value = 'Thanks for subscribing! Check your email for travel deals.'
      messageType.value = 'success'
      email.value = ''
    } else {
      message.value = data.message || 'Subscription failed. Please try again.'
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = 'An error occurred. Please try again later.'
    messageType.value = 'error'
  }

  // Clear message after 5 seconds
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 5000)
  isLoadingSubscribe.value = false
}

onMounted(() => {
  fetchLocations()
})

// Theo dõi thay đổi của các bộ lọc và tìm kiếm lại
watch([searchQuery, selectedCity, sortOption], () => {
  if (!searchTimeout.value) {
    pagination.value.current_page = 1
  }
})
</script>

<style scoped>
/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation for cards */
.destination-card {
  transform: translateY(0);
  transition: all 0.3s ease;
}
.destination-card:hover {
  transform: translateY(-5px);
}

/* Grid layout for destinations with different card sizes */
.destination-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 200px;
  grid-auto-flow: dense;
  gap: 20px;
}

/* Card sizes */
.card-normal {
  grid-column: span 2;
  grid-row: span 1;
}

.card-large-horizontal {
  grid-column: span 4;
  grid-row: span 1;
}

.card-small {
  grid-column: span 2;
  grid-row: span 1;
}

.card-tall {
  grid-column: span 2;
  grid-row: span 2;
}

/* Đảm bảo hình ảnh trong card chiếm toàn bộ không gian */
.destination-card .h-full {
  height: 100%;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .destination-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .card-large-horizontal {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .destination-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-large-horizontal,
  .card-normal,
  .card-small,
  .card-tall {
    grid-column: span 2;
    grid-row: span 1;
  }
}

@media (max-width: 640px) {
  .destination-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 220px;
  }

  .card-large-horizontal,
  .card-normal,
  .card-small,
  .card-tall {
    grid-column: span 1;
    grid-row: span 1;
  }
}
</style>
