<script setup>
import { reactive, ref, computed } from 'vue'
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  PhoneIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  UserPlusIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline'

import {
    mdiAccount,
    mdiEmailOutline,
    mdiKey,
    mdiPhone,
    mdiImage,
    mdiEye,
    mdiEyeOff,
    mdiCheckCircle,
    mdiAlertCircle,
    mdiReload,
    mdiAccountPlus,
    mdiShieldCheck,
} from '@mdi/js'

import SectionMain from '@/components/admin/SectionMain.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseDivider from '@/components/admin/BaseDivider.vue'
import FormField from '@/components/admin/FormField.vue'
import FormControl from '@/components/admin/FormControl.vue'
import FormFilePicker from '@/components/admin/FormFilePicker.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BaseButtons from '@/components/admin/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'

const mainStore = useMainStore()
const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const adminForm = reactive({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  avatar: '',
  admin_status: 'active',
})

const errors = ref({})
const error = ref('')
const success = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

// Avatar upload states
const avatarPreview = ref('')
const isUploadingImage = ref(false)
const avatarUploadErrors = ref({})

// Validation states
const formValidation = computed(() => {
  const validations = {
    username: adminForm.username.length >= 3,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email),
    password: adminForm.password.length >= 6,
    password_confirmation:
      adminForm.password_confirmation === adminForm.password &&
      adminForm.password_confirmation.length > 0,
    first_name: adminForm.first_name.length >= 2,
    last_name: adminForm.last_name.length >= 2,
  }

  return {
    ...validations,
    isValid: Object.values(validations).every((v) => v === true),
  }
})

// Avatar upload function
const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    avatarUploadErrors.value.avatar = 'Image size must be less than 5MB.'
    error.value = 'Image size must be less than 5MB.'
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    avatarUploadErrors.value.avatar = 'Please select a valid image file.'
    error.value = 'Please select a valid image file.'
    return
  }

  isUploadingImage.value = true
  avatarUploadErrors.value.avatar = null
  error.value = ''

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
    adminForm.avatar = uploadRes.data.secure_url
    success.value = 'Avatar uploaded successfully!'

    // Clear any previous errors
    avatarUploadErrors.value = {}
  } catch (err) {
    console.error('Image upload error:', err)
    avatarUploadErrors.value.avatar = 'Failed to upload image. Please try again.'
    error.value = 'Failed to upload image. Please try again.'
  } finally {
    isUploadingImage.value = false
  }
}

const resetForm = () => {
  Object.assign(adminForm, {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    avatar: '',
    admin_status: 'active',
  })
  avatarPreview.value = ''
  errors.value = {}
  error.value = ''
  success.value = ''
}

const submitForm = async () => {
  if (!formValidation.value.isValid) {
    error.value = 'Please fill in all required fields correctly.'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''
  errors.value = {}

  try {
    const response = await axios.post(`${baseUrl}/admins`, adminForm, {
      headers: {
        Authorization: `Bearer ${mainStore.adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Admin created successfully:', response.data)
    success.value = 'Admin account created successfully!'

    // Reset form after successful creation
    setTimeout(() => {
      resetForm()
    }, 2000)
  } catch (err) {
    console.error('Error creating admin:', err)

    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
      error.value = 'Please check the form for validation errors.'
    } else {
      error.value =
        err.response?.data?.message || 'Failed to create admin account. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const getFieldError = (fieldName) => {
  return errors.value[fieldName]?.[0] || ''
}

const getValidationClass = (fieldName) => {
  if (errors.value[fieldName]) return 'border-red-500 focus:ring-red-500'
  if (adminForm[fieldName] && formValidation.value[fieldName])
    return 'border-green-500 focus:ring-green-500'
  return 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="UserPlusIcon" title="Create New Admin Account" main>
        <BaseButton
          @click="resetForm"
          :icon="mdiReload"
          label="Reset Form"
          color="info"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <!-- Alert Messages -->
      <div
        v-if="error"
        class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
      >
        <div class="flex items-center">
          <ExclamationCircleIcon class="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <p class="text-red-700 dark:text-red-300 text-sm font-medium">{{ error }}</p>
        </div>
      </div>

      <div
        v-if="success"
        class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
      >
        <div class="flex items-center">
          <CheckCircleIcon class="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
          <p class="text-green-700 dark:text-green-300 text-sm font-medium">{{ success }}</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto">
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <ShieldCheckIcon class="h-5 w-5 mr-2" />
              New Administrator Information
            </h3>
            <p class="text-blue-100 text-sm mt-1">
              Fill in the details to create a new admin account
            </p>
          </div>

          <form @submit.prevent="submitForm" class="p-6 space-y-6">
            <!-- Avatar Upload Section -->
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Picture
                <span class="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div class="flex flex-col sm:flex-row items-center gap-6">
                <div class="relative">
                  <div
                    class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 border-4 border-white shadow-lg"
                  >
                    <img
                      v-if="avatarPreview"
                      :src="avatarPreview"
                      alt="Profile Picture Preview"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <PhotoIcon class="h-10 w-10 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div
                    v-if="isUploadingImage"
                    class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                  >
                    <ArrowPathIcon class="h-6 w-6 text-white animate-spin" />
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
                    class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-all transform hover:scale-105"
                    :class="{ 'opacity-50 cursor-not-allowed': isUploadingImage }"
                  >
                    <PhotoIcon class="w-4 h-4 mr-2" />
                    {{ isUploadingImage ? 'Uploading...' : 'Upload Picture' }}
                  </label>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    Recommended: 400x400px square image
                  </p>
                </div>
              </div>

              <!-- Avatar Error Message -->
              <div
                v-if="avatarUploadErrors.avatar"
                class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
              >
                <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <ExclamationCircleIcon class="w-4 h-4" />
                  <span class="text-sm">{{ avatarUploadErrors.avatar }}</span>
                </div>
              </div>
            </div>

            <BaseDivider />

            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Username -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <UserIcon
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  />
                  <input
                    v-model="adminForm.username"
                    type="text"
                    required
                    class="pl-10 w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-transparent transition-all duration-200"
                    :class="getValidationClass('username')"
                    placeholder="Enter username"
                  />
                  <div
                    v-if="adminForm.username && formValidation.username"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <CheckCircleIcon class="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <p v-if="getFieldError('username')" class="text-red-500 text-xs mt-1">
                  {{ getFieldError('username') }}
                </p>
                <p v-else class="text-gray-500 text-xs mt-1">At least 3 characters</p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <EnvelopeIcon
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  />
                  <input
                    v-model="adminForm.email"
                    type="email"
                    required
                    class="pl-10 w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-transparent transition-all duration-200"
                    :class="getValidationClass('email')"
                    placeholder="Enter email address"
                  />
                  <div
                    v-if="adminForm.email && formValidation.email"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <CheckCircleIcon class="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <p v-if="getFieldError('email')" class="text-red-500 text-xs mt-1">
                  {{ getFieldError('email') }}
                </p>
                <p v-else class="text-gray-500 text-xs mt-1">Valid email format required</p>
              </div>
            </div>

            <!-- Password Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <KeyIcon
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  />
                  <input
                    v-model="adminForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="pl-10 pr-12 w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-transparent transition-all duration-200"
                    :class="getValidationClass('password')"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                    <EyeSlashIcon v-else class="h-5 w-5" />
                  </button>
                </div>
                <p v-if="getFieldError('password')" class="text-red-500 text-xs mt-1">
                  {{ getFieldError('password') }}
                </p>
                <p v-else class="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <KeyIcon
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  />
                  <input
                    v-model="adminForm.password_confirmation"
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    required
                    class="pl-10 pr-12 w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-transparent transition-all duration-200"
                    :class="getValidationClass('password_confirmation')"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    @click="showPasswordConfirm = !showPasswordConfirm"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon v-if="!showPasswordConfirm" class="h-5 w-5" />
                    <EyeSlashIcon v-else class="h-5 w-5" />
                  </button>
                </div>
                <p
                  v-if="adminForm.password_confirmation && !formValidation.password_confirmation"
                  class="text-red-500 text-xs mt-1"
                >
                  Passwords do not match
                </p>
                <p
                  v-else-if="
                    adminForm.password_confirmation && formValidation.password_confirmation
                  "
                  class="text-green-500 text-xs mt-1"
                >
                  Passwords match
                </p>
                <p v-else class="text-gray-500 text-xs mt-1">Must match password above</p>
              </div>
            </div>

            <!-- Personal Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="adminForm.first_name"
                  type="text"
                  required
                  class="w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-transparent transition-all duration-200"
                  :class="getValidationClass('first_name')"
                  placeholder="Enter first name"
                />
                <p v-if="getFieldError('first_name')" class="text-red-500 text-xs mt-1">
                  {{ getFieldError('first_name') }}
                </p>
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="adminForm.last_name"
                  type="text"
                  required
                  class="w-full rounded-xl border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-transparent transition-all duration-200"
                  :class="getValidationClass('last_name')"
                  placeholder="Enter last name"
                />
                <p v-if="getFieldError('last_name')" class="text-red-500 text-xs mt-1">
                  {{ getFieldError('last_name') }}
                </p>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                  <span class="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div class="relative">
                  <PhoneIcon
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  />
                  <input
                    v-model="adminForm.phone_number"
                    type="tel"
                    class="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter phone number"
                  />
                </div>
                <p v-if="getFieldError('phone_number')" class="text-red-500 text-xs mt-1">
                  {{ getFieldError('phone_number') }}
                </p>
              </div>

              <!-- Admin Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Status <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="adminForm.admin_status"
                  class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <p class="text-gray-500 text-xs mt-1">Account will be created with this status</p>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                :disabled="loading || !formValidation.isValid"
                class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <ArrowPathIcon class="h-4 w-4 animate-spin mr-2" />
                  Creating Account...
                </span>
                <span v-else class="flex items-center justify-center">
                  <UserPlusIcon class="h-4 w-4 mr-2" />
                  Create Admin Account
                </span>
              </button>

              <button
                type="button"
                @click="resetForm"
                :disabled="loading"
                class="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
              >
                <span class="flex items-center justify-center">
                  <ArrowPathIcon class="h-4 w-4 mr-2" />
                  Reset Form
                </span>
              </button>
            </div>

            <!-- Form Validation Summary -->
            <div
              v-if="!formValidation.isValid"
              class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
            >
              <div class="flex items-start">
                <ExclamationCircleIcon class="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 class="text-amber-800 dark:text-amber-300 font-medium text-sm">
                    Please complete required fields:
                  </h4>
                  <ul class="text-amber-700 dark:text-amber-400 text-xs mt-2 space-y-1">
                    <li v-if="!formValidation.username">• Username (minimum 3 characters)</li>
                    <li v-if="!formValidation.email">• Valid email address</li>
                    <li v-if="!formValidation.password">• Password (minimum 6 characters)</li>
                    <li v-if="!formValidation.password_confirmation">
                      • Password confirmation must match
                    </li>
                    <li v-if="!formValidation.first_name">• First name (minimum 2 characters)</li>
                    <li v-if="!formValidation.last_name">• Last name (minimum 2 characters)</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Custom focus states */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Button hover effects */
button:hover:not(:disabled) {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Responsive improvements */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* Validation states */
.border-green-500 {
  border-color: #10b981;
}

.border-red-500 {
  border-color: #ef4444;
}

.focus\:ring-green-500:focus {
  --tw-ring-color: rgb(16 185 129 / 0.5);
}

.focus\:ring-red-500:focus {
  --tw-ring-color: rgb(239 68 68 / 0.5);
}
</style>
