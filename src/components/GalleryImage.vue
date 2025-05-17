<template>
  <figure class="gallery-img">
    <img :src="src" :alt="alt" />
  </figure>
</template>

<script setup>
defineProps({
  src: String,
  alt: String,
})
</script>

<style scoped>
/* Style riêng cho ảnh nếu cần */
</style>
