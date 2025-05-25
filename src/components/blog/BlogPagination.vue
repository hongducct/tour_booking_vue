<template>
  <div v-if="pagination.last_page > 1" class="flex flex-col items-center space-y-4">
    <!-- Page Info -->
    <div class="text-sm text-gray-700 text-center">
      Hiển thị <span class="font-medium">{{ pagination.from }}</span> -
      <span class="font-medium">{{ pagination.to }}</span> của
      <span class="font-medium">{{ pagination.total }}</span> kết quả
    </div>

    <!-- Navigation Buttons -->
    <nav class="flex items-center justify-center">
      <div class="flex space-x-1">
        <!-- Previous Button -->
        <button
          v-if="pagination.links.length > 0"
          @click="changePage(pagination.links[0].url)"
          :disabled="!pagination.links[0].url"
          :class="[
            'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            pagination.links[0].url
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed',
          ]"
        >
          <ChevronLeftIcon class="w-4 h-4 mr-1" />
          Trước
        </button>

        <!-- Page Numbers -->
        <div class="hidden sm:flex space-x-1">
          <template v-for="(link, index) in pageLinks" :key="index">
            <button
              v-if="link.url"
              @click="changePage(link.url)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                link.active
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900',
              ]"
            >
              {{ link.label }}
            </button>
            <span
              v-else-if="link.label === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
            >
              ...
            </span>
          </template>
        </div>

        <!-- Mobile Page Selector -->
        <div class="sm:hidden">
          <select
            :value="pagination.current_page"
            @change="changePage(getPageUrl($event.target.value))"
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="page in pagination.last_page" :key="page" :value="page">
              Trang {{ page }}
            </option>
          </select>
        </div>

        <!-- Next Button -->
        <button
          v-if="pagination.links.length > 0"
          @click="changePage(pagination.links[pagination.links.length - 1].url)"
          :disabled="!pagination.links[pagination.links.length - 1].url"
          :class="[
            'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            pagination.links[pagination.links.length - 1].url
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed',
          ]"
        >
          Sau
          <ChevronRightIcon class="w-4 h-4 ml-1" />
        </button>
      </div>
    </nav>

    <!-- Quick Jump -->
    <div v-if="pagination.last_page > 5" class="flex items-center space-x-2 text-sm">
      <span class="text-gray-600">Chuyển đến trang:</span>
      <input
        v-model="jumpPage"
        @keyup.enter="jumpToPage"
        type="number"
        :min="1"
        :max="pagination.last_page"
        class="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="1"
      />
      <button
        @click="jumpToPage"
        class="px-3 py-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        Đi
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['page-change'])

const jumpPage = ref('')

const pageLinks = computed(() => {
  if (!props.pagination.links) return []

  // Remove "Previous" and "Next" buttons, keep only page numbers
  return props.pagination.links.slice(1, -1)
})

const changePage = (url) => {
  if (!url) return
  emit('page-change', url)
}

const getPageUrl = (page) => {
  // Construct URL for the given page number
  const baseUrl = props.pagination.links?.find((link) => link.url)?.url
  if (!baseUrl) return null

  const url = new URL(baseUrl)
  url.searchParams.set('page', page)
  return url.toString()
}

const jumpToPage = () => {
  const page = parseInt(jumpPage.value)
  if (page >= 1 && page <= props.pagination.last_page) {
    const url = getPageUrl(page)
    if (url) {
      changePage(url)
      jumpPage.value = ''
    }
  }
}
</script>

<style scoped>
/* Remove spinner from number input */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
