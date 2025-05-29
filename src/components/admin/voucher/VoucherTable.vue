<script setup>
import { computed } from 'vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  GiftIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  vouchers: {
    type: Array,
    required: true,
  },
  pagination: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  formatCurrency: {
    type: Function,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
  viewVoucherDetails: {
    type: Function,
    required: true,
  },
  editVoucher: {
    type: Function,
    required: true,
  },
  toggleVoucher: {
    type: Function,
    required: true,
  },
  deleteVoucher: {
    type: Function,
    required: true,
  },
  changePage: {
    type: Function,
    required: true,
  },
})

const getStatusConfig = (voucher) => {
  if (voucher.is_expired) {
    return {
      label: 'Hết hạn',
      classes: 'bg-red-50 text-red-700 border-red-200',
      icon: ClockIcon,
    }
  }
  if (voucher.is_active) {
    return {
      label: 'Hoạt động',
      classes: 'bg-green-50 text-green-700 border-green-200',
      icon: CheckCircleIcon,
    }
  }
  return {
    label: 'Sắp diễn ra',
    classes: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: ClockIcon,
  }
}

const getDiscountDisplay = (voucher) => {
  if (voucher.discount) {
    return {
      value: props.formatCurrency(voucher.discount),
      type: 'Giảm tiền',
      classes: 'text-green-600 bg-green-50',
      icon: CurrencyDollarIcon,
    }
  }
  if (voucher.discount_percentage) {
    return {
      value: `${voucher.discount_percentage}%`,
      type: 'Giảm %',
      classes: 'text-blue-600 bg-blue-50',
      icon: TagIcon,
    }
  }
  return {
    value: 'Chưa thiết lập',
    type: '',
    classes: 'text-gray-400',
    icon: null,
  }
}

const getUsagePercentage = (voucher) => {
  if (!voucher.usage_limit) return 0
  return Math.min((voucher.usage_count / voucher.usage_limit) * 100, 100)
}

const paginationInfo = computed(() => {
  const start = (props.pagination.current_page - 1) * props.pagination.per_page + 1
  const end = Math.min(
    props.pagination.current_page * props.pagination.per_page,
    props.pagination.total,
  )
  return { start, end }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Desktop Table View -->
    <div class="hidden lg:block">
      <CardBox class="overflow-hidden shadow-sm border border-gray-200">
        <div class="overflow-x-auto">
          <table class="w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  <div class="flex items-center space-x-2">
                    <GiftIcon class="w-4 h-4" />
                    <span>Voucher</span>
                  </div>
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  <div class="flex items-center space-x-2">
                    <CurrencyDollarIcon class="w-4 h-4" />
                    <span>Giảm giá</span>
                  </div>
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  <div class="flex items-center space-x-2">
                    <CalendarIcon class="w-4 h-4" />
                    <span>Thời hạn</span>
                  </div>
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  <div class="flex items-center space-x-2">
                    <UsersIcon class="w-4 h-4" />
                    <span>Sử dụng</span>
                  </div>
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Tour áp dụng
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-12">
                  <div class="flex flex-col items-center justify-center space-y-3">
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"
                    ></div>
                    <span class="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="vouchers.length === 0">
                <td colspan="7" class="px-6 py-12">
                  <div class="text-center">
                    <GiftIcon class="mx-auto h-12 w-12 text-gray-300" />
                    <h3 class="mt-4 text-sm font-medium text-gray-900">Không có voucher nào</h3>
                    <p class="mt-2 text-sm text-gray-500">
                      Không tìm thấy voucher nào phù hợp với bộ lọc hiện tại.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-else
                v-for="voucher in vouchers"
                :key="voucher.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <!-- Voucher Info -->
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div class="font-semibold text-gray-900 text-sm">{{ voucher.code }}</div>
                    <div class="text-xs text-gray-500">ID: {{ voucher.id }}</div>
                  </div>
                </td>

                <!-- Discount -->
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <component
                      :is="getDiscountDisplay(voucher).icon"
                      v-if="getDiscountDisplay(voucher).icon"
                      class="w-4 h-4 flex-shrink-0"
                      :class="getDiscountDisplay(voucher).classes"
                    />
                    <div>
                      <div
                        class="font-semibold text-sm"
                        :class="getDiscountDisplay(voucher).classes"
                      >
                        {{ getDiscountDisplay(voucher).value }}
                      </div>
                      <div v-if="getDiscountDisplay(voucher).type" class="text-xs text-gray-500">
                        {{ getDiscountDisplay(voucher).type }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Date Range -->
                <td class="px-6 py-4">
                  <div class="text-sm space-y-1">
                    <div class="text-gray-900 font-medium">
                      {{ formatDate(voucher.start_date) }}
                    </div>
                    <div class="text-gray-500">đến {{ formatDate(voucher.end_date) }}</div>
                  </div>
                </td>

                <!-- Usage -->
                <td class="px-6 py-4">
                  <div class="space-y-2">
                    <div class="text-sm">
                      <span class="font-semibold text-gray-900">{{ voucher.usage_count }}</span>
                      <span class="text-gray-500"> / {{ voucher.usage_limit || '∞' }}</span>
                    </div>
                    <div v-if="voucher.usage_limit" class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${getUsagePercentage(voucher)}%` }"
                      ></div>
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <component :is="getStatusConfig(voucher).icon" class="w-4 h-4 flex-shrink-0" />
                    <span
                      class="px-3 py-1 rounded-full text-xs font-medium border"
                      :class="getStatusConfig(voucher).classes"
                    >
                      {{ getStatusConfig(voucher).label }}
                    </span>
                  </div>
                </td>

                <!-- Applicable Tours -->
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <span
                      v-if="
                        !voucher.applicable_tour_ids || voucher.applicable_tour_ids.length === 0
                      "
                      class="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium"
                    >
                      Tất cả tour
                    </span>
                    <span
                      v-else
                      class="text-blue-600 bg-blue-100 px-2 py-1 rounded-md text-xs font-medium"
                    >
                      {{ voucher.applicable_tour_ids.length }} tour
                    </span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click="viewVoucherDetails(voucher)"
                      class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                      title="Xem chi tiết"
                    >
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="editVoucher(voucher)"
                      class="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors duration-150"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="toggleVoucher(voucher)"
                      class="p-2 rounded-lg transition-colors duration-150"
                      :class="
                        voucher.is_active
                          ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                      "
                      :title="voucher.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'"
                    >
                      <XCircleIcon v-if="voucher.is_active" class="w-4 h-4" />
                      <CheckCircleIcon v-else class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteVoucher(voucher.id)"
                      :disabled="voucher.usage_count > 0"
                      class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-150 disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      title="Xóa voucher"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBox>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden space-y-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="flex flex-col items-center space-y-3">
          <div
            class="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"
          ></div>
          <span class="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="vouchers.length === 0" class="text-center py-12">
        <GiftIcon class="mx-auto h-12 w-12 text-gray-300" />
        <h3 class="mt-4 text-sm font-medium text-gray-900">Không có voucher nào</h3>
        <p class="mt-2 text-sm text-gray-500">
          Không tìm thấy voucher nào phù hợp với bộ lọc hiện tại.
        </p>
      </div>

      <!-- Mobile Cards -->
      <div v-else class="space-y-4">
        <CardBox
          v-for="voucher in vouchers"
          :key="voucher.id"
          class="p-4 hover:shadow-md transition-shadow duration-200"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <GiftIcon class="w-5 h-5 text-gray-400" />
                <h3 class="font-semibold text-gray-900">{{ voucher.code }}</h3>
              </div>
              <p class="text-xs text-gray-500">ID: {{ voucher.id }}</p>
            </div>
            <div class="flex items-center space-x-1">
              <component :is="getStatusConfig(voucher).icon" class="w-4 h-4 flex-shrink-0" />
              <span
                class="px-2 py-1 rounded-full text-xs font-medium border"
                :class="getStatusConfig(voucher).classes"
              >
                {{ getStatusConfig(voucher).label }}
              </span>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Discount -->
            <div class="space-y-1">
              <div class="flex items-center space-x-1 text-xs text-gray-500">
                <CurrencyDollarIcon class="w-3 h-3" />
                <span>Giảm giá</span>
              </div>
              <div class="flex items-center space-x-2">
                <component
                  :is="getDiscountDisplay(voucher).icon"
                  v-if="getDiscountDisplay(voucher).icon"
                  class="w-4 h-4 flex-shrink-0"
                  :class="getDiscountDisplay(voucher).classes"
                />
                <span class="font-semibold text-sm" :class="getDiscountDisplay(voucher).classes">
                  {{ getDiscountDisplay(voucher).value }}
                </span>
              </div>
            </div>

            <!-- Usage -->
            <div class="space-y-1">
              <div class="flex items-center space-x-1 text-xs text-gray-500">
                <UsersIcon class="w-3 h-3" />
                <span>Sử dụng</span>
              </div>
              <div class="space-y-1">
                <div class="text-sm">
                  <span class="font-semibold text-gray-900">{{ voucher.usage_count }}</span>
                  <span class="text-gray-500"> / {{ voucher.usage_limit || '∞' }}</span>
                </div>
                <div v-if="voucher.usage_limit" class="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    class="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                    :style="{ width: `${getUsagePercentage(voucher)}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Date Range -->
            <div class="space-y-1">
              <div class="flex items-center space-x-1 text-xs text-gray-500">
                <CalendarIcon class="w-3 h-3" />
                <span>Thời hạn</span>
              </div>
              <div class="text-sm space-y-0.5">
                <div class="text-gray-900 font-medium">{{ formatDate(voucher.start_date) }}</div>
                <div class="text-gray-500 text-xs">đến {{ formatDate(voucher.end_date) }}</div>
              </div>
            </div>

            <!-- Applicable Tours -->
            <div class="space-y-1">
              <div class="flex items-center space-x-1 text-xs text-gray-500">
                <TagIcon class="w-3 h-3" />
                <span>Tour áp dụng</span>
              </div>
              <div>
                <span
                  v-if="!voucher.applicable_tour_ids || voucher.applicable_tour_ids.length === 0"
                  class="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium"
                >
                  Tất cả tour
                </span>
                <span
                  v-else
                  class="text-blue-600 bg-blue-100 px-2 py-1 rounded-md text-xs font-medium"
                >
                  {{ voucher.applicable_tour_ids.length }} tour
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-2 pt-3 border-t">
            <button
              @click="viewVoucherDetails(voucher)"
              class="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-150 text-sm"
            >
              <EyeIcon class="w-4 h-4" />
              <span>Chi tiết</span>
            </button>
            <button
              @click="editVoucher(voucher)"
              class="flex items-center space-x-1 px-3 py-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors duration-150 text-sm"
            >
              <PencilIcon class="w-4 h-4" />
              <span>Sửa</span>
            </button>
            <button
              @click="toggleVoucher(voucher)"
              class="flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-150 text-sm"
              :class="
                voucher.is_active
                  ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                  : 'text-green-600 hover:text-green-800 hover:bg-green-50'
              "
            >
              <XCircleIcon v-if="voucher.is_active" class="w-4 h-4" />
              <CheckCircleIcon v-else class="w-4 h-4" />
              <span>{{ voucher.is_active ? 'Vô hiệu' : 'Kích hoạt' }}</span>
            </button>
            <button
              @click="deleteVoucher(voucher.id)"
              :disabled="voucher.usage_count > 0"
              class="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-150 disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed text-sm"
            >
              <TrashIcon class="w-4 h-4" />
              <span>Xóa</span>
            </button>
          </div>
        </CardBox>
      </div>
    </div>

    <!-- Enhanced Pagination -->
    <div
      v-if="pagination.total > 0"
      class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6"
    >
      <div class="text-sm text-gray-600 order-2 sm:order-1">
        Hiển thị <span class="font-semibold text-gray-900">{{ paginationInfo.start }}</span> -
        <span class="font-semibold text-gray-900">{{ paginationInfo.end }}</span>
        trong tổng số
        <span class="font-semibold text-gray-900">{{ pagination.total }}</span> voucher
      </div>

      <div class="flex items-center space-x-3 order-1 sm:order-2">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page <= 1"
          class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors duration-150"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          <span class="hidden sm:inline">Trước</span>
        </button>

        <div class="flex items-center space-x-1">
          <span
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-lg"
          >
            {{ pagination.current_page }}
          </span>
          <span class="text-sm text-gray-500">/</span>
          <span class="text-sm text-gray-700 font-medium">{{ pagination.last_page }}</span>
        </div>

        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page >= pagination.last_page"
          class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors duration-150"
        >
          <span class="hidden sm:inline">Sau</span>
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
