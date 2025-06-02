<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header with Title and Add Button -->
      <SectionTitleLineWithButton title="Quản lý Địa điểm" :icon="mdiMapMarker" main>
        <BaseButton
          label="Thêm địa điểm"
          color="info"
          :icon="mdiPlus"
          rounded
          @click="showCreateModal = true"
        />
      </SectionTitleLineWithButton>

      <CardBox>
        <!-- Modern Filters and Actions -->
        <div class="mb-8 space-y-4">
          <!-- Search Bar -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="search"
              @keyup.enter="fetchDestinations(1)"
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
            />
          </div>

          <!-- Filters Row -->
          <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div class="flex flex-col sm:flex-row gap-3">
              <!-- Country Filter -->
              <div class="relative">
                <select
                  v-model="countryFilter"
                  @change="fetchDestinations(1)"
                  class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out min-w-[140px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                >
                  <option value="">🌍 Tất cả quốc gia</option>
                  <option v-for="country in uniqueCountries" :key="country" :value="country">
                    {{ country }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDownIcon class="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <!-- City Filter -->
              <div class="relative">
                <select
                  v-model="cityFilter"
                  @change="fetchDestinations(1)"
                  class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out min-w-[140px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                >
                  <option value="">🏙️ Tất cả thành phố</option>
                  <option v-for="city in uniqueCities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDownIcon class="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <BaseButton
                label="Làm mới"
                color="light"
                :icon="mdiRefresh"
                rounded
                @click="resetFilters"
              />
              <BaseButton
                label="Xem bản đồ"
                color="secondary"
                :icon="mdiEarth"
                rounded
                @click="toggleMapView"
              />
            </div>
          </div>
        </div>

        <!-- Map View Toggle -->
        <div
          v-if="showMapView"
          class="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <GlobeAltIcon class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-800">Bản đồ địa điểm</h3>
            </div>
            <BaseButton
              label="Đóng"
              color="light"
              :icon="XMarkIcon"
              small
              rounded
              @click="toggleMapView"
            />
          </div>
          <div
            class="bg-white rounded-xl h-80 flex items-center justify-center border-2 border-dashed border-blue-200 shadow-inner"
          >
            <div class="text-center text-gray-500">
              <GlobeAltIcon class="w-16 h-16 mx-auto mb-3 text-blue-300" />
              <p class="text-lg font-medium mb-1">Bản đồ sẽ được tích hợp ở đây</p>
              <p class="text-sm">Hiển thị vị trí các địa điểm với tọa độ GPS</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-16">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <p class="text-gray-600 text-lg">Đang tải địa điểm...</p>
        </div>

        <!-- Destinations Grid -->
        <div
          v-else-if="destinations.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="destination in destinations"
            :key="destination.id"
            class="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 dark:bg-gray-600 dark:text-white dark:border-gray-500"
          >
            <!-- Image Container -->
            <div class="relative overflow-hidden h-48">
              <img
                v-if="destination.image"
                :src="getImageUrl(destination.image)"
                :alt="destination.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                @error="handleImageError($event)"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
              >
                <PhotoIcon class="w-20 h-20 text-gray-300" />
              </div>

              <!-- Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>

              <!-- Badges -->
              <div class="absolute top-3 left-3 right-3 flex justify-between">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm"
                >
                  <GlobeAltIcon class="w-3 h-3 mr-1" />
                  {{ destination.country }}
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100/90 backdrop-blur-sm text-green-800 shadow-sm"
                >
                  <MapPinIcon class="w-3 h-3 mr-1" />
                  GPS
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-4">
              <div>
                <h3
                  class="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors duration-200 line-clamp-2 group-hover:text-blue-400 dark:text-gray-200 dark:hover:text-blue-300"
                  @click="viewTours(destination.id)"
                >
                  {{ destination.name }}
                </h3>

                <div class="flex items-center gap-2 text-sm text-gray-600 mb-3 dark:text-gray-200">
                  <BuildingOfficeIcon class="w-4 h-4 text-gray-400" />
                  <span>{{ destination.city }}</span>
                </div>
              </div>

              <p class="text-gray-600 text-sm line-clamp-3 leading-relaxed dark:text-gray-200">
                {{ destination.description || 'Chưa có mô tả cho địa điểm này.' }}
              </p>

              <!-- Coordinates Info -->
              <div class="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-500">
                <div class="flex justify-between items-center">
                  <span>Lat: {{ destination.latitude?.toFixed(4) || 'N/A' }}</span>
                  <span>Lng: {{ destination.longitude?.toFixed(4) || 'N/A' }}</span>
                </div>
              </div>

              <!-- Tours Count -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <BuildingStorefrontIcon class="w-5 h-5 text-indigo-500" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Tours:</span>
                  <span
                    class="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold"
                  >
                    {{ getToursCount(destination.id) }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-2">
                <BaseButton
                  color="primary"
                  label="Xem Tours"
                  :icon="mdiEye"
                  small
                  rounded
                  @click="viewTours(destination.id)"
                  class="flex-1"
                />
                <BaseButton
                  color="warning"
                  label="Sửa"
                  :icon="mdiPencil"
                  small
                  rounded
                  @click="editDestination(destination.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6"
          >
            <MapPinIcon class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Không có địa điểm nào</h3>
          <p class="text-gray-500 mb-8 max-w-sm mx-auto">
            Không tìm thấy địa điểm nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh bộ lọc hoặc
            thêm địa điểm mới.
          </p>
          <BaseButton
            label="Thêm địa điểm đầu tiên"
            color="primary"
            :icon="mdiPlus"
            rounded
            @click="showCreateModal = true"
          />
        </div>

        <!-- Pagination -->
        <div v-if="destinations.length > 0" class="mt-8">
          <Pagination :pagination="pagination" @change-page="goToPage" />
        </div>
      </CardBox>

      <!-- Tours Modal -->
      <div
        v-if="showToursModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeToursModal"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="p-2 bg-white/20 rounded-lg">
                  <MapPinIcon class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-white">
                    Tours tại {{ selectedDestination?.name }}
                  </h2>
                  <p class="text-blue-100 text-sm">
                    {{ selectedDestination?.city }}, {{ selectedDestination?.country }}
                  </p>
                </div>
              </div>
              <button
                @click="closeToursModal"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <XMarkIcon class="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
            <!-- Loading State -->
            <div v-if="isLoadingTours" class="text-center py-12">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
              >
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
              <p class="text-gray-600 text-lg">Đang tải tours...</p>
            </div>

            <!-- Tours List -->
            <div v-else-if="tours.length > 0" class="space-y-6">
              <div
                v-for="tour in tours"
                :key="tour.id"
                class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
              >
                <div class="flex flex-col lg:flex-row gap-6">
                  <!-- Tour Image -->
                  <div class="lg:w-64 flex-shrink-0">
                    <div class="relative overflow-hidden rounded-xl">
                      <img
                        v-if="tour.images && tour.images.length > 0"
                        :src="tour.images[0].image_url"
                        :alt="tour.name"
                        class="w-full h-48 lg:h-36 object-cover hover:scale-105 transition-transform duration-300"
                        @error="handleImageError($event)"
                      />
                      <div
                        v-else
                        class="w-full h-48 lg:h-36 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl"
                      >
                        <PhotoIcon class="w-12 h-12 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <!-- Tour Info -->
                  <div class="flex-1 space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <h3
                        class="text-xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                      >
                        {{ tour.name }}
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"
                        >
                          {{ tour.category }}
                        </span>
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800"
                        >
                          {{ tour.days }}D{{ tour.nights }}N
                        </span>
                      </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        <BuildingStorefrontIcon class="w-5 h-5 text-gray-400" />
                        <span>{{ tour.vendor?.company_name || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <CurrencyDollarIcon class="w-5 h-5 text-green-500" />
                        <span class="font-bold text-green-600 text-lg">
                          {{ formatPrice(tour.price) }}
                        </span>
                      </div>
                    </div>

                    <p class="text-gray-600 leading-relaxed line-clamp-3">
                      {{ tour.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty Tours State -->
            <div v-else class="text-center py-12">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6"
              >
                <BuildingStorefrontIcon class="w-8 h-8 text-gray-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Chưa có tour nào</h3>
              <p class="text-gray-500">Địa điểm này chưa có tour du lịch nào được đăng ký.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Location Modal -->
      <LocationModal
        :show="showCreateModal"
        @close="showCreateModal = false"
        @created="handleLocationCreated"
      />
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import Pagination from '@/components/Pagination.vue'
import LocationModal from '@/components/tour/LocationModal.vue'
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  XMarkIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
import { mdiMapMarker, mdiPlus, mdiRefresh, mdiEye, mdiPencil, mdiEarth } from '@mdi/js'

const router = useRouter()

// State
const destinations = ref([])
const tours = ref([])
const selectedDestination = ref(null)
const toursCount = ref({})
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  links: [],
})

// Filters
const countryFilter = ref('')
const cityFilter = ref('')
const search = ref('')

// Loading states
const isLoading = ref(false)
const isLoadingTours = ref(false)

// Modal states
const showToursModal = ref(false)
const showMapView = ref(false)
const showCreateModal = ref(false)

// Computed properties
const uniqueCountries = computed(() => {
  const countries = destinations.value.map((dest) => dest.country).filter(Boolean)
  return [...new Set(countries)].sort()
})

const uniqueCities = computed(() => {
  const cities = destinations.value.map((dest) => dest.city).filter(Boolean)
  return [...new Set(cities)].sort()
})

// Helper functions
function getImageUrl(imageName) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  return imageName.startsWith('http') ? imageName : `${baseUrl}/images/${imageName}`
}

function handleImageError(event) {
  event.target.src = '/images/placeholder.png'
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

function getToursCount(destinationId) {
  return toursCount.value[destinationId] || 0
}

const adminToken = localStorage.getItem('adminToken')
const baseUrl = import.meta.env.VITE_API_BASE_URL

// API functions
async function fetchDestinations(page = 1) {
  isLoading.value = true
  try {
    if (!adminToken) {
      alert('Bạn cần đăng nhập để truy cập trang này.')
      router.push('/admin/login')
      return
    }
    let url = `${baseUrl}/locations?page=${page}`
    const params = new URLSearchParams()
    if (countryFilter.value) params.append('country', countryFilter.value)
    if (cityFilter.value) params.append('city', cityFilter.value)
    if (search.value) params.append('search', search.value)

    if (params.toString()) {
      url += `&${params.toString()}`
    }

    const config = {
      headers: { Authorization: `Bearer ${adminToken}` },
    }

    const response = await axios.get(url, config)
    destinations.value = response.data.data
    pagination.value = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      next_page_url: response.data.links.next,
      prev_page_url: response.data.links.prev,
      links: response.data.meta.links || [],
    }
    await fetchToursCount()
  } catch (error) {
    console.error('Lỗi khi lấy danh sách địa điểm:', error)
    alert('Lỗi khi tải danh sách địa điểm. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
}

async function fetchToursCount() {
  try {
    const locationIds = destinations.value.map((dest) => dest.id)
    if (!locationIds.length) {
      toursCount.value = {}
      return
    }
    const config = {
      headers: { Authorization: `Bearer ${adminToken}` },
    }
    const response = await axios.post(
      `${baseUrl}/locations/tour-counts`,
      { location_ids: locationIds },
      config,
    )
    toursCount.value = response.data.counts
  } catch (error) {
    console.error('Lỗi khi lấy số lượng tours:', error)
    toursCount.value = destinations.value.reduce((acc, dest) => {
      acc[dest.id] = 0
      return acc
    }, {})
  }
}

async function fetchTours(destinationId) {
  isLoadingTours.value = true
  try {
    const config = {
      headers: { Authorization: `Bearer ${adminToken}` },
    }
    const response = await axios.get(`${baseUrl}/locations/${destinationId}/tours`, config)
    tours.value = response.data.tours.data
    selectedDestination.value = response.data.location
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tours:', error)
    alert('Lỗi khi tải danh sách tours. Vui lòng thử lại.')
    tours.value = []
  } finally {
    isLoadingTours.value = false
  }
}

// Navigation functions
async function viewTours(destinationId) {
  showToursModal.value = true
  await fetchTours(destinationId)
}

function closeToursModal() {
  showToursModal.value = false
  selectedDestination.value = null
  tours.value = []
}

function editDestination(destinationId) {
  router.push(`/admin/destinations/edit/${destinationId}`)
}

function goToPage(page) {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchDestinations(page)
  }
}

function resetFilters() {
  countryFilter.value = ''
  cityFilter.value = ''
  search.value = ''
  showMapView.value = false
  fetchDestinations(1)
}

function toggleMapView() {
  showMapView.value = !showMapView.value
}

function handleLocationCreated(newLocation) {
  showCreateModal.value = false
  fetchDestinations(1)
}

// Initial fetch
onMounted(() => {
  fetchDestinations()
})
</script>

<style scoped>
/* Custom line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Enhanced backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .xl\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Modern select styling */
select {
  background-image: none;
}

/* Focus styles */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Card hover animations */
.group {
  transform-origin: center;
}

.group:hover {
  transform: translateY(-0.25rem);
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
}
.group:hover .group-hover\:shadow-xl {
  box-shadow:
    0 10px 15px rgba(0, 0, 0, 0.1),
    0 4px 6px rgba(0, 0, 0, 0.08);
}
.group:hover .group-hover\:border-blue-200 {
  border-color: #bfdbfe; /* Tailwind's blue-200 */
}
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Modal styles */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(16px);
}
.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
.overflow-y-auto {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
.prose {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
}
.prose p {
  margin: 0.5rem 0;
}
.prose ul,
.prose ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
.prose strong {
  font-weight: 600;
}
.prose em {
  font-style: italic;
}
</style>
