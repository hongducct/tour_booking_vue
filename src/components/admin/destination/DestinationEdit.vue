<template>
  <transition
    name="modal"
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 scale-95"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white bg-opacity-20 rounded-lg">
                <PencilIcon v-if="isEditing" class="w-6 h-6 text-white" />
                <PlusIcon v-else class="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-white">
                  {{ isEditing ? 'Chỉnh sửa địa điểm' : 'Tạo địa điểm mới' }}
                </h2>
                <p class="text-blue-100 text-sm">
                  {{ isEditing ? 'Cập nhật thông tin địa điểm' : 'Thêm địa điểm du lịch mới' }}
                </p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-12">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
            >
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <p class="text-gray-600 text-lg">
              {{ isEditing ? 'Đang tải thông tin...' : 'Đang xử lý...' }}
            </p>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submitForm" class="space-y-6">
            <!-- Basic Info Section -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <InformationCircleIcon class="w-5 h-5 text-gray-600" />
                Thông tin cơ bản
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="form.name"
                  label="Tên địa điểm"
                  required
                  class="w-full"
                  :icon="TagIcon"
                  :error="errors.name?.[0]"
                />

                <BaseInput
                  v-model="form.country"
                  label="Quốc gia"
                  required
                  class="w-full"
                  :icon="GlobeAltIcon"
                  :error="errors.country?.[0]"
                />

                <BaseInput
                  v-model="form.city"
                  label="Thành phố"
                  required
                  class="w-full"
                  :icon="BuildingOffice2Icon"
                  :error="errors.city?.[0]"
                />
              </div>
            </div>

            <!-- Description Section -->
            <div class="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DocumentTextIcon class="w-5 h-5 text-purple-600" />
                Mô tả
              </h3>

              <RichTextEditor
                :value="form.description"
                @update:value="form.description = $event"
                placeholder="Viết mô tả chi tiết về địa điểm..."
                class="min-h-[200px]"
              />
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">
                {{ errors.description[0] }}
              </p>
            </div>

            <!-- Image Section -->
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CameraIcon class="w-5 h-5 text-blue-600" />
                Hình ảnh
              </h3>

              <div class="mb-4">
                <label
                  class="flex items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                >
                  <div class="flex flex-col items-center">
                    <CloudArrowUpIcon class="w-8 h-8 text-blue-500 mb-2" />
                    <span class="text-sm font-medium text-blue-600">
                      {{ form.image ? 'Thay đổi ảnh' : 'Chọn ảnh để tải lên' }}
                    </span>
                    <span class="text-xs text-blue-500 mt-1">PNG, JPG, JPEG (tối đa 10MB)</span>
                  </div>
                  <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
                </label>
              </div>

              <div v-if="form.image" class="relative">
                <img
                  :src="form.image"
                  :alt="form.name"
                  class="w-full h-48 object-cover rounded-lg shadow-md"
                  @error="handleImageError"
                />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
              <p v-if="errors.image" class="mt-1 text-sm text-red-600">{{ errors.image[0] }}</p>
            </div>

            <!-- Coordinates Section -->
            <div class="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPinIcon class="w-5 h-5 text-green-600" />
                Tọa độ GPS (Tùy chọn)
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model.number="form.latitude"
                  label="Vĩ độ (Latitude)"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  class="w-full"
                  placeholder="Ví dụ: 21.0285"
                  :error="errors.latitude?.[0]"
                />

                <BaseInput
                  v-model.number="form.longitude"
                  label="Kinh độ (Longitude)"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  class="w-full"
                  placeholder="Ví dụ: 105.8542"
                  :error="errors.longitude?.[0]"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <BaseButton label="Hủy" color="gray" @click="closeModal" class="px-6 py-2" />
              <BaseButton
                type="submit"
                :color="isEditing ? 'warning' : 'success'"
                :label="isEditing ? 'Cập nhật' : 'Tạo địa điểm'"
                :icon="isEditing ? mdiPencil : mdiCheck"
                class="px-6 py-2"
                :loading="isSubmitting"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import BaseInput from '@/components/admin/BaseInput.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import RichTextEditor from '@/components/blog/RichTextEditor.vue'

// Heroicons imports
import {
  PencilIcon,
  PlusIcon,
  XMarkIcon,
  InformationCircleIcon,
  TagIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  CameraIcon,
  CloudArrowUpIcon,
  TrashIcon,
  MapPinIcon,
} from '@heroicons/vue/24/outline'

import { mdiCheck, mdiPencil } from '@mdi/js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  destinationId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['close', 'updated', 'created'])

// State
const isLoading = ref(false)
const isSubmitting = ref(false)
const errors = ref({})

// Form data
const form = ref({
  name: '',
  country: '',
  city: '',
  description: '',
  image: '',
  latitude: null,
  longitude: null,
})

// Computed
const isEditing = computed(() => !!props.destinationId)

// API configuration
const adminToken = localStorage.getItem('adminToken')
const baseUrl = import.meta.env.VITE_API_BASE_URL

// Methods
function resetForm() {
  form.value = {
    name: '',
    country: '',
    city: '',
    description: '',
    image: '',
    latitude: null,
    longitude: null,
  }
  errors.value = {}
}

function closeModal() {
  resetForm()
  emit('close')
}

function handleImageError(event) {
  event.target.src = '/images/placeholder.png'
}

function removeImage() {
  form.value.image = ''
}

const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    alert('Kích thước file không được vượt quá 10MB')
    return
  }

  try {
    isSubmitting.value = true
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

    form.value.image = uploadRes.data.secure_url
  } catch (err) {
    console.error('Lỗi upload ảnh địa điểm:', err)
    alert('Không thể tải ảnh địa điểm.')
  } finally {
    isSubmitting.value = false
  }
}

async function fetchDestination() {
  if (!props.destinationId) return

  isLoading.value = true
  try {
    const config = {
      headers: { Authorization: `Bearer ${adminToken}` },
    }

    const response = await axios.get(`${baseUrl}/locations/${props.destinationId}`, config)
    const destination = response.data.data

    form.value = {
      name: destination.name || '',
      country: destination.country || '',
      city: destination.city || '',
      description: destination.description || '',
      image: destination.image || '',
      latitude: destination.latitude || null,
      longitude: destination.longitude || null,
    }
  } catch (error) {
    console.error('Lỗi khi tải thông tin địa điểm:', error)
    alert('Lỗi khi tải thông tin địa điểm. Vui lòng thử lại.')
    closeModal()
  } finally {
    isLoading.value = false
  }
}

async function submitForm() {
  isSubmitting.value = true
  errors.value = {}

  try {
    const config = {
      headers: { Authorization: `Bearer ${adminToken}` },
    }

    const payload = {
      name: form.value.name,
      country: form.value.country,
      city: form.value.city,
      description: form.value.description,
      image: form.value.image || null,
      latitude: form.value.latitude || null,
      longitude: form.value.longitude || null,
    }

    let response
    if (isEditing.value) {
      // Update existing destination
      response = await axios.put(`${baseUrl}/locations/${props.destinationId}`, payload, config)
      emit('updated', response.data.data)
      alert('Cập nhật địa điểm thành công!')
    } else {
      // Create new destination
      response = await axios.post(`${baseUrl}/locations`, payload, config)
      emit('created', response.data.data)
      alert('Tạo địa điểm mới thành công!')
    }

    closeModal()
  } catch (error) {
    console.error('Lỗi khi lưu địa điểm:', error)

    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      alert('Lỗi khi lưu địa điểm. Vui lòng thử lại.')
    }
  } finally {
    isSubmitting.value = false
  }
}

// Watchers
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      if (isEditing.value) {
        fetchDestination()
      } else {
        resetForm()
      }
    }
  },
)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus styles */
input:focus,
textarea:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Disabled button styles */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fixed.inset-0.bg-gray-800.bg-opacity-50.z-50 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
