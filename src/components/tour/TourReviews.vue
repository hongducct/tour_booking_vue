<template>
  <div class="tour-reviews max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
      Đánh giá từ khách hàng
    </h2>
    
    <!-- Reviews Grid -->
    <div v-if="reviews.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="review-card p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <!-- User Info -->
        <div class="flex items-center mb-4">
          <img
            :src="review.user.avatar || 'https://via.placeholder.com/40'"
            alt="Avatar"
            class="w-12 h-12 rounded-full mr-4 object-cover border-2 border-indigo-100"
            @error="handleImageError"
          />
          <div>
            <p class="font-semibold text-lg text-gray-800">{{ review.user.username }}</p>
            <p class="text-sm text-gray-500">{{ review.title || 'Khách hàng' }}</p>
          </div>
        </div>

        <!-- Rating Stars -->
        <div class="flex items-center mb-4">
          <span v-for="n in 5" :key="n" class="text-2xl">
            <i
              :class="[
                n <= review.rating ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300',
                'transition-colors duration-200'
              ]"
            ></i>
          </span>
          <span class="ml-2 text-sm text-gray-500">({{ review.rating }}/5)</span>
        </div>

        <!-- Comment -->
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ review.comment || 'Không có nhận xét chi tiết.' }}
        </p>

        <!-- Timestamp (optional, if available) -->
        <p v-if="review.date" class="text-xs text-gray-400 mt-3">
          {{ formatDate(review.date) }}
        </p>
      </div>
    </div>

    <!-- No Reviews Message -->
    <div
      v-else
      class="text-center py-12 bg-gray-50 rounded-lg"
    >
      <p class="text-gray-500 text-lg">Chưa có đánh giá nào cho tour này.</p>
      <p class="text-gray-400 text-sm mt-2">Hãy là người đầu tiên để lại đánh giá!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Define props
const props = defineProps({
  reviews: {
    type: Array,
    required: true,
    default: () => [],
  },
})

// Handle image error (fallback if avatar fails to load)
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/40'
}

// Format date (if provided in review data)
const formatDate = (date) => {
  if (!date) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('vi-VN', options)
}
</script>

<style scoped>
.tour-reviews {
  font-family: 'Inter', sans-serif;
}

.review-card {
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .review-card {
    padding: 1rem;
  }

  .tour-reviews h2 {
    font-size: 1.75rem;
  }
}
</style>