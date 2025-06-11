<!-- views/BlogDetail.vue -->
<template>
  <div class="min-h-screen bg-gray-50 mt-27">
    <TheHeader />

    <!-- Loading State -->
    <div v-if="loading" class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <BlogDetailSkeleton />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div class="text-red-600 mb-4">
              <ExclamationTriangleIcon class="w-16 h-16 mx-auto" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Không thể tải bài viết</h2>
            <p class="text-gray-600 mb-6">{{ error }}</p>
            <div class="flex gap-4 justify-center">
              <button
                @click="fetchBlogDetail"
                class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Thử lại
              </button>
              <router-link
                to="/blog"
                class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Quay lại danh sách
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog Content -->
    <article v-else-if="blog" class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <ol class="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <router-link to="/" class="hover:text-blue-600 transition-colors">
                  Trang chủ
                </router-link>
              </li>
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
              <li>
                <router-link to="/blog" class="hover:text-blue-600 transition-colors">
                  Blog
                </router-link>
              </li>
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
              <li class="text-gray-900 font-medium truncate">{{ blog.title }}</li>
            </ol>
          </nav>

          <!-- Article Header -->
          <header class="mb-8">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <!-- Featured Image -->
              <div class="relative">
                <img
                  :src="blog.image || '/images/placeholder.jpg'"
                  :alt="blog.title"
                  class="w-full h-64 md:h-80 lg:h-96 object-cover"
                  @error="handleImageError"
                />
                <!-- Share Button -->
                <div class="absolute top-6 right-6">
                  <button
                    @click="toggleShareMenu"
                    class="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ShareIcon class="w-5 h-5" />
                  </button>
                  <!-- Share Menu -->
                  <div
                    v-if="showShareMenu"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-10"
                  >
                    <button
                      v-for="platform in sharePlatforms"
                      :key="platform.name"
                      @click="shareOn(platform)"
                      class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <component :is="platform.icon" class="w-4 h-4 mr-3" />
                      {{ platform.name }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Article Meta -->
              <div class="p-6 md:p-8">
                <h1
                  class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                >
                  {{ blog.title }}
                </h1>

                <div class="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div class="flex items-center">
                    <UserIcon class="w-5 h-5 mr-2" />
                    <span class="font-medium">{{ blog.author }}</span>
                  </div>
                  <div class="flex items-center">
                    <CalendarIcon class="w-5 h-5 mr-2" />
                    <time :datetime="blog.publishedAt">{{ blog.date }}</time>
                  </div>
                  <div class="flex items-center">
                    <ClockIcon class="w-5 h-5 mr-2" />
                    <span>{{ readingTime }} phút đọc</span>
                  </div>
                  <div class="flex items-center">
                    <EyeIcon class="w-5 h-5 mr-2" />
                    <span>{{ blog.views || 0 }} lượt xem</span>
                  </div>
                </div>

                <!-- Tags -->
                <div v-if="blog.tags && blog.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
                  <span
                    v-for="tag in blog.tags"
                    :key="tag"
                    class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <!-- Article Content -->
          <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div class="prose prose-lg max-w-none" v-html="formattedContent"></div>
          </div>

          <!-- Reviews Section -->
          <TourReviews
            :reviews="blog.reviews"
            :reviewableId="blog.id"
            :reviewableType="'App\\Models\\News'"
            title="Đánh giá bài viết"
          />

          <!-- Article Actions -->
          <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div class="flex gap-4">
                <router-link
                  to="/blog"
                  class="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon class="w-5 h-5 mr-2" />
                  Quay lại
                </router-link>
                <button
                  @click="toggleLike"
                  :class="[
                    'inline-flex items-center font-semibold py-3 px-6 rounded-lg transition-colors',
                    isLiked
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                  ]"
                >
                  <HeartIcon :class="['w-5 h-5 mr-2', isLiked ? 'fill-current' : '']" />
                  {{ isLiked ? 'Đã thích' : 'Thích' }} ({{ likeCount }})
                </button>
              </div>
              <button
                @click="openBookingModal"
                class="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <TicketIcon class="w-5 h-5 mr-2" />
                Đặt tour ngay
              </button>
            </div>
          </div>

          <!-- Related Posts -->
          <div v-if="relatedPosts.length > 0" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Một số bài viết khác</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RelatedPostCard
                v-for="post in relatedPosts"
                :key="post.id"
                :post="post"
                @click="navigateToPost(post.id, post.title)"
              />
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- Booking Modal -->
    <BookingModal v-if="showBookingModal" @close="closeBookingModal" />

    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  TicketIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/solid'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import BlogDetailSkeleton from '@/components/blog/BlogDetailSkeleton.vue'
import RelatedPostCard from '@/components/blog/RelatedPostCard.vue'
import BookingModal from '@/components/blog/BookingModal.vue'
import TourReviews from '@/components/tour/TourReviews.vue'

const route = useRoute()
const router = useRouter()

const blog = ref(null)
const loading = ref(false)
const error = ref(null)
const isLiked = ref(false)
const likeCount = ref(0)
const showShareMenu = ref(false)
const showBookingModal = ref(false)
const relatedPosts = ref([])

// Share platforms
const sharePlatforms = [
  {
    name: 'Facebook',
    icon: 'div', // Replace with actual icon
    url: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'Twitter',
    icon: 'div', // Replace with actual icon
    url: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: 'Copy Link',
    icon: 'div',
    action: 'copy',
  },
]

const generateSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const readingTime = computed(() => {
  if (!blog.value?.content) return 1
  const wordsPerMinute = 200
  const wordCount = blog.value.content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
})

const formattedContent = computed(() => {
  if (!blog.value?.content) return ''
  return blog.value.content.replace(/\n\n/g, '</p><p class="mb-4">').replace(/\n/g, '<br>')
})

const fetchBlogDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const [blogResponse, relatedResponse] = await Promise.all([
      axios.get(`${apiBaseUrl}/news/${route.params.id}`),
      axios.get(`${apiBaseUrl}/news?limit=3`).catch(() => ({ data: { data: [] } })),
    ])

    const data = blogResponse.data.data
    // Parse tags if it's a stringified JSON or malformed array
    let tags = []
    if (typeof data.tags === 'string') {
      try {
        tags = JSON.parse(data.tags)
        // If tags is a string after parsing, try splitting by comma
        if (typeof tags === 'string') {
          tags = tags.split(',').map((t) => t.trim())
        }
      } catch {
        // Fallback: try to extract tags by splitting string
        tags = data.tags
          .replace(/[\[\]"]/g, '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      }
    } else if (Array.isArray(data.tags)) {
      tags = data.tags
    }

    blog.value = {
      id: data.id,
      title: data.title,
      slug: generateSlug(data.title),
      image: data.image_url,
      author: data.vendor_name,
      date: new Date(data.published_at).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      reviews: data.reviews || [],
      publishedAt: data.published_at,
      content: data.content || 'Nội dung đang cập nhật...',
      status: data.blog_status,
      tags,
      views: Math.floor(Math.random() * 1000) + 100,
    }
    const expectedPath = `/blog/${data.id}-${blog.value.slug}`
    if (route.path !== expectedPath) {
      router.replace(expectedPath)
    }

    relatedPosts.value = relatedResponse.data.data
      .filter((post) => post.id !== data.id)
      .map((post) => ({
        ...post,
        slug: generateSlug(post.title),
      }))
      .slice(0, 3)

    likeCount.value = Math.floor(Math.random() * 50) + 10
  } catch (err) {
    error.value = err.response?.data?.message || 'Không thể tải bài viết. Vui lòng thử lại sau.'
    console.error('Error fetching blog detail:', err)
  } finally {
    loading.value = false
  }
}

const handleImageError = (event) => {
  event.target.src = '/images/placeholder.jpg'
}

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const shareOn = (platform) => {
  const currentUrl = window.location.href
  const title = blog.value?.title || ''

  if (platform.action === 'copy') {
    navigator.clipboard.writeText(currentUrl)
    showShareMenu.value = false
    return
  }

  const shareUrl = platform.url(currentUrl, title)
  window.open(shareUrl, '_blank', 'width=600,height=400')
  showShareMenu.value = false
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

const openBookingModal = () => {
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
}

const navigateToPost = (postId, postTitle) => {
  const slug = generateSlug(postTitle)
  router.push(`/blog/${postId}-${slug}`)
}

const handleClickOutside = (event) => {
  if (showShareMenu.value && !event.target.closest('.share-menu')) {
    showShareMenu.value = false
  }
}

watch(
  () => route.params.id,
  () => {
    fetchBlogDetail()
  },
)

onMounted(() => {
  fetchBlogDetail()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #111827;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h1 {
  font-size: 2.25rem;
}
.prose h2 {
  font-size: 1.875rem;
}
.prose h3 {
  font-size: 1.5rem;
}
.prose h4 {
  font-size: 1.25rem;
}

.prose p {
  margin-bottom: 1.5rem;
}
.prose a {
  color: #3b82f6;
  text-decoration: underline;
}
.prose a:hover {
  color: #1d4ed8;
}
.prose img {
  border-radius: 0.5rem;
  margin: 2rem 0;
  max-width: 100%;
  height: auto;
}
.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
  margin: 2rem 0;
}
.prose ul,
.prose ol {
  margin: 1.5rem 0;
  padding-left: 2rem;
}
.prose li {
  margin: 0.5rem 0;
}
.prose code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 2rem 0;
}
.prose pre code {
  background-color: transparent;
  padding: 0;
}
</style>
