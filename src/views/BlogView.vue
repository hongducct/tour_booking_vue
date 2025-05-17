<template>
  <TheHeader />
  <div class="col-span-4 lg:col-span-4 mt-30 dark-scrollbars">
    <aside class="bg-white p-4 rounded-2xl shadow-md">
      <h3 class="text-xl font-semibold mb-4">BÀI VIẾT MỚI NHẤT</h3>
      <ul>
        <li v-for="post in news" :key="post.id" class="mb-6 flex items-start gap-4">
          <RouterLink :to="`/blog/${post.id}`" class="flex-shrink-0">
            <img
              :src="post.image_url || '/images/placeholder.jpg'"
              :alt="post.title"
              class="w-28 h-20 object-cover rounded-xl"
              loading="lazy"
            />
          </RouterLink>
          <div class="flex-1">
            <h5 class="text-base font-medium text-gray-800 hover:text-blue-600">
              <RouterLink :to="`/blog/${post.id}`">
                {{ post.title }}
              </RouterLink>
            </h5>
            <div class="text-sm text-gray-500 mt-1 flex flex-wrap gap-1">
              <template v-if="post.vendor_name">
                <span class="flex items-center">
                  <UserIcon class="w-4 h-4 mr-1" />
                  {{ post.vendor_name }}
                </span>
              </template>
              <template v-if="post.published_at">
                <span class="flex items-center">
                  <CalendarIcon class="w-4 h-4 mx-1" />
                  {{ new Date(post.published_at).toLocaleDateString('vi-VN') }}
                </span>
              </template>
            </div>
          </div>
        </li>
      </ul>
      <!-- Phân trang -->
      <div v-if="pagination.last_page > 1" class="mt-4 flex justify-center gap-2">
        <button
          v-for="link in pagination.links"
          :key="link.label"
          @click="changePage(link.url)"
          :disabled="!link.url || link.active"
          class="px-3 py-1 rounded-md text-sm"
          :class="{
            'bg-blue-500 text-white': link.active,
            'bg-gray-200 text-gray-700': !link.active && link.url,
            'bg-gray-100 text-gray-400 cursor-not-allowed': !link.url,
          }"
        >
          {{ link.label }}
        </button>
      </div>
    </aside>
  </div>
  <TheFooter />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { UserIcon, CalendarIcon } from '@heroicons/vue/24/solid'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'

console.log('BlogView loaded')

const news = ref([])
const error = ref(null)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  links: [],
})
const currentPage = ref(1)

const fetchNews = async (page = 1) => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/news?page=${page}`)
    news.value = response.data.data
    pagination.value = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      links: response.data.meta.links,
    }
    currentPage.value = page
  } catch (err) {
    error.value = err.message
  }
}

const changePage = (url) => {
  if (!url) return
  const page = new URL(url).searchParams.get('page')
  fetchNews(page)
}

onMounted(() => {
  fetchNews()
})
</script>
