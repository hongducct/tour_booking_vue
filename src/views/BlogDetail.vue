<template>
  <TheHeader />
  <section class="py-16 bg-white mt-30">
    <div class="container mx-auto px-4">
      <div v-if="blog" class="max-w-3xl mx-auto">
        <img :src="blog.image" alt="" class="w-full h-64 object-cover rounded-lg mb-6" />
        <h1 class="text-3xl font-bold mb-2">{{ blog.title }}</h1>
        <div class="text-gray-500 mb-4">✍ {{ blog.author }} - 📅 {{ blog.date }}</div>
        <p class="text-lg leading-relaxed text-gray-700">{{ blog.content }}</p>
      </div>
      <div v-else class="text-center text-gray-500">Đang tải bài viết...</div>
    </div>
    <div class="mt-6 flex gap-4">
      <router-link
        to="/blog"
        class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md"
      >
        Quay lại
      </router-link>
      <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md">
        Đặt tour ngay
      </button>
    </div>
  </section>
  <TheFooter />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'

const route = useRoute()
const blog = ref(null)

onMounted(async () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  try {
    const response = await axios.get(`${apiBaseUrl}/news/${route.params.id}`)
    const data = response.data.data
    blog.value = {
      title: data.title,
      image: data.image_url,
      author: data.vendor_name,
      date: new Date(data.published_at).toLocaleDateString('vi-VN'),
      content: data.content || 'Nội dung đang cập nhật...', // nếu có content
    }
  } catch (error) {
    console.error('Lỗi khi tải chi tiết bài viết:', error)
  }
})
</script>
