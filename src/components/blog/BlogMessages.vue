<template>
  <div>
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
  </div>
</template>

<script setup>
import BaseIcon from '@/components/admin/BaseIcon.vue'
import { mdiAlertCircle, mdiCheckCircle } from '@mdi/js'

defineProps({
  error: String,
  success: Boolean,
})
</script>
