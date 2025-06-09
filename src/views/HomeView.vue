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
import MapsSection from '@/components/MapsSection.vue'

import ChatBot from '@/components/ChatBot.vue'
import ZaloChat from '@/components/ZaloChat.vue'

// Import the updated components
import FlightSearch from '@/components/FlightSearch.vue'
import HotelSearch from '@/components/HotelSearch.vue'

import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUpIcon } from '@heroicons/vue/24/outline'

const showScrollTop = ref(false)
const activeTab = ref('tours') // or 'flights' or 'hotels'

// Lấy Google Maps API key từ biến môi trường
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
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
  <meta
    name="description"
    content="Tour Booking Application - Đặt vé máy bay và khách sạn tại Việt Nam"
  />
  <meta
    name="keywords"
    content="tour, booking, travel, application, vé máy bay, khách sạn, vietnam"
  />
  <meta name="author" content="Travel Booking Vietnam" />
  <meta name="theme-color" content="#ffffff" />
  <meta name="robots" content="index, follow" />

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

      <!-- Flight and Hotel Search Tabs -->
      <div class="my-10">
        <!-- Tab Navigation -->
        <div class="flex justify-center mb-6">
          <div class="bg-white rounded-lg p-1 shadow-md">
            <button
              @click="activeTab = 'tours'"
              :class="[
                'px-6 py-3 rounded-md font-medium transition-all duration-300',
                activeTab === 'tours'
                  ? 'bg-yellow-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
              ]"
            >
              🗺️ Tour du lịch
            </button>
            <button
              @click="activeTab = 'flights'"
              :class="[
                'px-6 py-3 rounded-md font-medium transition-all duration-300',
                activeTab === 'flights'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
              ]"
            >
              ✈️ Vé máy bay
            </button>
            <button
              @click="activeTab = 'hotels'"
              :class="[
                'px-6 py-3 rounded-md font-medium transition-all duration-300',
                activeTab === 'hotels'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
              ]"
            >
              🏨 Khách sạn
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="transition-all duration-300">
          <FormSearch v-if="activeTab === 'tours'" />
          <FlightSearch v-if="activeTab === 'flights'" />
          <HotelSearch v-if="activeTab === 'hotels'" />
        </div>
      </div>

      <DestinationSection />
      <PackageSection />

      <!-- Maps Section -->
      <MapsSection :api-key="GOOGLE_MAPS_API_KEY" />

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
      class="fixed bottom-40 right-10 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 z-50"
      aria-label="Scroll to Top"
    >
      <ArrowUpIcon class="h-6 w-6" />
    </button>
  </main>
</template>
