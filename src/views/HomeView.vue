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
      <div class="py-4">
        <h1 class="text-3xl font-bold text-center">Welcome to Tour Booking</h1>
        <p class="text-center text-gray-600">Your adventure starts here!</p>
      </div>
      <FormSearch />
      <DestinationSection />
      <PackageSection />
      <BestGallerySection />
      <BlogSection />
    </div>
    <ContactSection />
    <TheFooter />
  </main>
</template>
