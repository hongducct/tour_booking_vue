<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { debounce } from 'lodash'
import TravelBookingHongDucCT from '@/components/admin/TravelBookingHongDucCT.vue'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  GlobeAltIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const isScroll = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const openDropdown = ref(false)

const handleScroll = debounce(() => {
  isScroll.value = window.scrollY > 50
}, 100)

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

const logout = () => {
  const currentPath = router.currentRoute.value.path
  if (!['/login', '/register'].includes(currentPath)) {
    localStorage.setItem('redirectAfterLogin', currentPath)
  }
  authStore.logout()
}

const closeAllMenus = () => {
  showUserMenu.value = false
  showMobileMenu.value = false
  openDropdown.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // document.addEventListener('click', (e) => {
  //   if (!e.target.closest('.menu-container')) {
  //     closeAllMenus()
  //   }
  // })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    :class="[
      'w-full z-50 transition-all duration-500 ease-in-out',
      isScroll
        ? 'fixed top-0 bg-white/95 backdrop-blur-md shadow-xl border-b border-slate-200'
        : 'absolute top-0 bg-gradient-to-r from-slate-500/85 to-slate-800/85 backdrop-blur-sm',
    ]"
  >
    <!-- Top Bar -->
    <div
      v-if="!isScroll"
      class="bg-gradient-to-r from-slate-500 to-slate-700 text-white border-b border-white/10"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 text-sm">
        <div class="hidden lg:flex space-x-8 items-center">
          <div
            class="flex items-center gap-2 hover:text-emerald-300 transition-colors duration-300"
          >
            <PhoneIcon class="w-4 h-4" />
            <span class="font-medium">0799076901</span>
          </div>
          <div
            class="flex items-center gap-2 hover:text-emerald-300 transition-colors duration-300"
          >
            <EnvelopeIcon class="w-4 h-4" />
            <a href="mailto:bookingtourvn@hongducct.id.vn" class="font-medium">
              bookingtour@hongducct.id.vn
            </a>
          </div>
          <div
            class="flex items-center gap-2 hover:text-emerald-300 transition-colors duration-300"
          >
            <MapPinIcon class="w-4 h-4" />
            <span class="font-medium">Thang Long University</span>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <a
            href="https://www.facebook.com/hongducct23"
            class="w-8 h-8 bg-slate-500 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <span class="text-white font-bold">f</span>
          </a>
          <button
            class="w-8 h-8 bg-slate-500 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <MagnifyingGlassIcon class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div
      :class="[
        'transition-all duration-500',
        isScroll ? 'bg-white text-gray-800 shadow-sm' : 'bg-white/10 backdrop-blur-sm text-white',
      ]"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <!-- Logo -->
        <router-link to="/" class="flex items-center group" @click="closeAllMenus">
          <div class="relative">
            <TravelBookingHongDucCT
              alt="Travel Booking Logo"
              class="h-12 w-auto lg:h-14 transition-transform duration-300 group-hover:scale-105"
            />
            <!-- Glow effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            ></div>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:block">
          <ul class="flex space-x-8 font-semibold text-sm items-center">
            <li>
              <router-link
                to="/"
                class="relative py-2 px-1 hover:text-teal-600 transition-all duration-300 group"
                :class="isScroll ? 'hover:text-teal-600' : 'hover:text-emerald-300'"
              >
                <span class="relative z-10">TRANG CHỦ</span>
                <div
                  class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"
                ></div>
              </router-link>
            </li>
            <li>
              <router-link
                to="/tour"
                class="relative py-2 px-1 hover:text-blue-500 transition-all duration-300 group"
                :class="isScroll ? 'hover:text-blue-600' : 'hover:text-yellow-300'"
              >
                <span class="relative z-10">TOUR</span>
                <div
                  class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"
                ></div>
              </router-link>
            </li>
            <li
              class="relative menu-container"
              @mouseenter="openDropdown = true"
              @mouseleave="openDropdown = false"
            >
              <button
                class="flex items-center gap-2 py-2 px-1 hover:text-teal-600 transition-all duration-300 group"
                :class="isScroll ? 'hover:text-teal-600' : 'hover:text-emerald-300'"
                @click="toggleDropdown"
              >
                <GlobeAltIcon class="w-4 h-4" />
                <span class="relative z-10">TOUR TRUNG QUỐC</span>
                <ChevronDownIcon
                  class="w-4 h-4 transition-transform duration-300"
                  :class="{ 'rotate-180': openDropdown }"
                />
                <div
                  class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                ></div>
              </button>
              <transition name="dropdown-fade">
                <ul
                  v-show="openDropdown"
                  class="absolute top-full left-0 bg-white text-gray-800 mt-2 py-3 rounded-xl shadow-2xl border border-gray-100 w-56 z-20 overflow-hidden"
                >
                  <li>
                    <router-link
                      to="/destination/bac-kinh"
                      class="flex items-center px-6 py-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:text-teal-700 transition-all duration-200 group"
                    >
                      <span
                        class="w-2 h-2 bg-teal-400 rounded-full mr-3 group-hover:bg-teal-600 transition-colors"
                      ></span>
                      Bắc Kinh
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/destination/thuong-hai"
                      class="flex items-center px-6 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group"
                    >
                      <span
                        class="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-600 transition-colors"
                      ></span>
                      Thượng Hải
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/destination/le-giang"
                      class="flex items-center px-6 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group"
                    >
                      <span
                        class="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-600 transition-colors"
                      ></span>
                      Lệ Giang
                    </router-link>
                  </li>
                </ul>
              </transition>
            </li>
            <li>
              <router-link
                to="/destination"
                class="relative py-2 px-1 hover:text-blue-500 transition-all duration-300 group"
                :class="isScroll ? 'hover:text-blue-600' : 'hover:text-yellow-300'"
              >
                <span class="relative z-10">ĐIỂM ĐẾN</span>
                <div
                  class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                ></div>
              </router-link>
            </li>
            <li>
              <router-link
                to="/blog"
                class="relative py-2 px-1 hover:text-blue-500 transition-all duration-300 group"
                :class="isScroll ? 'hover:text-blue-600' : 'hover:text-yellow-300'"
              >
                <span class="relative z-10">BLOG</span>
                <div
                  class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                ></div>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <div v-if="authStore.isLoading" class="flex items-center space-x-2">
            <div
              class="animate-spin rounded-full h-6 w-6 border-2 border-teal-500 border-t-transparent"
            ></div>
            <span class="text-sm font-medium">Đang tải...</span>
          </div>
          <template v-else>
            <router-link
              to="/wishlist/tours"
              v-if="authStore.isLoggedIn"
              class="hidden lg:flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <HeartIcon class="w-4 h-4" />
              WISH LIST
            </router-link>

            <div class="relative menu-container">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-3 py-2 px-3 rounded-full hover:bg-white/10 transition-all duration-300 group"
                :class="isScroll ? 'hover:bg-gray-100' : 'hover:bg-white/10'"
              >
                <div class="relative">
                  <img
                    v-if="authStore.isLoggedIn"
                    :src="authStore.user.avatar"
                    alt="Avatar"
                    class="w-9 h-9 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-teal-400 transition-all duration-300"
                  />
                  <div
                    v-else
                    class="w-9 h-9 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center ring-2 ring-white/20 group-hover:ring-teal-400 transition-all duration-300"
                  >
                    <UserIcon class="w-5 h-5 text-white" />
                  </div>
                </div>
                <div class="hidden md:flex flex-col items-start">
                  <span v-if="authStore.isLoggedIn" class="text-sm font-semibold">
                    {{ authStore.user.name }}
                  </span>
                  <span v-else class="text-sm font-semibold">Tài khoản</span>
                </div>
                <ChevronDownIcon
                  class="w-4 h-4 transition-transform duration-300"
                  :class="{ 'rotate-180': showUserMenu }"
                />
              </button>

              <transition name="dropdown-fade">
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 top-full mt-2 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 w-56 z-20 overflow-hidden"
                >
                  <div v-if="authStore.isLoggedIn" class="border-b border-gray-100">
                    <router-link
                      to="/profile"
                      class="flex items-center px-6 py-4 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:text-teal-700 transition-all duration-200"
                    >
                      <UserIcon class="w-5 h-5 mr-3" />
                      <div>
                        <div class="font-semibold">Hồ sơ cá nhân</div>
                        <div class="text-xs text-gray-500">Xem thông tin tài khoản</div>
                      </div>
                    </router-link>
                  </div>

                  <div class="py-2">
                    <button
                      v-if="authStore.isLoggedIn"
                      @click="logout"
                      class="w-full flex items-center px-6 py-3 hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-left"
                    >
                      <svg
                        class="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
                      </svg>
                      Đăng xuất
                    </button>

                    <template v-if="!authStore.isLoggedIn">
                      <router-link
                        to="/login"
                        class="flex items-center px-6 py-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:text-teal-700 transition-all duration-200"
                      >
                        <svg
                          class="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          ></path>
                        </svg>
                        Đăng nhập
                      </router-link>
                      <router-link
                        to="/register"
                        class="flex items-center px-6 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-200"
                      >
                        <svg
                          class="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          ></path>
                        </svg>
                        Đăng ký
                      </router-link>
                    </template>
                  </div>
                </div>
              </transition>
            </div>

            <button
              class="lg:hidden p-2 rounded-full hover:bg-white/10 transition-all duration-300"
              :class="isScroll ? 'hover:bg-gray-100' : 'hover:bg-white/10'"
              @click="toggleMobileMenu"
            >
              <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6 transition-transform duration-300" />
              <XMarkIcon v-else class="w-6 h-6 transition-transform duration-300 rotate-90" />
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="mobile-slide">
      <div
        v-if="showMobileMenu"
        class="lg:hidden bg-white/95 backdrop-blur-md text-gray-800 border-t border-gray-200"
      >
        <div class="px-6 py-6 space-y-4 max-h-screen overflow-y-auto">
          <!-- Mobile Navigation Links -->
          <div class="space-y-2">
            <router-link
              to="/"
              class="block py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 font-semibold"
              @click="closeAllMenus"
            >
              TRANG CHỦ
            </router-link>
            <router-link
              to="/tour"
              class="block py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 font-semibold"
              @click="closeAllMenus"
            >
              TOUR
            </router-link>

            <div class="border border-gray-200 rounded-lg">
              <button
                @click="toggleDropdown"
                class="flex items-center justify-between w-full py-3 px-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 font-semibold rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <GlobeAltIcon class="w-5 h-5" />
                  TOUR TRUNG QUỐC
                </div>
                <ChevronDownIcon
                  class="w-5 h-5 transition-transform duration-300"
                  :class="{ 'rotate-180': openDropdown }"
                />
              </button>
              <transition name="mobile-dropdown">
                <div v-show="openDropdown" class="border-t border-gray-200 bg-gray-50">
                  <router-link
                    to="/destination/bac-kinh"
                    class="block py-3 px-8 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    @click="closeAllMenus"
                  >
                    Bắc Kinh
                  </router-link>
                  <router-link
                    to="/destination/thuong-hai"
                    class="block py-3 px-8 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    @click="closeAllMenus"
                  >
                    Thượng Hải
                  </router-link>
                  <router-link
                    to="/destination/le-giang"
                    class="block py-3 px-8 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    @click="closeAllMenus"
                  >
                    Lệ Giang
                  </router-link>
                </div>
              </transition>
            </div>

            <router-link
              to="/destination"
              class="block py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 font-semibold"
              @click="closeAllMenus"
            >
              ĐIỂM ĐẾN
            </router-link>
            <router-link
              to="/blog"
              class="block py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 font-semibold"
              @click="closeAllMenus"
            >
              BLOG
            </router-link>
          </div>

          <!-- Mobile Auth Section -->
          <div class="border-t border-gray-200 pt-4">
            <div v-if="authStore.isLoading" class="flex items-center justify-center py-4">
              <div
                class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mr-2"
              ></div>
              <span class="text-gray-600">Đang tải...</span>
            </div>
            <div v-else class="space-y-2">
              <template v-if="!authStore.isLoggedIn">
                <router-link
                  to="/login"
                  class="block py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-center font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  @click="closeAllMenus"
                >
                  Đăng nhập
                </router-link>
                <router-link
                  to="/register"
                  class="block py-3 px-4 border-2 border-blue-500 text-blue-600 rounded-lg text-center font-semibold hover:bg-blue-50 transition-all duration-200"
                  @click="closeAllMenus"
                >
                  Đăng ký
                </router-link>
              </template>

              <div v-if="authStore.isLoggedIn" class="space-y-2">
                <router-link
                  to="/wishlist/tours"
                  class="flex items-center gap-2 py-3 px-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-200"
                  @click="closeAllMenus"
                >
                  <HeartIcon class="w-5 h-5" />
                  WISH LIST
                </router-link>
                <router-link
                  to="/profile"
                  class="block py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold"
                  @click="closeAllMenus"
                >
                  Hồ sơ cá nhân
                </router-link>
                <button
                  @click="logout"
                  class="w-full text-left py-3 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-semibold"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
/* Dropdown Animations */
.dropdown-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.dropdown-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.95);
}

/* Mobile Menu Animations */
.mobile-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}
.mobile-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.mobile-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

/* Mobile Dropdown */
.mobile-dropdown-enter-active {
  transition: all 0.3s ease;
}
.mobile-dropdown-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
.mobile-dropdown-leave-active {
  transition: all 0.2s ease;
}
.mobile-dropdown-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
}

/* Active Route Styling */
.router-link-active {
  color: #0d9488 !important;
  font-weight: 600;
}

/* Custom scrollbar for mobile menu */
.max-h-screen::-webkit-scrollbar {
  width: 4px;
}
.max-h-screen::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.max-h-screen::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
.max-h-screen::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
