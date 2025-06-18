<template>
  <div class="min-h-screen bg-gray-50 mt-27">
    <TheHeader />

    <!-- Loading State -->
    <div v-if="loading" class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <BlogDetailSkeleton />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div class="text-red-600 mb-4">
              <ExclamationTriangleIcon class="w-16 h-16 mx-auto" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Không thể tải bài viết</h2>
            <p class="text-gray-600 mb-6">{{ error }}</p>
            <div class="flex gap-4 justify-center">
              <button
                @click="fetchBlogDetail"
                class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Thử lại
              </button>
              <router-link
                to="/blog"
                class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Quay lại danh sách
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog Content -->
    <article v-else-if="blog" class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <ol class="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <router-link to="/" class="hover:text-blue-600 transition-colors">
                  Trang chủ
                </router-link>
              </li>
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
              <li>
                <router-link to="/blog" class="hover:text-blue-600 transition-colors">
                  Blog
                </router-link>
              </li>
              <ChevronRightIcon class="w-4 h-4 text-gray-400" />
              <li class="text-gray-900 font-medium truncate">{{ blog.title }}</li>
            </ol>
          </nav>

          <!-- Article Header -->
          <header class="mb-8">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <!-- Featured Image -->
              <div class="relative">
                <img
                  :src="blog.image || '/images/placeholder.jpg'"
                  :alt="blog.title"
                  class="w-full h-64 md:h-80 lg:h-96 object-cover"
                  @error="handleImageError"
                />
                <!-- Share Button -->
                <div class="absolute top-6 right-6">
                  <button
                    @click="toggleShareMenu"
                    class="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ShareIcon class="w-5 h-5" />
                  </button>
                  <!-- Share Menu -->
                  <div
                    v-if="showShareMenu"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-10"
                  >
                    <button
                      v-for="platform in sharePlatforms"
                      :key="platform.name"
                      @click="shareOn(platform)"
                      class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <component :is="platform.icon" class="w-4 h-4 mr-3" />
                      {{ platform.name }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Article Meta -->
              <div class="p-6 md:p-8">
                <h1
                  class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                >
                  {{ blog.title }}
                </h1>

                <div class="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div class="flex items-center">
                    <UserIcon class="w-5 h-5 mr-2" />
                    <span class="font-medium">{{ blog.author }}</span>
                  </div>
                  <div class="flex items-center">
                    <CalendarIcon class="w-5 h-5 mr-2" />
                    <time :datetime="blog.publishedAt">{{ blog.date }}</time>
                  </div>
                  <div class="flex items-center">
                    <ClockIcon class="w-5 h-5 mr-2" />
                    <span>{{ readingTime }} phút đọc</span>
                  </div>
                  <div class="flex items-center">
                    <EyeIcon class="w-5 h-5 mr-2" />
                    <span>{{ blog.views || 0 }} lượt xem</span>
                  </div>
                </div>

                <!-- Tags -->
                <div v-if="blog.tags && blog.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
                  <span
                    v-for="tag in blog.tags"
                    :key="tag"
                    class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <!-- Travel Information Section -->
          <div v-if="hasTravelInfo" class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg
                class="w-6 h-6 mr-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Thông tin du lịch
            </h3>

            <!-- Travel Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <!-- Destination -->
              <div v-if="blog.destination" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-5 h-5 text-blue-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span class="text-sm font-medium text-gray-600">Điểm đến</span>
                </div>
                <p class="font-semibold text-gray-900">{{ blog.destination }}</p>
              </div>

              <!-- Travel Season -->
              <div v-if="blog.travel_season" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-5 h-5 text-orange-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span class="text-sm font-medium text-gray-600">Mùa du lịch</span>
                </div>
                <p class="font-semibold text-gray-900">
                  {{ getTravelSeasonText(blog.travel_season) }}
                </p>
              </div>

              <!-- Duration -->
              <div v-if="blog.duration_days" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-sm font-medium text-gray-600">Thời gian</span>
                </div>
                <p class="font-semibold text-gray-900">{{ blog.duration_days }} ngày</p>
              </div>

              <!-- Budget -->
              <div v-if="blog.estimated_budget" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-5 h-5 text-purple-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  <span class="text-sm font-medium text-gray-600">Ngân sách</span>
                </div>
                <p class="font-semibold text-gray-900">{{ formatBudget(blog.estimated_budget) }}</p>
              </div>
            </div>

            <!-- Map and Weather Section -->
            <div v-if="blog.latitude && blog.longitude" class="space-y-6">
              <!-- Map Toggle Button -->
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    class="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Vị trí và thời tiết
                </h4>
                <button
                  @click="toggleMapView"
                  :disabled="mapInitializing"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  {{ mapInitializing ? 'Đang tải...' : showMap ? 'Ẩn bản đồ' : 'Hiển thị bản đồ' }}
                </button>
              </div>

              <!-- Weather Information -->
              <div
                class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
              >
                <h5 class="text-md font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    class="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  Thông tin thời tiết hiện tại
                </h5>

                <div v-if="weatherLoading" class="flex items-center text-gray-600">
                  <div
                    class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"
                  ></div>
                  Đang tải dữ liệu thời tiết...
                </div>

                <div v-else-if="weatherError" class="text-red-600">
                  {{ weatherError }}
                </div>

                <div v-else-if="weather" class="flex items-center space-x-4">
                  <img :src="weather.icon" alt="Weather Icon" class="w-16 h-16" />
                  <div class="flex-1">
                    <div class="flex items-center space-x-4 mb-2">
                      <span class="text-3xl font-bold text-gray-800">{{ weather.temp }}°C</span>
                      <span class="text-lg text-gray-600 capitalize">{{
                        weather.description
                      }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                          />
                        </svg>
                        Độ ẩm: {{ weather.humidity }}%
                      </div>
                      <div class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                          />
                        </svg>
                        Gió: {{ weather.windSpeed }} m/s
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Map Container -->
              <div v-if="showMap" class="space-y-4">
                <div
                  class="relative w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-lg"
                >
                  <div
                    :key="mapKey"
                    ref="mapContainer"
                    class="w-full h-full"
                    v-show="mapLoaded && !mapInitializing"
                  ></div>

                  <!-- Loading State -->
                  <div
                    v-if="mapInitializing"
                    class="absolute inset-0 flex items-center justify-center bg-gray-100"
                  >
                    <div class="text-center">
                      <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
                      ></div>
                      <p class="text-gray-600 text-sm">Đang tải bản đồ...</p>
                    </div>
                  </div>

                  <!-- Map Error State -->
                  <div
                    v-if="!mapInitializing && !mapLoaded && showMap"
                    class="absolute inset-0 flex items-center justify-center bg-gray-100"
                  >
                    <div class="text-center">
                      <p class="text-gray-600 text-sm mb-2">Không thể tải bản đồ</p>
                      <button
                        @click="retryMapInit"
                        class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Thử lại
                      </button>
                    </div>
                  </div>

                  <!-- Map Info Overlay -->
                  <div
                    v-if="mapLoaded && !mapInitializing"
                    class="absolute top-3 left-3 bg-white rounded-lg shadow-md p-3 max-w-xs"
                  >
                    <div class="flex items-center mb-2">
                      <svg
                        class="w-4 h-4 text-blue-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span class="font-semibold text-gray-800 text-sm">{{
                        blog.destination || 'Vị trí'
                      }}</span>
                    </div>
                    <p class="text-xs text-gray-600">
                      {{ parseFloat(blog.latitude).toFixed(4) }},
                      {{ parseFloat(blog.longitude).toFixed(4) }}
                    </p>
                  </div>

                  <!-- Map Controls -->
                  <div
                    v-if="mapLoaded && !mapInitializing"
                    class="absolute bottom-3 right-3 flex flex-col gap-2"
                  >
                    <button
                      @click="centerMapOnLocation"
                      class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Về vị trí"
                    >
                      <svg
                        class="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="openInGoogleMaps"
                      class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Mở trong Google Maps"
                    >
                      <svg
                        class="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Travel Tips -->
            <div v-if="blog.travel_tips && blog.travel_tips.length > 0" class="mt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Mẹo du lịch</h4>
              <ul class="space-y-3">
                <li v-for="(tip, index) in blog.travel_tips" :key="index" class="flex items-start">
                  <span
                    class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"
                  ></span>
                  <span class="text-gray-700">{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Article Content -->
          <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div class="prose prose-lg max-w-none" v-html="formattedContent"></div>
          </div>

          <!-- Reviews Section -->
          <TourReviews
            :reviews="blog.reviews"
            :reviewableId="blog.id"
            :reviewableType="'App\\Models\\News'"
            title="Đánh giá bài viết"
          />

          <!-- Article Actions -->
          <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div class="flex gap-4">
                <router-link
                  to="/blog"
                  class="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon class="w-5 h-5 mr-2" />
                  Quay lại
                </router-link>
                <button
                  @click="toggleLike"
                  :class="[
                    'inline-flex items-center font-semibold py-3 px-6 rounded-lg transition-colors',
                    isLiked
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                  ]"
                >
                  <HeartIcon :class="['w-5 h-5 mr-2', isLiked ? 'fill-current' : '']" />
                  {{ isLiked ? 'Đã thích' : 'Thích' }} ({{ likeCount }})
                </button>
              </div>
              <button
                @click="openBookingModal"
                class="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <TicketIcon class="w-5 h-5 mr-2" />
                Đặt tour ngay
              </button>
            </div>
          </div>

          <!-- Related Posts -->
          <div v-if="relatedPosts.length > 0" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Một số bài viết khác</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RelatedPostCard
                v-for="post in relatedPosts"
                :key="post.id"
                :post="post"
                @click="navigateToPost(post.id, post.title)"
              />
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- Booking Modal -->
    <BookingModal v-if="showBookingModal" @close="closeBookingModal" />

    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  TicketIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/solid'

import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import BlogDetailSkeleton from '@/components/blog/BlogDetailSkeleton.vue'
import RelatedPostCard from '@/components/blog/RelatedPostCard.vue'
import BookingModal from '@/components/blog/BookingModal.vue'
import TourReviews from '@/components/tour/TourReviews.vue'

const route = useRoute()
const router = useRouter()

const blog = ref(null)
const loading = ref(false)
const error = ref(null)
const isLiked = ref(false)
const likeCount = ref(0)
const showShareMenu = ref(false)
const showBookingModal = ref(false)
const relatedPosts = ref([])

// Map related state
const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const mapLoaded = ref(false)
const mapInitializing = ref(false)
const showMap = ref(false)
const mapKey = ref(0)

// Weather related state
const weather = ref(null)
const weatherLoading = ref(false)
const weatherError = ref(null)

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// Share platforms
const sharePlatforms = [
  {
    name: 'Facebook',
    icon: 'div', // Replace with actual icon
    url: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'Twitter',
    icon: 'div', // Replace with actual icon
    url: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: 'Copy Link',
    icon: 'div',
    action: 'copy',
  },
]

const generateSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const readingTime = computed(() => {
  if (!blog.value?.content) return 1
  const wordsPerMinute = 200
  const wordCount = blog.value.content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
})

const formattedContent = computed(() => {
  if (!blog.value?.content) return ''
  return blog.value.content.replace(/\n\n/g, '</p><p class="mb-4">').replace(/\n/g, '<br>')
})

const hasTravelInfo = computed(() => {
  return (
    blog.value?.destination ||
    blog.value?.travel_season ||
    blog.value?.duration_days ||
    blog.value?.estimated_budget ||
    (blog.value?.latitude && blog.value?.longitude) ||
    (blog.value?.travel_tips && blog.value.travel_tips.length > 0)
  )
})

// Helper functions
const getTravelSeasonText = (season) => {
  const seasons = {
    spring: 'Mùa xuân',
    summer: 'Mùa hè',
    autumn: 'Mùa thu',
    winter: 'Mùa đông',
    all_year: 'Quanh năm',
  }
  return seasons[season] || season
}

const formatBudget = (budget) => {
  if (!budget) return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(budget)
}

// Weather functions
const fetchWeather = async (lat, lng) => {
  try {
    weatherLoading.value = true
    weatherError.value = null
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}&lang=vi`
    const res = await axios.get(url)
    if (res.data) {
      weather.value = {
        temp: Math.round(res.data.main.temp),
        description: res.data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`,
        humidity: res.data.main.humidity,
        windSpeed: res.data.wind.speed,
      }
    }
  } catch (err) {
    console.error('Error fetching weather:', err.message)
    weatherError.value = 'Không thể tải dữ liệu thời tiết'
  } finally {
    weatherLoading.value = false
  }
}

// Map functions
const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      if (window.google?.maps) {
        resolve()
      } else {
        existingScript.addEventListener('load', resolve)
        existingScript.addEventListener('error', reject)
      }
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initMap = async () => {
  console.log('Initializing map...')

  // Reset map state
  map.value = null
  marker.value = null
  mapLoaded.value = false
  mapInitializing.value = true

  try {
    // Ensure Google Maps is loaded
    await loadGoogleMaps()

    // Wait for DOM to be ready
    await nextTick()

    if (!mapContainer.value) {
      console.error('Map container not found')
      return false
    }

    if (!blog.value?.latitude || !blog.value?.longitude) {
      console.error('No coordinates available')
      return false
    }

    const lat = parseFloat(blog.value.latitude)
    const lng = parseFloat(blog.value.longitude)

    // Initialize map
    map.value = new window.google.maps.Map(mapContainer.value, {
      zoom: 15,
      center: { lat, lng },
      mapTypeId: 'roadmap',
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'cooperative',
      styles: [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [{ color: '#ffffff' }, { lightness: 17 }],
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 21 }],
        },
      ],
    })

    // Create marker with custom info
    marker.value = new window.google.maps.Marker({
      position: { lat, lng },
      map: map.value,
      title: blog.value.destination || blog.value.title,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="4"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40),
      },
    })

    // Create info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 200px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">
            ${blog.value.destination || blog.value.title}
          </h4>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            ${lat.toFixed(6)}, ${lng.toFixed(6)}
          </p>
          ${
            blog.value.travel_season
              ? `
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #059669;">
              Mùa: ${getTravelSeasonText(blog.value.travel_season)}
            </p>
          `
              : ''
          }
        </div>
      `,
    })

    // Show info window on marker click
    marker.value.addListener('click', () => {
      infoWindow.open(map.value, marker.value)
    })

    mapLoaded.value = true
    console.log('Map initialized successfully')
    return true
  } catch (err) {
    console.error('Error initializing map:', err)
    mapLoaded.value = false
    return false
  } finally {
    mapInitializing.value = false
  }
}

const toggleMapView = async () => {
  if (!showMap.value) {
    showMap.value = true
    // Force re-render with new key
    mapKey.value++
    await nextTick()
    await initMap()
  } else {
    showMap.value = false
    // Clean up map
    cleanupMap()
  }
}

const cleanupMap = () => {
  if (map.value) {
    window.google?.maps?.event?.clearInstanceListeners(map.value)
  }
  if (marker.value) {
    window.google?.maps?.event?.clearInstanceListeners(marker.value)
  }

  map.value = null
  marker.value = null
  mapLoaded.value = false
  mapInitializing.value = false
}

const retryMapInit = async () => {
  cleanupMap()
  mapKey.value++
  await nextTick()
  await initMap()
}

const centerMapOnLocation = () => {
  if (!map.value || !blog.value?.latitude || !blog.value?.longitude) return

  const lat = parseFloat(blog.value.latitude)
  const lng = parseFloat(blog.value.longitude)
  const position = { lat, lng }

  map.value.setCenter(position)
  map.value.setZoom(15)
}

const openInGoogleMaps = () => {
  if (!blog.value?.latitude || !blog.value?.longitude) return

  const lat = parseFloat(blog.value.latitude)
  const lng = parseFloat(blog.value.longitude)
  const url = `https://www.google.com/maps?q=${lat},${lng}`

  window.open(url, '_blank')
}

const fetchBlogDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const [blogResponse, relatedResponse] = await Promise.all([
      axios.get(`${apiBaseUrl}/news/${route.params.id}`),
      axios.get(`${apiBaseUrl}/news?limit=3`).catch(() => ({ data: { data: [] } })),
    ])

    const data = blogResponse.data.data
    // Parse tags if it's a stringified JSON or malformed array
    let tags = []
    if (typeof data.tags === 'string') {
      try {
        tags = JSON.parse(data.tags)
        // If tags is a string after parsing, try splitting by comma
        if (typeof tags === 'string') {
          tags = tags.split(',').map((t) => t.trim())
        }
      } catch {
        // Fallback: try to extract tags by splitting string
        tags = data.tags
          .replace(/[\[\]"]/g, '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      }
    } else if (Array.isArray(data.tags)) {
      tags = data.tags
    }

    // Parse travel tips
    let travel_tips = []
    if (typeof data.travel_tips === 'string') {
      try {
        travel_tips = JSON.parse(data.travel_tips)
      } catch {
        travel_tips = data.travel_tips
          .replace(/[\[\]"]/g, '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      }
    } else if (Array.isArray(data.travel_tips)) {
      travel_tips = data.travel_tips
    }

    blog.value = {
      id: data.id,
      title: data.title,
      slug: generateSlug(data.title),
      image: data.image_url,
      author: data.vendor_name || data.admin_name || 'Admin',
      date: new Date(data.published_at).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      reviews: data.reviews || [],
      publishedAt: data.published_at,
      content: data.content || 'Nội dung đang cập nhật...',
      status: data.blog_status,
      tags,
      views: Math.floor(Math.random() * 1000) + 100,
      // Travel information
      destination: data.destination,
      latitude: data.latitude,
      longitude: data.longitude,
      travel_season: data.travel_season,
      duration_days: data.duration_days,
      estimated_budget: data.estimated_budget,
      travel_tips,
    }

    const expectedPath = `/blog/${data.id}-${blog.value.slug}`
    if (route.path !== expectedPath) {
      router.replace(expectedPath)
    }

    relatedPosts.value = relatedResponse.data.data
      .filter((post) => post.id !== data.id)
      .map((post) => ({
        ...post,
        slug: generateSlug(post.title),
      }))
      .slice(0, 3)

    likeCount.value = Math.floor(Math.random() * 50) + 10

    // Fetch weather if coordinates are available
    if (data.latitude && data.longitude) {
      await fetchWeather(parseFloat(data.latitude), parseFloat(data.longitude))
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Không thể tải bài viết. Vui lòng thử lại sau.'
    console.error('Error fetching blog detail:', err)
  } finally {
    loading.value = false
  }
}

const handleImageError = (event) => {
  event.target.src = '/images/placeholder.jpg'
}

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const shareOn = (platform) => {
  const currentUrl = window.location.href
  const title = blog.value?.title || ''

  if (platform.action === 'copy') {
    navigator.clipboard.writeText(currentUrl)
    showShareMenu.value = false
    return
  }

  const shareUrl = platform.url(currentUrl, title)
  window.open(shareUrl, '_blank', 'width=600,height=400')
  showShareMenu.value = false
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

const openBookingModal = () => {
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
}

const navigateToPost = (postId, postTitle) => {
  const slug = generateSlug(postTitle)
  router.push(`/blog/${postId}-${slug}`)
}

const handleClickOutside = (event) => {
  if (showShareMenu.value && !event.target.closest('.share-menu')) {
    showShareMenu.value = false
  }
}

watch(
  () => route.params.id,
  () => {
    fetchBlogDetail()
  },
)

onMounted(() => {
  fetchBlogDetail()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  cleanupMap()
})
</script>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #111827;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h1 {
  font-size: 2.25rem;
}
.prose h2 {
  font-size: 1.875rem;
}
.prose h3 {
  font-size: 1.5rem;
}
.prose h4 {
  font-size: 1.25rem;
}

.prose p {
  margin-bottom: 1.5rem;
}
.prose a {
  color: #3b82f6;
  text-decoration: underline;
}
.prose a:hover {
  color: #1d4ed8;
}
.prose img {
  border-radius: 0.5rem;
  margin: 2rem 0;
  max-width: 100%;
  height: auto;
}
.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
  margin: 2rem 0;
}
.prose ul,
.prose ol {
  margin: 1.5rem 0;
  padding-left: 2rem;
}
.prose li {
  margin: 0.5rem 0;
}
.prose code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 2rem 0;
}
.prose pre code {
  background-color: transparent;
  padding: 0;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
