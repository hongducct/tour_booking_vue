<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
    <!-- Search Bar -->
    <div>
      <form @submit="handleSearchSubmit" class="relative">
        <div class="relative flex items-center">
          <MagnifyingGlassIcon class="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            v-model="tempSearch"
            placeholder="Tìm kiếm bài viết, địa điểm, từ khóa..."
            class="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            v-if="tempSearch"
            type="button"
            @click="clearSearch"
            class="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </form>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <!-- Left side filters -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
        <!-- Tags Filter -->
        <div class="relative">
          <button
            @click="isTagsOpen = !isTagsOpen"
            class="flex items-centerer gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
          >
            <TagIcon class="w-4 h-4" />
            <span>Chủ đề</span>
            <span v-if="selectedTags.length > 0" class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {{ selectedTags.length }}
            </span>
            <ChevronDownIcon :class="`w-4 h-4 transition-transform ${isTagsOpen ? 'rotate-180' : ''}`" />
          </button>

          <div v-if="isTagsOpen" class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4 min-w-80 max-h-80 overflow-y-auto">
            <div class="grid grid-cols-2 gap-2">
              <label
                v-for="tag in availableTags"
                :key="tag"
                class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  :checked="selectedTags.includes(tag)"
                  @change="handleTagToggle(tag)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">{{ tag }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Destination Filter -->
        <div class="relative">
          <select
            :value="selectedDestination"
            @change="$emit('destination-change', $event.target.value)"
            class="px-4 py-2 pr-10 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700 border-0 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả điểm đến</option>
            <option v-for="destination in popularDestinations" :key="destination" :value="destination">
              {{ destination }}
            </option>
          </select>
        </div>

        <!-- Season Filter -->
        <div class="relative">
          <select
            :value="selectedSeason"
            @change="$emit('season-change', $event.target.value)"
            class="px-4 py-2 pr-7 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700 border-0 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả mùa</option>
            <option value="spring">Mùa xuân</option>
            <option value="summer">Mùa hè</option>
            <option value="autumn">Mùa thu</option>
            <option value="winter">Mùa đông</option>
            <option value="all_year">Quanh năm</option>
          </select>
        </div>
      </div>

      <!-- Sort Options -->
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-700 mr-2">Sắp xếp:</span>
        <button
          v-for="option in sortOptions"
          :key="option.key"
          @click="$emit('sort-change', option.key)"
          :class="`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            sortBy === option.key 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`"
        >
          <component :is="option.icon" class="w-4 h-4 mr-1.5" />
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
      <span class="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>

      <span v-if="searchQuery" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
        <MagnifyingGlassIcon class="w-3 h-3" />
        "{{ searchQuery }}"
        <button @click="$emit('search-change', '')" class="ml-1 hover:bg-blue-200 rounded-full p-0.5">
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>

      <span
        v-for="tag in selectedTags"
        :key="tag"
        class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
      >
        <TagIcon class="w-3 h-3" />
        {{ tag }}
        <button @click="handleTagToggle(tag)" class="ml-1 hover:bg-green-200 rounded-full p-0.5">
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>

      <span v-if="selectedDestination" class="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
        <MapPinIcon class="w-3 h-3" />
        {{ selectedDestination }}
        <button @click="$emit('destination-change', '')" class="ml-1 hover:bg-purple-200 rounded-full p-0.5">
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>

      <span v-if="selectedSeason" class="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
        <CalendarDaysIcon class="w-3 h-3" />
        {{ getSeasonText(selectedSeason) }}
        <button @click="$emit('season-change', '')" class="ml-1 hover:bg-orange-200 rounded-full p-0.5">
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>

      <button
        @click="clearAllFilters"
        class="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
      >
        <FunnelIcon class="w-3 h-3" />
        Xóa tất cả
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  TagIcon,
  CalendarDaysIcon,
  StarIcon,
  EyeIcon,
  FunnelIcon,
  ChevronDownIcon,
  MapPinIcon,
  ClockIcon,
  FireIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  searchQuery: String,
  sortBy: String,
  selectedTags: Array,
  selectedDestination: String,
  selectedSeason: String,
})

const emit = defineEmits([
  'search-change',
  'sort-change', 
  'tags-change',
  'destination-change',
  'season-change'
])

const isTagsOpen = ref(false)
const tempSearch = ref(props.searchQuery)
const availableTags = ref([])

const sortOptions = [
  { key: 'latest', label: 'Mới nhất', icon: ClockIcon },
  { key: 'featured', label: 'Nổi bật', icon: StarIcon },
  { key: 'popular', label: 'Phổ biến', icon: EyeIcon },
  { key: 'trending', label: 'Xu hướng', icon: FireIcon },
]

const popularDestinations = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hội An', 'Nha Trang', 'Phú Quốc', 
  'Sapa', 'Hạ Long', 'Đà Lạt', 'Cần Thơ', 'Huế', 'Quy Nhon', 'Vũng Tàu',
  'Phan Thiết', 'Ninh Bình', 'Tam Cốc',
  'Phan Thiết', 'Ninh Bình', 'Tam Cốc', 'Mù Cang Chải', 'Cao Bằng', 'Hà Giang'
]

const hasActiveFilters = computed(() => {
  return props.searchQuery || 
         props.selectedTags.length > 0 || 
         props.selectedDestination || 
         props.selectedSeason
})

// Fetch available tags
onMounted(async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await fetch(`${apiBaseUrl}/news/tags`)
    const data = await response.json()
    availableTags.value = data.data || [
      'Du lịch biển', 'Du lịch núi', 'Du lịch văn hóa', 'Du lịch ẩm thực', 'Phượt',
      'Backpacking', 'Resort', 'Khách sạn', 'Ẩm thực', 'Chụp ảnh', 'Mùa xuân',
      'Mùa hè', 'Tiết kiệm', 'Cao cấp', 'Gia đình', 'Cặp đôi', 'Một mình'
    ]
  } catch (error) {
    console.error('Error fetching tags:', error)
    // Fallback tags
    availableTags.value = [
      'Du lịch biển', 'Du lịch núi', 'Du lịch văn hóa', 'Du lịch ẩm thực', 'Phượt',
      'Backpacking', 'Resort', 'Khách sạn', 'Ẩm thực', 'Chụp ảnh', 'Mùa xuân',
      'Mùa hè', 'Tiết kiệm', 'Cao cấp', 'Gia đình', 'Cặp đôi', 'Một mình'
    ]
  }
})

const handleSearchSubmit = (e) => {
  e.preventDefault()
  emit('search-change', tempSearch.value.trim())
}

const clearSearch = () => {
  tempSearch.value = ''
  emit('search-change', '')
}

const handleTagToggle = (tag) => {
  const newTags = props.selectedTags.includes(tag) 
    ? props.selectedTags.filter(t => t !== tag)
    : [...props.selectedTags, tag]
  emit('tags-change', newTags)
}

const clearAllFilters = () => {
  tempSearch.value = ''
  emit('search-change', '')
  emit('tags-change', [])
  emit('destination-change', '')
  emit('season-change', '')
}

const getSeasonText = (season) => {
  const seasons = {
    spring: 'Mùa xuân',
    summer: 'Mùa hè', 
    autumn: 'Mùa thu',
    winter: 'Mùa đông',
    all_year: 'Quanh năm'
  }
  return seasons[season] || season
}
</script>

<style scoped>
/* Click outside to close dropdown */
@media (max-width: 768px) {
  .min-w-80 {
    min-width: 280px;
  }
}
</style>
