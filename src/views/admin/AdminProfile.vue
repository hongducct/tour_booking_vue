<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import axios from 'axios'
import {
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  PhoneIcon,
  PhotoIcon,
  ListBulletIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import SectionMain from '@/components/admin/SectionMain.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseDivider from '@/components/admin/BaseDivider.vue'
import FormField from '@/components/admin/FormField.vue'
import FormControl from '@/components/admin/FormControl.vue'
import FormFilePicker from '@/components/admin/FormFilePicker.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BaseButtons from '@/components/admin/BaseButtons.vue'
import UserCard from '@/components/admin/UserCard.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'

const mainStore = useMainStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const profileForm = reactive({
  username: mainStore.admin.username,
  email: mainStore.admin.email,
  first_name: mainStore.admin.first_name,
  last_name: mainStore.admin.last_name,
  phone_number: mainStore.admin.phone_number,
  avatar: mainStore.admin.avatar,
  admin_status: mainStore.admin.admin_status,
})

const passwordForm = reactive({
  email: mainStore.admin.email,
  otp: '',
  password: '',
  password_confirmation: '',
})

const emailForm = reactive({
  new_email: '',
  otp: '',
})

const error = ref('')
const success = ref('')
const loading = ref(false)
const otpSent = ref(false)
const emailOtpSent = ref(false)
const isLoadingProfile = ref(true)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)


// Avatar upload states
const avatarPreview = ref(profileForm.avatar || '')
const isUploadingImage = ref(false)
const avatarErrors = ref({})

onMounted(async () => {
  if (mainStore.isAdminAuthenticated && !mainStore.admin.id) {
    await mainStore.fetchAdminProfile()
    // Update form with fetched data
    Object.assign(profileForm, {
      username: mainStore.admin.username,
      email: mainStore.admin.email,
      first_name: mainStore.admin.first_name,
      last_name: mainStore.admin.last_name,
      phone_number: mainStore.admin.phone_number,
      avatar: mainStore.admin.avatar,
      admin_status: mainStore.admin.admin_status,
    })
    passwordForm.email = mainStore.admin.email
    avatarPreview.value = mainStore.admin.avatar || ''
  }
  isLoadingProfile.value = false
})

// Avatar upload function
const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    avatarErrors.value.avatar = 'Image size must be less than 5MB.'
    error.value = 'Image size must be less than 5MB.'
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    avatarErrors.value.avatar = 'Please select a valid image file.'
    error.value = 'Please select a valid image file.'
    return
  }

  isUploadingImage.value = true
  avatarErrors.value.avatar = null
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
    profileForm.avatar = uploadRes.data.secure_url
    success.value = 'Avatar uploaded successfully!'
    
    // Clear any previous errors
    avatarErrors.value = {}
  } catch (err) {
    console.error('Image upload error:', err)
    avatarErrors.value.avatar = 'Failed to upload image. Please try again.'
    error.value = 'Failed to upload image. Please try again.'
  } finally {
    isUploadingImage.value = false
  }
}

const submitProfile = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await axios.put(`${baseUrl}/admin/profile`, profileForm, {
      headers: {
        Authorization: `Bearer ${mainStore.adminToken}`,
      },
    })
    console.log('Profile update response:', res.data)
    mainStore.setAdmin(res.data.admin)
    success.value = 'Profile updated successfully'
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}

const requestPasswordOtp = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await axios.post(`${baseUrl}/admin/forgot-password`, { email: passwordForm.email })
    otpSent.value = true
    success.value = 'OTP sent to your email'
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send OTP'
  } finally {
    loading.value = false
  }
}

const submitPasswordReset = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await axios.post(`${baseUrl}/admin/reset-password`, passwordForm)
    success.value = 'Password reset successfully'
    otpSent.value = false
    passwordForm.otp = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to reset password'
  } finally {
    loading.value = false
  }
}

const requestEmailOtp = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await axios.post(
      `${baseUrl}/admin/request-email-change-otp`,
      { new_email: emailForm.new_email },
      {
        headers: {
          Authorization: `Bearer ${mainStore.adminToken}`,
        },
      },
    )
    emailOtpSent.value = true
    success.value = 'OTP sent to your new email address'
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.errors?.new_email?.[0] ||
      'Failed to send OTP'
  } finally {
    loading.value = false
  }
}

const submitEmailChange = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await axios.post(`${baseUrl}/admin/change-email`, emailForm, {
      headers: {
        Authorization: `Bearer ${mainStore.adminToken}`,
      },
    })
    success.value = 'Email changed successfully'
    mainStore.setAdmin(res.data.admin)
    profileForm.email = res.data.admin.email
    passwordForm.email = res.data.admin.email
    emailOtpSent.value = false
    emailForm.new_email = ''
    emailForm.otp = ''
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.errors?.otp?.[0] ||
      'Failed to change email'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="UserIcon" title="Admin Profile" main>
        <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <div v-if="isLoadingProfile" class="flex items-center justify-center py-12">
        <div class="flex items-center space-x-3 text-gray-500">
          <ArrowPathIcon class="h-5 w-5 animate-spin" />
          <span class="text-sm font-medium">Loading profile...</span>
        </div>
      </div>

      <template v-else>
        <!-- User Card với hiệu ứng gradient hiện đại -->
        <div
          class="mb-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <UserCard :user="mainStore.admin" />
        </div>

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

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Profile Form -->
          <div class="xl:col-span-2">
            <div
              class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <UserIcon class="h-5 w-5 mr-2" />
                  Profile Information
                </h3>
              </div>

              <form @submit.prevent="submitProfile" class="p-6 space-y-6">
                <!-- Avatar Upload Section -->
                <div class="space-y-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Profile Picture</label
                  >
                  <div class="flex flex-col sm:flex-row items-center gap-6">
                    <div class="relative">
                      <div
                        class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 border-4 border-white shadow-lg"
                      >
                        <img
                          v-if="avatarPreview"
                          :src="avatarPreview"
                          alt="Profile Picture"
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
                        {{ isUploadingImage ? 'Uploading...' : 'Change Picture' }}
                      </label>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        JPG, PNG up to 5MB
                      </p>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Recommended: 400x400px square image
                      </p>
                    </div>
                  </div>

                  <!-- Avatar Error Message -->
                  <div
                    v-if="avatarErrors.avatar"
                    class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <ExclamationCircleIcon class="w-4 h-4" />
                      <span class="text-sm">{{ avatarErrors.avatar }}</span>
                    </div>
                  </div>
                </div>
                <BaseDivider />
                <!-- Form Fields -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Username</label
                    >
                    <div class="relative">
                      <UserIcon
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                      />
                      <input
                        v-model="profileForm.username"
                        type="text"
                        required
                        class="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter username"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Email</label
                    >
                    <div class="relative">
                      <EnvelopeIcon
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                      />
                      <input
                        v-model="profileForm.email"
                        type="email"
                        disabled
                        required
                        class="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >First Name</label
                      >
                      <input
                        v-model="profileForm.first_name"
                        type="text"
                        required
                        class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >Last Name</label
                      >
                      <input
                        v-model="profileForm.last_name"
                        type="text"
                        required
                        class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Phone Number</label
                    >
                    <div class="relative">
                      <PhoneIcon
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                      />
                      <input
                        v-model="profileForm.phone_number"
                        type="tel"
                        class="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
                >
                  <span v-if="loading" class="flex items-center justify-center">
                    <ArrowPathIcon class="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </span>
                  <span v-else>Update Profile</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="xl:col-span-1 space-y-8">
            <!-- Change Email -->
            <div
              class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div class="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <EnvelopeIcon class="h-5 w-5 mr-2" />
                  Change Email Address
                </h3>
              </div>

              <form @submit.prevent="submitEmailChange" class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >New Email</label
                  >
                  <div class="relative">
                    <EnvelopeIcon
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    />
                    <input
                      v-model="emailForm.new_email"
                      type="email"
                      required
                      :disabled="emailOtpSent"
                      :placeholder="profileForm.email"
                      class="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    />
                  </div>
                </div>

                <div v-if="emailOtpSent" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Verification Code</label
                    >
                    <input
                      v-model="emailForm.otp"
                      type="text"
                      required
                      maxlength="6"
                      class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                      placeholder="000000"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                      Enter the 6-digit code sent to your new email
                    </p>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button
                    v-if="!emailOtpSent"
                    type="button"
                    @click="requestEmailOtp"
                    :disabled="loading || !emailForm.new_email"
                    class="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                  >
                    Request OTP
                  </button>
                  <button
                    v-if="emailOtpSent"
                    type="submit"
                    :disabled="loading || !emailForm.otp || emailForm.otp.length !== 6"
                    class="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            </div>

            <!-- Change Password -->
            <div
              class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div class="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <KeyIcon class="h-5 w-5 mr-2" />
                  Change Password
                </h3>
              </div>

              <form @submit.prevent="submitPasswordReset" class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Email for OTP</label
                  >
                  <div class="relative">
                    <EnvelopeIcon
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    />
                    <input
                      v-model="passwordForm.email"
                      type="email"
                      required
                      :disabled="otpSent"
                      class="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                      placeholder="Enter email for OTP"
                    />
                  </div>
                </div>

                <div v-if="otpSent" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Verification Code</label
                    >
                    <input
                      v-model="passwordForm.otp"
                      type="text"
                      required
                      maxlength="6"
                      class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                      placeholder="000000"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >New Password</label
                    >
                    <div class="relative">
                      <KeyIcon
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                      />
                      <input
                        v-model="passwordForm.password"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        class="pl-10 pr-12 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter new password"
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
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Confirm Password</label
                    >
                    <div class="relative">
                      <KeyIcon
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                      />
                      <input
                        v-model="passwordForm.password_confirmation"
                        :type="showPasswordConfirm ? 'text' : 'password'"
                        required
                        class="pl-10 pr-12 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm new password"
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
                  </div>
                </div>

                <div class="flex gap-3">
                  <button
                    v-if="!otpSent"
                    type="button"
                    @click="requestPasswordOtp"
                    :disabled="loading || !passwordForm.email"
                    class="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                  >
                    Request OTP
                  </button>
                  <button
                    v-if="otpSent"
                    type="submit"
                    :disabled="
                      loading ||
                      !passwordForm.otp ||
                      !passwordForm.password ||
                      passwordForm.password !== passwordForm.password_confirmation
                    "
                    class="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </template>
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

/* Custom gradient borders */
.gradient-border {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2px;
  border-radius: 1rem;
}

.gradient-border > div {
  background: white;
  border-radius: calc(1rem - 2px);
}

/* Dark mode gradient borders */
.dark .gradient-border > div {
  background: #1f2937;
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
</style>
