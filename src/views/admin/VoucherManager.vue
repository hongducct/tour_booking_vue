<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useTourStore } from '@/stores/tourStore'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import { mdiTicket } from '@mdi/js'
import VoucherStatistics from '@/components/admin/voucher/VoucherStatistics.vue'
import VoucherFilters from '@/components/admin/voucher/VoucherFilters.vue'
import VoucherTable from '@/components/admin/voucher/VoucherTable.vue'
import VoucherFormModal from '@/components/admin/voucher/VoucherFormModal.vue'
import VoucherDetailsModal from '@/components/admin/voucher/VoucherDetailsModal.vue'
import VoucherLoadingSkeleton from '@/components/admin/voucher/VoucherLoadingSkeleton.vue'

// Khởi tạo store
const tourStore = useTourStore()

// Reactive data
const vouchers = ref([])
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
const initialLoading = ref(true) // Loading lần đầu
const statisticsLoading = ref(true) // Loading thống kê

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

// Ngăn scroll phần nền khi modal mở
const toggleBodyScroll = (disable) => {
  document.body.style.overflow = disable ? 'hidden' : 'auto'
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
    statisticsLoading.value = true
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/vouchers/statistics`, {
      headers: getApiHeaders(),
    })
    statistics.value = response.data.data
  } catch (err) {
    console.error('Lỗi khi lấy thống kê:', err)
  } finally {
    statisticsLoading.value = false
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
    console.log('errors:', errors.value)
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
  // Load tours in the background without blocking
  tourStore.refreshTours().catch((err) => {
    alert('Không thể tải danh sách tour.')
  })
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
  toggleBodyScroll(true)
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
  toggleBodyScroll(false)
}

const openCreateForm = () => {
  showCreateForm.value = true
  // Load tours in the background without blocking
  tourStore.refreshTours().catch((err) => {
    alert('Không thể tải danh sách tour.')
  })
}

// Đóng modal chi tiết và khôi phục scroll
watch(viewingVoucher, (newValue) => {
  toggleBodyScroll(!!newValue)
})

// Đóng modal form và khôi phục scroll
watch([showCreateForm, editingVoucher], ([newShowCreateForm, newEditingVoucher]) => {
  const isModalOpen = newShowCreateForm || newEditingVoucher
  toggleBodyScroll(isModalOpen)
})

const changePage = (page) => {
  fetchVouchers(page)
}

const refreshData = async () => {
  await Promise.all([fetchStatistics(), fetchVouchers(pagination.value.current_page)])
}

// Mount
onMounted(async () => {
  initialLoading.value = true
  await refreshData()
  initialLoading.value = false
})

// Khôi phục scroll khi component bị hủy
onUnmounted(() => {
  toggleBodyScroll(false)
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Quản lý Voucher" :icon="mdiTicket" main>
        <BaseButton label="Tạo Voucher" color="success" @click="openCreateForm" />
      </SectionTitleLineWithButton>

      <!-- Statistics với Voucher Loading Skeleton -->
      <VoucherLoadingSkeleton v-if="statisticsLoading && initialLoading" type="stats" />
      <VoucherStatistics v-else :statistics="statistics" :format-currency="formatCurrency" />

      <!-- Filters - Không cần loading vì load nhanh -->
      <VoucherFilters
        :filters="filters"
        :debounce-search="debounceSearch"
        :fetch-vouchers="fetchVouchers"
        :refresh-data="refreshData"
      />

      <!-- Table với Voucher Loading Skeleton -->
      <VoucherLoadingSkeleton v-if="loading && initialLoading" type="table" :rows="5" :columns="7" />
      <VoucherTable
        v-else
        :vouchers="vouchers"
        :pagination="pagination"
        :loading="loading"
        :format-currency="formatCurrency"
        :format-date="formatDate"
        :view-voucher-details="viewVoucherDetails"
        :edit-voucher="editVoucher"
        :toggle-voucher="toggleVoucher"
        :delete-voucher="deleteVoucher"
        :change-page="changePage"
      />

      <!-- Form Modal với Loading Overlay -->
      <VoucherFormModal
        :show-create-form="showCreateForm"
        :editing-voucher="editingVoucher"
        :voucher-form="voucherForm"
        :errors="errors"
        :saving="saving"
        :tour-store="tourStore"
        :save-voucher="saveVoucher"
        :cancel-form="cancelForm"
      />

      <!-- Details Modal -->
      <VoucherDetailsModal
        :viewing-voucher="viewingVoucher"
        :format-currency="formatCurrency"
        :format-date="formatDate"
        :format-date-time="formatDateTime"
        @close="viewingVoucher = null"
      />

      <!-- Loading Overlay khi đang save -->
      <VoucherLoadingSkeleton v-if="saving" overlay loading-text="Đang lưu voucher..." />
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
