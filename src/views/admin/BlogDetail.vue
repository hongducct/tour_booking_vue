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
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 rounded-xl shadow-xl/30 dark:bg-gray-800 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300"
          >
            <div class="max-w-6xl mx-auto">
              <!-- Post Title -->
              <div class="flex items-start justify-between mb-6">
                <h1
                  class="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight flex-1 dark:text-gray-100"
                >
                  {{ post.title }}
                </h1>
                <div class="flex gap-2 ml-4">
                  <span
                    v-if="post.is_featured"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    <StarIcon class="w-3 h-3 mr-1" />
                    Nổi bật
                  </span>
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    :class="statusStyles[post.blog_status]"
                  >
                    {{ getStatusText(post.blog_status) }}
                  </span>
                </div>
              </div>

              <!-- Category and Tags -->
              <div class="mb-6 space-y-3">
                <div v-if="post.category" class="flex items-center">
                  <span class="text-sm font-medium text-gray-600 mr-2 dark:text-gray-400"
                    >Danh mục:</span
                  >
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :style="{
                      backgroundColor: post.category.color + '20',
                      color: post.category.color,
                    }"
                  >
                    {{ post.category.name }}
                  </span>
                </div>

                <div v-if="post.tags && post.tags.length > 0" class="flex items-start">
                  <span class="text-sm font-medium text-gray-600 mr-2 mt-1 dark:text-gray-400"
                    >Tags:</span
                  >
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in post.tags"
                      :key="tag"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Post Meta Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- Author Info -->
                <div class="bg-white rounded-xl p-4 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  <div class="flex items-center">
                    <UserIcon class="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide dark:text-gray-200">
                        Tác giả
                      </p>
                      <p class="font-semibold text-gray-800 truncate dark:text-gray-100">
                        {{ getAuthorName() }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Author Type -->
                <div class="bg-white rounded-xl p-4 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  <div class="flex items-center">
                    <ShieldCheckIcon class="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Loại tài khoản</p>
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium dark:text-gray-800"
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

                <!-- View Count -->
                <div class="bg-white rounded-xl p-4 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  <div class="flex items-center">
                    <EyeIcon class="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Lượt xem</p>
                      <p class="font-semibold text-gray-800 dark:text-gray-100">
                        {{ post.view_count || 0 }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Reading Time -->
                <div class="bg-white rounded-xl p-4 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  <div class="flex items-center">
                    <ClockIcon class="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Thời gian đọc</p>
                      <p class="font-semibold text-gray-800 dark:text-gray-100">
                        {{ post.reading_time || 1 }} phút
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Timestamps -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  class="flex items-center text-sm text-gray-600 bg-white rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-300"
                >
                  <CalendarDaysIcon class="w-4 h-4 mr-2" />
                  <span class="font-medium mr-2">Xuất bản:</span>
                  {{ formatDateTime(post.published_at) }}
                </div>
                <div
                  class="flex items-center text-sm text-gray-600 bg-white rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-300"
                >
                  <PencilSquareIcon class="w-4 h-4 mr-2" />
                  <span class="font-medium mr-2">Cập nhật:</span>
                  {{ formatDateTime(post.updated_at) }}
                </div>
              </div>
            </div>
          </div>
        </CardBox>

        <!-- Travel Information Card -->
        <CardBox v-if="hasTraveInfo">
          <div class="p-6">
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-gray-100"
            >
              <MapPinIcon class="w-5 h-5 mr-2" />
              Thông tin du lịch
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Destination -->
              <div v-if="post.destination" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <MapPinIcon class="w-4 h-4 text-blue-500 mr-2" />
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Điểm đến</span>
                </div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">{{ post.destination }}</p>
              </div>

              <!-- Travel Season -->
              <div v-if="post.travel_season" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <SunIcon class="w-4 h-4 text-orange-500 mr-2" />
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Mùa du lịch</span
                  >
                </div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ getTravelSeasonText(post.travel_season) }}
                </p>
              </div>

              <!-- Duration -->
              <div v-if="post.duration_days" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <CalendarDaysIcon class="w-4 h-4 text-green-500 mr-2" />
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Thời gian</span
                  >
                </div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ post.duration_days }} ngày
                </p>
              </div>

              <!-- Budget -->
              <div v-if="post.estimated_budget" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <CurrencyDollarIcon class="w-4 h-4 text-purple-500 mr-2" />
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Ngân sách</span
                  >
                </div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ formatBudget(post.estimated_budget) }}
                </p>
              </div>

              <!-- Coordinates -->
              <div
                v-if="post.latitude && post.longitude"
                class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800"
              >
                <div class="flex items-center mb-2">
                  <GlobeAltIcon class="w-4 h-4 text-red-500 mr-2" />
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Tọa độ</span>
                </div>
                <!-- <p class="font-semibold text-gray-900 text-sm dark:text-gray-100">
                  {{ post.latitude.toFixed(6) }}, {{ post.longitude.toFixed(6) }}
                </p> -->
              </div>
            </div>

            <!-- Travel Tips -->
            <div v-if="post.travel_tips && post.travel_tips.length > 0" class="mt-6">
              <h4 class="text-md font-semibold text-gray-900 mb-3 dark:text-gray-100">
                Mẹo du lịch
              </h4>
              <ul class="space-y-2">
                <li v-for="(tip, index) in post.travel_tips" :key="index" class="flex items-start">
                  <span
                    class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"
                  ></span>
                  <span class="text-gray-700 dark:text-gray-300">{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardBox>

        <!-- SEO Information Card -->
        <CardBox v-if="post.meta_description || post.meta_keywords">
          <div class="p-6">
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-gray-100"
            >
              <MagnifyingGlassIcon class="w-5 h-5 mr-2" />
              Thông tin SEO
            </h3>

            <div class="space-y-4">
              <div v-if="post.meta_description" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <DocumentTextIcon class="w-4 h-4 text-blue-500 mr-2" />
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Meta Description</span
                  >
                </div>
                <p class="text-gray-900 dark:text-gray-100">{{ post.meta_description }}</p>
              </div>

              <div v-if="post.meta_keywords" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <TagIcon class="w-4 h-4 text-green-500 mr-2" />
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Meta Keywords</span
                  >
                </div>
                <p class="text-gray-900 dark:text-gray-100">{{ post.meta_keywords }}</p>
              </div>
            </div>
          </div>
        </CardBox>

        <!-- Featured Image Card -->
        <CardBox>
          <div class="p-6">
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-gray-100"
            >
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
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-gray-300"
            >
              <DocumentTextIcon class="w-5 h-5 mr-2" />
              Nội dung bài viết
            </h3>

            <div
              v-if="post.content"
              class="prose prose-lg max-w-none dark:text-gray-200"
              v-html="sanitizedContent"
            ></div>
            <div v-else class="text-center py-12 text-gray-500 dark:text-gray-200">
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
  MapPinIcon,
  EyeIcon,
  ClockIcon,
  StarIcon,
  SunIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  TagIcon,
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
  draft:
    'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-800 dark:text-yellow-200',
  pending:
    'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-800 dark:text-orange-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-800 dark:text-red-200',
  published:
    'bg-green-50 text-green-700 border border-green-200 dark:bg-green-800 dark:text-green-200',
  archived: 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-200',
}

// Computed
const hasTraveInfo = computed(() => {
  return (
    post.value.destination ||
    post.value.travel_season ||
    post.value.duration_days ||
    post.value.estimated_budget ||
    (post.value.latitude && post.value.longitude) ||
    (post.value.travel_tips && post.value.travel_tips.length > 0)
  )
})

const sanitizedContent = computed(() => {
  if (!post.value.content) return ''
  return post.value.content
})

// Helper functions
function getAuthorName() {
  if (post.value.author_type === 'admin') {
    return post.value.admin_name || 'Super Admin'
  } else {
    return post.value.vendor_name || 'Vendor'
  }
}

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

function getTravelSeasonText(season) {
  const seasons = {
    spring: 'Mùa xuân',
    summer: 'Mùa hè',
    autumn: 'Mùa thu',
    winter: 'Mùa đông',
    all_year: 'Quanh năm',
  }
  return seasons[season] || season
}

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

function formatBudget(budget) {
  if (!budget) return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(budget)
}

function handleImageError(event) {
  event.target.src = '/images/placeholder.png'
  event.target.alt = 'Không thể tải hình ảnh'
}

function openImageModal() {
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
}

// API functions
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

function goBack() {
  router.push('/admin/blogs')
}

function editPost() {
  router.push(`/admin/blogs/edit/${post.value.id}`)
}

async function toggleStatus() {
  const newStatus = post.value.blog_status === 'published' ? 'draft' : 'published'

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const adminToken = localStorage.getItem('adminToken')

    await axios.put(
      `${baseUrl}/news/${post.value.id}`,
      {
        blog_status: newStatus,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    )

    post.value.blog_status = newStatus

    toast.success(`Đã ${newStatus === 'published' ? 'xuất bản' : 'ẩn'} bài viết thành công!`, {
      position: 'top-right',
      autoClose: 3000,
    })
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái:', error)
    toast.error('Không thể thay đổi trạng thái bài viết. Vui lòng thử lại.', {
      position: 'top-right',
      autoClose: 3000,
    })
  }
}

async function deletePost() {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const adminToken = localStorage.getItem('adminToken')
      await axios.delete(`${baseUrl}/news/${post.value.id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      toast.success('Xóa bài viết thành công.', {
        position: 'top-right',
        autoClose: 3000,
      })
      setTimeout(() => {
        router.push('/admin/blogs')
      }, 1200)
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error)
      toast.error('Không thể xóa bài viết. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }
}

onMounted(() => {
  fetchPost()
})
</script>

<style scoped>
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

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

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
