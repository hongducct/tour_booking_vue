<template>
  <div class="flex gap-4 justify-end">
    <BaseButton
      type="button"
      label="Lưu nháp"
      color="light"
      :icon="mdiContentSave"
      rounded
      @click="$emit('save-draft')"
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
      @click="$emit('submit')"
    />
  </div>
</template>

<script setup>
import BaseButton from '@/components/admin/BaseButton.vue'
import { mdiContentSave, mdiCheck } from '@mdi/js'

defineProps({
  loading: Boolean,
})
defineEmits(['save-draft', 'submit'])
</script>
