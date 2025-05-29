<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Tạo tour mới" :icon="mdiPlus" main>
        <BaseButton label="Quay lại" color="gray" :icon="mdiArrowLeft" @click="$router.back()" />
      </SectionTitleLineWithButton>

      <CardBox class="max-w-6xl mx-auto">
        <form @submit.prevent="createTour" class="space-y-8">
          <!-- Basic Information Section -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
          >
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-100 rounded-lg">
                <InformationCircleIcon class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-800">Thông tin cơ bản</h3>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="lg:col-span-2">
                <BaseInput
                  v-model="form.name"
                  label="Tên tour"
                  required
                  class="w-full"
                  :icon="mdiTag"
                />
              </div>
              <!-- Updated Price Input with Vietnamese Currency Formatting -->
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <CurrencyDollarIcon class="w-4 h-4" />
                  Giá (₫)
                </label>
                <input
                  type="text"
                  v-model="formattedPrice"
                  @input="handlePriceInput"
                  @blur="handlePriceBlur"
                  @focus="handlePriceFocus"
                  placeholder="0 ₫"
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                />
              </div>
              <BaseInput
                v-model.number="form.days"
                label="Số ngày"
                type="number"
                required
                class="w-full"
                :icon="CalendarDaysIcon"
              />
              <BaseInput
                v-model.number="form.nights"
                label="Số đêm"
                type="number"
                required
                class="w-full"
                :icon="MoonIcon"
              />
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <BuildingOfficeIcon class="w-4 h-4" />
                  Nhà cung cấp
                </label>
                <select
                  v-model="form.vendor_id"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  required
                >
                  <option disabled value="">Chọn nhà cung cấp</option>
                  <option v-for="v in vendors" :value="v.id" :key="v.id">
                    {{ v.company_name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Categories and Location Section -->
          <div
            class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
          >
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-green-100 rounded-lg">
                <MapPinIcon class="w-6 h-6 text-green-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-800">Danh mục & Địa điểm</h3>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <RectangleGroupIcon class="w-4 h-4" />
                  Danh mục
                </label>
                <div class="flex gap-3 items-center">
                  <select
                    v-model="form.travel_type_id"
                    class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                    required
                  >
                    <option disabled value="">Chọn danh mục</option>
                    <option v-for="type in travelTypes" :value="type.id" :key="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                  <BaseButton
                    label="Thêm"
                    size="sm"
                    color="success"
                    :icon="mdiPlus"
                    @click.prevent="openTravelTypeModal"
                  />
                </div>
              </div>
              <div>
                <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                  <GlobeAltIcon class="w-4 h-4" />
                  Địa điểm
                </label>
                <div class="flex gap-3 items-center">
                  <select
                    v-model="form.location_id"
                    class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                    required
                  >
                    <option disabled value="">Chọn địa điểm</option>
                    <option v-for="loc in locations" :value="loc.id" :key="loc.id">
                      {{ loc.name }}
                    </option>
                  </select>
                  <BaseButton
                    label="Thêm"
                    size="sm"
                    color="success"
                    :icon="mdiPlus"
                    @click.prevent="openLocationModal"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div
            class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
          >
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-purple-100 rounded-lg">
                <DocumentTextIcon class="w-6 h-6 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-800">Mô tả tour</h3>
            </div>
            <RichTextEditor
              ref="tourDescriptionEditor"
              :value="form.description"
              @update:value="form.description = $event"
              placeholder="Viết mô tả chi tiết về tour của bạn..."
            />
          </div>

          <!-- Features Section -->
          <div
            class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-orange-100 rounded-lg">
                  <SparklesIcon class="w-6 h-6 text-orange-600" />
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Tính năng</h3>
              </div>
              <BaseButton
                label="Thêm tính năng"
                size="sm"
                color="warning"
                :icon="mdiPlus"
                @click.prevent="openFeatureModal"
              />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <label
                v-for="feature in availableFeatures"
                :key="feature.id"
                class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  :value="feature.id"
                  v-model="form.features"
                  class="h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span
                  class="text-sm font-medium group-hover:text-orange-600 transition-colors duration-200"
                >
                  {{ feature.name }}
                </span>
              </label>
            </div>
          </div>

          <!-- Images Section -->
          <div
            class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100"
          >
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-teal-100 rounded-lg">
                <CameraIcon class="w-6 h-6 text-teal-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-800">Hình ảnh</h3>
            </div>
            <div class="mb-6">
              <label
                class="flex items-center justify-center w-full h-32 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors duration-200"
              >
                <div class="flex flex-col items-center">
                  <CloudArrowUpIcon class="w-8 h-8 text-teal-500 mb-2" />
                  <span class="text-sm font-medium text-teal-600">Chọn ảnh để tải lên</span>
                  <span class="text-xs text-teal-500 mt-1">PNG, JPG, JPEG (tối đa 10MB)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleImageUpload"
                  class="hidden"
                />
              </label>
            </div>
            <div
              v-if="form.images.length"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div
                v-for="(image, index) in form.images"
                :key="index"
                class="relative group"
                :class="{ 'ring-4 ring-blue-500 ring-opacity-75': image.is_primary }"
              >
                <img
                  :src="image.image_url"
                  :alt="image.caption || `Image ${index + 1}`"
                  class="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                />
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                    <button
                      v-if="!image.is_primary"
                      type="button"
                      @click="setPrimaryImage(index)"
                      class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                    >
                      <StarIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div v-if="image.is_primary" class="absolute top-2 left-2">
                  <div
                    class="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    <StarIcon class="w-3 h-3" />
                    Ảnh chính
                  </div>
                </div>
              </div>
            </div>
            <p v-if="!form.images.length" class="text-center text-gray-500 py-8">
              Chưa có ảnh nào được tải lên.
            </p>
          </div>

          <!-- Availability Section -->
          <div
            class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-indigo-100 rounded-lg">
                  <CalendarIcon class="w-6 h-6 text-indigo-600" />
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Lịch trình khả dụng</h3>
              </div>
              <BaseButton
                label="Thêm lịch trình"
                size="sm"
                color="info"
                :icon="mdiPlus"
                @click="addAvailability"
              />
            </div>
            <div class="space-y-4">
              <div
                v-for="(avail, index) in form.availabilities"
                :key="index"
                class="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <BaseInput
                    v-model="avail.date"
                    label="Ngày"
                    type="date"
                    required
                    class="w-full"
                    :icon="CalendarIcon"
                  />
                  <BaseInput
                    v-model.number="avail.max_guests"
                    label="Số khách tối đa"
                    type="number"
                    required
                    min="1"
                    class="w-full"
                    :icon="UsersIcon"
                  />
                  <BaseInput
                    v-model.number="avail.available_slots"
                    label="Số chỗ còn lại"
                    type="number"
                    required
                    min="0"
                    :max="avail.max_guests"
                    class="w-full"
                    :icon="TicketIcon"
                  />
                  <div class="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      v-model="avail.is_active"
                      class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span class="text-sm font-medium text-gray-700">Kích hoạt</span>
                  </div>
                </div>
                <BaseButton
                  label="Xóa lịch trình"
                  color="danger"
                  size="sm"
                  :icon="mdiTrashCan"
                  @click="removeAvailability(index)"
                />
              </div>
            </div>
          </div>

          <!-- Itineraries Section -->
          <div
            class="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-100"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-yellow-100 rounded-lg">
                  <ClipboardDocumentListIcon class="w-6 h-6 text-yellow-600" />
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Lộ trình tour</h3>
              </div>
              <BaseButton
                label="Thêm lộ trình"
                size="sm"
                color="warning"
                :icon="mdiPlus"
                @click="openItineraryModal(null)"
              />
            </div>
            <div class="space-y-4">
              <div
                v-for="(itinerary, index) in form.itineraries"
                :key="index"
                class="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-lg font-semibold text-gray-800">
                    Ngày {{ itinerary.day }}: {{ itinerary.title }}
                  </h4>
                  <div class="flex gap-2">
                    <BaseButton
                      label="Chỉnh sửa"
                      size="sm"
                      color="info"
                      :icon="mdiPencil"
                      @click="openItineraryModal(index)"
                    />
                    <BaseButton
                      label="Xóa"
                      size="sm"
                      color="danger"
                      :icon="mdiTrashCan"
                      @click="removeItinerary(index)"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">
                      <strong>Mô tả:</strong> {{ itinerary.description || 'Không có mô tả' }}
                    </p>
                    <p class="text-sm text-gray-600">
                      <strong>Hoạt động:</strong>
                      {{
                        itinerary.activities.length
                          ? itinerary.activities.join(', ')
                          : 'Không có hoạt động'
                      }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">
                      <strong>Thời gian:</strong>
                      {{
                        itinerary.start_time && itinerary.end_time
                          ? `${itinerary.start_time} - ${itinerary.end_time}`
                          : 'Không xác định'
                      }}
                    </p>
                    <p class="text-sm text-gray-600">
                      <strong>Nơi nghỉ:</strong> {{ itinerary.accommodation || 'Không xác định' }}
                    </p>
                    <p class="text-sm text-gray-600">
                      <strong>Bữa ăn:</strong> {{ itinerary.meals || 'Không xác định' }}
                    </p>
                  </div>
                </div>
                <div
                  v-if="itinerary.images.length"
                  class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  <img
                    v-for="(image, imgIndex) in itinerary.images"
                    :key="imgIndex"
                    :src="image.image_path"
                    :alt="`Itinerary image ${imgIndex + 1}`"
                    class="w-full h-24 object-cover rounded-lg shadow-sm"
                  />
                </div>
              </div>
              <p v-if="!form.itineraries.length" class="text-center text-gray-500 py-8">
                Chưa có lộ trình nào được thêm.
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-6">
            <BaseButton
              type="submit"
              color="success"
              label="Tạo tour"
              size="lg"
              :icon="mdiCheck"
              class="px-8 py-3 text-lg font-semibold"
            />
          </div>
        </form>
      </CardBox>

      <!-- Modals -->
      <LocationModal
        :show="showLocationModal"
        @close="showLocationModal = false"
        @created="handleLocationCreated"
      />
      <TravelTypeModal
        :show="showTravelTypeModal"
        @close="showTravelTypeModal = false"
        @created="handleTravelTypeCreated"
      />
      <FeatureModal
        :show="showFeatureModal"
        @close="showFeatureModal = false"
        @created="handleFeatureCreated"
      />
      <ItineraryModal
        :show="showItineraryModal"
        :itinerary="editingItinerary"
        :editing-index="editingItineraryIndex"
        @close="closeItineraryModal"
        @save="handleItinerarySave"
      />
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseInput from '@/components/admin/BaseInput.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import RichTextEditor from '@/components/blog/RichTextEditor.vue'
import LocationModal from '@/components/tour/LocationModal.vue'
import TravelTypeModal from '@/components/tour/TravelTypeModal.vue'
import FeatureModal from '@/components/tour/FeatureModal.vue'
import ItineraryModal from '@/components/tour/ItineraryModal.vue'

// Heroicons imports
import {
  ArrowLeftIcon,
  InformationCircleIcon,
  TagIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  MoonIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  RectangleGroupIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  SparklesIcon,
  CameraIcon,
  CloudArrowUpIcon,
  TrashIcon,
  StarIcon,
  CalendarIcon,
  UsersIcon,
  TicketIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline'

import {
  mdiArrowLeft,
  mdiInformation,
  mdiTag,
  mdiCurrencyUsd,
  mdiCalendarRange,
  mdiWeatherNight,
  mdiOfficeBuilding,
  mdiMapMarker,
  mdiViewGrid,
  mdiEarth,
  mdiPlus,
  mdiFileDocumentOutline,
  mdiCamera,
  mdiCloudUpload,
  mdiTrashCan,
  mdiStar,
  mdiCalendar,
  mdiAccountGroup,
  mdiTicket,
  mdiCheck,
  mdiPencil,
} from '@mdi/js'

const router = useRouter()

const form = ref({
  name: '',
  description: '',
  price: '',
  days: 1,
  nights: 1,
  travel_type_id: '',
  location_id: '',
  vendor_id: '',
  features: [],
  images: [],
  availabilities: [],
  itineraries: [], // Added itineraries array
})


// Price formatting states
const formattedPrice = ref('')
const isEditingPrice = ref(false)

const availableFeatures = ref([])
const locations = ref([])
const vendors = ref([])
const travelTypes = ref([])
const showLocationModal = ref(false)
const showTravelTypeModal = ref(false)
const showFeatureModal = ref(false)
const showItineraryModal = ref(false)
const editingItinerary = ref(null)
const editingItineraryIndex = ref(null)

// Vietnamese currency formatting function
const formatVNDCurrency = (amount) => {
  if (!amount && amount !== 0) return ''
  
  // Convert to number if it's a string
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d]/g, '')) : amount
  
  if (isNaN(num)) return ''
  
  return new Intl.NumberFormat('vi-VN').format(num) + ' ₫'
}

// Remove formatting to get raw number
const parseVNDCurrency = (formattedString) => {
  if (!formattedString) return 0
  return parseFloat(formattedString.replace(/[^\d]/g, '')) || 0
}

// Handle price input with real-time formatting
const handlePriceInput = (event) => {
  const input = event.target
  const cursorPosition = input.selectionStart
  
  // Get raw number value
  const rawValue = input.value.replace(/[^\d]/g, '')
  
  if (rawValue === '') {
    formattedPrice.value = ''
    form.value.price = 0
    return
  }
  
  // Update the actual price value
  form.value.price = parseInt(rawValue)
  
  // Format for display
  const formatted = formatVNDCurrency(form.value.price)
  formattedPrice.value = formatted
  
  // Maintain cursor position (approximate)
  setTimeout(() => {
    const newCursorPos = Math.min(cursorPosition, formatted.length)
    input.setSelectionRange(newCursorPos, newCursorPos)
  }, 0)
}

const handlePriceFocus = () => {
  isEditingPrice.value = true
}

const handlePriceBlur = () => {
  isEditingPrice.value = false
  // Ensure the formatted value is properly set
  if (form.value.price > 0) {
    formattedPrice.value = formatVNDCurrency(form.value.price)
  }
}

// Initialize formatted price when form.price changes
const initializeFormattedPrice = () => {
  if (form.value.price > 0) {
    formattedPrice.value = formatVNDCurrency(form.value.price)
  } else {
    formattedPrice.value = ''
  }
}

const fetchData = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const [locRes, venRes, typeRes, featureRes] = await Promise.all([
      axios.get(`${apiBaseUrl}/locations`),
      axios.get(`${apiBaseUrl}/vendors`),
      axios.get(`${apiBaseUrl}/travel-types`),
      axios.get(`${apiBaseUrl}/features`),
    ])

    locations.value = locRes.data.data
    vendors.value = venRes.data.data
    travelTypes.value = typeRes.data.data
    availableFeatures.value = featureRes.data.data
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err)
    alert('Không thể tải dữ liệu.')
  }
}

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return

  try {
    const uploadPromises = files.map(async (file) => {
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
      return {
        id: null,
        image_url: uploadRes.data.secure_url,
        caption: null,
        is_primary: false, // Set primary image logic can be handled later
        // is_primary: form.value.images.length === 0 ? true : false,
      }
    })

    const uploadedImages = await Promise.all(uploadPromises)
    form.value.images = [...form.value.images, ...uploadedImages]
  } catch (err) {
    console.error('Lỗi upload ảnh:', err)
    alert('Không thể tải ảnh lên.')
  }
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
  if (!form.value.images.some((img) => img.is_primary) && form.value.images.length > 0) {
    form.value.images[0].is_primary = true
  }
}

const setPrimaryImage = (index) => {
  form.value.images = form.value.images.map((img, i) => ({
    ...img,
    is_primary: i === index ? true : false,
  }))
}

const addAvailability = () => {
  form.value.availabilities.push({
    date: '',
    max_guests: 1,
    available_slots: 1,
    is_active: true,
  })
}

const removeAvailability = (index) => {
  form.value.availabilities.splice(index, 1)
}

const openLocationModal = () => {
  showLocationModal.value = true
}

const openTravelTypeModal = () => {
  showTravelTypeModal.value = true
}

const openFeatureModal = () => {
  showFeatureModal.value = true
}

const openItineraryModal = (index = null) => {
  if (index !== null) {
    console.log('Editing itinerary at index:', index)
    // If editing, populate the form with existing itinerary data
    console.log('Current itineraries:', { ...form.value.itineraries[index] })
    editingItinerary.value = { ...form.value.itineraries[index] }
    editingItineraryIndex.value = index
  } else {
    editingItinerary.value = null
    editingItineraryIndex.value = null
  }
  showItineraryModal.value = true
}

const closeItineraryModal = () => {
  showItineraryModal.value = false
  editingItinerary.value = null
  editingItineraryIndex.value = null
}

const handleItinerarySave = (itineraryData, editingIndex) => {
  if (editingIndex !== null) {
    // Update existing itinerary
    form.value.itineraries[editingIndex] = { ...itineraryData }
  } else {
    // Add new itinerary
    form.value.itineraries.push({ ...itineraryData })
  }
  showItineraryModal.value = false
}

const removeItinerary = (index) => {
  form.value.itineraries.splice(index, 1)
}

const handleLocationCreated = (location) => {
  locations.value.push(location)
  form.value.location_id = location.id
  showLocationModal.value = false
}

const handleTravelTypeCreated = (travelType) => {
  travelTypes.value.push(travelType)
  form.value.travel_type_id = travelType.id
  showTravelTypeModal.value = false
}

const handleFeatureCreated = (feature) => {
  availableFeatures.value.push(feature)
  form.value.features.push(feature.id)
  showFeatureModal.value = false
}

const createTour = async () => {
  try {
    if (form.value.days && form.value.nights) {
      const diff = Math.abs(form.value.days - form.value.nights)
      if (diff > 1) {
        alert('Số ngày và số đêm không được lệch nhau quá 1.')
        return
      }
    }

    // Validate itineraries
    if (form.value.itineraries.length > 0) {
      const maxDay = Math.max(...form.value.itineraries.map((it) => it.day))
      if (maxDay > form.value.days) {
        alert('Ngày trong lộ trình không được vượt quá số ngày của tour.')
        return
      }
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      days: form.value.days,
      nights: form.value.nights,
      travel_type_id: form.value.travel_type_id,
      location_id: form.value.location_id,
      vendor_id: form.value.vendor_id,
      features: form.value.features,
      images: form.value.images.map((img) => ({
        image_url: img.image_url,
        caption: img.caption,
        is_primary: img.is_primary,
      })),
      availabilities: form.value.availabilities.map((avail) => ({
        date: avail.date,
        max_guests: avail.max_guests,
        available_slots: avail.available_slots,
        is_active: avail.is_active,
      })),
      itineraries: form.value.itineraries.map((itinerary) => ({
        day: itinerary.day,
        title: itinerary.title,
        description: itinerary.description || null,
        activities: itinerary.activities.length ? itinerary.activities : null,
        accommodation: itinerary.accommodation || null,
        meals: itinerary.meals || null,
        start_time: itinerary.start_time || null,
        end_time: itinerary.end_time || null,
        notes: itinerary.notes || null,
        images: itinerary.images.map((img) => ({
          image_path: img.image_path,
        })),
      })),
    }

    await axios.post(`${apiBaseUrl}/tours`, payload)
    alert('Tạo tour thành công!')
    router.push('/admin/tours')
  } catch (err) {
    console.error('Lỗi khi tạo tour:', err)
    alert('Không thể tạo tour: ' + (err.response?.data?.message || 'Lỗi không xác định'))
  }
}

onMounted(fetchData)
</script>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}

/* Custom animations */
.group:hover .group-hover\:shadow-lg {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Gradient animations */
@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

/* Image upload area enhancement */
.group:hover .opacity-0 {
  opacity: 1;
}

.group:hover .bg-opacity-0 {
  background-opacity: 0.3;
}

/* Smooth transitions */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow,
    transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Enhanced focus states */
input:focus,
select:focus {
  outline: none;
  ring-width: 2px;
  ring-color: rgb(59 130 246 / 0.5);
  border-color: rgb(59 130 246);
}

/* Custom checkbox styling */
input[type='checkbox']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m5.707 7.293-2.414-2.414a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 11.879 .707L5.707 7.293z'/%3e%3c/svg%3e");
}
</style>
