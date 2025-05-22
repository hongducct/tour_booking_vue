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
import { mdiHeart } from '@mdi/js'

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('userToken')
const wishlist = ref([])

const fetchWishlist = async () => {
  try {
    const res = await axios.get(`${baseUrl}/user/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    wishlist.value = res.data
  } catch (err) {
    console.error('Lấy danh sách yêu thích thất bại:', err)
    alert('Không thể lấy danh sách yêu thích.')
  }
}

const removeFromWishlist = async (tourId) => {
  try {
    await axios.delete(`${baseUrl}/user/wishlist/${tourId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    wishlist.value = wishlist.value.filter((item) => item.id !== tourId)
    alert('Đã xóa khỏi danh sách yêu thích!')
  } catch (err) {
    console.error('Xóa khỏi danh sách yêu thích thất bại:', err)
    alert('Không thể xóa khỏi danh sách yêu thích.')
  }
}

onMounted(() => {
  fetchWishlist()
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
        <SectionTitleLineWithButton :icon="mdiHeart" title="Danh sách yêu thích" main />

        <CardBox>
          <div v-if="wishlist.length">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="item in wishlist"
                :key="item.id"
                class="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <img
                  :src="item.tour_image"
                  alt="Tour Image"
                  class="w-full h-32 object-cover rounded"
                />
                <h3 class="mt-2 font-semibold">{{ item.tour_name }}</h3>
                <p class="text-gray-600">{{ item.price }} VNĐ</p>
                <div class="mt-2 flex space-x-2">
                  <BaseButton
                    color="info"
                    label="Xem chi tiết"
                    small
                    @click="router.push(`/tour/${item.id}`)"
                  />
                  <BaseButton
                    color="danger"
                    label="Xóa"
                    small
                    @click="removeFromWishlist(item.id)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center p-4">
            <p>Chưa có tour nào trong danh sách yêu thích.</p>
          </div>
        </CardBox>
      </SectionMain>
    </div>
  </div>
</template>

<style scoped>
/* img {
  @apply w-full h-32 object-cover rounded;
} */
</style>
