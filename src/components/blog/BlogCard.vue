<template>
  <article :class="cardClasses" @click="$emit('click')">
    <!-- Image Container -->
    <div :class="imageContainerClasses">
      <img
        :src="post.image_url || 'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747734951/o3jn0zgirfrmxttw5wkd.jpg'"
        :alt="post.title"
        :class="imageClasses"
        loading="lazy"
        @error="handleImageError"
      />
      <!-- Status Badge -->
      <!-- <div class="absolute top-4 left-4">
        <span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          {{ post.blog_status === 'published' ? 'Đã xuất bản' : 'Bản nháp' }}
        </span>
      </div> -->
      <!-- Featured Badge -->
      <div v-if="featured" class="absolute top-4 right-4">
        <span
          class="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center"
        >
          <StarIcon class="w-3 h-3 mr-1" />
          Nổi bật
        </span>
      </div>
    </div>

    <!-- Content -->
    <div :class="contentClasses">
      <!-- Vendor Info -->
      <div class="flex items-center text-sm text-gray-500 mb-3">
        <UserIcon class="w-4 h-4 mr-2" />
        <span class="font-medium">{{ post.vendor_name }}</span>
        <span class="mx-2">•</span>
        <CalendarIcon class="w-4 h-4 mr-1" />
        <time :datetime="post.published_at">
          {{ formatDate(post.published_at) }}
        </time>
      </div>

      <!-- Title -->
      <h2 :class="titleClasses">
        {{ post.title }}
      </h2>

      <!-- Content Preview -->
      <p :class="excerptClasses">
        {{ getExcerpt(post.content) }}
      </p>

      <!-- Read More Link -->
      <div class="mt-4">
        <button
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors group"
        >
          Xem chi tiết
          <ArrowRightIcon
            class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <!-- Tags (if available) -->
      <div v-if="post.tags && post.tags.length > 0" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { UserIcon, CalendarIcon, StarIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'

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

defineEmits(['click'])

const cardClasses = computed(() => [
  'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden',
  {
    'lg:flex lg:items-stretch': props.featured,
    'transform hover:-translate-y-1': !props.featured,
  },
])

const imageContainerClasses = computed(() => [
  'relative overflow-hidden',
  {
    'lg:w-1/2 lg:flex-shrink-0': props.featured,
    'aspect-w-16 aspect-h-9': !props.featured,
  },
])

const imageClasses = computed(() => [
  'w-full object-cover transition-transform duration-300 group-hover:scale-105',
  {
    'h-full lg:h-75': props.featured,
    'h-48 md:h-56': !props.featured,
  },
])

const contentClasses = computed(() => [
  'p-6',
  {
    'lg:w-1/2 lg:flex lg:flex-col lg:justify-center': props.featured,
    'flex-1': !props.featured,
  },
])

const titleClasses = computed(() => [
  'font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors',
  {
    'text-2xl md:text-3xl mb-4': props.featured,
    'text-lg md:text-xl mb-3': !props.featured,
  },
])

const excerptClasses = computed(() => [
  'text-gray-600 line-clamp-3',
  {
    'text-base md:text-lg': props.featured,
    'text-sm': !props.featured,
  },
])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getExcerpt = (content) => {
  if (!content) return ''
  // Remove HTML tags and get first 150 characters
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
}

const handleImageError = (event) => {
  event.target.src = 'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747734951/o3jn0zgirfrmxttw5wkd.jpg'
}
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

.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
