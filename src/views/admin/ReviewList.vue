<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <StarIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Quản lý Đánh giá</h1>
              <p class="text-sm text-gray-600">Quản lý và kiểm duyệt đánh giá từ khách hàng</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              @click="activeTab = 'tour'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'tour'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <div class="flex items-center gap-2">
                <MapIcon class="w-5 h-5" />
                Đánh giá Tour
                <span
                  v-if="tourStats.total > 0"
                  class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs"
                >
                  {{ tourStats.total }}
                </span>
              </div>
            </button>
            <button
              @click="activeTab = 'blog'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'blog'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <div class="flex items-center gap-2">
                <DocumentTextIcon class="w-5 h-5" />
                Đánh giá Blog
                <span
                  v-if="blogStats.total > 0"
                  class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs"
                >
                  {{ blogStats.total }}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <!-- Filters Section -->
        <div class="p-6">
          <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div class="flex flex-col sm:flex-row gap-4 flex-1">
              <div class="flex items-center gap-3">
                <AdjustmentsHorizontalIcon class="w-5 h-5 text-gray-500" />
                <span class="text-sm font-medium text-gray-700">Hiển thị:</span>
                <select
                  v-model="perPage"
                  @change="fetchReviews"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div class="flex items-center gap-3">
                <FunnelIcon class="w-5 h-5 text-gray-500" />
                <span class="text-sm font-medium text-gray-700">Trạng thái:</span>
                <select
                  v-model="statusFilter"
                  @change="fetchReviews"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Tất cả</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <button
              @click="fetchReviews"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              <ArrowPathIcon class="w-4 h-4" />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Content -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Người đánh giá
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {{ activeTab === 'tour' ? 'Tour' : 'Blog' }}
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Điểm
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Nội dung
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Ngày gửi
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="review in currentReviews"
                :key="review.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ review.id }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="review.user?.avatar || '/default-avatar.png'"
                      :alt="review.user?.username || 'N/A'"
                      class="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ review.user?.username || 'N/A' }}
                      </div>
                      <div class="text-xs text-gray-500">{{ review.user?.email || '' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 max-w-xs truncate">
                    {{ getReviewableName(review) }}
                  </div>
                  <div v-if="activeTab === 'tour'" class="text-xs text-gray-500">
                    {{ review.reviewable?.category || '' }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-1">
                    <StarIcon
                      v-for="n in 5"
                      :key="n"
                      :class="['w-4 h-4', n <= review.rating ? 'text-yellow-400' : 'text-gray-300']"
                      fill="currentColor"
                    />
                    <span class="ml-1 text-sm font-medium text-gray-600"
                      >({{ review.rating }})</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs">
                    <p class="line-clamp-2">{{ review.comment || 'Không có nội dung' }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="relative">
                    <button
                      :class="getStatusClass(review.status)"
                      @click="toggleDropdown(review.id)"
                      class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                    >
                      {{ getStatusText(review.status) }}
                      <ChevronDownIcon class="w-3 h-3" />
                    </button>
                    <div
                      v-if="activeDropdown === review.id"
                      class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
                    >
                      <button
                        @click="changeReviewStatus(review, 'approved')"
                        class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                      >
                        Approved
                      </button>
                      <button
                        @click="changeReviewStatus(review, 'pending')"
                        class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Pending
                      </button>
                      <button
                        @click="changeReviewStatus(review, 'rejected')"
                        class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ formatDate(review.created_at) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <!-- <button
                      @click="editReview(review.id)"
                      class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button> -->
                    <button
                      @click="deleteReview(review.id)"
                      class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden space-y-4 p-4">
          <div
            v-for="review in currentReviews"
            :key="review.id"
            class="bg-gray-50 rounded-lg p-4 space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-600">#{{ review.id }}</span>
              <span class="text-xs text-gray-500">{{ formatDate(review.created_at) }}</span>
            </div>

            <div class="flex items-center gap-3">
              <img
                :src="review.user?.avatar || '/default-avatar.png'"
                :alt="review.user?.username || 'N/A'"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ review.user?.username || 'N/A' }}</div>
                <div class="text-sm text-gray-500 truncate">
                  {{ getReviewableName(review) }}
                </div>
                <div
                  v-if="activeTab === 'tour' && review.reviewable?.category"
                  class="text-xs text-gray-400"
                >
                  {{ review.reviewable.category }}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <StarIcon
                  v-for="n in 5"
                  :key="n"
                  :class="['w-4 h-4', n <= review.rating ? 'text-yellow-400' : 'text-gray-300']"
                  fill="currentColor"
                />
                <span class="ml-1 text-sm text-gray-600">({{ review.rating }})</span>
              </div>

              <div class="relative">
                <button
                  :class="getStatusClass(review.status)"
                  @click="toggleDropdown(review.id)"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getStatusText(review.status) }}
                  <ChevronDownIcon class="w-3 h-3" />
                </button>
                <div
                  v-if="activeDropdown === review.id"
                  class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
                >
                  <button
                    @click="changeReviewStatus(review, 'approved')"
                    class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                  >
                    Approved
                  </button>
                  <button
                    @click="changeReviewStatus(review, 'pending')"
                    class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Pending
                  </button>
                  <button
                    @click="changeReviewStatus(review, 'rejected')"
                    class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>

            <div v-if="review.comment" class="text-sm text-gray-700 bg-white p-3 rounded-lg">
              {{ review.comment }}
            </div>

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                @click="editReview(review.id)"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm"
              >
                <PencilIcon class="w-4 h-4" />
                Sửa
              </button>
              <button
                @click="deleteReview(review.id)"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                <TrashIcon class="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="currentReviews.length === 0" class="text-center py-12">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <StarIcon class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Không có đánh giá {{ activeTab === 'tour' ? 'tour' : 'blog' }} nào
          </h3>
          <p class="text-gray-500">
            Chưa có đánh giá {{ activeTab === 'tour' ? 'tour' : 'blog' }} nào được tạo.
          </p>
        </div>

        <!-- Enhanced Pagination -->
        <div v-if="currentReviews.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700">
              Hiển thị <span class="font-medium">{{ currentPagination.from || 1 }}</span> đến
              <span class="font-medium">{{ currentPagination.to || currentReviews.length }}</span>
              trong
              <span class="font-medium">{{
                currentPagination.total || currentReviews.length
              }}</span>
              kết quả
            </div>

            <div class="flex items-center gap-3">
              <!-- First Page Button -->
              <button
                :disabled="currentPagination.current_page <= 1"
                @click="goToPage(1)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang đầu"
              >
                <ChevronLeftIcon class="w-4 h-4" />
                <ChevronLeftIcon class="w-4 h-4 -ml-2" />
              </button>

              <!-- Previous Page Button -->
              <button
                :disabled="!currentPagination.prev_page_url"
                @click="goToPage(currentPagination.current_page - 1)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon class="w-4 h-4" />
                Trước
              </button>

              <!-- Page Input -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-700">Trang</span>
                <input
                  v-model="pageInputValue"
                  @keyup.enter="goToInputPage"
                  @blur="goToInputPage"
                  type="number"
                  :min="1"
                  :max="currentPagination.last_page"
                  class="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="currentPagination.current_page.toString()"
                />
                <span class="text-sm text-gray-700">/ {{ currentPagination.last_page }}</span>
              </div>

              <!-- Next Page Button -->
              <button
                :disabled="!currentPagination.next_page_url"
                @click="goToPage(currentPagination.current_page + 1)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
                <ChevronRightIcon class="w-4 h-4" />
              </button>

              <!-- Last Page Button -->
              <button
                :disabled="currentPagination.current_page >= currentPagination.last_page"
                @click="goToPage(currentPagination.last_page)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang cuối"
              >
                <ChevronRightIcon class="w-4 h-4" />
                <ChevronRightIcon class="w-4 h-4 -ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import {
  StarIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'

// Tab management
const activeTab = ref('tour')

// Data storage
const tourReviews = ref([])
const blogReviews = ref([])
const tourPagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  from: null,
  to: null,
  total: null,
})
const blogPagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  from: null,
  to: null,
  total: null,
})

// Stats for tabs
const tourStats = ref({ total: 0 })
const blogStats = ref({ total: 0 })

// Filters and controls
const statusFilter = ref('')
const perPage = ref(10)
const activeDropdown = ref(null)
const baseUrl = import.meta.env.VITE_API_BASE_URL

// Page input for pagination
const pageInputValue = ref('')

// Computed properties
const currentReviews = computed(() => {
  return activeTab.value === 'tour' ? tourReviews.value : blogReviews.value
})

const currentPagination = computed(() => {
  return activeTab.value === 'tour' ? tourPagination.value : blogPagination.value
})

// Watch for tab changes
watch(activeTab, () => {
  fetchReviews()
  pageInputValue.value = '' // Reset page input when switching tabs
})

async function fetchReviews(page = 1) {
  try {
    const type = activeTab.value
    let url = `${baseUrl}/reviews?type=${type}&page=${page}&per_page=${perPage.value}`
    if (statusFilter.value) {
      url += `&status=${statusFilter.value}`
    }

    const response = await axios.get(url)

    const reviewsData = response.data.data
    const paginationData = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      next_page_url: response.data.links.next,
      prev_page_url: response.data.links.prev,
      from: response.data.meta.from,
      to: response.data.meta.to,
      total: response.data.meta.total,
    }

    if (type === 'tour') {
      tourReviews.value = reviewsData
      tourPagination.value = paginationData
      tourStats.value.total = paginationData.total
    } else {
      blogReviews.value = reviewsData
      blogPagination.value = paginationData
      blogStats.value.total = paginationData.total
    }

    // Clear page input after successful fetch
    pageInputValue.value = ''
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error)
    alert('Lỗi khi tải danh sách đánh giá.')
  }
}

// Fetch both tour and blog stats on initial load
async function fetchStats() {
  try {
    // Fetch tour stats
    const tourResponse = await axios.get(`${baseUrl}/reviews?type=tour&per_page=1`)
    tourStats.value.total = tourResponse.data.meta.total

    // Fetch blog stats
    const blogResponse = await axios.get(`${baseUrl}/reviews?type=blog&per_page=1`)
    blogStats.value.total = blogResponse.data.meta.total
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error)
  }
}

function getReviewableName(review) {
  if (activeTab.value === 'tour') {
    return review.reviewable?.name || 'N/A'
  } else {
    // For blog reviews, we might need to show title or description preview
    return review.title || review.reviewable?.name || 'N/A'
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function toggleDropdown(reviewId) {
  activeDropdown.value = activeDropdown.value === reviewId ? null : reviewId
}

function getStatusClass(status) {
  const classes = {
    approved: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  }
  return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

function getStatusText(status) {
  const texts = {
    approved: 'Đã duyệt',
    pending: 'Chờ duyệt',
    rejected: 'Từ chối',
  }
  return texts[status] || status
}

async function changeReviewStatus(review, newStatus) {
  try {
    const oldStatus = review.status
    review.status = newStatus
    activeDropdown.value = null

    await axios.put(
      `${baseUrl}/reviews/${review.id}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      },
    )

    // Show success message
    const statusText = getStatusText(newStatus)
    alert(`Cập nhật trạng thái thành "${statusText}" thành công.`)
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    // Revert the status change
    fetchReviews(currentPagination.value.current_page)
    alert('Cập nhật trạng thái thất bại.')
  }
}

async function deleteReview(reviewId) {
  if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.'))
    return

  try {
    await axios.delete(`${baseUrl}/reviews/${reviewId}`)

    // Remove from current reviews array
    if (activeTab.value === 'tour') {
      tourReviews.value = tourReviews.value.filter((review) => review.id !== reviewId)
    } else {
      blogReviews.value = blogReviews.value.filter((review) => review.id !== reviewId)
    }

    alert('Xóa đánh giá thành công.')

    // If current page is empty and not the first page, go to previous page
    if (currentReviews.value.length === 0 && currentPagination.value.current_page > 1) {
      goToPage(currentPagination.value.current_page - 1)
    }

    // Update stats
    fetchStats()
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error)
    alert('Xóa đánh giá thất bại.')
  }
}

function goToPage(page) {
  if (page >= 1 && page <= currentPagination.value.last_page) {
    fetchReviews(page)
  }
}

function goToInputPage() {
  const page = parseInt(pageInputValue.value, 10)
  if (isNaN(page) || page < 1 || page > currentPagination.value.last_page) {
    alert(`Vui lòng nhập số trang hợp lệ từ 1 đến ${currentPagination.value.last_page}.`)
    return
  }
  fetchReviews(page)
}

function editReview(reviewId) {
  alert(`Chức năng sửa đánh giá với ID: ${reviewId} sẽ được triển khai.`)
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.relative')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  fetchStats()
  fetchReviews()
  document.addEventListener('click', handleClickOutside)
})

// Cleanup event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
