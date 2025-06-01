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
            <button
              @click="goToRoute(slide.route)"
              class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold transition"
            >
              {{ slide.buttonText }}
            </button>
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

import { useRouter } from 'vue-router'

const router = useRouter()

const slides = [
  {
    image: 'https://besthuecitytour.com/wp-content/uploads/2020/09/Things-To-Do-In-Da-Nang-Best-Hue-City-Tour-Travel-1.jpg',
    title: 'BẠN ĐANG MUỐN ĐI ĐÂU?',
    description: 'Hãy để Travel Booking tư vấn cho bạn chuyến đi tuyệt vời nhất!',
    buttonText: 'XEM TIẾP',
    route: '/tour',
  },
  {
    image: 'https://cdn.tourradar.com/s3/tour/1500x800/130299_5e2041e57bdc5.jpg',
    title: "TRẢI NGHIỆM VẺ ĐẸP CỦA THIÊN NHIÊN",
    description:
      'Khám phá những điểm đến tuyệt đẹp và tận hưởng hành trình du lịch đáng nhớ cùng dịch vụ chuyên nghiệp của chúng tôi.',
    buttonText: 'XEM THÊM',
    route: '/blog',
  },
]

function goToRoute(route) {
  router.push(route)
}
</script>

<style scoped>
.home-slider {
  height: 600px;
}
</style>
