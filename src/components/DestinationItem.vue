<template>
  <div class="desti-item overlay-desti-item">
    <figure class="desti-image">
      <img :src="destination.img" :alt="destination.name" />
    </figure>
    <div class="meta-cat bg-meta-cat">
      <a :href="destination.url">{{ destination.name }}</a>
    </div>
    <div class="desti-content">
      <h3>
        <a :href="destination.url">{{ destination.title }}</a>
      </h3>
      <div class="rating-start" :title="`Rated 5 out of 5`">
        <span :style="{ width: destination.rating }"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  destination: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
/* Optional: add your scoped styles here if needed */
</style>
