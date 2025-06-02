<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Quản lý Tour" main>
        <BaseButton label="Thêm tour" color="info" :icon="mdiPlus" @click="addTour" />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <!-- Tìm kiếm - Responsive -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-300">
            Danh sách Tour
          </h1>
          <div class="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm tour..."
              class="border rounded px-3 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              :disabled="isLoading"
            />
            <BaseButton
              v-if="searchQuery"
              color="danger"
              :icon="mdiClose"
              small
              @click="searchQuery = ''"
              :disabled="isLoading"
            />
          </div>
        </div>

        <!-- Hiển thị số lượng tour, số tour/trang và sắp xếp -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <template v-if="!isLoading">
              Hiển thị <span class="font-medium">{{ tours.length }}</span> tour
            </template>
            <template v-else>
              <span class="inline-flex items-center gap-2">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"
                ></div>
                Đang tải...
              </span>
            </template>
          </p>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <div class="flex items-center gap-2">
              <label for="per-page" class="text-sm whitespace-nowrap dark:text-gray-400"
                >Số tour/trang:</label
              >
              <select
                id="per-page"
                v-model="perPage"
                class="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 w-14 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                :disabled="isLoading"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <label for="sort" class="text-sm whitespace-nowrap dark:text-gray-400"
                >Sắp xếp:</label
              >
              <select
                id="sort"
                v-model="sortOption"
                class="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                :disabled="isLoading"
              >
                <option value="name_asc">Tên (A-Z)</option>
                <option value="name_desc">Tên (Z-A)</option>
                <option value="price_asc">Giá (Thấp-Cao)</option>
                <option value="price_desc">Giá (Cao-Thấp)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <TourListSkeleton v-if="isLoading" :count="perPage" />

        <!-- Responsive Grid Tour -->
        <div
          v-else-if="tours.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <div
            v-for="tour in sortedTours"
            :key="tour.id"
            class="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col dark:bg-gray-800 dark:text-gray-200 transform hover:scale-[1.02]"
          >
            <div class="relative overflow-hidden">
              <img
                :src="getPrimaryImage(tour.images)"
                alt="Tour Image"
                class="w-full h-40 sm:h-48 object-cover hover:cursor-pointer transition-all duration-300 hover:scale-105"
                @click="goToEdit(tour.id)"
              />
              <div class="absolute top-0 right-0 m-2">
                <span
                  class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm bg-opacity-90"
                >
                  {{ tour.days }} ngày / {{ tour.nights }} đêm
                </span>
              </div>
              <!-- Hover overlay -->
              <div
                class="absolute inset-0 bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 cursor-pointer flex items-center justify-center"
                @click="goToEdit(tour.id)"
              >
                <div
                  class="transform scale-0 hover:scale-100 transition-transform duration-300 bg-white dark:bg-gray-800 rounded-full p-2"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-gray-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-3 sm:p-4 flex-grow flex flex-col">
              <h2
                class="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate hover:cursor-pointer hover:text-blue-600 transition-colors duration-200 line-clamp-2 dark:text-gray-300 dark:hover:text-blue-400"
                @click="goToEdit(tour.id)"
              >
                {{ tour.name }}
              </h2>
              <div class="flex flex-wrap gap-1 mb-1">
                <span
                  v-if="tour.location?.name"
                  class="text-xs bg-gray-100 rounded-full px-2 py-0.5 inline-flex items-center transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  🏞 {{ tour.location?.name }}
                </span>
                <span
                  v-if="tour.vendor?.company_name"
                  class="text-xs bg-gray-100 rounded-full px-2 py-0.5 inline-flex items-center transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  🏢 {{ tour.vendor?.company_name }}
                </span>
              </div>
              <span
                class="prose text-xs sm:text-sm text-gray-600 mb-2 flex-grow h-30 overflow-hidden dark:text-gray-300"
                v-html="tour.description"
              ></span>
              <p class="font-bold text-blue-600 mt-2 text-sm sm:text-base dark:text-blue-300">
                {{ formatPrice(tour.price) }}
              </p>

              <div class="flex justify-between items-center mt-3 gap-2">
                <BaseButton
                  color="warning"
                  :icon="mdiPencil"
                  small
                  label="Sửa"
                  @click="goToEdit(tour.id)"
                  class="transition-transform hover:scale-105"
                />
                <BaseButton
                  color="danger"
                  :icon="mdiDelete"
                  small
                  label="Xoá"
                  @click="deleteTour(tour.id)"
                  class="transition-transform hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Hiển thị khi không có tour -->
        <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mt-6">
          <div class="flex flex-col items-center justify-center text-center">
            <div class="relative">
              <span class="text-gray-400 text-4xl mb-3 block animate-bounce">📋</span>
              <div
                class="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"
              ></div>
            </div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">
              Không tìm thấy tour
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
              {{
                searchQuery
                  ? 'Không có tour nào khớp với tìm kiếm của bạn.'
                  : 'Hiện chưa có tour nào trong danh sách.'
              }}
            </p>
            <BaseButton
              v-if="searchQuery"
              color="info"
              label="Xóa tìm kiếm"
              :icon="mdiClose"
              @click="searchQuery = ''"
              class="transition-transform hover:scale-105"
            />
          </div>
        </div>

        <!-- Phân trang - Responsive -->
        <div v-if="tours.length > 0 && !isLoading" class="mt-6">
          <Pagination :pagination="pagination" @change-page="fetchTours" />
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { debounce } from 'lodash'
import { mdiPlus, mdiClose, mdiPencil, mdiDelete } from '@mdi/js'

import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import Pagination from '@/components/Pagination.vue'
import TourListSkeleton from '@/components/admin/tour/TourListSkeleton.vue'

const router = useRouter()

const tours = ref([])
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})
const searchQuery = ref('')
const sortOption = ref('name_asc')
const isLoading = ref(false)
const perPage = ref(10) // Default to 10 tours per page

const fetchTours = async (page = 1) => {
  try {
    isLoading.value = true
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/tours`, {
      params: {
        page,
        perPage: perPage.value, // Changed to match controller's perPage
        search: searchQuery.value || undefined,
      },
    })
    console.log('API Response:', response.data) // Debug: Log API response
    console.log('Tours Length:', response.data.data.length) // Debug: Log number of tours
    tours.value = response.data.data
    Object.assign(pagination, {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      next_page_url: response.data.next_page_url,
      prev_page_url: response.data.prev_page_url,
    })
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu tour:', err)
    tours.value = [] // Clear tours on error to show "no results" message
  } finally {
    isLoading.value = false
  }
}

// Sắp xếp tour (client-side, as API sorting not specified)
const sortedTours = computed(() => {
  const toursToSort = [...tours.value]

  switch (sortOption.value) {
    case 'name_asc':
      return toursToSort.sort((a, b) => a.name.localeCompare(b.name))
    case 'name_desc':
      return toursToSort.sort((a, b) => b.name.localeCompare(a.name))
    case 'price_asc':
      return toursToSort.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    case 'price_desc':
      return toursToSort.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    default:
      return toursToSort
  }
})

const getPrimaryImage = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return 'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747423349/pitink1lttzlhp6o2qy0.jpg'
  }

  const primary = images.find((img) => img.is_primary)
  return (
    primary?.image_url ||
    images[0]?.image_url ||
    'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747423349/pitink1lttzlhp6o2qy0.jpg'
  )
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('vi-VN') + '₫'
}

const goToEdit = (id) => {
  router.push(`/admin/tours/${id}/edit`)
}

const addTour = () => {
  router.push('/admin/tours/create')
}

const deleteTour = async (id) => {
  if (confirm('Bạn có chắc muốn xoá tour này?')) {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      await axios.delete(`${apiBaseUrl}/tours/${id}`)
      await fetchTours(pagination.current_page)
    } catch (err) {
      console.error('Lỗi xoá tour:', err)
    }
  }
}

// Watch for changes to searchQuery (debounced), perPage, or sortOption and reset to page 1
watch([perPage, sortOption], () => {
  console.log('PerPage or SortOption changed:', {
    perPage: perPage.value,
    sortOption: sortOption.value,
  }) // Debug: Log changes
  fetchTours(1)
})

watch(
  searchQuery,
  debounce(() => {
    console.log('SearchQuery changed:', searchQuery.value) // Debug: Log search query
    fetchTours(1)
  }, 300),
)

onMounted(() => {
  fetchTours()
})
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.prose {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
}
.prose p {
  margin: 0.5rem 0;
}
.prose ol,
.prose :deep(ul) {
  margin: 0.5rem 0;
  list-style: disc;
  list-style-position: inside;
}
.prose strong {
  font-weight: 600;
}
.prose em {
  font-style: italic;
}
.prose :deep(p) {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  color: var(--navy-900);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}

img {
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
}

img:hover {
  transform: scale(1.05);
  filter: brightness(1.05);
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f3f4f6; /* Tailwind bg-gray-100 */
}
.dark ::-webkit-scrollbar-track {
  background-color: #1f2937; /* Tailwind dark:bg-gray-800 */
}

::-webkit-scrollbar-thumb {
  background-color: #d1d5db; /* Tailwind bg-gray-300 */
  border-radius: 9999px;
}
.dark ::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* Tailwind dark:bg-gray-600 */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af; /* Tailwind bg-gray-400 */
}
.dark ::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280; /* Tailwind dark:bg-gray-500 */
}
</style>
