<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Tạo tour mới" icon="mdiPlus" main>
        <BaseButton label="Quay lại" color="gray" @click="$router.back()" />
      </SectionTitleLineWithButton>

      <CardBox class="max-w-4xl mx-auto">
        <form @submit.prevent="createTour" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BaseInput v-model="form.name" label="Tên tour" required class="w-full" />
            <BaseInput
              v-model.number="form.price"
              label="Giá (₫)"
              type="number"
              required
              class="w-full"
            />
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
              <select
                v-model="form.category"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                required
              >
                <option disabled value="">Chọn danh mục</option>
                <option>Adventure</option>
                <option>Culture</option>
                <option>Nature</option>
              </select>
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
                <BaseButton label="+Thêm" size="sm" @click.prevent="createLocation" />
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
                :key="feature"
                class="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :value="feature"
                  v-model="form.features"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span class="text-sm">{{ feature }}</span>
              </label>
              <BaseButton label="+Thêm" size="sm" @click.prevent="createFeature" />
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
                :key="index"
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
              :key="index"
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
            <BaseButton type="submit" color="success" label="Tạo tour" />
          </div>
        </form>
      </CardBox>
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

const router = useRouter()

const form = ref({
  name: '',
  description: '',
  price: '',
  days: 1,
  nights: 1,
  category: '',
  location_id: '',
  vendor_id: '',
  features: [],
  images: [],
  availabilities: [],
})

const availableFeatures = ref([
  'Sightseeing',
  'Activities',
  'Pick-up/Drop-off',
  'Entrance Fees',
  'Transportation',
  'Meals Included',
  'Insurance',
])

const locations = ref([])
const vendors = ref([])

const fetchData = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const [locRes, venRes] = await Promise.all([
      axios.get(`${apiBaseUrl}/locations`),
      axios.get(`${apiBaseUrl}/vendors`),
    ])

    locations.value = locRes.data.data
    vendors.value = venRes.data.data
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err)
    alert('Không thể tải dữ liệu.')
  }
}

// const validateDaysNights = () => {
//   if (form.value.days && form.value.nights) {
//     const diff = Math.abs(form.value.days - form.value.nights)
//     if (diff > 1) {
//       alert('Số ngày và số đêm không được lệch nhau quá 1.')
//       if (form.value.days > form.value.nights + 1) {
//         form.value.days = form.value.nights + 1
//       } else if (form.value.nights > form.value.days + 1) {
//         form.value.nights = form.value.days + 1
//       }
//     }
//   }
// }

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
        // is_primary: form.value.images.length === 0 ? true : false,
        is_primary: false,
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

const createLocation = () => {
  alert('Chức năng thêm địa điểm mới sẽ được phát triển sau.')
}

const createFeature = () => {
  alert('Chức năng thêm tính năng mới sẽ được phát triển sau.')
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
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      days: form.value.days,
      nights: form.value.nights,
      category: form.value.category,
      location_id: form.value.location_id,
      vendor_id: form.value.vendor_id,
      features: JSON.stringify(form.value.features),
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
    }
    await axios.post(`${apiBaseUrl}/tours`, payload)
    alert('Tạo tour thành công!')
    router.push('/admin/tours')
  } catch (err) {
    console.error('Lỗi khi tạo tour:', err)
    // alert ra thông báo lỗi kèm lỗi
    alert('Không thể tạo tour. Vui lòng kiểm tra lại thông tin.\n' + err.response.data.message)
  }
}

onMounted(fetchData)
</script>

<style scoped>
/* Tailwind handles styling */
</style>
