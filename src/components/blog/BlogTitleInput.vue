<template>
  <div>
    <label class="block mb-2 text-sm font-medium text-gray-700">Tiêu đề Blog:</label>
    <input
      :value="value"
      @input="$emit('update:value', $event.target.value)"
      type="text"
      maxlength="255"
      required
      placeholder="Nhập tiêu đề hấp dẫn cho blog của bạn..."
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    />
  </div>
</template>

<script setup>
defineProps({
  value: String,
})
defineEmits(['update:value'])
</script>
