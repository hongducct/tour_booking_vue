<template>
  <div class="animate-pulse">
    <!-- Featured Post Skeleton -->
    <div v-if="featured" class="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
      <div class="lg:flex">
        <div class="lg:w-1/2">
          <div class="bg-gray-300 h-64 lg:h-80"></div>
        </div>
        <div class="lg:w-1/2 p-6 lg:flex lg:flex-col lg:justify-center">
          <div class="flex items-center mb-3">
            <div class="bg-gray-300 h-4 w-4 rounded mr-2"></div>
            <div class="bg-gray-300 h-4 w-24 rounded mr-2"></div>
            <div class="bg-gray-300 h-4 w-4 rounded mr-1"></div>
            <div class="bg-gray-300 h-4 w-20 rounded"></div>
          </div>
          <div class="bg-gray-300 h-8 w-full rounded mb-4"></div>
          <div class="bg-gray-300 h-6 w-5/6 rounded mb-2"></div>
          <div class="space-y-2 mb-4">
            <div class="bg-gray-300 h-4 w-full rounded"></div>
            <div class="bg-gray-300 h-4 w-4/5 rounded"></div>
            <div class="bg-gray-300 h-4 w-3/4 rounded"></div>
          </div>
          <div class="bg-gray-300 h-4 w-24 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Regular Post Skeleton -->
    <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="bg-gray-300 h-48 md:h-56"></div>
      <div class="p-6">
        <div class="flex items-center mb-3">
          <div class="bg-gray-300 h-4 w-4 rounded mr-2"></div>
          <div class="bg-gray-300 h-4 w-24 rounded mr-2"></div>
          <div class="bg-gray-300 h-4 w-4 rounded mr-1"></div>
          <div class="bg-gray-300 h-4 w-20 rounded"></div>
        </div>
        <div class="bg-gray-300 h-6 w-full rounded mb-3"></div>
        <div class="bg-gray-300 h-5 w-5/6 rounded mb-2"></div>
        <div class="space-y-2 mb-4">
          <div class="bg-gray-300 h-4 w-full rounded"></div>
          <div class="bg-gray-300 h-4 w-4/5 rounded"></div>
          <div class="bg-gray-300 h-4 w-3/4 rounded"></div>
        </div>
        <div class="bg-gray-300 h-4 w-24 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  featured: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
