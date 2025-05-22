<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import CardBox from '@/components/admin/CardBox.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import FormField from '@/components/admin/FormField.vue'
import FormControl from '@/components/admin/FormControl.vue'
import BaseButtons from '@/components/admin/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { mdiCog } from '@mdi/js'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('userToken')
const settings = reactive({
  notifications: true,
  language: 'vi', // Giả định ngôn ngữ mặc định là tiếng Việt
})

const fetchSettings = async () => {
  try {
    const res = await axios.get(`${baseUrl}/user/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    Object.assign(settings, res.data)
  } catch (err) {
    console.error('Lấy cài đặt thất bại:', err)
    alert('Không thể lấy cài đặt.')
  }
}

const saveSettings = async () => {
  try {
    await axios.put(`${baseUrl}/user/settings`, settings, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Cài đặt đã được lưu thành công!')
  } catch (err) {
    console.error('Lưu cài đặt thất bại:', err)
    alert('Không thể lưu cài đặt.')
  }
}

onMounted(() => {
  fetchSettings()
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
        <SectionTitleLineWithButton :icon="mdiCog" title="Cài đặt" main />

        <CardBox is-form @submit.prevent="saveSettings">
          <FormField label="Nhận thông báo" help="Bật/tắt thông báo từ hệ thống">
            <input
              v-model="settings.notifications"
              type="checkbox"
              class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </FormField>

          <FormField label="Ngôn ngữ" help="Chọn ngôn ngữ hiển thị">
            <select v-model="settings.language" class="w-full p-2 border rounded">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Lưu cài đặt" />
            </BaseButtons>
          </template>
        </CardBox>
      </SectionMain>
    </div>
  </div>
</template>

<style scoped>
/* select {
  @apply w-full p-2 border rounded;
} */
</style>
