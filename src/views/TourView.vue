<template>
  <TheHeader />
  <!-- Hero Carousel -->
  <div class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-27">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">Khám Phá Việt Nam</h1>
        <p class="text-xl md:text-2xl mb-8">Trải nghiệm những chuyến du lịch tuyệt vời</p>

        <!-- Quick Stats Carousel -->
        <div class="flex justify-center items-center space-x-8 mt-20">
          <div class="text-center">
            <div class="text-3xl font-bold">{{ allTours.length }}+</div>
            <div class="text-sm opacity-80">Tours Available</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold">{{ availableDates.length }}+</div>
            <div class="text-sm opacity-80">Available Dates</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold">100%</div>
            <div class="text-sm opacity-80">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Wave -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg
        class="w-full h-12 text-white"
        fill="currentColor"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        ></path>
      </svg>
    </div>
  </div>
  <!-- Breadcrumb -->
  <nav class="bg-gray-50 py-4 shadow">
    <div class="container mx-auto px-4">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <RouterLink to="/" class="text-gray-500 hover:text-gray-700">Trang chủ</RouterLink>
        </li>
        <li class="text-gray-400">/</li>
        <li class="text-gray-900 font-medium">Tours</li>
      </ol>
    </div>
  </nav>
  <div class="container mx-auto px-4 py-8">
    <!-- Filters Section -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Lọc Tours</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Price Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
          <div class="space-y-2">
            <input
              v-model="filters.minPrice"
              type="number"
              placeholder="Giá tối thiểu"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              v-model="filters.maxPrice"
              type="number"
              placeholder="Giá tối đa"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        <!-- Location Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Điểm đến</label>
          <select
            v-model="filters.location"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Tất cả điểm đến</option>
            <option v-for="location in uniqueLocations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
          <select
            v-model="filters.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Tất cả danh mục</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Duration Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
          <select
            v-model="filters.duration"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Tất cả thời gian</option>
            <option value="1-3">1-3 ngày</option>
            <option value="4-7">4-7 ngày</option>
            <option value="8+">8+ ngày</option>
          </select>
        </div>
      </div>

      <!-- Date Selection -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Chọn ngày khởi hành</label>

        <!-- Date Input Button -->
        <div class="relative">
          <button
            @click="toggleCalendar"
            class="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span class="text-gray-700">
              {{
                filters.selectedDate
                  ? formatDisplayDate(filters.selectedDate)
                  : 'Chọn ngày khởi hành'
              }}
            </span>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform"
              :class="{ 'rotate-180': showCalendar }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </button>

          <!-- Calendar Popup -->
          <div
            v-if="showCalendar"
            class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-80 calendar-container"
          >
            <!-- Calendar Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                @click="previousMonth"
                class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>

              <h3 class="text-lg font-semibold text-gray-800">
                {{ currentMonthYear }}
              </h3>

              <button
                @click="nextMonth"
                class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- Calendar Grid -->
            <div class="p-4">
              <!-- Day Headers -->
              <div class="grid grid-cols-7 gap-1 mb-2">
                <div
                  v-for="day in ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']"
                  :key="day"
                  class="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {{ day }}
                </div>
              </div>

              <!-- Calendar Days -->
              <div class="grid grid-cols-7 gap-1">
                <div v-for="date in calendarGrid" :key="date.dateString" class="aspect-square">
                  <button
                    v-if="date.inCurrentMonth"
                    @click="selectDate(date.dateString)"
                    :disabled="!date.available || date.isPast"
                    :class="[
                      'w-full h-full rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center',
                      date.available && !date.isPast
                        ? 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 hover:scale-105 cursor-pointer'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed',
                      filters.selectedDate === date.dateString
                        ? 'ring-2 ring-yellow-500 bg-yellow-500 text-white hover:bg-yellow-600'
                        : '',
                      date.isToday && filters.selectedDate !== date.dateString
                        ? 'ring-1 ring-blue-300'
                        : '',
                    ]"
                  >
                    {{ date.day }}
                  </button>
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-gray-300 text-sm"
                  >
                    {{ date.day }}
                  </div>
                </div>
              </div>

              <!-- Legend -->
              <div class="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-yellow-100 rounded-full mr-1"></div>
                  <span>Có tour</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                  <span>Đã chọn</span>
                </div>
              </div>

              <!-- Clear Selection Button -->
              <div class="mt-4 flex justify-between">
                <button
                  @click="clearDateSelection"
                  class="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Xóa lựa chọn
                </button>
                <button
                  @click="closeCalendar"
                  class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Date Display -->
        <div
          v-if="filters.selectedDate"
          class="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg
                class="w-4 h-4 text-yellow-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span class="text-sm font-medium text-yellow-800">
                Ngày khởi hành: {{ formatDisplayDate(filters.selectedDate) }}
              </span>
            </div>
            <button
              @click="clearDateSelection"
              class="text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex justify-between items-center mt-6">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Xóa bộ lọc
        </button>
        <button
          @click="applyFilters"
          class="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="flex justify-between items-center mb-6">
      <div class="text-gray-700">
        Tìm thấy <span class="font-semibold">{{ filteredTours.length }}</span> tours
        <span v-if="hasActiveFilters" class="text-sm text-gray-500">
          (đã lọc từ {{ allTours.length }} tours)
        </span>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Refresh Button -->
        <button
          @click="refreshTours"
          :disabled="isLoading"
          class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          title="Làm mới danh sách tours"
        >
          <svg
            class="w-4 h-4 inline-block mr-1"
            :class="{ 'animate-spin': isLoading }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Làm mới
        </button>

        <!-- Sort Options -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-600">Sắp xếp:</label>
          <select
            v-model="sortBy"
            @change="applySorting"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="name">Tên A-Z</option>
            <option value="name_desc">Tên Z-A</option>
            <option value="price-low">Giá thấp - cao</option>
            <option value="price-high">Giá cao - thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tours Grid -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"
      ></div>
      <p class="text-gray-600">Đang tải danh sách tours...</p>
    </div>

    <div v-else-if="filteredTours.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TourCard v-for="tour in paginatedTours" :key="tour.id" :tour="tour" />
      </div>

      <!-- Pagination -->
      <Pagination :pagination="paginationInfo" @change-page="changePage" class="mt-8" />
    </div>

    <!-- No Results -->
    <div v-else-if="!isLoading" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy tour nào</h3>
      <p class="text-gray-500 mb-4">Hãy thử điều chỉnh bộ lọc để tìm thấy tour phù hợp</p>
      <button
        @click="clearFilters"
        class="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  </div>

  <!-- Overlay for calendar -->
  <div
    v-if="showCalendar"
    @click="closeCalendar"
    class="fixed inset-0 bg-black bg-opacity-20 z-40"
  ></div>

  <TheFooter class="mt-12" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useTourStore } from '@/stores/tourStore'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TourCard from '@/components/TourCard.vue'
import Pagination from '@/components/Pagination.vue'

// Store
const tourStore = useTourStore()

// Router and Route
const route = useRoute()
const router = useRouter()

// Reactive data
const availableDates = ref([])
const currentPage = ref(1)
const itemsPerPage = 12
const sortBy = ref('name')
const showCalendar = ref(false)
const currentCalendarDate = ref(new Date())

// Filters
const filters = ref({
  minPrice: '',
  maxPrice: '',
  location: '',
  category: '',
  duration: '',
  selectedDate: '',
})

// Initialize filters from URL query parameters
const initializeFiltersFromURL = () => {
  const query = route.query

  // Apply filters from URL parameters
  if (query.location) {
    filters.value.location = query.location
  }

  if (query.date) {
    filters.value.selectedDate = query.date
  }

  if (query.minPrice) {
    filters.value.minPrice = query.minPrice
  }

  if (query.maxPrice) {
    filters.value.maxPrice = query.maxPrice
  }

  if (query.category) {
    filters.value.category = query.category
  }

  if (query.duration) {
    filters.value.duration = query.duration
  }

  if (query.page) {
    currentPage.value = parseInt(query.page) || 1
  }

  if (query.sort) {
    sortBy.value = query.sort
  }
}

// Update URL when filters change
const updateURL = () => {
  const query = {}

  if (filters.value.location) query.location = filters.value.location
  if (filters.value.selectedDate) query.date = filters.value.selectedDate
  if (filters.value.minPrice) query.minPrice = filters.value.minPrice
  if (filters.value.maxPrice) query.maxPrice = filters.value.maxPrice
  if (filters.value.category) query.category = filters.value.category
  if (filters.value.duration) query.duration = filters.value.duration
  if (currentPage.value > 1) query.page = currentPage.value
  if (sortBy.value !== 'name') query.sort = sortBy.value

  // Only update if query has changed
  const currentQuery = JSON.stringify(route.query)
  const newQuery = JSON.stringify(query)

  if (currentQuery !== newQuery) {
    router.push({ path: '/tour', query })
  }
}
// Watch for changes in filters and update URL
watch(filters, () => {
  updateURL()
}, { deep: true })
// Watch for changes in currentPage and update URL
watch(currentPage, () => {
  updateURL()
})
// Watch for changes in sortBy and update URL
watch(sortBy, () => {
  updateURL()
})
// Initialize filters from URL on component mount
initializeFiltersFromURL()
// Watch for route changes to reinitialize filters
watch(route, () => {
  initializeFiltersFromURL()
})

// Fetch all tours from store
const fetchTours = async () => {
  try {
    await tourStore.fetchTours()
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu tour:', err)
  }
}

// Fetch available dates
const fetchAvailableDates = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/tour-availability`)
    availableDates.value = response.data
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu lịch:', err)
  }
}

// Computed properties
const allTours = computed(() => tourStore.tours)

const uniqueLocations = computed(() => {
  const locations = allTours.value.map((tour) => tour.location?.name).filter(Boolean)
  return [...new Set(locations)]
})

const uniqueCategories = computed(() => {
  const categories = allTours.value.map((tour) => tour.category).filter(Boolean)
  return [...new Set(categories)]
})

const currentMonthYear = computed(() => {
  return currentCalendarDate.value.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  })
})

const calendarGrid = computed(() => {
  const year = currentCalendarDate.value.getFullYear()
  const month = currentCalendarDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dates = []
  const currentDate = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
    const available = availableDates.value.some((avail) => avail.date === dateString)
    const inCurrentMonth = currentDate.getMonth() === month
    const isPast = currentDate < today
    const isToday = currentDate.getTime() === today.getTime()

    dates.push({
      dateString,
      day: currentDate.getDate(),
      available,
      inCurrentMonth,
      isPast,
      isToday,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
})

const formatDisplayDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  if (date.getTime() === today.getTime()) {
    return 'Hôm nay'
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'Ngày mai'
  } else {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}

const filteredTours = computed(() => {
  let filtered = [...allTours.value]

  if (filters.value.minPrice) {
    filtered = filtered.filter(
      (tour) => parseFloat(tour.price) >= parseFloat(filters.value.minPrice),
    )
  }
  if (filters.value.maxPrice) {
    filtered = filtered.filter(
      (tour) => parseFloat(tour.price) <= parseFloat(filters.value.maxPrice),
    )
  }

  if (filters.value.location) {
    filtered = filtered.filter((tour) => tour.location?.name === filters.value.location)
  }

  if (filters.value.category) {
    filtered = filtered.filter((tour) => tour.category === filters.value.category)
  }

  if (filters.value.duration) {
    const [min, max] = filters.value.duration.split('-').map((d) => d.replace('+', ''))
    filtered = filtered.filter((tour) => {
      const days = tour.days
      if (max) {
        return days >= parseInt(min) && days <= parseInt(max)
      } else {
        return days >= parseInt(min)
      }
    })
  }

  if (filters.value.selectedDate) {
    const availableOnDate = availableDates.value.find(
      (avail) => avail.date === filters.value.selectedDate,
    )
    if (availableOnDate) {
      filtered = filtered.filter((tour) => {
        return availableOnDate.tour_ids.includes(tour.id)
      })
    } else {
      filtered = []
    }
  }

  return filtered
})

const sortedTours = computed(() => {
  const sorted = [...filteredTours.value]

  switch (sortBy.value) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'price-low':
      return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    case 'price-high':
      return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    case 'rating':
      return sorted.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    default:
      return sorted
  }
})

const paginatedTours = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedTours.value.slice(start, end)
})

const paginationInfo = computed(() => {
  const totalPages = Math.ceil(sortedTours.value.length / itemsPerPage)
  return {
    current_page: currentPage.value,
    last_page: totalPages,
    next_page_url: currentPage.value < totalPages ? '#' : null,
    prev_page_url: currentPage.value > 1 ? '#' : null,
  }
})

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some((value) => value !== '')
})

const isLoading = computed(() => tourStore.loading)

// Methods
const refreshTours = async () => {
  try {
    await tourStore.refreshTours()
  } catch (err) {
    console.error('Lỗi khi làm mới dữ liệu tour:', err)
  }
}

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

const closeCalendar = () => {
  showCalendar.value = false
}

const previousMonth = () => {
  const newDate = new Date(currentCalendarDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentCalendarDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentCalendarDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentCalendarDate.value = newDate
}

const selectDate = (dateString) => {
  filters.value.selectedDate = filters.value.selectedDate === dateString ? '' : dateString
  applyFilters()
  // Don't close calendar immediately, let user see the selection
}

const clearDateSelection = () => {
  filters.value.selectedDate = ''
  applyFilters()
}

const clearFilters = () => {
  filters.value = {
    minPrice: '',
    maxPrice: '',
    location: '',
    category: '',
    duration: '',
    selectedDate: '',
  }
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

const applySorting = () => {
  currentPage.value = 1
}

const changePage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Handle click outside calendar
const handleClickOutside = (event) => {
  if (showCalendar.value && !event.target.closest('.calendar-container')) {
    closeCalendar()
  }
}

// Lifecycle
onMounted(() => {
  fetchTours()
  fetchAvailableDates()
  // document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Calendar animations */
.calendar-container {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar for any scrollable content */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

*::-webkit-scrollbar-thumb {
  background: #fbbf24;
  border-radius: 3px;
}

*::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}

/* Animation for tour cards */
.tour-card {
  transition: transform 0.2s ease-in-out;
}

.tour-card:hover {
  transform: translateY(-2px);
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Overlay for calendar */
.fixed.inset-0.bg-black.bg-opacity-20.z-40 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
