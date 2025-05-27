<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header with Title and Add Button -->
      <SectionTitleLineWithButton title="Quản lý Bài viết" :icon="mdiNewspaper" main>
        <BaseButton label="Thêm bài viết" color="info" :icon="mdiPlus" rounded @click="addPost" />
      </SectionTitleLineWithButton>

      <CardBox>
        <!-- Filters and Actions -->
        <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
            <!-- Status Filter -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">Trạng thái:</label>
              <select
                v-model="statusFilter"
                @change="fetchPosts(1)"
                class="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label class="text-sm font-medium text-gray-700">Tác giả:</label>
              <select
                v-model="authorTypeFilter"
                @change="fetchPosts(1)"
                class="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả tác giả</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
            <!-- Search Input -->
            <div class="flex items-center gap-2">
              <input
                v-model="search"
                @keyup.enter="fetchPosts(1)"
                type="text"
                placeholder="Tìm kiếm tiêu đề..."
                class="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <BaseButton
                label="Tìm"
                color="primary"
                :icon="mdiMagnify"
                rounded
                @click="fetchPosts(1)"
              />
            </div>
          </div>
          <BaseButton
            label="Làm mới"
            color="light"
            :icon="mdiRefresh"
            rounded
            @click="resetFilters"
          />
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-10">
          <i class="mdi mdi-loading mdi-spin text-3xl text-blue-500"></i>
          <p class="text-gray-600 mt-2">Đang tải bài viết...</p>
        </div>

        <!-- Posts Grid -->
        <div
          v-else-if="posts.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="post in posts"
            :key="post.id"
            class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
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
              <span
                class="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-semibold capitalize"
                :class="statusStyles[post.blog_status]"
              >
                {{
                  post.blog_status === 'draft'
                    ? 'Draft'
                    : post.blog_status === 'pending'
                      ? 'Pending'
                      : post.blog_status === 'rejected'
                        ? 'Rejected'
                        : post.blog_status === 'published'
                          ? 'Published'
                          : 'Archived'
                }}
              </span>
            </div>
            <!-- Post Content -->
            <div class="flex-1 p-4 flex flex-col">
              <h3
                class="text-lg font-semibold text-blue-700 mb-2 cursor-pointer hover:underline"
                @click="goToDetail(post.id)"
              >
                {{ post.title }}
              </h3>
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <i class="mdi mdi-account"></i>
                <span>{{
                  post.author_type === 'admin' ? post.admin_name : post.vendor_name || 'Không rõ'
                }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <i class="mdi mdi-calendar"></i>
                <span>{{
                  post.published_at ? formatDate(post.published_at) : 'Chưa xuất bản'
                }}</span>
              </div>
              <div class="text-gray-600 text-sm mb-4 line-clamp-3">
                {{ truncateContent(post.content, 100) || 'Không có mô tả.' }}
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
        <Pagination
          v-if="posts.length > 0"
          :pagination="pagination"
          @change-page="goToPage"
        />
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
import { mdiPlus, mdiRefresh, mdiMagnify, mdiPencil, mdiDelete, mdiEye, mdiNewspaper, mdiChevronLeft, mdiChevronRight } from '@mdi/js'

const router = useRouter()
const posts = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  links: [],
})
const statusFilter = ref('')
const authorTypeFilter = ref('')
const search = ref('')
const isLoading = ref(false)

// Status badge styles
const statusStyles = {
  draft: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-orange-100 text-orange-700',
  rejected: 'bg-red-100 text-red-700',
  published: 'bg-teal-100 text-teal-600',
  archived: 'bg-gray-200 text-gray-700',
}

// Computed property for pagination links
const paginationLinks = computed(() => {
  return pagination.value.links.filter(link => link.label !== '« Previous' && link.label !== 'Next »')
})

// Format date to Vietnamese locale
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

// Truncate content for preview
function truncateContent(content, maxLength) {
  if (!content) return ''
  return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
}

// Handle image loading error
function handleImageError(event) {
  event.target.src = '/images/placeholder.png' // Fallback image
}

// Parse page number from pagination label
function parsePageNumber(label) {
  if (label === '« Previous') return pagination.value.current_page - 1
  if (label === 'Next »') return pagination.value.current_page + 1
  return parseInt(label)
}

// Fetch posts from API
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
    let url = `${baseUrl}/news?page=${page}`
    if (statusFilter.value) url += `&status=${statusFilter.value}`
    if (authorTypeFilter.value) url += `&author_type=${authorTypeFilter.value}`
    if (search.value) url += `&search=${encodeURIComponent(search.value)}`

    const config = {
      headers: { Authorization: `Bearer ${adminToken}` },
    }

    const response = await axios.get(url, config)
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
    posts.value = posts.value.filter(post => post.id !== postId)
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
  statusFilter.value = ''
  authorTypeFilter.value = ''
  search.value = ''
  fetchPosts(1)
}

// Initial fetch
onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
/* Tailwind handles most styling, but custom styles for specific cases */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for buttons */
button {
  transition: all 0.2s ease-in-out;
}

/* Hover effects for cards */
.card:hover {
  transform: translateY(-2px);
}
</style>
