<script setup>
import {
  XMarkIcon,
  TagIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  TicketIcon,
  UsersIcon,
  ReceiptPercentIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps({
  viewingVoucher: {
    type: Object,
    default: null,
  },
  formatCurrency: {
    type: Function,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
  formatDateTime: {
    type: Function,
    required: true,
  },
})

defineEmits(['close'])

// Computed properties for voucher status
const voucherStatus = computed(() => {
  if (!props.viewingVoucher) return null

  const now = new Date()
  const startDate = new Date(props.viewingVoucher.start_date)
  const endDate = new Date(props.viewingVoucher.end_date)

  if (now < startDate) {
    return { type: 'upcoming', label: 'Sắp Diễn Ra', color: 'yellow' }
  } else if (now > endDate) {
    return { type: 'expired', label: 'Đã Hết Hạn', color: 'red' }
  } else {
    return { type: 'active', label: 'Đang Hoạt Động', color: 'green' }
  }
})

const usagePercentage = computed(() => {
  if (!props.viewingVoucher?.usage_limit) return 0
  return Math.round((props.viewingVoucher.usage_count / props.viewingVoucher.usage_limit) * 100)
})

const getStatusIcon = (status) => {
  switch (status.type) {
    case 'active':
      return CheckCircleIcon
    case 'expired':
      return XCircleIcon
    case 'upcoming':
      return ClockIcon
    default:
      return ExclamationTriangleIcon
  }
}

const getStatusColors = (status) => {
  switch (status.color) {
    case 'green':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: 'text-green-600',
        border: 'border-green-200',
      }
    case 'red':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: 'text-red-600',
        border: 'border-red-200',
      }
    case 'yellow':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: 'text-yellow-600',
        border: 'border-yellow-200',
      }
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: 'text-gray-600',
        border: 'border-gray-200',
      }
  }
}
</script>

<template>
  <div
    v-if="viewingVoucher"
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-blue-600 rounded-lg">
            <TicketIcon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900">Chi tiết Voucher</h3>
            <p class="text-sm text-gray-600 font-mono">{{ viewingVoucher.code }}</p>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="flex items-center space-x-3">
          <div
            :class="`flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border`"
          >
            {{ viewingVoucher.applicable_tour_ids.length > 0
              ? `${viewingVoucher.applicable_tour_ids.length} Tour áp dụng`
              : 'Áp dụng tất cả các tour' }}
          </div>
          <div
            v-if="voucherStatus"
            :class="`flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border ${getStatusColors(voucherStatus).bg} ${getStatusColors(voucherStatus).text} ${getStatusColors(voucherStatus).border}`"
          >
            <component
              :is="getStatusIcon(voucherStatus)"
              :class="`w-4 h-4 mr-1.5 ${getStatusColors(voucherStatus).icon}`"
            />
            {{ voucherStatus.label }}
          </div>

          <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
          >
            <XMarkIcon class="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- Main Info -->
          <div class="xl:col-span-2 space-y-6">
            <!-- Basic Information Card -->
            <div
              class="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm"
            >
              <div class="flex items-center space-x-2 mb-4">
                <TagIcon class="w-5 h-5 text-blue-600" />
                <h4 class="text-lg font-semibold text-gray-900">Thông tin cơ bản</h4>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Voucher Code -->
                <div class="bg-white rounded-lg p-4 border border-gray-100">
                  <div class="flex items-center space-x-2 mb-2">
                    <TicketIcon class="w-4 h-4 text-gray-500" />
                    <span class="text-sm font-medium text-gray-600">Mã Voucher</span>
                  </div>
                  <div
                    class="font-mono text-lg font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    {{ viewingVoucher.code }}
                  </div>
                </div>

                <!-- Discount Value -->
                <div class="bg-white rounded-lg p-4 border border-gray-100">
                  <div class="flex items-center space-x-2 mb-2">
                    <CurrencyDollarIcon class="w-4 h-4 text-green-500" />
                    <span class="text-sm font-medium text-gray-600">Giá trị giảm</span>
                  </div>
                  <div class="text-lg font-bold">
                    <span v-if="viewingVoucher.discount" class="text-green-600">
                      {{ formatCurrency(viewingVoucher.discount) }}
                    </span>
                    <span v-else-if="viewingVoucher.discount_percentage" class="text-green-600">
                      {{ viewingVoucher.discount_percentage }}%
                    </span>
                    <span v-else class="text-gray-400">Chưa thiết lập</span>
                  </div>
                </div>

                <!-- Start Date -->
                <div class="bg-white rounded-lg p-4 border border-gray-100">
                  <div class="flex items-center space-x-2 mb-2">
                    <CalendarIcon class="w-4 h-4 text-blue-500" />
                    <span class="text-sm font-medium text-gray-600">Ngày bắt đầu</span>
                  </div>
                  <div class="text-lg font-semibold text-gray-900">
                    {{ formatDate(viewingVoucher.start_date) }}
                  </div>
                </div>

                <!-- End Date -->
                <div class="bg-white rounded-lg p-4 border border-gray-100">
                  <div class="flex items-center space-x-2 mb-2">
                    <CalendarIcon class="w-4 h-4 text-red-500" />
                    <span class="text-sm font-medium text-gray-600">Ngày kết thúc</span>
                  </div>
                  <div class="text-lg font-semibold text-gray-900">
                    {{ formatDate(viewingVoucher.end_date) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Usage Statistics Card -->
            <div
              class="bg-gradient-to-br from-white to-purple-50 rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm"
            >
              <div class="flex items-center space-x-2 mb-4">
                <ChartBarIcon class="w-5 h-5 text-purple-600" />
                <h4 class="text-lg font-semibold text-gray-900">Thống kê sử dụng</h4>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- Usage Limit -->
                <div class="text-center p-4 bg-white rounded-lg border border-gray-100">
                  <div class="flex items-center justify-center space-x-2 mb-2">
                    <UsersIcon class="w-4 h-4 text-gray-500" />
                    <span class="text-sm font-medium text-gray-600">Giới hạn</span>
                  </div>
                  <div class="text-2xl font-bold text-gray-900">
                    {{ viewingVoucher.usage_limit || '∞' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ viewingVoucher.usage_limit ? 'lượt' : 'Không giới hạn' }}
                  </div>
                </div>

                <!-- Usage Count -->
                <div class="text-center p-4 bg-white rounded-lg border border-gray-100">
                  <div class="flex items-center justify-center space-x-2 mb-2">
                    <ReceiptPercentIcon class="w-4 h-4 text-blue-500" />
                    <span class="text-sm font-medium text-gray-600">Đã sử dụng</span>
                  </div>
                  <div class="text-2xl font-bold text-blue-600">
                    {{ viewingVoucher.usage_count }}
                  </div>
                  <div class="text-xs text-gray-500">lượt</div>
                </div>

                <!-- Remaining -->
                <div class="text-center p-4 bg-white rounded-lg border border-gray-100">
                  <div class="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircleIcon class="w-4 h-4 text-green-500" />
                    <span class="text-sm font-medium text-gray-600">Còn lại</span>
                  </div>
                  <div class="text-2xl font-bold text-green-600">
                    {{
                      viewingVoucher.usage_limit
                        ? viewingVoucher.usage_limit - viewingVoucher.usage_count
                        : '∞'
                    }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ viewingVoucher.usage_limit ? 'lượt' : 'Không giới hạn' }}
                  </div>
                </div>
              </div>

              <!-- Usage Progress Bar -->
              <div v-if="viewingVoucher.usage_limit" class="mt-4">
                <div class="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Tỷ lệ sử dụng</span>
                  <span>{{ usagePercentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all duration-500 ease-out"
                    :class="
                      usagePercentage >= 90
                        ? 'bg-red-500'
                        : usagePercentage >= 70
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    "
                    :style="{ width: `${usagePercentage}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Usage History -->
          <div class="xl:col-span-1">
            <div
              class="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm h-full"
            >
              <div class="flex items-center space-x-2 mb-4">
                <ClipboardDocumentListIcon class="w-5 h-5 text-indigo-600" />
                <h4 class="text-lg font-semibold text-gray-900">Lịch sử sử dụng</h4>
              </div>

              <!-- Empty State -->
              <div
                v-if="viewingVoucher.usages.length === 0"
                class="flex flex-col items-center justify-center py-8 text-center"
              >
                <div
                  class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                >
                  <ClipboardDocumentListIcon class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-gray-500 text-sm">Chưa có lượt sử dụng nào</p>
                <p class="text-gray-400 text-xs mt-1">
                  Lịch sử sẽ hiển thị khi voucher được sử dụng
                </p>
              </div>

              <!-- Usage List -->
              <div v-else class="space-y-3 max-h-96 overflow-y-auto pr-2">
                <div
                  v-for="(usage, index) in viewingVoucher.usages"
                  :key="usage.id"
                  class="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <!-- Usage Header -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center"
                      >
                        <span class="text-xs font-bold text-blue-600">{{ index + 1 }}</span>
                      </div>
                      <span class="text-sm font-medium text-gray-900">Sử dụng #{{ usage.id }}</span>
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatDateTime(usage.created_at) }}
                    </div>
                  </div>

                  <!-- Usage Details -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center space-x-2">
                        <TicketIcon class="w-3 h-3 text-gray-400" />
                        <span class="text-gray-600">Booking ID:</span>
                      </div>
                      <span class="font-mono text-gray-900">#{{ usage.booking_id }}</span>
                    </div>

                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center space-x-2">
                        <UserIcon class="w-3 h-3 text-gray-400" />
                        <span class="text-gray-600">User ID:</span>
                      </div>
                      <span class="font-mono text-gray-900">#{{ usage.user_id }}</span>
                    </div>

                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center space-x-2">
                        <CurrencyDollarIcon class="w-3 h-3 text-green-500" />
                        <span class="text-gray-600">Giảm giá:</span>
                      </div>
                      <span class="font-semibold text-green-600">
                        {{ formatCurrency(usage.discount_applied) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.fixed.inset-0.bg-black.bg-opacity-50.z-50 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
