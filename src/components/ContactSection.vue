<script setup>
import { ref, onMounted } from 'vue'

const emailAddress = ref('travelbooking@hongducct.id.vn')
const phoneNumber = ref('0799076901')
const address = ref('Thang Long University, Hanoi, Vietnam')
const imgUrl = ref('https://cdn.bookingtour.vn/upload/timetotravel.png?v')

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
    isLoading.value = false
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

// Animation on scroll effect
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<template>
  <section class="contact-section py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-8 items-center">
        <!-- Left side image -->
        <div class="w-full lg:w-1/3 animate-on-scroll">
          <div
            class="contact-img rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <img :src="imgUrl" alt="Contact Us" class="w-full h-80 object-cover" />
          </div>
        </div>

        <!-- Right side content -->
        <div class="w-full lg:w-2/3">
          <div
            class="contact-details-wrap bg-white rounded-xl shadow-lg p-6 mb-8 animate-on-scroll"
          >
            <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">Contact Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Email contact -->
              <div
                class="contact-details text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div
                  class="contact-icon mx-auto mb-4 bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 class="font-semibold text-lg mb-2 text-gray-700">Email</h3>
                <ul>
                  <li>
                    <a
                      href="mailto:lienhe@bookingtour.vn"
                      class="text-blue-600 hover:text-blue-800 transition-colors"
                      >{{ emailAddress }}</a
                    >
                  </li>
                </ul>
              </div>

              <!-- Phone contact -->
              <div
                class="contact-details text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div
                  class="contact-icon mx-auto mb-4 bg-green-50 p-4 rounded-full w-16 h-16 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 class="font-semibold text-lg mb-2 text-gray-700">Hotline</h3>
                <ul>
                  <li>
                    <a
                      href="tel:08888822368"
                      class="text-green-600 hover:text-green-800 transition-colors"
                      >{{ phoneNumber }}</a
                    >
                  </li>
                </ul>
              </div>

              <!-- Address contact -->
              <div
                class="contact-details text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div
                  class="contact-icon mx-auto mb-4 bg-amber-50 p-4 rounded-full w-16 h-16 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 class="font-semibold text-lg mb-2 text-gray-700">Address</h3>
                <ul>
                  <li class="text-gray-700">{{ address }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Call to action -->
          <div
            class="contact-btn-wrap bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-center text-white animate-on-scroll"
          >
            <h3 class="text-2xl font-bold mb-4">LET'S JOIN US FOR MORE UPDATE!</h3>
            <p class="mb-6 text-blue-100">
              Subscribe to our newsletter to receive updates about latest offers and travel tips.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input
                type="email"
                v-model="email"
                placeholder="Your email address"
                class="px-6 py-3 rounded-full w-full sm:w-auto text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                @click="subscribe"
                :disabled="isLoading"
                class="px-6 py-3 bg-white text-blue-700 rounded-full font-bold hover:bg-blue-50 transition-colors duration-300 w-full sm:w-auto hover:shadow-lg disabled:opacity-20 disabled:cursor-not-allowed"
                :class="{
                  'bg-blue-100 hover:bg-blue-300 hover:text-gray-600': !isLoading,
                  'bg-gray-400': isLoading,
                }"
              >
                {{ isLoading ? 'Subscribing...' : 'SUBSCRIBE NOW' }}
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
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  position: relative;
  overflow: hidden;
}

.contact-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(246, 246, 246, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%);
  pointer-events: none;
}

.contact-img {
  position: relative;
}

.contact-img::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  transition: background 0.3s;
}

.contact-img:hover::after {
  background: rgba(0, 0, 0, 0);
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.animate-on-scroll.show {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive design */
@media (max-width: 1023px) {
  .contact-img {
    margin-bottom: 2rem;
  }
}

@media (max-width: 767px) {
  .contact-details {
    margin-bottom: 1.5rem;
  }

  .contact-btn-wrap {
    padding: 1.5rem;
  }

  .contact-btn-wrap h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 639px) {
  .contact-btn-wrap h3 {
    font-size: 1.25rem;
  }
}
</style>
