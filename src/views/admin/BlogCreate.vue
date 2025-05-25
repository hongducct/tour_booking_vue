<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox class="max-w-4xl mx-auto">
        <SectionTitleLineWithButton title="Tạo Blog Mới" :icon="mdiNewspaper" main>
          <BaseButton label="Quay lại" color="light" :icon="mdiArrowLeft" rounded @click="goBack" />
        </SectionTitleLineWithButton>
        <form @submit.prevent="submitBlog" class="space-y-6 p-6">
          <BlogTitleInput
            :value="form.title"
            @update:value="
              form.title = $event,
              markAsChanged()
            "
          />

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

          <RichTextEditor
            ref="richTextEditor"
            :value="form.content"
            @update:value="updateContent"
            @update:active-formats="activeFormats = $event"
            @open-image-modal="openImageInsertModal"
          />

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

          <BlogActionButtons :loading="loading" @save-draft="saveDraft" @submit="submitBlog" />
          <BlogMessages :error="error" :success="success" />

          <!-- FIXED: Thêm indicator để user biết có thay đổi chưa save -->
          <div v-if="hasUnsavedChanges" class="text-orange-600 text-sm flex items-center gap-2">
            <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Có thay đổi chưa được lưu
          </div>
        </form>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>

  <!-- Keep the existing modal for backward compatibility -->
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
  image: '',
  published_at: '',
  blog_status: 'draft',
  author_type: 'admin',
  admin_id: null,
})
const loading = ref(false)
const error = ref('')
const success = ref(false)
const userInfo = ref(null)
const showImageInsertModal = ref(false)
const imageUrl = ref('')
const imageSize = ref('medium')
const activeFormats = ref([])
const richTextEditor = ref(null)

// FIXED: Thêm state tracking cho unsaved changes
const hasUnsavedChanges = ref(false)
const isManualSave = ref(false)

const adminToken = localStorage.getItem('adminToken')

// FIXED: Function để mark có thay đổi
function markAsChanged() {
  hasUnsavedChanges.value = true
  console.log('Content marked as changed')
}

// FIXED: Function to update content from RichTextEditor - CHỈ update form, KHÔNG auto submit
function updateContent(newContent) {
  console.log('Content updated from RichTextEditor:', newContent.length, 'characters')

  // CHỈ cập nhật form data
  form.value.content = newContent

  // Mark as changed chỉ khi content thực sự khác
  if (form.value.content !== newContent) {
    markAsChanged()
  }

  // KHÔNG có bất kỳ auto-save logic nào ở đây
  console.log('Content updated - waiting for manual save')
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

// FIXED: Chỉ submit khi user nhấn nút Submit - KHÔNG auto submit
async function submitBlog() {
  console.log('Manual submit triggered')
  isManualSave.value = true

  // Validation cơ bản trước khi submit
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

  // FIXED: Force emit content từ RichTextEditor để đảm bảo có content mới nhất
  if (richTextEditor.value && richTextEditor.value.forceEmitContent) {
    richTextEditor.value.forceEmitContent()
  }

  // Debug log to check form data before submission
  console.log('Form data before submission:', form.value)

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const config = { headers: { Authorization: `Bearer ${adminToken}` } }
    const blogData = {
      title: form.value.title,
      content: form.value.content,
      image: form.value.image || null,
      published_at: form.value.published_at || null,
      blog_status: form.value.blog_status,
      author_type: form.value.author_type,
      admin_id: form.value.admin_id,
      vendor_id: null,
    }

    console.log('Blog data to be sent:', blogData)

    await axios.post(`${baseUrl}/news`, blogData, config)
    success.value = true
    hasUnsavedChanges.value = false // FIXED: Reset unsaved changes flag

    // Hiển thị thông báo thành công trước khi chuyển trang
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

// FIXED: Save as draft - chỉ khi user click nút Save Draft
async function saveDraft() {
  console.log('Save draft triggered')
  isManualSave.value = true

  // Cho phép lưu draft ngay cả khi chưa có đủ thông tin
  form.value.blog_status = 'draft'

  // Nếu không có title, tạo title tạm thời
  if (!form.value.title.trim()) {
    const now = new Date()
    form.value.title = `Blog nháp ${now.toLocaleString('vi-VN')}`
  }

  // Nếu không có content, tạo content tạm thời
  if (!form.value.content.trim()) {
    form.value.content = '<p>Nội dung blog...</p>'
  }

  await submitBlog()
}

// FIXED: Confirm trước khi rời trang nếu có unsaved changes
function goBack() {
  if (hasUnsavedChanges.value) {
    if (confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?')) {
      router.push('/admin/blogs')
    }
  } else {
    router.push('/admin/blogs')
  }
}

// Handle image insertion from BlogImageUpload component
function insertImageToContent(url, size) {
  console.log('Inserting image to content:', url, size)
  if (richTextEditor.value && richTextEditor.value.insertImage) {
    richTextEditor.value.insertImage(url, size)
    // FIXED: Mark as changed khi chèn ảnh, nhưng KHÔNG auto-save
    markAsChanged()
  } else {
    console.warn('RichTextEditor reference not available or insertImage method not found')
  }
}

// Legacy function for backward compatibility with existing modal
function openImageInsertModal() {
  showImageInsertModal.value = true
}

function insertImage(url, size) {
  if (richTextEditor.value) {
    richTextEditor.value.insertImage(url, size)
    showImageInsertModal.value = false
    imageUrl.value = ''
    imageSize.value = 'medium'
    // FIXED: Mark as changed khi chèn ảnh, nhưng KHÔNG auto-save
    markAsChanged()
  }
}

// FIXED: Warn user before leaving page nếu có unsaved changes
function handleBeforeUnload(e) {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?'
    return e.returnValue
  }
}

onMounted(async () => {
  await getUserInfo()
  // FIXED: Add beforeunload listener
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  // FIXED: Remove beforeunload listener
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
/* Keep existing scoped styles for main form layout */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Ensure proper spacing and responsive layout */
@media (max-width: 768px) {
  .max-w-4xl {
    max-width: 100%;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .p-6 {
    padding: 1rem;
  }

  .space-y-6 > * + * {
    margin-top: 1rem;
  }
}

/* Loading overlay improvements */
.form-container {
  position: relative;
}

.form-container.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

/* FIXED: Visual indicator for unsaved changes */
.unsaved-changes {
  position: relative;
}

.unsaved-changes::after {
  content: '•';
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: orange;
  color: white;
  border-radius: 50%;
  padding: 0.25rem;
  font-size: 0.75rem;
}

/* Responsive adjustments for buttons */
@media (max-width: 768px) {
  .blog-action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
