<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header with Title and Back Button -->
      <SectionTitleLineWithButton title="Chi tiết Bài viết" :icon="mdiNewspaper" main>
        <BaseButton label="Quay lại" color="light" :icon="mdiArrowLeft" rounded @click="goBack" />
      </SectionTitleLineWithButton>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-flex items-center justify-center mb-4">
            <ArrowPathIcon class="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <p class="text-gray-600 text-lg">Đang tải chi tiết bài viết...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center max-w-md">
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8">
            <ExclamationTriangleIcon class="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p class="text-gray-600 mb-6">{{ error }}</p>
            <BaseButton
              label="Thử lại"
              color="danger"
              :icon="mdiRefresh"
              rounded
              @click="fetchPost"
            />
          </div>
        </div>
      </div>

      <!-- Post Content -->
      <div v-else-if="post.id" class="space-y-6">
        <!-- Post Header Card -->
        <CardBox class="overflow-hidden">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8">
            <div class="max-w-4xl mx-auto">
              <!-- Post Title -->
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {{ post.title }}
              </h1>

              <!-- Post Meta Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- Author Info -->
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <div class="flex items-center">
                    <UserIcon class="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Tác giả</p>
                      <p class="font-semibold text-gray-800 truncate">{{ getAuthorName() }}</p>
                    </div>
                  </div>
                </div>

                <!-- Author Type -->
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <div class="flex items-center">
                    <ShieldCheckIcon class="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Loại tài khoản</p>
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="
                          post.author_type === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        "
                      >
                        {{ post.author_type === 'admin' ? 'Quản trị viên' : 'Vendor' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Status -->
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <div class="flex items-center">
                    <CheckCircleIcon class="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Trạng thái</p>
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold"
                        :class="statusStyles[post.blog_status]"
                      >
                        <span
                          class="w-1.5 h-1.5 rounded-full mr-1.5"
                          :class="statusDotStyles[post.blog_status]"
                        ></span>
                        {{ getStatusText(post.blog_status) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Published Date -->
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <div class="flex items-center">
                    <CalendarDaysIcon class="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Xuất bản</p>
                      <p class="font-semibold text-gray-800 text-sm">
                        {{ formatDate(post.published_at) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Timestamps -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center text-sm text-gray-600 bg-white rounded-lg px-4 py-2">
                  <PlusCircleIcon class="w-4 h-4 mr-2" />
                  <span class="font-medium mr-2">Tạo:</span>
                  {{ formatDateTime(post.created_at) }}
                </div>
                <div class="flex items-center text-sm text-gray-600 bg-white rounded-lg px-4 py-2">
                  <PencilSquareIcon class="w-4 h-4 mr-2" />
                  <span class="font-medium mr-2">Cập nhật:</span>
                  {{ formatDateTime(post.updated_at) }}
                </div>
              </div>
            </div>
          </div>
        </CardBox>

        <!-- Featured Image Card -->
        <CardBox v-if="post.image_url || !post.image_url">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PhotoIcon class="w-5 h-5 mr-2" />
              Hình ảnh đại diện
            </h3>

            <!-- Has Image -->
            <div v-if="post.image_url" class="relative group">
              <div class="relative overflow-hidden rounded-xl shadow-lg">
                <img
                  :src="post.image_url"
                  :alt="post.title"
                  class="w-full max-h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                  @error="handleImageError($event)"
                />
                <div
                  class="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
                >
                  <button
                    @click="openImageModal"
                    class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg"
                  >
                    <MagnifyingGlassPlusIcon class="w-4 h-4 inline mr-2" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>

            <!-- No Image Placeholder -->
            <div
              v-else
              class="w-full h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
            >
              <div class="text-center">
                <PhotoIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p class="text-gray-500">Không có hình ảnh đại diện</p>
              </div>
            </div>
          </div>
        </CardBox>

        <!-- Content Card -->
        <CardBox>
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon class="w-5 h-5 mr-2" />
              Nội dung bài viết
            </h3>

            <div
              v-if="post.content"
              class="prose prose-lg max-w-none"
              v-html="sanitizedContent"
            ></div>
            <div v-else class="text-center py-12 text-gray-500">
              <DocumentTextIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p class="text-lg italic">Bài viết không có nội dung.</p>
            </div>
          </div>
        </CardBox>

        <!-- Actions Card -->
        <CardBox>
          <div class="p-6">
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div class="flex gap-3">
                <BaseButton
                  label="Quay lại"
                  color="light"
                  :icon="mdiArrowLeft"
                  rounded
                  @click="goBack"
                />
                <BaseButton
                  label="Chỉnh sửa"
                  color="info"
                  :icon="mdiPencil"
                  rounded
                  @click="editPost"
                />
              </div>
              <div class="flex gap-3">
                <BaseButton
                  v-if="post.blog_status === 'published'"
                  label="Ẩn bài viết"
                  color="warning"
                  :icon="mdiEyeOff"
                  rounded
                  @click="toggleStatus"
                />
                <BaseButton
                  v-else
                  label="Xuất bản"
                  color="success"
                  :icon="mdiEye"
                  rounded
                  @click="toggleStatus"
                />
                <BaseButton
                  label="Xóa bài viết"
                  color="danger"
                  :icon="mdiDelete"
                  rounded
                  @click="deletePost"
                />
              </div>
            </div>
          </div>
        </CardBox>
      </div>

      <!-- Image Modal -->
      <div
        v-if="showImageModal"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        @click="closeImageModal"
      >
        <div
          class="relative flex flex-col items-center justify-center max-w-4xl max-h-[90vh] w-full h-full m-auto"
          @click.stop
        >
          <img
            :src="post.image_url"
            :alt="post.title"
            class="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
          <button
            @click="closeImageModal"
            class="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import {
  mdiNewspaper,
  mdiArrowLeft,
  mdiRefresh,
  mdiPencil,
  mdiEye,
  mdiEyeOff,
  mdiDelete,
} from '@mdi/js'
import {
  UserIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassPlusIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const route = useRoute()
const router = useRouter()
const post = ref({})
const isLoading = ref(false)
const error = ref(null)
const showImageModal = ref(false)

// Status badge styles
const statusStyles = {
  draft: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  pending: 'bg-orange-50 text-orange-700 border border-orange-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
  published: 'bg-green-50 text-green-700 border border-green-200',
  archived: 'bg-gray-50 text-gray-700 border border-gray-200',
}

const statusDotStyles = {
  draft: 'bg-yellow-400',
  pending: 'bg-orange-400',
  rejected: 'bg-red-400',
  published: 'bg-green-400',
  archived: 'bg-gray-400',
}

// Get author name based on author_type
function getAuthorName() {
  if (post.value.author_type === 'admin') {
    return post.value.admin_name || 'Super Admin'
  } else {
    return post.value.vendor_name || 'Vendor'
  }
}

// Get status text in Vietnamese
function getStatusText(status) {
  const statusMap = {
    draft: 'Bản nháp',
    pending: 'Chờ duyệt',
    rejected: 'Bị từ chối',
    published: 'Đã xuất bản',
    archived: 'Đã lưu trữ',
  }
  return statusMap[status] || 'Không rõ'
}

// Format date (short format)
function formatDate(dateString) {
  if (!dateString) return 'Chưa có'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Lỗi định dạng'
  }
}

// Format date with time (detailed format)
function formatDateTime(dateString) {
  if (!dateString) return 'Chưa có'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return 'Lỗi định dạng'
  }
}

// Sanitize HTML content
const sanitizedContent = computed(() => {
  if (!post.value.content) return ''
  return post.value.content
})

// Handle image loading error
function handleImageError(event) {
  event.target.src = '/images/placeholder.png'
  event.target.alt = 'Không thể tải hình ảnh'
}

// Open image modal
function openImageModal() {
  showImageModal.value = true
}

// Close image modal
function closeImageModal() {
  showImageModal.value = false
}

// Fetch post details
async function fetchPost() {
  const postId = route.params.id

  if (!postId) {
    error.value = 'ID bài viết không hợp lệ'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      alert('Bạn cần đăng nhập để truy cập trang này.')
      router.push('/admin/login')
      return
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${baseUrl}/news/${postId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.data && response.data.data) {
      post.value = response.data.data
    } else {
      throw new Error('Dữ liệu trả về không đúng định dạng')
    }
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết bài viết:', err)

    if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
    } else if (err.response?.status === 404) {
      error.value = 'Không tìm thấy bài viết này.'
    } else if (err.response?.status === 403) {
      error.value = 'Bạn không có quyền xem bài viết này.'
    } else {
      error.value = 'Không thể tải chi tiết bài viết. Vui lòng thử lại.'
    }
  } finally {
    isLoading.value = false
  }
}

// Navigate back to blog list
function goBack() {
  router.push('/admin/blogs')
}

// Edit post
function editPost() {
  router.push(`/admin/blogs/edit/${post.value.id}`)
}

// Toggle post status
async function toggleStatus() {
  // Implementation for toggling post status
  console.log('Toggle status for post:', post.value.id)
}

// Delete post
async function deletePost() {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const adminToken = localStorage.getItem('adminToken')
      await axios.delete(`${baseUrl}/news/${post.value.id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      toast('Xóa bài viết thành công.', {
        theme: 'auto',
        type: 'success',
        position: 'top-center',
        dangerouslyHTMLString: true,
      })
      setTimeout(() => {
        router.push('/admin/blogs')
      }, 1200) // Đợi toast hiển thị xong rồi mới chuyển trang
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error)
      toast('Không thể xóa bài viết. Vui lòng thử lại.', {
        theme: 'auto',
        type: 'error',
        position: 'top-center',
        dangerouslyHTMLString: true,
      })
    }
  }
}

onMounted(() => {
  fetchPost()
})
</script>

<style scoped>
/* Content styling for HTML content */

.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #111827;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h1 {
  font-size: 2.25rem;
}
.prose h2 {
  font-size: 1.875rem;
}
.prose h3 {
  font-size: 1.5rem;
}
.prose h4 {
  font-size: 1.25rem;
}

.prose p {
  margin-bottom: 1.5rem;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}

.prose img {
  border-radius: 0.5rem;
  margin: 2rem 0;
  max-width: 100%;
  height: auto;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
  margin: 2rem 0;
}

.prose ul,
.prose ol {
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.prose li {
  margin: 0.5rem 0;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 2rem 0;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation classes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
