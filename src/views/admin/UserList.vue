<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Quản lý Người dùng" :icon="mdiAccountMultiple" main />
      <p class="mb-4 text-sm text-gray-600">
        Quản lý và theo dõi tất cả người dùng trong hệ thống
      </p>

      <!-- Filters Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Search -->
            <div class="lg:col-span-2">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Tìm kiếm theo username hoặc email..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  @input="debouncedSearch"
                />
              </div>
            </div>

            <!-- Status Filter -->
            <div>
              <select
                v-model="filters.status"
                @change="fetchUsers(1)"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            <!-- Sort By -->
            <div>
              <select
                v-model="filters.sortBy"
                @change="fetchUsers(1)"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="id">Sắp xếp theo ID</option>
                <option value="created_at">Sắp xếp theo ngày tạo</option>
                <option value="username">Sắp xếp theo username</option>
                <option value="email">Sắp xếp theo email</option>
              </select>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button
                @click="toggleSortOrder"
                class="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  v-if="filters.sortOrder === 'asc'"
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 15l7-7 7 7"
                  ></path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <button
                @click="fetchUsers(pagination.current_page)"
                :disabled="loading"
                class="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg
                  class="h-4 w-4"
                  :class="{ 'animate-spin': loading }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="overflow-hidden">
          <!-- Loading State -->
          <div v-if="loading" class="p-6">
            <div class="animate-pulse">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4" v-for="i in 5" :key="i">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <!-- Desktop Table -->
          <div v-else class="hidden md:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Avatar
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ user.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <img
                      :src="user.avatar || '/placeholder.svg?height=40&width=40'"
                      :alt="user.username"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.username }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="relative inline-block">
                      <button
                        @click="toggleDropdown(user.id)"
                        :class="getStatusButtonClass(user.user_status)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
                      >
                        {{ user.user_status }}
                        <svg
                          class="ml-1 h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      <div
                        v-if="activeDropdown === user.id"
                        class="absolute z-10 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200"
                      >
                        <div class="py-1">
                          <button
                            @click="changeUserStatus(user, 'active')"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Active
                          </button>
                          <button
                            @click="changeUserStatus(user, 'inactive')"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Inactive
                          </button>
                          <button
                            @click="changeUserStatus(user, 'banned')"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Banned
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden">
            <div v-for="user in users" :key="user.id" class="border-b border-gray-200 p-4">
              <div class="flex items-center space-x-4">
                <img
                  :src="user.avatar || '/placeholder.svg?height=40&width=40'"
                  :alt="user.username"
                  class="h-12 w-12 rounded-full object-cover"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ user.username }}</p>
                    <span class="text-xs text-gray-500">#{{ user.id }}</span>
                  </div>
                  <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
                  <div class="mt-2 flex items-center justify-between">
                    <div class="relative inline-block">
                      <button
                        @click="toggleDropdown(user.id)"
                        :class="getStatusButtonClass(user.user_status)"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer"
                      >
                        {{ user.user_status }}
                        <svg
                          class="ml-1 h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      <div
                        v-if="activeDropdown === user.id"
                        class="absolute z-10 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200"
                      >
                        <div class="py-1">
                          <button
                            @click="changeUserStatus(user, 'active')"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Active
                          </button>
                          <button
                            @click="changeUserStatus(user, 'inactive')"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Inactive
                          </button>
                          <button
                            @click="changeUserStatus(user, 'banned')"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Banned
                          </button>
                        </div>
                      </div>
                    </div>
                    <span class="text-xs text-gray-500">{{ formatDate(user.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && users.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              ></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Không có người dùng</h3>
            <p class="mt-1 text-sm text-gray-500">
              Không tìm thấy người dùng nào với bộ lọc hiện tại.
            </p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="users.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="goToPage(pagination.current_page - 1)"
                :disabled="!pagination.prev_page_url"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                @click="goToPage(pagination.current_page + 1)"
                :disabled="!pagination.next_page_url"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Hiển thị
                  <span class="font-medium">{{
                    (pagination.current_page - 1) * pagination.per_page + 1
                  }}</span>
                  đến
                  <span class="font-medium">{{
                    Math.min(pagination.current_page * pagination.per_page, pagination.total)
                  }}</span>
                  trong tổng số
                  <span class="font-medium">{{ pagination.total }}</span>
                  kết quả
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="goToPage(pagination.current_page - 1)"
                    :disabled="!pagination.prev_page_url"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>
                  <span
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    Trang {{ pagination.current_page }} / {{ pagination.last_page }}
                  </span>
                  <button
                    @click="goToPage(pagination.current_page + 1)"
                    :disabled="!pagination.next_page_url"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import { mdiAccountMultiple } from '@mdi/js'

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Reactive data
const users = ref([])
const loading = ref(false)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  per_page: 10,
  total: 0,
})
const filters = ref({
  status: '',
  search: '',
  sortBy: 'id',
  sortOrder: 'desc',
})
const activeDropdown = ref(null)
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
// Debounce timer
let searchTimer = null

// Methods
const fetchUsers = async (page = 1) => {
  try {
    loading.value = true
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    let url = `${baseUrl}/users?page=${page}`

    if (filters.value.status) {
      url += `&status=${filters.value.status}`
    }

    if (filters.value.search) {
      url += `&search=${encodeURIComponent(filters.value.search)}`
    }

    url += `&sort=${filters.value.sortBy}&order=${filters.value.sortOrder}`

    const adminToken = localStorage.getItem('adminToken')
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })

    users.value = response.data.data
    pagination.value = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      next_page_url: response.data.links.next,
      prev_page_url: response.data.links.prev,
      per_page: response.data.meta.per_page,
      total: response.data.meta.total,
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error)
    notifyError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchUsers(1)
  }, 500)
}

const toggleSortOrder = () => {
  filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
  fetchUsers(1)
}

const toggleDropdown = (userId) => {
  activeDropdown.value = activeDropdown.value === userId ? null : userId
}

const changeUserStatus = async (user, newStatus) => {
  try {
    // Update UI immediately
    user.user_status = newStatus
    activeDropdown.value = null
    
    notifySuccess(`Trạng thái người dùng đã được cập nhật thành ${newStatus}.`)
    const adminToken = localStorage.getItem('adminToken')
    const baseUrl = import.meta.env.VITE_API_BASE_URL

    await axios.put(
      `${baseUrl}/user/${user.id}/change-status`,
      { user_status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    )
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    // Revert UI change
    fetchUsers(pagination.value.current_page)
    notifyError('Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau.')
  }
}

const goToPage = (page) => {
  fetchUsers(page)
}

const getStatusButtonClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 focus:ring-green-500'
    case 'inactive':
      return 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 focus:ring-gray-500'
    case 'banned':
      return 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 focus:ring-red-500'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeDropdown.value = null
  }
}

// Lifecycle
onMounted(() => {
  fetchUsers()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(searchTimer)
})
</script>
