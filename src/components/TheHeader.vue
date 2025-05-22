<template>
  <header
    :class="[
      'w-full z-50 transition-all duration-300',
      isScroll ? 'fixed top-0 bg-gray-800 shadow-md' : 'absolute top-0',
    ]"
  >
    <!-- Top Bar -->
    <div v-if="!isScroll" class="bg-gray-700 text-white border-b border-white/25">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-4 py-2 text-sm">
        <div class="hidden lg:flex space-x-6 items-center">
          <div class="flex items-center gap-1">
            <PhoneIcon class="w-4 h-4" />
            <span>0799076901</span>
          </div>
          <div class="flex items-center gap-1">
            <EnvelopeIcon class="w-4 h-4" />
            <a href="mailto:bookingtourvn@gmail.com">bookingtourvn@hongducct.id.vn</a>
          </div>
          <div class="flex items-center gap-1">
            <MapPinIcon class="w-4 h-4" />
            <span>Thang Long University</span>
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
          <img src="/logo_bookingtour.png" alt="Logo" class="h-10 w-auto lg:h-12" />
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:block">
          <ul class="flex space-x-6 font-semibold uppercase text-sm">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/tour">Tour</router-link></li>
            <li
              class="relative"
              @mouseenter="openDropdown = true"
              @mouseleave="openDropdown = false"
            >
              <button class="flex items-center gap-1" @click="toggleDropdown">
                Tour Trung Quốc
                <ChevronDownIcon
                  class="w-4 h-4 transition-transform duration-300"
                  :class="{ 'rotate-180': openDropdown }"
                />
              </button>
              <transition name="fade">
                <ul
                  v-show="openDropdown"
                  class="absolute bg-white text-black mt-2 p-2 rounded shadow w-40 z-10"
                >
                  <li>
                    <router-link
                      to="/destination/bac-kinh"
                      class="block px-4 py-1 hover:bg-gray-100"
                      >Bắc Kinh</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      to="/destination/thuong-hai"
                      class="block px-4 py-1 hover:bg-gray-100"
                      >Thượng Hải</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      to="/destination/le-giang"
                      class="block px-4 py-1 hover:bg-gray-100"
                      >Lệ Giang</router-link
                    >
                  </li>
                </ul>
              </transition>
            </li>
            <li><router-link to="/destination">Điểm đến</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
          </ul>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <router-link
            to="/wishlist"
            v-if="isLoggedIn"
            class="hidden lg:inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold"
          >
            WISH LIST
          </router-link>

          <!-- User Menu -->
          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-1">
              <img v-if="isLoggedIn" :src="user.avatar" alt="Avatar" class="w-8 h-8 rounded-full" />
              <UserIcon v-else class="w-6 h-6" />
              <span v-if="isLoggedIn" class="hidden md:block">{{ user.name }}</span>
              <ChevronDownIcon class="w-4 h-4" />
            </button>
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 bg-white text-black rounded shadow w-40 z-10"
            >
              <router-link v-if="isLoggedIn" to="/profile" class="block px-4 py-2 hover:bg-gray-100"
                >Hồ sơ</router-link
              >
              <button
                v-if="isLoggedIn"
                @click="logout"
                class="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
              <router-link v-if="!isLoggedIn" to="/login" class="block px-4 py-2 hover:bg-gray-100"
                >Đăng nhập</router-link
              >
              <router-link
                v-if="!isLoggedIn"
                to="/register"
                class="block px-4 py-2 hover:bg-gray-100"
                >Đăng ký</router-link
              >
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button class="lg:hidden" @click="toggleMobileMenu">
            <Bars3Icon
              class="w-6 h-6 transition-transform duration-300"
              :class="{ 'rotate-90': showMobileMenu }"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-fade">
      <div v-if="showMobileMenu" class="lg:hidden bg-gray-900 text-white px-4 py-4 space-y-4">
        <router-link to="/" class="block">Home</router-link>
        <router-link to="/tour" class="block">Tour</router-link>
        <div>
          <button @click="toggleDropdown" class="flex items-center gap-1 w-full">
            Tour Trung Quốc
            <ChevronDownIcon
              class="w-4 h-4 transition-transform duration-300"
              :class="{ 'rotate-180': openDropdown }"
            />
          </button>
          <div v-show="openDropdown" class="mt-2 space-y-1 ml-4">
            <router-link to="/destination/bac-kinh" class="block">Bắc Kinh</router-link>
            <router-link to="/destination/thuong-hai" class="block">Thượng Hải</router-link>
            <router-link to="/destination/le-giang" class="block">Lệ Giang</router-link>
          </div>
        </div>
        <router-link to="/destination" class="block">Điểm đến</router-link>
        <router-link to="/blog" class="block">Blog</router-link>

        <div class="border-t border-white/20 pt-4">
          <router-link v-if="!isLoggedIn" to="/login" class="block mb-2">Đăng nhập</router-link>
          <router-link v-if="!isLoggedIn" to="/register" class="block">Đăng ký</router-link>
          <div v-if="isLoggedIn">
            <router-link to="/profile" class="block mb-2">Hồ sơ</router-link>
            <button @click="logout" class="block text-left w-full">Đăng xuất</button>
          </div>
        </div>
      </div>
    </transition>
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
  Bars3Icon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const isScroll = ref(false)
const showUserMenu = ref(false)
const isLoggedIn = ref(false)
const showMobileMenu = ref(false)
const openDropdown = ref(false)
const user = ref({ name: '', avatar: '' })

const handleScroll = () => {
  isScroll.value = window.scrollY > 80
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  openDropdown.value = false
}

const toggleDropdown = () => {
  openDropdown.value = !openDropdown.value
}

const checkAuth = async () => {
  const token = localStorage.getItem('userToken')
  if (!token) return

  try {
    const res = await axios.get(`${baseUrl}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    user.value = res.data
    isLoggedIn.value = true
  } catch (err) {
    console.error('Auth check failed', err)
    isLoggedIn.value = false
    localStorage.removeItem('userToken')
  }
}

// const logout = async () => {
//   localStorage.removeItem('userToken')
//   isLoggedIn.value = false
//   user.value = null
//   try {
//     await axios.post(
//       `${baseUrl}/user/logout`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
//       },
//     )
//   } catch (err) {
//     console.error('Logout error', err)
//   }
// }

const logout = () => {
  // Lưu đường dẫn hiện tại (trừ trang login/register)
  const currentPath = router.currentRoute.value.path
  if (!['/login', '/register'].includes(currentPath)) {
    localStorage.setItem('redirectAfterLogin', currentPath)
  }

  isLoggedIn.value = false

  // Xóa thông tin user
  localStorage.removeItem('userToken')
  localStorage.removeItem('userData')
  localStorage.removeItem('rememberedLogin')

  // Chuyển hướng tới trang đăng nhập
  // router.push('/login')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  checkAuth()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
}
.fade-leave-active {
  display: none;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-leave-active {
  display: none;
}
</style>
