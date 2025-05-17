<template>
  <div class="about">
    <TheHeader />
    <div class="container mx-auto px-4 py-8 mt-30">
      <h1 class="text-3xl font-bold mb-4">About Us</h1>
      <p class="text-lg mb-4">Welcome to our tour booking application!</p>
      <p class="text-lg mb-4">
        We are dedicated to providing you with the best travel experiences.
      </p>
      <p class="text-lg mb-4">
        Our team is passionate about exploring new destinations and creating
        unforgettable memories for our customers.
      </p>
    </div>
    <TheFooter />
  </div>
</template>

<script setup>
  import TheHeader from '@/components/TheHeader.vue';
  import TheFooter from '@/components/TheFooter.vue';
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
