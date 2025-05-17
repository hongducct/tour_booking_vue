<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Quản lý Đặt chỗ" icon="mdiViewList" main>
        <BaseButton label="Làm mới" color="info" @click="fetchBookings" />
      </SectionTitleLineWithButton>

      <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CardBox
          v-for="booking in bookings"
          :key="booking.id"
          :class="{
            'border-2 border-blue-500': selectedBooking && selectedBooking.id === booking.id,
          }"
        >
          <div class="flex items-start justify-between">
            <div>
              <h2 class="font-semibold text-xl text-gray-800 mb-2">#{{ booking.id }}</h2>
              <p class="text-gray-600 text-sm">
                {{ booking.user.first_name }} {{ booking.user.last_name }}
              </p>
              <p class="text-gray-600 text-sm">
                {{ booking.bookable.name }}
              </p>
            </div>
            <span
              :class="statusClass(booking.status)"
              class="font-semibold text-sm rounded-full px-3 py-1"
            >
              {{ booking.status }}
            </span>
          </div>

          <div class="mt-3 text-gray-700">
            <p class="mb-1"><i class="mdi mdi-calendar-start mr-1"></i> {{ booking.start_date }}</p>
            <p class="mb-1"><i class="mdi mdi-calendar-end mr-1"></i> {{ booking.end_date }}</p>
            <p class="mb-1">
              <i class="mdi mdi-account-group mr-1"></i> Người lớn:
              {{ booking.number_of_guests_adults }}, Trẻ em: {{ booking.number_of_children }}
            </p>
            <p class="font-semibold">
              <i class="mdi mdi-currency-usd mr-1"></i> {{ booking.total_price }}
            </p>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <BaseButtons>
              <BaseButton color="info" label="Chi tiết" @click="viewBookingDetails(booking)" />
              <BaseButton color="warning" label="Sửa" @click="editBooking(booking.id)" />
              <BaseButton color="danger" label="Xoá" @click="deleteBooking(booking.id)" />
            </BaseButtons>
            <select
              v-model="booking.status"
              @change="updateBookingStatus(booking.id, booking.status)"
              class="border rounded-md py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </CardBox>
      </div>
    </SectionMain>

    <transition name="fade">
      <div
        v-if="selectedBooking"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl relative overflow-hidden">
          <div class="bg-gray-100 py-4 px-6 border-b">
            <h2 class="text-xl font-semibold text-gray-800">
              Chi tiết Đặt chỗ #{{ selectedBooking.id }}
            </h2>
            <button
              class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              @click="closeModal"
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div class="p-6">
            <h3 class="font-semibold text-lg text-gray-700 mb-3">Thông tin Chung</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><strong class="text-gray-600">ID:</strong> {{ selectedBooking.id }}</div>
              <div>
                <strong class="text-gray-600">Trạng thái:</strong>
                <span :class="statusClass(selectedBooking.status)">{{
                  selectedBooking.status
                }}</span>
              </div>
              <div>
                <strong class="text-gray-600">Ngày bắt đầu:</strong>
                {{ selectedBooking.start_date }}
              </div>
              <div>
                <strong class="text-gray-600">Ngày kết thúc:</strong> {{ selectedBooking.end_date }}
              </div>
              <div>
                <strong class="text-gray-600">Tổng giá:</strong> {{ selectedBooking.total_price }}
              </div>
            </div>

            <h3 class="font-semibold text-lg text-gray-700 mb-3">Thông tin Người dùng</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong class="text-gray-600">Tên:</strong> {{ selectedBooking.user.first_name }}
                {{ selectedBooking.user.last_name }}
              </div>
              <div>
                <strong class="text-gray-600">Email:</strong> {{ selectedBooking.user.email }}
              </div>
              <div>
                <strong class="text-gray-600">Điện thoại:</strong>
                {{ selectedBooking.user.phone_number }}
              </div>
              <div>
                <strong class="text-gray-600">Địa chỉ:</strong> {{ selectedBooking.user.address }}
              </div>
            </div>

            <h3 class="font-semibold text-lg text-gray-700 mb-3">Thông tin Tour</h3>
            <div class="mb-4">
              <div>
                <strong class="text-gray-600">Tên Tour:</strong> {{ selectedBooking.bookable.name }}
              </div>
              <div>
                <strong class="text-gray-600">Mô tả:</strong>
                {{ selectedBooking.bookable.description }}
              </div>
            </div>

            <h3 class="font-semibold text-lg text-gray-700 mb-3">Số lượng khách</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong class="text-gray-600">Người lớn:</strong>
                {{ selectedBooking.number_of_guests_adults }}
              </div>
              <div>
                <strong class="text-gray-600">Trẻ em:</strong>
                {{ selectedBooking.number_of_children }}
              </div>
            </div>
          </div>
          <div class="bg-gray-100 py-3 px-6 border-t flex justify-end">
            <BaseButton label="Đóng" @click="closeModal" />
          </div>
        </div>
      </div>
    </transition>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BaseButtons from '@/components/admin/BaseButtons.vue'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const adminToken = localStorage.getItem('adminToken')
const bookings = ref([])
const selectedBooking = ref(null)

const fetchBookings = async () => {
  try {
    const response = await axios.get(`${baseUrl}/bookings`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
    bookings.value = response.data
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
    // Nếu có lỗi, có thể rollback trạng thái trong giao diện (ví dụ, bằng cách fetch lại bookings)
    fetchBookings()
  }
}

const statusClass = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-500'
    case 'pending':
      return 'bg-yellow-100 text-yellow-500'
    case 'cancelled':
      return 'bg-red-100 text-red-500'
    default:
      return 'bg-gray-100 text-gray-400'
  }
}

onMounted(fetchBookings)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.3s, transform 0.3s;
  transform-origin: bottom center;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translate(-50%, -100%);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}

.fixed.inset-0.bg-black.bg-opacity-50.z-40 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.1);
}
</style>

