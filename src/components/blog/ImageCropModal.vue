<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg max-w-lg w-full relative">
      <h3 class="text-lg font-semibold mb-4">Cắt ảnh</h3>
      <div>
        <img ref="image" :src="imageSrc" class="max-h-80 w-full object-contain" />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <BaseButton label="Hủy" color="light" @click="$emit('cancel')" />
        <BaseButton label="Xác nhận" color="success" @click="handleCrop" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import BaseButton from '@/components/admin/BaseButton.vue'

const props = defineProps({
  show: Boolean,
  imageSrc: String,
})
const emit = defineEmits(['crop', 'cancel'])

const image = ref(null)
let cropper

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      // Delay a tick to ensure <img> is rendered
      setTimeout(() => {
        if (image.value) {
          cropper = new Cropper(image.value, {
            aspectRatio: NaN, // tự do
            viewMode: 1,
          })
        }
      })
    } else {
      cropper?.destroy()
    }
  },
)

onBeforeUnmount(() => {
  cropper?.destroy()
})

function handleCrop() {
  if (cropper) {
    cropper.getCroppedCanvas().toBlob((blob) => {
      emit('crop', blob)
      cropper.destroy()
    })
  }
}
</script>
