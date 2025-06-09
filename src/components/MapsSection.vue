<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { MapPinIcon, GlobeAltIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
})

const mapContainer = ref(null)
const map = ref(null)
const isLoaded = ref(false)
const selectedLocation = ref(null)
const locations = ref([])
const loading = ref(true)

// Lấy base URL từ biến môi trường
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// Hàm tạo slug từ id và name
const createSlug = (id, name) => {
  return `${id}-${name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`
}

// Lấy dữ liệu từ API
const fetchLocations = async () => {
  try {
    loading.value = true
    const res = await axios.get(`${apiBaseUrl}/locations`)

    // Kiểm tra cấu trúc dữ liệu trả về
    if (res.data && res.data.data) {
      locations.value = res.data.data.map((location) => ({
        id: location.id,
        name: location.name,
        description: location.description.replace(/<\/?p>/g, ''), // Remove <p> tags
        lat: parseFloat(location.latitude),
        lng: parseFloat(location.longitude),
        image: location.image,
        city: location.city,
        country: location.country,
        url: `/destination/${createSlug(location.id, location.name)}`,
      }))
    }
  } catch (err) {
    console.error('Error fetching locations:', err.message)
  } finally {
    loading.value = false
  }
}

const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initMap = () => {
  if (!mapContainer.value || locations.value.length === 0) return

  // Tính toán center của bản đồ dựa trên trung bình các điểm
  const center = locations.value.reduce(
    (acc, loc) => {
      return {
        lat: acc.lat + loc.lat / locations.value.length,
        lng: acc.lng + loc.lng / locations.value.length,
      }
    },
    { lat: 0, lng: 0 },
  )

  map.value = new window.google.maps.Map(mapContainer.value, {
    zoom: 6,
    center: center,
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
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }, { lightness: 18 }],
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }, { lightness: 16 }],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }, { lightness: 21 }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#dedede' }, { lightness: 21 }],
      },
      {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3B82F6' }],
      },
    ],
  })

  const markers = []
  const infoWindows = []

  // Add markers for each location
  locations.value.forEach((location) => {
    const marker = new window.google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map.value,
      title: location.name,
      icon: {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="4"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40),
      },
    })

    markers.push(marker)

    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-3 max-w-xs">
          <h3 class="font-bold text-lg text-gray-800">${location.name}</h3>
          <p class="text-gray-600 text-sm mt-1">${location.city}, ${location.country}</p>
          <a href="${location.url}" class="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
            Xem chi tiết
          </a>
        </div>
      `,
    })

    infoWindows.push(infoWindow)

    marker.addListener('click', () => {
      // Close all open info windows
      infoWindows.forEach((iw) => iw.close())

      // Open this info window
      infoWindow.open(map.value, marker)
      selectedLocation.value = location
    })
  })

  // Cluster markers if there are many close together
  if (window.MarkerClusterer) {
    new window.MarkerClusterer(map.value, markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    })
  }
}

const selectDestination = (location) => {
  selectedLocation.value = location
  if (map.value) {
    map.value.setCenter({ lat: location.lat, lng: location.lng })
    map.value.setZoom(10)
  }
}

// Watch for changes in locations data
watch(
  locations,
  () => {
    if (isLoaded.value && locations.value.length > 0) {
      initMap()
    }
  },
  { deep: true },
)

onMounted(async () => {
  try {
    await fetchLocations()
    await loadGoogleMaps()
    isLoaded.value = true
    initMap()
  } catch (error) {
    console.error('Error loading Google Maps:', error)
  }
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4 max-w-7xl">
      <!-- Section Header -->
      <div class="mb-10">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between">
          <div class="lg:w-7/12">
            <h5 class="text-blue-600 font-semibold text-sm mb-2 flex items-center">
              <span class="inline-block w-8 h-0.5 bg-blue-600 mr-3"></span>
              KHÁM PHÁ TRÊN BẢN ĐỒ
            </h5>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800">ĐIỂM ĐẾN VIỆT NAM</h2>
          </div>
          <div class="lg:w-5/12 mt-4 lg:mt-0">
            <p class="text-gray-600">
              Khám phá các điểm đến hấp dẫn trên khắp đất nước Việt Nam qua bản đồ tương tác
            </p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Destinations List -->
        <div class="lg:col-span-1">
          <h3 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <MapPinIcon class="h-5 w-5 text-blue-600 mr-2" />
            Điểm đến phổ biến
          </h3>
          <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <div
              v-for="location in locations"
              :key="location.id"
              @click="selectDestination(location)"
              :class="[
                'p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md',
                selectedLocation?.id === location.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300',
              ]"
            >
              <div class="flex items-center space-x-3">
                <img
                  :src="location.image"
                  :alt="location.name"
                  class="w-16 h-16 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800">{{ location.name }}</h4>
                  <p class="text-sm text-gray-600">{{ location.city }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Map Container -->
        <div class="lg:col-span-2">
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <div
              ref="mapContainer"
              class="w-full h-96 lg:h-[500px]"
              v-show="isLoaded && !loading"
            ></div>
            <div
              v-if="!isLoaded || loading"
              class="w-full h-96 lg:h-[500px] flex items-center justify-center bg-gray-100"
            >
              <div class="text-center">
                <div
                  class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                ></div>
                <p class="text-gray-600">Đang tải bản đồ...</p>
              </div>
            </div>
          </div>

          <!-- Selected Location Info -->
          <div
            v-if="selectedLocation"
            class="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
          >
            <div class="flex items-start space-x-4">
              <img
                :src="selectedLocation.image"
                :alt="selectedLocation.name"
                class="w-20 h-20 rounded-lg object-cover"
              />
              <div class="flex-1">
                <h4 class="text-xl font-bold text-gray-800 mb-2">
                  {{ selectedLocation.name }}
                </h4>
                <p class="text-gray-600 mb-4">{{ selectedLocation.description }}</p>
                <div class="flex space-x-3">
                  <a
                    :href="selectedLocation.url"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xem chi tiết
                  </a>
                  <button
                    class="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Tìm tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 10px;
}
</style>
