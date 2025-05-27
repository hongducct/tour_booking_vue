<template>
  <section class="best-section py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Cột trái: Tiêu đề + carousel tour -->
        <div class="w-full lg:w-5/12">
          <div class="section-heading mb-8">
            <h5
              class="text-yellow-500 font-medium text-sm mb-2 uppercase tracking-wider relative inline-block before:absolute before:w-8 before:h-0.5 before:bg-yellow-500 before:left-0 before:top-1/2 before:-translate-x-full before:-ml-3"
            >
              OUR TOUR GALLERY
            </h5>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              BEST TRAVELER'S SHARED PHOTOS
            </h2>
            <p class="text-gray-600">
              Những bức ảnh đẹp trên hành trình TOUR được khách hàng chia sẻ.
            </p>
          </div>

          <!-- Featured Tour Carousel -->
          <div class="featured-tour-carousel relative overflow-hidden rounded-lg shadow-lg group">
            <!-- Carousel Navigation -->
            <button
              @click="prevTour"
              class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <span class="sr-only">Previous</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              @click="nextTour"
              class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <span class="sr-only">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <!-- Carousel Content -->
            <div class="relative h-80 w-full overflow-hidden">
              <div
                class="transition-transform duration-500 ease-in-out h-full w-full flex"
                :style="{ transform: `translateX(-${currentTourIndex * 100}%)` }"
              >
                <div
                  v-for="(tour, index) in featuredTours"
                  :key="index"
                  class="min-w-full h-full relative"
                >
                  <img
                    :src="tour.image"
                    :alt="tour.name"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div class="absolute bottom-0 left-0 w-full p-6 text-white">
                    <h4 class="text-2xl font-bold mb-2">{{ tour.name }}</h4>
                    <p class="text-sm opacity-80 line-clamp-2">{{ tour.description }}</p>
                    <router-link
                      :to="tour.route"
                      class="inline-block mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-medium transition-colors duration-300"
                      >Xem chi tiết</router-link
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Carousel Indicators -->
            <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              <button
                v-for="(_, index) in featuredTours"
                :key="'dot-' + index"
                @click="setTourIndex(index)"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="
                  index === currentTourIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                "
              >
                <span class="sr-only">Tour {{ index + 1 }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Cột phải: Danh sách ảnh gallery -->
        <div class="w-full lg:w-7/12">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div v-for="(image, index) in galleryImages.slice(0, 2)" :key="'small-' + index">
              <div
                class="gallery-item overflow-hidden rounded-lg shadow-md h-64 relative group cursor-pointer"
                @click="openLightbox(image)"
              >
                <img
                  :src="image.src"
                  :alt="image.alt"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <!-- Title overlay on hover at top -->
                <div
                  class="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent p-4 transform translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300"
                >
                  <h5 class="text-white font-medium text-sm">{{ image.alt }}</h5>
                </div>
                <!-- Zoom icon overlay -->
                <div
                  class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                >
                  <div
                    class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <span
                      class="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="gallery-item overflow-hidden rounded-lg shadow-md h-80 relative group cursor-pointer"
            @click="openLightbox(galleryImages[2])"
          >
            <img
              :src="galleryImages[2].src"
              :alt="galleryImages[2].alt"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <!-- Title overlay on hover at top -->
            <div
              class="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent p-4 transform translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300"
            >
              <h5 class="text-white font-medium text-sm">{{ galleryImages[2].alt }}</h5>
            </div>
            <!-- Zoom icon overlay -->
            <div
              class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <div
                class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              >
                <span class="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div
      v-if="lightboxOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      @click="closeLightbox"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>

      <!-- Modal Content -->
      <div
        class="relative z-10 max-w-[70vw] max-h-[90vh] sm:max-h-[80vh] md:max-h-[70vh] mx-auto"
        @click.stop
      >
        <!-- Close button -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Image -->
        <div class="rounded-lg overflow-hidden bg-white/5 shadow-xl">
          <img
            :src="currentLightboxImage.src"
            :alt="currentLightboxImage.alt"
            class="w-full h-auto max-h-[70vh] object-contain"
          />
          <!-- Caption -->
          <div class="p-4 bg-black/70">
            <p class="text-white text-center">{{ currentLightboxImage.alt }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

// Gallery Images
const galleryImages = [
  {
    src: 'https://cdn.bookingtour.vn/thumb_x315x250/upload/admin/2024/09/25/anh_dep_tour_thai_lan3-19075.jpg',
    alt: 'Ảnh đẹp Tour Thái Lan 3',
  },
  {
    src: 'https://cdn.bookingtour.vn/thumb_x315x250/upload/admin/2024/09/25/anh_dep_tour_thai_lan1-19071.jpg',
    alt: 'Ảnh đẹp Tour Thái Lan 1',
  },
  {
    src: 'https://cdn.bookingtour.vn/thumb_x655x350/upload/admin/2024/09/25/anh_dep_tour_thai_lan2-19075.jpg',
    alt: 'Ảnh đẹp Tour Thái Lan 2',
  },
]

// Featured Tours for Carousel with route instead of URL
const featuredTours = [
  {
    name: 'TOUR Thái Lan',
    description:
      'Khám phá vẻ đẹp của Thái Lan với các điểm đến hấp dẫn như Bangkok, Pattaya và Phuket.',
    image: 'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747664769/mycuepx9mbdo2euwltvu.png',
    route: '/tour/thai-lan',
  },
  {
    name: 'TOUR Singapore',
    description:
      'Trải nghiệm kỳ quan hiện đại tại Đảo quốc Sư Tử với Gardens by the Bay, Marina Bay Sands.',
    image: 'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747664769/mycuepx9mbdo2euwltvu.png',
    route: '/tour/singapore',
  },
  {
    name: 'TOUR Nhật Bản',
    description:
      'Khám phá đất nước mặt trời mọc với vẻ đẹp của núi Phú Sĩ, hoa anh đào và văn hóa độc đáo.',
    image: 'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747664769/mycuepx9mbdo2euwltvu.png',
    route: '/tour/nhat-ban',
  },
  {
    name: 'TOUR Hàn Quốc',
    description: 'Đắm chìm trong văn hóa K-Pop, ẩm thực và cảnh đẹp bốn mùa tại xứ sở kim chi.',
    image: 'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747664770/lwnt0iuygqnh9oap4vom.jpg',
    route: '/tour/han-quoc',
  },
  {
    name: 'TOUR Đài Loan',
    description: 'Khám phá Đài Bắc và các điểm đến hấp dẫn với ẩm thực phong phú tại Đài Loan.',
    image: 'https://res.cloudinary.com/dlhra4ihw/image/upload/v1747505256/k89qj8jxmaq3bxhycgr2.jpg',
    route: '/tour/dai-loan',
  },
]

// Carousel state
const currentTourIndex = ref(0)
const autoplayInterval = ref(null)

// Lightbox state
const lightboxOpen = ref(false)
const currentLightboxImage = ref({})

// Carousel controls
const nextTour = () => {
  currentTourIndex.value = (currentTourIndex.value + 1) % featuredTours.length
  resetAutoplay()
}

const prevTour = () => {
  currentTourIndex.value =
    (currentTourIndex.value - 1 + featuredTours.length) % featuredTours.length
  resetAutoplay()
}

const setTourIndex = (index) => {
  currentTourIndex.value = index
  resetAutoplay()
}

// Lightbox controls
const openLightbox = (image) => {
  currentLightboxImage.value = image
  lightboxOpen.value = true
  // Add no-scroll class to body for mobile
  document.body.classList.add('overflow-hidden')
}

const closeLightbox = () => {
  lightboxOpen.value = false
  // Remove no-scroll class from body
  document.body.classList.remove('overflow-hidden')
}

// Handle escape key to close lightbox
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && lightboxOpen.value) {
    closeLightbox()
  }
}

// Setup autoplay
const startAutoplay = () => {
  autoplayInterval.value = setInterval(() => {
    nextTour()
  }, 5000) // Change slide every 5 seconds
}

const resetAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    startAutoplay()
  }
}

// Setup event listeners
onMounted(() => {
  startAutoplay()
  document.addEventListener('keydown', handleKeyDown)
})

// Clean up event listeners
onUnmounted(() => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
  document.removeEventListener('keydown', handleKeyDown)
  // Ensure body scroll is restored if component is unmounted while lightbox is open
  if (lightboxOpen.value) {
    document.body.classList.remove('overflow-hidden')
  }
})
/* Remove component when unmounting */
// onUnmounted(cleanup);
</script>

<style scoped>
/* Line clamp for descriptions */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}


</style>
