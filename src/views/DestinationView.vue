<template>
  <TheHeader />
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-30">
    <router-link
    v-for="loc in locations"
    :key="loc.id"
    :to="`/destination/${createSlug(loc.id, loc.name)}`"
    class="relative rounded-lg overflow-hidden shadow-lg group block"
    >
    <img
      :src="`/images/${loc.image}`"
      :alt="loc.name"
      class="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
    />
    <div class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
      {{ loc.city.toUpperCase() }}
    </div>
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
      <h3 class="text-white text-lg font-semibold">{{ loc.name }}</h3>
      <div class="flex items-center mt-1">
      <span v-for="star in 5" :key="star" class="text-yellow-400">★</span>
      </div>
    </div>
    </router-link>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'

// Hàm tạo slug từ id và name
const createSlug = (id, name) => {
  return `${id}-${name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`
}

const locations = ref([])

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})
const fetchLocations = async (page = 1) => {
  try {
  const res = await axios.get(`${apiBaseUrl}/locations?page=${page}`)
  // Kiểm tra dữ liệu trả về từ API
  console.log('API Response:', res.data)

  // Nếu API trả về dữ liệu trong `data.data`, hãy sửa lại như sau:
  locations.value = res.data.data || [] // Đảm bảo `locations` luôn là một mảng

  pagination.value = {
    current_page: res.data.current_page || 1,
    last_page: res.data.last_page || 1,
    next_page_url: res.data.next_page_url || null,
    prev_page_url: res.data.prev_page_url || null,
  }
  } catch (err) {
  console.error('Error fetching locations:', err.message)
  }
}

onMounted(() => {
  fetchLocations()
})
</script>
