<script setup>
import { computed } from 'vue'
import CardBox from '@/components/admin/CardBox.vue'
import {
  GiftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  statistics: {
    type: Object,
    required: true,
  },
  formatCurrency: {
    type: Function,
    required: true,
  },
})

const statsConfig = computed(() => [
  {
    key: 'total_vouchers',
    label: 'Tổng Voucher',
    value: props.statistics.total_vouchers || 0,
    icon: GiftIcon,
    color: 'blue',
    bgGradient: 'from-blue-50 to-blue-100',
    textColor: 'text-blue-600',
    iconBg: 'bg-blue-500',
    description: 'Tổng số voucher trong hệ thống',
    trend: null,
  },
  {
    key: 'active_vouchers',
    label: 'Đang Hoạt Động',
    value: props.statistics.active_vouchers || 0,
    icon: CheckCircleIcon,
    color: 'green',
    bgGradient: 'from-green-50 to-green-100',
    textColor: 'text-green-600',
    iconBg: 'bg-green-500',
    description: 'Voucher đang có thể sử dụng',
    trend: 'up',
  },
  {
    key: 'expired_vouchers',
    label: 'Đã Hết Hạn',
    value: props.statistics.expired_vouchers || 0,
    icon: XCircleIcon,
    color: 'red',
    bgGradient: 'from-red-50 to-red-100',
    textColor: 'text-red-600',
    iconBg: 'bg-red-500',
    description: 'Voucher đã quá hạn sử dụng',
    trend: 'down',
  },
  {
    key: 'upcoming_vouchers',
    label: 'Sắp Diễn Ra',
    value: props.statistics.upcoming_vouchers || 0,
    icon: ClockIcon,
    color: 'yellow',
    bgGradient: 'from-yellow-50 to-yellow-100',
    textColor: 'text-yellow-600',
    iconBg: 'bg-yellow-500',
    description: 'Voucher chưa đến thời gian áp dụng',
    trend: null,
  },
  {
    key: 'total_usage',
    label: 'Lượt Sử Dụng',
    value: props.statistics.total_usage || 0,
    icon: UsersIcon,
    color: 'purple',
    bgGradient: 'from-purple-50 to-purple-100',
    textColor: 'text-purple-600',
    iconBg: 'bg-purple-500',
    description: 'Tổng số lần voucher được sử dụng',
    trend: 'up',
  },
  {
    key: 'total_discount_given',
    label: 'Tổng Giảm Giá',
    value: formatCurrencyCompact(props.statistics.total_discount_given || 0),
    rawValue: props.statistics.total_discount_given || 0,
    icon: CurrencyDollarIcon,
    color: 'indigo',
    bgGradient: 'from-indigo-50 to-indigo-100',
    textColor: 'text-indigo-600',
    iconBg: 'bg-indigo-500',
    description: 'Tổng số tiền đã giảm giá cho khách hàng',
    trend: 'up',
  },
])

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Hàm format currency compact cho mobile
const formatCurrencyCompact = (amount) => {
  if (!amount) return '0₫'

  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1) + ' tỷ'
  }
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' tr'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'K'
  }
  return amount.toLocaleString('vi-VN') + '₫'
}

const getPercentage = (value, total) => {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

const activePercentage = computed(() =>
  getPercentage(props.statistics.active_vouchers, props.statistics.total_vouchers),
)

const expiredPercentage = computed(() =>
  getPercentage(props.statistics.expired_vouchers, props.statistics.total_vouchers),
)
</script>

<template>
  <div class="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
    <!-- Main Statistics Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
      <div
        v-for="stat in statsConfig"
        :key="stat.key"
        class="group hover:scale-105 transition-all duration-300 ease-out"
      >
        <CardBox
          :class="`relative overflow-hidden h-full bg-gradient-to-br ${stat.bgGradient} border-0 shadow-sm hover:shadow-md`"
        >
          <!-- Background Pattern -->
          <div class="absolute top-0 right-0 -mt-2 sm:-mt-4 -mr-2 sm:-mr-4 opacity-10">
            <component :is="stat.icon" class="w-12 sm:w-20 h-12 sm:h-20" />
          </div>

          <!-- Content -->
          <div class="relative p-3 sm:p-6">
            <!-- Header with Icon -->
            <div class="flex items-center justify-between mb-2 sm:mb-4">
              <div
                :class="`p-2 sm:p-3 rounded-lg ${stat.iconBg} shadow-sm group-hover:shadow-md transition-shadow duration-300`"
              >
                <component :is="stat.icon" class="w-4 sm:w-6 h-4 sm:h-6 text-white" />
              </div>

              <!-- Trend Indicator -->
              <div v-if="stat.trend" class="flex items-center space-x-1">
                <ArrowTrendingUpIcon
                  v-if="stat.trend === 'up'"
                  class="w-3 sm:w-4 h-3 sm:h-4 text-green-500"
                />
                <ArrowTrendingDownIcon
                  v-if="stat.trend === 'down'"
                  class="w-3 sm:w-4 h-3 sm:h-4 text-red-500"
                />
              </div>
            </div>

            <!-- Value -->
            <div class="space-y-1">
              <div
                :class="`text-lg sm:text-2xl xl:text-3xl font-bold ${stat.textColor} group-hover:scale-105 transition-transform duration-300 break-words leading-tight`"
                :title="
                  stat.key === 'total_discount_given' ? props.formatCurrency(stat.rawValue) : null
                "
              >
                {{ typeof stat.value === 'string' ? stat.value : formatNumber(stat.value) }}
              </div>
              <div class="text-xs sm:text-sm font-medium text-gray-600 truncate">
                {{ stat.label }}
              </div>
              <div class="text-xs text-gray-500 leading-relaxed hidden sm:block">
                {{ stat.description }}
              </div>
            </div>

            <!-- Progress Bar for certain stats -->
            <div
              v-if="stat.key === 'active_vouchers' && statistics.total_vouchers > 0"
              class="mt-2 sm:mt-3"
            >
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span class="hidden sm:inline">Tỉ lệ hoạt động</span>
                <span class="sm:hidden">Hoạt động</span>
                <span>{{ activePercentage }}%</span>
              </div>
              <div class="w-full bg-white bg-opacity-50 rounded-full h-1.5 sm:h-2">
                <div
                  class="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${activePercentage}%` }"
                ></div>
              </div>
            </div>

            <div
              v-if="stat.key === 'expired_vouchers' && statistics.total_vouchers > 0"
              class="mt-2 sm:mt-3"
            >
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span class="hidden sm:inline">Tỉ lệ hết hạn</span>
                <span class="sm:hidden">Hết hạn</span>
                <span>{{ expiredPercentage }}%</span>
              </div>
              <div class="w-full bg-white bg-opacity-50 rounded-full h-1.5 sm:h-2">
                <div
                  class="bg-red-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${expiredPercentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </CardBox>
      </div>
    </div>

    <!-- Summary Cards Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
      <!-- Voucher Status Overview -->
      <CardBox
        class="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center space-x-3 mb-3 sm:mb-4">
          <div class="p-2 bg-gray-600 rounded-lg">
            <ChartBarIcon class="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-800">Tổng Quan Trạng Thái</h3>
        </div>

        <div class="space-y-2 sm:space-y-3">
          <!-- Active Rate -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-green-500 rounded-full"></div>
              <span class="text-xs sm:text-sm text-gray-600">Hoạt động</span>
            </div>
            <div class="text-xs sm:text-sm font-semibold text-gray-800">
              {{ statistics.active_vouchers }}/{{ statistics.total_vouchers }}
              <span class="text-green-600">({{ activePercentage }}%)</span>
            </div>
          </div>

          <!-- Expired Rate -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-red-500 rounded-full"></div>
              <span class="text-xs sm:text-sm text-gray-600">Hết hạn</span>
            </div>
            <div class="text-xs sm:text-sm font-semibold text-gray-800">
              {{ statistics.expired_vouchers }}/{{ statistics.total_vouchers }}
              <span class="text-red-600">({{ expiredPercentage }}%)</span>
            </div>
          </div>

          <!-- Upcoming -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-xs sm:text-sm text-gray-600">Sắp diễn ra</span>
            </div>
            <div class="text-xs sm:text-sm font-semibold text-gray-800">
              {{ statistics.upcoming_vouchers }}/{{ statistics.total_vouchers }}
              <span class="text-yellow-600"
                >({{
                  getPercentage(statistics.upcoming_vouchers, statistics.total_vouchers)
                }}%)</span
              >
            </div>
          </div>
        </div>
      </CardBox>

      <!-- Usage Statistics -->
      <CardBox
        class="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center space-x-3 mb-3 sm:mb-4">
          <div class="p-2 bg-purple-600 rounded-lg">
            <UsersIcon class="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-800">Thống Kê Sử Dụng</h3>
        </div>

        <div class="space-y-3 sm:space-y-4">
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
              {{ formatNumber(statistics.total_usage) }}
            </div>
            <div class="text-xs sm:text-sm text-gray-600">Tổng lượt sử dụng</div>
          </div>

          <div class="text-center pt-2 sm:pt-3 border-t border-purple-200">
            <div class="text-xs sm:text-sm text-gray-600">Trung bình mỗi voucher</div>
            <div class="text-base sm:text-lg font-semibold text-purple-600">
              {{
                statistics.total_vouchers > 0
                  ? Math.round(statistics.total_usage / statistics.total_vouchers)
                  : 0
              }}
              <span class="text-xs sm:text-sm text-gray-500">lượt</span>
            </div>
          </div>
        </div>
      </CardBox>

      <!-- Revenue Impact -->
      <CardBox
        class="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center space-x-3 mb-3 sm:mb-4">
          <div class="p-2 bg-indigo-600 rounded-lg">
            <CurrencyDollarIcon class="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-800">Tác Động Doanh Thu</h3>
        </div>

        <div class="space-y-3 sm:space-y-4">
          <div class="text-center">
            <div
              class="text-xl sm:text-2xl font-bold text-indigo-600 mb-1 break-words"
              :title="formatCurrency(statistics.total_discount_given)"
            >
              {{ formatCurrencyCompact(statistics.total_discount_given) }}
            </div>
            <div class="text-xs sm:text-sm text-gray-600">Tổng giá trị giảm</div>
          </div>

          <div class="text-center pt-2 sm:pt-3 border-t border-indigo-200">
            <div class="text-xs sm:text-sm text-gray-600">Trung bình mỗi lượt sử dụng</div>
            <div class="text-base sm:text-lg font-semibold text-indigo-600 break-words">
              {{
                statistics.total_usage > 0
                  ? formatCurrencyCompact(
                      Math.round(statistics.total_discount_given / statistics.total_usage),
                    )
                  : formatCurrencyCompact(0)
              }}
            </div>
          </div>
        </div>
      </CardBox>
    </div>
  </div>
</template>
