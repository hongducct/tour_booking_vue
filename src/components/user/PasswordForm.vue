<script setup>
import { reactive, ref, computed } from 'vue'
import axios from 'axios'
import CardBox from '@/components/admin/CardBox.vue'
import FormField from '@/components/admin/FormField.vue'
import FormControl from '@/components/admin/FormControl.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BaseButtons from '@/components/admin/BaseButtons.vue'
import BaseDivider from '@/components/admin/BaseDivider.vue'
import {
  LockClosedIcon,
  KeyIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
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
const token = localStorage.getItem('userToken')

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
  otp: '',
})

const errors = ref({})
const isSubmittingPassword = ref(false)
const isSendingOtp = ref(false)
const otpSent = ref(false)
const showPasswords = reactive({
  current: false,
  new: false,
  confirm: false,
})
const hasPassword = ref(true)

const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${baseUrl}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    hasPassword.value = response.data.has_password
  } catch (err) {
    console.error('Failed to fetch user profile:', err)
  }
}
fetchUserProfile()

const passwordStrength = computed(() => {
  const password = passwordForm.password
  if (!password) return { level: 0, text: '', color: '', checks: {} }

  let score = 0
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  score = Object.values(checks).filter(Boolean).length

  if (score < 2) return { level: 1, text: 'Weak', color: 'bg-red-500', checks }
  if (score < 4) return { level: 2, text: 'Medium', color: 'bg-yellow-500', checks }
  if (score < 5) return { level: 3, text: 'Strong', color: 'bg-blue-500', checks }
  return { level: 4, text: 'Very Strong', color: 'bg-green-500', checks }
})

const passwordsMatch = computed(() => {
  if (!passwordForm.password || !passwordForm.password_confirmation) return null
  return passwordForm.password === passwordForm.password_confirmation
})

const togglePasswordVisibility = (field) => {
  showPasswords[field] = !showPasswords[field]
}

const sendOtp = async () => {
  isSendingOtp.value = true
  errors.value = {}

  try {
    await axios.post(
      `${baseUrl}/user/send-otp`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    otpSent.value = true
    props.notifySuccess('OTP sent to your email!')
  } catch (err) {
    console.error('Failed to send OTP:', err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
      props.notifyError('Failed to send OTP. Please check the errors.')
    } else {
      errors.value.general = 'Failed to send OTP. Please try again.'
      props.notifyError('Failed to send OTP. Please try again.')
    }
  } finally {
    isSendingOtp.value = false
  }
}

const submitPass = async () => {
  errors.value = {}

  if (passwordForm.password !== passwordForm.password_confirmation) {
    errors.value.password_confirmation = ['New password and confirmation do not match.']
    if (typeof props.notifyError === 'function') {
      props.notifyError('Password confirmation does not match.')
    }
    return
  }

  isSubmittingPassword.value = true

  try {
    const payload = {
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation,
    }
    if (!hasPassword.value) {
      payload.otp = passwordForm.otp
    } else {
      payload.current_password = passwordForm.current_password
    }
    console.log('Submitting password change:', payload)
    await axios.put(`${baseUrl}/user/profile`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })

    props.notifySuccess('Password changed successfully!')
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
    passwordForm.otp = ''
    otpSent.value = false
    hasPassword.value = true
  } catch (err) {
    console.error('Password change failed:', err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
      if (typeof props.notifyError === 'function') {
        props.notifyError('Failed to change password. Please check the errors.')
      }
    } else {
      errors.value.general = 'Failed to change password. Please try again.'
      if (typeof props.notifyError === 'function') {
        props.notifyError('Failed to update profile. Please try again.')
      }
    }
  } finally {
    isSubmittingPassword.value = false
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
          <LockClosedIcon class="w-7 h-7 text-white" />
        </div>
        <div class="flex-1">
          <h2
            class="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
          >
            Change Password
          </h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            Update your account password for better security
          </p>
        </div>
      </div>

      <form @submit.prevent="submitPass" class="space-y-8">
        <!-- General Error Alert -->
        <div v-if="errors.general" class="p-4 rounded-xl bg-red-50 border border-red-200">
          <div class="flex items-center gap-3">
            <XCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0" />
            <span class="text-red-700 text-sm">{{ errors.general }}</span>
          </div>
        </div>

        <!-- Current Password Field (for users with password) -->
        <div v-if="hasPassword" class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <ShieldCheckIcon class="w-4 h-4 text-blue-500" />
            Current Password
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="relative">
              <LockClosedIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="passwordForm.current_password"
                :type="showPasswords.current ? 'text' : 'password'"
                class="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                :class="{ 'border-red-300 bg-red-50/50': errors.current_password }"
                placeholder="Enter your current password"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility('current')"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                :title="showPasswords.current ? 'Hide password' : 'Show password'"
              >
                <EyeSlashIcon v-if="showPasswords.current" class="w-5 h-5" />
                <EyeIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div
            v-if="errors.current_password"
            class="flex items-center gap-2 text-sm text-red-600 mt-2"
          >
            <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ errors.current_password[0] }}</span>
          </div>
        </div>

        <!-- Send OTP Button and OTP Field (for users without password) -->
        <div v-else class="space-y-3">
          <button
            type="button"
            @click="sendOtp"
            :disabled="isSendingOtp"
            class="relative w-full sm:w-auto min-w-48 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg overflow-hidden"
          >
            <div class="flex items-center justify-center gap-3 relative z-10">
              <ArrowPathIcon v-if="isSendingOtp" class="w-5 h-5 animate-spin" />
              <ShieldCheckIcon v-else class="w-5 h-5" />
              <span>{{ isSendingOtp ? 'Sending OTP...' : 'Send OTP' }}</span>
            </div>
          </button>

          <!-- OTP Input Field (shown after OTP is sent) -->
          <div v-if="otpSent" class="space-y-3 mt-4">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <ShieldCheckIcon class="w-4 h-4 text-blue-500" />
              OTP
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="passwordForm.otp"
                type="text"
                class="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                :class="{ 'border-red-300 bg-red-50/50': errors.otp }"
                placeholder="Enter OTP sent to your email"
                required
                autocomplete="one-time-code"
              />
            </div>
            <div v-if="errors.otp" class="flex items-center gap-2 text-sm text-red-600 mt-2">
              <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
              <span>{{ errors.otp[0] }}</span>
            </div>
          </div>
        </div>

        <BaseDivider />

        <!-- New Password Field -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <KeyIcon class="w-4 h-4 text-blue-500" />
            New Password
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="relative">
              <KeyIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="passwordForm.password"
                :type="showPasswords.new ? 'text' : 'password'"
                class="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                :class="{ 'border-red-300 bg-red-50/50': errors.password }"
                placeholder="Enter new password (min 8 characters)"
                required
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility('new')"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                :title="showPasswords.new ? 'Hide password' : 'Show password'"
              >
                <EyeSlashIcon v-if="showPasswords.new" class="w-5 h-5" />
                <EyeIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
          <!-- Password Strength Indicator -->
          <div v-if="passwordForm.password" class="mt-4 space-y-3">
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="passwordStrength.color"
                :style="{ width: `${(passwordStrength.level / 4) * 100}%` }"
              ></div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span class="text-sm font-medium text-gray-700">{{ passwordStrength.text }}</span>
              <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2 text-xs">
                <div
                  class="flex items-center gap-1 transition-colors"
                  :class="{
                    'text-green-600': passwordStrength.checks?.length,
                    'text-gray-500': !passwordStrength.checks?.length,
                  }"
                >
                  <CheckCircleIcon v-if="passwordStrength.checks?.length" class="w-3 h-3" />
                  <XCircleIcon v-else class="w-3 h-3" />
                  <span>8+ chars</span>
                </div>
                <div
                  class="flex items-center gap-1 transition-colors"
                  :class="{
                    'text-green-600': passwordStrength.checks?.uppercase,
                    'text-gray-500': !passwordStrength.checks?.uppercase,
                  }"
                >
                  <CheckCircleIcon v-if="passwordStrength.checks?.uppercase" class="w-3 h-3" />
                  <XCircleIcon v-else class="w-3 h-3" />
                  <span>Uppercase</span>
                </div>
                <div
                  class="flex items-center gap-1 transition-colors"
                  :class="{
                    'text-green-600': passwordStrength.checks?.lowercase,
                    'text-gray-500': !passwordStrength.checks?.lowercase,
                  }"
                >
                  <CheckCircleIcon v-if="passwordStrength.checks?.lowercase" class="w-3 h-3" />
                  <XCircleIcon v-else class="w-3 h-3" />
                  <span>Lowercase</span>
                </div>
                <div
                  class="flex items-center gap-1 transition-colors"
                  :class="{
                    'text-green-600': passwordStrength.checks?.numbers,
                    'text-gray-500': !passwordStrength.checks?.numbers,
                  }"
                >
                  <CheckCircleIcon v-if="passwordStrength.checks?.numbers" class="w-3 h-3" />
                  <XCircleIcon v-else class="w-3 h-3" />
                  <span>Number</span>
                </div>
                <div
                  class="flex items-center gap-1 transition-colors"
                  :class="{
                    'text-green-600': passwordStrength.checks?.special,
                    'text-gray-500': !passwordStrength.checks?.special,
                  }"
                >
                  <CheckCircleIcon v-if="passwordStrength.checks?.special" class="w-3 h-3" />
                  <XCircleIcon v-else class="w-3 h-3" />
                  <span>Special</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="errors.password" class="flex items-center gap-2 text-sm text-red-600 mt-2">
            <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ errors.password[0] }}</span>
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <ShieldCheckIcon class="w-4 h-4 text-blue-500" />
            Confirm New Password
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="relative">
              <ShieldCheckIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="passwordForm.password_confirmation"
                :type="showPasswords.confirm ? 'text' : 'password'"
                class="w-full pl-12 pr-20 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                :class="{
                  'border-red-300 bg-red-50/50': errors.password_confirmation,
                  'border-green-300 bg-green-50/50': passwordsMatch === true,
                  'border-yellow-300 bg-yellow-50/50': passwordsMatch === false,
                }"
                placeholder="Confirm your new password"
                required
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility('confirm')"
                class="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                :title="showPasswords.confirm ? 'Hide password' : 'Show password'"
              >
                <EyeSlashIcon v-if="showPasswords.confirm" class="w-5 h-5" />
                <EyeIcon v-else class="w-5 h-5" />
              </button>
              <div
                v-if="passwordsMatch !== null"
                class="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <CheckCircleIcon v-if="passwordsMatch" class="w-5 h-5 text-green-500" />
                <XCircleIcon v-else class="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>
          <div v-if="passwordsMatch !== null" class="mt-2">
            <div v-if="passwordsMatch" class="flex items-center gap-2 text-sm text-green-600">
              <CheckCircleIcon class="w-4 h-4" />
              <span>Passwords match</span>
            </div>
            <div v-else class="flex items-center gap-2 text-sm text-red-600">
              <XCircleIcon class="w-4 h-4" />
              <span>Passwords do not match</span>
            </div>
          </div>
          <div
            v-if="errors.password_confirmation"
            class="flex items-center gap-2 text-sm text-red-600 mt-2"
          >
            <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ errors.password_confirmation[0] }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-8 pt-6 border-t border-gray-100">
          <button
            type="submit"
            :disabled="
              isSubmittingPassword || passwordsMatch === false || (!hasPassword && !otpSent)
            "
            class="relative w-full sm:w-auto min-w-48 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg overflow-hidden"
          >
            <div class="flex items-center justify-center gap-3 relative z-10">
              <ArrowPathIcon v-if="isSubmittingPassword" class="w-5 h-5 animate-spin" />
              <ShieldCheckIcon v-else class="w-5 h-5" />
              <span>{{ isSubmittingPassword ? 'Changing Password...' : 'Change Password' }}</span>
            </div>
            <div
              class="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 rounded-xl group-active:opacity-20"
            ></div>
          </button>
        </div>

        <!-- Security Tips -->
        <div
          class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
        >
          <h4 class="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-3">
            <InformationCircleIcon class="w-4 h-4" />
            Security Tips
          </h4>
          <ul class="space-y-2 text-sm text-blue-800">
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
              <span>Use a unique password that you don't use elsewhere</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
              <span>Include a mix of letters, numbers, and special characters</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
              <span>Make it at least 8 characters long</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold mt-1 flex-shrink-0">•</span>
              <span>Avoid using personal information like names or dates</span>
            </li>
          </ul>
        </div>
      </form>
    </div>
  </CardBox>
</template>
