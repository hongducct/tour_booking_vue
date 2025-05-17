<template>
  <div class="flex flex-col items-center gap-4 mt-6">
    <!-- Pagination buttons -->
    <div class="flex justify-center gap-1 sm:gap-2">
      <!-- Nút Previous - chỉ hiện mũi tên trên mobile -->
      <button
        class="px-2 sm:px-4 py-2 rounded border"
        :disabled="!pagination.prev_page_url"
        @click="$emit('change-page', pagination.current_page - 1)"
        aria-label="Previous page"
      >
        <span class="hidden sm:inline">&laquo; Prev</span>
        <span class="sm:hidden">&laquo;</span>
      </button>

      <!-- First page -->
      <button
        v-if="visiblePages.includes(1)"
        @click="$emit('change-page', 1)"
        :class="[
          'px-2 sm:px-3 py-2 rounded border min-w-[36px] sm:min-w-[40px]',
          pagination.current_page === 1 ? 'bg-yellow-500 text-white' : '',
        ]"
      >
        1
      </button>

      <!-- First ellipsis -->
      <span v-if="startEllipsis" class="px-1 sm:px-3 py-2">...</span>

      <!-- Middle pages -->
      <button
        v-for="page in middlePages"
        :key="page"
        @click="$emit('change-page', page)"
        :class="[
          'px-2 sm:px-3 py-2 rounded border min-w-[36px] sm:min-w-[40px]',
          pagination.current_page === page ? 'bg-yellow-500 text-white' : '',
        ]"
      >
        {{ page }}
      </button>

      <!-- Last ellipsis -->
      <span v-if="endEllipsis" class="px-1 sm:px-3 py-2">...</span>

      <!-- Last page -->
      <button
        v-if="pagination.last_page > 1 && visiblePages.includes(pagination.last_page)"
        @click="$emit('change-page', pagination.last_page)"
        :class="[
          'px-2 sm:px-3 py-2 rounded border min-w-[36px] sm:min-w-[40px]',
          pagination.current_page === pagination.last_page ? 'bg-yellow-500 text-white' : '',
        ]"
      >
        {{ pagination.last_page }}
      </button>

      <!-- Nút Next - chỉ hiện mũi tên trên mobile -->
      <button
        class="px-2 sm:px-4 py-2 rounded border"
        :disabled="!pagination.next_page_url"
        @click="$emit('change-page', pagination.current_page + 1)"
        aria-label="Next page"
      >
        <span class="hidden sm:inline">Next &raquo;</span>
        <span class="sm:hidden">&raquo;</span>
      </button>
    </div>

    <!-- Go to page input - ẩn trên mobile -->
    <div class="hidden sm:flex items-center gap-2">
      <span>Go to page:</span>
      <input
        type="text"
        class="border rounded px-2 py-1 w-16 text-center"
        v-model="goToPage"
        placeholder="#"
      />
      <button class="px-3 py-1 rounded border bg-gray-100" @click="handleGoToPage">Go</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['change-page'])
const goToPage = ref('')

// Calculate visible pages - sử dụng responsive số lượng trang hiển thị
const visiblePages = computed(() => {
  const { current_page, last_page } = props.pagination
  const pages = []

  // Always include page 1
  pages.push(1)

  // Xác định số lượng trang hiển thị dựa trên responsive
  const isMobile = window.innerWidth < 640
  const pagesToShow = isMobile ? 1 : 3 // Mobile hiển thị ít hơn

  // Calculate middle range
  let rangeStart = Math.max(2, current_page - Math.floor(pagesToShow / 2))
  let rangeEnd = Math.min(last_page - 1, current_page + Math.floor(pagesToShow / 2))

  // Ensure we show proper number of pages when possible
  if (rangeEnd - rangeStart < pagesToShow - 1) {
    if (current_page <= 3) {
      rangeEnd = Math.min(pagesToShow + 1, last_page - 1)
    } else {
      rangeStart = Math.max(2, last_page - pagesToShow)
    }
  }

  // Add middle pages
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  // Add last page
  if (last_page > 1) {
    pages.push(last_page)
  }

  return [...new Set(pages)] // Remove duplicates
})

// Extract middle pages (excluding first and last)
const middlePages = computed(() => {
  return visiblePages.value.filter((page) => page !== 1 && page !== props.pagination.last_page)
})

// Determine if ellipses are needed
const startEllipsis = computed(() => {
  if (middlePages.value.length === 0) return false
  const min = Math.min(...middlePages.value)
  return min > 2
})

const endEllipsis = computed(() => {
  if (middlePages.value.length === 0) return false
  const max = Math.max(...middlePages.value)
  return max < props.pagination.last_page - 1
})

// Handle direct page navigation
const handleGoToPage = () => {
  const pageNumber = parseInt(goToPage.value)
  if (pageNumber >= 1 && pageNumber <= props.pagination.last_page) {
    emit('change-page', pageNumber)
    goToPage.value = ''
  }
}

// Thêm responsive listener
const checkScreenSize = () => {
  // Force re-compute của computed properties
  visiblePages.value
}

// Mounted hook để thêm event listener
if (typeof window !== 'undefined') {
  window.addEventListener('resize', checkScreenSize)
  // Cleanup khi component unmount
  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
  })
}
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive styles */
@media (max-width: 639px) {
  button {
    font-size: 0.875rem;
  }
}
</style>
