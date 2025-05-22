<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseDivider from '@/components/admin/BaseDivider.vue'
import FormField from '@/components/admin/FormField.vue'
import FormControl from '@/components/admin/FormControl.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BaseButtons from '@/components/admin/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword } from '@mdi/js'

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL

// Lấy userData từ localStorage
const userData = ref(JSON.parse(localStorage.getItem('userData')) || {})
const token = localStorage.getItem('userToken')

// Form dữ liệu profile
const profileForm = reactive({
  first_name: userData.value.first_name || '',
  last_name: userData.value.last_name || '',
  email: userData.value.email || '',
  phone_number: userData.value.phone_number || '',
  avatar: userData.value.avatar || '',
})

// Form đổi mật khẩu
const passwordForm = reactive({
  password_current: '',
  password: '',
  password_confirmation: '',
})

// Form upload ảnh
const avatarFile = ref(null)
const avatarPreview = ref(userData.value.avatar || '')

// Lịch sử booking
const bookingHistory = ref([])

// Hàm xử lý upload ảnh đại diện
const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  try {
    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: {
          upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        },
      },
    )

    if (uploadRes.status !== 200) {
      throw new Error('Upload failed')
    }

    // Cập nhật avatar preview
    avatarPreview.value = uploadRes.data.secure_url
    profileForm.avatar = uploadRes.data.secure_url
  } catch (err) {
    console.error('Lỗi upload ảnh:', err)
    alert('Không thể tải ảnh lên.')
  }
}

// Submit cập nhật profile
const submitProfile = async () => {
  try {
    const res = await axios.put(`${baseUrl}/user/profile`, profileForm, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // Cập nhật userData trong localStorage
    localStorage.setItem('userData', JSON.stringify(res.data))
    userData.value = res.data
    alert('Cập nhật hồ sơ thành công!')
  } catch (err) {
    console.error('Cập nhật hồ sơ thất bại:', err)
    alert('Cập nhật hồ sơ thất bại. Vui lòng thử lại.')
  }
}

// Submit đổi mật khẩu
const submitPass = async () => {
  if (passwordForm.password !== passwordForm.password_confirmation) {
    alert('Mật khẩu mới và xác nhận mật khẩu không khớp!')
    return
  }

  try {
    await axios.post(
      `${baseUrl}/user/change-password`,
      {
        current_password: passwordForm.password_current,
        new_password: passwordForm.password,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    alert('Đổi mật khẩu thành công!')
    // Reset form
    passwordForm.password_current = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
  } catch (err) {
    console.error('Đổi mật khẩu thất bại:', err)
    alert(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.')
  }
}

// Lấy lịch sử booking
const fetchBookingHistory = async () => {
  try {
    const res = await axios.get(`${baseUrl}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    bookingHistory.value = res.data
  } catch (err) {
    console.error('Lấy lịch sử booking thất bại:', err)
    alert('Không thể lấy lịch sử booking.')
  }
}

onMounted(() => {
  fetchBookingHistory()
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
            <router-link to="/profile" class="block p-2 hover:bg-gray-200 rounded"
              >Hồ sơ</router-link
            >
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
          <SectionTitleLineWithButton :icon="mdiAccount" title="Hồ sơ" main />

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Form cập nhật hồ sơ -->
            <CardBox is-form @submit.prevent="submitProfile">
              <FormField label="Ảnh đại diện" help="Chỉ được chọn 1 ảnh, tối đa 500kb">
                <div class="flex items-center space-x-4">
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Avatar Preview"
                    class="w-20 h-20 rounded-full"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="border p-2 rounded"
                  />
                </div>
              </FormField>

              <FormField label="Họ" help="Họ của bạn">
                <FormControl
                  v-model="profileForm.last_name"
                  :icon="mdiAccount"
                  name="last_name"
                  required
                />
              </FormField>
              <FormField label="Tên" help="Tên của bạn">
                <FormControl
                  v-model="profileForm.first_name"
                  :icon="mdiAccount"
                  name="first_name"
                  required
                />
              </FormField>
              <FormField label="E-mail" help="E-mail của bạn">
                <FormControl
                  v-model="profileForm.email"
                  :icon="mdiMail"
                  type="email"
                  name="email"
                  required
                  disabled
                />
              </FormField>
              <FormField label="Số điện thoại" help="Số điện thoại của bạn">
                <FormControl
                  v-model="profileForm.phone_number"
                  :icon="mdiAccount"
                  name="phone_number"
                />
              </FormField>

              <template #footer>
                <BaseButtons>
                  <BaseButton color="info" type="submit" label="Cập nhật" />
                </BaseButtons>
              </template>
            </CardBox>

            <!-- Form đổi mật khẩu -->
            <CardBox is-form @submit.prevent="submitPass">
              <FormField label="Mật khẩu hiện tại" help="Nhập mật khẩu hiện tại">
                <FormControl
                  v-model="passwordForm.password_current"
                  :icon="mdiAsterisk"
                  name="password_current"
                  type="password"
                  required
                  autocomplete="current-password"
                />
              </FormField>

              <BaseDivider />

              <FormField label="Mật khẩu mới" help="Nhập mật khẩu mới">
                <FormControl
                  v-model="passwordForm.password"
                  :icon="mdiFormTextboxPassword"
                  name="password"
                  type="password"
                  required
                  autocomplete="new-password"
                />
              </FormField>

              <FormField label="Xác nhận mật khẩu mới" help="Nhập lại mật khẩu mới">
                <FormControl
                  v-model="passwordForm.password_confirmation"
                  :icon="mdiFormTextboxPassword"
                  name="password_confirmation"
                  type="password"
                  required
                  autocomplete="new-password"
                />
              </FormField>

              <template #footer>
                <BaseButtons>
                  <BaseButton type="submit" color="info" label="Đổi mật khẩu" />
                </BaseButtons>
              </template>
            </CardBox>
          </div>

          <!-- Lịch sử booking -->
          <SectionTitleLineWithButton title="Lịch sử đặt tour" main class="mt-6" />
          <CardBox>
            <div v-if="bookingHistory.length">
              <table class="w-full">
                <thead>
                  <tr>
                    <th>Mã đặt tour</th>
                    <th>Tên tour</th>
                    <th>Ngày đặt</th>
                    <th>Trạng thái</th>
                    <th>Tổng tiền</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="booking in bookingHistory" :key="booking.id">
                    <td>{{ booking.id }}</td>
                    <td>{{ booking.tour_name }}</td>
                    <td>{{ new Date(booking.created_at).toLocaleDateString() }}</td>
                    <td>{{ booking.status }}</td>
                    <td>{{ booking.total_price }} VNĐ</td>
                    <td>
                      <BaseButton
                        color="info"
                        label="Xem chi tiết"
                        small
                        @click="router.push(`/booking/${booking.id}`)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center p-4">
              <p>Chưa có lịch sử đặt tour.</p>
            </div>
          </CardBox>
        </SectionMain>
      </div>
    </div>
</template>

<style scoped>
/* table {
  @apply border-collapse w-full;
}
th,
td {
  @apply border text-left;
}
th {
  @apply font-semibold;
} */
</style>
