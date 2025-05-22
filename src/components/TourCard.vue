<template>
  <div class="package-wrap border rounded-lg shadow-xl/30 overflow-hidden bg-white">
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
        <RouterLink :to="`/tour/${createSlug(tour.id, tour.name)}`" class="hover:text-yellow-500">
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
            <span class="text-gray-600 text-xs ml-2">({{ tour.review_count }} đánh giá)</span>
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
        <button
          @click="toggleWishlist"
          class="flex items-center gap-1"
          :class="
            isInWishlist ? 'text-red-500 hover:text-gray-400' : 'text-gray-400 hover:text-red-500'
          "
        >
          <HeartIcon class="w-4 h-4" />
          {{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, h, ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import {
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  HeartIcon,
} from '@heroicons/vue/24/solid'
import { StarIcon as StarOutline } from '@heroicons/vue/24/outline'

const props = defineProps({ tour: Object })
const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('userToken')
const isInWishlist = ref(false)

const createSlug = (id, name) => {
  return `${id}-${name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`
}
const getStarType = (index, rating) => {
  if (index <= Math.floor(rating)) {
    return StarIcon // đầy
  } else if (index - rating < 1 && index - rating > 0) {
    return HalfStar // nửa (xử lý thủ công)
  } else {
    return StarOutline // rỗng
  }
}

/**
 * Sao nửa ngôi - Tự tạo component SVG
 */
const HalfStar = defineComponent({
  name: 'HalfStar',
  render() {
    return h(
      'svg',
      {
        class: 'w-4 h-4 text-yellow-400',
        fill: 'currentColor',
        viewBox: '0 0 20 20',
      },
      [
        h('defs', {}, [
          h('linearGradient', { id: 'half' }, [
            h('stop', { offset: '50%', 'stop-color': 'currentColor' }),
            h('stop', { offset: '50%', 'stop-color': 'transparent' }),
          ]),
        ]),
        h('path', {
          d: `M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286
          3.95a1 1 0 00.95.69h4.155c.969 0 1.371
          1.24.588 1.81l-3.367 2.448a1 1 0
          00-.364 1.118l1.286 3.95c.3.921-.755
          1.688-1.54 1.118l-3.367-2.448a1 1 0
          00-1.176 0l-3.367 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1
          1 0 00-.364-1.118L2.07 9.377c-.783-.57-.38-1.81.588-1.81h4.156a1
          1 0 00.95-.69l1.286-3.95z`,
          fill: 'url(#half)',
        }),
      ],
    )
  },
})

const formatPrice = (price) => {
  const parsed = parseFloat(price)
  return parsed ? parsed.toLocaleString('vi-VN') + '₫' : '11,490,000₫'
}

// Kiểm tra nếu tour đã có trong wishlist
const checkWishlistStatus = async () => {
  if (!token) return

  try {
    const res = await axios.get(`${baseUrl}/user/wishlist/check/${props.tour.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    isInWishlist.value = res.data.isInWishlist
  } catch (err) {
    console.error('Kiểm tra wishlist thất bại:', err)
  }
}

// Thêm hoặc xóa tour khỏi wishlist
const toggleWishlist = async () => {
  if (!token) {
    alert('Bạn cần đăng nhập để thêm tour vào danh sách yêu thích!')
    router.push('/login')
    return
  }

  try {
    if (isInWishlist.value) {
      // Xóa khỏi wishlist
      await axios.delete(`${baseUrl}/user/wishlist/${props.tour.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      isInWishlist.value = false
      alert('Đã xóa khỏi danh sách yêu thích!')
    } else {
      // Thêm vào wishlist
      await axios.post(
        `${baseUrl}/user/wishlist`,
        {
          favoritable_id: props.tour.id,
          favoritable_type: 'App\\Models\\Tour',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      isInWishlist.value = true
      alert('Đã thêm vào danh sách yêu thích!')
    }
  } catch (err) {
    console.error('Thao tác với wishlist thất bại:', err)
    alert('Không thể thực hiện thao tác. Vui lòng thử lại.')
  }
}

onMounted(() => {
  checkWishlistStatus()
})

</script>
