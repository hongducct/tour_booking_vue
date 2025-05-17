<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Quản lý Bài viết" icon="mdiNewspaper" main>
        <BaseButton label="Thêm bài viết" color="info" @click="addPost" />
      </SectionTitleLineWithButton>

      <CardBox>
        <div class="mb-4 flex justify-between items-center">
          <select v-model="statusFilter" @change="fetchPosts" class="border p-2 rounded">
            <option value="">Tất cả</option>
            <option value="draft">Nháp</option>
            <option value="published">Đã xuất bản</option>
            <option value="archived">Đã lưu trữ</option>
          </select>
          <BaseButton label="Làm mới" color="primary" @click="fetchPosts" />
        </div>

        <table class="w-full table-auto mb-4 border-collapse">
          <thead>
            <tr>
              <th class="p-2 border border-gray-300 bg-gray-100">ID</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Tiêu đề</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Nhà cung cấp</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Ngày xuất bản</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td class="p-2 border border-gray-300">{{ post.id }}</td>
              <td
                class="p-2 border border-gray-300 text-blue-600 hover:underline cursor-pointer"
                @click="goToDetail(post.id)"
              >
                {{ post.title }}
              </td>
              <td class="p-2 border border-gray-300">{{ post.vendor_name }}</td>
              <td class="p-2 border border-gray-300">
                <span
                  :class="[
                    'px-2 py-1 rounded border font-medium',
                    post.blog_status === 'published'
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : post.blog_status === 'draft'
                        ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                        : 'bg-gray-100 border-gray-400 text-gray-700',
                  ]"
                >
                  {{
                    post.blog_status === 'published'
                      ? formatDate(post.published_at)
                      : post.blog_status
                  }}
                </span>
              </td>
              <td class="p-2 border border-gray-300 flex space-x-2">
                <BaseButton color="warning" label="Sửa" @click="editPost(post.id)" />
                <BaseButton color="danger" label="Xóa" @click="deletePost(post.id)" />
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="posts.length === 0" class="text-center text-gray-500">
          Không có bài viết nào.
        </div>

        <div class="flex justify-center space-x-2 mt-4">
          <BaseButton
            :disabled="!pagination.prev_page_url"
            label="Trước"
            color="primary"
            @click="goToPage(pagination.current_page - 1)"
          />
          <span>Trang {{ pagination.current_page }} / {{ pagination.last_page }}</span>
          <BaseButton
            :disabled="!pagination.next_page_url"
            label="Sau"
            color="primary"
            @click="goToPage(pagination.current_page + 1)"
          />
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'

const router = useRouter()
const posts = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})
const statusFilter = ref('')

async function fetchPosts(page = 1) {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    let url = `${baseUrl}/news?page=${page}`
    if (statusFilter.value) {
      url += `&status=${statusFilter.value}`
    }
    const response = await axios.get(url)
    posts.value = response.data.data
    pagination.value = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      next_page_url: response.data.links.next,
      prev_page_url: response.data.links.prev,
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error)
    alert('Lỗi khi tải danh sách bài viết.')
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Chưa xuất bản'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function goToDetail(postId) {
  router.push(`/admin/blogs/${postId}`)
}

function editPost(postId) {
  router.push(`/admin/blogs/edit/${postId}`)
}

async function deletePost(postId) {
  if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    await axios.delete(`${baseUrl}/news/${postId}`)
    posts.value = posts.value.filter((post) => post.id !== postId)
    alert('Xóa bài viết thành công.')
  } catch (error) {
    console.error('Lỗi khi xóa bài viết:', error)
    alert('Xóa bài viết thất bại.')
  }
}

function goToPage(page) {
  fetchPosts(page)
}

function addPost() {
  router.push('/admin/news/create')
}

onMounted(() => {
  fetchPosts()
})
</script>
