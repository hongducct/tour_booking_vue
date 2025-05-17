<template>
  <section class="package-section">
    <div class="container">
      <!-- Tiêu đề section -->
      <div class="section-heading text-center">
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <h5 class="dash-style">EXPLORE GREAT PLACES</h5>
            <h2>NHỮNG TOUR ĐƯỢC YÊU THÍCH</h2>
            <p>Các tour được đặt nhiều nhất trong tháng này.</p>
          </div>
        </div>
      </div>

      <!-- Danh sách tour -->
      <div class="package-inner">
        <div class="row">
          <div class="col-lg-4 col-md-6" v-for="(tour, index) in tours" :key="index">
            <TourCard :tour="tour" />
          </div>
        </div>

        <!-- Nút xem thêm -->
        <div class="btn-wrap text-center mt-6">
          <a href="https://bookingtour.vn/tour" class="button-primary"> XEM THÊM GÓI TOUR </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import TourCard from './TourCard.vue'

const tours = [
  {
    name: 'Tour Hạ Long',
    img: 'https://cdn.bookingtour.vn/thumb_x460x255/upload/2024/09/21/ha-long.jpg',
    url: 'https://bookingtour.vn/tour/ha-long.html',
    price: '3,500,000 VNĐ',
    duration: '3 ngày 2 đêm',
  },
  {
    name: 'Tour Đà Nẵng',
    img: 'https://cdn.bookingtour.vn/thumb_x460x255/upload/2024/09/10/da-nang.jpg',
    url: 'https://bookingtour.vn/tour/da-nang.html',
    price: '4,200,000 VNĐ',
    duration: '4 ngày 3 đêm',
  },
  {
    name: 'Tour Phú Quốc',
    img: 'https://cdn.bookingtour.vn/thumb_x460x255/upload/2024/09/10/phu-quoc.jpg',
    url: 'https://bookingtour.vn/tour/phu-quoc.html',
    price: '5,000,000 VNĐ',
    duration: '3 ngày 2 đêm',
  },
]
</script>

<style scoped>
/* Tuỳ chọn: thêm style riêng nếu cần */
</style>
