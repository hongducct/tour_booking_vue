<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header with Title and Back Button -->
      <SectionTitleLineWithButton title="Chỉnh sửa Bài viết" :icon="mdiNewspaper" main>
        <BaseButton label="Quay lại" color="light" :icon="mdiArrowLeft" rounded @click="goBack" />
      </SectionTitleLineWithButton>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-flex items-center justify-center mb-4">
            <ArrowPathIcon class="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <p class="text-gray-600 text-lg dark:text-gray-200 ">Đang tải dữ liệu bài viết...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center max-w-md">
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8">
            <ExclamationTriangleIcon class="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-200 ">Có lỗi xảy ra</h3>
            <p class="text-gray-600 mb-6 dark:text-gray-200">{{ error }}</p>
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

      <!-- Edit Form -->
      <CardBox v-else-if="form.title" class="max-w-4xl mx-auto">
        <form @submit.prevent="updatePost" class="space-y-6 p-6">
          <!-- Title Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200 ">
              <DocumentTextIcon class="w-4 h-4 mr-2" />
              Tiêu đề bài viết *
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              :class="{'border-red-500': updateError}"
              placeholder="Nhập tiêu đề bài viết..."
              required
              @input="markAsChanged"
            />
          </div>

          <!-- Featured Image Section - Using BlogImageUpload Component -->
          <BlogImageUpload
            :value="form.image"
            @update:value="updateFeaturedImage"
            @error="imageError = $event"
            @loading="imageLoading = $event"
            @insert-image="insertImageToContent"
          />

          <!-- Rich Text Editor -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200 ">
              <PencilSquareIcon class="w-4 h-4 mr-2" />
              Nội dung bài viết *
            </label>
            <RichTextEditor
              ref="richTextEditor"
              :value="form.content"
              @update:value="updateContent"
              @update:active-formats="activeFormats = $event"
              @open-image-modal="openImageInsertModal"
            />
            <p class="text-sm text-gray-500 mt-2">
              Sử dụng editor để định dạng văn bản, chèn hình ảnh và tạo nội dung đa phương tiện.
            </p>
          </div>

          <!-- Meta Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Status -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200 ">
                <CheckCircleIcon class="w-4 h-4 mr-2" />
                Trạng thái
              </label>
              <select
                v-model="form.blog_status"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                @change="markAsChanged"
              >
                <option value="draft">Bản nháp</option>
                <option value="pending">Chờ duyệt</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
            </div>

            <!-- Author Info (Read-only) -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200 ">
                <UserIcon class="w-4 h-4 mr-2" />
                Tác giả
              </label>
              <input
                :value="getAuthorName()"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                :class="{'border-red-500': updateError}"
                readonly
              />
            </div>
          </div>

          <!-- Timestamps (Read-only) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200 ">
                <CalendarDaysIcon class="w-4 h-4 mr-2" />
                Ngày xuất bản
              </label>
              <input
                :value="formatDateTime(form.published_at)"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                readonly
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200 ">
                <PlusCircleIcon class="w-4 h-4 mr-2" />
                Ngày tạo
              </label>
              <input
                :value="formatDateTime(form.created_at)"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                readonly
              />
            </div>
          </div>

          <!-- Unsaved Changes Indicator -->
          <div
            v-if="hasUnsavedChanges"
            class="bg-orange-50 border border-orange-200 rounded-xl p-4"
          >
            <div class="flex items-center text-orange-700">
              <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-3"></span>
              <span class="font-medium">Có thay đổi chưa được lưu</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200"
          >
            <div class="flex gap-3">
              <BaseButton
                label="Quay lại"
                color="light"
                :icon="mdiArrowLeft"
                rounded
                @click="goBack"
              />
            </div>
            <div class="flex gap-3">
              <BaseButton
                label="Lưu nháp"
                color="warning"
                :icon="mdiContentSave"
                rounded
                :loading="loading"
                @click="saveDraft"
              />
              <BaseButton
                label="Cập nhật"
                color="success"
                :icon="mdiCheck"
                rounded
                :loading="loading"
                type="submit"
              />
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-xl p-4">
            <div class="flex items-center text-green-700">
              <CheckCircleIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">Cập nhật bài viết thành công!</span>
            </div>
          </div>

          <div v-if="updateError" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-center text-red-700">
              <ExclamationTriangleIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">{{ updateError }}</span>
            </div>
          </div>

          <!-- Image Upload Error from BlogImageUpload -->
          <div v-if="imageError" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-center text-red-700">
              <ExclamationTriangleIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">{{ imageError }}</span>
            </div>
          </div>
        </form>
      </CardBox>

      <!-- Image Insert Modal for RichTextEditor -->
      <ImageInsertModal
        :show="showImageInsertModal"
        :image-url="imageUrl"
        :image-size="imageSize"
        @update:show="showImageInsertModal = $event"
        @update:image-url="imageUrl = $event"
        @update:image-size="imageSize = $event"
        @insert="insertImage"
      />
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import RichTextEditor from '@/components/blog/RichTextEditor.vue'
import BlogImageUpload from '@/components/blog/BlogImageUpload.vue'
import ImageInsertModal from '@/components/blog/ImageInsertModal.vue'
import { mdiNewspaper, mdiArrowLeft, mdiRefresh, mdiContentSave, mdiCheck } from '@mdi/js'
import {
  DocumentTextIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  UserIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const adminToken = localStorage.getItem('adminToken')

// Form data
const form = ref({
  title: '',
  content: '',
  blog_status: 'draft',
  image: '',
  author_type: '',
  admin_name: '',
  vendor_name: '',
  published_at: '',
  created_at: '',
  updated_at: '',
})

// State management
const isLoading = ref(false)
const loading = ref(false)
const error = ref(null)
const updateError = ref('')
const success = ref(false)
const hasUnsavedChanges = ref(false)

// Image related states
const imageError = ref('')
const imageLoading = ref(false)

// RichTextEditor related states
const showImageInsertModal = ref(false)
const imageUrl = ref('')
const imageSize = ref('medium')
const activeFormats = ref([])
const richTextEditor = ref(null)

// Check authentication
if (!adminToken) {
  alert('Bạn cần đăng nhập để truy cập trang này.')
  router.push('/admin/login')
}

// Get author name based on author_type
function getAuthorName() {
  if (form.value.author_type === 'admin') {
    return form.value.admin_name || 'Super Admin'
  } else {
    return form.value.vendor_name || 'Vendor'
  }
}

// Format date with time
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

// Mark form as changed
function markAsChanged() {
  hasUnsavedChanges.value = true
}

// Handle content updates from RichTextEditor
function updateContent(newContent) {
  console.log('Content updated from RichTextEditor:', newContent.length, 'characters')
  form.value.content = newContent
  markAsChanged()
}

// Handle featured image updates from BlogImageUpload
function updateFeaturedImage(newImageUrl) {
  console.log('Featured image updated:', newImageUrl)
  form.value.image = newImageUrl
  markAsChanged()
}

// Handle image insertion from BlogImageUpload component
function insertImageToContent(url, size) {
  console.log('Inserting image to content:', url, size)
  if (richTextEditor.value && richTextEditor.value.insertImage) {
    richTextEditor.value.insertImage(url, size)
    markAsChanged()
  } else {
    console.warn('RichTextEditor reference not available or insertImage method not found')
  }
}

// RichTextEditor image insertion functions
function openImageInsertModal() {
  showImageInsertModal.value = true
}

function insertImage(url, size) {
  if (richTextEditor.value) {
    richTextEditor.value.insertImage(url, size)
    showImageInsertModal.value = false
    imageUrl.value = ''
    imageSize.value = 'medium'
    markAsChanged()
  }
}

// Fetch post data
async function fetchPost() {
  const postId = route.params.id

  if (!postId) {
    error.value = 'ID bài viết không hợp lệ'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${baseUrl}/news/${postId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.data && response.data.data) {
      const post = response.data.data
      form.value = {
        title: post.title || '',
        content: post.content || '',
        blog_status: post.blog_status || 'draft',
        image_url: post.image_url || '',
        author_type: post.author_type || '',
        admin_name: post.admin_name || '',
        vendor_name: post.vendor_name || '',
        published_at: post.published_at || '',
        created_at: post.created_at || '',
        updated_at: post.updated_at || '',
      }
      hasUnsavedChanges.value = false
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
      error.value = 'Bạn không có quyền chỉnh sửa bài viết này.'
    } else {
      error.value = 'Không thể tải dữ liệu bài viết. Vui lòng thử lại.'
    }
  } finally {
    isLoading.value = false
  }
}

// Update post
async function updatePost() {
  if (!form.value.title.trim()) {
    updateError.value = 'Vui lòng nhập tiêu đề bài viết.'
    return
  }

  if (!form.value.content.trim()) {
    updateError.value = 'Vui lòng nhập nội dung bài viết.'
    return
  }

  loading.value = true
  updateError.value = ''
  success.value = false
  imageError.value = ''

  // Force emit content từ RichTextEditor để đảm bảo có content mới nhất
  if (richTextEditor.value && richTextEditor.value.forceEmitContent) {
    richTextEditor.value.forceEmitContent()
  }

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const updateData = {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      blog_status: form.value.blog_status,
    }

    // Add image_url if it exists
    if (form.value.image && form.value.image.trim()) {
      updateData.image = form.value.image.trim()
    }

    // console.log ra kiểm tra image_url có được cập nhật không
    console.log('Updating post with data:', updateData)

    await axios.put(`${baseUrl}/news/${route.params.id}`, updateData, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    success.value = true
    hasUnsavedChanges.value = false

    setTimeout(() => {
      router.push('/admin/blogs')
    }, 1500)
  } catch (err) {
    console.error('Lỗi khi cập nhật bài viết:', err)

    if (err.response?.status === 401) {
      updateError.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
    } else if (err.response?.status === 403) {
      updateError.value = 'Bạn không có quyền cập nhật bài viết này.'
    } else {
      updateError.value =
        err.response?.data?.message || 'Không thể cập nhật bài viết. Vui lòng thử lại.'
    }
  } finally {
    loading.value = false
  }
}

// Save as draft
async function saveDraft() {
  const originalStatus = form.value.blog_status
  form.value.blog_status = 'draft'

  await updatePost()

  // Restore original status if update failed
  if (updateError.value) {
    form.value.blog_status = originalStatus
  }
}

// Navigation functions
function goBack() {
  if (hasUnsavedChanges.value) {
    if (confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?')) {
      router.push('/admin/blogs')
    }
  } else {
    router.push('/admin/blogs')
  }
}

// Before unload warning
function handleBeforeUnload(e) {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?'
    return e.returnValue
  }
}

onMounted(() => {
  fetchPost()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
/* Form styling */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Loading animations */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .max-w-4xl {
    max-width: 100%;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .p-6 {
    padding: 1rem;
  }

  .space-y-6 > * + * {
    margin-top: 1rem;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus styles */
input:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}

/* RichTextEditor styles */
:deep(.ql-editor) {
  min-height: 200px;
}

/* Visual indicator for unsaved changes */
.unsaved-changes {
  position: relative;
}

.unsaved-changes::after {
  content: '•';
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: orange;
  color: white;
  border-radius: 50%;
  padding: 0.25rem;
  font-size: 0.75rem;
}
</style>
