<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  CalendarDaysIcon,
  HeartIcon,
  Cog6ToothIcon,
  BellIcon,
  CreditCardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/vue/24/outline'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const isOpen = ref(false)
const isWishlistOpen = ref(false) // State for wishlist dropdown

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
  isWishlistOpen.value = false // Close dropdown when sidebar closes
}

const toggleWishlistDropdown = () => {
  isWishlistOpen.value = !isWishlistOpen.value
}

// Close sidebar when clicking outside on mobile
const handleClickOutside = (event) => {
  if (isOpen.value && !event.target.closest('.sidebar-container')) {
    closeSidebar()
  }
}

// Handle escape key
const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeSidebar()
  }
}

onMounted(() => {
  // document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})

const menuItems = [
  {
    name: 'Hồ sơ cá nhân',
    route: '/profile',
    icon: UserIcon,
    description: 'Quản lý thông tin cá nhân',
  },
  {
    name: 'Lịch sử đặt tour',
    route: '/bookings',
    icon: CalendarDaysIcon,
    description: 'Xem các chuyến đi đã đặt',
  },
  // đánh giá của tôi
  // {
  //   name: 'Đánh giá của tôi',
  //   route: '/reviews',
  //   icon: StarIcon,
  //   description: 'Xem và quản lý đánh giá của bạn',
  // },
  {
    name: 'Danh sách yêu thích',
    icon: HeartIcon,
    description: 'Tour và blog yêu thích của bạn',
    subItems: [
      {
        name: 'Tour yêu thích',
        route: '/wishlist/tours',
        description: 'Danh sách các tour bạn yêu thích',
      },
      {
        name: 'Blog yêu thích',
        route: '/wishlist/blogs',
        description: 'Danh sách các blog bạn yêu thích',
      },
    ],
  },
  // {
  //   name: 'Cài đặt',
  //   route: '/settings',
  //   icon: Cog6ToothIcon,
  //   description: 'Tùy chỉnh tài khoản',
  // },
]

const handleNavigation = (route) => {
  router.push(route)
  closeSidebar()
}

const handleLogout = () => {
  console.log('Logging out...')
  closeSidebar()
}
</script>

<template>
  <div>
    <!-- Mobile menu button -->
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-20 left-2 z-50 p-3 bg-white shadow-lg text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
      aria-label="Toggle menu"
    >
      <Bars3Icon v-if="!isOpen" class="w-6 h-6" />
      <XMarkIcon v-else class="w-6 h-6" />
    </button>

    <!-- Sidebar -->
    <div
      class="sidebar-container fixed top-[6.75rem] left-0 h-[calc(100vh-6.75rem)] z-40 transition-all duration-300 ease-in-out lg:translate-x-0"
      :class="{ 'translate-x-0': isOpen, '-translate-x-full': !isOpen }"
    >
      <div
        class="w-80 bg-gradient-to-br from-slate-50 to-blue-50 h-full shadow-2xl lg:shadow-lg border-r border-gray-200 flex flex-col"
      >
        <!-- Header Section -->
        <div class="p-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <UserIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">Tài khoản của tôi</h2>
              <p class="text-sm text-gray-600">Quản lý thông tin cá nhân</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="px-4 py-6 flex-1 overflow-y-auto">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.route || item.name">
              <!-- Parent Menu Item -->
              <button
                v-if="item.subItems"
                @click="toggleWishlistDropdown"
                class="w-full group flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                :class="
                  $route.path.includes('/wishlist')
                    ? 'bg-white shadow-md border-l-4 border-blue-500'
                    : 'hover:bg-white/70'
                "
              >
                <component
                  :is="item.icon"
                  class="w-5 h-5 mr-4 transition-colors duration-200"
                  :class="
                    $route.path.includes('/wishlist')
                      ? 'text-blue-600'
                      : 'text-gray-500 group-hover:text-blue-600'
                  "
                />
                <div class="flex-1">
                  <p
                    class="font-medium transition-colors duration-200"
                    :class="
                      $route.path.includes('/wishlist')
                        ? 'text-blue-900'
                        : 'text-gray-700 group-hover:text-gray-900'
                    "
                  >
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ item.description }}</p>
                </div>
                <component
                  :is="isWishlistOpen ? ChevronUpIcon : ChevronDownIcon"
                  class="w-5 h-5 text-gray-500 group-hover:text-blue-600"
                />
              </button>
              <button
                v-else
                @click="handleNavigation(item.route)"
                class="w-full group flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                :class="
                  $route.path === item.route
                    ? 'bg-white shadow-md border-l-4 border-blue-500'
                    : 'hover:bg-white/70'
                "
              >
                <component
                  :is="item.icon"
                  class="w-5 h-5 mr-4 transition-colors duration-200"
                  :class="
                    $route.path === item.route
                      ? 'text-blue-600'
                      : 'text-gray-500 group-hover:text-blue-600'
                  "
                />
                <div class="flex-1">
                  <p
                    class="font-medium transition-colors duration-200"
                    :class="
                      $route.path === item.route
                        ? 'text-blue-900'
                        : 'text-gray-700 group-hover:text-gray-900'
                    "
                  >
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ item.description }}</p>
                </div>
                <div
                  v-if="$route.path === item.route"
                  class="w-2 h-2 bg-blue-500 rounded-full"
                ></div>
              </button>

              <!-- Submenu for Wishlist -->
              <ul v-if="item.subItems && isWishlistOpen" class="pl-8 space-y-2 mt-2">
                <li v-for="subItem in item.subItems" :key="subItem.route">
                  <button
                    @click="handleNavigation(subItem.route)"
                    class="w-full group flex items-center px-4 py-2 text-left rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm"
                    :class="
                      $route.path === subItem.route
                        ? 'bg-white shadow-sm border-l-2 border-blue-400'
                        : 'hover:bg-white/50'
                    "
                  >
                    <div class="flex-1">
                      <p
                        class="text-sm font-medium transition-colors duration-200"
                        :class="
                          $route.path === subItem.route
                            ? 'text-blue-800'
                            : 'text-gray-600 group-hover:text-gray-900'
                        "
                      >
                        {{ subItem.name }}
                      </p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ subItem.description }}</p>
                    </div>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        <!-- Logout Button -->
        <div class="p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <button
            @click="handleLogout"
            class="w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 hover:bg-red-50 hover:shadow-md group active:scale-[0.98]"
          >
            <ArrowRightOnRectangleIcon
              class="w-5 h-5 mr-4 text-gray-500 group-hover:text-red-600 transition-colors duration-200"
            />
            <span
              class="font-medium text-gray-700 group-hover:text-red-700 transition-colors duration-200"
            >
              Đăng xuất
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div
      v-if="isOpen"
      class="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
      @click="closeSidebar"
      aria-hidden="true"
    ></div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for webkit browsers */
.sidebar-container::-webkit-scrollbar {
  width: 4px;
}

.sidebar-container::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-container::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.sidebar-container::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Smooth transitions */
@media (prefers-reduced-motion: reduce) {
  .sidebar-container,
  .sidebar-container * {
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles for accessibility */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Animation for mobile overlay */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.lg\:hidden.fixed.inset-0 {
  animation: fadeIn 0.3s ease-out;
}
</style>
