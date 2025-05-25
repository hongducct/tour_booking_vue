<template>
  <article
    class="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
    @click="$emit('click')"
  >
    <!-- Image -->
    <div class="relative overflow-hidden">
      <img
        :src="post.image_url || '/images/placeholder.jpg'"
        :alt="post.title"
        class="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      <!-- Status Badge -->
      <div class="absolute top-2 left-2">
        <span class="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
          {{ post.blog_status === 'published' ? 'Xuất bản' : 'Nháp' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Meta Info -->
      <div class="flex items-center text-xs text-gray-500 mb-2">
        <UserIcon class="w-3 h-3 mr-1" />
        <span class="truncate mr-2">{{ post.vendor_name }}</span>
        <span class="mx-1">•</span>
        <CalendarIcon class="w-3 h-3 mr-1" />
        <time :datetime="post.published_at">
          {{ formatDate(post.published_at) }}
        </time>
      </div>

      <!-- Title -->
      <h4
        class="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-2"
      >
        {{ post.title }}
      </h4>

      <!-- Excerpt -->
      <p class="text-gray-600 text-xs line-clamp-2 mb-3">
        {{ getExcerpt(post.content) }}
      </p>

      <!-- Read More -->
      <div class="flex items-center justify-between">
        <span class="text-blue-600 text-xs font-medium group-hover:text-blue-800 transition-colors">
          Xem chi tiết
        </span>
        <ArrowRightIcon
          class="w-3 h-3 text-blue-600 transform group-hover:translate-x-1 transition-transform"
        />
      </div>
    </div>
  </article>
</template>

<script setup>
import { UserIcon, CalendarIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getExcerpt = (content) => {
  if (!content) return ''
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')
  return plainText.length > 80 ? plainText.substring(0, 80) + '...' : plainText
}

const handleImageError = (event) => {
  event.target.src = '/images/placeholder.jpg'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
