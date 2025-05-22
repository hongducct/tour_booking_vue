<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import CardBox from '@/components/admin/CardBox.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { mdiAccount } from '@mdi/js'

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('userToken')
const bookingHistory = ref([])

const fetchBookingHistory = async () => {
  try {
    const res = await axios.get(`${baseUrl}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    bookingHistory.value = res.data
  } catch (err) {
    console.error('Lấy lịch sử booking thất bại:', err)
    alert('Không thể lấy lịch sử booking.')
  }
}

onMounted(() => {
  fetchBookingHistory()
})
</script>

<template>
  <TheHeader />
  <div class="flex mt-30">
    <div class="w-64 bg-gray-100 p-4 h-screen fixed">
      <h2 class="text-xl font-bold mb-4">Tài khoản của tôi</h2>
      <ul class="space-y-2">
        <li>
          <router-link to="/profile" class="block p-2 hover:bg-gray-200 rounded">Hồ sơ</router-link>
        </li>
        <li>
          <router-link to="/bookings" class="block p-2 hover:bg-gray-200 rounded"
            >Lịch sử đặt tour</router-link
          >
        </li>
        <li>
          <router-link to="/wishlist" class="block p-2 hover:bg-gray-200 rounded"
            >Danh sách yêu thích</router-link
          >
        </li>
        <li>
          <router-link to="/settings" class="block p-2 hover:bg-gray-200 rounded"
            >Cài đặt</router-link
          >
        </li>
      </ul>
    </div>
    <div class="ml-64 flex-1">
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiAccount" title="Lịch sử đặt tour" main />

        <CardBox>
          <div v-if="bookingHistory.length">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="border p-2 bg-gray-100 font-semibold">Mã đặt tour</th>
                  <th class="border p-2 bg-gray-100 font-semibold">Tên tour</th>
                  <th class="border p-2 bg-gray-100 font-semibold">Ngày đặt</th>
                  <th class="border p-2 bg-gray-100 font-semibold">Trạng thái</th>
                  <th class="border p-2 bg-gray-100 font-semibold">Tổng tiền</th>
                  <th class="border p-2 bg-gray-100 font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in bookingHistory" :key="booking.id">
                  <td class="border p-2">{{ booking.id }}</td>
                  <td class="border p-2">{{ booking.tour_name }}</td>
                  <td class="border p-2">
                    {{ new Date(booking.created_at).toLocaleDateString() }}
                  </td>
                  <td class="border p-2">{{ booking.status }}</td>
                  <td class="border p-2">{{ booking.total_price }} VNĐ</td>
                  <td class="border p-2">
                    <BaseButton
                      color="info"
                      label="Xem chi tiết"
                      small
                      @click="router.push(`/booking/${booking.id}`)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center p-4">
            <p>Chưa có lịch sử đặt tour.</p>
          </div>
        </CardBox>
      </SectionMain>
    </div>
  </div>
</template>

<style scoped>
/* table {
  @apply w-full;
}
th,
td {
  @apply border p-2 text-left;
}
th {
  @apply bg-gray-100 font-semibold;
} */
</style>
