```vue
<template>
  <TheHeader />

  <!-- Breadcrumb -->
  <div class="bg-gray-100 py-4 mt-20">
    <div class="container mx-auto px-4">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link
              to="/"
              class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <HomeIcon class="w-4 h-4 mr-2" />
              Trang chủ
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
              <router-link
                to="/destination"
                class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
              >
                Điểm đến
              </router-link>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {{ locationData?.location?.name || 'Chi tiết' }}
              </span>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  </div>

  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <ExclamationTriangleIcon class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button
        @click="fetchLocationData"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Thử lại
      </button>
    </div>

    <!-- Main Content -->
    <div v-else-if="locationData" class="space-y-8">
      <!-- Hero Section -->
      <div class="relative">
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <!-- Image -->
          <div class="order-2 lg:order-1">
            <img
              v-if="locationData.location.image"
              :src="locationData.location.image"
              :alt="locationData.location.name"
              class="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
            <div
              v-else
              class="w-full h-96 lg:h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center"
            >
              <PhotoIcon class="w-20 h-20 text-gray-400" />
            </div>
          </div>

          <!-- Info -->
          <div class="order-1 lg:order-2 space-y-6">
            <div>
              <div class="flex items-center space-x-2 text-blue-600 mb-2">
                <MapPinIcon class="w-5 h-5" />
                <span class="text-sm font-medium"
                  >{{ locationData.location.city }}, {{ locationData.location.country }}</span
                >
              </div>
              <h1 class="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                {{ locationData.location.name }}
              </h1>
              <div>
                <div
                  class="text-lg text-gray-600 leading-relaxed prose max-w-none overflow-hidden transition-all"
                  :class="{
                    'line-clamp-2': !showFullDescription,
                  }"
                  v-html="locationData.location.description"
                  ref="descRef"
                ></div>
                <button
                  v-if="isLongDescription"
                  @click="showFullDescription = !showFullDescription"
                  class="mt-2 text-blue-600 hover:underline focus:outline-none text-sm font-medium"
                >
                  {{ showFullDescription ? 'Thu gọn' : 'Xem thêm' }}
                </button>
              </div>
            </div>

            <!-- Map Section -->
            <div class="w-full h-80 rounded-xl overflow-hidden shadow-md bg-gray-100">
              <div ref="mapContainer" class="w-full h-full" v-show="mapLoaded"></div>
              <div v-if="!mapLoaded" class="w-full h-full flex items-center justify-center">
                <div class="text-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
                  ></div>
                  <p class="text-gray-600 text-sm">Đang tải bản đồ...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tours Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">
              Các Tour tại {{ locationData.location.name }}
            </h2>
            <p class="text-gray-600">
              Khám phá {{ locationData.tours.total }} tour du lịch hấp dẫn
            </p>
          </div>
          <div class="text-sm text-gray-500">{{ locationData.tours.total }} tour có sẵn</div>
        </div>

        <!-- Tours Grid -->
        <div v-if="locationData.tours?.data?.length" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <TourCard v-for="tour in locationData.tours.data" :key="tour.id" :tour="tour" />
          </div>

          <!-- Pagination -->
          <div v-if="locationData.tours.last_page > 1" class="flex justify-center mt-8">
            <nav class="flex items-center space-x-2">
              <button
                v-for="page in getPaginationPages()"
                :key="`page-${page}`"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  page === locationData.tours.current_page
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </div>

        <!-- No Tours State -->
        <div v-else class="text-center py-12">
          <ExclamationCircleIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Chưa có tour nào</h3>
          <p class="text-gray-600 mb-6">Hiện tại chưa có tour du lịch nào tại địa điểm này.</p>
          <router-link
            to="/tours"
            class="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Xem tất cả tour
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <TheFooter class="mt-16" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TourCard from '@/components/TourCard.vue'

import {
  HomeIcon,
  ChevronRightIcon,
  MapPinIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const locationData = ref(null)
const error = ref(null)
const loading = ref(true)
const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const mapLoaded = ref(false)
const showFullDescription = ref(false)
const descRef = ref(null)
const isLongDescription = ref(false)

watch(
  () => locationData.value?.location?.description,
  async (desc) => {
    await nextTick()
    if (descRef.value) {
      // Check if the description overflows (more than 2 lines)
      const el = descRef.value
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24
      const maxHeight = lineHeight * 2
      isLongDescription.value = el.scrollHeight > maxHeight + 2 // allow for rounding
    } else {
      isLongDescription.value = false
    }
  },
  { immediate: true },
)

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Get pagination pages
const getPaginationPages = () => {
  const current = locationData.value?.tours?.current_page
  const last = locationData.value?.tours?.last_page
  const pages = []
  if (!current || !last) return pages

  for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
    pages.push(i)
  }
  return pages
}

// Load Google Maps script
const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      console.log('Google Maps already loaded')
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('Google Maps script loaded')
      resolve()
    }
    script.onerror = (err) => {
      console.error('Failed to load Google Maps:', err)
      reject(err)
    }
    document.head.appendChild(script)
  })
}

// Initialize map
const initMap = async () => {
  console.log('locationData.value:', locationData.value?.location)
  console.log('mapContainer.value:', mapContainer.value)

  if (!locationData.value?.location) {
    console.error('Missing location data')
    return
  }

  if (!mapContainer.value) {
    console.error('Map container is null, retrying...')
    let retries = 0
    const maxRetries = 50

    await new Promise((resolve, reject) => {
      const checkContainer = () => {
        if (mapContainer.value) {
          console.log('Map container found:', mapContainer.value)
          resolve()
        } else if (retries >= maxRetries) {
          console.error('Max retries reached, map container still not found')
          reject(new Error('Map container not found after maximum retries'))
        } else {
          retries++
          console.log(`Retry ${retries}: Map container not found, waiting...`)
          setTimeout(checkContainer, 100)
        }
      }
      checkContainer()
    }).catch((err) => {
      console.error(err.message)
      mapLoaded.value = false
      return
    })
  }

  if (!mapContainer.value) {
    console.error('Map initialization aborted: map container not found')
    return
  }

  const { latitude, longitude, name, city, country } = locationData.value.location
  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)

  if (isNaN(lat) || isNaN(lng)) {
    console.error('Invalid coordinates:', { latitude, longitude })
    return
  }

  try {
    await loadGoogleMaps()

    map.value = new window.google.maps.Map(mapContainer.value, {
      center: { lat, lng },
      zoom: 12,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [{ color: '#ffffff' }, { lightness: 17 }],
        },
      ],
    })

    // Add marker
    marker.value = new window.google.maps.Marker({
      position: { lat, lng },
      map: map.value,
      title: name,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#EAB308" stroke="white" stroke-width="4"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
            </svg>
          `),
        scaledSize: new window.google.maps.Size(40, 40),
      },
    })

    // Add info window
    const infowindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-semibold text-sm">${name}</h3>
          <p class="text-sm">${city}, ${country}</p>
        </div>`,
    })

    marker.value.addListener('click', () => {
      infowindow.open(map.value, marker.value)
    })

    mapLoaded.value = true
    console.log('Map initialized successfully')
  } catch (err) {
    console.error('Map initialization error:', err)
    mapLoaded.value = false
  }
}

// Fetch location data
const fetchLocationData = async () => {
  try {
    loading.value = true
    error.value = null

    const id = route.params.id.split('-')[0]
    const response = await axios.get(`${apiBaseUrl}/locations/${id}/tours`)
    console.log('API response:', response.data)
    locationData.value = response.data
  } catch (err) {
    console.error('Error fetching location data:', err)
    error.value = 'Không thể tải thông tin địa điểm. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLocationData()
})

// Watch for locationData changes to initialize map
watch(locationData, (newData) => {
  if (newData) {
    nextTick(() => {
      initMap()
    })
  }
})

// Watch for route changes
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      fetchLocationData()
    }
  },
)
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin: 0;
}

.prose ul {
  margin: 0;
  padding-left: 1rem;
}

.prose li {
  margin: 0;
}
</style>
```
