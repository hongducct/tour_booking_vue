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
    <div class="bg-gray-100 rounded-lg shadow-xl/80 my-20 mx-auto container px-2 max-w-7xl ">
      <div class="py-8 text-center">
        <h1 class="text-2xl sm:text-4xl font-bold text-gray-800 tracking-tight mb-2">
          Chào mừng bạn ghé thăm <span class="text-blue-600 tracking-wide">Travel Booking</span>
        </h1>
        <p class="text-base sm:text-lg text-gray-700 font-medium">
          Phiêu lưu thôi, chờ chi!
        </p>
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
  </main>
</template>
