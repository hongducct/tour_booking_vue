<template>
    <!-- Modal Backdrop -->
    <div 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click="closeModal"
    >
        <!-- Modal Content -->
        <div 
            class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all"
            @click.stop
        >
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-xl font-bold text-gray-900">Đặt Tour Ngay</h3>
                <button
                    @click="closeModal"
                    class="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <!-- Modal Body -->
            <form class="p-6 space-y-5" @submit.prevent="submitBooking">
                <div>
                    <label class="block text-gray-700 font-medium mb-1" for="name">Họ và tên</label>
                    <input
                        v-model="form.name"
                        id="name"
                        type="text"
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập họ và tên"
                        required
                    />
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-1" for="email">Email</label>
                    <input
                        v-model="form.email"
                        id="email"
                        type="email"
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập email"
                        required
                    />
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-1" for="phone">Số điện thoại</label>
                    <input
                        v-model="form.phone"
                        id="phone"
                        type="tel"
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập số điện thoại"
                        required
                    />
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-1" for="note">Ghi chú</label>
                    <textarea
                        v-model="form.note"
                        id="note"
                        rows="3"
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ghi chú thêm (tuỳ chọn)"
                    ></textarea>
                </div>
                <div>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center"
                    >
                        <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Xác nhận đặt tour
                    </button>
                </div>
                <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-center">
                    Đặt tour thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
                </div>
                <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-center">
                    {{ error }}
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])

const form = ref({
    name: '',
    email: '',
    phone: '',
    note: '',
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

function closeModal() {
    emit('close')
}

async function submitBooking() {
    loading.value = true
    error.value = ''
    success.value = false
    try {
        // Fake API call, replace with your real API endpoint
        await new Promise(resolve => setTimeout(resolve, 1200))
        success.value = true
        // Optionally reset form
        form.value = { name: '', email: '', phone: '', note: '' }
    } catch (e) {
        error.value = 'Có lỗi xảy ra, vui lòng thử lại.'
    } finally {
        loading.value = false
    }
}
</script>