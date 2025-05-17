<template>
  <header :class="['w-full z-50 transition-all duration-300', isScroll ? 'fixed top-0 bg-gray-800 shadow-md' : 'absolute top-0']">
    <!-- Top Bar -->
    <div v-if="!isScroll" class="bg-gray-700 text-white border-b border-white/25">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-4 py-2 text-sm">
        <div class="hidden lg:flex space-x-6 items-center">
          <div class="flex items-center gap-1">
            <PhoneIcon class="w-4 h-4" />
            <span>0888 822 368</span>
          </div>
          <div class="flex items-center gap-1">
            <EnvelopeIcon class="w-4 h-4" />
            <a href="mailto:bookingtourvn@gmail.com">bookingtourvn@gmail.com</a>
          </div>
          <div class="flex items-center gap-1">
            <MapPinIcon class="w-4 h-4" />
            <span>173 Thái Hà, Đống Đa, Hà Nội</span>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <a href="#" class="hover:text-blue-400">f</a>
          <button class="hover:text-blue-400">
            <MagnifyingGlassIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="bg-gray-800 text-white">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="/logo_bookingtour.png" alt="Logo" class="h-12 w-auto" />
        </router-link>

        <!-- Navigation -->
        <nav class="hidden lg:block">
          <ul class="flex space-x-6 font-semibold uppercase text-sm">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/tour">Tour</router-link></li>
            <li class="relative group">
              <router-link to="/destination/trung-quoc" class="flex items-center gap-1">
                Tour Trung Quốc <ChevronDownIcon class="w-4 h-4" />
              </router-link>
              <ul class="absolute hidden group-hover:block bg-white text-black mt-2 p-2 rounded shadow">
                <li><router-link to="/destination/bac-kinh" class="block px-4 py-1 hover:bg-gray-100">Bắc Kinh</router-link></li>
                <li><router-link to="/destination/thuong-hai" class="block px-4 py-1 hover:bg-gray-100">Thượng Hải</router-link></li>
                <li><router-link to="/destination/le-giang" class="block px-4 py-1 hover:bg-gray-100">Lệ Giang</router-link></li>
              </ul>
            </li>
            <li><router-link to="/destination">Điểm đến</router-link></li>
            <!-- <li><router-link to="/visa">VISA</router-link></li> -->
            <li><router-link to="/blog">Blog</router-link></li>
          </ul>
        </nav>

        <!-- Booking & User -->
        <div class="flex items-center space-x-4">
          <router-link to="/tour" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold">
            ĐẶT TOUR
          </router-link>

          <!-- User Dropdown -->
          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-1">
              <img v-if="isLoggedIn" :src="user.avatar" alt="Avatar" class="w-8 h-8 rounded-full" />
              <UserIcon v-else class="w-6 h-6" />
              <span v-if="isLoggedIn" class="hidden md:block">{{ user.name }}</span>
              <ChevronDownIcon class="w-4 h-4" />
            </button>

            <div v-if="showUserMenu" class="absolute right-0 mt-2 bg-white text-black rounded shadow w-40">
              <router-link v-if="isLoggedIn" to="/profile" class="block px-4 py-2 hover:bg-gray-100">Hồ sơ</router-link>
              <button v-if="isLoggedIn" @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100">Đăng xuất</button>
              <router-link v-if="!isLoggedIn" to="/login" class="block px-4 py-2 hover:bg-gray-100">Đăng nhập</router-link>
              <router-link v-if="!isLoggedIn" to="/register" class="block px-4 py-2 hover:bg-gray-100">Đăng ký</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const baseUrl = import.meta.env.VITE_API_BASE_URL
// console.log('Base URL:', baseUrl)

const isScroll = ref(false)
const showUserMenu = ref(false)
const isLoggedIn = ref(false)
const user = ref({ name: '', avatar: '' })

const handleScroll = () => {
  isScroll.value = window.scrollY > 80
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Kiểm tra token và lấy user info
const checkAuth = async () => {
  const token = localStorage.getItem('userToken')
  console.log('Token:', token)
  if (!token) {
    // Lưu URL hiện tại trước khi chuyển hướng đến trang đăng nhập
    localStorage.setItem('redirectAfterLogin', route.fullPath)
    // router.push('/login')
    return
  }

  try {
    // console.log('apiLogin:', `${baseUrl}/user/profile`)
    const res = await axios.get(`${baseUrl}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    // console.log('Response:', res)
    user.value = res.data
    isLoggedIn.value = true
    // console.log('User info:', user.value)
  } catch (err) {
    console.error('Auth check failed', err)
    isLoggedIn.value = false
    localStorage.removeItem('userToken')
    // Lưu URL hiện tại trước khi chuyển hướng đến trang đăng nhập
    localStorage.setItem('redirectAfterLogin', route.fullPath)
    // router.push('/login')
  }
}

// Logout
const logout = async () => {
  // Update UI state immediately
  localStorage.removeItem('userToken')
  isLoggedIn.value = false
  user.value = null // Reset user data if applicable

  // Send logout request to backend afterward
  try {
    await axios.post(`${baseUrl}/user/logout`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
    })
  } catch (err) {
    console.error('Logout error', err)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  checkAuth()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
