<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import Pusher from 'pusher-js'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'

const conversations = ref([])
const selectedConversation = ref(null)
const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const isInitialLoading = ref(true) // Loading khi khởi tạo
const isMessagesLoading = ref(false) // Loading khi tải tin nhắn
const pusher = ref(null)
const channel = ref(null)
const adminToken = localStorage.getItem('adminToken')
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const messagesContainer = ref(null)
const isSidebarOpen = ref(false)
const textareaRef = ref(null)

const fetchConversations = async () => {
  try {
    isInitialLoading.value = true
    const response = await axios.get(`${apiBaseUrl}/admin/conversations`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
    conversations.value = response.data
  } catch (error) {
    console.error('Error fetching conversations:', error)
  } finally {
    isInitialLoading.value = false
  }
}

// Thêm channel toàn cục cho admin
const subscribeToAdminChannel = () => {
  const adminPusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
  })
  const adminChannel = adminPusher.subscribe('admin.conversations')
  adminChannel.bind('new.conversation', () => {
    fetchConversations() // Cập nhật danh sách khi có cuộc trò chuyện mới
  })
}

const selectConversation = async (conversationId) => {
  selectedConversation.value = conversationId
  isSidebarOpen.value = false // Close sidebar on mobile after selection
  isMessagesLoading.value = true

  try {
    const response = await axios.get(
      `${apiBaseUrl}/admin/conversation/${conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    )
    messages.value = response.data
    subscribeToChannel()
    scrollToBottom()
  } catch (error) {
    console.error('Error fetching messages:', error)
  } finally {
    isMessagesLoading.value = false
  }
}

const unsubscribeFromChannel = () => {
  if (pusher.value && channel.value) {
    channel.value.unbind_all()
    pusher.value.unsubscribe(`chat.${selectedConversation.value}`)
    pusher.value.disconnect()
    channel.value = null
    pusher.value = null
  }
}

const sendAdminMessage = async () => {
  if (!input.value.trim() || isLoading.value) return

  isLoading.value = true
  const message = input.value.trim()
  input.value = ''

  // Reset textarea height after clearing content
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = '44px'
    }
  })

  try {
    const response = await axios.post(
      `${apiBaseUrl}/chatbot/admin-message`,
      {
        conversation_id: selectedConversation.value,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    )
    // Thêm tin nhắn sau khi server xác nhận
    messages.value.push({
      role: 'admin',
      content: message,
      timestamp: response.data.data.timestamp,
    })
    scrollToBottom()
  } catch (error) {
    console.error('Error sending admin message:', error)
    messages.value.push({
      role: 'system',
      content: 'Đã xảy ra lỗi khi gửi tin nhắn.',
      timestamp: new Date().toISOString(),
    })
  } finally {
    isLoading.value = false
  }
}

const subscribeToChannel = () => {
  unsubscribeFromChannel() // Clean up existing connections

  if (selectedConversation.value) {
    pusher.value = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
    })
    channel.value = pusher.value.subscribe(`chat.${selectedConversation.value}`)
    // Chỉ thêm tin nhắn nếu không phải từ admin
    channel.value.bind('message.sent', (data) => {
      if (data.sender_type !== 'admin') {
        // Tránh trùng lặp với tin nhắn admin tự gửi
        messages.value.push({
          role: data.sender_type,
          content: data.message,
          timestamp: data.timestamp,
        })
        scrollToBottom()
      }
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

const autoResizeTextarea = () => {
  const textarea = textareaRef.value
  if (textarea) {
    // Reset height to get accurate scrollHeight
    textarea.style.height = '44px'

    // Calculate new height
    const minHeight = 44
    const maxHeight = 120
    const scrollHeight = textarea.scrollHeight

    // Set new height within bounds
    const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight))
    textarea.style.height = newHeight + 'px'

    // Show scrollbar if content exceeds max height
    if (scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto'
    } else {
      textarea.style.overflowY = 'hidden'
    }
  }
}

const handleInput = (event) => {
  // Update the model value
  input.value = event.target.value

  // Auto resize
  nextTick(() => {
    autoResizeTextarea()
  })
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendAdminMessage()
  } else if (event.key === 'Enter' && event.shiftKey) {
    // Allow default behavior for new line, then resize
    nextTick(() => {
      autoResizeTextarea()
    })
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getConversationTitle = (conversation) => {
  if (conversation.user_id) {
    return `User #${conversation.user_id}`
  } else if (conversation.temp_user_id) {
    return `Guest #${conversation.temp_user_id}`
  } else {
    return 'Anonymous'
  }
}

const getSelectedConversationTitle = () => {
  const conversation = conversations.value.find((c) => c.id === selectedConversation.value)
  return conversation ? getConversationTitle(conversation) : 'Cuộc trò chuyện'
}

onMounted(() => {
  fetchConversations()
  subscribeToAdminChannel() // Subscribe vào channel toàn cục
})

onUnmounted(() => {
  unsubscribeFromChannel()
  if (pusher.value) {
    pusher.value.disconnect() // Đảm bảo ngắt kết nối Pusher
  }
})
</script>

<template>
  <LayoutAuthenticated>
    <div class="bg-gray-50 flex flex-col" style="height: calc(100vh - 64px)">
      <!-- Header -->
      <div
        class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden"
      >
        <h1 class="text-lg font-semibold text-gray-900">Admin Chat</h1>
        <button
          @click="isSidebarOpen = !isSidebarOpen"
          class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Mobile Sidebar Overlay -->
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 z-50 lg:hidden"
          @click="isSidebarOpen = false"
        >
          <div class="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <!-- Sidebar -->
        <div
          :class="[
            'bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'fixed inset-y-0 left-0 z-50 w-80 lg:w-80 xl:w-96',
          ]"
        >
          <!-- Sidebar Header -->
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Cuộc trò chuyện</h2>
              <button
                @click="isSidebarOpen = false"
                class="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ conversations.length }} cuộc trò chuyện</p>
          </div>

          <!-- Conversations List -->
          <div class="flex-1 overflow-y-auto">
            <!-- Loading Conversations -->
            <div v-if="isInitialLoading" class="flex items-center justify-center h-64">
              <div class="text-center">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"
                ></div>
                <p class="text-gray-500 text-sm">Đang tải cuộc trò chuyện...</p>
              </div>
            </div>

            <!-- Conversations List Content -->
            <div v-else>
              <div class="p-2">
                <div
                  v-for="conversation in conversations"
                  :key="conversation.id"
                  @click="selectConversation(conversation.id)"
                  :class="[
                    'relative p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2',
                    'hover:bg-blue-50 hover:shadow-sm',
                    selectedConversation === conversation.id
                      ? 'bg-blue-100 border border-blue-200 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100',
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <!-- User Avatar -->
                        <div
                          :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                            conversation.user_id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-400 text-white',
                          ]"
                        >
                          {{ conversation.user_id ? 'U' : 'G' }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <h3 class="text-sm font-medium text-gray-900 truncate">
                            {{ getConversationTitle(conversation) }}
                          </h3>
                          <p class="text-xs text-gray-500">ID: {{ conversation.id }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Active indicator -->
                    <div
                      v-if="selectedConversation === conversation.id"
                      class="w-2 h-2 bg-blue-500 rounded-full"
                    ></div>
                  </div>

                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-xs text-gray-500">
                      {{ formatDate(conversation.last_activity) }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ formatTime(conversation.last_activity) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="conversations.length === 0" class="p-8 text-center">
                <div
                  class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p class="text-gray-500 text-sm">Chưa có cuộc trò chuyện nào</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0">
          <!-- Chat Header -->
          <div
            class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <button
                @click="isSidebarOpen = true"
                class="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div v-if="selectedConversation">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ getSelectedConversationTitle() }}
                </h3>
                <p class="text-sm text-gray-500">Cuộc trò chuyện #{{ selectedConversation }}</p>
              </div>
              <div v-else>
                <h3 class="text-lg font-semibold text-gray-900">Admin Chat</h3>
                <p class="text-sm text-gray-500">Chọn cuộc trò chuyện để bắt đầu</p>
              </div>
            </div>

            <!-- Online Status -->
            <div v-if="selectedConversation" class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs text-gray-500">Đang kết nối</span>
            </div>
          </div>

          <!-- Messages Area -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
            <!-- Loading Messages -->
            <div v-if="isMessagesLoading" class="h-full flex items-center justify-center">
              <div class="text-center">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"
                ></div>
                <p class="text-gray-500 text-sm">Đang tải tin nhắn...</p>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!selectedConversation" class="h-full flex items-center justify-center">
              <div class="text-center">
                <div
                  class="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Chào mừng đến Admin Chat</h3>
                <p class="text-gray-500 max-w-md">
                  Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu tương tác với người
                  dùng.
                </p>
              </div>
            </div>

            <!-- Messages -->
            <div
              v-else
              v-for="(msg, index) in messages"
              :key="index"
              :class="['flex', msg.role === 'admin' ? 'justify-end' : 'justify-start']"
            >
              <div
                :class="[
                  'max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-2xl shadow-sm',
                  msg.role === 'admin'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : msg.role === 'system'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md',
                ]"
              >
                <p class="text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {{ msg.content }}
                </p>
                <div
                  :class="[
                    'text-xs mt-1',
                    msg.role === 'admin' ? 'text-blue-100' : 'text-gray-500',
                  ]"
                >
                  {{ formatTime(msg.timestamp) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="bg-white border-t border-gray-200 p-4">
            <div class="flex gap-3 items-end">
              <div class="flex-1">
                <textarea
                  ref="textareaRef"
                  v-model="input"
                  @input="handleInput"
                  @keydown="handleKeydown"
                  :disabled="isLoading || !selectedConversation"
                  class="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-200"
                  :class="{ 'cursor-not-allowed': !selectedConversation }"
                  placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
                  rows="1"
                  style="min-height: 44px; max-height: 120px; overflow-y: hidden"
                ></textarea>
              </div>
              <button
                @click="sendAdminMessage"
                :disabled="isLoading || !input.trim() || !selectedConversation"
                class="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg
                  v-if="isLoading"
                  class="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>

            <div v-if="!selectedConversation" class="mt-2 text-xs text-gray-500 text-center">
              Vui lòng chọn cuộc trò chuyện để gửi tin nhắn
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
