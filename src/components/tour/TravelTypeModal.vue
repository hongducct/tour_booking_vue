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
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white bg-opacity-20 rounded-lg">
                <RectangleGroupIcon class="w-6 h-6" />
              </div>
              <h2 class="text-2xl font-bold text-white">Tạo danh mục mới</h2>
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
          <form @submit.prevent="submitTravelType" class="space-y-6">
            <!-- Basic Info Section -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <InformationCircleIcon class="w-5 h-5 text-gray-600" />
                Thông tin cơ bản
              </h3>

              <BaseInput
                v-model="travelTypeForm.name"
                label="Tên danh mục"
                required
                class="w-full"
                :icon="TagIcon"
                placeholder="Ví dụ: Du lịch biển, Du lịch núi, Du lịch văn hóa..."
              />
            </div>

            <!-- Description Section -->
            <div class="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DocumentTextIcon class="w-5 h-5 text-purple-600" />
                Mô tả danh mục
              </h3>

              <RichTextEditor
                :value="travelTypeForm.description"
                @update:value="travelTypeForm.description = $event"
                placeholder="Viết mô tả chi tiết về danh mục tour này..."
                class="min-h-[200px]"
              />
            </div>

            <!-- Icon/Category Preview Section -->
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <SparklesIcon class="w-5 h-5 text-blue-600" />
                Thuộc tính danh mục
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Mức độ phổ biến
                  </label>
                  <select
                    v-model="travelTypeForm.popularity"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium" selected>Trung bình</option>
                    <option value="high">Cao</option>
                  </select>
                </div>

                <div class="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    v-model="travelTypeForm.is_featured"
                    class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-gray-700">Danh mục nổi bật</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <BaseButton label="Hủy" color="gray" @click="$emit('close')" class="px-6 py-2" />
              <BaseButton
                type="submit"
                color="success"
                label="Tạo danh mục"
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
  RectangleGroupIcon,
  XMarkIcon,
  InformationCircleIcon,
  TagIcon,
  DocumentTextIcon,
  SparklesIcon,
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

const travelTypeForm = ref({
  name: '',
  description: '',
  popularity: 'medium',
  is_featured: false,
})

const loading = ref(false)

// Reset form when modal is opened
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      travelTypeForm.value = {
        name: '',
        description: '',
        popularity: 'medium',
        is_featured: false,
      }
    }
  },
)

const submitTravelType = async () => {
  try {
    loading.value = true
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: travelTypeForm.value.name,
      description: travelTypeForm.value.description || null,
      popularity: travelTypeForm.value.popularity,
      is_featured: travelTypeForm.value.is_featured,
    }
    const response = await axios.post(`${apiBaseUrl}/travel-types`, payload)
    emit('created', response.data)
    alert('Thêm danh mục thành công!')
  } catch (err) {
    console.error('Lỗi khi thêm danh mục:', err)
    alert('Không thể thêm danh mục: ' + (err.response?.data?.message || 'Lỗi không xác định'))
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

.fixed.inset-0.bg-black.bg-opacity-70.z-50 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.1);
}

</style>
