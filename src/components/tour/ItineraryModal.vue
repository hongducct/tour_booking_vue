<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 mx-4"
    >
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white bg-opacity-20 rounded-lg">
            <ClipboardDocumentListIcon class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-xl font-bold text-white">
            {{ editingIndex !== null ? 'Chỉnh sửa lộ trình' : 'Thêm lộ trình mới' }}
          </h2>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
        >
          <XMarkIcon class="w-6 h-6 text-white" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form @submit.prevent="saveItinerary" class="space-y-6">
          <!-- Basic Information -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-blue-100 rounded-lg">
                <InformationCircleIcon class="w-5 h-5 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Thông tin cơ bản</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <CalendarDaysIcon class="w-4 h-4" />
                  Ngày thứ
                </label>
                <input
                  v-model.number="form.day"
                  type="number"
                  min="1"
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  placeholder="Nhập ngày (1, 2, 3...)"
                />
              </div>
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <TagIcon class="w-4 h-4" />
                  Tiêu đề
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  placeholder="VD: HÀ NỘI – VÂN ĐỒN – QUAN LẠN"
                />
              </div>
            </div>
          </div>

          <!-- Description -->
          <div
            class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon class="w-5 h-5 text-green-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Mô tả chi tiết</h3>
            </div>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm resize-none"
              placeholder="Nhập mô tả chi tiết về lộ trình ngày này..."
            ></textarea>
          </div>

          <!-- Activities -->
          <div
            class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-100 rounded-lg">
                  <SparklesIcon class="w-5 h-5 text-purple-600" />
                </div>
                <h3 class="text-lg font-semibold text-gray-800">Hoạt động</h3>
              </div>
              <button
                type="button"
                @click="addActivity"
                class="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
              >
                <PlusIcon class="w-4 h-4" />
                Thêm hoạt động
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="(activity, index) in form.activities"
                :key="index"
                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200"
              >
                <input
                  v-model="form.activities[index]"
                  type="text"
                  class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="Nhập hoạt động..."
                />
                <button
                  type="button"
                  @click="removeActivity(index)"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
              <p v-if="!form.activities.length" class="text-gray-500 text-center py-4">
                Chưa có hoạt động nào. Nhấn "Thêm hoạt động" để bắt đầu.
              </p>
            </div>
          </div>

          <!-- Time & Details -->
          <div
            class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-orange-100 rounded-lg">
                <ClockIcon class="w-5 h-5 text-orange-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Thời gian & Chi tiết</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <ClockIcon class="w-4 h-4" />
                  Thời gian bắt đầu
                </label>
                <input
                  v-model="form.start_time"
                  type="time"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm"
                />
              </div>
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <ClockIcon class="w-4 h-4" />
                  Thời gian kết thúc
                </label>
                <input
                  v-model="form.end_time"
                  type="time"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm"
                />
              </div>
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <HomeIcon class="w-4 h-4" />
                  Nơi nghỉ đêm
                </label>
                <input
                  v-model="form.accommodation"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm"
                  placeholder="VD: Khách sạn ABC, Resort XYZ..."
                />
              </div>
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <CakeIcon class="w-4 h-4" />
                  Bữa ăn
                </label>
                <input
                  v-model="form.meals"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm"
                  placeholder="VD: Ăn sáng, trưa, tối"
                />
              </div>
            </div>
          </div>

          <!-- Images -->
          <div
            class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-teal-100 rounded-lg">
                <CameraIcon class="w-5 h-5 text-teal-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Hình ảnh lộ trình</h3>
            </div>
            <div class="mb-4">
              <label
                class="flex items-center justify-center w-full h-32 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors duration-200"
              >
                <div class="flex flex-col items-center">
                  <CloudArrowUpIcon class="w-8 h-8 text-teal-500 mb-2" />
                  <span class="text-sm font-medium text-teal-600">Chọn ảnh để tải lên</span>
                  <span class="text-xs text-teal-500 mt-1">PNG, JPG, JPEG (tối đa 10MB)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleImageUpload"
                  class="hidden"
                />
              </label>
            </div>
            <div v-if="form.images.length" class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(image, index) in form.images" :key="index" class="relative group">
                <img
                  :src="image.image_path"
                  :alt="`Itinerary image ${index + 1}`"
                  class="w-full h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <p v-if="!form.images.length" class="text-center text-gray-500 py-4">
              Chưa có ảnh nào được tải lên.
            </p>
          </div>

          <!-- Notes -->
          <div
            class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-gray-100 rounded-lg">
                <PencilSquareIcon class="w-5 h-5 text-gray-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Ghi chú thêm</h3>
            </div>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-white shadow-sm resize-none"
              placeholder="Nhập các ghi chú bổ sung cho lộ trình này..."
            ></textarea>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div
        class="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200"
      >
        <button
          type="button"
          @click="$emit('close')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
        >
          Hủy
        </button>
        <button
          @click="saveItinerary"
          class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center gap-2"
        >
          <CheckIcon class="w-4 h-4" />
          {{ editingIndex !== null ? 'Cập nhật' : 'Lưu lộ trình' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import axios from 'axios'
import {
  XMarkIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  CalendarDaysIcon,
  TagIcon,
  DocumentTextIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  HomeIcon,
  CakeIcon,
  CameraIcon,
  CloudArrowUpIcon,
  PencilSquareIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  itinerary: {
    type: Object,
    default: null,
  },
  editingIndex: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  day: 1,
  title: '',
  description: '',
  activities: [],
  accommodation: '',
  meals: '',
  start_time: '',
  end_time: '',
  notes: '',
  images: [],
})

const resetForm = () => {
  form.day = 1
  form.title = ''
  form.description = ''
  form.activities = []
  form.accommodation = ''
  form.meals = ''
  form.start_time = ''
  form.end_time = ''
  form.notes = ''
  form.images = []
}

const addActivity = () => {
  form.activities.push('')
}

const removeActivity = (index) => {
  form.activities.splice(index, 1)
}

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return

  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: {
            upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          },
        },
      )
      return {
        image_path: uploadRes.data.secure_url,
      }
    })

    const uploadedImages = await Promise.all(uploadPromises)
    form.images = [...form.images, ...uploadedImages]
  } catch (err) {
    console.error('Lỗi upload ảnh:', err)
    alert('Không thể tải ảnh lên.')
  }
}

const removeImage = (index) => {
  form.images.splice(index, 1)
}

const saveItinerary = () => {
  if (!form.title.trim()) {
    alert('Vui lòng nhập tiêu đề lộ trình.')
    return
  }

  if (!form.day || form.day < 1) {
    alert('Vui lòng nhập ngày hợp lệ.')
    return
  }

  // Filter out empty activities
  const activities = form.activities.filter((activity) => activity.trim() !== '')

  const itineraryData = {
    day: form.day,
    title: form.title.trim(),
    description: form.description?.trim() || null,
    activities: activities.length > 0 ? activities : [],
    accommodation: form.accommodation?.trim() || null,
    meals: form.meals?.trim() || null,
    start_time: form.start_time || null,
    end_time: form.end_time || null,
    notes: form.notes?.trim() || null,
    images: form.images,
  }

  emit('save', itineraryData, props.editingIndex)
  resetForm()
}

// Watch for prop changes to populate form when editing
watch(
  () => props.itinerary,
  (newItinerary) => {
    if (newItinerary && props.show) {
      nextTick(() => {
        form.day = newItinerary.day || 1
        form.title = newItinerary.title || ''
        form.description = newItinerary.description || ''
        form.activities = Array.isArray(newItinerary.activities) ? [...newItinerary.activities] : []
        form.accommodation = newItinerary.accommodation || ''
        form.meals = newItinerary.meals || ''
        form.start_time = newItinerary.start_time || ''
        form.end_time = newItinerary.end_time || ''
        form.notes = newItinerary.notes || ''
        form.images = Array.isArray(newItinerary.images) ? [...newItinerary.images] : []
      })
    }
  },
  { immediate: true },
)

// Reset form when modal closes
watch(
  () => props.show,
  (newShow) => {
    if (!newShow) {
      setTimeout(() => {
        resetForm()
      }, 300) // Wait for animation to complete
    }
  },
)
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation for modal */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.fixed .bg-white {
  animation: modalSlideIn 0.3s ease-out;
}

/* Enhanced focus states */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth transitions */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow,
    transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Gradient animations */
@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

/* Image hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:shadow-lg {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
