<template>
  <section class="best-section">
    <div class="container">
      <div class="row">
        <!-- Cột trái: Tiêu đề + ảnh chính -->
        <div class="col-lg-5">
          <div class="section-heading">
            <h5 class="dash-style">OUR TOUR GALLERY</h5>
            <h2>BEST TRAVELER'S SHARED PHOTOS</h2>
            <p>Những bức ảnh đẹp trên hành trình TOUR được khách hàng chia sẻ.</p>
          </div>
          <figure class="gallery-img">
            <a href="https://bookingtour.vn/destination/thai-lan.html">
              <h4>TOUR Thái Lan</h4>
            </a>
            <a href="https://bookingtour.vn/destination/thai-lan.html">
              <img
                src="https://cdn.bookingtour.vn/thumb_x455x330/upload/2024/09/10/thai-lan2.jpg"
                alt="Tour Thái Lan"
              />
            </a>
          </figure>
        </div>

        <!-- Cột phải: Danh sách ảnh nhỏ -->
        <div class="col-lg-7">
          <div class="row">
            <div
              class="col-sm-6"
              v-for="(image, index) in galleryImages.slice(0, 2)"
              :key="'small-' + index"
            >
              <GalleryImage :src="image.src" :alt="image.alt" />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <GalleryImage :src="galleryImages[2].src" :alt="galleryImages[2].alt" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import GalleryImage from './GalleryImage.vue'

const galleryImages = [
  {
    src: 'https://cdn.bookingtour.vn/thumb_x315x250/upload/admin/2024/09/25/anh_dep_tour_thai_lan3-19075.jpg',
    alt: 'Ảnh đẹp Tour Thái Lan 3',
  },
  {
    src: 'https://cdn.bookingtour.vn/thumb_x315x250/upload/admin/2024/09/25/anh_dep_tour_thai_lan1-19071.jpg',
    alt: 'Ảnh đẹp Tour Thái Lan 1',
  },
  {
    src: 'https://cdn.bookingtour.vn/thumb_x655x350/upload/admin/2024/09/25/anh_dep_tour_thai_lan2-19075.jpg',
    alt: 'Ảnh đẹp Tour Thái Lan 2',
  },
]
</script>

<style scoped>
/* Nếu cần style thêm cho section */
</style>
