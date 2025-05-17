<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <h1 class="text-2xl font-bold text-center mb-6">Kết Quả Thanh Toán</h1>
            <div v-if="status === 'success'" class="text-center">
                <div class="flex items-center justify-center mb-4">
                    <svg
                        class="w-16 h-16 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </div>
                <p class="text-lg font-medium text-gray-700">
                    Thanh toán thành công cho booking <span class="font-bold">#{{ bookingId }}</span>!
                </p>
                <button
                    @click="goToHome"
                    class="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Quay lại trang chủ
                </button>
            </div>
            <div v-else class="text-center">
                <div class="flex items-center justify-center mb-4">
                    <svg
                        class="w-16 h-16 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.994-1.85L21 18V6c0-1.054-.816-1.918-1.85-1.994L19 4H5c-1.054 0-1.918.816-1.994 1.85L3 6v12c0 1.054.816 1.918 1.85 1.994L5 20z"
                        ></path>
                    </svg>
                </div>
                <p class="text-lg font-medium text-gray-700">
                    Thanh toán thất bại. Vui lòng thử lại.
                </p>
                <button
                    @click="retryPayment"
                    class="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Thử lại
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const status = route.query.status;
const bookingId = route.query.booking_id;

const goToHome = () => {
    router.push('/');
};

const retryPayment = () => {
    router.push(localStorage.getItem('lastPaymentUrl') || '/');
};
</script>