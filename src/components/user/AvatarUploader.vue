<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  notifySuccess: {
    type: Function,
    required: true,
  },
  notifyError: {
    type: Function,
    required: true,
  },
})
const avatar = defineModel()

const avatarPreview = ref(avatar.value || '')
const isUploadingImage = ref(false)
const errors = ref({})

const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

//   if (file.size > 5 * 1024 * 1024) {
//     errors.value.avatar = 'Image size must be less than 5MB.'
//     notifyError('Image size must be less than 5MB.')
//     return
//   }

  isUploadingImage.value = true
  errors.value.avatar = null

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

    if (uploadRes.status !== 200) {
      throw new Error('Upload failed')
    }

    avatarPreview.value = uploadRes.data.secure_url
    avatar.value = uploadRes.data.secure_url
    props.notifySuccess('Image uploaded successfully!')
  } catch (err) {
    console.error('Image upload error:', err)
    errors.value.avatar = 'Failed to upload image. Please try again.'
    props.notifyError('Failed to upload image. Please try again.')
  } finally {
    isUploadingImage.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">Profile Picture</label>
    <div class="flex flex-col sm:flex-row items-center gap-6">
      <div class="relative">
        <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
          <img
            v-if="avatarPreview"
            :src="avatarPreview"
            alt="Profile Picture"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div
          v-if="isUploadingImage"
          class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
        >
          <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
        </div>
      </div>

      <div class="flex-1">
        <input
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          :disabled="isUploadingImage"
          class="hidden"
          id="avatar-upload"
        />
        <label
          for="avatar-upload"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-all"
          :class="{ 'opacity-50 cursor-not-allowed': isUploadingImage }"
        >
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clip-rule="evenodd"
            />
          </svg>
          {{ isUploadingImage ? 'Uploading...' : 'Change Picture' }}
        </label>
        <p class="text-sm text-gray-500 mt-2">JPG, PNG up to 5MB</p>
        <p class="text-xs text-gray-400">Recommended: 400x400px square image</p>
      </div>
    </div>

    <div v-if="errors.avatar" class="bg-red-50 p-3 rounded-lg border border-red-200">
      <div class="flex items-center gap-2 text-red-600">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ errors.avatar }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='file'] {
  display: none;
}
</style>
