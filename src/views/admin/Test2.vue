<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import axios from 'axios'
import { initWebSocket, getEcho, leaveChannel, joinChannel } from '../../services/websocket'

// Debug mode
const DEBUG = true
const logDebug = (message, data) => {
  if (DEBUG) {
    console.log(`[${new Date().toISOString()}] ${message}`, data)
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const adminToken = localStorage.getItem('adminToken')
const conversations = ref([])
const notifications = ref([])
const statistics = ref({})
const selectedConversation = ref(null)
const adminResponse = ref('')
const isLoading = ref(false)
const isOnline = ref(true)
const userTyping = ref(false)
const connectionStatus = ref('disconnected') // 'connected', 'disconnected', 'connecting'
const lastMessageTime = ref(null)
const messageLatency = ref(null)

// WebSocket channels
let adminChannel = null
let selectedChatChannel = null
let typingTimeout = null

// Computed for better performance
const pendingNotifications = computed(() =>
  notifications.value.filter((n) => n.status === 'pending'),
)

const activeConversations = computed(() => conversations.value.filter((c) => c.status === 'active'))

const isConnected = computed(() => connectionStatus.value === 'connected')

onMounted(() => {
  connectionStatus.value = 'connecting'
  loadDashboardData()
  setupAdminWebSocketListeners()
  testWebSocketConnection()
  logDebug('Admin dashboard mounted', { time: new Date() })
})

onUnmounted(() => {
  cleanupWebSocketListeners()
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  logDebug('Admin dashboard unmounted', { time: new Date() })
})

const testWebSocketConnection = async () => {
  try {
    const startTime = performance.now()
    const response = await axios.get(`${apiBaseUrl}/websocket-debug/test-connection`)
    const endTime = performance.now()

    logDebug('WebSocket test connection', {
      success: response.data.success,
      responseTime: endTime - startTime,
      serverTime: response.data.server_time,
      processingTime: response.data.processing_time_ms,
    })

    if (response.data.success) {
      connectionStatus.value = 'connected'
    }
  } catch (error) {
    console.error('WebSocket test connection failed:', error)
    connectionStatus.value = 'disconnected'
  }
}

const loadDashboardData = async () => {
  try {
    isLoading.value = true
    logDebug('Loading dashboard data', { time: new Date() })

    const headers = { Authorization: `Bearer ${adminToken}` }

    // Load only essential data first
    const startTime = performance.now()
    const [notificationsRes, statisticsRes] = await Promise.all([
      axios.get(`${apiBaseUrl}/admin/chat/notifications`, { headers }),
      axios.get(`${apiBaseUrl}/admin/chat/statistics`, { headers }),
    ])
    const endTime = performance.now()

    notifications.value = notificationsRes.data.notifications || []
    statistics.value = statisticsRes.data

    logDebug('Dashboard data loaded', {
      responseTime: endTime - startTime,
      notificationsCount: notifications.value.length,
    })

    // Load conversations separately to avoid blocking
    loadConversations()
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    logDebug('Dashboard data loading failed', { error: error.message })
  } finally {
    isLoading.value = false
  }
}

const loadConversations = async () => {
  try {
    logDebug('Loading conversations', { time: new Date() })

    const headers = { Authorization: `Bearer ${adminToken}` }
    const startTime = performance.now()
    const response = await axios.get(`${apiBaseUrl}/admin/chat/conversations`, {
      headers,
      params: { limit: 20 }, // Limit conversations
    })
    const endTime = performance.now()

    conversations.value = response.data.data || response.data

    logDebug('Conversations loaded', {
      responseTime: endTime - startTime,
      count: conversations.value.length,
    })
  } catch (error) {
    console.error('Failed to load conversations:', error)
    logDebug('Conversations loading failed', { error: error.message })
  }
}

const selectConversation = async (conversation) => {
  try {
    logDebug('Selecting conversation', {
      conversationId: conversation.id,
      time: new Date(),
    })

    const headers = { Authorization: `Bearer ${adminToken}` }
    const startTime = performance.now()
    const response = await axios.get(`${apiBaseUrl}/admin/chat/conversations/${conversation.id}`, {
      headers,
    })
    const endTime = performance.now()

    selectedConversation.value = response.data.conversation

    logDebug('Conversation selected', {
      responseTime: endTime - startTime,
      messagesCount: selectedConversation.value?.messages?.length || 0,
    })

    // Setup WebSocket listeners for this conversation
    setupChatWebSocketListeners(conversation.id)

    scrollToBottom()
  } catch (error) {
    console.error('Failed to load conversation:', error)
    logDebug('Conversation selection failed', { error: error.message })
  }
}

const setupAdminWebSocketListeners = () => {
  logDebug('Setting up admin WebSocket listeners', { time: new Date() })

  // Khởi tạo WebSocket
  initWebSocket()

  // Lắng nghe kênh admin
  adminChannel = joinChannel('admin.notifications', {
    '.notification.new': (data) => {
      logDebug('WebSocket: New admin notification received', { data })

      // Add to notifications list
      notifications.value.unshift({
        id: data.id,
        conversation_id: data.conversation_id,
        user_id: data.user_id,
        message: data.message,
        priority: data.priority,
        status: 'pending',
        notified_at: data.timestamp,
      })

      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('New Chat Message', {
          body: `User ${data.user_id}: ${data.message}`,
          icon: '/favicon.ico',
        })
      }
    },
    '.message.new': (data) => {
      logDebug('WebSocket: New message in admin channel', { data })

      // If this is for the currently selected conversation, add it
      if (selectedConversation.value && selectedConversation.value.id == data.conversation_id) {
        const newMessage = {
          id: Date.now(),
          message: data.message,
          sender_type: data.sender_type,
          sender_id: data.sender_id,
          timestamp: data.timestamp,
          metadata: data.metadata,
        }

        if (!selectedConversation.value.messages) {
          selectedConversation.value.messages = []
        }

        selectedConversation.value.messages.push(newMessage)
        scrollToBottom()
      }

      // Update conversations list in background
      loadConversations()
    },
  })

  logDebug('Admin WebSocket listeners setup complete', { channel: 'admin.notifications' })
}

const setupChatWebSocketListeners = (conversationId) => {
  if (selectedChatChannel) {
    logDebug('Leaving previous chat channel', {
      previousChannel: `chat.${selectedConversation.value.id}`,
    })
    leaveChannel(`chat.${selectedConversation.value.id}`)
    selectedChatChannel = null
  }

  logDebug('Setting up chat WebSocket listeners', { conversationId })

  selectedChatChannel = joinChannel(`chat.${conversationId}`, {
    '.message.new': (data) => {
      logDebug('WebSocket: New message in selected chat', { data })

      // Calculate latency if this is a response to our message
      if (lastMessageTime.value) {
        const latency = new Date() - lastMessageTime.value
        messageLatency.value = latency
        logDebug('Message latency', { latency: `${latency}ms` })
      }

      // Add message to selected conversation
      if (selectedConversation.value && selectedConversation.value.id == conversationId) {
        const newMessage = {
          id: Date.now(),
          message: data.message,
          sender_type: data.sender_type,
          sender_id: data.sender_id,
          timestamp: data.timestamp,
          metadata: data.metadata,
        }

        if (!selectedConversation.value.messages) {
          selectedConversation.value.messages = []
        }

        selectedConversation.value.messages.push(newMessage)
        scrollToBottom()
      }
    },
    '.user.typing': (data) => {
      logDebug('WebSocket: User typing', { data })

      if (data.user_type === 'user') {
        userTyping.value = data.is_typing

        if (data.is_typing) {
          setTimeout(() => {
            userTyping.value = false
          }, 3000)
        }
      }
    },
  })

  logDebug('Chat WebSocket listeners setup complete', { channel: `chat.${conversationId}` })
}

const cleanupWebSocketListeners = () => {
  if (adminChannel) {
    logDebug('Cleaning up admin WebSocket listeners')
    leaveChannel('admin.notifications')
    adminChannel = null
  }

  if (selectedChatChannel && selectedConversation.value) {
    logDebug('Cleaning up chat WebSocket listeners', {
      channel: `chat.${selectedConversation.value.id}`,
    })
    leaveChannel(`chat.${selectedConversation.value.id}`)
    selectedChatChannel = null
  }
}

const sendResponse = async () => {
  if (!adminResponse.value.trim() || !selectedConversation.value) return

  const messageText = adminResponse.value.trim()

  // Lấy admin data từ localStorage và đảm bảo có ID
  let adminData = JSON.parse(localStorage.getItem('adminData') || '{}')

  // Nếu không có adminData hoặc không có ID, tạo một ID tạm thời
  if (!adminData.id) {
    adminData = {
      id: 'admin_' + Date.now(), // Tạo ID tạm thời
      name: 'Admin',
    }
    localStorage.setItem('adminData', JSON.stringify(adminData))
  }

  console.log('Admin data for sending message:', adminData)

  try {
    // Add message to UI immediately for better UX
    const newMessage = {
      id: Date.now(),
      message: messageText,
      sender_type: 'admin',
      timestamp: new Date().toISOString(),
      sender_id: adminData.id,
    }

    if (selectedConversation.value.messages) {
      selectedConversation.value.messages.push(newMessage)
    }

    adminResponse.value = ''
    scrollToBottom()

    // Record time for latency measurement
    lastMessageTime.value = new Date()

    // Send via WebSocket first for immediate delivery
    logDebug('Sending admin response via WebSocket', {
      message: messageText,
      conversationId: selectedConversation.value.id,
      time: new Date(),
    })

    const startTime = performance.now()
    const response = await axios.post(`${apiBaseUrl}/websocket-debug/send-message`, {
      conversation_id: selectedConversation.value.id,
      message: messageText,
      sender_type: 'admin',
      sender_id: adminData.id,
      sender_name: adminData.name || 'Admin',
    })
    const endTime = performance.now()

    logDebug('Admin response sent via WebSocket', {
      success: response.data.success,
      messageId: response.data.message_id,
      responseTime: endTime - startTime,
      processingTime: response.data.processing_time_ms,
    })

    // Also send via traditional API for database storage
    const headers = { Authorization: `Bearer ${adminToken}` }
    await axios.post(
      `${apiBaseUrl}/admin/chat/respond`,
      {
        conversation_id: selectedConversation.value.id,
        message: messageText,
        sender_id: adminData.id, // Thêm sender_id vào request
      },
      { headers },
    )

    // Update notifications in background
    updateNotifications()
  } catch (error) {
    console.error('Failed to send response:', error)
    logDebug('Admin response failed', { error: error.message })

    // Remove the message from UI if failed
    if (selectedConversation.value.messages) {
      selectedConversation.value.messages.pop()
    }
  }
}

// Handle admin typing indicator
const handleAdminTyping = () => {
  if (!selectedConversation.value) return

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}')

  // Send typing indicator
  logDebug('Sending admin typing indicator', {
    conversationId: selectedConversation.value.id,
    adminId: adminData.id,
    isTyping: true,
  })

  axios
    .post(`${apiBaseUrl}/websocket-debug/typing`, {
      conversation_id: selectedConversation.value.id,
      user_id: adminData.id || 'admin_default', // Đảm bảo luôn có user_id
      is_typing: true,
      user_type: 'admin',
    })
    .then((response) => {
      logDebug('Admin typing indicator sent', {
        success: response.data.success,
        processingTime: response.data.processing_time_ms,
      })
    })
    .catch((error) => {
      console.error('Failed to send admin typing indicator:', error)
    })

  // Clear previous timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }

  // Stop typing after 2 seconds
  typingTimeout = setTimeout(() => {
    axios
      .post(`${apiBaseUrl}/websocket-debug/typing`, {
        conversation_id: selectedConversation.value.id,
        user_id: adminData.id || 'admin_default',
        is_typing: false,
        user_type: 'admin',
      })
      .catch(console.error)
  }, 2000)
}

const updateOnlineStatus = async () => {
  try {
    const headers = { Authorization: `Bearer ${adminToken}` }
    await axios.post(`${apiBaseUrl}/admin/chat/status`, {}, { headers })

    // Continue updating every 30 seconds
    setTimeout(updateOnlineStatus, 30000)
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

const updateNotifications = async () => {
  try {
    const headers = { Authorization: `Bearer ${adminToken}` }
    const response = await axios.get(`${apiBaseUrl}/admin/chat/notifications`, { headers })
    notifications.value = response.data.notifications || []
  } catch (error) {
    // Silently fail to avoid console spam
  }
}

const claimNotification = async (notificationId) => {
  try {
    const headers = { Authorization: `Bearer ${adminToken}` }
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}')

    await axios.post(
      `${apiBaseUrl}/admin/chat/claim-notification`,
      {
        notification_id: notificationId,
        admin_id: adminData.id || 'admin_default', // Đảm bảo luôn có admin_id
      },
      { headers },
    )

    // Remove from local state immediately
    notifications.value = notifications.value.filter((n) => n.id !== notificationId)

    logDebug('Notification claimed', { notificationId })
  } catch (error) {
    console.error('Failed to claim notification:', error)
    logDebug('Notification claim failed', { error: error.message })
  }
}

const requestNotificationPermission = () => {
  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getPriorityColor = (priority) => {
  const colors = {
    urgent: 'bg-red-500',
    high: 'bg-orange-500',
    normal: 'bg-blue-500',
    low: 'bg-gray-500',
  }
  return colors[priority] || colors.normal
}

const scrollToBottom = () => {
  setTimeout(() => {
    const messagesContainer = document.querySelector('.messages-container')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, 100)
}

// Watch for connection status changes
watch(connectionStatus, (newStatus) => {
  logDebug('WebSocket connection status changed', { status: newStatus })
})

// Request notification permission on mount
onMounted(() => {
  requestNotificationPermission()
  updateOnlineStatus()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">Admin Chat Dashboard</h1>
            <span v-if="isConnected" class="ml-3 flex items-center text-green-600">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Pusher Connected
            </span>
            <span v-else class="ml-3 flex items-center text-red-600">
              <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Pusher Disconnected
            </span>
          </div>

          <!-- Statistics -->
          <div class="flex space-x-6 text-sm">
            <div class="text-center">
              <div class="font-semibold text-gray-900">
                {{ activeConversations.length }}
              </div>
              <div class="text-gray-500">Active Chats</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-red-600">
                {{ pendingNotifications.length }}
              </div>
              <div class="text-gray-500">Pending</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-green-600">
                {{ statistics.current_status?.online_admins || 1 }}
              </div>
              <div class="text-gray-500">Admins Online</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Info -->
    <div v-if="DEBUG" class="bg-gray-100 px-4 py-2 text-xs border-b">
      <div class="max-w-7xl mx-auto flex justify-between">
        <span>Status: {{ connectionStatus }}</span>
        <span v-if="messageLatency">Latency: {{ messageLatency }}ms</span>
        <span>Selected: {{ selectedConversation?.id || 'None' }}</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Notifications Panel -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow">
            <div class="px-4 py-3 border-b">
              <h3 class="text-lg font-medium text-gray-900">
                Real-time Notifications
                <span
                  v-if="pendingNotifications.length > 0"
                  class="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse"
                >
                  {{ pendingNotifications.length }}
                </span>
              </h3>
            </div>

            <div class="max-h-96 overflow-y-auto">
              <div v-if="pendingNotifications.length === 0" class="p-4 text-center text-gray-500">
                No pending notifications
              </div>

              <div
                v-for="notification in pendingNotifications.slice(0, 10)"
                :key="notification.id"
                class="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                @click="selectConversation({ id: notification.conversation_id })"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <span
                        :class="getPriorityColor(notification.priority)"
                        class="w-2 h-2 rounded-full mr-2"
                      ></span>
                      <span class="text-sm font-medium text-gray-900">
                        User {{ notification.user_id || 'Anonymous' }}
                      </span>
                      <span class="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        Pusher
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                      {{ notification.message }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ formatTime(notification.notified_at) }}
                    </p>
                  </div>
                  <button
                    @click.stop="claimNotification(notification.id)"
                    class="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 transition-colors"
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Conversations List -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow">
            <div class="px-4 py-3 border-b">
              <h3 class="text-lg font-medium text-gray-900">Active Conversations</h3>
            </div>

            <div class="max-h-96 overflow-y-auto">
              <div v-if="activeConversations.length === 0" class="p-4 text-center text-gray-500">
                No active conversations
              </div>

              <div
                v-for="conversation in activeConversations.slice(0, 15)"
                :key="conversation.id"
                class="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{
                  'bg-blue-50 border-blue-200': selectedConversation?.id === conversation.id,
                }"
                @click="selectConversation(conversation)"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium text-gray-900">
                      User {{ conversation.user_id || 'Anonymous' }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      {{ formatTime(conversation.last_activity) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Interface -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow h-96 flex flex-col">
            <!-- Chat Header -->
            <div v-if="selectedConversation" class="px-4 py-3 border-b">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    Chat with User {{ selectedConversation.user_id || 'Anonymous' }}
                  </h3>
                  <p class="text-sm text-gray-500 flex items-center gap-2">
                    Started {{ formatTime(selectedConversation.started_at) }}
                    <span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      Pusher Real-time
                    </span>
                    <span v-if="userTyping" class="text-blue-600 animate-pulse">
                      User is typing...
                    </span>
                  </p>
                </div>
                <button
                  @click="((selectedConversation = null), cleanupWebSocketListeners())"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4 messages-container">
              <div
                v-if="!selectedConversation"
                class="flex items-center justify-center h-full text-gray-500"
              >
                Select a conversation to start real-time chatting
              </div>

              <div
                v-for="message in selectedConversation?.messages?.slice(-20) || []"
                :key="message.id"
                :class="{
                  'flex justify-end': message.sender_type === 'admin',
                  'flex justify-start': message.sender_type !== 'admin',
                }"
              >
                <div
                  :class="{
                    'bg-blue-500 text-white': message.sender_type === 'admin',
                    'bg-gray-200 text-gray-800': message.sender_type === 'user',
                    'bg-green-100 text-green-800': message.sender_type === 'ai',
                  }"
                  class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm"
                >
                  <div class="text-xs opacity-75 mb-1 flex items-center gap-2">
                    {{
                      message.sender_type === 'admin'
                        ? 'Admin'
                        : message.sender_type === 'user'
                          ? 'User'
                          : 'AI'
                    }}
                    • {{ formatTime(message.timestamp) }}
                    <span
                      v-if="message.sender_type !== 'ai'"
                      class="bg-green-500 text-white px-1 py-0.5 rounded text-xs"
                    >
                      Pusher
                    </span>
                  </div>
                  <div class="whitespace-pre-wrap">{{ message.message }}</div>
                </div>
              </div>

              <!-- User Typing Indicator -->
              <div v-if="userTyping" class="flex justify-start">
                <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-sm max-w-xs">
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
                    <span class="text-xs">User is typing...</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Response Input -->
            <div v-if="selectedConversation" class="border-t p-4">
              <div class="flex space-x-2">
                <input
                  v-model="adminResponse"
                  @keyup.enter="sendResponse"
                  @input="handleAdminTyping"
                  :disabled="!isConnected"
                  type="text"
                  placeholder="Type your response (Pusher real-time)..."
                  class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  @click="sendResponse"
                  :disabled="!adminResponse.trim() || !isConnected"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.messages-container {
  scroll-behavior: smooth;
}
</style>
