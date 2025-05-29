<template>
  <article :class="cardClasses">
    <!-- Image Container -->
    <div :class="imageContainerClasses">
      <RouterLink :to="`/blog/${createSlug(post.id, post.title)}`" class="block group">
        <div class="relative overflow-hidden">
          <img
            :src="
              post.image_url ||
              'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747734951/o3jn0zgirfrmxttw5wkd.jpg'
            "
            :alt="post.title"
            :class="imageClasses"
            loading="lazy"
            @error="handleImageError"
          />
          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </div>
      </RouterLink>

      <!-- Featured Badge -->
      <div v-if="featured" class="absolute top-3 right-3 z-10">
        <div
          class="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-lg backdrop-blur-sm"
        >
          <StarIcon class="w-3 h-3 mr-1.5" />
          Nổi bật
        </div>
      </div>

      <!-- Status Badge -->
      <div class="absolute top-3 left-3 z-10">
        <div
          class="bg-emerald-500/90 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
        >
          {{ post.blog_status === 'published' ? 'Đã xuất bản' : 'Bản nháp' }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div :class="contentClasses">
      <!-- Main Content Area -->
      <div class="flex-1">
        <!-- Author & Date Info -->
        <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div class="flex items-center">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3"
            >
              <UserIcon class="w-4 h-4 text-white" />
            </div>
            <div>
              <p class="font-semibold text-gray-700">{{ post.vendor_name }}</p>
              <div class="flex items-center text-xs">
                <CalendarIcon class="w-3 h-3 mr-1" />
                <time :datetime="post.published_at || post.created_at">
                  {{ formatDate(post.published_at || post.created_at) }}
                </time>
              </div>
            </div>
          </div>

          <!-- Reading Time Estimate -->
          <div class="flex items-center text-xs text-gray-400">
            <ClockIcon class="w-3 h-3 mr-1" />
            {{ getReadingTime(post.content) }} phút đọc
          </div>
        </div>

        <!-- Title -->
        <h2 :class="titleClasses">
          <RouterLink
            :to="`/blog/${createSlug(post.id, post.title)}`"
            class="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            {{ post.title }}
          </RouterLink>
        </h2>

        <!-- Content Preview -->
        <div class="min-h-[4rem] mb-4">
          <p :class="excerptClasses" v-if="getExcerpt(post.content)">
            {{ getExcerpt(post.content) }}
          </p>
          <p v-else class="text-gray-400 text-sm italic">Không có nội dung xem trước</p>
        </div>

        <!-- Engagement Stats -->
        <div class="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div class="flex items-center">
            <EyeIcon class="w-4 h-4 mr-1" />
            <span>{{ formatNumber(Math.floor(Math.random() * 1000) + 100) }}</span>
          </div>
          <div class="flex items-center">
            <ChatBubbleLeftIcon class="w-4 h-4 mr-1" />
            <span>{{ formatNumber(post.review_count || 0) }}</span>
          </div>
          <div class="flex items-center">
            <ShareIcon class="w-4 h-4 mr-1" />
            <span>{{ Math.floor(Math.random() * 50) }}</span>
          </div>
          <!-- Rating Display (if available) -->
          <div v-if="post.average_rating > 0" class="flex items-center">
            <StarIcon class="w-4 h-4 mr-1 text-yellow-500 fill-current" />
            <span class="font-medium">{{ post.average_rating.toFixed(1) }}</span>
            <span class="text-xs text-gray-400 ml-1">({{ post.review_count }})</span>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 cursor-pointer"
          >
            <TagIcon class="w-3 h-3 mr-1" />
            {{ tag }}
          </span>
          <span v-if="post.tags.length > 3" class="text-xs text-gray-500 px-2 py-1">
            +{{ post.tags.length - 3 }} thẻ khác
          </span>
        </div>
      </div>

      <!-- Fixed Actions Area -->
      <div class="mt-auto pt-4 border-t border-gray-100">
        <div class="flex justify-between items-center">
          <RouterLink
            :to="`/blog/${createSlug(post.id, post.title)}`"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            Xem chi tiết
            <ArrowRightIcon
              class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
            />
          </RouterLink>

          <div class="flex items-center gap-2">
            <!-- Wishlist Button -->
            <button
              @click.stop="toggleWishlist"
              :class="wishlistButtonClasses"
              class="p-2 rounded-full transition-all duration-200 transform hover:scale-110"
              :title="isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'"
            >
              <HeartIcon class="w-5 h-5" />
            </button>

            <!-- Share Button -->
            <button
              @click.stop="sharePost"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 transform hover:scale-110"
              title="Chia sẻ"
            >
              <ShareIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import {
  UserIcon,
  CalendarIcon,
  StarIcon,
  ArrowRightIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/vue/24/outline'

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-wishlist'])

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('userToken')
const isInWishlist = ref(false)

// Computed Classes
const cardClasses = computed(() => [
  'group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100',
  {
    'lg:flex h-auto': props.featured,
    'w-full h-full flex flex-col transform hover:-translate-y-2': !props.featured,
  },
  'hover:border-blue-200',
])

const imageContainerClasses = computed(() => [
  'relative',
  {
    'lg:w-1/2 lg:flex-shrink-0': props.featured,
    'w-full': !props.featured,
  },
])

const imageClasses = computed(() => [
  'w-full object-cover transition-all duration-500 group-hover:scale-110',
  {
    'h-full lg:h-80': props.featured,
    'h-48 sm:h-56 md:h-64': !props.featured,
  },
])

const contentClasses = computed(() => [
  'p-6 flex flex-col',
  {
    'lg:w-1/2 lg:justify-between': props.featured,
    'flex-1 h-full': !props.featured,
  },
])

const titleClasses = computed(() => [
  'font-bold text-gray-900 line-clamp-2 leading-tight mb-3',
  {
    'text-2xl md:text-3xl lg:text-4xl': props.featured,
    'text-lg md:text-xl': !props.featured,
  },
])

const excerptClasses = computed(() => [
  'text-gray-600 line-clamp-3 leading-relaxed',
  {
    'text-base md:text-lg': props.featured,
    'text-sm': !props.featured,
  },
])

const wishlistButtonClasses = computed(() => [
  isInWishlist.value
    ? 'bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600'
    : 'bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500',
])

// Utility Functions
const createSlug = (id, title) => {
  return `${id}-${title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`

  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getExcerpt = (content) => {
  if (!content) return ''
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText
}

const getReadingTime = (content) => {
  if (!content) return 1
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const handleImageError = (event) => {
  event.target.src =
    'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747734951/o3jn0zgirfrmxttw5wkd.jpg'
}

// API Functions
const checkWishlistStatus = async () => {
  if (!token) return

  try {
    const res = await axios.get(`${baseUrl}/user/wishlist/check/${props.post.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    isInWishlist.value = res.data.isInWishlist
  } catch (err) {
    console.error('Kiểm tra wishlist thất bại:', err)
  }
}

const toggleWishlist = async () => {
  if (!token) {
    alert('Bạn cần đăng nhập để thêm blog vào danh sách yêu thích!')
    router.push('/login')
    return
  }

  try {
    if (isInWishlist.value) {
      await axios.delete(`${baseUrl}/user/wishlist/${props.post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      isInWishlist.value = false
      emit('toggle-wishlist', props.post.id, 'blog')
    } else {
      await axios.post(
        `${baseUrl}/user/wishlist`,
        {
          favoritable_id: props.post.id,
          favoritable_type: 'App\\Models\\News',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      isInWishlist.value = true
      toast.success('Đã thêm vào danh sách yêu thích!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      emit('toggle-wishlist', props.post.id, 'blog')
    }
  } catch (err) {
    console.error('Thao tác với wishlist thất bại:', err)
    toast.error('Không thể thực hiện thao tác. Vui lòng thử lại!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }
}

const sharePost = async () => {
  const url = `${window.location.origin}/blog/${createSlug(props.post.id, props.post.title)}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: props.post.title,
        text: getExcerpt(props.post.content),
        url: url,
      })
    } catch (err) {
      console.log('Chia sẻ bị hủy')
    }
  } else {
    try {
      await navigator.clipboard.writeText(url)
      alert('Đã sao chép link vào clipboard!')
    } catch (err) {
      console.error('Không thể sao chép link:', err)
    }
  }
}

onMounted(() => {
  checkWishlistStatus()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for content */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth hover animations */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Gradient text animation */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.hover\:bg-gradient-to-r:hover {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* Card entrance animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group {
  animation: fadeInUp 0.6s ease-out;
}

@media (min-width: 1024px) {
  .group.lg\:flex {
    min-height: 320px;
  }
}
</style>
