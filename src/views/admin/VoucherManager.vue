<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Quản lý Voucher" icon="mdiTicket" main>
        <BaseButton label="Tạo Voucher" color="success" @click="showCreateForm = true" />
      </SectionTitleLineWithButton>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <CardBox class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ statistics.total_vouchers }}</div>
          <div class="text-sm text-gray-600">Tổng Voucher</div>
        </CardBox>
        <CardBox class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ statistics.active_vouchers }}</div>
          <div class="text-sm text-gray-600">Đang Hoạt Động</div>
        </CardBox>
        <CardBox class="text-center">
          <div class="text-2xl font-bold text-red-600">{{ statistics.expired_vouchers }}</div>
          <div class="text-sm text-gray-600">Đã Hết Hạn</div>
        </CardBox>
        <CardBox class="text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ statistics.upcoming_vouchers }}</div>
          <div class="text-sm text-gray-600">Sắp Diễn Ra</div>
        </CardBox>
        <CardBox class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ statistics.total_usage }}</div>
          <div class="text-sm text-gray-600">Lượt Sử Dụng</div>
        </CardBox>
        <CardBox class="text-center">
          <div class="text-2xl font-bold text-indigo-600">
            {{ formatCurrency(statistics.total_discount_given) }}
          </div>
          <div class="text-sm text-gray-600">Tổng Giảm Giá</div>
        </CardBox>
      </div>

      <!-- Filters -->
      <CardBox class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm mã</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Nhập mã voucher..."
              class="w-full border border-gray-300 rounded px-3 py-2"
              @input="debounceSearch"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              v-model="filters.status"
              class="w-full border border-gray-300 rounded px-3 py-2"
              @change="fetchVouchers"
            >
              <option value="">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="expired">Đã hết hạn</option>
              <option value="upcoming">Sắp diễn ra</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Số lượng/trang</label>
            <select
              v-model="filters.perPage"
              class="w-full border border-gray-300 rounded px-3 py-2"
              @change="fetchVouchers"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div class="flex items-end">
            <BaseButton label="Làm mới" color="info" @click="refreshData" />
          </div>
        </div>
      </CardBox>

      <!-- Vouchers Table -->
      <CardBox>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4">Mã Voucher</th>
                <th class="text-left py-3 px-4">Giảm giá</th>
                <th class="text-left py-3 px-4">Thời hạn</th>
                <th class="text-left py-3 px-4">Sử dụng</th>
                <th class="text-left py-3 px-4">Trạng thái</th>
                <th class="text-left py-3 px-4">Tour áp dụng</th>
                <th class="text-left py-3 px-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="border-b">
                <td colspan="7" class="text-center py-8">
                  <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="ml-2">Đang tải...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="vouchers.length === 0" class="border-b">
                <td colspan="7" class="text-center py-8 text-gray-500">
                  Không tìm thấy voucher nào
                </td>
              </tr>
              <tr
                v-else
                v-for="voucher in vouchers"
                :key="voucher.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-3 px-4">
                  <div class="font-semibold">{{ voucher.code }}</div>
                  <div class="text-sm text-gray-500">ID: {{ voucher.id }}</div>
                </td>
                <td class="py-3 px-4">
                  <div v-if="voucher.discount" class="text-green-600 font-semibold">
                    {{ formatCurrency(voucher.discount) }}
                  </div>
                  <div v-else-if="voucher.discount_percentage" class="text-blue-600 font-semibold">
                    {{ voucher.discount_percentage }}%
                  </div>
                  <div v-else class="text-gray-400">Chưa thiết lập</div>
                </td>
                <td class="py-3 px-4">
                  <div class="text-sm">
                    <div>{{ formatDate(voucher.start_date) }}</div>
                    <div class="text-gray-500">đến {{ formatDate(voucher.end_date) }}</div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="text-sm">
                    <span class="font-semibold">{{ voucher.usage_count }}</span>
                    /
                    <span>{{ voucher.usage_limit || '∞' }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 mt-1" v-if="voucher.usage_limit">
                    <div
                      class="bg-blue-600 h-2 rounded-full transition-all"
                      :style="{
                        width: `${Math.min((voucher.usage_count / voucher.usage_limit) * 100, 100)}%`,
                      }"
                    ></div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': voucher.is_active,
                      'bg-red-100 text-red-800': voucher.is_expired,
                      'bg-yellow-100 text-yellow-800': !voucher.is_active && !voucher.is_expired,
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{
                      voucher.is_active
                        ? 'Hoạt động'
                        : voucher.is_expired
                          ? 'Hết hạn'
                          : 'Sắp diễn ra'
                    }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="text-sm">
                    <span
                      v-if="
                        !voucher.applicable_tour_ids || voucher.applicable_tour_ids.length === 0
                      "
                    >
                      Tất cả tour
                    </span>
                    <span v-else> {{ voucher.applicable_tour_ids.length }} tour </span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="flex gap-2">
                    <BaseButton
                      label="Chi tiết"
                      size="sm"
                      color="info"
                      @click="viewVoucherDetails(voucher)"
                    />
                    <BaseButton
                      label="Sửa"
                      size="sm"
                      color="warning"
                      @click="editVoucher(voucher)"
                    />
                    <BaseButton
                      :label="voucher.is_active ? 'Vô hiệu' : 'Kích hoạt'"
                      size="sm"
                      :color="voucher.is_active ? 'danger' : 'success'"
                      @click="toggleVoucher(voucher)"
                    />
                    <BaseButton
                      label="Xóa"
                      size="sm"
                      color="danger"
                      @click="deleteVoucher(voucher.id)"
                      :disabled="voucher.usage_count > 0"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination.total > 0"
          class="flex justify-between items-center mt-4 pt-4 border-t"
        >
          <div class="text-sm text-gray-600">
            Hiển thị {{ (pagination.current_page - 1) * pagination.per_page + 1 }} -
            {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}
            trong tổng số {{ pagination.total }} voucher
          </div>
          <div class="flex gap-2">
            <BaseButton
              label="Trước"
              size="sm"
              color="light"
              :disabled="pagination.current_page <= 1"
              @click="changePage(pagination.current_page - 1)"
            />
            <span class="px-3 py-1 text-sm">
              Trang {{ pagination.current_page }} / {{ pagination.last_page }}
            </span>
            <BaseButton
              label="Sau"
              size="sm"
              color="light"
              :disabled="pagination.current_page >= pagination.last_page"
              @click="changePage(pagination.current_page + 1)"
            />
          </div>
        </div>
      </CardBox>

      <!-- Create/Edit Form Modal -->
      <div
        v-if="showCreateForm || editingVoucher"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="cancelForm"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ editingVoucher ? 'Chỉnh sửa Voucher' : 'Tạo Voucher mới' }}
          </h3>

          <form @submit.prevent="saveVoucher" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="voucherForm.code"
                label="Mã Voucher"
                required
                :error="errors.code"
              />
              <BaseInput
                v-model.number="voucherForm.usage_limit"
                label="Giới hạn sử dụng"
                type="number"
                placeholder="Để trống = không giới hạn"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model.number="voucherForm.discount"
                label="Giảm giá cố định (VND)"
                type="number"
                :disabled="!!voucherForm.discount_percentage"
                :error="errors.discount"
              />
              <BaseInput
                v-model.number="voucherForm.discount_percentage"
                label="Giảm giá (%)"
                type="number"
                min="1"
                max="100"
                :disabled="!!voucherForm.discount"
                :error="errors.discount_percentage"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="voucherForm.start_date"
                label="Ngày bắt đầu"
                type="date"
                required
                :error="errors.start_date"
              />
              <BaseInput
                v-model="voucherForm.end_date"
                label="Ngày kết thúc"
                type="date"
                required
                :error="errors.end_date"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">
                Áp dụng cho tour (để trống = áp dụng tất cả)
              </label>
              <select
                v-model="voucherForm.applicable_tour_ids"
                multiple
                class="w-full border border-gray-300 rounded px-3 py-2 h-32"
              >
                <option v-for="tour in tours" :value="tour.id" :key="tour.id">
                  {{ tour.name }}
                </option>
              </select>
              <div class="text-sm text-gray-500 mt-1">Giữ Ctrl (Cmd) để chọn nhiều tour</div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
              <BaseButton label="Hủy" color="light" @click="cancelForm" />
              <BaseButton
                type="submit"
                color="success"
                :label="editingVoucher ? 'Cập nhật' : 'Tạo mới'"
                :disabled="saving"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Voucher Details Modal -->
      <div
        v-if="viewingVoucher"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="viewingVoucher = null"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold">Chi tiết Voucher: {{ viewingVoucher.code }}</h3>
            <button @click="viewingVoucher = null" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold mb-3">Thông tin cơ bản</h4>
              <div class="space-y-2 text-sm">
                <div><span class="font-medium">Mã:</span> {{ viewingVoucher.code }}</div>
                <div>
                  <span class="font-medium">Giảm giá:</span>
                  <span v-if="viewingVoucher.discount">{{
                    formatCurrency(viewingVoucher.discount)
                  }}</span>
                  <span v-else-if="viewingVoucher.discount_percentage"
                    >{{ viewingVoucher.discount_percentage }}%</span
                  >
                  <span v-else class="text-gray-400">Chưa thiết lập</span>
                </div>
                <div>
                  <span class="font-medium">Bắt đầu:</span>
                  {{ formatDate(viewingVoucher.start_date) }}
                </div>
                <div>
                  <span class="font-medium">Kết thúc:</span>
                  {{ formatDate(viewingVoucher.end_date) }}
                </div>
                <div>
                  <span class="font-medium">Giới hạn:</span>
                  {{ viewingVoucher.usage_limit || 'Không giới hạn' }}
                </div>
                <div>
                  <span class="font-medium">Đã sử dụng:</span> {{ viewingVoucher.usage_count }}
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-semibold mb-3">Lịch sử sử dụng</h4>
              <div v-if="viewingVoucher.usages.length === 0" class="text-gray-500 text-sm">
                Chưa có lượt sử dụng nào
              </div>
              <div v-else class="space-y-2 max-h-48 overflow-y-auto">
                <div
                  v-for="usage in viewingVoucher.usages"
                  :key="usage.id"
                  class="border rounded p-2 text-sm"
                >
                  <div><span class="font-medium">Booking ID:</span> {{ usage.booking_id }}</div>
                  <div><span class="font-medium">User ID:</span> {{ usage.user_id }}</div>
                  <div>
                    <span class="font-medium">Giảm giá:</span>
                    {{ formatCurrency(usage.discount_applied) }}
                  </div>
                  <div>
                    <span class="font-medium">Thời gian:</span>
                    {{ formatDateTime(usage.created_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import BaseInput from '@/components/admin/BaseInput.vue'
import BaseButton from '@/components/admin/BaseButton.vue'

// Reactive data
const vouchers = ref([])
const tours = ref([])
const statistics = ref({
  total_vouchers: 0,
  active_vouchers: 0,
  expired_vouchers: 0,
  upcoming_vouchers: 0,
  total_usage: 0,
  total_discount_given: 0,
})

const showCreateForm = ref(false)
const editingVoucher = ref(null)
const viewingVoucher = ref(null)
const loading = ref(false)
const saving = ref(false)

const filters = ref({
  search: '',
  status: '',
  perPage: 15,
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
})

const voucherForm = ref({
  code: '',
  discount: null,
  discount_percentage: null,
  start_date: '',
  end_date: '',
  usage_limit: null,
  applicable_tour_ids: [],
})

const errors = ref({})

// Utility functions
const formatCurrency = (amount) => {
  if (!amount) return '0 VND'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('vi-VN')
}

let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchVouchers()
  }, 500)
}

// API functions
const getApiHeaders = () => {
  const token = localStorage.getItem('adminToken')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

const fetchStatistics = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/vouchers/statistics`, {
      headers: getApiHeaders(),
    })
    statistics.value = response.data.data
  } catch (err) {
    console.error('Lỗi khi lấy thống kê:', err)
  }
}

const fetchVouchers = async (page = 1) => {
  loading.value = true
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const params = new URLSearchParams({
      page: page,
      per_page: filters.value.perPage,
    })

    if (filters.value.search) {
      params.append('search', filters.value.search)
    }
    if (filters.value.status) {
      params.append('status', filters.value.status)
    }

    const response = await axios.get(`${apiBaseUrl}/vouchers?${params}`, {
      headers: getApiHeaders(),
    })

    vouchers.value = response.data.data
    pagination.value = response.data.pagination
  } catch (err) {
    console.error('Lỗi khi lấy danh sách voucher:', err)
    alert('Không thể tải danh sách voucher.')
  } finally {
    loading.value = false
  }
}

const fetchTours = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/tours`, {
      headers: getApiHeaders(),
    })
    tours.value = response.data.data
  } catch (err) {
    console.error('Lỗi khi lấy danh sách tour:', err)
  }
}

const saveVoucher = async () => {
  saving.value = true
  errors.value = {}

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = { ...voucherForm.value }

    if (editingVoucher.value) {
      await axios.put(`${apiBaseUrl}/vouchers/${editingVoucher.value.id}`, payload, {
        headers: getApiHeaders(),
      })
      alert('Cập nhật voucher thành công!')
    } else {
      await axios.post(`${apiBaseUrl}/vouchers`, payload, {
        headers: getApiHeaders(),
      })
      alert('Tạo voucher thành công!')
    }

    await refreshData()
    cancelForm()
  } catch (err) {
    console.error('Lỗi khi lưu voucher:', err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      alert('Lưu voucher thất bại.')
    }
  } finally {
    saving.value = false
  }
}

const editVoucher = (voucher) => {
  editingVoucher.value = voucher
  voucherForm.value = {
    code: voucher.code,
    discount: voucher.discount,
    discount_percentage: voucher.discount_percentage,
    start_date: voucher.start_date?.split('T')[0] || '',
    end_date: voucher.end_date?.split('T')[0] || '',
    usage_limit: voucher.usage_limit,
    applicable_tour_ids: voucher.applicable_tour_ids || [],
  }
  errors.value = {}
}

const toggleVoucher = async (voucher) => {
  const action = voucher.is_active ? 'vô hiệu hóa' : 'kích hoạt'
  if (confirm(`Bạn có chắc muốn ${action} voucher này?`)) {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      await axios.post(
        `${apiBaseUrl}/vouchers/${voucher.id}/toggle`,
        {},
        {
          headers: getApiHeaders(),
        },
      )
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} voucher thành công!`)
      await refreshData()
    } catch (err) {
      console.error('Lỗi khi thay đổi trạng thái voucher:', err)
      alert('Thay đổi trạng thái thất bại.')
    }
  }
}

const deleteVoucher = async (id) => {
  if (confirm('Bạn có chắc muốn xóa voucher này? Hành động này không thể hoàn tác.')) {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      await axios.delete(`${apiBaseUrl}/vouchers/${id}`, {
        headers: getApiHeaders(),
      })
      alert('Xóa voucher thành công!')
      await refreshData()
    } catch (err) {
      console.error('Lỗi khi xóa voucher:', err)
      if (err.response?.status === 400) {
        alert('Không thể xóa voucher đã được sử dụng.')
      } else {
        alert('Xóa voucher thất bại.')
      }
    }
  }
}

const viewVoucherDetails = (voucher) => {
  viewingVoucher.value = voucher
}

const cancelForm = () => {
  showCreateForm.value = false
  editingVoucher.value = null
  voucherForm.value = {
    code: '',
    discount: null,
    discount_percentage: null,
    start_date: '',
    end_date: '',
    usage_limit: null,
    applicable_tour_ids: [],
  }
  errors.value = {}
}

const changePage = (page) => {
  fetchVouchers(page)
}

const refreshData = async () => {
  await Promise.all([fetchStatistics(), fetchVouchers(pagination.value.current_page), fetchTours()])
}

// Mount
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
