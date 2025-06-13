<template>
  <div class="w-full">
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      v-model="inputValue"
      :required="required"
      :step="type === 'number' ? 'any' : undefined"
      :min="type === 'number' ? min : undefined"
      :max="type === 'number' ? max : undefined"
      :class="[
        'w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2',
        error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-500 dark:border-gray-600',
        'dark:bg-gray-800 dark:text-white',
      ]"
      @input="handleInput"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  required: Boolean,
  type: {
    type: String,
    default: 'text',
  },
  error: [String, Array],
  min: [Number, String],
  max: [Number, String],
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => (props.modelValue !== null && props.modelValue !== undefined ? props.modelValue : ''),
  set: (val) => {
    handleInput(val)
  },
})

const handleInput = (val) => {
  let parsedValue = val
  if (props.type === 'number') {
    parsedValue = val === '' ? null : parseFloat(val) // Giữ null khi rỗng
  }
  emit('update:modelValue', parsedValue)
}
</script>
