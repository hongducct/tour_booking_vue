<template>
  <div>
    <!-- Ảnh đại diện Section -->
    <div class="mb-6">
      <label class="block mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
        <span class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clip-rule="evenodd"
            />
          </svg>
          Ảnh đại diện blog
        </span>
      </label>

      <!-- Image URL Input -->
      <div class="mb-4">
        <input
          v-model="imageUrl"
          type="text"
          placeholder="Nhập URL ảnh"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          :class="{ 'border-red-500': urlError }"
          @input="handleUrlInput"
        />
        <p v-if="urlError" class="text-xs text-red-500 mt-1">{{ urlError }}</p>
      </div>

      <div class="relative">
        <input
          ref="featuredImageInput"
          type="file"
          accept="image/*"
          @change="handleFeaturedImageUpload"
          class="hidden"
        />

        <div
          @click="$refs.featuredImageInput.click()"
          @dragover.prevent
          @drop.prevent="handleDrop"
          class="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
          :class="{ 'border-blue-400 bg-blue-50': dragOver }"
          @dragenter="dragOver = true"
          @dragleave="dragOver = false"
        >
          <div v-if="!props.value && !uploading" class="text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="text-gray-600 font-medium mb-2">Kéo thả ảnh vào đây hoặc click để chọn</p>
            <p class="text-sm text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
          </div>

          <div v-else class="relative group">
            <!-- Loading state within preview area -->
            <div
              v-if="uploading || imageLoading"
              class="w-full max-w-md mx-auto h-48 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center relative"
            >
              <div class="flex flex-col items-center gap-3">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span class="text-gray-700 font-medium">Đang tải ảnh...</span>
                <div class="w-48 bg-gray-300 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                </div>
                <p class="text-sm text-gray-500">{{ uploadProgress }}% hoàn thành</p>
              </div>
            </div>

            <!-- Error state -->
            <div
              v-else-if="imageError"
              class="w-full max-w-md mx-auto h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-red-200"
            >
              <svg
                class="w-12 h-12 text-red-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-red-600 text-sm font-medium">Không thể tải ảnh</p>
              <button
                type="button"
                @click.stop="retryLoadImage"
                class="mt-2 text-blue-600 text-sm hover:underline"
              >
                Thử lại
              </button>
            </div>

            <!-- Success state -->
            <div v-else class="relative">
              <img
                :src="displayImageUrl"
                :key="displayImageUrl"
                alt="Featured image preview"
                class="w-full max-w-md mx-auto h-48 object-cover rounded-lg shadow-lg bg-gray-100"
                @load="handleImageLoad"
                @error="handleImageError"
                style="min-height: 192px"
              />

              <div
                class="absolute inset-0 hover:bg-gray-800 bg-opacity-50 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center z-20"
              >
                <div
                  class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2"
                >
                  <button
                    type="button"
                    @click.stop="$refs.featuredImageInput.click()"
                    class="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200 hover:cursor-pointer"
                  >
                    Thay đổi
                  </button>
                  <button
                    type="button"
                    @click.stop="removeImage"
                    class="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition-colors duration-200 hover:cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-if="!props.value" class="text-xs text-gray-500 mt-2">
        Ảnh đại diện sẽ hiển thị trên danh sách blog và trang chi tiết
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import axios from 'axios'

const props = defineProps({
  value: String,
})

const emit = defineEmits(['update:value', 'error', 'loading', 'insert-image'])

// Reactive data
const dragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const imageUrl = ref('')
const urlError = ref('')
const selectedSize = ref('medium')
const imageLoading = ref(false)
const imageError = ref(false)
const imageLoaded = ref(false)

// Computed property to handle image URL
const displayImageUrl = computed(() => {
  if (!props.value) return ''

  // For Cloudinary URLs, add basic transformations to ensure proper loading
  if (props.value.includes('cloudinary.com')) {
    const baseUrl = props.value.split('?')[0]
    const timestamp = Date.now()
    return `${baseUrl}?q_auto,f_auto,c_fill&t=${timestamp}`
  }

  return props.value
})

// Watch for value changes to reset image states
watch(
  () => props.value,
  async (newValue, oldValue) => {
    console.log('Props value changed from:', oldValue, 'to:', newValue)

    if (newValue && newValue !== oldValue) {
      imageLoading.value = true
      imageError.value = false
      imageLoaded.value = false

      await nextTick()
      preloadImage(newValue)
    } else if (!newValue) {
      imageLoading.value = false
      imageError.value = false
      imageLoaded.value = false
      imageUrl.value = ''
      urlError.value = ''
    }
  },
  { immediate: true },
)

// Handle URL input
function handleUrlInput() {
  urlError.value = ''
  if (imageUrl.value.trim()) {
    // Basic URL validation
    if (
      !imageUrl.value.match(/\.(jpeg|jpg|gif|png|webp)$/i) &&
      !imageUrl.value.includes('cloudinary.com')
    ) {
      urlError.value = 'URL không phải là link ảnh hợp lệ'
      return
    }
    imageLoading.value = true
    emit('update:value', imageUrl.value)
  }
}

// Preload image to check if it's available
function preloadImage(url) {
  const img = new Image()
  img.crossOrigin = 'anonymous'

  img.onload = () => {
    console.log('Image preloaded successfully:', url)
    setTimeout(() => {
      imageLoading.value = false
      imageError.value = false
      imageLoaded.value = true
    }, 100)
  }

  img.onerror = (error) => {
    console.error('Image preload failed:', url, error)
    const retryImg = new Image()
    retryImg.crossOrigin = 'anonymous'

    retryImg.onload = () => {
      console.log('Image preloaded successfully on retry:', url)
      setTimeout(() => {
        imageLoading.value = false
        imageError.value = false
        imageLoaded.value = true
      }, 100)
    }

    retryImg.onerror = () => {
      console.error('Image preload failed on retry:', url)
      setTimeout(() => {
        imageLoading.value = false
        imageError.value = true
        imageLoaded.value = false
        urlError.value = 'Không thể tải ảnh từ URL này'
      }, 100)
    }

    const baseUrl = url.split('?')[0]
    retryImg.src = baseUrl
  }

  img.src = url
}

// Handle image load success
function handleImageLoad(event) {
  console.log('Image loaded successfully in template!', event.target.src)
  if (event.target.naturalWidth > 0 && event.target.naturalHeight > 0) {
    imageLoading.value = false
    imageError.value = false
    imageLoaded.value = true
  } else {
    console.warn('Image loaded but has no dimensions')
    handleImageError(event)
  }
}

// Handle image load error
function handleImageError(event) {
  console.error('Image load error in template:', event)
  imageLoading.value = false
  imageError.value = true
  imageLoaded.value = false
}

// Retry loading image
function retryLoadImage() {
  if (props.value) {
    imageError.value = false
    imageLoading.value = true
    imageLoaded.value = false
    preloadImage(props.value)
  }
}

// Remove image
function removeImage() {
  emit('update:value', '')
  imageLoading.value = false
  imageError.value = false
  imageLoaded.value = false
  imageUrl.value = ''
  urlError.value = ''
}

// Handle drag and drop
function handleDrop(event) {
  dragOver.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    handleFeaturedImageUpload({ target: { files } })
  }
}

// Handle featured image upload
async function handleFeaturedImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    emit('error', 'Kích thước file không được vượt quá 10MB')
    return
  }

  const uploadedUrl = await uploadImage(file, true)
  if (uploadedUrl) {
    imageUrl.value = uploadedUrl
    emit('update:value', uploadedUrl)
  }
}

// Upload image to Cloudinary
async function uploadImage(file, isFeatured = false) {
  try {
    console.log('Starting upload for file:', file.name, 'isFeatured:', isFeatured)
    uploading.value = true
    uploadProgress.value = 0
    emit('loading', true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    console.log('Uploading to Cloudinary...')
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        },
      },
    )

    const imageUrl = response.data.secure_url
    console.log('Upload successful, image URL:', imageUrl)
    return imageUrl
  } catch (error) {
    console.error('Upload error:', error)
    emit('error', `Không thể tải ảnh lên: ${error.response?.data?.error?.message || error.message}`)
    return null
  } finally {
    uploading.value = false
    uploadProgress.value = 0
    emit('loading', false)
  }
}
</script>

<style scoped>
.bg-blue-25 {
  background-color: #f8faff;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* absolute inset-0 hover:bg-gray-800 bg-opacity-50 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center z-20 */
.absolute.inset-0.hover\:bg-gray-800:hover {
  background-color: rgba(31, 41, 55, 0.5);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sm\:grid-cols-4 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .sm\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
