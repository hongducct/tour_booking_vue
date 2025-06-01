<template>
  <div>
    <div class="mb-3 flex gap-2 flex-wrap dark:bg-gray-800 bg-white p-2 rounded-lg border border-gray-300">
      <BaseButton label="Chèn ảnh" color="info" @click="showImageModal = true" />

      <!-- Text Alignment Buttons -->
      <div class="flex gap-1 border-l pl-2 ml-2">
        <button
          @click="setTextAlign('left')"
          class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border dark:text-gray-800 "
          title="Căn trái"
        >
          ↤
        </button>
        <button
          @click="setTextAlign('center')"
          class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border dark:text-gray-800"
          title="Căn giữa"
        >
          ↕
        </button>
        <button
          @click="setTextAlign('right')"
          class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border dark:text-gray-800"
          title="Căn phải"
        >
          ↦
        </button>
        <button
          @click="setTextAlign('')"
          class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border dark:text-gray-800"
          title="Bỏ căn"
        >
          ↔
        </button>
      </div>
    </div>

    <QuillEditor
      v-model:content="content"
      contentType="html"
      ref="quillEditor"
      class="bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600"
      :options="quillOptions"
      @update:content="handleContentUpdate"
    />

    <ImageInsertModal
      :show="showImageModal"
      @update:show="showImageModal = $event"
      @insert="insertImage"
    />
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, defineExpose, computed } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import ImageInsertModal from '@/components/blog/ImageInsertModal.vue'
import BaseButton from '@/components/admin/BaseButton.vue'

// Define props and emits
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:value', 'update:active-formats', 'open-image-modal'])

const showImageModal = ref(false)
const content = ref(props.value || '')
const quillEditor = ref(null)

// FIXED: Thêm các flag để control việc emit
const isInsertingImage = ref(false)
const isSilentUpdate = ref(false)

// Quill configuration với align
const quillOptions = computed(() => ({
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video'],
    ],
  },
}))

// Watch for changes from parent component
watch(
  () => props.value,
  (newValue) => {
    if (newValue !== content.value && !isInsertingImage.value) {
      content.value = newValue
    }
  },
)

// FIXED: Handle content updates - chỉ emit khi không phải là silent update hoặc đang chèn ảnh
function handleContentUpdate(newContent) {
  console.log(
    'Content updated, isInsertingImage:',
    isInsertingImage.value,
    'isSilentUpdate:',
    isSilentUpdate.value,
  )

  content.value = newContent

  // FIXED: Chỉ emit khi:
  // 1. Không đang chèn ảnh
  // 2. Không phải là silent update
  // 3. Content thực sự thay đổi do user nhập
  if (!isInsertingImage.value && !isSilentUpdate.value) {
    console.log('Emitting update:value - user input detected')
    emits('update:value', newContent)
  } else {
    console.log('Skipping emit - image insertion or silent update')
  }
}

// Set text alignment function
function setTextAlign(align) {
  if (quillEditor.value) {
    const quill = quillEditor.value.getQuill()
    const range = quill.getSelection()

    if (range) {
      if (align === '') {
        quill.format('align', false)
      } else {
        quill.format('align', align)
      }
    }
  }
}

// FIXED: Insert image function - hoàn toàn không emit update
function insertImage(imgWrapper) {
  console.log('Starting image insertion process...')

  // FIXED: Set flag để block tất cả emit events
  isInsertingImage.value = true
  isSilentUpdate.value = true

  if (quillEditor.value) {
    const quill = quillEditor.value.getQuill()
    const range = quill.getSelection()
    const index = range ? range.index : quill.getLength()

    // Insert the HTML directly
    quill.clipboard.dangerouslyPasteHTML(index, imgWrapper)

    // FIXED: Cập nhật content local nhưng KHÔNG emit
    setTimeout(() => {
      const updatedContent = quill.root.innerHTML
      content.value = updatedContent

      console.log('Image inserted successfully - content updated locally only')

      // Reset flags - sẵn sàng cho user input tiếp theo
      isInsertingImage.value = false
      isSilentUpdate.value = false
    }, 150) // Tăng delay để đảm bảo Quill hoàn tất
  } else {
    // Fallback method
    content.value += imgWrapper

    setTimeout(() => {
      console.log('Image inserted via fallback - content updated locally only')
      isInsertingImage.value = false
      isSilentUpdate.value = false
    }, 150)
  }

  showImageModal.value = false
}

// Function to insert image programmatically (called from parent)
function insertImageFromParent(url, size = 'medium') {
  let sizeClass = ''
  switch (size) {
    case 'small':
      sizeClass = 'width: 300px;'
      break
    case 'medium':
      sizeClass = 'width: 500px;'
      break
    case 'large':
      sizeClass = 'width: 100%;'
      break
    default:
      sizeClass = 'width: 500px;'
  }

  const imgTag = `<img src="${url}" style="${sizeClass}" alt="Inserted image" />`
  insertImage(imgTag)
}

// FIXED: Method để update content mà không trigger emit
function updateContentSilently(newContent) {
  console.log('Updating content silently')
  isSilentUpdate.value = true
  content.value = newContent

  if (quillEditor.value) {
    const quill = quillEditor.value.getQuill()
    quill.root.innerHTML = newContent
  }

  setTimeout(() => {
    isSilentUpdate.value = false
  }, 100)
}

// FIXED: Thêm method để force emit content (khi user muốn save manually)
function forceEmitContent() {
  console.log('Force emitting current content')
  emits('update:value', content.value)
}

// Expose methods to parent component
defineExpose({
  insertImage: insertImageFromParent,
  setTextAlign,
  updateContentSilently,
  forceEmitContent, // FIXED: Expose để parent có thể force emit khi cần
})
</script>

<style scoped>
/* Custom styles for better alignment buttons */
:deep(.ql-editor) {
  min-height: 200px;
}

/* Styles for alignment */
:deep(.ql-align-center) {
  text-align: center;
}

:deep(.ql-align-right) {
  text-align: right;
}

:deep(.ql-align-left) {
  text-align: left;
}

/* Custom button styling */
button[title] {
  transition: all 0.2s ease;
}

button[title]:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
