<template>
  <div class="animate-pulse">
    <!-- Breadcrumb Skeleton -->
    <div class="mb-8">
      <div class="flex items-center space-x-2">
        <div class="bg-gray-300 h-4 w-16 rounded"></div>
        <div class="bg-gray-300 h-4 w-4 rounded"></div>
        <div class="bg-gray-300 h-4 w-12 rounded"></div>
        <div class="bg-gray-300 h-4 w-4 rounded"></div>
        <div class="bg-gray-300 h-4 w-32 rounded"></div>
      </div>
    </div>

    <!-- Article Header Skeleton -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <!-- Featured Image -->
      <div class="bg-gray-300 h-64 md:h-80 lg:h-96"></div>

      <!-- Article Meta -->
      <div class="p-6 md:p-8">
        <!-- Title -->
        <div class="mb-6">
          <div class="bg-gray-300 h-8 w-full rounded mb-2"></div>
          <div class="bg-gray-300 h-8 w-3/4 rounded"></div>
        </div>

        <!-- Meta Info -->
        <div class="flex flex-wrap items-center gap-6 mb-6">
          <div class="flex items-center">
            <div class="bg-gray-300 h-5 w-5 rounded mr-2"></div>
            <div class="bg-gray-300 h-4 w-24 rounded"></div>
          </div>
          <div class="flex items-center">
            <div class="bg-gray-300 h-5 w-5 rounded mr-2"></div>
            <div class="bg-gray-300 h-4 w-20 rounded"></div>
          </div>
          <div class="flex items-center">
            <div class="bg-gray-300 h-5 w-5 rounded mr-2"></div>
            <div class="bg-gray-300 h-4 w-16 rounded"></div>
          </div>
          <div class="flex items-center">
            <div class="bg-gray-300 h-5 w-5 rounded mr-2"></div>
            <div class="bg-gray-300 h-4 w-20 rounded"></div>
          </div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
          <div class="bg-gray-300 h-6 w-16 rounded-full"></div>
          <div class="bg-gray-300 h-6 w-20 rounded-full"></div>
          <div class="bg-gray-300 h-6 w-14 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Article Content Skeleton -->
    <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
      <div class="space-y-4">
        <div class="bg-gray-300 h-4 w-full rounded"></div>
        <div class="bg-gray-300 h-4 w-full rounded"></div>
        <div class="bg-gray-300 h-4 w-5/6 rounded"></div>
        <div class="bg-gray-300 h-4 w-full rounded"></div>
        <div class="bg-gray-300 h-4 w-4/5 rounded"></div>

        <div class="bg-gray-300 h-32 w-full rounded my-6"></div>

        <div class="bg-gray-300 h-4 w-full rounded"></div>
        <div class="bg-gray-300 h-4 w-full rounded"></div>
        <div class="bg-gray-300 h-4 w-3/4 rounded"></div>
        <div class="bg-gray-300 h-4 w-full rounded"></div>
        <div class="bg-gray-300 h-4 w-2/3 rounded"></div>
      </div>
    </div>

    <!-- Actions Skeleton -->
    <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div class="flex gap-4">
          <div class="bg-gray-300 h-12 w-24 rounded-lg"></div>
          <div class="bg-gray-300 h-12 w-28 rounded-lg"></div>
        </div>
        <div class="bg-gray-300 h-12 w-32 rounded-lg"></div>
      </div>
    </div>

    <!-- Related Posts Skeleton -->
    <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div class="bg-gray-300 h-8 w-48 rounded mb-6"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-lg overflow-hidden">
          <div class="bg-gray-300 h-32"></div>
          <div class="p-4">
            <div class="bg-gray-300 h-4 w-full rounded mb-2"></div>
            <div class="bg-gray-300 h-4 w-3/4 rounded mb-3"></div>
            <div class="bg-gray-300 h-3 w-20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
