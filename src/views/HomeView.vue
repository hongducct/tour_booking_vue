<script setup>
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'

import HomeSlider from '@/components/HomeSlider.vue'
import FormSearch from '@/components/FormSearch.vue'
import DestinationSection from '@/components/DestinationSection.vue'
import PackageSection from '@/components/PackageSection.vue'
import BestGallerySection from '@/components/BestGallerySection.vue'
import BlogSection from '@/components/BlogSection.vue'
import ContactSection from '@/components/ContactSection.vue'

import ChatBot from '@/components/ChatBot.vue'
import ZaloChat from '@/components/ZaloChat.vue'

import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUpIcon } from "@heroicons/vue/24/outline";
const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300 // Hiển thị nút khi cuộn xuống quá 300px
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Tour Booking Application" />
  <meta name="keywords" content="tour, booking, travel, application" />
  <meta name="author" content="Your Name" />
  <meta name="theme-color" content="#ffffff" />
  <meta name="robots" content="index, follow" />
  <meta name="google-site-verification" content="your-google-site-verification-code" />
  <main>
    <TheHeader />
    <HomeSlider class="mt-27" />
    <div class="bg-gray-100 rounded-lg shadow-xl/80 my-20 mx-auto container px-2 max-w-7xl">
      <div class="py-8 text-center">
        <h1 class="text-2xl sm:text-4xl font-bold text-gray-800 tracking-tight mb-2">
          Chào mừng bạn ghé thăm <span class="text-blue-600 tracking-wide">Travel Booking</span>
        </h1>
        <p class="text-base sm:text-lg text-gray-700 font-medium">Phiêu lưu thôi, chờ chi!</p>
      </div>
      <FormSearch />
      <DestinationSection />
      <PackageSection />
      <BestGallerySection />
      <BlogSection />
      <ChatBot />
    </div>
    <ContactSection />
    <TheFooter />
    <ZaloChat />
    <!-- Scroll to Top Button -->
    <button
      v-if="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-40 right-10 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
      aria-label="Scroll to Top"
    >
      <ArrowUpIcon class="h-6 w-6" />
    </button>
  </main>
</template>
