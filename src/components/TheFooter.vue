<template>
  <!-- Footer -->
  <footer class="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <!-- Footer Top -->
    <div class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-xl font-bold mb-4 text-teal-400">Explore with Us</h3>
          <p class="text-gray-300 text-sm leading-relaxed">
            Discover unforgettable adventures with our tour booking platform, built using Vue.js and
            Laravel. We bring you seamless travel experiences with top-notch service.
          </p>
        </div>
        <!-- Links -->
        <div class="sm:pl-4">
          <h3 class="text-xl font-bold mb-4 text-teal-400">Quick Links</h3>
          <ul class="space-y-3 p-0">
            <li>
              <a href="#" class="text-gray-300 hover:text-teal-300 transition duration-300">Home</a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-teal-300 transition duration-300"
                >Tours</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-teal-300 transition duration-300"
                >Destinations</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-teal-300 transition duration-300"
                >Contact</a
              >
            </li>
          </ul>
        </div>
        <!-- Contact -->
        <div>
          <h3 class="text-xl font-bold mb-4 text-teal-400">Get in Touch</h3>
          <ul class="space-y-3 text-gray-300 text-sm p-0">
            <li class="flex items-center">
              <i class="fas fa-map-marker-alt mr-3 text-teal-400"></i>Hanoi, Vietnam
            </li>
            <li class="flex items-center">
              <i class="fas fa-envelope mr-3 text-teal-400"></i>hongducct23@gmail.com
            </li>
            <li class="flex items-center">
              <i class="fas fa-phone mr-3 text-teal-400"></i>+84 799 076 901
            </li>
            <li class="flex items-center">
              <i class="fas fa-globe mr-3 text-teal-400"></i>+84 388 424 835
            </li>
          </ul>
        </div>
        <!-- Newsletter -->
        <div>
          <h3 class="text-xl font-bold mb-4 text-teal-400">Travel Updates</h3>
          <p class="text-gray-300 text-sm mb-4">
            Subscribe for exclusive travel deals, destination guides, and updates.
          </p>
          <div class="flex">
            <input
              v-model="email"
              type="email"
              class="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your email address"
              @keyup.enter="subscribe"
            />
            <button
              @click="subscribe"
              :disabled="isLoading"
              class="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-r-md text-sm font-medium transition duration-300"
            >
              {{ isLoading ? 'Subscribing...' : 'Subscribe' }}
            </button>
          </div>
          <p
            v-if="message"
            class="mt-2 text-sm"
            :class="messageType === 'success' ? 'text-green-400' : 'text-red-400'"
          >
            {{ message }}
          </p>
        </div>
      </div>
    </div>
    <!-- Footer Bottom -->
    <div class="bg-gray-900 py-6 border-t border-gray-700">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center"
      >
        <!-- Social Media -->
        <div class="flex space-x-6 mb-4 sm:mb-0">
          <a
            href="https://www.facebook.com/hongducct23"
            target="_blank"
            class="text-gray-300 hover:text-teal-300 transition duration-300"
          >
            <i class="fab fa-facebook-f text-lg"></i>
          </a>
          <a
            href="https://www.instagram.com/hongducct"
            target="_blank"
            class="text-gray-300 hover:text-teal-300 transition duration-300"
          >
            <i class="fab fa-instagram text-lg"></i>
          </a>
          <a href="#" class="text-gray-300 hover:text-teal-300 transition duration-300">
            <i class="fab fa-linkedin text-lg"></i>
          </a>
          <a
            href="https://github.com/hongducct"
            target="_blank"
            class="text-gray-300 hover:text-teal-300 transition duration-300"
          >
            <i class="fab fa-github text-lg"></i>
          </a>
        </div>
        <!-- Copyright -->
        <p class="text-gray-300 text-sm">
          © 2025 Copyright:
          <a href="#" class="text-teal-300 hover:text-teal-400 transition duration-300"
            >TravelEasy</a
          >
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const message = ref('')
const messageType = ref('')
const isLoading = ref(false)
const subscribe = async () => {
  if (isLoading.value) return
  isLoading.value = true
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    message.value = 'Please enter a valid email address.'
    messageType.value = 'error'
    return
  }

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL
    const response = await fetch(`${apiUrl}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    })

    const data = await response.json()
    if (response.ok) {
      message.value = 'Thanks for subscribing! Check your email for travel deals.'
      messageType.value = 'success'
      email.value = ''
    } else {
      message.value = data.message || 'Subscription failed. Please try again.'
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = 'An error occurred. Please try again later.'
    messageType.value = 'error'
  }

  // Clear message after 5 seconds
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 5000)
  isLoading.value = false
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
</style>
