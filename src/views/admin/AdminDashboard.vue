<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiViewDashboardOutline" title="Dashboard" main />
      <CardBox class="flex flex-col gap-6">
        <p class="text-gray-700">Chào mừng bạn đến với bảng điều khiển quản trị.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-md shadow-sm p-4">
            <div class="flex items-center">
              <div class="text-indigo-500 mr-3">
                <Icon :path="mdiEye" size="24" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-500">Lượt truy cập hôm nay</h4>
                <span class="text-xl font-bold text-gray-800">1,256</span>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-md shadow-sm p-4">
            <div class="flex items-center">
              <div class="text-green-500 mr-3">
                <Icon :path="mdiAccountPlus" size="24" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-500">Đăng ký mới hôm nay</h4>
                <span class="text-xl font-bold text-gray-800">85</span>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-md shadow-sm p-4">
            <div class="flex items-center">
              <div class="text-blue-500 mr-3">
                <Icon :path="mdiCurrencyUsd" size="24" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-500">Doanh thu hôm nay</h4>
                <span class="text-xl font-bold text-gray-800">3,500,000 VNĐ</span>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-md shadow-sm p-4">
            <div class="flex items-center">
              <div class="text-yellow-500 mr-3">
                <Icon :path="mdiTicketConfirmation" size="24" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-500">Đơn đặt tour mới</h4>
                <span class="text-xl font-bold text-gray-800">28</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <aside class="w-64 bg-gray-800 text-gray-300 p-4 rounded-md shadow-md">
            <h2 class="text-xl font-semibold mb-4 text-white">Bảng điều khiển</h2>
            <nav>
              <ul>
                <li class="mb-2"><a href="#" class="hover:text-indigo-500">Thống kê chung</a></li>
                <li class="mb-2"><a href="#" class="hover:text-indigo-500">Biểu đồ doanh thu</a></li>
                <li class="mb-2"><a href="#" class="hover:text-indigo-500">Lượng đặt tour</a></li>
                <li class="mb-2"><a href="#" class="hover:text-indigo-500">Lượt truy cập</a></li>
                <li class="mb-2"><a href="#" class="hover:text-indigo-500">Đăng ký mới</a></li>
              </ul>
            </nav>
          </aside>
          <main class="flex-1 bg-gray-100 p-4 rounded-md shadow-md flex flex-col gap-4">
            <section class="bg-white rounded-md shadow-sm p-6">
              <h3 class="text-lg font-semibold mb-3 text-gray-800">Doanh thu hàng tháng (VNĐ)</h3>
              <ApexChart type="line" :options="revenueChartOptions" :series="revenueSeries" height="350" />
            </section>
            <section class="bg-white rounded-md shadow-sm p-6">
              <h3 class="text-lg font-semibold mb-3 text-gray-800">Lượt truy cập trang web (7 ngày gần nhất)</h3>
              <ApexChart type="area" :options="websiteVisitsChartOptions" :series="websiteVisitsSeries" height="300" />
            </section>
          </main>
        </div>

        <div class="bg-white rounded-md shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-3 text-gray-800">Số lượng đặt tour theo loại hình</h3>
          <ApexChart type="bar" :options="bookingTypeChartOptions" :series="bookingTypeSeries" height="350" />
        </div>

        <div class="bg-white rounded-md shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-3 text-gray-800">Đăng ký tài khoản mới (7 ngày gần nhất)</h3>
          <ApexChart type="line" :options="newRegistrationsChartOptions" :series="newRegistrationsSeries" height="300" />
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/admin/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue';
import CardBox from '@/components/admin/CardBox.vue';
// import Icon from '@mdi/vue'; // Import the Icon component
import { ref } from 'vue';
import ApexChart from 'vue3-apexcharts';
import {
  mdiViewDashboardOutline,
  mdiEye,
  mdiAccountPlus,
  mdiCurrencyUsd,
  mdiTicketConfirmation,
} from '@mdi/js'; // Import more icons

// --- Quick Statistics Data ---
// In a real application, these would come from your backend
const todayVisits = ref(1256);
const todayRegistrations = ref(85);
const todayRevenue = ref(3500000);
const newBookings = ref(28);

// --- Revenue Chart Data and Options ---
const revenueSeries = ref([
  {
    name: 'Doanh thu',
    data: [
      25000000, 32000000, 28000000, 40000000, 35000000, 45000000,
      38000000, 42000000, 39000000, 48000000, 41000000, 50000000,
    ],
  },
]);

const revenueChartOptions = ref({
  chart: {
    type: 'line',
    toolbar: { show: false },
  },
  xaxis: {
    categories: [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
    ],
  },
  yaxis: {
    title: {
      text: 'Doanh thu (VNĐ)',
    },
    labels: {
      formatter: (value) => {
        return value.toLocaleString('vi-VN');
      },
    },
  },
  colors: ['#6366f1'],
  stroke: {
    curve: 'smooth',
  },
  markers: {
    size: 4,
  },
});

// --- Website Visits Chart Data and Options ---
const websiteVisitsSeries = ref([
  {
    name: 'Lượt truy cập',
    data: [150, 230, 180, 280, 220, 310, 250],
  },
]);

const websiteVisitsChartOptions = ref({
  chart: {
    type: 'area',
    toolbar: { show: false },
  },
  xaxis: {
    categories: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'],
    title: {
      text: 'Ngày',
    },
  },
  yaxis: {
    title: {
      text: 'Số lượt truy cập',
    },
  },
  colors: ['#38bdf8'], // Sky blue color
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100],
    },
  },
});

// --- New Registrations Chart Data and Options ---
const newRegistrationsSeries = ref([
  {
    name: 'Đăng ký mới',
    data: [25, 35, 20, 40, 30, 45, 38],
  },
]);

const newRegistrationsChartOptions = ref({
  chart: {
    type: 'line',
    toolbar: { show: false },
  },
  xaxis: {
    categories: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'],
    title: {
      text: 'Ngày',
    },
  },
  yaxis: {
    title: {
      text: 'Số lượng đăng ký',
    },
  },
  colors: ['#16a34a'], // Green color
  stroke: {
    curve: 'smooth',
  },
  markers: {
    size: 4,
  },
});

// --- Booking Type Chart Data and Options ---
const bookingTypeSeries = ref([
  {
    name: 'Số lượng',
    data: [120, 85, 150, 95],
  },
]);

const bookingTypeChartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false },
  },
  xaxis: {
    categories: ['Tour trong nước', 'Tour nước ngoài', 'Khách sạn', 'Vé máy bay'],
    title: {
      text: 'Loại hình',
    },
  },
  yaxis: {
    title: {
      text: 'Số lượng đặt',
    },
  },
  colors: ['#3b82f6'],
});
</script>