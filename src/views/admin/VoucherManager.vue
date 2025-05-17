<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Quản lý Voucher" icon="mdiTicket" main>
        <BaseButton label="Tạo Voucher" color="success" @click="showCreateForm = true" />
      </SectionTitleLineWithButton>

      <CardBox>
        <table class="w-full">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Giảm giá</th>
              <th>Thời hạn</th>
              <th>Sử dụng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="voucher in vouchers" :key="voucher.id">
              <td>{{ voucher.code }}</td>
              <td>
                {{
                  voucher.discount ? `${voucher.discount} VND` : `${voucher.discount_percentage}%`
                }}
              </td>
              <td>{{ voucher.start_date }} - {{ voucher.end_date }}</td>
              <td>{{ voucher.usage_count }} / {{ voucher.usage_limit || '∞' }}</td>
              <td>
                <BaseButton label="Sửa" size="sm" color="info" @click="editVoucher(voucher)" />
                <BaseButton
                  label="Xóa"
                  size="sm"
                  color="danger"
                  @click="deleteVoucher(voucher.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </CardBox>

      <!-- Create/Edit Form (Modal or Section) -->
      <CardBox v-if="showCreateForm || editingVoucher">
        <form @submit.prevent="saveVoucher">
          <BaseInput v-model="voucherForm.code" label="Mã Voucher" required />
          <BaseInput
            v-model.number="voucherForm.discount"
            label="Giảm giá cố định (VND)"
            type="number"
          />
          <BaseInput
            v-model.number="voucherForm.discount_percentage"
            label="Giảm giá (%)"
            type="number"
          />
          <BaseInput v-model="voucherForm.start_date" label="Ngày bắt đầu" type="date" required />
          <BaseInput v-model="voucherForm.end_date" label="Ngày kết thúc" type="date" required />
          <BaseInput
            v-model.number="voucherForm.usage_limit"
            label="Giới hạn sử dụng"
            type="number"
          />
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Áp dụng cho tour</label>
            <select
              v-model="voucherForm.applicable_tour_ids"
              multiple
              class="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option v-for="tour in tours" :value="tour.id" :key="tour.id">{{ tour.name }}</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <BaseButton label="Hủy" color="gray" @click="cancelForm" />
            <BaseButton
              type="submit"
              color="success"
              :label="editingVoucher ? 'Cập nhật' : 'Tạo'"
            />
          </div>
        </form>
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
import BaseInput from '@/components/admin/BaseInput.vue'
import BaseButton from '@/components/admin/BaseButton.vue'

const vouchers = ref([])
const tours = ref([])
const showCreateForm = ref(false)
const editingVoucher = ref(null)
const voucherForm = ref({
  code: '',
  discount: null,
  discount_percentage: null,
  start_date: '',
  end_date: '',
  usage_limit: null,
  applicable_tour_ids: [],
})

const fetchVouchers = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const [voucherRes, tourRes] = await Promise.all([
      axios.get(`${apiBaseUrl}/vouchers`),
      axios.get(`${apiBaseUrl}/tours`),
    ])
    vouchers.value = voucherRes.data.data
    tours.value = tourRes.data.data
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err)
    alert('Không thể tải dữ liệu.')
  }
}

const saveVoucher = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const payload = {
      ...voucherForm.value,
      applicable_tour_ids: JSON.stringify(voucherForm.value.applicable_tour_ids),
    }
    if (editingVoucher.value) {
      await axios.put(`${apiBaseUrl}/vouchers/${editingVoucher.value.id}`, payload)
    } else {
      await axios.post(`${apiBaseUrl}/vouchers`, payload)
    }
    fetchVouchers()
    cancelForm()
    alert('Lưu voucher thành công!')
  } catch (err) {
    console.error('Lỗi khi lưu voucher:', err)
    alert('Lưu voucher thất bại.')
  }
}

const editVoucher = (voucher) => {
  editingVoucher.value = voucher
  voucherForm.value = {
    code: voucher.code,
    discount: voucher.discount,
    discount_percentage: voucher.discount_percentage,
    start_date: voucher.start_date,
    end_date: voucher.end_date,
    usage_limit: voucher.usage_limit,
    applicable_tour_ids: voucher.applicable_tour_ids ? JSON.parse(voucher.applicable_tour_ids) : [],
  }
}

const deleteVoucher = async (id) => {
  if (confirm('Bạn có chắc muốn xóa voucher này?')) {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      await axios.delete(`${apiBaseUrl}/vouchers/${id}`)
      fetchVouchers()
      alert('Xóa voucher thành công!')
    } catch (err) {
      console.error('Lỗi khi xóa voucher:', err)
      alert('Xóa voucher thất bại.')
    }
  }
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
}

onMounted(fetchVouchers)
</script>
