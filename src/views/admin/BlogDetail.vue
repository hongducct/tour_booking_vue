<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header with Title and Back Button -->
      <SectionTitleLineWithButton title="Chi tiết Bài viết" :icon="mdiNewspaper" main>
        <BaseButton label="Quay lại" color="light" :icon="mdiArrowLeft" rounded @click="goBack" />
      </SectionTitleLineWithButton>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p class="text-gray-600 text-lg dark:text-gray-200">Đang tải chi tiết bài viết...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center max-w-md">
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8">
            <svg
              class="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-200">
              Có lỗi xảy ra
            </h3>
            <p class="text-gray-600 mb-6 dark:text-gray-200">{{ error }}</p>
            <BaseButton
              label="Thử lại"
              color="danger"
              :icon="mdiRefresh"
              rounded
              @click="fetchPost"
            />
          </div>
        </div>
      </div>

      <!-- Post Content -->
      <div v-else-if="post.id" class="space-y-6">
        <!-- Post Header Card -->
        <CardBox class="overflow-hidden">
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 rounded-xl shadow-xl/30 dark:bg-gray-800 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300"
          >
            <div class="max-w-6xl mx-auto">
              <!-- Post Title -->
              <div class="flex items-start justify-between mb-6">
                <h1
                  class="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight flex-1 dark:text-gray-100"
                >
                  {{ post.title }}
                </h1>
                <div class="flex gap-2 ml-4">
                  <span
                    v-if="post.is_featured"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    Nổi bật
                  </span>
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    :class="statusStyles[post.blog_status]"
                  >
                    {{ getStatusText(post.blog_status) }}
                  </span>
                </div>
              </div>

              <!-- Category and Tags -->
              <div class="mb-6 space-y-3">
                <div v-if="post.category" class="flex items-center">
                  <span class="text-sm font-medium text-gray-600 mr-2 dark:text-gray-400"
                    >Danh mục:</span
                  >
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :style="{
                      backgroundColor: post.category.color + '20',
                      color: post.category.color,
                    }"
                  >
                    {{ post.category.name }}
                  </span>
                </div>

                <div v-if="post.tags && post.tags.length > 0" class="flex items-start">
                  <span class="text-sm font-medium text-gray-600 mr-2 mt-1 dark:text-gray-400"
                    >Tags:</span
                  >
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in post.tags"
                      :key="tag"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Post Meta Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- Author Info -->
                <div class="bg-white rounded-xl p-4 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide dark:text-gray-200">
                        Tác giả
                      </p>
                      <p class="font-semibold text-gray-800 truncate dark:text-gray-100">
                        {{ getAuthorName() }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Author Type -->
                <div class="bg-white rounded-xl p-4 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Loại tài khoản</p>
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium dark:text-gray-800"
                        :class="
                          post.author_type === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        "
                      >
                        {{ post.author_type === 'admin' ? 'Quản trị viên' : 'Vendor' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- View Count -->
                <div class="bg-white rounded-xl p-4 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Lượt xem</p>
                      <p class="font-semibold text-gray-800 dark:text-gray-100">
                        {{ post.view_count || 0 }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Reading Time -->
                <div class="bg-white rounded-xl p-4 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Thời gian đọc</p>
                      <p class="font-semibold text-gray-800 dark:text-gray-100">
                        {{ post.reading_time || 1 }} phút
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Timestamps -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  class="flex items-center text-sm text-gray-600 bg-white rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-300"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="font-medium mr-2">Xuất bản:</span>
                  {{ formatDateTime(post.published_at) }}
                </div>
                <div
                  class="flex items-center text-sm text-gray-600 bg-white rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-300"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span class="font-medium mr-2">Cập nhật:</span>
                  {{ formatDateTime(post.updated_at) }}
                </div>
              </div>
            </div>
          </div>
        </CardBox>

        <!-- Travel Information Card -->
        <CardBox v-if="hasTraveInfo">
          <div class="p-6">
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-gray-100"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Destination -->
              <div v-if="post.destination" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-4 h-4 text-blue-500 mr-2"
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
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Điểm đến</span>
                </div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">{{ post.destination }}</p>
              </div>

              <!-- Travel Season -->
              <div v-if="post.travel_season" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-4 h-4 text-orange-500 mr-2"
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
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Mùa du lịch</span
                  >
                </div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ getTravelSeasonText(post.travel_season) }}
                </p>
              </div>

              <!-- Duration -->
              <div v-if="post.duration_days" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
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
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Thời gian</span
                  >
                </div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ post.duration_days }} ngày
                </p>
              </div>

              <!-- Budget -->
              <div v-if="post.estimated_budget" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-4 h-4 text-purple-500 mr-2"
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
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Ngân sách</span
                  >
                </div>
                <p class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ formatBudget(post.estimated_budget) }}
                </p>
              </div>

              <!-- Coordinates -->
              <div
                v-if="post.latitude && post.longitude"
                class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800"
              >
                <div class="flex items-center mb-2">
                  <svg
                    class="w-4 h-4 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Tọa độ</span>
                </div>
                <p class="font-semibold text-gray-900 text-sm dark:text-gray-100">
                  {{ parseFloat(post.latitude).toFixed(6) }},
                  {{ parseFloat(post.longitude).toFixed(6) }}
                </p>
              </div>
            </div>

            <!-- Map Section -->
            <div v-if="post.latitude && post.longitude" class="mt-6">
              <div class="flex items-center justify-between mb-4">
                <h4
                  class="text-md font-semibold text-gray-800 flex items-center gap-2 dark:text-gray-200"
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Vị trí trên bản đồ
                </h4>
                <button
                  type="button"
                  @click="toggleMapView"
                  :disabled="mapInitializing"
                  class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {{ mapInitializing ? 'Đang tải...' : showMap ? 'Ẩn bản đồ' : 'Hiển thị bản đồ' }}
                </button>
              </div>

              <!-- Map Container -->
              <div v-if="showMap" class="mb-4">
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
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"
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
                        type="button"
                        @click="retryMapInit"
                        class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
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
                        class="w-4 h-4 text-green-600 mr-2"
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
                        post.destination || 'Vị trí'
                      }}</span>
                    </div>
                    <p class="text-xs text-gray-600">
                      {{ parseFloat(post.latitude).toFixed(4) }},
                      {{ parseFloat(post.longitude).toFixed(4) }}
                    </p>
                  </div>

                  <!-- Map Controls -->
                  <div
                    v-if="mapLoaded && !mapInitializing"
                    class="absolute bottom-3 right-3 flex flex-col gap-2"
                  >
                    <button
                      type="button"
                      @click="centerMapOnLocation"
                      class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Về vị trí"
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
                      type="button"
                      @click="openInGoogleMaps"
                      class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Mở trong Google Maps"
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Travel Tips -->
            <div v-if="post.travel_tips && post.travel_tips.length > 0" class="mt-6">
              <h4 class="text-md font-semibold text-gray-900 mb-3 dark:text-gray-100">
                Mẹo du lịch
              </h4>
              <ul class="space-y-2">
                <li v-for="(tip, index) in post.travel_tips" :key="index" class="flex items-start">
                  <span
                    class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"
                  ></span>
                  <span class="text-gray-700 dark:text-gray-300">{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardBox>

        <!-- SEO Information Card -->
        <CardBox v-if="post.meta_description || post.meta_keywords">
          <div class="p-6">
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-gray-100"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Thông tin SEO
            </h3>

            <div class="space-y-4">
              <div v-if="post.meta_description" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-4 h-4 text-blue-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Meta Description</span
                  >
                </div>
                <p class="text-gray-900 dark:text-gray-100">{{ post.meta_description }}</p>
              </div>

              <div v-if="post.meta_keywords" class="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                <div class="flex items-center mb-2">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400"
                    >Meta Keywords</span
                  >
                </div>
                <p class="text-gray-900 dark:text-gray-100">{{ post.meta_keywords }}</p>
              </div>
            </div>
          </div>
        </CardBox>

        <!-- Featured Image Card -->
        <CardBox>
          <div class="p-6">
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-gray-100"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Hình ảnh đại diện
            </h3>

            <!-- Has Image -->
            <div v-if="post.image_url" class="relative group">
              <div class="relative overflow-hidden rounded-xl shadow-lg">
                <img
                  :src="post.image_url"
                  :alt="post.title"
                  class="w-full max-h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                  @error="handleImageError($event)"
                />
                <div
                  class="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
                >
                  <button
                    @click="openImageModal"
                    class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg"
                  >
                    <svg
                      class="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>

            <!-- No Image Placeholder -->
            <div
              v-else
              class="w-full h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
            >
              <div class="text-center">
                <svg
                  class="w-12 h-12 text-gray-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p class="text-gray-500">Không có hình ảnh đại diện</p>
              </div>
            </div>
          </div>
        </CardBox>

        <!-- Content Card -->
        <CardBox>
          <div class="p-6">
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-gray-300"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Nội dung bài viết
            </h3>

            <div
              v-if="post.content"
              class="prose prose-lg max-w-none dark:text-gray-200"
              v-html="sanitizedContent"
            ></div>
            <div v-else class="text-center py-12 text-gray-500 dark:text-gray-200">
              <svg
                class="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p class="text-lg italic">Bài viết không có nội dung.</p>
            </div>
          </div>
        </CardBox>

        <!-- Actions Card -->
        <CardBox>
          <div class="p-6">
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div class="flex gap-3">
                <BaseButton
                  label="Quay lại"
                  color="light"
                  :icon="mdiArrowLeft"
                  rounded
                  @click="goBack"
                />
                <BaseButton
                  label="Chỉnh sửa"
                  color="info"
                  :icon="mdiPencil"
                  rounded
                  @click="editPost"
                />
              </div>
              <div class="flex gap-3">
                <BaseButton
                  v-if="post.blog_status === 'published'"
                  label="Ẩn bài viết"
                  color="warning"
                  :icon="mdiEyeOff"
                  rounded
                  @click="toggleStatus"
                />
                <BaseButton
                  v-else
                  label="Xuất bản"
                  color="success"
                  :icon="mdiEye"
                  rounded
                  @click="toggleStatus"
                />
                <BaseButton
                  label="Xóa bài viết"
                  color="danger"
                  :icon="mdiDelete"
                  rounded
                  @click="deletePost"
                />
              </div>
            </div>
          </div>
        </CardBox>
      </div>

      <!-- Image Modal -->
      <div
        v-if="showImageModal"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        @click="closeImageModal"
      >
        <div
          class="relative flex flex-col items-center justify-center max-w-4xl max-h-[90vh] w-full h-full m-auto"
          @click.stop
        >
          <img
            :src="post.image_url"
            :alt="post.title"
            class="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
          <button
            @click="closeImageModal"
            class="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import {
  mdiNewspaper,
  mdiArrowLeft,
  mdiRefresh,
  mdiPencil,
  mdiEye,
  mdiEyeOff,
  mdiDelete,
} from '@mdi/js'

const route = useRoute()
const router = useRouter()
const post = ref({})
const isLoading = ref(false)
const error = ref(null)
const showImageModal = ref(false)

// Map related state
const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const mapLoaded = ref(false)
const mapInitializing = ref(false)
const showMap = ref(false)
const mapKey = ref(0)

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Status badge styles
const statusStyles = {
  draft:
    'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-800 dark:text-yellow-200',
  pending:
    'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-800 dark:text-orange-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-800 dark:text-red-200',
  published:
    'bg-green-50 text-green-700 border border-green-200 dark:bg-green-800 dark:text-green-200',
  archived: 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-200',
}

// Computed
const hasTraveInfo = computed(() => {
  return (
    post.value.destination ||
    post.value.travel_season ||
    post.value.duration_days ||
    post.value.estimated_budget ||
    (post.value.latitude && post.value.longitude) ||
    (post.value.travel_tips && post.value.travel_tips.length > 0)
  )
})

const sanitizedContent = computed(() => {
  if (!post.value.content) return ''
  return post.value.content
})

// Load Google Maps
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

// Initialize map
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

    if (!post.value.latitude || !post.value.longitude) {
      console.error('No coordinates available')
      return false
    }

    const lat = parseFloat(post.value.latitude)
    const lng = parseFloat(post.value.longitude)

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
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }],
        },
      ],
    })

    // Create marker with custom info
    marker.value = new window.google.maps.Marker({
      position: { lat, lng },
      map: map.value,
      title: post.value.destination || post.value.title,
      animation: window.google.maps.Animation.DROP,
    })

    // Create info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 200px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">
            ${post.value.destination || post.value.title}
          </h4>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            ${lat.toFixed(6)}, ${lng.toFixed(6)}
          </p>
          ${
            post.value.travel_season
              ? `
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #059669;">
              Mùa: ${getTravelSeasonText(post.value.travel_season)}
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

// Toggle map view
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

// Cleanup map
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

// Retry map initialization
const retryMapInit = async () => {
  cleanupMap()
  mapKey.value++
  await nextTick()
  await initMap()
}

// Center map on location
const centerMapOnLocation = () => {
  if (!map.value || !post.value.latitude || !post.value.longitude) return

  const lat = parseFloat(post.value.latitude)
  const lng = parseFloat(post.value.longitude)
  const position = { lat, lng }

  map.value.setCenter(position)
  map.value.setZoom(15)
}

// Open in Google Maps
const openInGoogleMaps = () => {
  if (!post.value.latitude || !post.value.longitude) return

  const lat = parseFloat(post.value.latitude)
  const lng = parseFloat(post.value.longitude)
  const url = `https://www.google.com/maps?q=${lat},${lng}`

  window.open(url, '_blank')
}

// Helper functions
function getAuthorName() {
  if (post.value.author_type === 'admin') {
    return post.value.admin_name || 'Super Admin'
  } else {
    return post.value.vendor_name || 'Vendor'
  }
}

function getStatusText(status) {
  const statusMap = {
    draft: 'Bản nháp',
    pending: 'Chờ duyệt',
    rejected: 'Bị từ chối',
    published: 'Đã xuất bản',
    archived: 'Đã lưu trữ',
  }
  return statusMap[status] || 'Không rõ'
}

function getTravelSeasonText(season) {
  const seasons = {
    spring: 'Mùa xuân',
    summer: 'Mùa hè',
    autumn: 'Mùa thu',
    winter: 'Mùa đông',
    all_year: 'Quanh năm',
  }
  return seasons[season] || season
}

function formatDateTime(dateString) {
  if (!dateString) return 'Chưa có'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return 'Lỗi định dạng'
  }
}

function formatBudget(budget) {
  if (!budget) return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(budget)
}

function handleImageError(event) {
  event.target.src = '/images/placeholder.png'
  event.target.alt = 'Không thể tải hình ảnh'
}

function openImageModal() {
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
}

// API functions
async function fetchPost() {
  const postId = route.params.id

  if (!postId) {
    error.value = 'ID bài viết không hợp lệ'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      alert('Bạn cần đăng nhập để truy cập trang này.')
      router.push('/admin/login')
      return
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${baseUrl}/news/${postId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.data && response.data.data) {
      post.value = response.data.data
    } else {
      throw new Error('Dữ liệu trả về không đúng định dạng')
    }
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết bài viết:', err)

    if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
    } else if (err.response?.status === 404) {
      error.value = 'Không tìm thấy bài viết này.'
    } else if (err.response?.status === 403) {
      error.value = 'Bạn không có quyền xem bài viết này.'
    } else {
      error.value = 'Không thể tải chi tiết bài viết. Vui lòng thử lại.'
    }
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.push('/admin/blogs')
}

function editPost() {
  router.push(`/admin/blogs/edit/${post.value.id}`)
}

async function toggleStatus() {
  const newStatus = post.value.blog_status === 'published' ? 'draft' : 'published'

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const adminToken = localStorage.getItem('adminToken')

    await axios.put(
      `${baseUrl}/news/${post.value.id}`,
      {
        blog_status: newStatus,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    )

    post.value.blog_status = newStatus
    alert(`Đã ${newStatus === 'published' ? 'xuất bản' : 'ẩn'} bài viết thành công!`)
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái:', error)
    alert('Không thể thay đổi trạng thái bài viết. Vui lòng thử lại.')
  }
}

async function deletePost() {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const adminToken = localStorage.getItem('adminToken')
      await axios.delete(`${baseUrl}/news/${post.value.id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      alert('Xóa bài viết thành công.')
      setTimeout(() => {
        router.push('/admin/blogs')
      }, 1200)
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error)
      alert('Không thể xóa bài viết. Vui lòng thử lại.')
    }
  }
}

onMounted(() => {
  fetchPost()
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

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid-cols-3 {
    grid-template-columns: 1fr;
  }

  .text-3xl {
    font-size: 1.875rem;
  }

  .lg\:text-4xl {
    font-size: 2.25rem;
  }
}
</style>
