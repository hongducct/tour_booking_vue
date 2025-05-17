<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Chỉnh sửa Bài viết" icon="mdiNewspaper" main>
        <BaseButton label="Quay lại" color="secondary" @click="goBack" />
      </SectionTitleLineWithButton>

      <CardBox>
        <form @submit.prevent="updatePost">
          <div class="mb-4">
            <label class="block mb-1">Tiêu đề</label>
            <input v-model="form.title" type="text" class="w-full border p-2 rounded" required />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Nội dung</label>
            <textarea v-model="form.content" class="w-full border p-2 rounded" rows="6"></textarea>
          </div>

          <div class="mb-4">
            <label class="block mb-1">Trạng thái</label>
            <select v-model="form.blog_status" class="w-full border p-2 rounded">
              <option value="draft">Nháp</option>
              <option value="published">Đã xuất bản</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>

          <BaseButton label="Lưu thay đổi" color="primary" type="submit" />
        </form>
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
const form = ref({
  title: '',
  content: '',
  blog_status: 'draft',
})

async function fetchPost() {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${baseUrl}/news/${route.params.id}`)
    const post = response.data.data
    form.value = {
      title: post.title,
      content: post.content,
      blog_status: post.blog_status,
    }
  } catch (error) {
    console.error('Lỗi khi lấy bài viết:', error)
    alert('Không thể tải dữ liệu bài viết.')
  }
}

async function updatePost() {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    await axios.put(`${baseUrl}/news/${route.params.id}`, form.value)
    alert('Cập nhật bài viết thành công.')
    router.push('/admin/blogs')
  } catch (error) {
    console.error('Lỗi khi cập nhật bài viết:', error)
    alert('Cập nhật thất bại.')
  }
}

function goBack() {
  router.push('/admin/news')
}

onMounted(() => {
  fetchPost()
})
</script>
