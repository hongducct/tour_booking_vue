<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header with Title and Back Button -->
      <SectionTitleLineWithButton title="Chỉnh sửa Bài viết" :icon="mdiNewspaper" main>
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
          <p class="text-gray-600 text-lg dark:text-gray-200">Đang tải dữ liệu bài viết...</p>
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

      <!-- Edit Form -->
      <CardBox v-else-if="form.title" class="max-w-6xl mx-auto">
        <form @submit.prevent="updatePost" class="space-y-8 p-6">
          <!-- Basic Information Section -->
          <div class="bg-gray-50 rounded-xl p-6 dark:bg-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
              Thông tin cơ bản
            </h3>

            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Tiêu đề bài viết *
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                  @input="markAsChanged"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Category Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Danh mục
                  </label>
                  <select
                    v-model="form.category_id"
                    @change="markAsChanged"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    <option value="">Chọn danh mục</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <!-- Featured Toggle -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Bài viết nổi bật
                  </label>
                  <div class="flex items-center">
                    <input
                      v-model="form.is_featured"
                      @change="markAsChanged"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Đánh dấu là bài viết nổi bật
                    </label>
                  </div>
                </div>
              </div>

              <!-- Excerpt -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Tóm tắt ngắn
                </label>
                <textarea
                  v-model="form.excerpt"
                  @input="markAsChanged"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Nhập tóm tắt ngắn cho bài viết..."
                  maxlength="500"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">{{ form.excerpt?.length || 0 }}/500 ký tự</p>
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Thẻ tag
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span
                    v-for="(tag, index) in form.tags"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ tag }}
                    <button
                      @click="removeTag(index)"
                      type="button"
                      class="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input
                    v-model="newTag"
                    @keydown.enter.prevent="addTag"
                    type="text"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Nhập tag và nhấn Enter"
                  />
                  <BaseButton label="Thêm" color="info" small @click="addTag" />
                </div>
              </div>
            </div>
          </div>

          <!-- Featured Image Section -->
          <div class="bg-gray-50 rounded-xl p-6 dark:bg-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
              Hình ảnh đại diện
            </h3>
            <BlogImageUpload
              :value="form.image"
              @update:value="updateFeaturedImage"
              @error="imageError = $event"
              @loading="imageLoading = $event"
              @insert-image="insertImageToContent"
            />
          </div>

          <!-- Rich Text Editor -->
          <div class="bg-gray-50 rounded-xl p-6 dark:bg-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
              Nội dung bài viết
            </h3>
            <RichTextEditor
              ref="richTextEditor"
              :value="form.content"
              @update:value="updateContent"
              @update:active-formats="activeFormats = $event"
              @open-image-modal="openImageInsertModal"
            />
          </div>

          <!-- Travel Information Section -->
          <div class="bg-gray-50 rounded-xl p-6 dark:bg-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
              Thông tin du lịch
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Destination -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Điểm đến
                </label>
                <input
                  v-model="form.destination"
                  @input="markAsChanged"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Ví dụ: Hà Nội, Đà Nẵng..."
                />
              </div>

              <!-- Travel Season -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Mùa du lịch
                </label>
                <select
                  v-model="form.travel_season"
                  @change="markAsChanged"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                  <option value="">Chọn mùa</option>
                  <option value="spring">Mùa xuân</option>
                  <option value="summer">Mùa hè</option>
                  <option value="autumn">Mùa thu</option>
                  <option value="winter">Mùa đông</option>
                  <option value="all_year">Quanh năm</option>
                </select>
              </div>

              <!-- Duration -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Số ngày (tùy chọn)
                </label>
                <input
                  v-model.number="form.duration_days"
                  @input="markAsChanged"
                  type="number"
                  min="1"
                  max="365"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Số ngày du lịch"
                />
              </div>

              <!-- Budget -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Ngân sách ước tính (VND)
                </label>
                <input
                  v-model.number="form.estimated_budget"
                  @input="markAsChanged"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Ví dụ: 5000000"
                />
              </div>
            </div>

            <!-- Coordinates Section with Map -->
            <div class="mt-6 bg-green-50 rounded-xl p-6 border border-green-100 dark:bg-gray-700">
              <h4
                class="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2 dark:text-gray-200"
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
                Tọa độ GPS
              </h4>

              <!-- Coordinate Inputs -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Vĩ độ (Latitude)
                  </label>
                  <input
                    v-model.number="form.latitude"
                    @input="
                      markAsChanged(),
                      debouncedUpdateMapFromInputs()
                    "
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Ví dụ: 21.0285"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Kinh độ (Longitude)
                  </label>
                  <input
                    v-model.number="form.longitude"
                    @input="
                      markAsChanged(),
                      debouncedUpdateMapFromInputs()
                    "
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Ví dụ: 105.8542"
                  />
                </div>
              </div>

              <!-- Quick Location Buttons -->
              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  @click="setLocation(21.0285, 105.8542, 'Hà Nội')"
                  class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                >
                  Hà Nội
                </button>
                <button
                  type="button"
                  @click="setLocation(10.8231, 106.6297, 'TP.HCM')"
                  class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                >
                  TP.HCM
                </button>
                <button
                  type="button"
                  @click="setLocation(16.0544, 108.2022, 'Đà Nẵng')"
                  class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                >
                  Đà Nẵng
                </button>
                <button
                  type="button"
                  @click="getCurrentLocation"
                  :disabled="locationLoading"
                  class="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  {{ locationLoading ? 'Đang định vị...' : 'Vị trí hiện tại' }}
                </button>
              </div>

              <!-- Map Toggle Button -->
              <div class="mb-4">
                <button
                  type="button"
                  @click="toggleMapView"
                  :disabled="mapInitializing"
                  class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
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
                  {{ mapInitializing ? 'Đang tải...' : showMap ? 'Ẩn bản đồ' : 'Hiển thị bản đồ' }}
                </button>
                <p class="text-sm text-gray-600 mt-2 dark:text-gray-400">
                  {{
                    showMap
                      ? 'Click vào bản đồ để chọn vị trí hoặc kéo marker để điều chỉnh'
                      : 'Bạn có thể nhập tọa độ trực tiếp hoặc sử dụng bản đồ tương tác'
                  }}
                </p>
              </div>

              <!-- Map Container -->
              <div v-if="showMap" class="mb-4">
                <div
                  class="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-200"
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

                  <!-- Search Box -->
                  <div
                    v-if="mapLoaded && !mapInitializing"
                    class="absolute top-3 left-3 right-3 z-10"
                  >
                    <div class="relative">
                      <input
                        ref="searchInput"
                        type="text"
                        placeholder="Tìm kiếm địa điểm..."
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                      />
                      <svg
                        class="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
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
                    </div>
                  </div>

                  <!-- Map Controls -->
                  <div
                    v-if="mapLoaded && !mapInitializing"
                    class="absolute bottom-3 right-3 flex flex-col gap-2"
                  >
                    <button
                      type="button"
                      @click="centerMapOnCurrentLocation"
                      class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Vị trí hiện tại"
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
                      @click="resetMap"
                      class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Đặt lại bản đồ"
                    >
                      <svg
                        class="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Travel Tips -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Mẹo du lịch
              </label>
              <div class="space-y-2">
                <div v-for="(tip, index) in form.travel_tips" :key="index" class="flex gap-2">
                  <input
                    v-model="form.travel_tips[index]"
                    @input="markAsChanged"
                    type="text"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Nhập mẹo du lịch..."
                  />
                  <BaseButton
                    color="danger"
                    :icon="mdiDelete"
                    small
                    @click="removeTravelTip(index)"
                  />
                </div>
                <BaseButton label="Thêm mẹo" color="info" small @click="addTravelTip" />
              </div>
            </div>
          </div>

          <!-- SEO Section -->
          <div class="bg-gray-50 rounded-xl p-6 dark:bg-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">SEO & Meta</h3>

            <div class="space-y-4">
              <!-- Meta Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Meta Description
                </label>
                <textarea
                  v-model="form.meta_description"
                  @input="markAsChanged"
                  rows="3"
                  maxlength="160"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Mô tả ngắn gọn cho SEO (tối đa 160 ký tự)"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">
                  {{ form.meta_description?.length || 0 }}/160 ký tự
                </p>
              </div>

              <!-- Meta Keywords -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Meta Keywords
                </label>
                <input
                  v-model="form.meta_keywords"
                  @input="markAsChanged"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="từ khóa 1, từ khóa 2, từ khóa 3..."
                />
              </div>
            </div>
          </div>

          <!-- Meta Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Status -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Trạng thái
              </label>
              <select
                v-model="form.blog_status"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                @change="markAsChanged"
              >
                <option value="draft">Bản nháp</option>
                <option value="pending">Chờ duyệt</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
            </div>

            <!-- Author Info (Read-only) -->
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Tác giả
              </label>
              <input
                :value="getAuthorName()"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                readonly
              />
            </div>
          </div>

          <!-- Timestamps (Read-only) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Ngày xuất bản
              </label>
              <input
                :value="formatDateTime(form.published_at)"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                readonly
              />
            </div>
            <div>
              <label
                class="block text-sm font-semibold text-gray-700 mb-2 flex items-center dark:text-gray-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Ngày tạo
              </label>
              <input
                :value="formatDateTime(form.created_at)"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                readonly
              />
            </div>
          </div>

          <!-- Unsaved Changes Indicator -->
          <div
            v-if="hasUnsavedChanges"
            class="bg-orange-50 border border-orange-200 rounded-xl p-4"
          >
            <div class="flex items-center text-orange-700">
              <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-3"></span>
              <span class="font-medium">Có thay đổi chưa được lưu</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200"
          >
            <div class="flex gap-3">
              <BaseButton
                label="Quay lại"
                color="light"
                :icon="mdiArrowLeft"
                rounded
                @click="goBack"
              />
            </div>
            <div class="flex gap-3">
              <BaseButton
                label="Lưu nháp"
                color="warning"
                :icon="mdiContentSave"
                rounded
                :loading="loading"
                @click="saveDraft"
              />
              <BaseButton
                label="Cập nhật"
                color="success"
                :icon="mdiCheck"
                rounded
                :loading="loading"
                type="submit"
              />
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-xl p-4">
            <div class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="font-medium">Cập nhật bài viết thành công!</span>
            </div>
          </div>

          <div v-if="updateError" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-center text-red-700">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span class="font-medium">{{ updateError }}</span>
            </div>
          </div>

          <!-- Image Upload Error from BlogImageUpload -->
          <div v-if="imageError" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-center text-red-700">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span class="font-medium">{{ imageError }}</span>
            </div>
          </div>
        </form>
      </CardBox>

      <!-- Image Insert Modal for RichTextEditor -->
      <ImageInsertModal
        :show="showImageInsertModal"
        :image-url="imageUrl"
        :image-size="imageSize"
        @update:show="showImageInsertModal = $event"
        @update:image-url="imageUrl = $event"
        @update:image-size="imageSize = $event"
        @insert="insertImage"
      />
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import RichTextEditor from '@/components/blog/RichTextEditor.vue'
import BlogImageUpload from '@/components/blog/BlogImageUpload.vue'
import ImageInsertModal from '@/components/blog/ImageInsertModal.vue'
import {
  mdiNewspaper,
  mdiArrowLeft,
  mdiRefresh,
  mdiContentSave,
  mdiCheck,
  mdiDelete,
} from '@mdi/js'

const route = useRoute()
const router = useRouter()
const adminToken = localStorage.getItem('adminToken')

// Helper function to ensure array format
function ensureArray(value) {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      // If it's a comma-separated string, split it
      return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item)
    }
  }
  return []
}

// Helper function to safely parse JSON
function safeJsonParse(value, fallback = []) {
  if (Array.isArray(value)) return value
  if (!value) return fallback

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

// Form data with proper initialization
const form = ref({
  title: '',
  content: '',
  excerpt: '',
  blog_status: 'draft',
  image: '',
  category_id: '',
  tags: [],
  is_featured: false,
  meta_description: '',
  meta_keywords: '',
  destination: '',
  latitude: null,
  longitude: null,
  travel_season: '',
  travel_tips: [],
  estimated_budget: null,
  duration_days: null,
  author_type: '',
  admin_name: '',
  vendor_name: '',
  published_at: '',
  created_at: '',
  updated_at: '',
})

const categories = ref([])
const newTag = ref('')

// State management
const isLoading = ref(false)
const loading = ref(false)
const error = ref(null)
const updateError = ref('')
const success = ref(false)
const hasUnsavedChanges = ref(false)

// Image related states
const imageError = ref('')
const imageLoading = ref(false)

// RichTextEditor related states
const showImageInsertModal = ref(false)
const imageUrl = ref('')
const imageSize = ref('medium')
const activeFormats = ref([])
const richTextEditor = ref(null)

// Map related state
const mapContainer = ref(null)
const searchInput = ref(null)
const map = ref(null)
const marker = ref(null)
const mapLoaded = ref(false)
const mapInitializing = ref(false)
const searchBox = ref(null)
const showMap = ref(false)
const mapKey = ref(0)
const locationLoading = ref(false)

// Debounce timer
let debounceTimer = null

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Check authentication
if (!adminToken) {
  alert('Bạn cần đăng nhập để truy cập trang này.')
  router.push('/admin/login')
}

// Debounced function for input updates
const debouncedUpdateMapFromInputs = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    if (showMap.value && mapLoaded.value) {
      updateMapFromInputs()
    }
  }, 300)
}

// Set predefined location
const setLocation = (lat, lng, name) => {
  form.value.latitude = lat
  form.value.longitude = lng
  if (!form.value.destination && name) {
    form.value.destination = name
  }
  markAsChanged()

  // Update map if it's visible
  if (showMap.value && mapLoaded.value) {
    updateMapFromInputs()
  }
}

// Get current location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Trình duyệt của bạn không hỗ trợ định vị.')
    return
  }

  locationLoading.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      form.value.latitude = parseFloat(lat.toFixed(6))
      form.value.longitude = parseFloat(lng.toFixed(6))
      markAsChanged()

      // Update map if visible
      if (showMap.value && mapLoaded.value) {
        updateMapFromInputs()
      }
      locationLoading.value = false
    },
    (error) => {
      console.error('Error getting current location:', error)
      alert('Không thể xác định vị trí hiện tại của bạn.')
      locationLoading.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    },
  )
}

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
  searchBox.value = null
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

    const defaultLat = 16.0544
    const defaultLng = 108.2022
    const lat = parseFloat(form.value.latitude) || defaultLat
    const lng = parseFloat(form.value.longitude) || defaultLng

    // Initialize map
    map.value = new window.google.maps.Map(mapContainer.value, {
      zoom: form.value.latitude && form.value.longitude ? 12 : 6,
      center: { lat, lng },
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: 'cooperative',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    })

    // Create marker
    marker.value = new window.google.maps.Marker({
      position: { lat, lng },
      map: map.value,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    })

    // Map click event
    map.value.addListener('click', (event) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()

      marker.value.setPosition({ lat, lng })
      updateFormCoordinates(lat, lng)
      map.value.setCenter({ lat, lng })
      map.value.setZoom(15)
    })

    // Marker drag event
    marker.value.addListener('dragend', () => {
      const position = marker.value.getPosition()
      const lat = position.lat()
      const lng = position.lng()

      updateFormCoordinates(lat, lng)
      map.value.setCenter({ lat, lng })
    })

    // Initialize search box after map is ready
    setTimeout(() => {
      if (searchInput.value && window.google?.maps?.places) {
        try {
          searchBox.value = new window.google.maps.places.SearchBox(searchInput.value)
          searchBox.value.addListener('places_changed', handlePlaceSelection)
        } catch (error) {
          console.warn('Search box initialization failed:', error)
        }
      }
    }, 500)

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

// Handle place selection from search
const handlePlaceSelection = () => {
  const places = searchBox.value.getPlaces()
  if (!places.length) return

  const place = places[0]
  if (!place.geometry?.location) return

  map.value.setCenter(place.geometry.location)
  map.value.setZoom(15)
  marker.value.setPosition(place.geometry.location)

  const lat = place.geometry.location.lat()
  const lng = place.geometry.location.lng()
  updateFormCoordinates(lat, lng)

  // Auto-fill destination if empty
  if (place.name && !form.value.destination) {
    form.value.destination = place.name
    markAsChanged()
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
  if (searchBox.value) {
    window.google?.maps?.event?.clearInstanceListeners(searchBox.value)
  }

  map.value = null
  marker.value = null
  searchBox.value = null
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

// Update form coordinates
const updateFormCoordinates = (lat, lng) => {
  form.value.latitude = parseFloat(lat.toFixed(6))
  form.value.longitude = parseFloat(lng.toFixed(6))
  markAsChanged()
}

// Update map from input fields
const updateMapFromInputs = () => {
  if (!map.value || !marker.value || !form.value.latitude || !form.value.longitude) return

  const lat = parseFloat(form.value.latitude)
  const lng = parseFloat(form.value.longitude)

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return
  }

  const position = { lat, lng }
  marker.value.setPosition(position)
  map.value.setCenter(position)
  map.value.setZoom(15)
}

// Center map on user's current location
const centerMapOnCurrentLocation = () => {
  if (!map.value || !marker.value) return

  locationLoading.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      const currentLocation = { lat, lng }

      map.value.setCenter(currentLocation)
      map.value.setZoom(15)
      marker.value.setPosition(currentLocation)

      updateFormCoordinates(lat, lng)
      locationLoading.value = false
    },
    (error) => {
      console.error('Error getting current location:', error)
      alert('Không thể xác định vị trí hiện tại của bạn.')
      locationLoading.value = false
    },
  )
}

// Reset map to default view
const resetMap = () => {
  if (!map.value || !marker.value) return

  const defaultLat = 16.0544
  const defaultLng = 108.2022
  const defaultPosition = { lat: defaultLat, lng: defaultLng }

  map.value.setCenter(defaultPosition)
  map.value.setZoom(6)
  marker.value.setPosition(defaultPosition)

  updateFormCoordinates(defaultLat, defaultLng)
}

// Fetch categories
async function fetchCategories() {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${baseUrl}/news-categories?active=true`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    categories.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

// Tag management with proper array handling
function addTag() {
  if (!newTag.value.trim()) return

  // Ensure tags is an array
  if (!Array.isArray(form.value.tags)) {
    form.value.tags = []
  }

  const trimmedTag = newTag.value.trim()
  if (!form.value.tags.includes(trimmedTag)) {
    form.value.tags.push(trimmedTag)
    newTag.value = ''
    markAsChanged()
  }
}

function removeTag(index) {
  // Ensure tags is an array
  if (!Array.isArray(form.value.tags)) {
    form.value.tags = []
    return
  }

  if (index >= 0 && index < form.value.tags.length) {
    form.value.tags.splice(index, 1)
    markAsChanged()
  }
}

// Travel tips management with proper array handling
function addTravelTip() {
  // Ensure travel_tips is an array
  if (!Array.isArray(form.value.travel_tips)) {
    form.value.travel_tips = []
  }

  form.value.travel_tips.push('')
  markAsChanged()
}

function removeTravelTip(index) {
  // Ensure travel_tips is an array
  if (!Array.isArray(form.value.travel_tips)) {
    form.value.travel_tips = []
    return
  }

  if (index >= 0 && index < form.value.travel_tips.length) {
    form.value.travel_tips.splice(index, 1)
    markAsChanged()
  }
}

// Get author name based on author_type
function getAuthorName() {
  if (form.value.author_type === 'admin') {
    return form.value.admin_name || 'Super Admin'
  } else {
    return form.value.vendor_name || 'Vendor'
  }
}

// Format date with time
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

// Mark form as changed
function markAsChanged() {
  hasUnsavedChanges.value = true
}

// Handle content updates from RichTextEditor
function updateContent(newContent) {
  form.value.content = newContent
  markAsChanged()
}

// Handle featured image updates from BlogImageUpload
function updateFeaturedImage(newImageUrl) {
  form.value.image = newImageUrl
  markAsChanged()
}

// Handle image insertion from BlogImageUpload component
function insertImageToContent(url, size) {
  if (richTextEditor.value && richTextEditor.value.insertImage) {
    richTextEditor.value.insertImage(url, size)
    markAsChanged()
  }
}

// RichTextEditor image insertion functions
function openImageInsertModal() {
  showImageInsertModal.value = true
}

function insertImage(url, size) {
  if (richTextEditor.value) {
    richTextEditor.value.insertImage(url, size)
    showImageInsertModal.value = false
    imageUrl.value = ''
    imageSize.value = 'medium'
    markAsChanged()
  }
}

// Fetch post data with proper array handling
async function fetchPost() {
  const postId = route.params.id

  if (!postId) {
    error.value = 'ID bài viết không hợp lệ'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(`${baseUrl}/news/${postId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.data && response.data.data) {
      const post = response.data.data

      // Properly handle array fields with safe parsing
      form.value = {
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        blog_status: post.blog_status || 'draft',
        image: post.image || '',
        category_id: post.category_id || '',
        tags: ensureArray(post.tags),
        is_featured: post.is_featured || false,
        meta_description: post.meta_description || '',
        meta_keywords: post.meta_keywords || '',
        destination: post.destination || '',
        latitude: post.latitude || null,
        longitude: post.longitude || null,
        travel_season: post.travel_season || '',
        travel_tips: ensureArray(post.travel_tips),
        estimated_budget: post.estimated_budget || null,
        duration_days: post.duration_days || null,
        author_type: post.author_type || '',
        admin_name: post.admin_name || '',
        vendor_name: post.vendor_name || '',
        published_at: post.published_at || '',
        created_at: post.created_at || '',
        updated_at: post.updated_at || '',
      }

      hasUnsavedChanges.value = false

      // Debug log to check data types
      console.log('Form data after fetch:', {
        tags: form.value.tags,
        tagsType: typeof form.value.tags,
        tagsIsArray: Array.isArray(form.value.tags),
        travel_tips: form.value.travel_tips,
        travelTipsType: typeof form.value.travel_tips,
        travelTipsIsArray: Array.isArray(form.value.travel_tips),
      })
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
      error.value = 'Bạn không có quyền chỉnh sửa bài viết này.'
    } else {
      error.value = 'Không thể tải dữ liệu bài viết. Vui lòng thử lại.'
    }
  } finally {
    isLoading.value = false
  }
}

// Update post with proper array handling
async function updatePost() {
  if (!form.value.title.trim()) {
    updateError.value = 'Vui lòng nhập tiêu đề bài viết.'
    return
  }

  if (!form.value.content.trim()) {
    updateError.value = 'Vui lòng nhập nội dung bài viết.'
    return
  }

  loading.value = true
  updateError.value = ''
  success.value = false
  imageError.value = ''

  // Force emit content từ RichTextEditor để đảm bảo có content mới nhất
  if (richTextEditor.value && richTextEditor.value.forceEmitContent) {
    richTextEditor.value.forceEmitContent()
  }

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL

    // Ensure arrays are properly formatted
    const tags = Array.isArray(form.value.tags) ? form.value.tags : []
    const travelTips = Array.isArray(form.value.travel_tips)
      ? form.value.travel_tips.filter((tip) => tip && tip.trim())
      : []

    const updateData = {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      excerpt: form.value.excerpt,
      blog_status: form.value.blog_status,
      category_id: form.value.category_id || null,
      tags: tags,
      is_featured: form.value.is_featured,
      meta_description: form.value.meta_description,
      meta_keywords: form.value.meta_keywords,
      destination: form.value.destination,
      latitude: form.value.latitude,
      longitude: form.value.longitude,
      travel_season: form.value.travel_season,
      travel_tips: travelTips,
      estimated_budget: form.value.estimated_budget,
      duration_days: form.value.duration_days,
    }

    // Add image if it exists
    if (form.value.image && form.value.image.trim()) {
      updateData.image = form.value.image.trim()
    }

    console.log('Update data being sent:', updateData)

    await axios.put(`${baseUrl}/news/${route.params.id}`, updateData, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    success.value = true
    hasUnsavedChanges.value = false

    setTimeout(() => {
      router.push('/admin/blogs')
    }, 1500)
  } catch (err) {
    console.error('Lỗi khi cập nhật bài viết:', err)

    if (err.response?.status === 401) {
      updateError.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
    } else if (err.response?.status === 403) {
      updateError.value = 'Bạn không có quyền cập nhật bài viết này.'
    } else {
      updateError.value =
        err.response?.data?.message || 'Không thể cập nhật bài viết. Vui lòng thử lại.'
    }
  } finally {
    loading.value = false
  }
}

// Save as draft
async function saveDraft() {
  const originalStatus = form.value.blog_status
  form.value.blog_status = 'draft'

  await updatePost()

  // Restore original status if update failed
  if (updateError.value) {
    form.value.blog_status = originalStatus
  }
}

// Navigation functions
function goBack() {
  if (hasUnsavedChanges.value) {
    if (confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?')) {
      router.push('/admin/blogs')
    }
  } else {
    router.push('/admin/blogs')
  }
}

// Before unload warning
function handleBeforeUnload(e) {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?'
    return e.returnValue
  }
}

onMounted(() => {
  fetchPost()
  fetchCategories()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  cleanupMap()
})
</script>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
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

@media (max-width: 768px) {
  .max-w-6xl {
    max-width: 100%;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .p-6 {
    padding: 1rem;
  }

  .space-y-8 > * + * {
    margin-top: 1rem;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}

:deep(.ql-editor) {
  min-height: 200px;
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
