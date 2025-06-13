<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiViewDashboardOutline" title="Dashboard" main />

      <!-- Loading Skeleton for Stats Cards -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div class="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Modern Stats Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Lượt truy cập hôm nay</p>
              <p class="text-3xl font-bold mt-2">{{ todayVisits.toLocaleString() }}</p>
            </div>
            <div class="p-3 bg-blue-400 bg-opacity-30 rounded-full">
              <BaseIcon :path="mdiEye" size="24" />
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Đăng ký mới hôm nay</p>
              <p class="text-3xl font-bold mt-2">{{ todayRegistrations }}</p>
            </div>
            <div class="p-3 bg-green-400 bg-opacity-30 rounded-full">
              <BaseIcon :path="mdiAccountPlus" size="24" />
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Doanh thu hôm nay</p>
              <p class="text-3xl font-bold mt-2">{{ todayRevenue.toLocaleString('vi-VN') }} ₫</p>
            </div>
            <div class="p-3 bg-purple-400 bg-opacity-30 rounded-full">
              <BaseIcon :path="mdiCurrencyUsd" size="24" />
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm font-medium">Đơn đặt tour mới</p>
              <p class="text-3xl font-bold mt-2">{{ newBookings }}</p>
            </div>
            <div class="p-3 bg-orange-400 bg-opacity-30 rounded-full">
              <BaseIcon :path="mdiTicketConfirmation" size="24" />
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Tab Navigation -->
      <div class="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="switchTab(tab.id)"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 relative',
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <BaseIcon :path="tab.icon" size="20" class="inline mr-2" />
              {{ tab.name }}
              <span v-if="tabLoading[tab.id]" class="absolute -top-1 -right-1">
                <div
                  class="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
                ></div>
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-8">
            <div v-if="tabLoading.overview" class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-xl p-6 animate-pulse">
                <div class="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div class="h-80 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div
                class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h3 class="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <BaseIcon :path="mdiChartLine" size="20" class="mr-2 text-indigo-500" />
                  Doanh thu hàng tháng (VNĐ)
                </h3>
                <ApexChart
                  type="line"
                  :options="revenueChartOptions"
                  :series="revenueSeries"
                  height="350"
                />
              </div>

              <div
                class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h3 class="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <BaseIcon :path="mdiChartBar" size="20" class="mr-2 text-blue-500" />
                  Số lượng đặt tour theo loại hình
                </h3>
                <ApexChart
                  type="bar"
                  :options="bookingTypeChartOptions"
                  :series="bookingTypeSeries"
                  height="350"
                />
              </div>
            </div>
          </div>

          <!-- Revenue Tab -->
          <div v-if="activeTab === 'revenue'" class="space-y-6">
            <div v-if="tabLoading.revenue" class="bg-gray-50 rounded-xl p-6 animate-pulse">
              <div class="h-6 bg-gray-200 rounded mb-6 w-1/4"></div>
              <div class="h-96 bg-gray-200 rounded"></div>
            </div>
            <div
              v-else
              class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 class="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <BaseIcon :path="mdiCurrencyUsd" size="24" class="mr-3 text-green-500" />
                Biểu đồ doanh thu chi tiết
              </h3>
              <ApexChart
                type="line"
                :options="enhancedRevenueChartOptions"
                :series="revenueSeries"
                height="400"
              />
            </div>
          </div>

          <!-- Bookings Tab -->
          <div v-if="activeTab === 'bookings'" class="space-y-6">
            <div v-if="tabLoading.bookings" class="bg-gray-50 rounded-xl p-6 animate-pulse">
              <div class="h-6 bg-gray-200 rounded mb-6 w-1/4"></div>
              <div class="h-96 bg-gray-200 rounded"></div>
            </div>
            <div
              v-else
              class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 class="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <BaseIcon :path="mdiTicketConfirmation" size="24" class="mr-3 text-orange-500" />
                Thống kê đặt tour
              </h3>
              <ApexChart
                type="bar"
                :options="bookingTypeChartOptions"
                :series="bookingTypeSeries"
                height="400"
              />
            </div>
          </div>

          <!-- Visits Tab -->
          <div v-if="activeTab === 'visits'" class="space-y-6">
            <div v-if="tabLoading.visits" class="bg-gray-50 rounded-xl p-6 animate-pulse">
              <div class="h-6 bg-gray-200 rounded mb-6 w-1/4"></div>
              <div class="h-96 bg-gray-200 rounded"></div>
            </div>
            <div
              v-else
              class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 class="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <BaseIcon :path="mdiEye" size="24" class="mr-3 text-blue-500" />
                Lượt truy cập trang web (7 ngày gần nhất)
              </h3>
              <ApexChart
                type="area"
                :options="websiteVisitsChartOptions"
                :series="websiteVisitsSeries"
                height="400"
              />
            </div>
          </div>

          <!-- Registrations Tab -->
          <div v-if="activeTab === 'registrations'" class="space-y-6">
            <div v-if="tabLoading.registrations" class="bg-gray-50 rounded-xl p-6 animate-pulse">
              <div class="h-6 bg-gray-200 rounded mb-6 w-1/4"></div>
              <div class="h-96 bg-gray-200 rounded"></div>
            </div>
            <div
              v-else
              class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 class="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <BaseIcon :path="mdiAccountPlus" size="24" class="mr-3 text-green-500" />
                Đăng ký tài khoản mới (7 ngày gần nhất)
              </h3>
              <ApexChart
                type="line"
                :options="newRegistrationsChartOptions"
                :series="newRegistrationsSeries"
                height="400"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import BaseIcon from '@/components/admin/BaseIcon.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import ApexChart from 'vue3-apexcharts'
import {
  mdiViewDashboardOutline,
  mdiEye,
  mdiAccountPlus,
  mdiCurrencyUsd,
  mdiTicketConfirmation,
  mdiChartLine,
  mdiChartBar,
  mdiViewGrid,
} from '@mdi/js'

// --- Loading States ---
const isLoading = ref(true)
const dataFetched = ref(false)
const activeTab = ref('overview')

// --- Tab Loading States ---
const tabLoading = ref({
  overview: false,
  revenue: false,
  bookings: false,
  visits: false,
  registrations: false,
})

// --- Data Cache ---
const dataCache = ref({
  bookings: null,
  users: null,
  fetchedAt: null,
})

// --- Tab Configuration ---
const tabs = ref([
  { id: 'overview', name: 'Tổng quan', icon: mdiViewGrid },
  { id: 'revenue', name: 'Doanh thu', icon: mdiCurrencyUsd },
  { id: 'bookings', name: 'Đặt tour', icon: mdiTicketConfirmation },
  { id: 'visits', name: 'Lượt truy cập', icon: mdiEye },
  { id: 'registrations', name: 'Đăng ký mới', icon: mdiAccountPlus },
])

// --- Reactive State for Quick Statistics ---
const todayVisits = ref(1256) // Mock data - load instantly
const todayRegistrations = ref(0)
const todayRevenue = ref(0)
const newBookings = ref(0)

// --- Reactive State for Charts ---
const revenueSeries = ref([{ name: 'Doanh thu', data: Array(12).fill(0) }])
const websiteVisitsSeries = ref([
  { name: 'Lượt truy cập', data: [150, 230, 180, 280, 220, 310, 250] }, // Mock data - instant
])
const newRegistrationsSeries = ref([{ name: 'Đăng ký mới', data: Array(7).fill(0) }])
const bookingTypeSeries = ref([{ name: 'Số lượng', data: [] }])

// --- Chart Options (computed for better performance) ---
const baseChartConfig = {
  chart: {
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
      },
    },
    background: 'transparent',
  },
  theme: { mode: 'light' },
  grid: {
    borderColor: '#E5E7EB',
    strokeDashArray: 5,
  },
  tooltip: {
    theme: 'light',
    style: {
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
    },
  },
}

const revenueChartOptions = computed(() => ({
  ...baseChartConfig,
  chart: { ...baseChartConfig.chart, type: 'line' },
  xaxis: {
    categories: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ],
    labels: {
      style: { colors: '#6B7280', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
    },
  },
  yaxis: {
    title: {
      text: 'Doanh thu (VNĐ)',
      style: { color: '#6B7280', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
    },
    labels: {
      formatter: (value) => value.toLocaleString('vi-VN'),
      style: { colors: '#6B7280', fontSize: '11px' },
    },
  },
  colors: ['#6366f1'],
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 6, strokeWidth: 3, strokeColors: '#fff', hover: { size: 8 } },
}))

const enhancedRevenueChartOptions = computed(() => ({
  ...revenueChartOptions.value,
  stroke: { curve: 'smooth', width: 4 },
  markers: { size: 8, strokeWidth: 4, strokeColors: '#fff', hover: { size: 10 } },
}))

const websiteVisitsChartOptions = computed(() => ({
  ...baseChartConfig,
  chart: { ...baseChartConfig.chart, type: 'area' },
  xaxis: {
    categories: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'],
    title: {
      text: 'Ngày',
      style: { color: '#6B7280', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
    },
    labels: { style: { colors: '#6B7280', fontSize: '12px' } },
  },
  yaxis: {
    title: {
      text: 'Số lượt truy cập',
      style: { color: '#6B7280', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
    },
    labels: { style: { colors: '#6B7280', fontSize: '11px' } },
  },
  colors: ['#38bdf8'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.3,
      type: 'vertical',
      opacityFrom: 0.8,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  stroke: { curve: 'smooth', width: 2 },
}))

const newRegistrationsChartOptions = ref({
  ...baseChartConfig,
  chart: { ...baseChartConfig.chart, type: 'line' },
  xaxis: {
    categories: [],
    title: {
      text: 'Ngày',
      style: { color: '#6B7280', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
    },
    labels: { style: { colors: '#6B7280', fontSize: '12px' } },
  },
  yaxis: {
    title: {
      text: 'Số lượng đăng ký',
      style: { color: '#6B7280', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
    },
    labels: { style: { colors: '#6B7280', fontSize: '11px' } },
  },
  colors: ['#16a34a'],
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 6, strokeWidth: 3, strokeColors: '#fff' },
})

const bookingTypeChartOptions = ref({
  ...baseChartConfig,
  chart: { ...baseChartConfig.chart, type: 'bar' },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      borderRadius: 8,
      dataLabels: { position: 'top' },
    },
  },
  colors: ['#3b82f6'],
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: { fontSize: '12px', colors: ['#374151'], fontWeight: 600 },
  },
  tooltip: {
    ...baseChartConfig.tooltip,
    y: {
      formatter: function (val) {
        return val + ' đặt tour'
      },
    },
  },
})

// --- Helper Functions ---
const getStartOfDayVietnam = (date) => {
  const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
  vietnamDate.setUTCHours(0, 0, 0, 0)
  return new Date(vietnamDate.getTime() - 7 * 60 * 60 * 1000)
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.hongducct.id.vn';
const shouldRefreshCache = () => {
  if (!dataCache.value.fetchedAt) return true
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
  return dataCache.value.fetchedAt < fiveMinutesAgo
}

// --- Optimized Data Fetching ---
const fetchInitialData = async () => {
  try {
    const adminToken = localStorage.getItem('adminToken')
    
    // Fetch only essential data first
    const bookingsPromise = axios.get(`${apiBaseUrl}/bookings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })

    // Get today's data immediately from first page of users
    const firstPageUsersPromise = axios.get(`${apiBaseUrl}/users?page=1`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })

    const [bookingsResponse, firstPageUsersResponse] = await Promise.all([
      bookingsPromise,
      firstPageUsersPromise,
    ])

    const bookings = bookingsResponse.data
    const firstPageUsers = firstPageUsersResponse.data.data

    // Process quick stats with available data
    const today = getStartOfDayVietnam(new Date())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    // Today's Revenue (confirmed bookings only)
    todayRevenue.value = bookings
      .filter(
        (booking) =>
          booking.status === 'confirmed' &&
          new Date(booking.created_at) >= today &&
          new Date(booking.created_at) < tomorrow,
      )
      .reduce((sum, booking) => sum + parseFloat(booking.total_price), 0)

    // New Bookings Today
    newBookings.value = bookings.filter(
      (booking) => new Date(booking.created_at) >= today && new Date(booking.created_at) < tomorrow,
    ).length

    // Approximate today's registrations from first page
    todayRegistrations.value = firstPageUsers.filter(
      (user) => new Date(user.created_at) >= today && new Date(user.created_at) < tomorrow,
    ).length

    // Store in cache
    dataCache.value = {
      bookings,
      users: firstPageUsers,
      totalPages: firstPageUsersResponse.data.meta.last_page,
      fetchedAt: Date.now(),
    }

    // Process overview charts immediately
    processOverviewData(bookings, firstPageUsers)

    isLoading.value = false
    dataFetched.value = true

    // Fetch remaining user data in background
    if (firstPageUsersResponse.data.meta.last_page > 1) {
      fetchRemainingUsers(adminToken, firstPageUsersResponse.data.meta.last_page)
    }
  } catch (error) {
    console.error('Error fetching initial data:', error)
    isLoading.value = false
  }
}

const fetchRemainingUsers = async (adminToken, lastPage) => {
  try {
    const remainingUsersPromises = []
    for (let page = 2; page <= lastPage; page++) {
      remainingUsersPromises.push(
        axios.get(`${apiBaseUrl}/users?page=${page}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
      )
    }

    const remainingUsersResponses = await Promise.all(remainingUsersPromises)
    const allRemainingUsers = remainingUsersResponses.flatMap((response) => response.data.data)

    const allUsers = [...dataCache.value.users, ...allRemainingUsers]
    dataCache.value.users = allUsers

    // Update registration count with complete data
    const today = getStartOfDayVietnam(new Date())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    todayRegistrations.value = allUsers.filter(
      (user) => new Date(user.created_at) >= today && new Date(user.created_at) < tomorrow,
    ).length

    // Process registration chart data
    processRegistrationData(allUsers)
  } catch (error) {
    console.error('Error fetching remaining users:', error)
  }
}

const processOverviewData = (bookings, users) => {
  // Process Revenue Chart (Monthly Revenue for 2025)
  const monthlyRevenue = Array(12).fill(0)
  bookings
    .filter(
      (booking) =>
        booking.status === 'confirmed' && new Date(booking.created_at).getFullYear() === 2025,
    )
    .forEach((booking) => {
      const month = new Date(booking.created_at).getMonth()
      monthlyRevenue[month] += parseFloat(booking.total_price)
    })
  revenueSeries.value = [{ name: 'Doanh thu', data: monthlyRevenue }]

  // Process Booking Type Chart
  const travelTypeCounts = {}
  bookings.forEach((booking) => {
    const travelTypeName = booking.bookable.travel_type_name || 'Không xác định'
    travelTypeCounts[travelTypeName] = (travelTypeCounts[travelTypeName] || 0) + 1
  })

  const travelTypeLabels = Object.keys(travelTypeCounts)
  const travelTypeData = Object.values(travelTypeCounts)

  bookingTypeSeries.value = [{ name: 'Số lượng', data: travelTypeData }]
  bookingTypeChartOptions.value = {
    ...bookingTypeChartOptions.value,
    xaxis: {
      categories: travelTypeLabels,
      title: {
        text: 'Loại hình',
        style: { color: '#6B7280', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
      },
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
    },
    yaxis: {
      title: {
        text: 'Số lượng đặt',
        style: { color: '#6B7280', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
      },
      labels: { style: { colors: '#6B7280', fontSize: '11px' } },
    },
  }
}

const processRegistrationData = (users) => {
  // Process New Registrations Chart (Last 7 Days)
  const last7Days = []
  const todayDate = new Date()
  for (let i = 6; i >= 0; i--) {
    const day = new Date(todayDate.getTime() - i * 24 * 60 * 60 * 1000)
    last7Days.push(day.toISOString().split('T')[0])
  }

  const registrationsPerDay = Array(7).fill(0)
  users.forEach((user) => {
    const createdDate = new Date(user.created_at).toISOString().split('T')[0]
    const index = last7Days.indexOf(createdDate)
    if (index !== -1) {
      registrationsPerDay[index]++
    }
  })

  newRegistrationsSeries.value = [{ name: 'Đăng ký mới', data: registrationsPerDay }]
  newRegistrationsChartOptions.value.xaxis.categories = last7Days.map((date) => {
    const d = new Date(date)
    return `Ngày ${d.getDate()}/${d.getMonth() + 1}`
  })
}

// --- Tab Switching with Lazy Loading ---
const switchTab = async (tabId) => {
  if (activeTab.value === tabId) return

  activeTab.value = tabId

  // If data is not fully loaded and we need it for this tab, show loading
  if (!dataFetched.value && ['registrations'].includes(tabId)) {
    tabLoading.value[tabId] = true

    // Wait for complete data if needed
    if (tabId === 'registrations' && dataCache.value.users) {
      // Wait a bit to see if background fetch completes
      setTimeout(() => {
        tabLoading.value[tabId] = false
      }, 1000)
    }
  }
}

// --- Initialize ---
onMounted(() => {
  fetchInitialData()
})
</script>

<style scoped>
/* Loading animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Enhanced shadows */
.shadow-lg {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Responsive improvements */
@media (max-width: 640px) {
  .grid-cols-1 {
    gap: 1rem;
  }
  .text-3xl {
    font-size: 1.5rem;
  }
  .p-6 {
    padding: 1rem;
  }
}
</style>
