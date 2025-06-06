<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'

const showContactOptions = ref(false)

const toggleOptions = () => {
  showContactOptions.value = !showContactOptions.value
}

// Đóng popup khi click ra ngoài
const handleClickOutside = (event) => {
  const popup = document.querySelector('.contact-popup')
  const button = document.querySelector('.contact-button')
  if (
    showContactOptions.value &&
    popup &&
    button &&
    !popup.contains(event.target) &&
    !button.contains(event.target)
  ) {
    showContactOptions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Các hàm điều hướng
const contactViaZalo = () => {
  const phoneNumber = '0799076901'
  window.open(`https://zalo.me/${phoneNumber}`, '_blank')
}

const contactViaMessenger = () => {
  const facebookId = 'hongducct23'
  window.open(`https://m.me/${facebookId}`, '_blank')
}

const contactViaPhone = () => {
  const phoneNumber = '0799076901'
  window.location.href = `tel:${phoneNumber}`
}

const contactViaEmail = () => {
  const email = 'travelbooking@hongducct.id.vn'
  window.location.href = `mailto:${email}`
}
</script>

<template>
  <div class="fixed bottom-20 right-10 z-50">
    <!-- Contact Button -->
    <button
      @click="toggleOptions"
      class="contact-button bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105"
      aria-label="Contact Options"
    >
      <ChatBubbleLeftIcon class="h-6 w-6" />
    </button>

    <!-- Contact Options Popup -->
    <div
      v-if="showContactOptions"
      class="contact-popup fixed bottom-20 right-10 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 animate-fade-in"
    >
      <!-- Header -->
      <div class="bg-blue-500 text-white p-3 flex justify-between items-center">
        <h3 class="font-bold text-sm">Liên hệ với chúng tôi</h3>
        <button @click="toggleOptions" class="hover:bg-blue-600 p-1 rounded">✕</button>
      </div>

      <!-- Contact Options -->
      <div class="p-4 space-y-3">
        <p class="text-gray-700 text-sm mb-2">Chọn phương thức liên hệ:</p>

        <!-- Zalo -->
        <button
          @click="contactViaZalo"
          class="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <span class="mr-3">📱</span>
          Nhắn tin qua Zalo
        </button>

        <!-- Messenger -->
        <button
          @click="contactViaMessenger"
          class="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <span class="mr-3">💬</span>
          Nhắn tin qua Messenger
        </button>

        <!-- Phone -->
        <button
          @click="contactViaPhone"
          class="w-full bg-green-50 hover:bg-green-100 text-green-600 py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <span class="mr-3">☎️</span>
          Gọi điện thoại
        </button>

        <!-- Email -->
        <button
          @click="contactViaEmail"
          class="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600 py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <span class="mr-3">✉️</span>
          Gửi email
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
