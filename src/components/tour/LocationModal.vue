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
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white bg-opacity-20 rounded-lg">
                <MapPinIcon class="w-6 h-6 text-black" />
              </div>
              <h2 class="text-2xl font-bold text-white">Tạo địa điểm mới</h2>
            </div>
            <button
              @click="$emit('close')"
              class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form @submit.prevent="submitLocation" class="space-y-6">
            <!-- Basic Info Section -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <InformationCircleIcon class="w-5 h-5 text-gray-600" />
                Thông tin cơ bản
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="locationForm.name"
                  label="Tên địa điểm"
                  required
                  class="w-full"
                  :icon="TagIcon"
                />

                <BaseInput
                  v-model="locationForm.country"
                  label="Quốc gia"
                  required
                  class="w-full"
                  :icon="GlobeAltIcon"
                />

                <BaseInput
                  v-model="locationForm.city"
                  label="Thành phố"
                  required
                  class="w-full"
                  :icon="BuildingOffice2Icon"
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
                :value="locationForm.description"
                @update:value="locationForm.description = $event"
                placeholder="Viết mô tả chi tiết về địa điểm..."
                class="min-h-[200px]"
              />
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
                    <span class="text-sm font-medium text-blue-600">Chọn ảnh để tải lên</span>
                    <span class="text-xs text-blue-500 mt-1">PNG, JPG, JPEG (tối đa 10MB)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleLocationImageUpload"
                    class="hidden"
                  />
                </label>
              </div>

              <div v-if="locationForm.image" class="relative">
                <img
                  :src="locationForm.image"
                  alt="Location Image"
                  class="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  @click="locationForm.image = ''"
                  class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <BaseButton label="Hủy" color="gray" @click="$emit('close')" class="px-6 py-2" />
              <BaseButton
                type="submit"
                color="success"
                label="Tạo địa điểm"
                :icon="mdiCheck"
                class="px-6 py-2"
                :loading="loading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import BaseInput from '@/components/admin/BaseInput.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import RichTextEditor from '@/components/blog/RichTextEditor.vue'

// Heroicons imports
import {
  MapPinIcon,
  XMarkIcon,
  InformationCircleIcon,
  TagIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  CameraIcon,
  CloudArrowUpIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

import { mdiCheck } from '@mdi/js'


const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'created'])

const locationForm = ref({
  name: '',
  description: '',
  country: '',
  city: '',
  image: '',
})

const loading = ref(false)

// Reset form when modal is opened
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      locationForm.value = {
        name: '',
        description: '',
        country: '',
        city: '',
        image: '',
      }
    }
  },
)

const handleLocationImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    alert('Kích thước file không được vượt quá 10MB')
    return
  }

  try {
    loading.value = true
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
    locationForm.value.image = uploadRes.data.secure_url
  } catch (err) {
    console.error('Lỗi upload ảnh địa điểm:', err)
    alert('Không thể tải ảnh địa điểm.')
  } finally {
    loading.value = false
  }
}

const submitLocation = async () => {
  try {
    loading.value = true
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: locationForm.value.name,
      description: locationForm.value.description,
      country: locationForm.value.country,
      city: locationForm.value.city,
      image: locationForm.value.image || null,
    }
    const response = await axios.post(`${apiBaseUrl}/locations`, payload)
    emit('created', response.data)
    alert('Thêm địa điểm thành công!')
  } catch (err) {
    console.error('Lỗi khi thêm địa điểm:', err)
    alert('Không thể thêm địa điểm: ' + (err.response?.data?.message || 'Lỗi không xác định'))
  } finally {
    loading.value = false
  }
}
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fixed.inset-0.bg-gray-800.bg-opacity-50.z-50 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.1);
}

</style>
