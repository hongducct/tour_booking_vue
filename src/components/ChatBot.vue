<template>
  <div class="fixed bottom-6 right-6 z-50">
    <button
      @click="toggleChat"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300"
    >
      <span v-if="!isOpen">💬 Chat với AI</span>
      <span v-else>✖️ Đóng</span>
    </button>

    <div
      v-if="isOpen"
      class="mt-3 w-80 h-[500px] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden"
    >
      <div class="bg-blue-600 text-white p-3 font-bold text-center">
        🤖 Trợ lý AI - Tour Booking
      </div>

      <div class="flex-1 p-3 space-y-2 overflow-y-auto text-sm" ref="messagesContainer">
        <!-- Welcome message -->
        <div v-if="messages.length === 0" class="text-center text-gray-500 py-4">
          <div class="mb-2">👋 Xin chào! Tôi có thể giúp bạn:</div>
          <div class="space-y-1 text-xs">
            <div>• Tìm tour theo địa điểm</div>
            <div>• Kiểm tra giá và lịch trình</div>
            <div>• Tư vấn tour phù hợp</div>
          </div>
        </div>

        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.role === 'user' ? 'text-right' : 'text-left'"
        >
          <div
            :class="
              msg.role === 'user'
                ? 'bg-blue-100 text-blue-800 ml-4'
                : 'bg-gray-100 text-gray-800 mr-4'
            "
            class="inline-block px-3 py-2 rounded-lg max-w-[85%]"
          >
            <div v-if="msg.role === 'user'" class="font-medium">{{ msg.content }}</div>
            <div v-else>
              <div class="font-medium mb-1">{{ msg.content }}</div>

              <!-- Display tour data if available -->
              <div v-if="msg.data && Array.isArray(msg.data)" class="mt-2 space-y-2">
                <div
                  v-for="(item, idx) in msg.data.slice(0, 3)"
                  :key="idx"
                  class="bg-white p-2 rounded border text-xs"
                >
                  <div v-if="item.name" class="font-semibold text-blue-600 mb-1">
                    {{ item.name }}
                  </div>
                  <div v-if="item.location" class="text-gray-600">📍 {{ item.location }}</div>
                  <div v-if="item.duration" class="text-gray-600">⏰ {{ item.duration }}</div>
                  <div v-if="item.price_formatted" class="text-green-600 font-medium">
                    💰 {{ item.price_formatted }}
                  </div>
                  <div v-if="item.rating" class="text-yellow-600">
                    ⭐ {{ item.rating }}/5 ({{ item.review_count }} đánh giá)
                  </div>
                  <button
                    v-if="item.id"
                    @click="getTourDetails(item.id)"
                    class="mt-1 text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    Xem chi tiết →
                  </button>
                </div>
                <div v-if="msg.data.length > 3" class="text-xs text-gray-500 text-center">
                  Và {{ msg.data.length - 3 }} tour khác...
                </div>
              </div>

              <!-- Display price ranges -->
              <div v-else-if="msg.data && msg.data[0]?.range" class="mt-2 space-y-1">
                <div
                  v-for="(range, idx) in msg.data"
                  :key="idx"
                  class="bg-white p-2 rounded border text-xs flex justify-between"
                >
                  <span>{{ range.range }}</span>
                  <span class="font-medium text-blue-600">{{ range.count }} tour</span>
                </div>
              </div>

              <!-- Display general data -->
              <div
                v-else-if="msg.data && !Array.isArray(msg.data)"
                class="mt-2 bg-white p-2 rounded border text-xs"
              >
                <pre class="whitespace-pre-wrap">{{
                  typeof msg.data === 'object' ? JSON.stringify(msg.data, null, 2) : msg.data
                }}</pre>
              </div>

              <!-- Quick action buttons -->
              <div
                v-if="msg.suggestions && msg.suggestions.length > 0"
                class="mt-2 flex flex-wrap gap-1"
              >
                <button
                  v-for="(suggestion, idx) in msg.suggestions.slice(0, 3)"
                  :key="idx"
                  @click="sendSuggestion(suggestion)"
                  class="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="text-left">
          <div class="bg-gray-100 text-gray-800 inline-block px-3 py-2 rounded-lg mr-4">
            <div class="flex items-center space-x-2">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style="animation-delay: 0.1s"
                ></div>
                <div
                  class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style="animation-delay: 0.2s"
                ></div>
              </div>
              <span class="text-xs">Đang tìm kiếm...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick suggestions -->
      <div class="px-3 py-2 border-t bg-gray-50">
        <div class="text-xs text-gray-600 mb-1">Gợi ý nhanh:</div>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="suggestion in quickSuggestions"
            :key="suggestion"
            @click="sendSuggestion(suggestion)"
            class="px-2 py-1 bg-white text-gray-600 rounded text-xs hover:bg-gray-100 border"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <div class="p-3 border-t flex gap-2">
        <input
          v-model="input"
          @keyup.enter="sendMessage"
          :disabled="isLoading"
          class="flex-1 border px-3 py-2 rounded text-sm focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100"
          placeholder="Nhập tin nhắn..."
        />
        <button
          @click="sendMessage"
          :disabled="isLoading || !input.trim()"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Gửi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import axios from 'axios'

const isOpen = ref(false)
const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)

const quickSuggestions = ref(['Tìm tour Hà Nội', 'Tour giá rẻ', 'Tour 3 ngày', 'Tour nổi bật'])

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && messages.value.length === 0) {
    // Add welcome message
    messages.value.push({
      role: 'assistant',
      content:
        'Xin chào! Tôi là trợ lý du lịch ảo. Tôi có thể giúp bạn tìm kiếm tour, kiểm tra giá cả, xem lịch trình và nhiều thông tin khác. Bạn muốn tìm hiểu về điều gì?',
      suggestions: [
        'Tìm tour theo địa điểm',
        'Xem tour theo giá',
        'Tour theo số ngày',
        'Tour nổi bật nhất',
      ],
    })
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!input.value.trim() || isLoading.value) return

  const userMessage = input.value.trim()
  messages.value.push({ role: 'user', content: userMessage })
  input.value = ''
  isLoading.value = true

  scrollToBottom()

  const baseUrl = import.meta.env.VITE_API_BASE_URL

  try {
    const response = await axios.post(`${baseUrl}/chatbot/query`, {
      message: userMessage,
    })
    console.log('ChatBot Response:', response.data)
    const botMessage = {
      role: 'assistant',
      content: response.data.message || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.',
      data: response.data.data || null,
      suggestions: response.data.suggestions || [],
    }

    console.log('Bot Message:', botMessage)

    messages.value.push(botMessage)

    // Update quick suggestions based on response
    if (response.data.suggestions && response.data.suggestions.length > 0) {
      quickSuggestions.value = response.data.suggestions
    }
  } catch (error) {
    console.error('ChatBot Error:', error)

    let errorMessage = 'Đã xảy ra lỗi khi kết nối với server. Vui lòng thử lại sau.'

    if (error.response?.status === 422) {
      errorMessage = 'Tin nhắn không hợp lệ. Vui lòng thử lại.'
    } else if (error.response?.status === 500) {
      errorMessage = 'Server đang gặp sự cố. Vui lòng thử lại sau ít phút.'
    }

    messages.value.push({
      role: 'assistant',
      content: errorMessage,
      suggestions: ['Thử lại', 'Tìm tour nổi bật', 'Liên hệ hỗ trợ'],
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const sendSuggestion = (suggestion) => {
  input.value = suggestion
  sendMessage()
}

const getTourDetails = async (tourId) => {
  isLoading.value = true
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  try {
    const response = await axios.get(`${baseUrl}/chatbot/tour/${tourId}`)

    console.log('Tour Details Response:', response.data)
    const botMessage = {
      role: 'assistant',
      content: response.data.message || 'Thông tin chi tiết tour:',
      data: response.data.data || null,
      suggestions: response.data.suggestions || [],
    }

    messages.value.push(botMessage)
    scrollToBottom()
  } catch (error) {
    console.error('Get Tour Details Error:', error)
    messages.value.push({
      role: 'assistant',
      content: 'Không thể tải thông tin chi tiết tour. Vui lòng thử lại sau.',
      suggestions: ['Thử lại', 'Tìm tour khác'],
    })
  } finally {
    isLoading.value = false
  }
}

// Clear chat function
const clearChat = () => {
  messages.value = []
  quickSuggestions.value = ['Tìm tour Hà Nội', 'Tour giá rẻ', 'Tour 3 ngày', 'Tour nổi bật']
}

// Initialize
onMounted(() => {
  // You can add initialization logic here if needed
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #999;
}

.animate-bounce {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}
</style>
