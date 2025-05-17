<template>
  <TheHeader />

  <div class="container mx-auto px-4 space-y-10 mt-30">
    <div v-if="locationData" class="space-y-6">
      <!-- Phần thông tin địa điểm -->
      <div class="bg-white shadow rounded-xl p-6">
        <img
          v-if="locationData.location.image"
          :src="`${imageBaseUrl}/${locationData.location.image}`"
          :alt="locationData.location.name"
          class="w-full h-72 object-cover rounded-lg mb-4"
        />
        <h1 class="text-3xl font-bold mb-2">{{ locationData.location.name }}</h1>
        <p class="text-gray-600">
          {{ locationData.location.city }}, {{ locationData.location.country }}
        </p>
        <p class="mt-3 text-gray-700">{{ locationData.location.description }}</p>
      </div>

      <!-- Danh sách tour -->
      <div v-if="locationData.tours?.data?.length">
        <h2 class="text-2xl font-semibold mb-4">Các Tour tại {{ locationData.location.name }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TourCard v-for="tour in locationData.tours.data" :key="tour.id" :tour="tour" />
        </div>
      </div>
      <div v-else class="text-gray-500">Không có tour nào tại địa điểm này.</div>
    </div>

    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>
    <div v-else class="text-center text-gray-500">Đang tải dữ liệu...</div>
  </div>

  <TheFooter class="mt-8" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TourCard from '@/components/TourCard.vue'

const route = useRoute()
const locationData = ref(null)
const error = ref(null)

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const imageBaseUrl = `${apiBaseUrl}/storage`

onMounted(async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/locations/${route.params.id}/tours`)
    locationData.value = response.data
  } catch (err) {
    error.value = 'Lỗi khi tải dữ liệu địa điểm: ' + err.message
  }
})
</script>
