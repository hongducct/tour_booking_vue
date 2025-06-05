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
  ShieldCheckIcon,
  CameraIcon,
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
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const mainStore = useMainStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const notifySuccess = (message) => {
  toast(message, {
    theme: 'auto',
    type: 'success',
    position: 'top-center',
    dangerouslyHTMLString: true,
  })
}
const notifyError = (message) => {
  toast(message, {
    theme: 'auto',
    type: 'error',
    position: 'top-center',
    dangerouslyHTMLString: true,
  })
}

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

const loading = ref(false)
const otpSent = ref(false)
const emailOtpSent = ref(false)
const isLoadingProfile = ref(true)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

// Avatar upload states
const avatarPreview = ref(profileForm.avatar || '')
const isUploadingImage = ref(false)

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
    notifyError('Kích thước hình ảnh phải nhỏ hơn 5MB.')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    notifyError('Vui lòng chọn một tệp hình ảnh hợp lệ.')
    return
  }

  isUploadingImage.value = true

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
    notifySuccess('Tải lên ảnh đại diện thành công!')
  } catch (err) {
    console.error('Image upload error:', err)
    notifyError('Không thể tải lên hình ảnh. Vui lòng thử lại.')
  } finally {
    isUploadingImage.value = false
  }
}

const submitProfile = async () => {
  loading.value = true
  try {
    const res = await axios.put(`${baseUrl}/admin/profile`, profileForm, {
      headers: {
        Authorization: `Bearer ${mainStore.adminToken}`,
      },
    })
    console.log('Profile update response:', res.data)
    mainStore.setAdmin(res.data.admin)
    notifySuccess('Cập nhật hồ sơ thành công!')
  } catch (err) {
    notifyError(err.response?.data?.message || 'Không thể cập nhật hồ sơ')
  } finally {
    loading.value = false
  }
}

const requestPasswordOtp = async () => {
  loading.value = true
  try {
    await axios.post(`${baseUrl}/admin/forgot-password`, { email: passwordForm.email })
    otpSent.value = true
    notifySuccess('Mã OTP đã được gửi đến email của bạn')
  } catch (err) {
    notifyError(err.response?.data?.message || 'Không thể gửi mã OTP')
  } finally {
    loading.value = false
  }
}

const submitPasswordReset = async () => {
  loading.value = true
  try {
    await axios.post(`${baseUrl}/admin/reset-password`, passwordForm)
    notifySuccess('Đặt lại mật khẩu thành công!')
    otpSent.value = false
    passwordForm.otp = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
  } catch (err) {
    notifyError(err.response?.data?.message || 'Không thể đặt lại mật khẩu')
  } finally {
    loading.value = false
  }
}

const requestEmailOtp = async () => {
  loading.value = true
  try {
    // Send OTP to current email instead of new email
    await axios.post(
      `${baseUrl}/admin/request-email-change-otp`,
      {
        current_email: profileForm.email, // Send to current email
        new_email: emailForm.new_email,
      },
      {
        headers: {
          Authorization: `Bearer ${mainStore.adminToken}`,
        },
      },
    )
    emailOtpSent.value = true
    notifySuccess(`Mã OTP đã được gửi đến email hiện tại của bạn: ${profileForm.email}`)
  } catch (err) {
    notifyError(
      err.response?.data?.message ||
        err.response?.data?.errors?.new_email?.[0] ||
        'Không thể gửi mã OTP',
    )
  } finally {
    loading.value = false
  }
}

const submitEmailChange = async () => {
  loading.value = true
  try {
    const res = await axios.post(`${baseUrl}/admin/change-email`, emailForm, {
      headers: {
        Authorization: `Bearer ${mainStore.adminToken}`,
      },
    })
    notifySuccess('Thay đổi email thành công!')
    mainStore.setAdmin(res.data.admin)
    profileForm.email = res.data.admin.email
    passwordForm.email = res.data.admin.email
    emailOtpSent.value = false
    emailForm.new_email = ''
    emailForm.otp = ''
  } catch (err) {
    notifyError(
      err.response?.data?.message ||
        err.response?.data?.errors?.otp?.[0] ||
        'Không thể thay đổi email',
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="UserIcon" title="Hồ Sơ Quản Trị" main>
        <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star trên GitHub"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <div v-if="isLoadingProfile" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center space-y-4 text-gray-500">
          <div class="relative">
            <div
              class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
            ></div>
          </div>
          <span class="text-sm font-medium animate-pulse">Đang tải hồ sơ...</span>
        </div>
      </div>

      <template v-else>
        <!-- User Card với hiệu ứng gradient hiện đại -->
        <div
          class="mb-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm"
        >
          <div class="p-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div class="bg-white dark:bg-gray-900 rounded-2xl">
              <UserCard :user="mainStore.admin" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Profile Form -->
          <div class="xl:col-span-2">
            <div
              class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
                <h3 class="text-xl font-bold text-white flex items-center">
                  <div
                    class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3"
                  >
                    <UserIcon class="h-6 w-6 text-white" />
                  </div>
                  Thông Tin Hồ Sơ
                </h3>
                <p class="text-blue-100 text-sm mt-1">Cập nhật thông tin cá nhân của bạn</p>
              </div>

              <form @submit.prevent="submitProfile" class="p-8 space-y-8">
                <!-- Avatar Upload Section với thiết kế đẹp hơn -->
                <div class="space-y-6">
                  <div class="text-center">
                    <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Ảnh Đại Diện
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Cập nhật ảnh hồ sơ của bạn
                    </p>
                  </div>

                  <div class="flex flex-col items-center gap-6">
                    <div class="relative group">
                      <div
                        class="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 border-4 border-white shadow-2xl relative"
                      >
                        <img
                          v-if="avatarPreview"
                          :src="avatarPreview"
                          alt="Ảnh Đại Diện"
                          class="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <PhotoIcon class="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>

                        <!-- Upload overlay -->
                        <div
                          class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <CameraIcon class="h-8 w-8 text-white" />
                        </div>
                      </div>

                      <div
                        v-if="isUploadingImage"
                        class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                      >
                        <div
                          class="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"
                        ></div>
                      </div>
                    </div>

                    <div class="text-center space-y-3">
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
                        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-2xl cursor-pointer transition-all transform hover:scale-105 hover:shadow-xl"
                        :class="{ 'opacity-50 cursor-not-allowed': isUploadingImage }"
                      >
                        <PhotoIcon class="w-5 h-5 mr-2" />
                        {{ isUploadingImage ? 'Đang tải lên...' : 'Thay Đổi Ảnh' }}
                      </label>
                      <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <p>JPG, PNG tối đa 5MB</p>
                        <p>Khuyến nghị: 400x400px</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
                ></div>

                <!-- Form Fields với thiết kế cải tiến -->
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Tên Đăng Nhập
                      </label>
                      <div class="relative group">
                        <UserIcon
                          class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        />
                        <input
                          v-model="profileForm.username"
                          type="text"
                          required
                          class="pl-12 w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-4 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                          placeholder="Nhập tên đăng nhập"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <div class="relative group">
                        <EnvelopeIcon
                          class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        />
                        <input
                          v-model="profileForm.email"
                          type="email"
                          disabled
                          required
                          class="pl-12 w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-4 text-gray-400 dark:text-gray-400 cursor-not-allowed"
                          placeholder="Nhập email"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Họ
                      </label>
                      <input
                        v-model="profileForm.first_name"
                        type="text"
                        required
                        class="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-4 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                        placeholder="Nhập họ"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Tên
                      </label>
                      <input
                        v-model="profileForm.last_name"
                        type="text"
                        required
                        class="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-4 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                        placeholder="Nhập tên"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Số Điện Thoại
                    </label>
                    <div class="relative group">
                      <PhoneIcon
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      />
                      <input
                        v-model="profileForm.phone_number"
                        type="tel"
                        class="pl-12 w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-4 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 shadow-xl relative overflow-hidden"
                >
                  <span v-if="loading" class="flex items-center justify-center">
                    <div
                      class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"
                    ></div>
                    Đang cập nhật...
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <CheckCircleIcon class="w-5 h-5 mr-2" />
                    Cập Nhật Hồ Sơ
                  </span>

                  <!-- Shimmer effect -->
                  <div
                    class="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 animate-shimmer"
                  ></div>
                </button>
              </form>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="xl:col-span-1 space-y-8">
            <!-- Change Email -->
            <div
              class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6">
                <h3 class="text-lg font-bold text-white flex items-center">
                  <div
                    class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3"
                  >
                    <EnvelopeIcon class="h-5 w-5 text-white" />
                  </div>
                  Thay Đổi Email
                </h3>
                <p class="text-emerald-100 text-sm mt-1">Cập nhật địa chỉ email</p>
              </div>

              <form @submit.prevent="submitEmailChange" class="p-6 space-y-4">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Hiện Tại
                  </label>
                  <div class="relative">
                    <EnvelopeIcon
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    />
                    <input
                      :value="profileForm.email"
                      type="email"
                      disabled
                      class="pl-10 w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-400 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Mã OTP sẽ được gửi đến email này
                  </p>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Mới
                  </label>
                  <div class="relative">
                    <EnvelopeIcon
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    />
                    <input
                      v-model="emailForm.new_email"
                      type="email"
                      required
                      :disabled="emailOtpSent"
                      placeholder="Nhập email mới"
                      class="pl-10 w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div v-if="emailOtpSent" class="space-y-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Mã Xác Thực
                    </label>
                    <input
                      v-model="emailForm.otp"
                      type="text"
                      required
                      maxlength="6"
                      class="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                      placeholder="000000"
                    />
                    <p class="text-xs text-gray-500 text-center">
                      Nhập mã 6 chữ số được gửi đến email hiện tại: {{ profileForm.email }}
                    </p>
                  </div>
                </div>

                <div class="pt-2">
                  <button
                    v-if="!emailOtpSent"
                    type="button"
                    @click="requestEmailOtp"
                    :disabled="loading || !emailForm.new_email"
                    class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
                  >
                    Gửi Mã OTP
                  </button>
                  <button
                    v-if="emailOtpSent"
                    type="submit"
                    :disabled="loading || !emailForm.otp || emailForm.otp.length !== 6"
                    class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
                  >
                    Xác Nhận Thay Đổi
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
                  Thay Đổi Mật Khẩu
                </h3>
              </div>

              <form @submit.prevent="submitPasswordReset" class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Email nhận OTP</label
                  >
                  <div class="relative">
                    <EnvelopeIcon
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    />
                    <input
                      v-model="passwordForm.email"
                      type="email"
                      required
                      disabled
                      :disabled="otpSent"
                      class="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-400 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div v-if="otpSent" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Mã xác thực</label
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
                      >Mật Khẩu Mới</label
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
                        placeholder="Nhập mật khẩu mới"
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
                      >Xác nhận mật khẩu mới</label
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
                        placeholder="Xác nhận mật khẩu mới"
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
                    Yêu cầu OTP
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
                    Đổi Mật Khẩu
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
