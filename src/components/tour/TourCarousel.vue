<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
})

const currentImageIndex = ref(0)
const isFullScreen = ref(false)

const currentImage = computed(() => {
  if (!props.images || props.images.length === 0) {
    return '/images/default-tour.jpg'
  }
  return props.images[currentImageIndex.value].image_url
})

const currentCaption = computed(() => {
  if (!props.images || props.images.length === 0) {
    return 'Hình ảnh tour'
  }
  return props.images[currentImageIndex.value].caption || 'Hình ảnh tour'
})

const displayedThumbnails = computed(() => {
  if (!props.images || props.images.length <= 3) {
    return props.images
  }

  const totalImages = props.images.length
  const half = Math.floor(3 / 2) // Số ảnh hiển thị mỗi bên
  const thumbnails = []

  for (let i = -half; i <= half; i++) {
    const index = (currentImageIndex.value + i + totalImages) % totalImages
    thumbnails.push(props.images[index])
  }
  return thumbnails
})

const nextImage = () => {
  if (props.images) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
  }
}

const prevImage = () => {
  if (props.images) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + props.images.length) % props.images.length
  }
}

const selectImage = (index) => {
  currentImageIndex.value = props.images.findIndex((img) => img.image_url === index.image_url)
}

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
}
</script>

<template>
  <div class="relative">
    <!-- Main Image Carousel -->
    <div class="relative">
      <img
        :src="currentImage"
        :alt="currentCaption"
        class="w-full h-80 sm:h-96 object-cover cursor-pointer"
        loading="lazy"
        @click="toggleFullScreen"
      />
      <div class="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg">
        {{ currentCaption }}
      </div>
      <button
        v-if="images && images.length > 1"
        @click="prevImage"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition carousel-button"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        v-if="images && images.length > 1"
        @click="nextImage"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition carousel-button"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Thumbnail List -->
    <div
      class="flex justify-center gap-2 mt-4 p-2"
      v-if="images && images.length > 1"
    >
      <div
        v-for="(image, index) in displayedThumbnails"
        :key="image.image_url"
        class="w-20 h-20 flex-shrink-0 cursor-pointer transition-all duration-300"
        :class="{
          'scale-125 border-2 border-teal-500': image.image_url === currentImage,
          'opacity-70': image.image_url !== currentImage,
        }"
        @click="selectImage(image)"
      >
        <img
          :src="image.image_url"
          :alt="image.caption || 'Hình ảnh tour'"
          class="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Fullscreen Modal -->
    <div
      v-if="isFullScreen"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      @click="toggleFullScreen"
    >
      <img :src="currentImage" :alt="currentCaption" class="max-w-full max-h-full object-contain" />
      <button class="absolute top-4 right-4 text-white text-2xl" @click.stop="toggleFullScreen">
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
:root {
  --teal-500: #2dd4bf;
  --teal-600: #0d9488;
}

.carousel-button {
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.carousel-button:hover {
  transform: scale(1.1);
}
</style>
