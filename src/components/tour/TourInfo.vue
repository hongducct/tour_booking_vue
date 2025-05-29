<script setup>
import { ref } from 'vue'
import { ClockIcon, CurrencyDollarIcon, MapPinIcon, PhotoIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  tour: {
    type: Object,
    required: true,
  },
})

const activeTab = ref('description') // 'description' hoặc 'itinerary'

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

const setActiveTab = (tab) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="p-6 sm:p-8">
    <!-- Header thông tin tour -->
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
        <span class="text-gray-600" v-html="tour.location?.description"></span>
      </div>
    </div>

    <!-- Thông tin cơ bản -->
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

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="setActiveTab('description')"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
            activeTab === 'description'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          ĐIỂM ĐẶC SẮC
        </button>
        <button
          @click="setActiveTab('itinerary')"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
            activeTab === 'itinerary'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          LỘ TRÌNH TOUR
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Điểm đặc sắc Tab -->
      <div v-if="activeTab === 'description'" class="space-y-8">
        <!-- Mô tả tour -->
        <div class="prose max-w-none text-gray-700" v-html="tour.description"></div>

        <!-- Bao gồm -->
        <div v-if="tour.features && tour.features.length > 0">
          <h2 class="text-xl font-semibold text-navy-900 mb-3">Bao gồm:</h2>
          <ul class="list-disc list-inside text-gray-600 space-y-2">
            <li v-for="(feature, index) in tour.features" :key="index">
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- Thông tin nhà cung cấp -->
        <div>
          <h2 class="text-xl font-semibold text-navy-900 mb-3">Thông tin nhà cung cấp:</h2>
          <p class="text-gray-600">Công ty: {{ tour.vendor?.company_name }}</p>
          <p class="text-gray-600">Giấy phép kinh doanh: {{ tour.vendor?.business_license }}</p>
        </div>

        <!-- Ngày khởi hành -->
        <div v-if="tour.availabilities && tour.availabilities.length > 0">
          <h2 class="text-xl font-semibold text-navy-900 mb-3">Ngày khởi hành khả dụng:</h2>
          <ul class="list-disc list-inside text-gray-600 space-y-2">
            <li v-for="availability in tour.availabilities" :key="availability.id">
              {{ formatDate(availability.date) }} (Còn {{ availability.available_slots }} chỗ /
              {{ availability.max_guests }} tối đa)
            </li>
          </ul>
        </div>
      </div>

      <!-- Lộ trình tour Tab -->
      <div v-if="activeTab === 'itinerary'" class="space-y-6">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-navy-900 mb-2">
            Thời gian ({{ tour.days }} ngày {{ tour.nights }} đêm)
          </h2>
          <p class="text-gray-600">
            Lộ trình chi tiết cho {{ tour.days }} ngày hành trình Tour của bạn.
          </p>
        </div>

        <!-- Lộ trình từng ngày -->
        <div
          v-for="itinerary in tour.itineraries"
          :key="itinerary.id"
          class="bg-gray-50 rounded-lg p-6 mb-6"
        >
          <!-- Header ngày -->
          <div class="flex items-center mb-4">
            <div
              class="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4"
            >
              {{ itinerary.day }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-navy-900">{{ itinerary.title }}</h3>
              <p v-if="itinerary.description" class="text-gray-600 text-sm">
                {{ itinerary.description }}
              </p>
            </div>
          </div>

          <!-- Thời gian -->
          <div v-if="itinerary.start_time || itinerary.end_time" class="mb-4">
            <div class="flex items-center text-sm text-gray-600">
              <ClockIcon class="w-4 h-4 mr-2 text-teal-500" />
              <span v-if="itinerary.start_time && itinerary.end_time">
                {{ itinerary.start_time }} - {{ itinerary.end_time }}
              </span>
              <span v-else-if="itinerary.start_time"> Bắt đầu: {{ itinerary.start_time }} </span>
              <span v-else-if="itinerary.end_time"> Kết thúc: {{ itinerary.end_time }} </span>
            </div>
          </div>

          <!-- Hoạt động -->
          <div v-if="itinerary.activities && itinerary.activities.length > 0" class="mb-4">
            <h4 class="font-medium text-navy-900 mb-2">Hoạt động:</h4>
            <ul class="space-y-2">
              <li
                v-for="(activity, index) in itinerary.activities"
                :key="index"
                class="text-gray-700"
              >
                <!-- Kiểm tra nếu activity có dạng "key: value" thì tách ra -->
                <span v-if="activity.includes(':')" class="font-medium text-teal-600"
                  >{{ activity.split(':')[0] }}:</span
                >
                <span v-if="activity.includes(':')">{{
                  activity.split(':').slice(1).join(':').trim()
                }}</span>
                <span v-else>• {{ activity }}</span>
              </li>
            </ul>
          </div>

          <!-- Ảnh lộ trình -->
          <div v-if="itinerary.images && itinerary.images.length > 0" class="mb-4">
            <h4 class="font-medium text-navy-900 mb-2 flex items-center">
              <PhotoIcon class="w-5 h-5 mr-2 text-teal-500" />
              Hình ảnh:
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div v-for="image in itinerary.images" :key="image.id" class="relative">
                <img
                  :src="image.image_path"
                  :alt="`Ảnh ngày ${itinerary.day}`"
                  class="w-full h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                />
              </div>
            </div>
          </div>

          <!-- Thông tin thêm -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div v-if="itinerary.accommodation" class="flex items-start">
              <span class="font-medium text-gray-600 mr-2">Nghỉ ngơi:</span>
              <span class="text-gray-700">{{ itinerary.accommodation }}</span>
            </div>
            <div v-if="itinerary.meals" class="flex items-start">
              <span class="font-medium text-gray-600 mr-2">Bữa ăn:</span>
              <span class="text-gray-700">{{ itinerary.meals }}</span>
            </div>
          </div>

          <!-- Ghi chú -->
          <div v-if="itinerary.notes" class="mt-4 p-3 bg-blue-50 rounded-md">
            <p class="text-sm text-blue-800">
              <span class="font-medium">Ghi chú:</span> {{ itinerary.notes }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --navy-900: #1e3a8a;
  --teal-500: #2dd4bf;
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

.tab-content {
  min-height: 400px;
}

/* Smooth transition cho tab switching */
.tab-content > div {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
