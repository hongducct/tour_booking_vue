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
          <button
            @click="addReview"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <PlusIcon class="w-5 h-5" />
            Thêm đánh giá
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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

      <!-- Reviews Table/Cards -->
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
                  Tour
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
                v-for="review in reviews"
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
                    {{ review.reviewable?.name || 'N/A' }}
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
                    <button
                      @click="editReview(review.id)"
                      class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
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
            v-for="review in reviews"
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
                  {{ review.reviewable?.name || 'N/A' }}
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
        <div v-if="reviews.length === 0" class="text-center py-12">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <StarIcon class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Không có đánh giá nào</h3>
          <p class="text-gray-500">Chưa có đánh giá nào được tạo.</p>
        </div>

        <!-- Pagination -->
        <div v-if="reviews.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700">
              Hiển thị <span class="font-medium">{{ pagination.from || 1 }}</span> đến
              <span class="font-medium">{{ pagination.to || reviews.length }}</span> trong
              <span class="font-medium">{{ pagination.total || reviews.length }}</span> kết quả
            </div>

            <div class="flex items-center gap-2">
              <button
                :disabled="!pagination.prev_page_url"
                @click="goToPage(pagination.current_page - 1)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon class="w-4 h-4" />
                Trước
              </button>

              <span class="px-3 py-2 text-sm font-medium text-gray-700">
                Trang {{ pagination.current_page }} / {{ pagination.last_page }}
              </span>

              <button
                :disabled="!pagination.next_page_url"
                @click="goToPage(pagination.current_page + 1)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import {
  StarIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const reviews = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  from: null,
  to: null,
  total: null,
})
const statusFilter = ref('')
const perPage = ref(10)
const activeDropdown = ref(null)
const baseUrl = import.meta.env.VITE_API_BASE_URL

async function fetchReviews(page = 1) {
  try {
    let url = `${baseUrl}/reviews?page=${page}&per_page=${perPage.value}`
    if (statusFilter.value) {
      url += `&status=${statusFilter.value}`
    }
    const response = await axios.get(url)
    reviews.value = response.data.data
    pagination.value = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      next_page_url: response.data.links.next,
      prev_page_url: response.data.links.prev,
      from: response.data.meta.from,
      to: response.data.meta.to,
      total: response.data.meta.total,
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error)
    alert('Lỗi khi tải danh sách đánh giá.')
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

    await axios.put(`${baseUrl}/reviews/${review.id}`, { status: newStatus })

    // Show success message
    const statusText = getStatusText(newStatus)
    alert(`Cập nhật trạng thái thành "${statusText}" thành công.`)
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    // Revert the status change
    fetchReviews(pagination.value.current_page)
    alert('Cập nhật trạng thái thất bại.')
  }
}

async function deleteReview(reviewId) {
  if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.'))
    return

  try {
    await axios.delete(`${baseUrl}/reviews/${reviewId}`)
    reviews.value = reviews.value.filter((review) => review.id !== reviewId)
    alert('Xóa đánh giá thành công.')

    // If current page is empty and not the first page, go to previous page
    if (reviews.value.length === 0 && pagination.value.current_page > 1) {
      goToPage(pagination.value.current_page - 1)
    }
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error)
    alert('Xóa đánh giá thất bại.')
  }
}

function goToPage(page) {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchReviews(page)
  }
}

function addReview() {
  alert('Chức năng thêm đánh giá sẽ được triển khai.')
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
