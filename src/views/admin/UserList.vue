<template>
    <LayoutAuthenticated>
      <SectionMain>
        <SectionTitleLineWithButton title="Quản lý Người dùng" icon="mdiAccountMultiple" main>
          <BaseButton label="Thêm người dùng" color="info" @click="addUser" />
        </SectionTitleLineWithButton>
  
        <CardBox>
          <div class="mb-4 flex justify-between items-center">
            <select v-model="statusFilter" @change="fetchUsers" class="border p-2 rounded">
              <option value="">Tất cả</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
            <BaseButton label="Làm mới" color="primary" @click="fetchUsers" />
          </div>
  
          <table class="w-full table-auto mb-4 border-collapse">
            <thead>
              <tr>
                <th class="p-2 border border-gray-300 bg-gray-100">ID</th>
                <th class="p-2 border border-gray-300 bg-gray-100">Avatar</th>
                <th class="p-2 border border-gray-300 bg-gray-100">Username</th>
                <th class="p-2 border border-gray-300 bg-gray-100">Email</th>
                <th class="p-2 border border-gray-300 bg-gray-100">Trạng thái</th>
                <th class="p-2 border border-gray-300 bg-gray-100">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="p-2 border border-gray-300">{{ user.id }}</td>
                <td class="p-2 border border-gray-300"><img :src="user.avatar" alt="Avatar" class="w-12 h-12 rounded-full" /></td>
                <td class="p-2 border border-gray-300">{{ user.username }}</td>
                <td class="p-2 border border-gray-300">{{ user.email }}</td>
                <td class="p-2 border border-gray-300 relative">
                  <div class="inline-block relative">
                    <button 
                      :class="[
                        'px-2 py-1 rounded border font-medium',
                        user.user_status === 'active' ? 'bg-teal-50 border-teal-500 text-teal-700' : '',
                        user.user_status === 'inactive' ? 'bg-gray-50 border-gray-400 text-gray-600' : '',
                        user.user_status === 'banned' ? 'bg-red-50 border-red-500 text-red-700' : ''
                      ]" 
                      @click="toggleDropdown(user.id)"
                    >
                      {{ user.user_status }}
                    </button>
                    <div v-if="activeDropdown === user.id" class="absolute bg-white border border-gray-300 rounded shadow-md mt-1 z-10">
                      <div class="px-2 py-1 hover:bg-gray-100 cursor-pointer" @click="changeUserStatus(user, 'active')">Active</div>
                      <div class="px-2 py-1 hover:bg-gray-100 cursor-pointer" @click="changeUserStatus(user, 'inactive')">Inactive</div>
                      <div class="px-2 py-1 hover:bg-gray-100 cursor-pointer" @click="changeUserStatus(user, 'banned')">Banned</div>
                    </div>
                  </div>
                </td>
                <td class="p-2 border border-gray-300">
                  <BaseButton color="warning" label="Sửa" @click="editUser(user.id)" />
                </td>
              </tr>
            </tbody>
          </table>
  
          <div v-if="users.length === 0" class="text-center text-gray-500">Không có người dùng nào.</div>
  
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

const users = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})
const statusFilter = ref('')
const activeDropdown = ref(null)

async function fetchUsers(page = 1) {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    let url = `${baseUrl}/users?page=${page}`
    if (statusFilter.value) {
      url += `&status=${statusFilter.value}`
    }
    const response = await axios.get(url)
    users.value = response.data.data
    pagination.value = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      next_page_url: response.data.links.next,
      prev_page_url: response.data.links.prev,
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error)
    alert('Lỗi khi tải danh sách người dùng.')
  }
}

function toggleDropdown(userId) {
  activeDropdown.value = activeDropdown.value === userId ? null : userId
}

async function changeUserStatus(user, newStatus) {
  try {
    // Cập nhật UI ngay lập tức
    user.user_status = newStatus
    activeDropdown.value = null

    // Gửi request API
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    await axios.put(`${baseUrl}/users/${user.id}`, { user_status: newStatus })
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    // Nếu API thất bại, hoàn nguyên trạng thái
    fetchUsers(pagination.value.current_page)
    alert('Cập nhật trạng thái thất bại.')
  }
}

function goToPage(page) {
  fetchUsers(page)
}

function addUser() {
  alert('Chức năng thêm người dùng sẽ được triển khai.')
}

function editUser(userId) {
  alert(`Sửa người dùng với ID: ${userId}`)
}

onMounted(() => {
  fetchUsers()
})
</script>