<template>
  <section class="py-16 bg-gray-100">
    <div class="container mx-auto px-4">
      <!-- Tiêu đề -->
      <div class="text-center mb-10">
        <h5 class="text-yellow-500 uppercase font-semibold tracking-wider">FROM OUR BLOG</h5>
        <h2 class="text-3xl font-bold">CHIA SẺ GẦN ĐÂY</h2>
        <p class="mt-2 text-gray-600">Những kinh nghiệm thú vị về du lịch được chia sẻ ở đây.</p>
      </div>

      <!-- Danh sách bài viết -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="(post, index) in blogPosts"
          :key="index"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <figure class="relative">
            <router-link :to="`/blog/${post.id}`">
              <img :src="post.image" :alt="post.title" class="w-full h-56 object-cover" />
            </router-link>
          </figure>
          <div class="p-5">
            <h3 class="text-lg font-bold mb-2">
              <router-link :to="`/blog/${post.id}`" class="hover:text-yellow-500 transition">
                {{ post.title }}
              </router-link>
            </h3>
            <div class="text-sm text-gray-500">
              <span class="mr-2">✍ {{ post.author }}</span>
              <span>📅 {{ post.date }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const blogPosts = ref([])

onMounted(async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/news`)
    const data = response.data.data

    const latestPosts = data
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
      .slice(0, 3)
      .map((post) => ({
        id: post.id,
        title: post.title,
        image: post.image_url.startsWith('/storage/')
          ? post.image_url.replace('/storage/', '')
          : post.image_url,
        author: post.vendor_name,
        date: new Date(post.published_at).toLocaleDateString('vi-VN'),
      }))

    blogPosts.value = latestPosts
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu blog:', error)
  }
})
</script>

<style scoped>
/* CSS tùy chỉnh (nếu cần) */
</style>
