<template>
  <div
    @click="$emit('click')"
    class="destination-item cursor-pointer relative rounded-lg overflow-hidden shadow-lg h-full group"
  >
    <!-- Hình ảnh -->
    <img
      :src="destination.img"
      :alt="destination.name"
      class="w-full object-cover transition duration-500 group-hover:scale-110"
      :class="getImageClass()"
    />

    <!-- Overlay gradient -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

    <!-- Badge City -->
    <div
      class="absolute top-4 left-4 bg-blue-500 text-white font-medium text-sm px-4 py-1 rounded-sm"
    >
      {{ destination.city ? destination.city.toUpperCase() : destination.name.toUpperCase() }}
    </div>

    <!-- Content -->
    <div class="absolute bottom-0 left-0 w-full p-5 text-white">
      <!-- Title -->
      <h3
        class="font-bold mb-2"
        :class="{
          'text-xl leading-tight': layout === 'vertical',
          'text-lg': layout === 'horizontal',
        }"
        v-html="destination.title"
      ></h3>

      <!-- Rating -->
      <div class="flex items-center">
        <span v-for="i in 5" :key="i" class="text-yellow-400 text-lg">★</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineEmits(['click'])

const props = defineProps({
  destination: {
    type: Object,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String,
    default: 'vertical',
    validator: (value) => ['vertical', 'horizontal'].includes(value),
  },
})

// Hàm xác định class cho hình ảnh dựa trên layout
const getImageClass = () => {
  if (props.layout === 'vertical') {
    return 'h-96 md:h-[400px] lg:h-[500px]' // Chữ nhật dọc cho 2 ô đầu
  } else {
    return 'h-64 md:h-[240px]' // Chữ nhật ngang cho 2 ô sau
  }
}
</script>

<style scoped>
.destination-item {
  transition: all 0.3s ease;
}

.destination-item:hover {
  transform: translateY(-5px);
}
</style>
