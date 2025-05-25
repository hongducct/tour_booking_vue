<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-700">Ngày đăng:</label>
      <input
        :value="publishedAt"
        @input="$emit('update:published-at', $event.target.value)"
        type="datetime-local"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-700">Trạng thái:</label>
      <select
        :value="status"
        @change="$emit('update:status', $event.target.value)"
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <option value="draft">📝 Draft</option>
        <option value="pending">⏳ Pending</option>
        <option value="rejected">❌ Rejected</option>
        <option value="published">✅ Published</option>
        <option value="archived">📦 Archived</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  publishedAt: String,
  status: String,
})
defineEmits(['update:published-at', 'update:status'])
</script>
