<template>
  <div class="min-h-screen bg-gray-50 mt-27 lg:mt-30 md:mt-29 sm:mt-28">
    <TheHeader />

    <!-- Hero Section -->
    <div
      class="relative text-white py-16 h-64 md:h-64 lg:h-80 sm:h-auto"
      style="
        background: url('https://www.vietnambooking.com/wp-content/uploads/2018/12/doc-mien-dat-nuoc-chiem-nguong-canh-dep-viet-nam-19122018-4.jpg')
          center/cover no-repeat;
      "
    >
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="container mx-auto px-4 relative z-10 h-full flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Blog & Tin tức</h1>
          <p class="text-xl opacity-90 max-w-2xl mx-auto">
            Khám phá những bài viết mới nhất, thông tin hữu ích và xu hướng du lịch
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Categories Filter -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-3 mb-6">
          <button
            @click="
              selectedCategory = null,
              fetchNews(1)
            "
            :class="`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !selectedCategory
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`"
          >
            Tất cả
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="
              selectedCategory = category.id,
              fetchNews(1)
            "
            :class="`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`"
            :style="selectedCategory === category.id ? `background-color: ${category.color}` : ''"
          >
            <i v-if="category.icon" :class="`heroicon-${category.icon} w-4 h-4`"></i>
            {{ category.name }}
          </button>
        </div>

        <SearchFilters
          :searchQuery="searchQuery"
          @search-change="handleSearch"
          :sortBy="sortBy"
          @sort-change="handleSortChange"
          :selectedTags="selectedTags"
          @tags-change="handleTagsChange"
          :selectedDestination="selectedDestination"
          @destination-change="handleDestinationChange"
          :selectedSeason="selectedSeason"
          @season-change="handleSeasonChange"
        />

        <!-- Search Results Info -->
        <div
          v-if="hasActiveFilters"
          class="mt-6 bg-white rounded-xl p-4 shadow-sm border border-blue-100"
        >
          <div class="flex items-center text-gray-600">
            <MagnifyingGlassIcon class="w-5 h-5 mr-2" />
            <span>
              Tìm thấy <span class="font-semibold text-blue-600">{{ pagination.total }}</span> kết
              quả
              <span v-if="searchQuery">
                cho "<span class="font-medium">{{ searchQuery }}</span
                >"
              </span>
              <span v-if="selectedTags.length > 0">
                với {{ selectedTags.length }} chủ đề được chọn</span
              >
              <span v-if="selectedDestination"> tại {{ selectedDestination }}</span>
              <span v-if="selectedSeason"> vào {{ getSeasonText(selectedSeason) }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading">
        <!-- Featured Post Skeleton -->
        <div class="mb-12">
          <LoadingSkeleton :featured="true" />
        </div>
        <!-- Regular Posts Skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <LoadingSkeleton v-for="i in 6" :key="i" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <ExclamationTriangleIcon class="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button
            @click="fetchNews(currentPage)"
            class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>

      <!-- Blog Posts -->
      <div v-else-if="news.length > 0" class="space-y-12">
        <!-- Featured Post -->
        <div v-if="news.length > 0 && news[0].is_featured" class="mb-12">
          <BlogCard
            :post="news[0]"
            :featured="true"
            @click="navigateToPost(news[0].id, news[0].title)"
          />
        </div>

        <!-- Regular Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard
            v-for="post in news.slice(news[0]?.is_featured ? 1 : 0)"
            :key="post.id"
            :post="post"
            @click="navigateToPost(post.id, post.title)"
          />
        </div>

        <!-- Pagination -->
        <BlogPagination :pagination="pagination" @page-change="changePage" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-sm">
          <DocumentTextIcon class="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            {{ hasActiveFilters ? 'Không tìm thấy kết quả' : 'Chưa có bài viết nào' }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{
              hasActiveFilters
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                : 'Hãy quay lại sau để xem những bài viết mới nhất'
            }}
          </p>
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Xem tất cả bài viết
          </button>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import BlogPagination from '@/components/blog/BlogPagination.vue'
import LoadingSkeleton from '@/components/blog/LoadingSkeleton.vue'
import SearchFilters from '@/components/blog/SearchFilters.vue'
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

const news = ref([])
const categories = ref([])
const error = ref(null)
const loading = ref(false)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 12,
  from: 0,
  to: 0,
  links: [],
})
const currentPage = ref(1)

// Filter states
const searchQuery = ref('')
const sortBy = ref('latest')
const selectedTags = ref([])
const selectedDestination = ref('')
const selectedSeason = ref('')
const selectedCategory = ref(null)

// Computed
const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    selectedTags.value.length > 0 ||
    selectedDestination.value ||
    selectedSeason.value ||
    selectedCategory.value
  )
})

// Methods
const fetchCategories = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${apiBaseUrl}/news-categories`)
    categories.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const fetchNews = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: '12',
      sort: sortBy.value,
    })

    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim())
    }

    if (selectedTags.value.length > 0) {
      params.append('tags', selectedTags.value.join(','))
    }

    if (selectedDestination.value) {
      params.append('destination', selectedDestination.value)
    }

    if (selectedSeason.value) {
      params.append('season', selectedSeason.value)
    }

    if (selectedCategory.value) {
      params.append('category_id', selectedCategory.value)
    }

    const response = await axios.get(`${apiBaseUrl}/news?${params}`)

    news.value = response.data.data || []
    pagination.value = {
      current_page: response.data.meta?.current_page || 1,
      last_page: response.data.meta?.last_page || 1,
      total: response.data.meta?.total || 0,
      per_page: response.data.meta?.per_page || 12,
      from: response.data.meta?.from || 0,
      to: response.data.meta?.to || 0,
      links: response.data.meta?.links || [],
    }
    currentPage.value = page

    // Scroll to top when changing pages
    if (page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải dữ liệu'
    console.error('Error fetching news:', err)
  } finally {
    loading.value = false
  }
}

const changePage = (url) => {
  if (!url) return
  const page = new URL(url).searchParams.get('page')
  fetchNews(parseInt(page))
}

const handleSearch = (query) => {
  searchQuery.value = query
  fetchNews(1)
}

const handleSortChange = (sort) => {
  sortBy.value = sort
  fetchNews(1)
}

const handleTagsChange = (tags) => {
  selectedTags.value = tags
  fetchNews(1)
}

const handleDestinationChange = (destination) => {
  selectedDestination.value = destination
  fetchNews(1)
}

const handleSeasonChange = (season) => {
  selectedSeason.value = season
  fetchNews(1)
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedTags.value = []
  selectedDestination.value = ''
  selectedSeason.value = ''
  selectedCategory.value = null
  sortBy.value = 'latest'
  fetchNews(1)
}

const getSeasonText = (season) => {
  const seasons = {
    spring: 'mùa xuân',
    summer: 'mùa hè',
    autumn: 'mùa thu',
    winter: 'mùa đông',
    all_year: 'quanh năm',
  }
  return seasons[season] || season
}

// Slug generation function
const generateSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD') // Normalize to decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}

const navigateToPost = (postId, postTitle) => {
  const slug = generateSlug(postTitle)
  router.push(`/blog/${postId}-${slug}`)
}

onMounted(() => {
  fetchCategories()
  fetchNews()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
