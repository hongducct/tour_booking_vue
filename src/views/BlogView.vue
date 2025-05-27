<template>
  <div class="min-h-screen bg-gray-50 mt-27">
    <TheHeader />

    <!-- Hero Section -->
    <div
      class="relative text-white py-16 h-[300px] md:h-[300px] lg:h-[300px] sm:h-auto"
      style="
        background: url('https://res.cloudinary.com/dlhra4ihw/image/upload/v1747734951/o3jn0zgirfrmxttw5wkd.jpg')
          center/cover no-repeat;
      "
    >
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="container mx-auto px-4 relative z-10 h-full flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Blog & Tin tức</h1>
          <p class="text-xl opacity-90 max-w-2xl mx-auto">
            Khám phá những bài viết mới nhất, thông tin hữu ích và xu hướng công nghệ
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Loading State -->
      <div v-if="loading">
        <!-- Featured Post Skeleton -->
        <div class="mb-12">
          <LoadingSkeleton :featured="true" />
        </div>
        <!-- Regular Posts Skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <LoadingSkeleton v-for="i in 6" :key="i" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <div class="text-red-600 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="fetchNews(currentPage)"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>

      <!-- Blog Grid -->
      <div v-else-if="news.length > 0">
        <!-- Featured Post (First post) -->
        <div class="mb-12">
          <BlogCard :post="news[0]" :featured="true" @click="navigateToPost(news[0].id)" />
        </div>

        <!-- Regular Posts Grid -->
        <div
          v-if="news.length > 1"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          <BlogCard
            v-for="post in news.slice(1)"
            :key="post.id"
            :post="post"
            @click="navigateToPost(post.id)"
          />
        </div>

        <!-- Pagination -->
        <BlogPagination :pagination="pagination" @page-change="changePage" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
        <p class="text-gray-600">Hãy quay lại sau để xem những bài viết mới nhất</p>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import BlogPagination from '@/components/blog/BlogPagination.vue'
import LoadingSkeleton from '@/components/blog/LoadingSkeleton.vue'

const router = useRouter()

const news = ref([])
const error = ref(null)
const loading = ref(false)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  links: [],
})
const currentPage = ref(1)

const fetchNews = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/news?page=${page}`)

    news.value = response.data.data
    pagination.value = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      links: response.data.meta.links,
      total: response.data.meta.total,
      per_page: response.data.meta.per_page,
      from: response.data.meta.from,
      to: response.data.meta.to,
    }
    currentPage.value = page

    // Scroll to top when changing pages
    if (page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải dữ liệu'
    console.error('Error fetching news:', err)
  } finally {
    loading.value = false
  }
}

const changePage = (url) => {
  if (!url) return
  const page = new URL(url).searchParams.get('page')
  fetchNews(parseInt(page))
}

// Slug generation function
const generateSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD') // Normalize to decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}

const navigateToPost = (postId, postTitle) => {
  const slug = generateSlug(postTitle)
  router.push(`/blog/${postId}-${slug}`)
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
