<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox class="max-w-6xl mx-auto">
        <SectionTitleLineWithButton title="Tạo Blog Mới" :icon="mdiNewspaper" main>
          <BaseButton label="Quay lại" color="light" :icon="mdiArrowLeft" rounded @click="goBack" />
        </SectionTitleLineWithButton>

        <form @submit.prevent="submitBlog" class="space-y-8 p-6">
          <!-- Basic Information Section -->
          <div class="bg-gray-50 rounded-xl p-6 dark:bg-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
              Thông tin cơ bản
            </h3>

            <div class="space-y-4">
              <BlogTitleInput
                :value="form.title"
                @update:value="((form.title = $event), markAsChanged())"
              />

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
                    @keyup.enter="addTag"
                    type="text"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Nhập tag và nhấn Enter"
                  />
                  <BaseButton label="Thêm" color="info" small @click="addTag" />
                </div>
              </div>
            </div>
          </div>

          <!-- Featured Image -->
          <div class="bg-gray-50 rounded-xl p-6 dark:bg-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
              Hình ảnh đại diện
            </h3>
            <BlogImageUpload
              :value="form.image"
              @update:value="((form.image = $event), markAsChanged())"
              @error="error = $event"
              @loading="loading = $event"
              @insert-image="insertImageToContent"
            />
          </div>

          <!-- Content Editor -->
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
                  <BaseButton color="danger" small @click="removeTravelTip(index)">
                    Xóa
                  </BaseButton>
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

          <!-- Publishing Options -->
          <BlogMetaFields
            :published-at="form.published_at"
            :status="form.blog_status"
            @update:published-at="((form.published_at = $event), markAsChanged())"
            @update:status="((form.blog_status = $event), markAsChanged())"
          />

          <!-- Action Buttons -->
          <BlogActionButtons :loading="loading" @save-draft="saveDraft" @submit="submitBlog" />

          <!-- Messages -->
          <BlogMessages :error="error" :success="success" />

          <!-- Unsaved Changes Indicator -->
          <div v-if="hasUnsavedChanges" class="text-orange-600 text-sm flex items-center gap-2">
            <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Có thay đổi chưa được lưu
          </div>
        </form>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>

  <!-- Image Insert Modal -->
  <ImageInsertModal
    :show="showImageInsertModal"
    :image-url="imageUrl"
    :image-size="imageSize"
    @update:show="showImageInsertModal = $event"
    @update:image-url="imageUrl = $event"
    @update:image-size="imageSize = $event"
    @insert="insertImage"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BlogTitleInput from '@/components/blog/BlogTitleInput.vue'
import BlogImageUpload from '@/components/blog/BlogImageUpload.vue'
import RichTextEditor from '@/components/blog/RichTextEditor.vue'
import BlogMetaFields from '@/components/blog/BlogMetaFields.vue'
import BlogActionButtons from '@/components/blog/BlogActionButtons.vue'
import BlogMessages from '@/components/blog/BlogMessages.vue'
import ImageInsertModal from '@/components/blog/ImageInsertModal.vue'
import { mdiNewspaper, mdiArrowLeft } from '@mdi/js'

const router = useRouter()
const form = ref({
  title: '',
  content: '',
  excerpt: '',
  image: '',
  category_id: '',
  tags: [],
  published_at: '',
  blog_status: 'draft',
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
  author_type: 'admin',
  admin_id: null,
})

const categories = ref([])
const newTag = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const userInfo = ref(null)
const showImageInsertModal = ref(false)
const imageUrl = ref('')
const imageSize = ref('medium')
const activeFormats = ref([])
const richTextEditor = ref(null)
const hasUnsavedChanges = ref(false)
const isManualSave = ref(false)

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

const adminToken = localStorage.getItem('adminToken')
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

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

// Tag management
function addTag() {
  if (newTag.value.trim() && !form.value.tags.includes(newTag.value.trim())) {
    form.value.tags.push(newTag.value.trim())
    newTag.value = ''
    markAsChanged()
  }
}

function removeTag(index) {
  form.value.tags.splice(index, 1)
  markAsChanged()
}

// Travel tips management
function addTravelTip() {
  form.value.travel_tips.push('')
  markAsChanged()
}

function removeTravelTip(index) {
  form.value.travel_tips.splice(index, 1)
  markAsChanged()
}

function markAsChanged() {
  hasUnsavedChanges.value = true
}

function updateContent(newContent) {
  form.value.content = newContent
  markAsChanged()
}

async function getUserInfo() {
  if (!adminToken) {
    alert('Bạn cần đăng nhập để truy cập trang này.')
    router.push('/admin/login')
    return
  }
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const config = { headers: { Authorization: `Bearer ${adminToken}` } }
    const response = await axios.get(`${baseUrl}/admin/profile`, config)
    userInfo.value = response.data
    form.value.admin_id = response.data.id
  } catch (err) {
    console.error('Không thể lấy thông tin user:', err)
    error.value = 'Không thể xác thực người dùng.'
  }
}

async function submitBlog() {
  isManualSave.value = true

  if (!form.value.title.trim()) {
    error.value = 'Vui lòng nhập tiêu đề blog.'
    isManualSave.value = false
    return
  }

  if (!form.value.content.trim()) {
    error.value = 'Vui lòng nhập nội dung blog.'
    isManualSave.value = false
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  if (richTextEditor.value && richTextEditor.value.forceEmitContent) {
    richTextEditor.value.forceEmitContent()
  }

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const config = { headers: { Authorization: `Bearer ${adminToken}` } }
    const blogData = {
      title: form.value.title,
      content: form.value.content,
      excerpt: form.value.excerpt,
      image: form.value.image || null,
      category_id: form.value.category_id || null,
      tags: form.value.tags,
      published_at: form.value.published_at,
      blog_status: form.value.blog_status,
      is_featured: form.value.is_featured,
      meta_description: form.value.meta_description,
      meta_keywords: form.value.meta_keywords,
      destination: form.value.destination,
      latitude: form.value.latitude,
      longitude: form.value.longitude,
      travel_season: form.value.travel_season,
      travel_tips: form.value.travel_tips.filter((tip) => tip.trim()),
      estimated_budget: form.value.estimated_budget,
      duration_days: form.value.duration_days,
      author_type: form.value.author_type,
      admin_id: form.value.admin_id,
      vendor_id: null,
    }

    await axios.post(`${baseUrl}/news`, blogData, config)
    success.value = true
    hasUnsavedChanges.value = false

    const statusText = form.value.blog_status === 'published' ? 'xuất bản' : 'lưu nháp'
    console.log(`Blog đã được ${statusText} thành công!`)

    setTimeout(() => router.push('/admin/blogs'), 1500)
  } catch (err) {
    console.error('Error creating blog:', err)
    error.value = err.response?.data?.message || 'Lỗi khi tạo blog.'
  } finally {
    loading.value = false
    isManualSave.value = false
  }
}

async function saveDraft() {
  isManualSave.value = true
  form.value.blog_status = 'draft'

  if (!form.value.title.trim()) {
    const now = new Date()
    form.value.title = `Blog nháp ${now.toLocaleString('vi-VN')}`
  }

  if (!form.value.content.trim()) {
    form.value.content = '<p>Nội dung blog...</p>'
  }

  await submitBlog()
}

function goBack() {
  if (hasUnsavedChanges.value) {
    if (confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?')) {
      router.push('/admin/blogs')
    }
  } else {
    router.push('/admin/blogs')
  }
}

function insertImageToContent(url, size) {
  if (richTextEditor.value && richTextEditor.value.insertImage) {
    richTextEditor.value.insertImage(url, size)
    markAsChanged()
  }
}

function openImageInsertModal() {
  showImageInsertModal.value = true
  markAsChanged()
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

function handleBeforeUnload(e) {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?'
    return e.returnValue
  }
}

onMounted(async () => {
  await getUserInfo()
  await fetchCategories()
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

@media (max-width: 768px) {
  .max-w-6xl {
    max-width: 100%;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .p-6 {
    padding: 1rem;
  }
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
