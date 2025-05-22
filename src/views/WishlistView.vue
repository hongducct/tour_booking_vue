<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import CardBox from '@/components/admin/CardBox.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import { mdiHeart, mdiClock, mdiMapMarker, mdiAccountHeart  } from '@mdi/js'
import TourCard from '@/components/TourCard.vue'
import {
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/solid'
import { StarIcon as StarOutline } from '@heroicons/vue/24/outline'

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('userToken')
const wishlist = ref([])
const perPage = ref(10)

const fetchWishlist = async () => {
  if (!token) {
    alert('Bạn cần đăng nhập để xem danh sách yêu thích!')
    router.push('/login')
    return
  }

  try {
    const res = await axios.get(`${baseUrl}/user/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { perPage: perPage.value },
    })
    wishlist.value = res.data.data || []
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

const createSlug = (id, name) => {
  return `${id}-${name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`
}

const formatPrice = (price) => {
  const parsed = parseFloat(price)
  return parsed ? parsed.toLocaleString('vi-VN') + '₫' : '11,490,000₫'
}

const getStarType = (index, rating) => {
  if (index <= Math.floor(rating)) {
    return StarIcon // đầy
  } else if (index - rating < 1 && index - rating > 0) {
    return StarIcon // Nửa sao không cần thiết ở đây, dùng đầy sao cho đơn giản
  } else {
    return StarOutline // rỗng
  }
}

onMounted(() => {
  fetchWishlist()
})
</script>

<template>
  <TheHeader />
  <div class="flex mt-30">
    <!-- Sidebar -->
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

    <!-- Main Content -->
    <div class="ml-64 flex-1">
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiHeart" title="Danh sách yêu thích" main />

        <CardBox>
          <div v-if="wishlist.length">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="tour in wishlist"
                :key="tour.id"
                class="border rounded-lg shadow-xl/30 overflow-hidden bg-white"
              >
                <RouterLink :to="`/tour/${createSlug(tour.id, tour.name)}`">
                  <img
                    :src="tour.images?.[0]?.image_url || '/images/default-tour.jpg'"
                    :alt="tour.name"
                    class="w-full h-64 object-cover"
                  />
                </RouterLink>

                <div class="bg-yellow-500 text-white px-4 py-2 font-semibold text-sm">
                  {{ formatPrice(tour.price) }} / người
                </div>

                <div class="p-4">
                  <div class="text-center text-sm text-gray-600 mb-2">
                    <ul class="flex justify-around">
                      <li class="flex items-center gap-1">
                        <ClockIcon class="w-4 h-4" />
                        {{ tour.days }}N/{{ tour.nights }}Đ
                      </li>
                      <li class="flex items-center gap-1">
                        <UserGroupIcon class="w-4 h-4" />
                      </li>
                      <li class="flex items-center gap-1">
                        <MapPinIcon class="w-4 h-4" />
                        <span>{{ tour.location?.name || 'Unknown' }}</span>
                      </li>
                    </ul>
                  </div>

                  <h3 class="text-lg font-bold mb-2">
                    <RouterLink
                      :to="`/tour/${createSlug(tour.id, tour.name)}`"
                      class="hover:text-yellow-500"
                    >
                      {{ tour.name }}
                    </RouterLink>
                  </h3>

                  <div class="text-sm text-gray-700 mb-3">
                    <p>Điểm khởi hành: {{ tour.start_point || 'Unknown' }}</p>
                    <div class="flex items-center gap-1 text-yellow-400 text-sm">
                      <template v-if="tour.average_rating && tour.review_count > 0">
                        <template v-for="n in 5" :key="n">
                          <component :is="getStarType(n, tour.average_rating)" class="w-4 h-4" />
                        </template>
                        <span class="text-gray-600 text-xs ml-2"
                          >({{ tour.review_count }} đánh giá)</span
                        >
                      </template>
                      <template v-else>
                        <span class="text-gray-500 text-xs">Chưa có đánh giá</span>
                      </template>
                    </div>
                  </div>

                  <div class="flex justify-between items-center">
                    <RouterLink
                      :to="`/tour/${createSlug(tour.id, tour.name)}`"
                      class="text-yellow-500 hover:underline flex items-center gap-1"
                    >
                      Book Now <ArrowRightIcon class="w-4 h-4" />
                    </RouterLink>
                    <BaseButton
                      color="danger"
                      label="Xóa khỏi danh sách"
                      small
                      @click="removeFromWishlist(tour.id)"
                    />
                  </div>
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
</style>
