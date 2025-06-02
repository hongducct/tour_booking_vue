<template>
  <div class="booking-loading-container">
    <!-- Header Skeleton -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="skeleton-shimmer h-8 w-64 rounded-lg mb-2"></div>
          <div class="skeleton-shimmer h-4 w-48 rounded"></div>
        </div>
        <div class="skeleton-shimmer h-10 w-24 rounded-lg"></div>
      </div>
    </div>

    <!-- Stats Cards Skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white dark:bg-gray-500 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center">
          <div class="skeleton-shimmer w-12 h-12 rounded-xl mr-4"></div>
          <div class="flex-1">
            <div class="skeleton-shimmer h-4 w-20 rounded mb-2"></div>
            <div class="skeleton-shimmer h-6 w-12 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Cards Skeleton -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <div
        v-for="i in skeletonCount"
        :key="i"
        class="bg-white dark:bg-gray-500 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Card Header Skeleton -->
        <div class="p-4 lg:p-5">
          <!-- ID and Status Row -->
          <div class="flex items-start justify-between mb-3">
            <div class="skeleton-shimmer h-6 w-16 rounded"></div>
            <div class="skeleton-shimmer h-6 w-20 rounded-full"></div>
          </div>

          <!-- Created Date -->
          <div class="mb-4">
            <div class="skeleton-shimmer h-5 w-32 rounded-lg"></div>
          </div>

          <!-- User and Location Info -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center">
              <div class="skeleton-shimmer w-4 h-4 rounded mr-2"></div>
              <div class="skeleton-shimmer h-4 w-32 rounded"></div>
            </div>
            <div class="flex items-center">
              <div class="skeleton-shimmer w-4 h-4 rounded mr-2"></div>
              <div class="skeleton-shimmer h-4 w-40 rounded"></div>
            </div>
          </div>

          <!-- Booking Details -->
          <div class="space-y-3 mb-4">
            <div class="grid grid-cols-1 gap-2">
              <div class="flex items-center">
                <div class="skeleton-shimmer w-4 h-4 rounded mr-2"></div>
                <div class="skeleton-shimmer h-4 w-28 rounded"></div>
              </div>
              <div class="flex items-center">
                <div class="skeleton-shimmer w-4 h-4 rounded mr-2"></div>
                <div class="skeleton-shimmer h-4 w-28 rounded"></div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="skeleton-shimmer w-4 h-4 rounded mr-2"></div>
                <div class="skeleton-shimmer h-4 w-16 rounded"></div>
              </div>
              <div class="skeleton-shimmer h-6 w-20 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Card Actions Skeleton -->
        <div
          class="px-4 lg:px-5 py-4 bg-gray-50 dark:bg-gray-600/50 border-t border-gray-200 dark:border-gray-600"
        >
          <div class="grid grid-cols-3 gap-2 mb-3">
            <div class="skeleton-shimmer h-8 rounded-lg"></div>
            <div class="skeleton-shimmer h-8 rounded-lg"></div>
            <div class="skeleton-shimmer h-8 rounded-lg"></div>
          </div>
          <div class="skeleton-shimmer h-9 w-full rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Loading Status Indicator -->
    <div class="fixed top-4 right-4 z-50">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3"
      >
        <div class="loading-spinner"></div>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
            Đang tải dữ liệu...
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Vui lòng đợi trong giây lát</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  skeletonCount: {
    type: Number,
    default: 8,
  },
})
</script>

<style scoped>
/* Base skeleton shimmer effect */
.skeleton-shimmer {
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 20%, #f9fafb 40%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

/* Dark mode skeleton shimmer */
.dark .skeleton-shimmer {
  background: linear-gradient(90deg, #374151 0%, #4b5563 20%, #6b7280 40%, #374151 100%);
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

/* Shimmer animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Loading spinner */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark .loading-spinner {
  border: 2px solid #4b5563;
  border-top: 2px solid #60a5fa;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Enhanced loading effects */
.booking-loading-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Skeleton variants for different content types */
.skeleton-shimmer.skeleton-text {
  border-radius: 4px;
}

.skeleton-shimmer.skeleton-circle {
  border-radius: 50%;
}

.skeleton-shimmer.skeleton-rounded {
  border-radius: 8px;
}

/* Pulse effect for important elements */
.skeleton-shimmer.skeleton-pulse {
  animation:
    shimmer 2s ease-in-out infinite,
    pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Staggered animation for multiple skeletons */
.skeleton-shimmer:nth-child(1) {
  animation-delay: 0s;
}
.skeleton-shimmer:nth-child(2) {
  animation-delay: 0.1s;
}
.skeleton-shimmer:nth-child(3) {
  animation-delay: 0.2s;
}
.skeleton-shimmer:nth-child(4) {
  animation-delay: 0.3s;
}
.skeleton-shimmer:nth-child(5) {
  animation-delay: 0.4s;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .skeleton-shimmer {
    animation-duration: 1.5s;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .skeleton-shimmer {
    background: linear-gradient(90deg, #d1d5db 0%, #9ca3af 50%, #d1d5db 100%);
  }

  .dark .skeleton-shimmer {
    background: linear-gradient(90deg, #4b5563 0%, #6b7280 50%, #4b5563 100%);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer {
    animation: none;
    background: #f3f4f6;
  }

  .dark .skeleton-shimmer {
    background: #374151;
  }

  .loading-spinner {
    animation: none;
    border: 2px solid #9ca3af;
  }
}
</style>
