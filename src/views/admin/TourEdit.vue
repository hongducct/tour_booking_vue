<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header with Title and Back Button -->
      <SectionTitleLineWithButton
        :title="
          tour ? `Chỉnh sửa tour: ${tour.name || 'Đang tải...'}` : 'Chỉnh sửa tour: Đang tải...'
        "
        :icon="mdiPencil"
        main
      >
        <BaseButton label="Quay lại" color="gray" :icon="mdiArrowLeft" @click="goBack" />
      </SectionTitleLineWithButton>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-flex items-center justify-center mb-4">
            <ArrowPathIcon class="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <p class="text-gray-600 text-lg dark:text-gray-200">Đang tải dữ liệu tour...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center max-w-md">
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8">
            <ExclamationTriangleIcon class="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-200">
              Có lỗi xảy ra
            </h3>
            <p class="text-gray-600 mb-6 dark:text-gray-200">{{ error }}</p>
            <BaseButton
              label="Thử lại"
              color="danger"
              :icon="mdiRefresh"
              rounded
              @click="fetchData"
            />
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <CardBox v-else class="max-w-6xl mx-auto">
        <form @submit.prevent="updateTour" class="space-y-8">
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
                  @input="markAsChanged"
                />
              </div>
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
                  :class="{ 'border-red-500': errors?.price }"
                  @change="markAsChanged"
                />
                <p v-if="errors?.price" class="text-red-500 text-sm mt-1">{{ errors.price[0] }}</p>
              </div>
              <BaseInput
                v-model.number="form.days"
                label="Số ngày"
                type="number"
                required
                class="w-full"
                :icon="CalendarDaysIcon"
                @input="markAsChanged"
              />
              <BaseInput
                v-model.number="form.nights"
                label="Số đêm"
                type="number"
                required
                class="w-full"
                :icon="MoonIcon"
                @input="markAsChanged"
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
                  @change="markAsChanged"
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
                    @change="markAsChanged"
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
                    @change="markAsChanged"
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
              @update:value="updateDescription"
              placeholder="Viết mô tả chi tiết về tour của bạn..."
            />
            <p class="text-sm text-gray-500 mt-2">
              Sử dụng editor để định dạng văn bản, chèn hình ảnh và tạo nội dung đa phương tiện.
            </p>
            <p v-if="errors?.description" class="text-red-500 text-sm mt-2">
              {{ errors.description[0] }}
            </p>
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
                  @change="markAsChanged"
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
                v-if="!isUploadingImages"
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
              <!-- Loading State for Image Upload -->
              <div
                v-else
                class="flex items-center justify-center w-full h-32 border-2 border-dashed border-teal-300 rounded-lg bg-teal-50"
              >
                <div class="text-center">
                  <div class="inline-flex items-center justify-center mb-2">
                    <ArrowPathIcon class="w-6 h-6 text-teal-500 animate-spin" />
                  </div>
                  <span class="text-sm font-medium text-teal-600">Đang tải ảnh lên...</span>
                </div>
              </div>
            </div>
            <div
              v-if="form.images.length"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div
                v-for="(image, index) in form.images"
                :key="image.id || index"
                class="relative group"
                :class="{ 'ring-4 ring-blue-500 ring-opacity-75': image.is_primary }"
              >
                <img
                  :src="image.image_url"
                  :alt="image.caption || `Image ${index + 1}`"
                  class="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                />
                <div
                  class="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
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
            <p v-if="errors?.images" class="text-red-500 text-sm mt-2">
              {{ errors.images[0] }}
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
                :key="avail.id || index"
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
                    @input="markAsChanged"
                  />
                  <BaseInput
                    v-model.number="avail.max_guests"
                    label="Số khách tối đa"
                    type="number"
                    required
                    min="1"
                    class="w-full"
                    :icon="UsersIcon"
                    @input="markAsChanged"
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
                    @input="markAsChanged"
                  />
                  <div class="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      v-model="avail.is_active"
                      class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      @change="markAsChanged"
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

          <!-- Unsaved Changes Indicator -->
          <div
            v-if="hasUnsavedChanges"
            class="bg-orange-50 border border-orange-200 rounded-xl p-4"
          >
            <div class="flex items-center text-orange-700">
              <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-3"></span>
              <span class="font-medium">Có thay đổi chưa được lưu</span>
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-xl p-4">
            <div class="flex items-center text-green-700">
              <CheckCircleIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">Cập nhật tour thành công!</span>
            </div>
          </div>

          <div v-if="updateError" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-center text-red-700">
              <ExclamationTriangleIcon class="w-5 h-5 mr-3" />
              <span class="font-medium">{{ updateError }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-6 border-t border-gray-200">
            <BaseButton
              type="submit"
              color="success"
              label="Cập nhật tour"
              size="lg"
              :icon="mdiCheck"
              class="px-8 py-3 text-lg font-semibold"
              :loading="loading"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { useTourStore } from '@/stores/tourStore'

import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
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
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline'

import {
  mdiArrowLeft,
  mdiPencil,
  mdiTag,
  mdiPlus,
  mdiCheck,
  mdiTrashCan,
  mdiCalendar,
  mdiAccountGroup,
  mdiTicket,
  mdiRefresh,
} from '@mdi/js'

const route = useRoute()
const router = useRouter()
const tourId = route.params.id
const adminToken = localStorage.getItem('adminToken')
const tourStore = useTourStore()

// Form data
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
  itineraries: [],
})

// State management
const isLoading = ref(false)
const isUploadingImages = ref(false)
const loading = ref(false)
const error = ref(null)
const updateError = ref('')
const success = ref(false)
const hasUnsavedChanges = ref(false)
const errors = ref(null)

// Price formatting states
const formattedPrice = ref('')
const isEditingPrice = ref(false)

// Modal states
const showLocationModal = ref(false)
const showTravelTypeModal = ref(false)
const showFeatureModal = ref(false)
const showItineraryModal = ref(false)
const editingItinerary = ref(null)
const editingItineraryIndex = ref(null)

// Data lists
const tour = ref(null)
const availableFeatures = ref([])
const locations = ref([])
const vendors = ref([])
const travelTypes = ref([])

// Modal forms
const locationForm = ref({
  name: '',
  description: '',
  country: '',
  city: '',
  image: '',
})

const travelTypeForm = ref({
  name: '',
  description: '',
})

const featureForm = ref({
  name: '',
  description: '',
})

// Vietnamese currency formatting function
const formatVNDCurrency = (amount) => {
  if (!amount && amount !== 0) return ''
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d]/g, '')) : amount
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('vi-VN').format(num) + ' ₫'
}

const handlePriceInput = (event) => {
  const input = event.target
  const cursorPosition = input.selectionStart
  const rawValue = input.value.replace(/[^\d]/g, '')
  if (rawValue === '') {
    formattedPrice.value = ''
    form.value.price = 0
    return
  }
  form.value.price = parseInt(rawValue)
  const formatted = formatVNDCurrency(form.value.price)
  formattedPrice.value = formatted
  setTimeout(() => {
    const newCursorPos = Math.min(cursorPosition, formatted.length)
    input.setSelectionRange(newCursorPos, newCursorPos)
  }, 0)
  markAsChanged()
}

const handlePriceFocus = () => {
  isEditingPrice.value = true
}

const handlePriceBlur = () => {
  isEditingPrice.value = false
  if (form.value.price > 0) {
    formattedPrice.value = formatVNDCurrency(form.value.price)
  }
}

const initializeFormattedPrice = () => {
  if (form.value.price > 0) {
    formattedPrice.value = formatVNDCurrency(form.value.price)
  } else {
    formattedPrice.value = ''
  }
}

const updateDescription = (newDescription) => {
  form.value.description = newDescription
  markAsChanged()
}

const fetchData = async () => {
  if (!tourId) {
    error.value = 'ID tour không hợp lệ'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const [tourRes, locRes, venRes, typeRes, featureRes] = await Promise.all([
      axios.get(`${apiBaseUrl}/tours/${tourId}`),
      axios.get(`${apiBaseUrl}/locations`),
      axios.get(`${apiBaseUrl}/vendors`),
      axios.get(`${apiBaseUrl}/travel-types`),
      axios.get(`${apiBaseUrl}/features`),
    ])

    tour.value = tourRes.data
    form.value = {
      name: tour.value.name || '',
      description: tour.value.description || '',
      price: parseFloat(tour.value.price) || 0,
      days: tour.value.days || 1,
      nights: tour.value.nights || 1,
      travel_type_id: tour.value.travel_type_id || '',
      location_id: tour.value.location_id || '',
      vendor_id: tour.value.vendor_id || '',
      // features: tour.value.features.map((f) => f.id) || [],
    
      features: featureRes.data.data.filter((f) => tour.value.features.includes(f.name)).map((f) => f.id), // Map feature names to IDs
      images:
        tour.value.images.map((img) => ({
          id: img.id,
          image_url: img.image_url,
          caption: img.caption,
          is_primary: img.is_primary,
        })) || [],
      availabilities:
        tour.value.availabilities.map((avail) => ({
          id: avail.id,
          date: avail.date,
          max_guests: avail.max_guests,
          available_slots: avail.available_slots,
          is_active: avail.is_active,
        })) || [],
      itineraries:
        tour.value.itineraries.map((it) => ({
          id: it.id,
          day: it.day,
          title: it.title,
          description: it.description || null,
          activities: it.activities || [],
          accommodation: it.accommodation || null,
          meals: it.meals || null,
          start_time: it.start_time || null,
          end_time: it.end_time || null,
          notes: it.notes || null,
          images:
            it.images.map((img) => ({
              image_path: img.image_path,
            })) || [],
        })) || [],
    }

    console.log('Form:', form.value)
    locations.value = locRes.data.data
    vendors.value = venRes.data.data
    travelTypes.value = typeRes.data.data
    availableFeatures.value = featureRes.data.data

    initializeFormattedPrice()
    hasUnsavedChanges.value = false
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err)
    if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      setTimeout(() => router.push('/admin/login'), 2000)
    } else if (err.response?.status === 404) {
      error.value = 'Không tìm thấy tour này.'
    } else if (err.response?.status === 403) {
      error.value = 'Bạn không có quyền chỉnh sửa tour này.'
    } else {
      error.value = 'Không thể tải dữ liệu tour. Vui lòng thử lại.'
    }
  } finally {
    isLoading.value = false
  }
}

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return

  isUploadingImages.value = true // Set loading state to true
  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET },
        },
      )
      return {
        id: null,
        image_url: uploadRes.data.secure_url,
        caption: null,
        is_primary: false,
      }
    })

    const uploadedImages = await Promise.all(uploadPromises)
    form.value.images = [...form.value.images, ...uploadedImages]
    markAsChanged()
  } catch (err) {
    console.error('Lỗi upload ảnh:', err)
    alert('Không thể tải ảnh lên.')
  } finally {
    isUploadingImages.value = false // Reset loading state
  }
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
  if (!form.value.images.some((img) => img.is_primary) && form.value.images.length > 0) {
    form.value.images[0].is_primary = true
  }
  markAsChanged()
}

const setPrimaryImage = (index) => {
  form.value.images = form.value.images.map((img, i) => ({
    ...img,
    is_primary: i === index,
  }))
  markAsChanged()
}

const addAvailability = () => {
  form.value.availabilities.push({
    id: null,
    date: '',
    max_guests: 1,
    available_slots: 1,
    is_active: true,
  })
  markAsChanged()
}

const removeAvailability = (index) => {
  form.value.availabilities.splice(index, 1)
  markAsChanged()
}

const openLocationModal = () => {
  locationForm.value = { name: '', description: '', country: '', city: '', image: '' }
  showLocationModal.value = true
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

const submitLocation = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: locationForm.value.name,
      description: locationForm.value.description || null,
      country: locationForm.value.country,
      city: locationForm.value.city,
      image: locationForm.value.image || null,
    }
    const response = await axios.post(`${apiBaseUrl}/locations`, payload, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    locations.value.push(response.data.data)
    form.value.location_id = response.data.data.id
    showLocationModal.value = false
    alert('Thêm địa điểm thành công!')
    markAsChanged()
  } catch (err) {
    console.error('Lỗi khi thêm địa điểm:', err)
    alert('Không thể thêm địa điểm: ' + (err.response?.data?.message || 'Lỗi không xác định'))
  }
}

const handleLocationImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  try {
    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET },
      },
    )
    locationForm.value.image = uploadRes.data.secure_url
  } catch (err) {
    console.error('Lỗi upload ảnh địa điểm:', err)
    alert('Không thể tải ảnh địa điểm.')
  }
}

const openTravelTypeModal = () => {
  travelTypeForm.value = { name: '', description: '' }
  showTravelTypeModal.value = true
}

const submitTravelType = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: travelTypeForm.value.name,
      description: travelTypeForm.value.description || null,
    }
    const response = await axios.post(`${apiBaseUrl}/travel-types`, payload, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    travelTypes.value.push(response.data.data)
    form.value.travel_type_id = response.data.data.id
    showTravelTypeModal.value = false
    alert('Thêm danh mục thành công!')
    markAsChanged()
  } catch (err) {
    console.error('Lỗi khi thêm danh mục:', err)
    alert('Không thể thêm danh mục: ' + (err.response?.data?.message || 'Lỗi không xác định'))
  }
}

const openFeatureModal = () => {
  featureForm.value = { name: '', description: '' }
  showFeatureModal.value = true
}

const submitFeature = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: featureForm.value.name,
      description: featureForm.value.description || null,
    }
    const response = await axios.post(`${apiBaseUrl}/features`, payload, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    availableFeatures.value.push(response.data.data)
    form.value.features.push(response.data.data.id)
    showFeatureModal.value = false
    alert('Thêm tính năng thành công!')
    markAsChanged()
  } catch (err) {
    console.error('Lỗi khi thêm tính năng:', err)
    alert('Không thể thêm tính năng: ' + (err.response?.data?.message || 'Lỗi không xác định'))
  }
}

const openItineraryModal = (index = null) => {
  if (index !== null) {
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
    form.value.itineraries[editingIndex] = { ...itineraryData }
  } else {
    form.value.itineraries.push({ ...itineraryData })
  }
  showItineraryModal.value = false
  markAsChanged()
}

const removeItinerary = (index) => {
  form.value.itineraries.splice(index, 1)
  markAsChanged()
}

const updateTour = async () => {
  if (!form.value.name.trim()) {
    updateError.value = 'Vui lòng nhập tên tour.'
    return
  }

  if (form.value.days && form.value.nights) {
    const diff = Math.abs(form.value.days - form.value.nights)
    if (diff > 1) {
      alert('Số ngày và số đêm không được lệch nhau quá 1.')
      return
    }
  }

  if (form.value.itineraries.length > 0) {
    const maxDay = Math.max(...form.value.itineraries.map((it) => it.day))
    if (maxDay > form.value.days) {
      alert('Ngày trong lộ trình không được vượt quá số ngày của tour.')
      return
    }
  }

  loading.value = true
  updateError.value = ''
  success.value = false
  errors.value = null

  try {
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
        id: img.id,
        image_url: img.image_url,
        caption: img.caption,
        is_primary: img.is_primary,
      })),
      availabilities: form.value.availabilities.map((avail) => ({
        id: avail.id,
        date: avail.date,
        max_guests: avail.max_guests,
        available_slots: avail.available_slots,
        is_active: avail.is_active,
      })),
      itineraries: form.value.itineraries.map((itinerary) => ({
        id: itinerary.id,
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

    const response = await axios.put(`${apiBaseUrl}/tours/${tourId}`, payload, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    tourStore.updateTour(response.data)
    success.value = true
    hasUnsavedChanges.value = false
    setTimeout(() => router.push('/admin/tours'), 1500)
  } catch (err) {
    console.error('Lỗi khi cập nhật tour:', err)
    if (err.response?.status === 401) {
      updateError.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      setTimeout(() => router.push('/admin/login'), 2000)
    } else if (err.response?.status === 403) {
      updateError.value = 'Bạn không có quyền cập nhật tour này.'
    } else if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
      updateError.value = 'Vui lòng kiểm tra lại các trường thông tin.'
    } else {
      updateError.value = err.response?.data?.message || 'Không thể cập nhật tour.'
    }
  } finally {
    loading.value = false
  }
}

const markAsChanged = () => {
  hasUnsavedChanges.value = true
}

const goBack = () => {
  if (hasUnsavedChanges.value) {
    if (confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?')) {
      router.push('/admin/tours')
    }
  } else {
    router.push('/admin/tours')
  }
}

const handleBeforeUnload = (e) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?'
    return e.returnValue
  }
}

onMounted(() => {
  if (!adminToken) {
    alert('Bạn cần đăng nhập để truy cập trang này.')
    router.push('/admin/login')
    return
  }
  fetchData()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}

.group:hover .group-hover\:shadow-lg {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

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

.group:hover .opacity-0 {
  opacity: 1;
}

.group:hover .bg-opacity-0 {
  background-opacity: 0.3;
}

* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow,
    transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

input:focus,
select:focus {
  outline: none;
  ring-width: 2px;
  ring-color: rgb(59 130 246 / 0.5);
  border-color: rgb(59 130 246);
}

input[type='checkbox']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m5.707 7.293-2.414-2.414a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 11.879 .707L5.707 7.293z'/%3e%3c/svg%3e");
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.absolute.inset-0.bg-black.bg-opacity-10 {
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.1);
}

:deep(.ql-editor) {
  min-height: 200px;
}
</style>
