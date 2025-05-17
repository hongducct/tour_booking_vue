<template>
  <section class="relative">
    <Swiper
      :modules="[Navigation, Autoplay]"
      navigation
      :autoplay="{ delay: 3000 }"
      :loop="true"
      class="home-slider"
    >
      <SwiperSlide v-for="(slide, index) in slides" :key="index">
        <div
          class="relative bg-cover bg-center h-[600px] flex items-center justify-center"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="relative z-10 text-center text-white px-4">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">{{ slide.title }}</h2>
            <p class="mb-6 max-w-2xl mx-auto">{{ slide.description }}</p>
            <a
              :href="slide.link"
              class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold transition"
            >
              {{ slide.buttonText }}
            </a>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const slides = [
  {
    image: 'https://bookingtour.vn/templates/themes/images/slider-banner-1.jpg?v3',
    title: 'BẠN ĐANG MUỐN ĐI ĐÂU?',
    description: 'Hãy để BookingTour tư vấn cho bạn chuyến đi tuyệt vời nhất!',
    buttonText: 'XEM TIẾP',
    link: 'https://bookingtour.vn/destination',
  },
  {
    image: 'https://bookingtour.vn/templates/themes/images/slider-banner-2.jpg?v3',
    title: "EXPERIENCE THE NATURE'S BEAUTY",
    description:
      'Taciti quasi, sagittis excepteur hymenaeos, id temporibus hic proident ullam, eaque donec delectus tempor consectetur nunc.',
    buttonText: 'CONTINUE READING',
    link: 'https://bookingtour.vn/destination',
  },
]
</script>

<style scoped>
.home-slider {
  height: 600px;
}
</style>
