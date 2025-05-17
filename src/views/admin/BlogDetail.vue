<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Chi tiết Bài viết" icon="mdiNewspaper" main>
        <BaseButton label="Quay lại" color="secondary" @click="goBack" />
      </SectionTitleLineWithButton>

      <CardBox>
        <h2 class="text-2xl font-bold mb-2">{{ post.title }}</h2>
        <p class="text-gray-500 mb-4">Nhà cung cấp: {{ post.vendor_name }}</p>
        <img
          v-if="post.image"
          :src="post.image"
          alt="Hình ảnh"
          class="w-full max-w-md mb-4 rounded shadow"
        />
        <p class="mb-4 whitespace-pre-line">{{ post.content }}</p>
        <p class="text-sm text-gray-400">
          Ngày xuất bản: {{ formatDate(post.published_at) }} | Trạng thái: {{ post.blog_status }}
        </p>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const post = ref({})

async function fetchPost() {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${baseUrl}/news/${route.params.id}`)
    post.value = response.data.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bài viết:', error)
    alert('Không thể tải chi tiết bài viết.')
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Chưa xuất bản'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function goBack() {
  router.push('/admin/blogs')
}

onMounted(() => {
  fetchPost()
})
</script>
