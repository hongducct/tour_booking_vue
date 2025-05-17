<script setup>
import { ClockIcon, CurrencyDollarIcon, MapPinIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  tour: {
    type: Object,
    required: true,
  },
  availableDates: {
    type: Array,
    default: () => [],
  },
})

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
</script>

<template>
  <div class="p-6 sm:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">{{ tour.name }}</h1>
    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-600 mb-6">
      <div class="flex items-center mb-2 sm:mb-0">
        <MapPinIcon class="w-6 h-6 text-teal-500 mr-2" />
        <span class="text-lg">
          {{ tour.location?.name }}, {{ tour.location?.city }}, {{ tour.location?.country }}
        </span>
      </div>
      <span class="text-gray-400 hidden sm:block">|</span>
      <div class="flex items-center">
        <span class="text-gray-600">{{ tour.location?.description }}</span>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
      <div class="flex items-center">
        <ClockIcon class="w-5 h-5 mr-2 text-teal-500" />
        <span>{{ tour.days }} ngày / {{ tour.nights }} đêm</span>
      </div>
      <div class="flex items-center">
        <CurrencyDollarIcon class="w-5 h-5 mr-2 text-teal-500" />
        <span>{{ formatPrice(tour.price) }} / người lớn</span>
      </div>
      <div class="flex items-center">
        <span class="text-gray-600">Loại hình: {{ tour.category }}</span>
      </div>
    </div>
    <div class="prose max-w-none mb-8 text-gray-700" v-html="tour.description"></div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-navy-900 mb-3">Bao gồm:</h2>
      <ul class="list-disc list-inside text-gray-600 space-y-2">
        <li v-for="(feature, index) in JSON.parse(tour.features)" :key="index">
          {{ feature }}
        </li>
      </ul>
    </div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-navy-900 mb-3">Thông tin nhà cung cấp:</h2>
      <p class="text-gray-600">Công ty: {{ tour.vendor?.company_name }}</p>
      <p class="text-gray-600">Giấy phép kinh doanh: {{ tour.vendor?.business_license }}</p>
      <!-- <p class="text-gray-600">Gói dịch vụ hết hạn: {{ formatDate(tour.vendor?.package_expiry_date) }}</p> -->
    </div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-navy-900 mb-3">Ngày khởi hành khả dụng:</h2>
      <ul class="list-disc list-inside text-gray-600 space-y-2">
        <li v-for="availability in availableDates" :key="availability.id">
          {{ formatDate(availability.date) }} (Còn {{ availability.available_slots }} chỗ)
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
:root {
  --navy-900: #1E3A8A;
  --teal-500: #2DD4BF;
}

.prose :deep(p) {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  color: var(--navy-900);
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>