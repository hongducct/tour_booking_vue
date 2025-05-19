<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :title="`Chỉnh sửa tour: ${form.name}`" icon="mdiPencil" main>
        <BaseButton label="Quay lại" color="gray" @click="$router.back()" />
      </SectionTitleLineWithButton>

      <CardBox class="max-w-4xl mx-auto">
        <form @submit.prevent="updateTour" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BaseInput v-model="form.name" label="Tên tour" required class="w-full" />
            <div class="w-full">
              <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Giá (₫) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="displayPrice"
                @input="formatPriceInput"
                @blur="applyFormatting"
                required
                class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
            <BaseInput
              v-model.number="form.days"
              label="Số ngày"
              type="number"
              required
              class="w-full"
            />
            <BaseInput
              v-model.number="form.nights"
              label="Số đêm"
              type="number"
              required
              class="w-full"
            />

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Danh mục</label>
              <div class="flex gap-2 items-center">
                <select
                  v-model="form.travel_type_id"
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  required
                >
                  <option disabled value="">Chọn danh mục</option>
                  <option v-for="type in travelTypes" :value="type.id" :key="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <BaseButton label="+Thêm" size="sm" @click.prevent="openTravelTypeModal" />
              </div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Địa điểm</label>
              <div class="flex gap-2 items-center">
                <select
                  v-model="form.location_id"
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  required
                >
                  <option v-for="loc in locations" :value="loc.id" :key="loc.id">
                    {{ loc.name }}
                  </option>
                </select>
                <BaseButton label="+Thêm" size="sm" @click.prevent="openLocationModal" />
              </div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Nhà cung cấp</label>
              <select
                v-model="form.vendor_id"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                required
              >
                <option v-for="v in vendors" :value="v.id" :key="v.id">{{ v.company_name }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              v-model="form.description"
              rows="6"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              placeholder="Viết mô tả có thể in đậm, xuống dòng..."
            ></textarea>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Tính năng</label>
            <div class="flex flex-wrap gap-4">
              <label
                v-for="feature in availableFeatures"
                :key="feature.id"
                class="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :value="feature.id"
                  v-model="form.features"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span class="text-sm">{{ feature.name }}</span>
              </label>
              <BaseButton label="+Thêm" size="sm" @click.prevent="openFeatureModal" />
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Ảnh</label>
            <input
              type="file"
              accept="image/*"
              multiple
              @change="handleImageUpload"
              class="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div
              v-if="form.images.length"
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div
                v-for="(image, index) in form.images"
                :key="image.id || index"
                class="relative"
                :class="{ 'border-4 border-blue-500': image.is_primary }"
              >
                <img
                  :src="image.image_url"
                  :alt="image.caption || `Image ${index + 1}`"
                  class="w-full h-40 object-cover rounded shadow"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                >
                  ×
                </button>
                <button
                  v-if="!image.is_primary"
                  type="button"
                  @click="setPrimaryImage(index)"
                  class="absolute bottom-2 right-2 bg-blue-600 text-white rounded px-2 py-1 text-xs hover:bg-blue-700"
                >
                  Đặt làm chính
                </button>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">Chưa có ảnh nào được tải lên.</p>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Lịch trình khả dụng</label>
            <div
              v-for="(avail, index) in form.availabilities"
              :key="avail.id || index"
              class="mb-4 border p-4 rounded"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BaseInput v-model="avail.date" label="Ngày" type="date" required class="w-full" />
                <BaseInput
                  v-model.number="avail.max_guests"
                  label="Số khách tối đa"
                  type="number"
                  required
                  min="1"
                  class="w-full"
                />
                <BaseInput
                  v-model.number="avail.available_slots"
                  label="Số chỗ còn lại"
                  type="number"
                  required
                  min="0"
                  :max="avail.max_guests"
                  class="w-full"
                />
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="avail.is_active"
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span class="text-sm">Kích hoạt</span>
                </div>
              </div>
              <BaseButton
                label="Xóa"
                color="danger"
                size="sm"
                class="mt-2"
                @click="removeAvailability(index)"
              />
            </div>
            <BaseButton label="+ Thêm lịch trình" size="sm" color="info" @click="addAvailability" />
          </div>

          <div class="flex justify-end">
            <BaseButton type="submit" color="success" label="Cập nhật tour" />
          </div>
        </form>
      </CardBox>

      <!-- Location Creation Modal -->
      <transition
        name="fade"
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showLocationModal"
          class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-40"
        >
          <CardBox class="w-full max-w-md">
            <form @submit.prevent="submitLocation" class="space-y-4">
              <h2 class="text-lg font-semibold">Tạo địa điểm mới</h2>
              <BaseInput v-model="locationForm.name" label="Tên địa điểm" required />
              <BaseInput v-model="locationForm.country" label="Quốc gia" required />
              <BaseInput v-model="locationForm.city" label="Thành phố" required />
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  v-model="locationForm.description"
                  rows="4"
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  placeholder="Viết mô tả địa điểm..."
                ></textarea>
              </div>
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleLocationImageUpload"
                  class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div v-if="locationForm.image" class="mt-2">
                  <img
                    :src="locationForm.image"
                    alt="Location Image"
                    class="w-full h-40 object-cover rounded shadow"
                  />
                  <BaseButton
                    label="Xóa ảnh"
                    color="danger"
                    size="sm"
                    class="mt-2"
                    @click="locationForm.image = ''"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-2">
                <BaseButton label="Hủy" color="gray" @click="showLocationModal = false" />
                <BaseButton type="submit" color="success" label="Tạo" />
              </div>
            </form>
          </CardBox>
        </div>
      </transition>

      <!-- Travel Type Creation Modal -->
      <transition
        name="fade"
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showTravelTypeModal"
          class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-40"
        >
          <CardBox class="w-full max-w-md">
            <form @submit.prevent="submitTravelType" class="space-y-4">
              <h2 class="text-lg font-semibold">Tạo danh mục mới</h2>
              <BaseInput v-model="travelTypeForm.name" label="Tên danh mục" required />
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  v-model="travelTypeForm.description"
                  rows="4"
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  placeholder="Viết mô tả danh mục..."
                ></textarea>
              </div>
              <div class="flex justify-end gap-2">
                <BaseButton label="Hủy" color="gray" @click="showTravelTypeModal = false" />
                <BaseButton type="submit" color="success" label="Tạo" />
              </div>
            </form>
          </CardBox>
        </div>
      </transition>

      <!-- Feature Creation Modal -->
      <transition
        name="fade"
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showFeatureModal"
          class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-40"
        >
          <CardBox class="w-full max-w-md">
            <form @submit.prevent="submitFeature" class="space-y-4">
              <h2 class="text-lg font-semibold">Tạo tính năng mới</h2>
              <BaseInput v-model="featureForm.name" label="Tên tính năng" required />
              <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  v-model="featureForm.description"
                  rows="4"
                  class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  placeholder="Viết mô tả tính năng..."
                ></textarea>
              </div>
              <div class="flex justify-end gap-2">
                <BaseButton label="Hủy" color="gray" @click="showFeatureModal = false" />
                <BaseButton type="submit" color="success" label="Tạo" />
              </div>
            </form>
          </CardBox>
        </div>
      </transition>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseInput from '@/components/admin/BaseInput.vue'
import BaseButton from '@/components/admin/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const tourId = route.params.id

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
})

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

const displayPrice = ref('')
const availableFeatures = ref([])
const locations = ref([])
const vendors = ref([])
const travelTypes = ref([])
const showLocationModal = ref(false)
const showTravelTypeModal = ref(false)
const showFeatureModal = ref(false)

// Format price for display
const formatPrice = (value) => {
  if (value === '' || value == null) return ''
  return Number(value).toLocaleString('vi-VN') + '₫'
}

// Handle price input
const formatPriceInput = (e) => {
  let value = e.target.value.replace(/[^\d]/g, '')
  if (value === '') {
    form.value.price = ''
    displayPrice.value = ''
    return
  }
  const numValue = Number(value)
  form.value.price = numValue
  displayPrice.value = numValue.toLocaleString('vi-VN')
}

// Apply formatting on blur
const applyFormatting = () => {
  if (form.value.price === '' || form.value.price == null) {
    displayPrice.value = ''
  } else {
    displayPrice.value = formatPrice(form.value.price)
  }
}

// Watch for price changes
watch(
  () => form.value.price,
  (newPrice) => {
    displayPrice.value = formatPrice(newPrice)
  },
  { immediate: true },
)

const fetchData = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const [tourRes, locRes, venRes, typeRes, featureRes] = await Promise.all([
      axios.get(`${apiBaseUrl}/tours/${tourId}`),
      axios.get(`${apiBaseUrl}/locations`),
      axios.get(`${apiBaseUrl}/vendors`),
      axios.get(`${apiBaseUrl}/travel-types`),
      axios.get(`${apiBaseUrl}/features`),
    ])

    const tour = tourRes.data
    form.value = {
      name: tour.name,
      description: tour.description || '',
      price: parseFloat(tour.price) || '',
      days: tour.days,
      nights: tour.nights,
      travel_type_id: tour.travel_type_id || '',
      location_id: tour.location_id,
      vendor_id: tour.vendor_id,
      features: featureRes.data.data.filter((f) => tour.features.includes(f.name)).map((f) => f.id), // Map feature names to IDs
      images: tour.images.map((img) => ({
        id: img.id,
        image_url: img.image_url,
        caption: img.caption,
        is_primary: img.is_primary,
      })),
      availabilities: tour.availabilities.map((avail) => ({
        id: avail.id,
        date: avail.date,
        max_guests: avail.max_guests,
        available_slots: avail.available_slots,
        is_active: avail.is_active,
      })),
    }

    locations.value = locRes.data.data
    vendors.value = venRes.data.data
    travelTypes.value = typeRes.data.data
    availableFeatures.value = featureRes.data.data
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err)
    alert('Không thể tải dữ liệu tour.')
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
      if (uploadRes.status !== 200) {
        throw new Error('Upload failed')
      }
      return {
        id: null,
        image_url: uploadRes.data.secure_url,
        caption: null,
        is_primary: form.value.images.length === 0 ? true : false,
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
    id: null,
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
  locationForm.value = { name: '', description: '', country: '', city: '', image: '' }
  showLocationModal.value = true
}

const submitLocation = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: locationForm.value.name,
      description: locationForm.value.description,
      country: locationForm.value.country,
      city: locationForm.value.city,
      image: locationForm.value.image || null,
    }
    const response = await axios.post(`${apiBaseUrl}/locations`, payload)
    locations.value.push(response.data)
    form.value.location_id = response.data.id
    showLocationModal.value = false
    alert('Thêm địa điểm thành công!')
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
        params: {
          upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        },
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
    const response = await axios.post(`${apiBaseUrl}/travel-types`, payload)
    travelTypes.value.push(response.data)
    form.value.travel_type_id = response.data.id
    showTravelTypeModal.value = false
    alert('Thêm danh mục thành công!')
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
    const response = await axios.post(`${apiBaseUrl}/features`, payload)
    availableFeatures.value.push(response.data)
    form.value.features.push(response.data.id)
    showFeatureModal.value = false
    alert('Thêm tính năng thành công!')
  } catch (err) {
    console.error('Lỗi khi thêm tính năng:', err)
    alert('Không thể thêm tính năng: ' + (err.response?.data?.message || 'Lỗi không xác định'))
  }
}

const updateTour = async () => {
  try {
    if (form.value.days && form.value.nights) {
      const diff = Math.abs(form.value.days - form.value.nights)
      if (diff > 1) {
        alert('Số ngày và số đêm không được lệch nhau quá 1.')
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
    }
    await axios.put(`${apiBaseUrl}/tours/${tourId}`, payload)
    alert('Cập nhật tour thành công!')
    router.push('/admin/tours')
  } catch (err) {
    console.error('Lỗi khi cập nhật tour:', err)
    alert('Không thể cập nhật tour: ' + (err.response?.data?.errors || 'Lỗi không xác định'))
  }
}

onMounted(fetchData)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fixed.inset-0.bg-gray-800.bg-opacity-50.z-40 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
