<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  paymentMethods: {
    type: Array,
    required: true,
  },
  selectedPaymentMethod: {
    type: String,
    default: null,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:show', 'update:selectedPaymentMethod', 'submit'])

const handleClose = () => {
  emit('update:show', false)
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-teal-900/30 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center z-50 transition-opacity duration-300 p-4 sm:p-0"
  >
    <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl/80 modal-content">
      <div class="p-6 sm:p-8 pr-4 sm:pr-6 relative">
        <button
          @click="handleClose"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-navy-900 mb-6">Chọn phương thức thanh toán</h2>
        <div class="mb-6">
          <div v-for="method in paymentMethods" :key="method.value" class="mb-4">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                :value="method.value"
                :checked="selectedPaymentMethod === method.value"
                @change="emit('update:selectedPaymentMethod', $event.target.value)"
                class="h-4 w-4 text-teal-500 focus:ring-teal-500"
                required
              />
              <span class="text-gray-700">{{ method.label }}</span>
            </label>
          </div>
        </div>
        <div v-if="errorMessage" class="text-red-500 mb-5 text-sm">{{ errorMessage }}</div>
        <div class="flex justify-end gap-4">
          <button
            @click="handleClose"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            @click="handleSubmit"
            class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            :disabled="!selectedPaymentMethod || loading"
          >
            {{ loading ? 'Đang xử lý...' : 'Xác nhận thanh toán' }}
          </button>
        </div>
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

input:focus {
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