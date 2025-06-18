<!-- components/tour/TourReviews.vue -->
<template>
  <div class="tour-reviews max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
      {{ title }}
    </h2>

    <!-- Write Review Section -->
    <div class="mb-8 bg-white rounded-xl shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Viết đánh giá của bạn</h3>

      <!-- Not logged in message -->
      <div v-if="!isAuthenticated" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div class="flex items-center">
          <i class="fas fa-info-circle text-blue-400 mr-2"></i>
          <p class="text-blue-700">
            Bạn cần
            <button
              @click="goToLogin"
              class="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              đăng nhập
            </button>
            để viết đánh giá
          </p>
        </div>
      </div>

      <!-- Loading review eligibility -->
      <div
        v-else-if="checkingEligibility"
        class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded"
      >
        <div class="flex items-center">
          <i class="fas fa-spinner fa-spin text-gray-400 mr-2"></i>
          <p class="text-gray-700">Đang kiểm tra quyền đánh giá...</p>
        </div>
      </div>

      <!-- Cannot review message -->
      <div
        v-else-if="!canUserReview && reviewEligibilityMessage"
        class="bg-red-50 border-l-4 border-red-400 p-4 rounded"
      >
        <div class="flex items-start">
          <i class="fas fa-exclamation-triangle text-red-400 mr-2 mt-1"></i>
          <div>
            <p class="text-red-700 font-medium">{{ reviewEligibilityMessage }}</p>
            <p v-if="reviewableType === 'App\\Models\\Tour'" class="text-red-600 text-sm mt-2">
              💡 <strong>Lưu ý:</strong> Bạn cần đặt tour và có trạng thái "Đã xác nhận" mới có thể
              đánh giá.
            </p>
          </div>
        </div>
      </div>

      <!-- Review form for eligible users -->
      <div v-else-if="canUserReview">
        <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-4">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-400 mr-2"></i>
            <p class="text-green-700">{{ reviewEligibilityMessage }}</p>
          </div>
        </div>

        <form @submit.prevent="submitReview" class="space-y-4">
          <!-- Rating Section -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn *</label>
            <div class="flex items-center space-x-1">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="setRating(star)"
                @mouseover="hoverRating = star"
                @mouseleave="hoverRating = 0"
                class="text-3xl transition-colors duration-200 focus:outline-none"
              >
                <i
                  :class="[
                    star <= (hoverRating || reviewForm.rating)
                      ? 'fas fa-star text-yellow-400'
                      : 'far fa-star text-gray-300',
                    'hover:text-yellow-300',
                  ]"
                ></i>
              </button>
              <span class="ml-2 text-sm text-gray-500">({{ reviewForm.rating || 0 }}/5)</span>
            </div>
          </div>

          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề (tùy chọn)
            </label>
            <input
              id="title"
              v-model="reviewForm.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tóm tắt trải nghiệm của bạn..."
              maxlength="255"
            />
          </div>

          <!-- Comment -->
          <div>
            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét chi tiết
            </label>
            <textarea
              id="comment"
              v-model="reviewForm.comment"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Chia sẻ trải nghiệm và cảm nhận của bạn..."
              maxlength="1000"
            ></textarea>
            <div class="text-right text-xs text-gray-500 mt-1">
              {{ reviewForm.comment?.length || 0 }}/1000
            </div>
          </div>

          <!-- Error message -->
          <div v-if="reviewError" class="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div class="flex">
              <i class="fas fa-exclamation-circle text-red-400 mr-2"></i>
              <p class="text-red-700 text-sm">{{ reviewError }}</p>
            </div>
          </div>

          <!-- Success message -->
          <div v-if="reviewSuccess" class="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div class="flex">
              <i class="fas fa-check-circle text-green-400 mr-2"></i>
              <p class="text-green-700 text-sm">{{ reviewSuccess }}</p>
            </div>
          </div>

          <!-- Submit button -->
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="!reviewForm.rating || isSubmitting"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Đang gửi...
              </span>
              <span v-else>Gửi đánh giá</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reviews Grid -->
    <div v-if="allReviews.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="review in allReviews"
        :key="review.id"
        class="review-card p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <!-- User Info -->
        <div class="flex items-center mb-4">
          <img
            :src="review.user?.avatar || 'https://via.placeholder.com/40'"
            alt="Avatar"
            class="w-12 h-12 rounded-full mr-4 object-cover border-2 border-indigo-100"
            @error="handleImageError"
          />
          <div>
            <p class="font-semibold text-lg text-gray-800">
              {{ review.user?.username || 'Khách hàng' }}
            </p>
            <p class="text-sm text-gray-500">{{ review.title || 'Không có tiêu đề' }}</p>
          </div>
        </div>

        <!-- Rating Stars -->
        <div class="flex items-center mb-4">
          <span v-for="n in 5" :key="n" class="text-2xl">
            <i
              :class="[
                n <= review.rating ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300',
                'transition-colors duration-200',
              ]"
            ></i>
          </span>
          <span class="ml-2 text-sm text-gray-500">({{ review.rating }}/5)</span>
        </div>

        <!-- Comment -->
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ review.comment || 'Không có nhận xét chi tiết.' }}
        </p>

        <!-- Timestamp -->
        <p v-if="review.created_at" class="text-xs text-gray-400 mt-3">
          {{ formatDate(review.created_at) }}
        </p>
      </div>
    </div>

    <!-- No Reviews Message -->
    <div v-else-if="!allReviews.length" class="text-center py-12 bg-gray-50 rounded-lg">
      <i class="fas fa-star text-gray-300 text-6xl mb-4"></i>
      <p class="text-gray-500 text-lg">Chưa có đánh giá nào.</p>
      <p class="text-gray-400 text-sm mt-2">Hãy là người đầu tiên để lại đánh giá!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Props
const props = defineProps({
  reviews: {
    type: Array,
    required: true,
    default: () => [],
  },
  reviewableId: {
    type: [Number, String],
    required: true,
  },
  reviewableType: {
    type: String,
    required: true,
    validator: (value) => ['App\\Models\\Tour', 'App\\Models\\News'].includes(value),
  },
  title: {
    type: String,
    default: 'Đánh giá từ khách hàng',
  },
})

// Router
const router = useRouter()

// Reactive data
const isAuthenticated = ref(
  !!localStorage.getItem('userToken') || !!localStorage.getItem('adminToken'),
)
const hoverRating = ref(0)
const isSubmitting = ref(false)
const reviewError = ref('')
const reviewSuccess = ref('')
const newReviews = ref([])

// New reactive data for review eligibility
const checkingEligibility = ref(false)
const canUserReview = ref(false)
const reviewEligibilityMessage = ref('')

const reviewForm = ref({
  rating: 0,
  title: '',
  comment: '',
})

// Computed
const allReviews = computed(() => {
  return [...newReviews.value, ...props.reviews].filter((review) => review.status === 'approved')
})

// Methods
const setRating = (rating) => {
  reviewForm.value.rating = rating
}

const goToLogin = () => {
  localStorage.setItem('redirectAfterLogin', router.currentRoute.value.fullPath)
  router.push('/login')
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/40'
}

const formatDate = (date) => {
  if (!date) return ''
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(date).toLocaleDateString('vi-VN', options)
}

const resetForm = () => {
  reviewForm.value = {
    rating: 0,
    title: '',
    comment: '',
  }
  hoverRating.value = 0
}

// New method to check review eligibility
const checkReviewEligibility = async () => {
  if (!isAuthenticated.value) {
    canUserReview.value = false
    reviewEligibilityMessage.value = ''
    return
  }

  checkingEligibility.value = true
  reviewError.value = ''

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken')

    const response = await axios.post(
      `${apiBaseUrl}/reviews/can-review`,
      {
        reviewable_id: props.reviewableId,
        reviewable_type: props.reviewableType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    canUserReview.value = response.data.can_review
    reviewEligibilityMessage.value = response.data.message
  } catch (error) {
    console.error('Error checking review eligibility:', error)

    if (error.response?.status === 401) {
      // Token expired
      localStorage.removeItem('userToken')
      localStorage.removeItem('adminToken')
      isAuthenticated.value = false
      canUserReview.value = false
      reviewEligibilityMessage.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    } else {
      canUserReview.value = false
      reviewEligibilityMessage.value =
        error.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra quyền đánh giá.'
    }
  } finally {
    checkingEligibility.value = false
  }
}

const submitReview = async () => {
  if (!reviewForm.value.rating) {
    reviewError.value = 'Vui lòng chọn số sao đánh giá'
    return
  }

  if (!canUserReview.value) {
    reviewError.value = 'Bạn không có quyền đánh giá mục này'
    return
  }

  isSubmitting.value = true
  reviewError.value = ''
  reviewSuccess.value = ''

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken')

    const response = await axios.post(
      `${apiBaseUrl}/reviews`,
      {
        reviewable_id: props.reviewableId,
        reviewable_type: props.reviewableType,
        rating: reviewForm.value.rating,
        title: reviewForm.value.title || null,
        comment: reviewForm.value.comment || null,
        status: 'approved', // Default status
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    const newReview = {
      ...response.data,
      user: response.data.user || {
        username: 'Bạn',
        avatar: null,
      },
      created_at: new Date().toISOString(),
      status: 'approved',
    }

    newReviews.value.unshift(newReview)
    reviewSuccess.value = 'Đánh giá của bạn đã được gửi thành công!'
    resetForm()

    // Update review eligibility (user can't review again)
    canUserReview.value = false
    reviewEligibilityMessage.value = 'Bạn đã đánh giá mục này rồi.'

    setTimeout(() => {
      reviewSuccess.value = ''
    }, 5000)
  } catch (error) {
    console.error('Error submitting review:', error)

    if (error.response?.status === 401) {
      reviewError.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      localStorage.removeItem('userToken')
      localStorage.removeItem('adminToken')
      isAuthenticated.value = false
    } else if (error.response?.status === 422) {
      const errors = error.response.data.errors
      reviewError.value = Object.values(errors).flat().join(', ')
    } else if (error.response?.status === 403) {
      reviewError.value =
        error.response.data.message || 'Bạn không có quyền thực hiện hành động này.'
      // Re-check eligibility
      await checkReviewEligibility()
    } else {
      reviewError.value =
        error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Watch for authentication changes
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    checkReviewEligibility()
  } else {
    canUserReview.value = false
    reviewEligibilityMessage.value = ''
  }
})

// Watch for props changes (if component is reused for different items)
watch([() => props.reviewableId, () => props.reviewableType], () => {
  if (isAuthenticated.value) {
    checkReviewEligibility()
  }
})

onMounted(() => {
  // Check review eligibility on mount
  if (isAuthenticated.value) {
    checkReviewEligibility()
  }

  // Listen for storage changes (login/logout in other tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'userToken' || e.key === 'adminToken') {
      const newAuthState =
        !!localStorage.getItem('userToken') || !!localStorage.getItem('adminToken')
      isAuthenticated.value = newAuthState
    }
  })
})
</script>

<style scoped>
.tour-reviews {
  font-family: 'Inter', sans-serif;
}

.review-card {
  transform: translateY(0);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.fa-star {
  cursor: pointer;
  user-select: none;
}

.fa-star:hover {
  transform: scale(1.1);
}

.bg-green-50,
.bg-red-50,
.bg-blue-50 {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .review-card {
    padding: 1rem;
  }

  .tour-reviews h2 {
    font-size: 1.75rem;
  }

  .fa-star {
    font-size: 1.5rem;
  }
}
</style>
