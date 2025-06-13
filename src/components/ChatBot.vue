<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Pusher from 'pusher-js'

const isOpen = ref(false)
const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)
const ignoreNextClick = ref(false)
const chatMode = ref('ai') // 'ai' or 'human'
const conversationId = ref(null)
const tempUserId = ref(null)
const pusher = ref(null)
const channel = ref(null)

const quickSuggestions = ref(['Tìm tour Hà Nội', 'Tour giá rẻ', 'Tour 3 ngày', 'Tour nổi bật'])

// Generate or retrieve temp user ID for unauthenticated users
const initializeTempUserId = () => {
  if (!tempUserId.value) {
    tempUserId.value = localStorage.getItem('temp_user_id') || generateUUID()
    localStorage.setItem('temp_user_id', tempUserId.value)
  }
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    ignoreNextClick.value = true
    if (messages.value.length === 0 && chatMode.value === 'ai') {
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
    initializeTempUserId()
    subscribeToChannel()
  } else {
    unsubscribeFromChannel()
  }
}

const handleClickOutside = (event) => {
  if (ignoreNextClick.value) {
    ignoreNextClick.value = false
    return
  }
  const popup = document.querySelector('.chatbot-popup')
  const button = document.querySelector('.chatbot-button')
  if (
    isOpen.value &&
    popup &&
    button &&
    !popup.contains(event.target) &&
    !button.contains(event.target)
  ) {
    isOpen.value = false
    unsubscribeFromChannel()
  }
}

const subscribeToChannel = () => {
  unsubscribeFromChannel() // Clean up existing connections

  if (conversationId.value) {
    try {
      pusher.value = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: true,
      })
      channel.value = pusher.value.subscribe(`chat.${conversationId.value}`)
      channel.value.bind('message.sent', (data) => {
        if (data.sender_type !== 'user') {
          messages.value.push({
            role: data.sender_type,
            content: data.message,
            timestamp: data.timestamp,
          })
          scrollToBottom()
        }
      })
    } catch (error) {
      console.error('Error subscribing to channel:', error)
    }
  }
}

const unsubscribeFromChannel = () => {
  if (channel.value && pusher.value) {
    try {
      channel.value.unbind_all()
      if (conversationId.value) {
        pusher.value.unsubscribe(`chat.${conversationId.value}`)
      }
      pusher.value.disconnect()
    } catch (error) {
      console.warn('Error unsubscribing or disconnecting:', error) // Chỉ log warning, không throw
    } finally {
      channel.value = null
      pusher.value = null
    }
  }
}

const switchChatMode = (mode) => {
  chatMode.value = mode
  messages.value = []
  conversationId.value = null
  unsubscribeFromChannel()
  if (mode === 'ai' && isOpen.value) {
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
    quickSuggestions.value = ['Tìm tour Hà Nội', 'Tour giá rẻ', 'Tour 3 ngày', 'Tour nổi bật']
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
  isLoading.value = true
  input.value = ''
  scrollToBottom()

  const baseUrl = import.meta.env.VITE_API_BASE_URL

  try {
    if (chatMode.value === 'ai') {
      const response = await axios.post(`${baseUrl}/chatbot/query`, {
        message: userMessage,
        conversation_id: conversationId.value,
      })
      messages.value.push({ role: 'user', content: userMessage })
      const botMessage = {
        role: 'assistant',
        content: response.data.message || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.',
        data: response.data.data || null,
        suggestions: response.data.suggestions || [],
      }
      messages.value.push(botMessage)
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        quickSuggestions.value = response.data.suggestions
      }
    } else {
      console.time('API Call')
      const response = await axios.post(`${baseUrl}/chatbot/user-message`, {
        message: userMessage,
        conversation_id: conversationId.value,
        temp_user_id: tempUserId.value,
      })
      console.timeEnd('API Call')
      messages.value.push({ role: 'user', content: userMessage })
      conversationId.value = response.data.conversation_id
      subscribeToChannel()
      const botMessage = {
        role: 'system',
        content: 'Tin nhắn đã được gửi đến admin. Bạn sẽ nhận được phản hồi sớm!',
        suggestions: response.data.suggestions || [],
      }
      messages.value.push(botMessage)
      quickSuggestions.value = response.data.suggestions || []
    }
  } catch (error) {
    console.error('ChatBot Error:', error)
    let errorMessage = 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.'
    if (error.response?.status === 422) {
      errorMessage = 'Tin nhắn không hợp lệ. Vui lòng thử lại.'
    } else if (error.response?.status === 500) {
      errorMessage = 'Server đang gặp sự cố. Vui lòng thử lại sau ít phút.'
    }
    messages.value.push({
      role: 'system',
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

const clearChat = () => {
  messages.value = []
  conversationId.value = null
  unsubscribeFromChannel()
  quickSuggestions.value = ['Tìm tour Hà Nội', 'Tour giá rẻ', 'Tour 3 ngày', 'Tour nổi bật']
  if (chatMode.value === 'ai') {
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  initializeTempUserId()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  unsubscribeFromChannel()
})
</script>

<template>
  <div class="fixed bottom-7 right-10 z-100">
    <button
      @click="toggleChat"
      class="chatbot-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300"
    >
      <span v-if="!isOpen">🤖 Chat với AI/Admin</span>
      <span v-else>✕ Đóng</span>
    </button>

    <div
      v-if="isOpen"
      class="chatbot-popup mt-3 w-80 h-[500px] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden z-50"
    >
      <div
        class="bg-blue-600 text-white p-3 font-bold text-center flex justify-between items-center"
      >
        <span
          >🤖 {{ chatMode.value === 'ai' ? 'Trợ lý AI - Travel Booking' : 'Chat với Admin' }}</span
        >
        <div class="flex gap-2">
          <button
            @click="switchChatMode('ai')"
            :class="chatMode.value === 'ai' ? 'bg-blue-800' : 'bg-blue-500'"
            class="px-2 py-1 rounded text-xs hover:bg-blue-700"
          >
            AI
          </button>
          <button
            @click="switchChatMode('human')"
            :class="chatMode.value === 'human' ? 'bg-blue-800' : 'bg-blue-500'"
            class="px-2 py-1 rounded text-xs hover:bg-blue-700"
          >
            Admin
          </button>
        </div>
      </div>

      <div class="flex-1 p-3 space-y-2 overflow-y-auto text-sm" ref="messagesContainer">
        <div
          v-if="messages.length === 0 && chatMode.value === 'ai'"
          class="text-center text-gray-500 py-4"
        >
          <div class="mb-2">👋 Xin chào! Tôi có thể giúp bạn:</div>
          <div class="space-y-1 text-xs">
            <div>📍 Tìm tour theo địa điểm</div>
            <div>💰 Kiểm tra giá và lịch trình</div>
            <div>🗺️ Tư vấn tour phù hợp</div>
          </div>
        </div>
        <div
          v-else-if="messages.length === 0 && chatMode.value === 'human'"
          class="text-center text-gray-500 py-4"
        >
          <div class="mb-2">👋 Chat với nhân viên hỗ trợ</div>
          <div class="text-xs">Gửi tin nhắn để bắt đầu trò chuyện với admin.</div>
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
                : msg.role === 'admin'
                  ? 'bg-green-100 text-green-800 mr-4'
                  : 'bg-gray-100 text-gray-800 mr-4'
            "
            class="inline-block px-3 py-2 rounded-lg max-w-[85%]"
          >
            <div v-if="msg.role === 'user'" class="font-medium">{{ msg.content }}</div>
            <div v-else>
              <div class="font-medium mb-1">{{ msg.content }}</div>

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

              <div
                v-else-if="msg.data && !Array.isArray(msg.data)"
                class="mt-2 bg-white p-2 rounded border text-xs"
              >
                <pre class="whitespace-pre-wrap">{{
                  typeof msg.data === 'object' ? JSON.stringify(msg.data, null, 2) : msg.data
                }}</pre>
              </div>

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
            <div v-if="msg.timestamp" class="text-xs text-gray-500 mt-1">
              {{ new Date(msg.timestamp).toLocaleTimeString() }}
            </div>
          </div>
        </div>

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
              <span class="text-xs">Đang xử lý...</span>
            </div>
          </div>
        </div>
      </div>

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
          :placeholder="chatMode === 'ai' ? 'Nhập tin nhắn...' : 'Nhắn tin với admin...'"
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
