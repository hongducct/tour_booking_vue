<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header with Title and Back Button -->
      <SectionTitleLineWithButton title="Tạo Blog Mới" :icon="mdiNewspaper" main>
        <BaseButton label="Quay lại" color="light" :icon="mdiArrowLeft" rounded @click="goBack" />
      </SectionTitleLineWithButton>

      <CardBox class="max-w-4xl mx-auto">
        <form @submit.prevent="submitBlog" class="space-y-6 p-6">
          <!-- Title -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Tiêu đề Blog:</label>
            <input
              v-model="form.title"
              type="text"
              maxlength="255"
              required
              placeholder="Nhập tiêu đề hấp dẫn cho blog của bạn..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Ảnh đại diện:</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div v-if="form.image" class="mt-4">
              <div class="relative inline-block">
                <img
                  :src="form.image"
                  alt="Preview"
                  class="max-w-xs h-40 object-cover rounded-lg shadow-md"
                  @error="handleImageError"
                />
                <button
                  type="button"
                  @click="form.image = ''"
                  class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 mt-2">Chưa có ảnh được tải lên.</p>
          </div>

          <!-- Rich Text Editor -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Nội dung Blog:</label>
            <!-- Toolbar -->
            <div class="border border-gray-300 rounded-t-lg p-3 bg-gray-50 flex flex-wrap gap-2">
              <button
                type="button"
                @click="formatText('bold')"
                class="toolbar-btn"
                :class="{ active: activeFormats.includes('bold') }"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                @click="formatText('italic')"
                class="toolbar-btn"
                :class="{ active: activeFormats.includes('italic') }"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                @click="formatText('underline')"
                class="toolbar-btn"
                :class="{ active: activeFormats.includes('underline') }"
              >
                <u>U</u>
              </button>
              <div class="border-l border-gray-300 mx-2 h-6"></div>
              <button type="button" @click="insertOrderedList" class="toolbar-btn">
                <BaseIcon :path="mdiFormatListNumbered" class="w-5 h-5" />
              </button>
              <button type="button" @click="insertUnorderedList" class="toolbar-btn">
                <BaseIcon :path="mdiFormatListBulleted" class="w-5 h-5" />
              </button>
              <div class="border-l border-gray-300 mx-2 h-6"></div>
              <button type="button" @click="insertLink" class="toolbar-btn">
                <BaseIcon :path="mdiLink" class="w-5 h-5" />
              </button>
              <button type="button" @click="openImageInsertModal" class="toolbar-btn">
                <BaseIcon :path="mdiImage" class="w-5 h-5" />
              </button>
              <div class="border-l border-gray-300 mx-2 h-6"></div>
              <select
                @change="formatHeading"
                ref="headingSelect"
                class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Định dạng</option>
                <option value="h1">Tiêu đề 1</option>
                <option value="h2">Tiêu đề 2</option>
                <option value="h3">Tiêu đề 3</option>
                <option value="p">Đoạn văn</option>
              </select>
              <select
                v-model="imageSize"
                class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Ảnh nhỏ</option>
                <option value="medium">Ảnh trung</option>
                <option value="large">Ảnh lớn</option>
              </select>
            </div>
            <!-- Editor -->
            <div
              ref="editor"
              contenteditable="true"
              @input="updateContentAndSelection"
              @keyup="updateSelection"
              @mouseup="updateSelection"
              @paste="handlePaste"
              class="w-full min-h-[400px] p-4 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent prose max-w-none editor-content"
              :class="{ 'text-gray-400 italic': !form.content }"
              style="white-space: pre-wrap; outline: none"
            ></div>
          </div>

          <!-- Image Insert Modal -->
          <transition
            name="fade"
            enter-active-class="transition-opacity duration-300"
            leave-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <div
              v-if="showImageInsertModal"
              class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-40"
            >
              <CardBox class="w-full max-w-md">
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold">Chèn ảnh vào nội dung</h3>
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >Nhập URL ảnh:</label
                    >
                    <input
                      v-model="imageUrl"
                      type="text"
                      placeholder="Nhập URL ảnh..."
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >Hoặc tải ảnh lén:</label
                    >
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleContentImageUpload"
                      class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div class="flex justify-end gap-2">
                    <BaseButton label="Hủy" color="light" @click="showImageInsertModal = false" />
                    <BaseButton
                      label="Chèn"
                      color="success"
                      @click="insertImage"
                      :disabled="!imageUrl"
                    />
                  </div>
                </div>
              </CardBox>
            </div>
          </transition>

          <!-- Published At and Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Ngày đăng:</label>
              <input
                v-model="form.published_at"
                type="datetime-local"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Trạng thái:</label>
              <select
                v-model="form.blog_status"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="draft">📝 Nháp</option>
                <option value="pending">⏳ Chờ duyệt</option>
                <option value="rejected">❌ Bị từ chối</option>
                <option value="published">✅ Đã đăng</option>
                <option value="archived">📦 Lưu trữ</option>
              </select>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-4 justify-end">
            <BaseButton
              type="button"
              label="Lưu nháp"
              color="light"
              :icon="mdiContentSave"
              rounded
              @click="saveDraft"
              :disabled="loading"
            />
            <BaseButton
              type="submit"
              label="Tạo Blog"
              color="success"
              :icon="mdiCheck"
              rounded
              :disabled="loading"
              :loading="loading"
            />
          </div>

          <!-- Messages -->
          <div
            v-if="error"
            class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2"
          >
            <BaseIcon :path="mdiAlertCircle" class="w-5 h-5" />
            {{ error }}
          </div>
          <div
            v-if="success"
            class="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2"
          >
            <BaseIcon :path="mdiCheckCircle" class="w-5 h-5" />
            Tạo blog thành công!
          </div>
        </form>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BaseIcon from '@/components/admin/BaseIcon.vue'
import {
  mdiNewspaper,
  mdiArrowLeft,
  mdiContentSave,
  mdiCheck,
  mdiImage,
  mdiLink,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiAlertCircle,
  mdiCheckCircle,
} from '@mdi/js'

const router = useRouter()
const editor = ref(null)
const headingSelect = ref(null)
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
const imageSize = ref('small')
const activeFormats = ref([])
const savedSelection = ref(null)

const adminToken = localStorage.getItem('adminToken')

// Save and restore selection
function saveSelection() {
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0).cloneRange()
  }
}

function restoreSelection() {
  if (savedSelection.value) {
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(savedSelection.value)
  }
}

// Check if selection is within editor
function isSelectionInEditor() {
  const selection = window.getSelection()
  if (selection.rangeCount === 0) return false

  const range = selection.getRangeAt(0)
  const container = range.commonAncestorContainer
  const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container

  return editor.value.contains(element)
}

// Update active formats based on current selection
function updateSelection() {
  if (!isSelectionInEditor()) return

  saveSelection()

  const selection = window.getSelection()
  if (selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  let container = range.commonAncestorContainer

  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement
  }

  activeFormats.value = []

  // Check for formatting
  let currentElement = container
  while (currentElement && editor.value.contains(currentElement)) {
    const tagName = currentElement.tagName?.toLowerCase()
    const style = window.getComputedStyle(currentElement)

    if (
      tagName === 'strong' ||
      tagName === 'b' ||
      style.fontWeight === 'bold' ||
      style.fontWeight >= '700'
    ) {
      activeFormats.value.push('bold')
    }
    if (tagName === 'em' || tagName === 'i' || style.fontStyle === 'italic') {
      activeFormats.value.push('italic')
    }
    if (tagName === 'u' || style.textDecoration.includes('underline')) {
      activeFormats.value.push('underline')
    }

    currentElement = currentElement.parentElement
  }
}

// Fetch user info to set admin_id
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

// Image upload for main image
async function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    loading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET },
      },
    )
    form.value.image = uploadRes.data.secure_url
  } catch (err) {
    console.error('Lỗi upload ảnh:', err)
    error.value = 'Không thể tải ảnh lên.'
  } finally {
    loading.value = false
  }
}

// Image upload for content
async function handleContentImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    loading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET },
      },
    )
    imageUrl.value = uploadRes.data.secure_url
  } catch (err) {
    console.error('Lỗi upload ảnh nội dung:', err)
    error.value = 'Không thể tải ảnh nội dung lên.'
  } finally {
    loading.value = false
  }
}

// Handle image loading error
function handleImageError(event) {
  event.target.src = '/images/placeholder.png' // Fallback image
}

// Wrap selected text with tag
function wrapSelection(tagName, className = '') {
  if (!isSelectionInEditor()) return

  const selection = window.getSelection()
  if (selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)

  // Check if already wrapped
  let container = range.commonAncestorContainer
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement
  }

  // Check if we're already inside the tag
  let currentElement = container
  let existingTag = null
  while (currentElement && editor.value.contains(currentElement)) {
    if (currentElement.tagName?.toLowerCase() === tagName.toLowerCase()) {
      existingTag = currentElement
      break
    }
    currentElement = currentElement.parentElement
  }

  if (existingTag) {
    // Remove the formatting
    const parent = existingTag.parentNode
    while (existingTag.firstChild) {
      parent.insertBefore(existingTag.firstChild, existingTag)
    }
    parent.removeChild(existingTag)
  } else {
    // Add the formatting
    if (!range.collapsed) {
      const wrapper = document.createElement(tagName)
      if (className) wrapper.className = className

      try {
        range.surroundContents(wrapper)
      } catch {
        // If surroundContents fails, use extractContents and appendChild
        const contents = range.extractContents()
        wrapper.appendChild(contents)
        range.insertNode(wrapper)
      }
    }
  }

  updateContentAndSelection()
}

// Rich Text Editor Functions
function formatText(command) {
  editor.value.focus()

  switch (command) {
    case 'bold':
      wrapSelection('strong')
      break
    case 'italic':
      wrapSelection('em')
      break
    case 'underline':
      wrapSelection('u')
      break
  }
}

function formatHeading(event) {
  const tag = event.target.value
  if (!tag || !isSelectionInEditor()) {
    event.target.value = ''
    return
  }

  const selection = window.getSelection()
  if (selection.rangeCount === 0) {
    event.target.value = ''
    return
  }

  const range = selection.getRangeAt(0)
  let container = range.commonAncestorContainer

  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement
  }

  // Find the block element to replace
  let blockElement = container
  while (
    blockElement &&
    !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV'].includes(blockElement.tagName)
  ) {
    blockElement = blockElement.parentElement
    if (!editor.value.contains(blockElement)) break
  }

  if (blockElement && editor.value.contains(blockElement)) {
    const newElement = document.createElement(tag.toUpperCase())
    newElement.innerHTML = blockElement.innerHTML

    // Apply appropriate classes for styling
    if (tag === 'h1') newElement.className = 'text-3xl font-bold my-4'
    else if (tag === 'h2') newElement.className = 'text-2xl font-semibold my-3'
    else if (tag === 'h3') newElement.className = 'text-xl font-medium my-2'
    else if (tag === 'p') newElement.className = 'text-base my-2'

    blockElement.parentNode.replaceChild(newElement, blockElement)

    // Restore cursor position
    const newRange = document.createRange()
    newRange.selectNodeContents(newElement)
    newRange.collapse(false)
    selection.removeAllRanges()
    selection.addRange(newRange)
  }

  event.target.value = ''
  updateContentAndSelection()
}

function insertOrderedList() {
  if (!isSelectionInEditor()) return

  editor.value.focus()

  const selection = window.getSelection()
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  const ol = document.createElement('ol')
  ol.className = 'list-decimal list-inside my-2 ml-4'

  const li = document.createElement('li')
  li.className = 'mb-1'
  li.innerHTML = '&nbsp;'

  ol.appendChild(li)

  if (range) {
    range.deleteContents()
    range.insertNode(ol)

    // Place cursor inside the list item
    const newRange = document.createRange()
    newRange.setStart(li, 0)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)
  }

  updateContentAndSelection()
}

function insertUnorderedList() {
  if (!isSelectionInEditor()) return

  editor.value.focus()

  const selection = window.getSelection()
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  const ul = document.createElement('ul')
  ul.className = 'list-disc list-inside my-2 ml-4'

  const li = document.createElement('li')
  li.className = 'mb-1'
  li.innerHTML = '&nbsp;'

  ul.appendChild(li)

  if (range) {
    range.deleteContents()
    range.insertNode(ul)

    // Place cursor inside the list item
    const newRange = document.createRange()
    newRange.setStart(li, 0)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)
  }

  updateContentAndSelection()
}

function insertLink() {
  if (!isSelectionInEditor()) return

  const url = prompt('Nhập URL:')
  if (!url) return

  editor.value.focus()

  const selection = window.getSelection()
  if (selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  const selectedText = range.toString()

  const link = document.createElement('a')
  link.href = url
  link.className = 'text-blue-600 underline hover:text-blue-800'
  link.target = '_blank'
  link.rel = 'noopener noreferrer'

  if (selectedText) {
    link.textContent = selectedText
    range.deleteContents()
  } else {
    link.textContent = url
  }

  range.insertNode(link)

  // Move cursor after the link
  const newRange = document.createRange()
  newRange.setStartAfter(link)
  newRange.collapse(true)
  selection.removeAllRanges()
  selection.addRange(newRange)

  updateContentAndSelection()
}

function openImageInsertModal() {
  saveSelection()
  imageUrl.value = ''
  showImageInsertModal.value = true
}

function insertImage() {
  if (!imageUrl.value) return

  restoreSelection()

  if (!isSelectionInEditor()) {
    showImageInsertModal.value = false
    return
  }

  const selection = window.getSelection()
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  if (range) {
    const img = document.createElement('img')
    img.src = imageUrl.value
    img.alt = 'Content image'
    img.className = 'rounded-lg my-4 mx-auto block'
    img.style.maxWidth = '100%'
    img.style.height = 'auto'

    // Apply size class
    const sizeClasses = {
      small: 'max-w-xs',
      medium: 'max-w-md',
      large: 'max-w-2xl',
    }
    img.className += ` ${sizeClasses[imageSize.value]}`

    // Create a paragraph wrapper for the image
    const wrapper = document.createElement('div')
    wrapper.className = 'text-center my-4'
    wrapper.appendChild(img)

    range.deleteContents()
    range.insertNode(wrapper)

    // Move cursor after the image
    const newRange = document.createRange()
    newRange.setStartAfter(wrapper)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)
  }

  showImageInsertModal.value = false
  updateContentAndSelection()
}

function updateContentAndSelection() {
  form.value.content = editor.value.innerHTML
  updateSelection()
}

function handlePaste(event) {
  event.preventDefault()

  const text = event.clipboardData.getData('text/plain')
  const selection = window.getSelection()

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    range.deleteContents()

    const textNode = document.createTextNode(text)
    range.insertNode(textNode)

    // Move cursor to end of inserted text
    const newRange = document.createRange()
    newRange.setStartAfter(textNode)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)
  }

  updateContentAndSelection()
}

// Form submission
async function submitBlog() {
  loading.value = true
  error.value = ''
  success.value = false

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

    await axios.post(`${baseUrl}/news`, blogData, config)
    success.value = true
    setTimeout(() => router.push('/admin/blogs'), 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi khi tạo blog.'
  } finally {
    loading.value = false
  }
}

async function saveDraft() {
  form.value.blog_status = 'draft'
  await submitBlog()
}

function goBack() {
  router.push('/admin/blogs')
}

onMounted(async () => {
  await getUserInfo()
  await nextTick()
  if (editor.value) {
    editor.value.focus()
  }
})
</script>

<style scoped>
.toolbar-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
}

.toolbar-btn.active {
  background-color: #dbeafe;
  color: #1e40af;
  border-color: #93c5fd;
}

.editor-content[contenteditable]:empty:before {
  content: 'Bắt đầu viết nội dung blog của bạn...';
  color: #9ca3af;
  font-style: italic;
}

Editor styles
.editor-content {
  line-height: 1.75;
  font-size: 1rem;
  color: #374151;
  font-family: 'Inter', sans-serif;
  white-space: pre-wrap;
  outline: none;
  overflow-wrap: break-word;
  word-break: break-word;
  max-height: 600px;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}
.editor-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem auto;
}
.editor-content h1,
.editor-content h2,
.editor-content h3,
.editor-content h4,
.editor-content h5,
.editor-content h6 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.editor-content p {
  margin: 0.5rem 0;
}
.editor-content ul,
.editor-content ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
.editor-content li {
  margin-bottom: 0.25rem;
}
.editor-content a {
  color: #2563eb;
  text-decoration: underline;
}
.editor-content a:hover {
  color: #1d4ed8;
  text-decoration: none;
}
.editor-content strong {
  font-weight: 600;
}
.editor-content em {
  font-style: italic;
}
.editor-content u {
  text-decoration: underline;
}
.editor-content .text-center {
  text-align: center;
}
.editor-content .text-right {
  text-align: right;
}
.editor-content .text-left {
  text-align: left;
}
</style>
