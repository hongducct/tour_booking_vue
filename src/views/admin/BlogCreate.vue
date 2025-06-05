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
                @update:value="
                  form.title = $event,
                  markAsChanged()
                "
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
              @update:value="
                form.image = $event,
                markAsChanged()
              "
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

              <!-- Coordinates -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Vĩ độ
                </label>
                <input
                  v-model.number="form.latitude"
                  @input="markAsChanged"
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
                  Kinh độ
                </label>
                <input
                  v-model.number="form.longitude"
                  @input="markAsChanged"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Ví dụ: 105.8542"
                />
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
            @update:published-at="
              form.published_at = $event,
              markAsChanged()
            "
            @update:status="
              form.blog_status = $event,
              markAsChanged()
            "
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
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

const adminToken = localStorage.getItem('adminToken')

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
</style>
