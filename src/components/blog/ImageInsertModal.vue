<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg max-w-lg w-full p-6 relative">
        <h3 class="text-lg font-semibold mb-4">Chèn ảnh vào nội dung</h3>

        <!-- Nhập URL -->
        <div class="mb-4">
          <label class="block mb-2 font-medium">Nhập URL ảnh:</label>
          <input
            v-model="localImageUrl"
            type="text"
            placeholder="Nhập URL ảnh..."
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Upload ảnh trực tiếp -->
        <div class="mb-4">
          <label class="block mb-2 font-medium">Hoặc tải ảnh lên:</label>
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="w-full text-sm text-gray-600"
          />
        </div>

        <!-- Tùy chọn alt, căn giữa, class -->
        <div class="mb-4 space-y-4">
          <div>
            <label class="block mb-2 font-medium">Alt text (mô tả ảnh):</label>
            <input
              v-model="altText"
              type="text"
              placeholder="Nhập alt text cho ảnh"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">Kích thước ảnh:</label>
            <select
              v-model="localImageSize"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Ảnh nhỏ (200px)</option>
              <option value="medium">Ảnh trung bình (400px)</option>
              <option value="large">Ảnh lớn (800px)</option>
              <option value="custom">Tùy chỉnh (nhập bên dưới)</option>
            </select>
          </div>

          <div v-if="localImageSize === 'custom'">
            <label class="block mb-2 font-medium">Chiều rộng ảnh (px):</label>
            <input
              v-model.number="customWidth"
              type="number"
              min="10"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">Căn ảnh:</label>
            <select
              v-model="imageAlign"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Trái</option>
              <option value="center">Giữa</option>
              <option value="right">Phải</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 font-medium">CSS Class (tuỳ chọn):</label>
            <input
              v-model="customClass"
              type="text"
              placeholder="Ví dụ: rounded shadow-lg"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Progress Upload -->
        <div v-if="uploading" class="mb-4 p-4 bg-gray-100 rounded">
          <div class="flex items-center gap-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Đang tải ảnh lên... {{ uploadProgress }}%</span>
          </div>
          <div class="w-full bg-gray-300 rounded h-2 mt-2 overflow-hidden">
            <div
              class="bg-blue-600 h-2 rounded transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            @click="closeModal"
            :disabled="uploading"
          >
            Hủy
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            @click="insertImage"
            :disabled="!localImageUrl || uploading"
          >
            Chèn ảnh
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  show: Boolean,
  imageUrl: String,
  imageSize: {
    type: String,
    default: 'medium',
  },
})

// FIXED: Chỉ emit những event cần thiết, tránh trigger auto-save
const emit = defineEmits(['update:show', 'insert'])

const localImageUrl = ref(props.imageUrl || '')
const localImageSize = ref(props.imageSize || 'medium')
const customWidth = ref(400)
const altText = ref('')
const imageAlign = ref('left')
const customClass = ref('')

const uploading = ref(false)
const uploadProgress = ref(0)

// Khi props.show thay đổi thì đồng bộ local state
watch(
  () => props.show,
  (val) => {
    if (val) {
      // Reset form khi mở modal
      localImageUrl.value = props.imageUrl || ''
      localImageSize.value = props.imageSize || 'medium'
      altText.value = ''
      imageAlign.value = 'left'
      customClass.value = ''
      customWidth.value = 400
      uploadProgress.value = 0
    }
  },
)

// FIXED: Upload ảnh không emit bất kỳ event nào để tránh auto-save
async function onFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    alert('Kích thước file vượt quá 10MB!')
    return
  }

  console.log('Starting image upload for content insertion...')
  uploading.value = true
  uploadProgress.value = 0

  try {
    // Tạo form data upload lên Cloudinary
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    console.log('Uploading to Cloudinary...')
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            uploadProgress.value = Math.round((e.loaded * 100) / e.total)
          }
        },
      },
    )

    console.log('Image uploaded successfully:', res.data.secure_url)

    // FIXED: Chỉ cập nhật local state, KHÔNG emit bất kỳ event nào
    // Điều này tránh trigger auto-save trong parent component
    localImageUrl.value = res.data.secure_url

    // Reset file input
    event.target.value = ''
  } catch (error) {
    console.error('Upload error:', error)
    alert('Lỗi khi tải ảnh lên: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    uploading.value = false
  }
}

// FIXED: Chỉ emit khi user thực sự muốn chèn ảnh
function insertImage() {
  if (!localImageUrl.value.trim()) {
    alert('Vui lòng nhập URL ảnh hoặc tải ảnh lên!')
    return
  }

  let width = ''
  if (localImageSize.value === 'small') width = '200'
  else if (localImageSize.value === 'medium') width = '400'
  else if (localImageSize.value === 'large') width = '800'
  else if (localImageSize.value === 'custom') width = customWidth.value

  // Tạo CSS classes cho căn ảnh
  let alignClass = ''
  if (imageAlign.value === 'center') {
    alignClass = 'ql-align-center'
  } else if (imageAlign.value === 'right') {
    alignClass = 'ql-align-right'
  } else {
    alignClass = 'ql-align-left'
  }

  // Kết hợp custom class nếu có
  const finalClass = customClass.value ? `${alignClass} ${customClass.value}` : alignClass

  const altAttr = altText.value.trim() || 'Image'

  // Tạo div wrapper với class căn để Quill hiểu được
  const imgWrapper = `<div class="${alignClass}"><img src="${localImageUrl.value}" width="${width}" alt="${altAttr}" class="${customClass.value || ''}" /></div>`

  console.log('Inserting image with HTML:', imgWrapper)

  // FIXED: Chỉ emit khi user click "Chèn ảnh", không emit trong quá trình upload
  emit('insert', imgWrapper)
  emit('update:show', false)
}

// FIXED: Thêm function để đóng modal một cách clean
function closeModal() {
  // Reset tất cả state khi đóng modal
  localImageUrl.value = ''
  altText.value = ''
  imageAlign.value = 'left'
  customClass.value = ''
  customWidth.value = 400
  uploadProgress.value = 0
  uploading.value = false

  emit('update:show', false)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fixed.inset-0.bg-black.bg-opacity-50.z-40 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
