<script setup>
import { reactive, ref, computed } from 'vue'
import axios from 'axios'
import CardBox from '@/components/admin/CardBox.vue'
import FormField from '@/components/admin/FormField.vue'
import FormControl from '@/components/admin/FormControl.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BaseButtons from '@/components/admin/BaseButtons.vue'
import BaseDivider from '@/components/admin/BaseDivider.vue'
import AvatarUploader from '@/components/user/AvatarUploader.vue'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  MapPinIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'

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

const baseUrl = import.meta.env.VITE_API_BASE_URL
const userData = ref(JSON.parse(localStorage.getItem('userData')) || {})
const token = localStorage.getItem('userToken')

const profileForm = reactive({
  username: userData.value.username || userData.value.data?.username || '',
  email: userData.value.email || userData.value.data?.email || '',
  first_name: userData.value.first_name || userData.value.data?.first_name || '',
  last_name: userData.value.last_name || userData.value.data?.last_name || '',
  phone_number: userData.value.phone_number || userData.value.data?.phone_number || '',
  date_of_birth: userData.value.date_of_birth || userData.value.data?.date_of_birth || '',
  description: userData.value.description || userData.value.data?.description || '',
  avatar: userData.value.avatar || userData.value.data?.avatar || '',
  address: userData.value.address || userData.value.data?.address || '',
  gender: userData.value.gender || userData.value.data?.gender || '',
})

const errors = ref({})
const isSubmittingProfile = ref(false)

const genderOptions = [
  { value: '', label: 'Chọn giới tính' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
]

const currentGenderLabel = computed(() => {
  const option = genderOptions.find((opt) => opt.value === profileForm.gender)
  return option ? option.label : 'Chọn giới tính'
})

const submitProfile = async () => {
  errors.value = {}
  isSubmittingProfile.value = true

  try {
    const formData = { ...profileForm }
    if (typeof formData.gender === 'object' && formData.gender?.value) {
      formData.gender = formData.gender.value
    }

    const res = await axios.put(`${baseUrl}/user/profile`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    })

    localStorage.setItem('userData', JSON.stringify(res.data))
    userData.value = res.data
    if (typeof props.notifySuccess === 'function') {
      props.notifySuccess('Hồ sơ đã được cập nhật thành công!')
    } else {
      console.error('notifySuccess is not a function:', props.notifySuccess)
    }
  } catch (err) {
    console.error('Profile update failed:', err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
      if (typeof props.notifyError === 'function') {
        props.notifyError('Cập nhật hồ sơ thất bại. Vui lòng kiểm tra lại thông tin.')
      } else {
        console.error('notifyError is not a function:', props.notifyError)
      }
    } else {
      errors.value.general = 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.'
      if (typeof props.notifyError === 'function') {
        props.notifyError('Cập nhật hồ sơ thất bại. Vui lòng thử lại.')
      } else {
        console.error('notifyError is not a function:', props.notifyError)
      }
    }
  } finally {
    isSubmittingProfile.value = false
  }
}
</script>

<template>
  <CardBox
    class="shadow-xl bg-gradient-to-br from-white to-slate-50 rounded-xl overflow-hidden border border-slate-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
  >
    <div class="p-8">
      <!-- Header Section -->
      <div class="flex items-start gap-4 mb-8 pb-6 border-b-2 border-blue-100">
        <div
          class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
        >
          <UserCircleIcon class="w-7 h-7 text-white" />
        </div>
        <div class="flex-1">
          <h2
            class="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
          >
            Thông Tin Cá Nhân
          </h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            Cập nhật thông tin cá nhân và chi tiết hồ sơ của bạn
          </p>
        </div>
      </div>

      <form @submit.prevent="submitProfile" class="space-y-8">
        <!-- General Error Alert -->
        <div v-if="errors.general" class="p-4 rounded-xl bg-red-50 border border-red-200">
          <div class="flex items-center gap-3">
            <XCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0" />
            <span class="text-red-700 text-sm">{{ errors.general }}</span>
          </div>
        </div>

        <!-- Avatar Upload Section -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <UserCircleIcon class="w-4 h-4 text-blue-500" />
            Ảnh Đại Diện
          </label>
          <div class="flex justify-center">
            <AvatarUploader
              v-model="profileForm.avatar"
              :notify-error="props.notifyError"
              :notify-success="props.notifySuccess"
            />
          </div>
        </div>

        <BaseDivider />

        <!-- Username Field -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <UserIcon class="w-4 h-4 text-blue-500" />
            Tên Đăng Nhập
            <span class="text-red-500">*</span>
          </label>

          <div class="relative">
            <UserIcon
              class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
            />
            <input
              v-model="profileForm.username"
              type="text"
              class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
              :class="{ 'border-red-300 bg-red-50/50': errors.username }"
              placeholder="Nhập tên đăng nhập của bạn"
              required
            />
          </div>

          <div v-if="errors.username" class="flex items-center gap-2 text-sm text-red-600 mt-2">
            <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ Array.isArray(errors.username) ? errors.username[0] : errors.username }}</span>
          </div>
        </div>

        <!-- Email Field -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <EnvelopeIcon class="w-4 h-4 text-blue-500" />
            Địa Chỉ Email
            <span class="text-red-500">*</span>
          </label>

          <div class="relative">
            <EnvelopeIcon
              class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
            />
            <input
              v-model="profileForm.email"
              type="email"
              class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-100 transition-all duration-300"
              :class="{ 'border-red-300 bg-red-50/50': errors.email }"
              placeholder="Địa chỉ email của bạn"
              disabled
              required
            />
          </div>

          <div v-if="errors.email" class="flex items-center gap-2 text-sm text-red-600 mt-2">
            <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ Array.isArray(errors.email) ? errors.email[0] : errors.email }}</span>
          </div>
        </div>

        <!-- Name Fields Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- First Name -->
          <div class="space-y-3">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <UserIcon class="w-4 h-4 text-blue-500" />
              Tên
              <span class="text-red-500">*</span>
            </label>

            <div class="relative">
              <UserIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="profileForm.first_name"
                type="text"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                :class="{ 'border-red-300 bg-red-50/50': errors.first_name }"
                placeholder="Nhập tên của bạn"
                required
              />
            </div>

            <div v-if="errors.first_name" class="flex items-center gap-2 text-sm text-red-600 mt-2">
              <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
              <span>{{
                Array.isArray(errors.first_name) ? errors.first_name[0] : errors.first_name
              }}</span>
            </div>
          </div>

          <!-- Last Name -->
          <div class="space-y-3">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <UserIcon class="w-4 h-4 text-blue-500" />
              Họ và Tên Đệm
              <span class="text-red-500">*</span>
            </label>

            <div class="relative">
              <UserIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="profileForm.last_name"
                type="text"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                :class="{ 'border-red-300 bg-red-50/50': errors.last_name }"
                placeholder="Nhập họ và tên đệm của bạn"
                required
              />
            </div>

            <div v-if="errors.last_name" class="flex items-center gap-2 text-sm text-red-600 mt-2">
              <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
              <span>{{
                Array.isArray(errors.last_name) ? errors.last_name[0] : errors.last_name
              }}</span>
            </div>
          </div>
        </div>

        <!-- Phone and Date Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Phone Number -->
          <div class="space-y-3">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <PhoneIcon class="w-4 h-4 text-blue-500" />
              Số Điện Thoại
            </label>

            <div class="relative">
              <PhoneIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="profileForm.phone_number"
                type="tel"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                :class="{ 'border-red-300 bg-red-50/50': errors.phone_number }"
                placeholder="Nhập số điện thoại của bạn"
              />
            </div>

            <div
              v-if="errors.phone_number"
              class="flex items-center gap-2 text-sm text-red-600 mt-2"
            >
              <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
              <span>{{
                Array.isArray(errors.phone_number) ? errors.phone_number[0] : errors.phone_number
              }}</span>
            </div>
          </div>

          <!-- Date of Birth -->
          <div class="space-y-3">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CalendarDaysIcon class="w-4 h-4 text-blue-500" />
              Ngày Sinh
            </label>

            <div class="relative">
              <CalendarDaysIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="profileForm.date_of_birth"
                type="date"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                :class="{ 'border-red-300 bg-red-50/50': errors.date_of_birth }"
              />
            </div>

            <div
              v-if="errors.date_of_birth"
              class="flex items-center gap-2 text-sm text-red-600 mt-2"
            >
              <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
              <span>{{
                Array.isArray(errors.date_of_birth) ? errors.date_of_birth[0] : errors.date_of_birth
              }}</span>
            </div>
          </div>
        </div>

        <!-- Gender Field -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <UserIcon class="w-4 h-4 text-blue-500" />
            Giới Tính
          </label>

          <div class="relative">
            <UserIcon
              class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
            />
            <select
              v-model="profileForm.gender"
              class="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300 appearance-none"
              :class="{ 'border-red-300 bg-red-50/50': errors.gender }"
            >
              <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div v-if="errors.gender" class="flex items-center gap-2 text-sm text-red-600 mt-2">
            <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ Array.isArray(errors.gender) ? errors.gender[0] : errors.gender }}</span>
          </div>
        </div>

        <!-- Description Field -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <InformationCircleIcon class="w-4 h-4 text-blue-500" />
            Giới Thiệu Bản Thân
          </label>

          <div class="relative">
            <InformationCircleIcon
              class="absolute left-4 top-4 w-5 h-5 text-gray-400 pointer-events-none z-10"
            />
            <textarea
              v-model="profileForm.description"
              rows="4"
              class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300 resize-none"
              :class="{ 'border-red-300 bg-red-50/50': errors.description }"
              placeholder="Hãy kể cho chúng tôi biết về bạn..."
            ></textarea>
          </div>

          <div v-if="errors.description" class="flex items-center gap-2 text-sm text-red-600 mt-2">
            <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{
              Array.isArray(errors.description) ? errors.description[0] : errors.description
            }}</span>
          </div>
        </div>

        <!-- Address Field -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPinIcon class="w-4 h-4 text-blue-500" />
            Địa Chỉ
          </label>

          <div class="relative">
            <MapPinIcon
              class="absolute left-4 top-4 w-5 h-5 text-gray-400 pointer-events-none z-10"
            />
            <textarea
              v-model="profileForm.address"
              rows="3"
              class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300 resize-none"
              :class="{ 'border-red-300 bg-red-50/50': errors.address }"
              placeholder="Nhập địa chỉ hiện tại của bạn..."
            ></textarea>
          </div>

          <div v-if="errors.address" class="flex items-center gap-2 text-sm text-red-600 mt-2">
            <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ Array.isArray(errors.address) ? errors.address[0] : errors.address }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-8 pt-6 border-t border-gray-100">
          <button
            type="submit"
            :disabled="isSubmittingProfile"
            class="relative w-full sm:w-auto min-w-48 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg overflow-hidden"
          >
            <div class="flex items-center justify-center gap-3 relative z-10">
              <ArrowPathIcon v-if="isSubmittingProfile" class="w-5 h-5 animate-spin" />
              <CheckCircleIcon v-else class="w-5 h-5" />
              <span>{{ isSubmittingProfile ? 'Đang cập nhật...' : 'Cập Nhật Hồ Sơ' }}</span>
            </div>
            <div
              class="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 rounded-xl group-active:opacity-20"
            ></div>
          </button>
        </div>

        <!-- Profile Tips -->
        <div
          class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
        >
          <h4 class="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-3">
            <InformationCircleIcon class="w-4 h-4" />
            Gợi Ý Hồ Sơ
          </h4>
          <ul class="space-y-2 text-sm text-blue-800">
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
              <span>Luôn cập nhật thông tin hồ sơ để có trải nghiệm tốt hơn</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
              <span>Thêm ảnh đại diện để tài khoản của bạn trông cá nhân hóa hơn</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
              <span>Cung cấp thông tin liên lạc chính xác để khôi phục tài khoản</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
              <span>Địa chỉ email không thể thay đổi vì lý do bảo mật</span>
            </li>
          </ul>
        </div>
      </form>
    </div>
  </CardBox>
</template>
