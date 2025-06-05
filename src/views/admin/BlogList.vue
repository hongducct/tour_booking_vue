<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header with Title and Add Button -->
      <SectionTitleLineWithButton title="Quản lý Bài viết" :icon="mdiNewspaper" main>
        <BaseButton label="Thêm bài viết" color="info" :icon="mdiPlus" rounded @click="addPost" />
      </SectionTitleLineWithButton>

      <CardBox>
        <!-- Enhanced Filters and Actions -->
        <div class="mb-6 space-y-4">
          <!-- First Row: Category and Status Filters -->
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
              <!-- Category Filter -->
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200"
                  >Danh mục:</label
                >
                <select
                  v-model="categoryFilter"
                  @change="fetchPosts(1)"
                  class="border border-gray-300 rounded-md p-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                >
                  <option value="">Tất cả danh mục</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Status Filter -->
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200"
                  >Trạng thái:</label
                >
                <select
                  v-model="statusFilter"
                  @change="fetchPosts(1)"
                  class="border border-gray-300 rounded-md p-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="draft">Nháp</option>
                  <option value="pending">Đang chờ</option>
                  <option value="rejected">Bị từ chối</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="archived">Đã lưu trữ</option>
                </select>
              </div>

              <!-- Author Type Filter -->
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Tác giả:</label>
                <select
                  v-model="authorTypeFilter"
                  @change="fetchPosts(1)"
                  class="border border-gray-300 rounded-md p-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                >
                  <option value="">Tất cả tác giả</option>
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
            </div>

            <!-- Sort Options -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Sắp xếp:</label>
              <select
                v-model="sortBy"
                @change="fetchPosts(1)"
                class="border border-gray-300 rounded-md p-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              >
                <option value="latest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="featured">Nổi bật</option>
                <option value="popular">Phổ biến</option>
                <option value="trending">Xu hướng</option>
              </select>
            </div>
          </div>

          <!-- Second Row: Search and Actions -->
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-2 flex-1">
              <input
                v-model="search"
                @keyup.enter="fetchPosts(1)"
                type="text"
                placeholder="Tìm kiếm tiêu đề, nội dung, điểm đến..."
                class="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 flex-1"
              />
              <BaseButton
                label="Tìm"
                color="primary"
                :icon="mdiMagnify"
                rounded
                @click="fetchPosts(1)"
              />
            </div>
            <BaseButton
              label="Làm mới"
              color="light"
              :icon="mdiRefresh"
              rounded
              @click="resetFilters"
            />
          </div>

          <!-- Active Filters Display -->
          <div
            v-if="hasActiveFilters"
            class="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200"
          >
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200"
              >Bộ lọc đang áp dụng:</span
            >

            <span
              v-if="search"
              class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              "{{ search }}"
              <button
                @click="((search = ''), fetchPosts(1))"
                class="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>

            <span
              v-if="categoryFilter"
              class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              {{ getCategoryName(categoryFilter) }}
              <button
                @click="((categoryFilter = ''), fetchPosts(1))"
                class="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>

            <span
              v-if="statusFilter"
              class="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              {{ getStatusText(statusFilter) }}
              <button
                @click="((statusFilter = ''), fetchPosts(1))"
                class="ml-1 hover:bg-purple-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>

            <span
              v-if="authorTypeFilter"
              class="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
            >
              {{ authorTypeFilter === 'admin' ? 'Admin' : 'Vendor' }}
              <button
                @click="((authorTypeFilter = ''), fetchPosts(1))"
                class="ml-1 hover:bg-orange-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>

            <button
              @click="resetFilters"
              class="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-10">
          <i class="mdi mdi-loading mdi-spin text-3xl text-blue-500"></i>
          <p class="text-gray-600 mt-2 dark:text-gray-200">Đang tải bài viết...</p>
        </div>

        <!-- Posts Grid -->
        <div
          v-else-if="posts.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="post in posts"
            :key="post.id"
            class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <!-- Image and Status -->
            <div class="relative cursor-pointer" @click="goToDetail(post.id)">
              <img
                v-if="post.image_url"
                :src="post.image_url"
                alt="Thumbnail"
                class="w-full h-48 object-cover rounded-t-lg"
                @error="handleImageError($event)"
              />
              <div
                v-else
                class="w-full h-48 flex items-center justify-center bg-gray-100 rounded-t-lg text-gray-400 text-4xl"
              >
                <i class="mdi mdi-image-off"></i>
              </div>

              <!-- Status Badge -->
              <span
                class="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-semibold"
                :class="statusStyles[post.blog_status]"
              >
                {{ getStatusText(post.blog_status) }}
              </span>

              <!-- Featured Badge -->
              <span
                v-if="post.is_featured"
                class="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-white rounded-md text-xs font-semibold"
              >
                Nổi bật
              </span>
            </div>

            <!-- Post Content -->
            <div class="flex-1 p-4 flex flex-col">
              <!-- Category -->
              <div v-if="post.category" class="mb-2">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :style="{
                    backgroundColor: post.category.color + '20',
                    color: post.category.color,
                  }"
                >
                  {{ post.category.name }}
                </span>
              </div>

              <!-- Title -->
              <h3
                class="text-lg font-semibold text-gray-700 mb-2 cursor-pointer hover:text-blue-400 dark:text-gray-300 dark:hover:text-blue-300 line-clamp-2"
                @click="goToDetail(post.id)"
              >
                {{ post.title }}
              </h3>

              <!-- Author and Date -->
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <i class="mdi mdi-account"></i>
                <span>{{ getAuthorName(post) }}</span>
              </div>

              <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <i class="mdi mdi-calendar"></i>
                <span>{{ formatDate(post.published_at || post.created_at) }}</span>
              </div>

              <!-- Travel Info -->
              <div v-if="post.destination || post.estimated_budget" class="mb-3 space-y-1">
                <div v-if="post.destination" class="flex items-center gap-2 text-sm text-gray-600">
                  <i class="mdi mdi-map-marker"></i>
                  <span>{{ post.destination }}</span>
                </div>
                <div
                  v-if="post.estimated_budget"
                  class="flex items-center gap-2 text-sm text-gray-600"
                >
                  <i class="mdi mdi-currency-usd"></i>
                  <span>{{ formatBudget(post.estimated_budget) }}</span>
                </div>
              </div>

              <!-- Excerpt -->
              <div class="text-gray-600 text-sm mb-4 line-clamp-3">
                <span v-if="post.excerpt">{{ post.excerpt }}</span>
                <span v-else-if="post.content" v-html="truncateContent(post.content, 100)"></span>
                <span v-else>Không có mô tả</span>
              </div>

              <!-- Stats -->
              <div class="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span class="flex items-center gap-1">
                  <EyeIcon class="h-4 w-4" />
                  {{ post.view_count || 0 }}
                </span>
                <span class="flex items-center gap-1">
                  <ChatBubbleLeftIcon class="h-4 w-4" />
                  {{ post.review_count || 0 }}
                </span>
                <span v-if="post.reading_time" class="flex items-center gap-1">
                  <ClockIcon class="h-4 w-4" />
                  {{ post.reading_time }} phút
                </span>
              </div>
              <!-- Actions -->
              <div class="flex gap-2 mt-auto">
                <BaseButton
                  color="warning"
                  label="Sửa"
                  :icon="mdiPencil"
                  small
                  rounded
                  @click="editPost(post.id)"
                />
                <BaseButton
                  color="danger"
                  label="Xóa"
                  :icon="mdiDelete"
                  small
                  rounded
                  @click="confirmDelete(post.id)"
                />
                <BaseButton
                  color="info"
                  label="Chi tiết"
                  :icon="mdiEye"
                  small
                  rounded
                  @click="goToDetail(post.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-10">
          <i class="mdi mdi-newspaper text-4xl text-gray-400"></i>
          <p class="text-gray-600 mt-2">Không có bài viết nào phù hợp với bộ lọc.</p>
        </div>

        <!-- Pagination -->
        <Pagination v-if="posts.length > 0" :pagination="pagination" @change-page="goToPage" />
      </CardBox>
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
import {
  mdiPlus,
  mdiRefresh,
  mdiMagnify,
  mdiPencil,
  mdiDelete,
  mdiEye,
  mdiNewspaper,
} from '@mdi/js'

import { EyeIcon, ChatBubbleLeftIcon, ClockIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const posts = ref([])
const categories = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  links: [],
})

// Filters
const categoryFilter = ref('')
const statusFilter = ref('')
const authorTypeFilter = ref('')
const search = ref('')
const sortBy = ref('latest')
const isLoading = ref(false)

// Status badge styles
const statusStyles = {
  draft: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-orange-100 text-orange-700',
  rejected: 'bg-red-100 text-red-700',
  published: 'bg-teal-100 text-teal-600',
  archived: 'bg-gray-200 text-gray-700',
}

// Computed
const hasActiveFilters = computed(() => {
  return search.value || categoryFilter.value || statusFilter.value || authorTypeFilter.value
})

// Helper functions
function getAuthorName(post) {
  return post.author_type === 'admin' ? post.admin_name || 'Admin' : post.vendor_name || 'Vendor'
}

function getCategoryName(categoryId) {
  const category = categories.value.find((c) => c.id == categoryId)
  return category ? category.name : 'Danh mục'
}

function getStatusText(status) {
  const statusMap = {
    draft: 'Nháp',
    pending: 'Đang chờ',
    rejected: 'Bị từ chối',
    published: 'Đã xuất bản',
    archived: 'Đã lưu trữ',
  }
  return statusMap[status] || status
}

function formatDate(dateString) {
  if (!dateString) return 'Chưa xuất bản'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatBudget(budget) {
  if (!budget) return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(budget)
}

function truncateContent(content, maxLength) {
  if (!content) return ''
  const plainText = content.replace(/<[^>]*>/g, '')
  return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText
}

function handleImageError(event) {
  event.target.src = '/images/placeholder.png'
}

// Fetch functions
async function fetchCategories() {
  try {
    const adminToken = localStorage.getItem('adminToken')
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${baseUrl}/news-categories`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    categories.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

async function fetchPosts(page = 1) {
  isLoading.value = true
  try {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      alert('Bạn cần đăng nhập để truy cập trang này.')
      router.push('/admin/login')
      return
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const params = new URLSearchParams({
      page: page.toString(),
      sort: sortBy.value,
    })

    if (categoryFilter.value) params.append('category_id', categoryFilter.value)
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (authorTypeFilter.value) params.append('author_type', authorTypeFilter.value)
    if (search.value) params.append('search', search.value)

    console.log('params:', params)
    const response = await axios.get(`${baseUrl}/news?${params}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })

    posts.value = response.data.data
    pagination.value = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      next_page_url: response.data.links.next,
      prev_page_url: response.data.links.prev,
      links: response.data.meta.links,
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error)
    alert('Lỗi khi tải danh sách bài viết. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
}

// Navigation functions
function goToDetail(postId) {
  router.push(`/admin/blogs/${postId}`)
}

function editPost(postId) {
  router.push(`/admin/blogs/edit/${postId}`)
}

async function confirmDelete(postId) {
  if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const adminToken = localStorage.getItem('adminToken')
    await axios.delete(`${baseUrl}/news/${postId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    posts.value = posts.value.filter((post) => post.id !== postId)
    alert('Xóa bài viết thành công.')
  } catch (error) {
    console.error('Lỗi khi xóa bài viết:', error)
    alert('Xóa bài viết thất bại.')
  }
}

function goToPage(page) {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchPosts(page)
  }
}

function addPost() {
  router.push('/admin/blogs/create')
}

function resetFilters() {
  categoryFilter.value = ''
  statusFilter.value = ''
  authorTypeFilter.value = ''
  search.value = ''
  sortBy.value = 'latest'
  fetchPosts(1)
}

// Initialize
onMounted(() => {
  fetchCategories()
  fetchPosts()
})
</script>

<style scoped>
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

button {
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}
</style>
