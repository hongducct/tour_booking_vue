<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <div
      v-for="n in count"
      :key="n"
      class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col dark:bg-gray-800"
    >
      <!-- Image Skeleton -->
      <div class="relative overflow-hidden">
        <div class="skeleton-shimmer w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700"></div>
        <!-- Duration badge skeleton -->
        <div class="absolute top-2 right-2">
          <div class="skeleton-shimmer bg-gray-300 dark:bg-gray-600 h-6 w-20 rounded"></div>
        </div>
      </div>

      <div class="p-3 sm:p-4 flex-grow flex flex-col">
        <!-- Title Skeleton -->
        <div class="mb-2">
          <div class="skeleton-shimmer bg-gray-200 dark:bg-gray-700 h-5 w-full rounded mb-2"></div>
          <div class="skeleton-shimmer bg-gray-200 dark:bg-gray-700 h-5 w-3/4 rounded"></div>
        </div>

        <!-- Tags Skeleton -->
        <div class="flex flex-wrap gap-1 mb-2">
          <div class="skeleton-shimmer bg-gray-100 dark:bg-gray-600 h-5 w-16 rounded-full"></div>
          <div class="skeleton-shimmer bg-gray-100 dark:bg-gray-600 h-5 w-20 rounded-full"></div>
        </div>

        <!-- Description Skeleton -->
        <div class="flex-grow mb-2">
          <div class="skeleton-shimmer bg-gray-200 dark:bg-gray-700 h-3 w-full rounded mb-1"></div>
          <div class="skeleton-shimmer bg-gray-200 dark:bg-gray-700 h-3 w-5/6 rounded mb-1"></div>
          <div class="skeleton-shimmer bg-gray-200 dark:bg-gray-700 h-3 w-4/5 rounded mb-1"></div>
          <div class="skeleton-shimmer bg-gray-200 dark:bg-gray-700 h-3 w-3/4 rounded"></div>
        </div>

        <!-- Price Skeleton -->
        <div class="mt-2 mb-3">
          <div class="skeleton-shimmer bg-blue-100 dark:bg-blue-900 h-6 w-24 rounded"></div>
        </div>

        <!-- Buttons Skeleton -->
        <div class="flex justify-between items-center gap-2">
          <div class="skeleton-shimmer bg-yellow-100 dark:bg-yellow-800 h-8 w-16 rounded"></div>
          <div class="skeleton-shimmer bg-red-100 dark:bg-red-800 h-8 w-16 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, withDefaults } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    default: 8
  }
})
</script>

<style scoped>
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}

.dark .skeleton-shimmer::before {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .skeleton-shimmer {
    animation-duration: 1.5s;
  }
}
</style>