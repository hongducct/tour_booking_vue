<template>
  <TheHeader />

  <div class="container mx-auto px-4 space-y-8 mt-30">
    <!-- Danh sách tour -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <TourCard v-for="tour in tours" :key="tour.id" :tour="tour" />
    </div>

    <!-- Phân trang -->
    <Pagination :pagination="pagination" @change-page="fetchTours" />
  </div>

  <TheFooter class="mt-8" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TourCard from '@/components/TourCard.vue'
import Pagination from '@/components/Pagination.vue'

const tours = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})

const fetchTours = async (page = 1) => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/tours?page=${page}`)
    tours.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      next_page_url: response.data.next_page_url,
      prev_page_url: response.data.prev_page_url,
    }
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu tour:', err)
  }
}

onMounted(() => {
  fetchTours()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
