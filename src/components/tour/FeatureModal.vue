<template>
  <!-- Feature Creation Modal -->
  <transition
    name="modal"
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 scale-95 translate-y-4"
    leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300"
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-orange-100 rounded-xl">
                <SparklesIcon class="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Tạo tính năng mới</h2>
                <p class="text-sm text-gray-600 mt-1">Thêm tính năng độc đáo cho tour của bạn</p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="p-2 hover:bg-orange-100 rounded-xl transition-colors duration-200 group"
            >
              <XMarkIcon class="w-6 h-6 text-gray-500 group-hover:text-orange-600" />
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="px-8 py-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          <form @submit.prevent="submitFeature" class="space-y-6">
            <!-- Feature Name -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <TagIcon class="w-4 h-4 text-orange-500" />
                Tên tính năng
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="featureForm.name"
                type="text"
                required
                placeholder="Ví dụ: WiFi miễn phí, Hướng dẫn viên chuyên nghiệp..."
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
              />
            </div>

            <!-- Feature Description -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <DocumentTextIcon class="w-4 h-4 text-orange-500" />
                Mô tả chi tiết
              </label>

              <!-- QuillEditor Container -->
              <div
                class="border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <RichTextEditor
                  ref="featureDescriptionEditor"
                  :value="featureForm.description"
                  @update:value="featureForm.description = $event"
                  placeholder="Mô tả chi tiết về tính năng này..."
                  :height="200"
                />
              </div>
              <p class="text-xs text-gray-500 mt-2">
                Mô tả chi tiết giúp khách hàng hiểu rõ hơn về tính năng này
              </p>
            </div>

            <!-- Preview Section -->
            <div
              v-if="featureForm.name || featureForm.description"
              class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
            >
              <div class="flex items-center gap-2 mb-3">
                <EyeIcon class="w-4 h-4 text-gray-600" />
                <span class="text-sm font-medium text-gray-700">Xem trước</span>
              </div>

              <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-orange-100 rounded-lg">
                    <SparklesIcon class="w-4 h-4 text-orange-600" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-800">
                      {{ featureForm.name || 'Tên tính năng...' }}
                    </h4>
                    <div
                      v-if="featureForm.description"
                      class="text-sm text-gray-600 mt-1 prose prose-sm max-w-none"
                      v-html="featureForm.description"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-all duration-200 font-medium"
            >
              <div class="flex items-center gap-2">
                <XMarkIcon class="w-4 h-4" />
                Hủy
              </div>
            </button>
            <button
              type="submit"
              @click="submitFeature"
              :disabled="!featureForm.name.trim()"
              class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 disabled:hover:to-red-500"
            >
              <div class="flex items-center gap-2">
                <CheckIcon class="w-4 h-4" />
                Tạo tính năng
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import RichTextEditor from '@/components/blog/RichTextEditor.vue'

// Heroicons imports
import {
  SparklesIcon,
  XMarkIcon,
  TagIcon,
  DocumentTextIcon,
  EyeIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['close', 'created'])

// Refs
const featureDescriptionEditor = ref(null)

// Form data
const featureForm = ref({
  name: '',
  description: '',
})

// Methods
const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  featureForm.value = {
    name: '',
    description: '',
  }
}

const submitFeature = async () => {
  if (!featureForm.value.name.trim()) {
    alert('Vui lòng nhập tên tính năng')
    return
  }

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: featureForm.value.name.trim(),
      description: featureForm.value.description || null,
    }

    const response = await axios.post(`${apiBaseUrl}/features`, payload)

    // Emit the created feature
    emit('created', response.data)

    // Show success message
    alert('Thêm tính năng thành công!')

    // Close modal and reset form
    closeModal()
  } catch (err) {
    console.error('Lỗi khi thêm tính năng:', err)
    alert('Không thể thêm tính năng: ' + (err.response?.data?.message || 'Lỗi không xác định'))
  }
}

// Watch for modal show/hide to reset form
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      resetForm()
    }
  },
)
</script>

<style scoped>
/* Modal transition styles */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(16px);
}

/* Scrollbar styling */
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

/* Prose styling for description preview */
.prose p {
  margin: 0.5rem 0;
}

.prose ul,
.prose ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

/* Input focus animations */
input:focus {
  transform: translateY(-1px);
}

/* Button hover animations */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Gradient animation */
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fixed.inset-0.bg-gray-800.bg-opacity-60.z-50 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
