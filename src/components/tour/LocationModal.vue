<template>
  <transition
    name="modal"
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 scale-95"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white bg-opacity-20 rounded-lg">
                <MapPinIcon class="w-6 h-6 text-black" />
              </div>
              <h2 class="text-2xl font-bold text-white">Tạo địa điểm mới</h2>
            </div>
            <button
              @click="$emit('close')"
              class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form @submit.prevent="submitLocation" class="space-y-6">
            <!-- Basic Info Section -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <InformationCircleIcon class="w-5 h-5 text-gray-600" />
                Thông tin cơ bản
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="locationForm.name"
                  label="Tên địa điểm"
                  required
                  class="w-full"
                  :icon="TagIcon"
                />

                <BaseInput
                  v-model="locationForm.country"
                  label="Quốc gia"
                  required
                  class="w-full"
                  :icon="GlobeAltIcon"
                />

                <BaseInput
                  v-model="locationForm.city"
                  label="Thành phố"
                  required
                  class="w-full"
                  :icon="BuildingOffice2Icon"
                />
              </div>
            </div>

            <!-- Description Section -->
            <div class="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DocumentTextIcon class="w-5 h-5 text-purple-600" />
                Mô tả
              </h3>

              <RichTextEditor
                :value="locationForm.description"
                @update:value="locationForm.description = $event"
                placeholder="Viết mô tả chi tiết về địa điểm..."
                class="min-h-[200px]"
              />
            </div>

            <!-- Image Section -->
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CameraIcon class="w-5 h-5 text-blue-600" />
                Hình ảnh
              </h3>

              <div class="mb-4">
                <label
                  class="flex items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                >
                  <div class="flex flex-col items-center">
                    <CloudArrowUpIcon class="w-8 h-8 text-blue-500 mb-2" />
                    <span class="text-sm font-medium text-blue-600">Chọn ảnh để tải lên</span>
                    <span class="text-xs text-blue-500 mt-1">PNG, JPG, JPEG (tối đa 10MB)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleLocationImageUpload"
                    class="hidden"
                  />
                </label>
              </div>

              <div v-if="locationForm.image" class="relative">
                <img
                  :src="locationForm.image"
                  alt="Location Image"
                  class="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  @click="locationForm.image = ''"
                  class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Coordinates Section with Map -->
            <div class="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPinIcon class="w-5 h-5 text-green-600" />
                Tọa độ GPS
              </h3>

              <!-- Coordinate Inputs -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <BaseInput
                  v-model.number="locationForm.latitude"
                  label="Vĩ độ (Latitude)"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  class="w-full"
                  placeholder="Ví dụ: 21.0285"
                  @input="debouncedUpdateMapFromInputs"
                />
                <BaseInput
                  v-model.number="locationForm.longitude"
                  label="Kinh độ (Longitude)"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  class="w-full"
                  placeholder="Ví dụ: 105.8542"
                  @input="debouncedUpdateMapFromInputs"
                />
              </div>

              <!-- Quick Location Buttons -->
              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  @click="setLocation(21.0285, 105.8542, 'Hà Nội')"
                  class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                >
                  Hà Nội
                </button>
                <button
                  type="button"
                  @click="setLocation(10.8231, 106.6297, 'TP.HCM')"
                  class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                >
                  TP.HCM
                </button>
                <button
                  type="button"
                  @click="setLocation(16.0544, 108.2022, 'Đà Nẵng')"
                  class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                >
                  Đà Nẵng
                </button>
                <button
                  type="button"
                  @click="setLocation(20.9101, 106.8621, 'Hạ Long')"
                  class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                >
                  Hạ Long
                </button>
                <button
                  type="button"
                  @click="getCurrentLocation"
                  :disabled="locationLoading"
                  class="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  {{ locationLoading ? 'Đang định vị...' : 'Vị trí hiện tại' }}
                </button>
              </div>

              <!-- Map Toggle Button -->
              <div class="mb-4">
                <button
                  type="button"
                  @click="toggleMapView"
                  :disabled="mapInitializing"
                  class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <MapPinIcon class="w-5 h-5 mr-2" />
                  {{ mapInitializing ? 'Đang tải...' : showMap ? 'Ẩn bản đồ' : 'Hiển thị bản đồ' }}
                </button>
                <p class="text-sm text-gray-600 mt-2">
                  {{
                    showMap
                      ? 'Click vào bản đồ để chọn vị trí hoặc kéo marker để điều chỉnh'
                      : 'Bạn có thể nhập tọa độ trực tiếp hoặc sử dụng bản đồ tương tác'
                  }}
                </p>
              </div>

              <!-- Map Container -->
              <div v-if="showMap" class="mb-4">
                <div
                  class="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-200"
                >
                  <div
                    :key="mapKey"
                    ref="mapContainer"
                    class="w-full h-full"
                    v-show="mapLoaded && !mapInitializing"
                  ></div>

                  <!-- Loading State -->
                  <div
                    v-if="mapInitializing"
                    class="absolute inset-0 flex items-center justify-center bg-gray-100"
                  >
                    <div class="text-center">
                      <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"
                      ></div>
                      <p class="text-gray-600 text-sm">Đang tải bản đồ...</p>
                    </div>
                  </div>

                  <!-- Map Error State -->
                  <div
                    v-if="!mapInitializing && !mapLoaded && showMap"
                    class="absolute inset-0 flex items-center justify-center bg-gray-100"
                  >
                    <div class="text-center">
                      <p class="text-gray-600 text-sm mb-2">Không thể tải bản đồ</p>
                      <button
                        type="button"
                        @click="retryMapInit"
                        class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Thử lại
                      </button>
                    </div>
                  </div>

                  <!-- Search Box -->
                  <div
                    v-if="mapLoaded && !mapInitializing"
                    class="absolute top-3 left-3 right-3 z-10"
                  >
                    <div class="relative">
                      <input
                        ref="searchInput"
                        type="text"
                        placeholder="Tìm kiếm địa điểm..."
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                      />
                      <MagnifyingGlassIcon class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <!-- Map Controls -->
                  <div
                    v-if="mapLoaded && !mapInitializing"
                    class="absolute bottom-3 right-3 flex flex-col gap-2"
                  >
                    <button
                      type="button"
                      @click="centerMapOnCurrentLocation"
                      class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Vị trí hiện tại"
                    >
                      <MapPinIcon class="w-5 h-5 text-green-600" />
                    </button>
                    <button
                      type="button"
                      @click="resetMap"
                      class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Đặt lại bản đồ"
                    >
                      <ArrowPathIcon class="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="text-sm text-gray-500 flex items-center">
                <InformationCircleIcon class="w-4 h-4 mr-1" />
                Tọa độ GPS giúp xác định vị trí chính xác của địa điểm trên bản đồ
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <BaseButton label="Hủy" color="gray" @click="$emit('close')" class="px-6 py-2" />
              <BaseButton
                type="submit"
                color="success"
                label="Tạo địa điểm"
                :icon="mdiCheck"
                class="px-6 py-2"
                :loading="loading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import axios from 'axios'
import BaseInput from '@/components/admin/BaseInput.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import RichTextEditor from '@/components/blog/RichTextEditor.vue'

// Heroicons imports
import {
  MapPinIcon,
  XMarkIcon,
  InformationCircleIcon,
  TagIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  CameraIcon,
  CloudArrowUpIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'

import { mdiCheck } from '@mdi/js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'created'])

// Form data
const locationForm = ref({
  name: '',
  description: '',
  country: '',
  city: '',
  image: '',
  latitude: null,
  longitude: null,
})

// Loading states
const loading = ref(false)
const locationLoading = ref(false)

// Map state
const mapContainer = ref(null)
const searchInput = ref(null)
const map = ref(null)
const marker = ref(null)
const mapLoaded = ref(false)
const mapInitializing = ref(false)
const searchBox = ref(null)
const showMap = ref(false)
const mapKey = ref(0)

// Debounce timer
let debounceTimer = null

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Debounced function for input updates
const debouncedUpdateMapFromInputs = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    if (showMap.value && mapLoaded.value) {
      updateMapFromInputs()
    }
  }, 300)
}

// Set predefined location
const setLocation = (lat, lng, name) => {
  locationForm.value.latitude = lat
  locationForm.value.longitude = lng
  if (!locationForm.value.name && name) {
    locationForm.value.name = name
  }

  // Update map if it's visible
  if (showMap.value && mapLoaded.value) {
    updateMapFromInputs()
  }
}

// Get current location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Trình duyệt của bạn không hỗ trợ định vị.')
    return
  }

  locationLoading.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      locationForm.value.latitude = parseFloat(lat.toFixed(6))
      locationForm.value.longitude = parseFloat(lng.toFixed(6))

      // Update map if visible
      if (showMap.value && mapLoaded.value) {
        updateMapFromInputs()
      }
      locationLoading.value = false
    },
    (error) => {
      console.error('Error getting current location:', error)
      alert('Không thể xác định vị trí hiện tại của bạn.')
      locationLoading.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    },
  )
}

// Load Google Maps
const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      if (window.google?.maps) {
        resolve()
      } else {
        existingScript.addEventListener('load', resolve)
        existingScript.addEventListener('error', reject)
      }
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Initialize map
const initMap = async () => {
  console.log('Initializing map...')

  // Reset map state
  map.value = null
  marker.value = null
  searchBox.value = null
  mapLoaded.value = false
  mapInitializing.value = true

  try {
    // Ensure Google Maps is loaded
    await loadGoogleMaps()

    // Wait for DOM to be ready
    await nextTick()

    if (!mapContainer.value) {
      console.error('Map container not found')
      return false
    }

    const defaultLat = 16.0544
    const defaultLng = 108.2022
    const lat = parseFloat(locationForm.value.latitude) || defaultLat
    const lng = parseFloat(locationForm.value.longitude) || defaultLng

    // Initialize map
    map.value = new window.google.maps.Map(mapContainer.value, {
      zoom: locationForm.value.latitude && locationForm.value.longitude ? 12 : 6,
      center: { lat, lng },
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: 'cooperative',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    })

    // Create marker
    marker.value = new window.google.maps.Marker({
      position: { lat, lng },
      map: map.value,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    })

    // Map click event
    map.value.addListener('click', (event) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()

      marker.value.setPosition({ lat, lng })
      updateFormCoordinates(lat, lng)
      map.value.setCenter({ lat, lng })
      map.value.setZoom(15)
    })

    // Marker drag event
    marker.value.addListener('dragend', () => {
      const position = marker.value.getPosition()
      const lat = position.lat()
      const lng = position.lng()

      updateFormCoordinates(lat, lng)
      map.value.setCenter({ lat, lng })
    })

    // Initialize search box after map is ready
    setTimeout(() => {
      if (searchInput.value && window.google?.maps?.places) {
        try {
          searchBox.value = new window.google.maps.places.SearchBox(searchInput.value)
          searchBox.value.addListener('places_changed', handlePlaceSelection)
        } catch (error) {
          console.warn('Search box initialization failed:', error)
        }
      }
    }, 500)

    mapLoaded.value = true
    console.log('Map initialized successfully')
    return true
  } catch (err) {
    console.error('Error initializing map:', err)
    mapLoaded.value = false
    return false
  } finally {
    mapInitializing.value = false
  }
}

// Handle place selection from search
const handlePlaceSelection = () => {
  const places = searchBox.value.getPlaces()
  if (!places.length) return

  const place = places[0]
  if (!place.geometry?.location) return

  map.value.setCenter(place.geometry.location)
  map.value.setZoom(15)
  marker.value.setPosition(place.geometry.location)

  const lat = place.geometry.location.lat()
  const lng = place.geometry.location.lng()
  updateFormCoordinates(lat, lng)

  // Auto-fill form fields
  if (place.address_components) {
    let city = ''
    let country = ''
    place.address_components.forEach((component) => {
      if (component.types.includes('locality')) city = component.long_name
      if (component.types.includes('country')) country = component.long_name
    })
    if (city && !locationForm.value.city) locationForm.value.city = city
    if (country && !locationForm.value.country) locationForm.value.country = country
    if (place.name && !locationForm.value.name) locationForm.value.name = place.name
  }
}

// Toggle map view
const toggleMapView = async () => {
  if (!showMap.value) {
    showMap.value = true
    // Force re-render with new key
    mapKey.value++
    await nextTick()
    await initMap()
  } else {
    showMap.value = false
    // Clean up map
    cleanupMap()
  }
}

// Cleanup map
const cleanupMap = () => {
  if (map.value) {
    window.google?.maps?.event?.clearInstanceListeners(map.value)
  }
  if (marker.value) {
    window.google?.maps?.event?.clearInstanceListeners(marker.value)
  }
  if (searchBox.value) {
    window.google?.maps?.event?.clearInstanceListeners(searchBox.value)
  }

  map.value = null
  marker.value = null
  searchBox.value = null
  mapLoaded.value = false
  mapInitializing.value = false
}

// Retry map initialization
const retryMapInit = async () => {
  cleanupMap()
  mapKey.value++
  await nextTick()
  await initMap()
}

// Update form coordinates
const updateFormCoordinates = (lat, lng) => {
  locationForm.value.latitude = parseFloat(lat.toFixed(6))
  locationForm.value.longitude = parseFloat(lng.toFixed(6))
}

// Update map from input fields
const updateMapFromInputs = () => {
  if (!map.value || !marker.value || !locationForm.value.latitude || !locationForm.value.longitude)
    return

  const lat = parseFloat(locationForm.value.latitude)
  const lng = parseFloat(locationForm.value.longitude)

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return
  }

  const position = { lat, lng }
  marker.value.setPosition(position)
  map.value.setCenter(position)
  map.value.setZoom(15)
}

// Center map on user's current location
const centerMapOnCurrentLocation = () => {
  if (!map.value || !marker.value) return

  locationLoading.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      const currentLocation = { lat, lng }

      map.value.setCenter(currentLocation)
      map.value.setZoom(15)
      marker.value.setPosition(currentLocation)

      updateFormCoordinates(lat, lng)
      locationLoading.value = false
    },
    (error) => {
      console.error('Error getting current location:', error)
      alert('Không thể xác định vị trí hiện tại của bạn.')
      locationLoading.value = false
    },
  )
}

// Reset map to default view
const resetMap = () => {
  if (!map.value || !marker.value) return

  const defaultLat = 16.0544
  const defaultLng = 108.2022
  const defaultPosition = { lat: defaultLat, lng: defaultLng }

  map.value.setCenter(defaultPosition)
  map.value.setZoom(6)
  marker.value.setPosition(defaultPosition)

  updateFormCoordinates(defaultLat, defaultLng)
}

// Reset form when modal is opened
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      locationForm.value = {
        name: '',
        description: '',
        country: '',
        city: '',
        image: '',
        latitude: null,
        longitude: null,
      }
      showMap.value = false
      cleanupMap()
    } else {
      // Clean up when modal is closed
      cleanupMap()
    }
  },
)

const handleLocationImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    alert('Kích thước file không được vượt quá 10MB')
    return
  }

  try {
    loading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: {
          upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        },
      },
    )
    locationForm.value.image = uploadRes.data.secure_url
  } catch (err) {
    console.error('Lỗi upload ảnh địa điểm:', err)
    alert('Không thể tải ảnh địa điểm.')
  } finally {
    loading.value = false
  }
}

const submitLocation = async () => {
  try {
    loading.value = true
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: locationForm.value.name,
      description: locationForm.value.description,
      country: locationForm.value.country,
      city: locationForm.value.city,
      image: locationForm.value.image || null,
      latitude: locationForm.value.latitude || null,
      longitude: locationForm.value.longitude || null,
    }
    const response = await axios.post(`${apiBaseUrl}/locations`, payload)
    emit('created', response.data)
    alert('Thêm địa điểm thành công!')
  } catch (err) {
    console.error('Lỗi khi thêm địa điểm:', err)
    alert('Không thể thêm địa điểm: ' + (err.response?.data?.message || 'Lỗi không xác định'))
  } finally {
    loading.value = false
  }
}

// Cleanup on unmount
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  cleanupMap()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fixed.inset-0.bg-gray-800.bg-opacity-50.z-50 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.1);
}

input:focus,
textarea:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
