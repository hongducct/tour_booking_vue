```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import CardBox from '@/components/admin/CardBox.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import { mdiHeart } from '@mdi/js'
import BlogCard from '@/components/blog/BlogCard.vue'
import UserSidebar from '@/components/user/UserSidebar.vue'

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
      params: {
        perPage: perPage.value,
        type: 'blog', // Chỉ lấy blog wishlist
      },
    })

    console.log('Danh sách blog yêu thích:', res.data)
    wishlist.value = res.data.data || []

    // Cập nhật pagination info
    // if (res.data.total !== undefined) {
    //   totalItems.value = res.data.total
    //   totalPages.value = res.data.last_page
    // }
  } catch (err) {
    console.error('Lấy danh sách yêu thích thất bại:', err)

    if (err.response?.status === 401) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
      router.push('/login')
    } else {
      alert('Không thể lấy danh sách yêu thích. Vui lòng thử lại!')
    }
  }
}

const removeFromWishlist = async (id, type) => {
  try {
    await axios.delete(`${baseUrl}/user/wishlist/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    wishlist.value = wishlist.value.filter((item) => item.id !== id)
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
    <!-- Sidebar -->
    <UserSidebar />

    <!-- Main Content -->
    <div class="ml-80 flex-1">
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiHeart" title="Blog yêu thích" main />

        <CardBox>
          <div v-if="wishlist.length">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BlogCard
                v-for="item in wishlist"
                :key="`blog-${item.id}`"
                :post="item"
                @toggle-wishlist="removeFromWishlist"
              />
            </div>
          </div>
          <div v-else class="text-center p-4">
            <p>Chưa có blog nào trong danh sách yêu thích.</p>
          </div>
        </CardBox>
      </SectionMain>
    </div>
  </div>
</template>

<style scoped></style>
```
