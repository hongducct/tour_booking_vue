<script setup>
import { computed } from 'vue'
import SimpleBar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  tour: {
    type: Object,
    required: true,
  },
  availableDates: {
    type: Array,
    default: () => [],
  },
  bookingForm: {
    type: Object,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  voucherMessage: {
    type: Object,
    default: null,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  voucherValidated: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:show', 'update:bookingForm', 'submit'])

const formatPrice = (price) => {
  return Number(price).toLocaleString('vi-VN') + '₫'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const handleClose = () => {
  emit('update:show', false)
}

const handleSubmit = () => {
  emit('submit')
}

const updateBookingForm = (field, value) => {
  console.log('Updating bookingForm:', field, value, props.bookingForm)
  emit('update:bookingForm', { ...props.bookingForm, [field]: value })
}

// Computed property để hiển thị giá tạm tính (chưa áp dụng voucher)
const tempPrice = computed(() => {
  const adults = props.bookingForm.number_of_guests_adults || 0
  const children = props.bookingForm.number_of_children || 0
  const price = props.tour?.price || 0
  return price * (adults + children * 0.5)
})
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-teal-900/30 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center z-50 transition-opacity duration-300 p-4 sm:p-0"
  >
    <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl/80 modal-content">
      <SimpleBar class="max-h-[90vh]">
        <div class="p-6 sm:p-8 pr-4 sm:pr-6 relative">
          <button
            @click="handleClose"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 class="text-2xl font-bold text-navy-900 mb-6">Đặt tour: {{ tour.name }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">Ngày khởi hành</label>
              <select
                :value="bookingForm.start_date"
                @change="updateBookingForm('start_date', $event.target.value)"
                required
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3"
              >
                <option value="" disabled>Chọn ngày khởi hành</option>
                <option
                  v-for="availability in availableDates"
                  :key="availability.id"
                  :value="availability.date"
                >
                  {{ formatDate(availability.date) }} (Còn {{ availability.available_slots }} chỗ)
                </option>
              </select>
            </div>
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">Số người lớn</label>
              <input
                :value="bookingForm.number_of_guests_adults"
                @input="updateBookingForm('number_of_guests_adults', Number($event.target.value))"
                type="number"
                min="1"
                required
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3"
              />
            </div>
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">Số trẻ em</label>
              <input
                :value="bookingForm.number_of_children"
                @input="updateBookingForm('number_of_children', Number($event.target.value))"
                type="number"
                min="0"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3"
              />
              <p class="text-sm text-gray-500 mt-1">Lưu ý: Giá trẻ em bằng 50% giá người lớn.</p>
            </div>
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Mã voucher (tùy chọn)</label
              >
              <input
                :value="bookingForm.voucher_code"
                @input="updateBookingForm('voucher_code', $event.target.value)"
                type="text"
                placeholder="Nhập mã voucher nếu có"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3"
              />
              <p class="text-sm text-gray-500 mt-1">
                Mã voucher sẽ được kiểm tra khi bạn tiếp tục.
              </p>
              <p
                v-if="voucherMessage"
                class="text-sm mt-1"
                :class="voucherMessage.isError ? 'text-red-500' : 'text-teal-500'"
              >
                {{ voucherMessage.text }}
              </p>
            </div>
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">Yêu cầu đặc biệt</label>
              <textarea
                :value="bookingForm.special_requests"
                @input="updateBookingForm('special_requests', $event.target.value)"
                rows="4"
                placeholder="Nhập yêu cầu đặc biệt nếu có..."
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3"
              ></textarea>
            </div>
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Số điện thoại liên hệ</label
              >
              <input
                :value="bookingForm.contact_phone"
                @input="updateBookingForm('contact_phone', $event.target.value)"
                type="tel"
                required
                placeholder="Nhập số điện thoại"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3"
              />
            </div>
            <div class="mb-5 bg-gray-50 p-4 rounded-lg">
              <label class="block text-sm font-medium text-gray-700 mb-2">Chi tiết giá</label>
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span>Giá tạm tính:</span>
                  <span>{{ formatPrice(tempPrice) }}</span>
                </div>
                <div v-if="discount > 0" class="flex justify-between text-sm text-teal-600">
                  <span>Giảm giá (voucher):</span>
                  <span>-{{ formatPrice(discount) }}</span>
                </div>
                <hr class="my-2" />
                <div class="flex justify-between text-lg font-semibold text-navy-900">
                  <span>Tổng cộng:</span>
                  <span>{{ formatPrice(totalPrice) }}</span>
                </div>
              </div>
            </div>
            <div v-if="errorMessage" class="text-red-500 mb-5 text-sm bg-red-50 p-3 rounded-lg">
              {{ errorMessage }}
            </div>
            <div class="flex justify-end gap-4">
              <button
                type="button"
                @click="handleClose"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                :disabled="!bookingForm.start_date || !bookingForm.contact_phone"
              >
                {{
                  bookingForm.voucher_code && !voucherValidated ? 'Kiểm tra voucher' : 'Tiếp tục'
                }}
              </button>
            </div>
          </form>
        </div>
      </SimpleBar>
    </div>
  </div>
</template>

<style scoped>
:root {
  --navy-900: #1e3a8a;
  --teal-500: #2dd4bf;
  --teal-600: #0d9488;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

.modal-content {
  /* Removed overflow-y-auto from here */
}

/* Apply scrollbar styles to the inner container */
.max-h-\[90vh\] {
  scrollbar-width: thin;
  scrollbar-color: var(--teal-500) rgba(0, 0, 0, 0.1);
}

.max-h-\[90vh\]::-webkit-scrollbar {
  width: 8px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  margin: 10px 0;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: var(--teal-500);
  border-radius: 10px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: var(--teal-600);
}

@media (max-width: 640px) {
  .max-w-lg {
    max-width: 95%;
  }

  .modal-content .max-h-\[90vh\] > div {
    padding: 1.5rem;
    padding-right: 1rem;
  }
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--teal-500);
  box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.2);
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
