<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import CardBox from '@/components/admin/CardBox.vue'
import FormField from '@/components/admin/FormField.vue'
import FormControl from '@/components/admin/FormControl.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BaseButtons from '@/components/admin/BaseButtons.vue'
import BaseDivider from '@/components/admin/BaseDivider.vue'
import {
  EnvelopeIcon,
  KeyIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
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

const baseUrl = import.meta.env.VITE_API_BASE_URL

// Form state management
const currentStep = ref(1) // 1: Enter Email, 2: Enter OTP & New Password
const forgotPasswordForm = reactive({
  email: '',
  otp: '',
  password: '',
  password_confirmation: '',
})

const errors = ref({})
const isSubmittingEmail = ref(false)
const isSubmittingPassword = ref(false)
const otpSent = ref(false)
const showPasswords = reactive({
  new: false,
  confirm: false,
})

// Email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(forgotPasswordForm.email)
})

// Password strength calculation
const passwordStrength = computed(() => {
  const password = forgotPasswordForm.password
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

// Password match validation
const passwordsMatch = computed(() => {
  if (!forgotPasswordForm.password || !forgotPasswordForm.password_confirmation) return null
  return forgotPasswordForm.password === forgotPasswordForm.password_confirmation
})

// Toggle password visibility
const togglePasswordVisibility = (field) => {
  showPasswords[field] = !showPasswords[field]
}

// Step 1: Send OTP to email
const sendForgotPasswordOtp = async () => {
  if (!isValidEmail.value) {
    errors.value.email = ['Please enter a valid email address.']
    notifyError('Please enter a valid email address.')
    return
  }

  isSubmittingEmail.value = true
  errors.value = {}

  try {
    await axios.post(`${baseUrl}/auth/forgot-password`, {
      email: forgotPasswordForm.email,
    })

    otpSent.value = true
    currentStep.value = 2
    notifySuccess('Password reset OTP sent to your email!')
  } catch (err) {
    console.error('Failed to send forgot password OTP:', err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
      const errorMessage =
        err.response.data.errors.email?.[0] || 'Failed to send OTP. Please check the errors.'
      notifyError(errorMessage)
    } else if (err.response?.data?.message) {
      errors.value.email = [err.response.data.message]
      notifyError(err.response.data.message)
    } else {
      errors.value.general = 'Failed to send OTP. Please try again.'
      notifyError('Failed to send OTP. Please try again.')
    }
  } finally {
    isSubmittingEmail.value = false
  }
}

// Step 2: Reset password with OTP
const resetPassword = async () => {
  errors.value = {}

  // Validation
  if (!forgotPasswordForm.otp) {
    errors.value.otp = ['OTP is required.']
    notifyError('Please enter the OTP.')
    return
  }

  if (!forgotPasswordForm.password) {
    errors.value.password = ['New password is required.']
    notifyError('Please enter a new password.')
    return
  }

  if (forgotPasswordForm.password !== forgotPasswordForm.password_confirmation) {
    errors.value.password_confirmation = ['New password and confirmation do not match.']
    notifyError('Password confirmation does not match.')
    return
  }

  isSubmittingPassword.value = true

  try {
    await axios.post(`${baseUrl}/auth/reset-password`, {
      email: forgotPasswordForm.email,
      otp: forgotPasswordForm.otp,
      password: forgotPasswordForm.password,
      password_confirmation: forgotPasswordForm.password_confirmation,
    })

    notifySuccess('Password reset successfully! You can now login with your new password.')

    // Reset form
    resetForm()

    // Go back to login or previous page
    goBack()
  } catch (err) {
    console.error('Password reset failed:', err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
      notifyError('Failed to reset password. Please check the errors.')
    } else if (err.response?.data?.message) {
      errors.value.general = err.response.data.message
      notifyError(err.response.data.message)
    } else {
      errors.value.general = 'Failed to reset password. Please try again.'
      notifyError('Failed to reset password. Please try again.')
    }
  } finally {
    isSubmittingPassword.value = false
  }
}

// Reset form data
const resetForm = () => {
  forgotPasswordForm.email = ''
  forgotPasswordForm.otp = ''
  forgotPasswordForm.password = ''
  forgotPasswordForm.password_confirmation = ''
  errors.value = {}
  currentStep.value = 1
  otpSent.value = false
  showPasswords.new = false
  showPasswords.confirm = false
}

// Go back to previous step
const goBackToStep1 = () => {
  currentStep.value = 1
  forgotPasswordForm.otp = ''
  forgotPasswordForm.password = ''
  forgotPasswordForm.password_confirmation = ''
  errors.value = {}
  showPasswords.new = false
  showPasswords.confirm = false
}

const goBack =() => {
  resetForm()
  router.push({ name: 'login' })
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-8 flex items-center justify-center"
  >
    <!-- Background Animation -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse delay-1000"
      ></div>
    </div>

    <div
      class="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md lg:max-w-lg animate-fadeInUp"
    >
      <!-- Header Section -->
      <div class="flex items-start gap-4 mb-8 pb-6 border-b-2 border-purple-100">
        <div
          class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30"
        >
          <LockClosedIcon class="w-7 h-7 text-white" />
        </div>
        <div class="flex-1">
          <h2
            class="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
          >
            {{ currentStep === 1 ? 'Forgot Password' : 'Reset Password' }}
          </h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{
              currentStep === 1
                ? 'Enter your email to receive a password reset code'
                : 'Enter the OTP and set your new password'
            }}
          </p>
        </div>
      </div>

      <!-- Step 1: Enter Email -->
      <div v-if="currentStep === 1">
        <form @submit.prevent="sendForgotPasswordOtp" class="space-y-8">
          <!-- General Error Alert -->
          <div v-if="errors.general" class="p-4 rounded-xl bg-red-50 border border-red-200">
            <div class="flex items-center gap-3">
              <XCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0" />
              <span class="text-red-700 text-sm">{{ errors.general }}</span>
            </div>
          </div>

          <!-- Email Field -->
          <div class="space-y-3">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <EnvelopeIcon class="w-4 h-4 text-purple-500" />
              Email Address
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <EnvelopeIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="forgotPasswordForm.email"
                type="email"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 hover:border-gray-300"
                :class="{
                  'border-red-300 bg-red-50/50': errors.email,
                  'border-green-300 bg-green-50/50': isValidEmail && forgotPasswordForm.email,
                }"
                placeholder="Enter your email address"
                required
                autocomplete="email"
              />
            </div>
            <div v-if="errors.email" class="flex items-center gap-2 text-sm text-red-600 mt-2">
              <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
              <span>{{ errors.email[0] }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-8 pt-6 border-t border-gray-100">
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                @click="goBack"
                class="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-100"
              >
                <ArrowLeftIcon class="w-5 h-5" />
                <span>Back to Login</span>
              </button>
              <button
                type="submit"
                :disabled="isSubmittingEmail || !isValidEmail"
                class="relative flex-1 sm:min-w-48 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg overflow-hidden"
              >
                <div class="flex items-center justify-center gap-3 relative z-10">
                  <ArrowPathIcon v-if="isSubmittingEmail" class="w-5 h-5 animate-spin" />
                  <EnvelopeIcon v-else class="w-5 h-5" />
                  <span>{{ isSubmittingEmail ? 'Sending OTP...' : 'Send Reset Code' }}</span>
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Step 2: Enter OTP and New Password -->
      <div v-else-if="currentStep === 2">
        <form @submit.prevent="resetPassword" class="space-y-8">
          <!-- General Error Alert -->
          <div v-if="errors.general" class="p-4 rounded-xl bg-red-50 border border-red-200">
            <div class="flex items-center gap-3">
              <XCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0" />
              <span class="text-red-700 text-sm">{{ errors.general }}</span>
            </div>
          </div>

          <!-- Email Display -->
          <div class="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div class="flex items-center gap-3 flex-col sm:flex-row text-center sm:text-left">
              <EnvelopeIcon class="w-5 h-5 text-purple-600 mb-2 sm:mb-0" />
              <span class="text-purple-800 font-medium">{{ $t ? $t('Reset code sent to:') : 'Reset code sent to:' }}</span>
              <span class="text-purple-900 font-semibold break-all">{{ forgotPasswordForm.email }}</span>
            </div>
          </div>

          <!-- OTP Field -->
          <div class="space-y-3">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <ShieldCheckIcon class="w-4 h-4 text-purple-500" />
              Verification Code
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <ShieldCheckIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="forgotPasswordForm.otp"
                type="text"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 hover:border-gray-300 text-center text-lg font-mono tracking-widest"
                :class="{ 'border-red-300 bg-red-50/50': errors.otp }"
                placeholder="Enter 6-digit code"
                required
                maxlength="6"
                autocomplete="one-time-code"
              />
            </div>
            <div v-if="errors.otp" class="flex items-center gap-2 text-sm text-red-600 mt-2">
              <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
              <span>{{ errors.otp[0] }}</span>
            </div>
          </div>

          <BaseDivider />

          <!-- New Password Field -->
          <div class="space-y-3">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <KeyIcon class="w-4 h-4 text-purple-500" />
              New Password
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <KeyIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="forgotPasswordForm.password"
                :type="showPasswords.new ? 'text' : 'password'"
                class="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 hover:border-gray-300"
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

            <!-- Password Strength Indicator -->
            <div v-if="forgotPasswordForm.password" class="mt-4 space-y-3">
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
              <ShieldCheckIcon class="w-4 h-4 text-purple-500" />
              Confirm New Password
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <ShieldCheckIcon
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
              />
              <input
                v-model="forgotPasswordForm.password_confirmation"
                :type="showPasswords.confirm ? 'text' : 'password'"
                class="w-full pl-12 pr-20 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 hover:border-gray-300"
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
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                @click="goBackToStep1"
                class="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-100"
              >
                <ArrowLeftIcon class="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                :disabled="isSubmittingPassword || passwordsMatch === false"
                class="relative flex-1 sm:min-w-48 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg overflow-hidden"
              >
                <div class="flex items-center justify-center gap-3 relative z-10">
                  <ArrowPathIcon v-if="isSubmittingPassword" class="w-5 h-5 animate-spin" />
                  <KeyIcon v-else class="w-5 h-5" />
                  <span>{{
                    isSubmittingPassword ? 'Resetting Password...' : 'Reset Password'
                  }}</span>
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Security Tips -->
      <div
        class="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200"
      >
        <h4 class="flex items-center gap-2 text-sm font-semibold text-purple-900 mb-3">
          <InformationCircleIcon class="w-4 h-4" />
          Security Tips
        </h4>
        <ul class="space-y-2 text-sm text-purple-800">
          <li class="flex items-start gap-2">
            <span class="text-purple-500 font-bold mt-1 flex-shrink-0">•</span>
            <span>Use a unique password that you don't use elsewhere</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-purple-500 font-bold mt-1 flex-shrink-0">•</span>
            <span>Include a mix of letters, numbers, and special characters</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-purple-500 font-bold mt-1 flex-shrink-0">•</span>
            <span>Make it at least 8 characters long</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-purple-500 font-bold mt-1 flex-shrink-0">•</span>
            <span>Keep your new password secure and don't share it</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
