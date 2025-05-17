<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Quản lý Đánh giá" icon="mdiStar" main>
        <BaseButton label="Thêm đánh giá" color="info" @click="addReview" />
      </SectionTitleLineWithButton>

      <CardBox>
        <div class="mb-4 flex justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <span>Hiển thị:</span>
            <select v-model="perPage" @change="fetchReviews" class="border p-2 rounded">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <span>Trạng thái:</span>
            <select v-model="statusFilter" @change="fetchReviews" class="border p-2 rounded">
              <option value="">Tất cả</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <BaseButton label="Làm mới" color="primary" @click="fetchReviews" />
        </div>

        <table class="w-full table-auto mb-4 border-collapse">
          <thead>
            <tr>
              <th class="p-2 border border-gray-300 bg-gray-100">ID</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Người đánh giá</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Tour</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Điểm</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Nội dung</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Trạng thái</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Ngày gửi</th>
              <th class="p-2 border border-gray-300 bg-gray-100">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in reviews" :key="review.id">
              <td class="p-2 border border-gray-300">{{ review.id }}</td>
              <td class="p-2 border border-gray-300">{{ review.user?.username || 'N/A' }}</td>
              <td class="p-2 border border-gray-300">{{ review.reviewable?.name || 'N/A' }}</td>
              <td class="p-2 border border-gray-300">
                <span class="flex text-yellow-400">
                  <span v-for="n in 5" :key="n" :class="{ 'text-gray-300': n > review.rating }">★</span>
                </span>
              </td>
              <td class="p-2 border border-gray-300 truncate max-w-xs">{{ review.comment || 'Không có nội dung' }}</td>
              <td class="p-2 border border-gray-300 relative">
                <div class="inline-block relative">
                  <button 
                    :class="[
                      'px-2 py-1 rounded border font-medium',
                      review.status === 'approved' ? 'bg-teal-50 border-teal-500 text-teal-700' : '',
                      review.status === 'pending' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : '',
                      review.status === 'rejected' ? 'bg-red-50 border-red-500 text-red-700' : ''
                    ]" 
                    @click="toggleDropdown(review.id)"
                  >
                    {{ review.status }}
                  </button>
                  <div v-if="activeDropdown === review.id" class="absolute bg-white border border-gray-300 rounded shadow-md mt-1 z-10">
                    <div class="px-2 py-1 hover:bg-gray-100 cursor-pointer" @click="changeReviewStatus(review, 'approved')">Approved</div>
                    <div class="px-2 py-1 hover:bg-gray-100 cursor-pointer" @click="changeReviewStatus(review, 'pending')">Pending</div>
                    <div class="px-2 py-1 hover:bg-gray-100 cursor-pointer" @click="changeReviewStatus(review, 'rejected')">Rejected</div>
                  </div>
                </div>
              </td>
              <td class="p-2 border border-gray-300">{{ formatDate(review.created_at) }}</td>
              <td class="p-2 border border-gray-300 flex space-x-2">
                <BaseButton color="warning" label="Sửa" @click="editReview(review.id)" />
                <BaseButton color="danger" label="Xóa" @click="deleteReview(review.id)" />
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="reviews.length === 0" class="text-center text-gray-500">Không có đánh giá nào.</div>

        <div class="flex justify-center space-x-2 mt-4">
          <BaseButton :disabled="!pagination.prev_page_url" label="Trước" color="primary" @click="goToPage(pagination.current_page - 1)" />
          <span>Trang {{ pagination.current_page }} / {{ pagination.last_page }}</span>
          <BaseButton :disabled="!pagination.next_page_url" label="Sau" color="primary" @click="goToPage(pagination.current_page + 1)" />
        </div>
      </CardBox>
    </SectionMain>
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

const reviews = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})
const statusFilter = ref('')
const perPage = ref(10)
const activeDropdown = ref(null)
const baseUrl = import.meta.env.VITE_API_BASE_URL

async function fetchReviews(page = 1) {
  try {
    let url = `${baseUrl}/reviews?page=${page}&per_page=${perPage.value}`
    if (statusFilter.value) {
      url += `&status=${statusFilter.value}`
    }
    const response = await axios.get(url)
    reviews.value = response.data.data
    pagination.value = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      next_page_url: response.data.links.next,
      prev_page_url: response.data.links.prev,
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error)
    alert('Lỗi khi tải danh sách đánh giá.')
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function toggleDropdown(reviewId) {
  activeDropdown.value = activeDropdown.value === reviewId ? null : reviewId
}

async function changeReviewStatus(review, newStatus) {
  try {
    review.status = newStatus
    activeDropdown.value = null

    await axios.put(`${baseUrl}/reviews/${review.id}`, { status: newStatus })
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    fetchReviews(pagination.value.current_page)
    alert('Cập nhật trạng thái thất bại.')
  }
}

async function deleteReview(reviewId) {
  if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return
  try {
    await axios.delete(`${baseUrl}/reviews/${reviewId}`)
    reviews.value = reviews.value.filter(review => review.id !== reviewId)
    alert('Xóa đánh giá thành công.')
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error)
    alert('Xóa đánh giá thất bại.')
  }
}

function goToPage(page) {
  fetchReviews(page)
}

function addReview() {
  alert('Chức năng thêm đánh giá sẽ được triển khai.')
}

function editReview(reviewId) {
  alert(`Sửa đánh giá với ID: ${reviewId}`)
}

onMounted(() => {
  fetchReviews()
})
</script>