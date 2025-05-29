<script setup>
import { ref } from 'vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'

defineProps({
  filters: {
    type: Object,
    required: true,
  },
  debounceSearch: {
    type: Function,
    required: true,
  },
  fetchVouchers: {
    type: Function,
    required: true,
  },
  refreshData: {
    type: Function,
    required: true,
  },
})
</script>

<template>
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
</template>
