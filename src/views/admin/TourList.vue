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
              :disabled="tourStore.loading"
            />
            <BaseButton
              v-if="searchQuery"
              color="danger"
              :icon="mdiClose"
              small
              @click="searchQuery = ''"
              :disabled="tourStore.loading"
            />
            <BaseButton
              color="info"
              :icon="mdiRefresh"
              small
              @click="refreshTours"
              :disabled="tourStore.loading"
              title="Làm mới danh sách"
            />
          </div>
        </div>

        <!-- Hiển thị số lượng tour, số tour/trang và sắp xếp -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <template v-if="!tourStore.loading">
              Hiển thị <span class="font-medium">{{ filteredTours.length }}</span> tour
              <span v-if="tourStore.lastFetched" class="text-xs text-gray-500">
                (Cập nhật: {{ formatLastFetched }})
              </span>
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
                :disabled="tourStore.loading"
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
                :disabled="tourStore.loading"
              >
                <option value="name_asc">Tên (A-Z)</option>
                <option value="name_desc">Tên (Z-A)</option>
                <option value="price_asc">Giá (Thấp-Cao)</option>
                <option value="price_desc">Giá (Cao-Thấp)</option>
                <option value="created_desc">Mới nhất</option>
                <option value="created_asc">Cũ nhất</option>
                <option value="id_desc">ID (Cao-Thấp)</option>
                <option value="id_asc">ID (Thấp-Cao)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <TourListSkeleton v-if="tourStore.loading" :count="perPage" />

        <!-- Responsive Grid Tour -->
        <div
          v-else-if="paginatedTours.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <div
            v-for="tour in paginatedTours"
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
                <span
                  class="text-xs bg-green-100 rounded-full px-2 py-0.5 inline-flex items-center transition-colors hover:bg-green-200 dark:bg-green-700 dark:text-green-300 dark:hover:bg-green-600"
                >
                  ID: {{ tour.id }}
                </span>
              </div>
              <span
                class="prose text-xs sm:text-sm text-gray-600 mb-2 flex-grow h-30 overflow-hidden dark:text-gray-300"
                v-html="tour.description"
              ></span>
              <p class="font-bold text-blue-600 mt-2 text-sm sm:text-base dark:text-blue-300">
                {{ formatPrice(tour.price) }}
              </p>
              <p v-if="tour.created_at" class="text-xs text-gray-500 mt-1">
                Tạo: {{ formatDate(tour.created_at) }}
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
        <div v-if="filteredTours.length > 0 && !tourStore.loading" class="mt-6">
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Trang {{ currentPage }} / {{ totalPages }} ({{ startIndex + 1 }}-{{ endIndex }} của
              {{ filteredTours.length }} tour)
            </p>
            <div class="flex gap-2">
              <BaseButton
                :disabled="currentPage === 1"
                @click="currentPage = 1"
                size="sm"
                color="gray"
                label="Đầu"
              />
              <BaseButton
                :disabled="currentPage === 1"
                @click="currentPage--"
                size="sm"
                color="gray"
                :icon="mdiChevronLeft"
              />
              <BaseButton
                :disabled="currentPage === totalPages"
                @click="currentPage++"
                size="sm"
                color="gray"
                :icon="mdiChevronRight"
              />
              <BaseButton
                :disabled="currentPage === totalPages"
                @click="currentPage = totalPages"
                size="sm"
                color="gray"
                label="Cuối"
              />
            </div>
          </div>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { debounce } from 'lodash'
import {
  mdiPlus,
  mdiClose,
  mdiPencil,
  mdiDelete,
  mdiRefresh,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js'
import { useTourStore } from '@/stores/tourStore'

import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import TourListSkeleton from '@/components/admin/tour/TourListSkeleton.vue'

const router = useRouter()
const tourStore = useTourStore()

const searchQuery = ref('')
const sortOption = ref('created_desc') // Default to newest first
const perPage = ref(10)
const currentPage = ref(1)

// Computed properties for filtering and sorting
const filteredTours = computed(() => {
  let tours = [...tourStore.tours]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tours = tours.filter(
      (tour) =>
        tour.name.toLowerCase().includes(query) ||
        tour.description?.toLowerCase().includes(query) ||
        tour.location?.name?.toLowerCase().includes(query) ||
        tour.vendor?.company_name?.toLowerCase().includes(query),
    )
  }

  // Apply sorting
  switch (sortOption.value) {
    case 'name_asc':
      return tours.sort((a, b) => a.name.localeCompare(b.name))
    case 'name_desc':
      return tours.sort((a, b) => b.name.localeCompare(a.name))
    case 'price_asc':
      return tours.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    case 'price_desc':
      return tours.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    case 'created_desc':
      return tours.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    case 'created_asc':
      return tours.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
    case 'id_desc':
      return tours.sort((a, b) => b.id - a.id)
    case 'id_asc':
      return tours.sort((a, b) => a.id - b.id)
    default:
      return tours
  }
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredTours.value.length / perPage.value))
const startIndex = computed(() => (currentPage.value - 1) * perPage.value)
const endIndex = computed(() =>
  Math.min(startIndex.value + perPage.value, filteredTours.value.length),
)

const paginatedTours = computed(() => {
  return filteredTours.value.slice(startIndex.value, endIndex.value)
})

const formatLastFetched = computed(() => {
  if (!tourStore.lastFetched) return ''
  return new Date(tourStore.lastFetched).toLocaleString('vi-VN')
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

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const goToEdit = (id) => {
  router.push(`/admin/tours/${id}/edit`)
}

const addTour = () => {
  router.push('/admin/tours/create')
}

const refreshTours = async () => {
  try {
    await tourStore.refreshTours()
  } catch (err) {
    console.error('Lỗi khi làm mới danh sách tour:', err)
    alert('Không thể làm mới danh sách tour')
  }
}

const deleteTour = async (id) => {
  if (confirm('Bạn có chắc muốn xoá tour này?')) {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      await axios.delete(`${apiBaseUrl}/tours/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
      })

      // Xóa tour khỏi store
      tourStore.removeTour(id)

      // Reset to first page if current page is empty
      if (paginatedTours.value.length === 0 && currentPage.value > 1) {
        currentPage.value = 1
      }
    } catch (err) {
      console.error('Lỗi xoá tour:', err)
      alert('Không thể xóa tour')
    }
  }
}

// Watch for changes and reset pagination
watch([searchQuery, sortOption, perPage], () => {
  currentPage.value = 1
})

// Debounced search
watch(
  searchQuery,
  debounce(() => {
    currentPage.value = 1
  }, 300),
)

onMounted(async () => {
  try {
    await tourStore.fetchTours()
  } catch (err) {
    console.error('Lỗi khi tải danh sách tour:', err)
    alert('Không thể tải danh sách tour')
  }
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
