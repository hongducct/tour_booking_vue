<script setup>
import { computed } from 'vue'
import BaseInput from '@/components/admin/BaseInput.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const props = defineProps({
  showCreateForm: {
    type: Boolean,
    required: true,
  },
  editingVoucher: {
    type: Object,
    default: null,
  },
  voucherForm: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    required: true,
  },
  saving: {
    type: Boolean,
    required: true,
  },
  tourStore: {
    type: Object,
    required: true,
  },
  saveVoucher: {
    type: Function,
    required: true,
  },
  cancelForm: {
    type: Function,
    required: true,
  },
})

const isDiscountTypeError = computed(() => {
  return !!(
    (props.voucherForm.discount && props.voucherForm.discount_percentage) ||
    (!props.voucherForm.discount && !props.voucherForm.discount_percentage)
  )
})
</script>

<template>
  <div
    v-if="showCreateForm || editingVoucher"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
    @click.self="cancelForm"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col transform transition-all duration-300 ease-out"
    >
      <!-- Header -->
      <div class="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 sm:px-8 sm:py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-white">
                {{ editingVoucher ? 'Chỉnh sửa Voucher' : 'Tạo Voucher mới' }}
              </h3>
              <p class="text-blue-100 text-sm mt-1">
                {{ editingVoucher ? 'Cập nhật thông tin voucher' : 'Thêm voucher giảm giá mới' }}
              </p>
            </div>
          </div>
          <button
            @click="cancelForm"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            :disabled="tourStore.loading"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div
        v-if="tourStore.loading"
        class="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-center z-20"
      >
        <div class="flex flex-col items-center space-y-4">
          <div class="relative">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
            <div
              class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"
            ></div>
          </div>
          <div class="text-center">
            <p class="text-lg font-medium text-gray-800">Đang tải dữ liệu</p>
            <p class="text-sm text-gray-500">Vui lòng đợi trong giây lát...</p>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="flex-1 overflow-y-auto">
        <form @submit.prevent="saveVoucher" class="p-6 sm:p-8 space-y-8">
          <!-- Basic Information Section -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3 pb-3 border-b border-gray-200">
              <div class="p-2 bg-blue-50 rounded-lg">
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800">Thông tin cơ bản</h4>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-2">
                <BaseInput
                  v-model="voucherForm.code"
                  label="Mã Voucher"
                  required
                  :error="errors.code"
                  :disabled="tourStore.loading"
                  class="w-full"
                />
              </div>
              <div class="space-y-2">
                <BaseInput
                  v-model.number="voucherForm.usage_limit"
                  label="Giới hạn sử dụng"
                  type="number"
                  placeholder="Để trống = không giới hạn"
                  :disabled="tourStore.loading"
                  class="w-full"
                />
                <p class="text-xs text-gray-500 flex items-center space-x-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Để trống nếu muốn không giới hạn số lần sử dụng</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Discount Section -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3 pb-3 border-b border-gray-200">
              <div class="p-2 bg-green-50 rounded-lg">
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800">Loại giảm giá</h4>
            </div>

            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <div class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-amber-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div>
                  <p class="text-sm font-medium text-amber-800">Lưu ý quan trọng</p>
                  <p class="text-sm text-amber-700 mt-1">
                    Chỉ được chọn một trong hai loại giảm giá: cố định hoặc phần trăm
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="relative">
                <BaseInput
                  v-model.number="voucherForm.discount"
                  label="Giảm giá cố định (VND)"
                  type="number"
                  :disabled="!!voucherForm.discount_percentage || tourStore.loading"
                  :error="errors.discount"
                  class="w-full"
                />
                <div class="absolute right-3 top-9 pointer-events-none">
                  <span class="text-sm text-gray-500">₫</span>
                </div>
              </div>
              <div class="relative">
                <BaseInput
                  v-model.number="voucherForm.discount_percentage"
                  label="Giảm giá (%)"
                  type="number"
                  min="1"
                  max="100"
                  :disabled="!!voucherForm.discount || tourStore.loading"
                  :error="errors.discount_percentage"
                  class="w-full"
                />
                <div class="absolute right-3 top-9 pointer-events-none">
                  <span class="text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div v-if="isDiscountTypeError" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-center space-x-3">
                <svg
                  class="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p class="text-sm font-medium text-red-800">
                  Phải chọn một và chỉ một trong hai: Giảm giá cố định hoặc Giảm giá (%)
                </p>
              </div>
            </div>
          </div>

          <!-- Date Range Section -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3 pb-3 border-b border-gray-200">
              <div class="p-2 bg-purple-50 rounded-lg">
                <svg
                  class="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800">Thời gian áp dụng</h4>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BaseInput
                v-model="voucherForm.start_date"
                label="Ngày bắt đầu"
                type="date"
                required
                :error="errors.start_date"
                :disabled="tourStore.loading"
                class="w-full"
              />
              <BaseInput
                v-model="voucherForm.end_date"
                label="Ngày kết thúc"
                type="date"
                required
                :error="errors.end_date"
                :disabled="tourStore.loading"
                class="w-full"
              />
            </div>
          </div>

          <!-- Tour Selection Section -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3 pb-3 border-b border-gray-200">
              <div class="p-2 bg-indigo-50 rounded-lg">
                <svg
                  class="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800">Phạm vi áp dụng</h4>
            </div>

            <div class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-blue-600 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-blue-800">Hướng dẫn chọn tour</p>
                    <p class="text-sm text-blue-700 mt-1">
                      Để trống để voucher áp dụng cho tất cả tour. Chọn tour cụ thể để giới hạn phạm
                      vi sử dụng.
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700"> Áp dụng cho tour </label>
                <VueSelect
                  v-model="voucherForm.applicable_tour_ids"
                  :options="tourStore.tours"
                  :reduce="(tour) => tour.id"
                  label="name"
                  multiple
                  placeholder="Chọn tour áp dụng..."
                  :disabled="tourStore.loading"
                  filterable
                  :close-on-select="false"
                  :selectable="() => true"
                  class="vue-select-custom"
                />
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Sử dụng Ctrl/Cmd + Click để chọn nhiều tour cùng lúc</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer Actions -->
      <div class="border-t border-gray-200 bg-gray-50 px-6 py-4 sm:px-8">
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <BaseButton
            label="Hủy bỏ"
            color="light"
            @click="cancelForm"
            :disabled="tourStore.loading"
            class="w-full sm:w-auto px-6 py-2.5 text-sm font-medium"
          />
          <BaseButton
            type="submit"
            color="success"
            :label="editingVoucher ? 'Cập nhật Voucher' : 'Tạo Voucher'"
            :disabled="saving || tourStore.loading"
            @click="saveVoucher"
            class="w-full sm:w-auto px-6 py-2.5 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <svg
              v-if="saving"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{ editingVoucher ? 'Cập nhật Voucher' : 'Tạo Voucher' }}</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom Vue Select Styling */
:deep(.vue-select-custom .vs__dropdown-toggle) {
  border-width: 1px;
  border-color: #d1d5db; /* border-gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  padding-left: 0.75rem; /* px-3 */
  padding-right: 0.75rem;
  padding-top: 0.625rem; /* py-2.5 */
  padding-bottom: 0.625rem;
  background-color: #fff; /* bg-white */
}

:deep(.vue-select-custom .vs__selected-options) {
  flex-wrap: wrap;
  gap: 0.25rem; /* gap-1 */
  display: flex;
}

:deep(.vue-select-custom .vs__selected) {
  background-color: #dbeafe; /* bg-blue-100 */
  color: #1e40af; /* text-blue-800 */
  border-radius: 0.375rem; /* rounded-md */
  padding-left: 0.5rem; /* px-2 */
  padding-right: 0.5rem;
  padding-top: 0.25rem; /* py-1 */
  padding-bottom: 0.25rem;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
}

:deep(.vue-select-custom .vs__deselect) {
  color: #2563eb; /* text-blue-600 */
}
:deep(.vue-select-custom .vs__deselect:hover) {
  color: #1e40af; /* hover:text-blue-800 */
}

:deep(.vue-select-custom .vs__dropdown-menu) {
  border-width: 1px;
  border-color: #e5e7eb; /* border-gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); /* shadow-lg */
  background-color: #fff; /* bg-white */
}

:deep(.vue-select-custom .vs__option) {
  padding-left: 0.75rem; /* px-3 */
  padding-right: 0.75rem;
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem;
  transition: background 0.2s, color 0.2s;
}
:deep(.vue-select-custom .vs__option:hover) {
  background-color: #dbeafe; /* hover:bg-blue-50 */
  color: #1e40af; /* hover:text-blue-800 */
}

:deep(.vue-select-custom .vs__option--selected) {
  background-color: #dbeafe; /* bg-blue-100 */
  color: #1e40af; /* text-blue-800 */
  font-weight: 500; /* font-medium */
}

:deep(.vue-select-custom .vs__search) {
  font-size: 0.875rem; /* text-sm */
}

:deep(.vue-select-custom .vs__no-options) {
  color: #6b7280; /* text-gray-500 */
  font-size: 0.875rem; /* text-sm */
  padding-left: 0.75rem; /* px-3 */
  padding-right: 0.75rem;
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem;
}

/* Smooth transitions */
.transform {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(8px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
}

/* Mobile scroll improvements */
@media (max-width: 640px) {
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
  }
}

/* Focus states for better accessibility */
:deep(input:focus),
:deep(select:focus),
:deep(.vs__dropdown-toggle:focus) {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px #fff; /* ring-2 ring-blue-500 ring-offset-2 */
}

/* Loading animation improvements */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
