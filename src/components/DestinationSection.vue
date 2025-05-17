<template>
  <div class="container">
    <div class="section-heading">
      <div class="row items-end">
        <div class="col-lg-7">
          <h5 class="dash-style">POPULAR DESTINATION</h5>
          <h2>ĐIỂM ĐẾN HÀNG ĐẦU</h2>
        </div>
        <div class="col-lg-5">
          <div class="section-disc">
            Khám phá ngay các tour, hoạt động du lịch và địa điểm tham quan cho hành trình du lịch
            của bạn.
          </div>
        </div>
      </div>
    </div>

    <div class="destination-inner destination-three-column">
      <div class="row">
        <div class="col-lg-7">
          <div class="row">
            <div class="col-sm-6" v-for="(dest, index) in destinations.slice(0, 2)" :key="index">
              <DestinationItem :destination="dest" />
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="row">
            <div
              class="col-md-6 col-xl-12"
              v-for="(dest, index) in destinations.slice(2)"
              :key="index"
            >
              <DestinationItem :destination="dest" />
            </div>
          </div>
        </div>
      </div>

      <div class="btn-wrap text-center mt-6">
        <a href="https://bookingtour.vn/destination" class="button-primary"> XEM THÊM ĐIỂM ĐẾN </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import DestinationItem from './DestinationItem.vue'

const destinations = [
  {
    name: 'Trung Quốc',
    img: 'https://cdn.bookingtour.vn/thumb_x322x555/upload/2024/09/21/trung-quoc3.jpg',
    url: 'https://bookingtour.vn/destination/trung-quoc.html',
    title: 'Tour Du Lịch Trung Quốc: Khám Phá Đất Nước Hùng Vĩ',
    rating: '100%',
  },
  {
    name: 'Nhật Bản',
    img: 'https://cdn.bookingtour.vn/thumb_x322x555/upload/2024/09/10/nhat-ban1.jpg',
    url: 'https://bookingtour.vn/destination/nhat-ban.html',
    title: 'Tour du lịch Nhật Bản 2024',
    rating: '90%',
  },
  {
    name: 'Hàn Quốc',
    img: 'https://cdn.bookingtour.vn/thumb_x460x255/upload/2022/12/06/han-quoc7.jpg',
    url: 'https://bookingtour.vn/destination/han-quoc.html',
    title: 'Tour du lịch Hàn Quốc',
    rating: '100%',
  },
  {
    name: 'Thái Lan',
    img: 'https://cdn.bookingtour.vn/thumb_x460x255/upload/2024/09/10/thai-lan2.jpg',
    url: 'https://bookingtour.vn/destination/thai-lan.html',
    title: 'TOUR DU LỊCH THÁI LAN',
    rating: '100%',
  },
]
</script>

<style scoped>
/* Optional: add your scoped styles here if needed */
</style>
