<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-200">
              Quản lý Đặt chỗ
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Quản lý và theo dõi tất cả các đặt chỗ
            </p>
          </div>
          <div class="flex items-center gap-3">
            <BaseButton
              label="Làm mới"
              color="info"
              @click="fetchBookings"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <BookingLoadingSkeleton v-if="isLoading" :count="perPage" />

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          class="bg-white dark:bg-gray-500 rounded-xl p-6 shadow-sm border border-gray-400 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <svg
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng đặt chỗ</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-200">
                {{ bookings.length }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-500 rounded-xl p-6 shadow-sm border border-gray-400 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Đã xác nhận</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-200">
                {{ confirmedCount }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-500 rounded-xl p-6 shadow-sm border border-gray-400 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <ClockIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Chờ xác nhận</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-200">{{ pendingCount }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-500 rounded-xl p-6 shadow-sm border border-gray-400 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex items-center">
            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <XCircleIcon class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Đã hủy</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-200">
                {{ cancelledCount }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Cards Grid -->
      <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          :class="{
            'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900':
              selectedBooking && selectedBooking.id === booking.id,
          }"
          class="bg-white dark:bg-gray-500 rounded-xl shadow-xl border border-gray-400 dark:border-gray-700 hover:shadow-xl/30 transition-all duration-300 overflow-hidden group"
        >
          <!-- Card Header -->
          <div class="p-4 lg:p-5">
            <!-- Booking ID and Status Row -->
            <div class="flex items-start justify-between mb-3">
              <h3 class="font-bold text-lg text-gray-900 dark:text-gray-200">#{{ booking.id }}</h3>
              <span
                :class="statusClass(booking.status)"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              >
                {{ statusText(booking.status) }}
              </span>
            </div>

            <!-- Created Date -->
            <div class="mb-4">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {{ formatDate(booking.created_at) }}
              </span>
            </div>

            <!-- User and Location Info -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                <UserIcon class="w-4 h-4 mr-2 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                <span class="truncate font-medium">
                  {{ booking.user.first_name }} {{ booking.user.last_name }}
                </span>
              </div>
              <div class="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                <MapPinIcon class="w-4 h-4 mr-2 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                <span class="truncate">{{ booking.bookable.name }}</span>
              </div>
            </div>

            <!-- Booking Details -->
            <div class="space-y-3 mb-4">
              <div class="grid grid-cols-1 gap-2">
                <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <CalendarIcon
                    class="w-4 h-4 mr-2 text-green-500 dark:text-green-400 flex-shrink-0"
                  />
                  <span class="font-medium">{{ formatDate(booking.start_date) }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <CalendarIcon class="w-4 h-4 mr-2 text-red-500 dark:text-red-400 flex-shrink-0" />
                  <span class="font-medium">{{ formatDate(booking.end_date) }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center text-gray-700 dark:text-gray-300">
                  <UserGroupIcon
                    class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0"
                  />
                  <span class="font-medium">
                    {{ booking.number_of_guests_adults + booking.number_of_children }} khách
                  </span>
                </div>
                <div class="font-bold text-lg text-gray-900 dark:text-gray-200">
                  {{ formatCurrency(booking.total_price) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div
            class="px-4 lg:px-5 py-4 bg-gray-100 dark:bg-gray-600/50 border-t border-gray-400 dark:border-gray-600"
          >
            <!-- Action Buttons Row -->
            <div class="grid grid-cols-3 gap-2 mb-3">
              <button
                @click="viewBookingDetails(booking)"
                class="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200"
              >
                <EyeIcon class="w-3.5 h-3.5" />
                <span class="hidden sm:inline">Chi tiết</span>
              </button>
              <button
                @click="editBooking(booking.id)"
                class="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition-colors duration-200"
              >
                <PencilSquareIcon class="w-3.5 h-3.5" />
                <span class="hidden sm:inline">Sửa</span>
              </button>
              <button
                @click="deleteBooking(booking.id)"
                class="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors duration-200"
              >
                <TrashIcon class="w-3.5 h-3.5" />
                <span class="hidden sm:inline">Xóa</span>
              </button>
            </div>

            <!-- Status Selector -->
            <div class="w-full">
              <select
                v-model="booking.status"
                @change="updateBookingStatus(booking.id, booking.status)"
                class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="bookings.length === 0" class="text-center py-12">
        <ClipboardIcon class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
          Chưa có đặt chỗ nào
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Các đặt chỗ sẽ hiển thị ở đây khi có.
        </p>
      </div>
    </SectionMain>

    <!-- Modal for Booking Details -->
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedBooking"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <Transition
          enter-active-class="duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            class="bg-white dark:bg-gray-500 rounded-2xl shadow-2xl w-full max-w-4xl max-h-full overflow-hidden"
          >
            <!-- Modal Header -->
            <div
              class="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4 text-white"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-bold">Chi tiết Đặt chỗ #{{ selectedBooking.id }}</h2>
                  <p class="text-blue-100 dark:text-blue-200 text-sm mt-1">
                    Thông tin chi tiết về đặt chỗ
                  </p>
                </div>
                <button
                  @click="closeModal"
                  class="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div class="p-6 space-y-8">
                <!-- General Information -->
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center"
                  >
                    <InformationCircleIcon class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Thông tin Chung
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">ID Đặt chỗ</div>
                      <div class="font-semibold text-gray-900 dark:text-gray-200">
                        #{{ selectedBooking.id }}
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Trạng thái</div>
                      <span
                        :class="statusClass(selectedBooking.status)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ statusText(selectedBooking.status) }}
                      </span>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng giá</div>
                      <div class="font-bold text-lg text-gray-900 dark:text-gray-200">
                        {{ formatCurrency(selectedBooking.total_price) }}
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Ngày bắt đầu</div>
                      <div class="font-semibold text-gray-900 dark:text-gray-200">
                        {{ formatDate(selectedBooking.start_date) }}
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Ngày kết thúc</div>
                      <div class="font-semibold text-gray-900 dark:text-gray-200">
                        {{ formatDate(selectedBooking.end_date) }}
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Số ngày</div>
                      <div class="font-semibold text-gray-900 dark:text-gray-200">
                        {{ calculateDays(selectedBooking.start_date, selectedBooking.end_date) }}
                        ngày
                      </div>
                    </div>
                  </div>
                </div>

                <!-- User Information -->
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center"
                  >
                    <UserIcon class="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Thông tin Khách hàng
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Họ và tên</div>
                      <div class="font-semibold text-gray-900 dark:text-gray-200">
                        {{ selectedBooking.user.first_name }} {{ selectedBooking.user.last_name }}
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</div>
                      <div class="font-semibold text-gray-900 dark:text-gray-200">
                        {{ selectedBooking.user.email }}
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Số điện thoại</div>
                      <div class="font-semibold text-gray-900 dark:text-gray-200">
                        {{ selectedBooking.contact_phone }}
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Địa chỉ</div>
                      <div class="font-semibold text-gray-900 dark:text-gray-200">
                        {{ selectedBooking.user.address }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tour Information -->
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center"
                  >
                    <MapPinIcon class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Thông tin Tour
                  </h3>
                  <div
                    class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-400 dark:border-gray-600"
                  >
                    <div class="mb-4">
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Tên Tour</div>
                      <div class="font-semibold text-lg text-gray-900 dark:text-gray-200">
                        {{ selectedBooking.bookable.name }}
                      </div>
                    </div>
                    <div>
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Mô tả</div>
                      <div class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {{ selectedBooking.bookable.description }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Guest Information -->
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center"
                  >
                    <UserGroupIcon class="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                    Thông tin Khách
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Người lớn</div>
                      <div class="font-semibold text-2xl text-gray-900 dark:text-gray-200">
                        {{ selectedBooking.number_of_guests_adults }}
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Trẻ em</div>
                      <div class="font-semibold text-2xl text-gray-900 dark:text-gray-200">
                        {{ selectedBooking.number_of_children }}
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-400 dark:border-gray-600"
                    >
                      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng khách</div>
                      <div class="font-semibold text-2xl text-gray-900 dark:text-gray-200">
                        {{
                          selectedBooking.number_of_guests_adults +
                          selectedBooking.number_of_children
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div
              class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-400 dark:border-gray-600 flex justify-end"
            >
              <button
                @click="closeModal"
                class="px-6 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BookingLoadingSkeleton from '@/components/admin/booking/BookingLoadingSkeleton.vue'

import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDoubleDownIcon,
  CheckIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClipboardIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const adminToken = localStorage.getItem('adminToken')
const bookings = ref([])
const selectedBooking = ref(null)
const isLoading = ref(false)

// Computed properties for statistics
const confirmedCount = computed(() => bookings.value.filter((b) => b.status === 'confirmed').length)
const pendingCount = computed(() => bookings.value.filter((b) => b.status === 'pending').length)
const cancelledCount = computed(() => bookings.value.filter((b) => b.status === 'cancelled').length)

const fetchBookings = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${baseUrl}/bookings`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
    bookings.value = response.data
    isLoading.value = false
  } catch (error) {
    console.error('Lỗi khi tải danh sách đặt chỗ:', error)
  }
}

const viewBookingDetails = (booking) => {
  selectedBooking.value = booking
}

const closeModal = () => {
  selectedBooking.value = null
}

const editBooking = (id) => {
  alert(`Chức năng sửa đặt chỗ với ID ${id} chưa được triển khai.`)
}

const deleteBooking = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xoá đặt chỗ này?')) {
    try {
      await axios.delete(`${baseUrl}/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      bookings.value = bookings.value.filter((booking) => booking.id !== id)
      alert('Xoá thành công!')
    } catch (error) {
      console.error('Lỗi khi xoá đặt chỗ:', error)
    }
  }
}

const updateBookingStatus = async (id, newStatus) => {
  try {
    await axios.patch(
      `${baseUrl}/bookings/${id}/status`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    )
    const index = bookings.value.findIndex((b) => b.id === id)
    if (index !== -1) {
      bookings.value[index].status = newStatus
    }
    alert(`Đã cập nhật trạng thái đặt chỗ #${id} thành ${newStatus}`)
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đặt chỗ:', error)
    fetchBookings()
  }
}

const statusClass = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

const statusText = (status) => {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận'
    case 'pending':
      return 'Chờ xác nhận'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return 'Không xác định'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

const formatCurrency = (amount) => {
  if (!amount) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

onMounted(fetchBookings)
</script>

<style scoped>
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .xl\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .xl\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1536px) {
  .\32xl\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Card hover animations */
.group:hover {
  transform: translateY(-2px);
}

/* Status badge animations */
.inline-flex {
  transition: all 0.2s ease-in-out;
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
}

/* Backdrop blur for better modal visibility */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Enhanced focus states for accessibility */
select:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow,
    transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
