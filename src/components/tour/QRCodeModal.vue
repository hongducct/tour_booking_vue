<script setup>
import QRCodeVue3 from 'qrcode.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  vnpayUrl: {
    type: String,
    default: '',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  bookingId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['update:show'])

const formatPrice = (price) => {
  return Number(price).toLocaleString('vi-VN') + '₫'
}

const handleClose = () => {
  emit('update:show', false)
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-teal-900/30 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center z-50 transition-opacity duration-300 p-4 sm:p-0"
  >
    <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl/80 modal-content">
      <div class="p-6 sm:p-8 pr-4 sm:pr-6 text-center relative">
        <button
          @click="handleClose"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-navy-900 mb-4">Quét mã QR để thanh toán</h2>
        <p class="text-gray-700 mb-6">
          Vui lòng quét mã QR dưới đây bằng ứng dụng ngân hàng để thanh toán số tiền:
          {{ formatPrice(totalPrice) }}.
        </p>
        <div class="flex justify-center mb-6">
          <QRCodeVue3 :value="vnpayUrl" />
        </div>
        <p class="text-gray-700 mb-6">
          Sau khi thanh toán, hệ thống sẽ tự động xác nhận. Mã đặt tour: {{ bookingId }}
        </p>
        <button
          @click="handleClose"
          class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --navy-900: #1E3A8A;
  --teal-500: #2DD4BF;
  --teal-600: #0D9488;
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
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

.modal-content {
  scrollbar-width: thin;
  scrollbar-color: var(--teal-500) rgba(0, 0, 0, 0.1);
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  margin: 10px 0;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--teal-500);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--teal-600);
}

@media (max-width: 640px) {
  .max-w-md {
    max-width: 95%;
  }

  .modal-content > div {
    padding: 1.5rem;
    padding-right: 1rem;
  }
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}
</style>