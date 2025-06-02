<template>
  <div class="voucher-loading-container">
    <!-- Loading Overlay với Backdrop Blur -->
    <div v-if="overlay" class="loading-overlay">
      <div class="loading-backdrop"></div>
      <div class="loading-spinner-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-text">{{ loadingText }}</div>
        </div>
      </div>
    </div>

    <!-- Statistics Skeleton -->
    <div v-if="type === 'stats'" class="skeleton-stats">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        :style="{ 'animation-delay': `${i * 0.1}s` }"
      >
        <div class="flex items-center">
          <div class="skeleton-shimmer w-14 h-14 rounded-xl mr-4 skeleton-pulse"></div>
          <div class="flex-1">
            <div class="skeleton-shimmer h-4 w-24 rounded mb-3"></div>
            <div class="skeleton-shimmer h-7 w-16 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div v-if="type === 'table'" class="skeleton-table-container">
      <!-- Table Header -->
      <div
        class="bg-white dark:bg-gray-800 rounded-t-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-600"
        >
          <div class="grid grid-cols-7 gap-4">
            <div
              v-for="i in 7"
              :key="i"
              class="skeleton-shimmer h-4 rounded"
              :class="getHeaderWidth(i)"
            ></div>
          </div>
        </div>

        <!-- Table Rows -->
        <div class="divide-y divide-gray-200 dark:divide-gray-600">
          <div
            v-for="row in rows"
            :key="row"
            class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            :style="{ 'animation-delay': `${row * 0.1}s` }"
          >
            <div class="grid grid-cols-7 gap-4 items-center">
              <!-- Mã voucher -->
              <div class="skeleton-shimmer h-5 w-20 rounded-lg font-mono"></div>

              <!-- Trạng thái -->
              <div class="skeleton-shimmer h-6 w-16 rounded-full"></div>

              <!-- Loại giảm giá -->
              <div class="skeleton-shimmer h-4 w-12 rounded"></div>

              <!-- Giá trị -->
              <div class="skeleton-shimmer h-5 w-24 rounded"></div>

              <!-- Ngày bắt đầu/kết thúc -->
              <div class="space-y-1">
                <div class="skeleton-shimmer h-3 w-20 rounded"></div>
                <div class="skeleton-shimmer h-3 w-20 rounded"></div>
              </div>

              <!-- Sử dụng -->
              <div class="skeleton-shimmer h-4 w-16 rounded"></div>

              <!-- Actions -->
              <div class="flex items-center gap-2 justify-end">
                <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
                <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
                <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Skeleton -->
      <div
        class="bg-white dark:bg-gray-800 rounded-b-xl border-t-0 border border-gray-200 dark:border-gray-700 px-6 py-4"
      >
        <div class="flex items-center justify-between">
          <div class="skeleton-shimmer h-4 w-32 rounded"></div>
          <div class="flex items-center gap-2">
            <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
            <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
            <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
            <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
            <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Skeleton -->
    <div v-if="type === 'form'" class="skeleton-form">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="space-y-6">
          <!-- Form Title -->
          <div class="skeleton-shimmer h-6 w-48 rounded-lg mb-6"></div>

          <!-- Form Fields -->
          <div
            v-for="i in fields"
            :key="i"
            class="space-y-2"
            :style="{ 'animation-delay': `${i * 0.1}s` }"
          >
            <div class="skeleton-shimmer h-4 w-24 rounded mb-2"></div>
            <div class="skeleton-shimmer h-10 w-full rounded-lg"></div>
          </div>

          <!-- Form Actions -->
          <div
            class="flex items-center gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-600"
          >
            <div class="skeleton-shimmer h-10 w-20 rounded-lg"></div>
            <div class="skeleton-shimmer h-10 w-24 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Skeleton -->
    <div v-if="type === 'cards'" class="skeleton-cards">
      <div
        v-for="i in count"
        :key="i"
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        :style="{ 'animation-delay': `${i * 0.1}s` }"
      >
        <div class="flex items-start gap-4 mb-4">
          <div class="skeleton-shimmer w-12 h-12 rounded-xl skeleton-pulse"></div>
          <div class="flex-1 space-y-2">
            <div class="skeleton-shimmer h-5 w-32 rounded-lg"></div>
            <div class="skeleton-shimmer h-4 w-24 rounded"></div>
          </div>
          <div class="skeleton-shimmer h-6 w-16 rounded-full"></div>
        </div>

        <div class="space-y-3 mb-4">
          <div class="skeleton-shimmer h-4 w-full rounded"></div>
          <div class="skeleton-shimmer h-4 w-3/4 rounded"></div>
          <div class="skeleton-shimmer h-4 w-1/2 rounded"></div>
        </div>

        <div
          class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600"
        >
          <div class="skeleton-shimmer h-8 w-20 rounded-lg"></div>
          <div class="flex gap-2">
            <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
            <div class="skeleton-shimmer h-8 w-8 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Status Indicator -->
    <div v-if="!overlay" class="fixed top-4 right-4 z-50">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90"
      >
        <div class="loading-indicator"></div>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ loadingText }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Vui lòng đợi trong giây lát</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'table', // 'table', 'cards', 'stats', 'form'
    validator: (value) => ['table', 'cards', 'stats', 'form'].includes(value),
  },
  rows: {
    type: Number,
    default: 5,
  },
  columns: {
    type: Number,
    default: 7,
  },
  count: {
    type: Number,
    default: 3,
  },
  fields: {
    type: Number,
    default: 6,
  },
  overlay: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Đang tải dữ liệu...',
  },
})

const getHeaderWidth = (index) => {
  const widths = ['w-20', 'w-16', 'w-12', 'w-24', 'w-32', 'w-16', 'w-20']
  return widths[index - 1] || 'w-20'
}
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
}

/* Enhanced shimmer animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Loading Container */
.voucher-loading-container {
  position: relative;
  width: 100%;
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

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.dark .loading-backdrop {
  background: rgba(17, 24, 39, 0.8);
}

.loading-spinner-container {
  position: relative;
  z-index: 1;
}

/* Beautiful Spinner */
.loading-spinner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner-ring {
  position: absolute;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.spinner-ring:nth-child(1) {
  width: 80px;
  height: 80px;
  border-top-color: #3b82f6;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  width: 60px;
  height: 60px;
  border-top-color: #8b5cf6;
  animation-delay: -0.4s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  width: 40px;
  height: 40px;
  border-top-color: #06d6a0;
  animation-delay: -0.8s;
}

.spinner-text {
  margin-top: 100px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #6b7280;
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

.dark .spinner-text {
  color: #9ca3af;
}

/* Statistics Skeleton */
.skeleton-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: slideInUp 0.6s ease-out;
}

/* Table Container */
.skeleton-table-container {
  animation: slideInUp 0.6s ease-out;
  margin-bottom: 1rem;
}

/* Form Skeleton */
.skeleton-form {
  max-width: 600px;
  margin: 0 auto;
  animation: slideInUp 0.6s ease-out;
}

/* Cards Skeleton */
.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  animation: slideInUp 0.6s ease-out;
}

/* Loading Indicator (small spinner) */
.loading-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark .loading-indicator {
  border: 2px solid #4b5563;
  border-top: 2px solid #60a5fa;
}

/* Pulse effect for important elements */
.skeleton-pulse {
  animation:
    shimmer 2s ease-in-out infinite,
    pulse 2s ease-in-out infinite;
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Staggered animation delays */
.skeleton-stats > div:nth-child(1) {
  animation-delay: 0s;
}
.skeleton-stats > div:nth-child(2) {
  animation-delay: 0.1s;
}
.skeleton-stats > div:nth-child(3) {
  animation-delay: 0.2s;
}
.skeleton-stats > div:nth-child(4) {
  animation-delay: 0.3s;
}
.skeleton-stats > div:nth-child(5) {
  animation-delay: 0.4s;
}
.skeleton-stats > div:nth-child(6) {
  animation-delay: 0.5s;
}

/* Responsive Design */
@media (max-width: 768px) {
  .skeleton-stats {
    grid-template-columns: 1fr;
  }

  .skeleton-cards {
    grid-template-columns: 1fr;
  }

  .skeleton-table-container .grid-cols-7 {
    grid-template-columns: repeat(4, 1fr);
    gap: 2;
  }

  .skeleton-table-container .grid-cols-7 > div:nth-child(n + 5) {
    display: none;
  }
}

@media (max-width: 640px) {
  .fixed.top-4.right-4 {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }

  .loading-spinner {
    scale: 0.8;
  }

  .spinner-text {
    font-size: 1rem;
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
  .skeleton-shimmer,
  .skeleton-pulse,
  .loading-indicator,
  .spinner-ring {
    animation: none;
  }

  .skeleton-shimmer {
    background: #f3f4f6;
  }

  .dark .skeleton-shimmer {
    background: #374151;
  }

  .loading-backdrop {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .voucher-loading-container,
  .skeleton-stats,
  .skeleton-table-container,
  .skeleton-form,
  .skeleton-cards {
    animation: none;
  }
}

/* Print styles */
@media print {
  .loading-overlay,
  .fixed {
    display: none;
  }
}
</style>
