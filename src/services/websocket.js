import Echo from "laravel-echo"
import Pusher from "pusher-js"

// Tránh xung đột với biến toàn cục
let echoInstance = null

export function initWebSocket() {
  // Chỉ khởi tạo một lần
  if (echoInstance) return echoInstance

  console.log("Initializing Pusher cloud connection with config:", {
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  })

  // Khởi tạo Pusher
  window.Pusher = Pusher

  // Khởi tạo Echo với cấu hình Pusher cloud
  echoInstance = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,
    disableStats: true,
    // Không cần wsHost và wsPort khi sử dụng Pusher cloud
  })

  // Lắng nghe sự kiện kết nối
  echoInstance.connector.pusher.connection.bind("connected", () => {
    console.log("Successfully connected to Pusher cloud")
  })

  echoInstance.connector.pusher.connection.bind("error", (error) => {
    console.error("Pusher connection error:", error)
  })

  console.log("Pusher initialized successfully")
  return echoInstance
}

export function getEcho() {
  if (!echoInstance) {
    return initWebSocket()
  }
  return echoInstance
}

export function leaveChannel(channelName) {
  if (echoInstance) {
    echoInstance.leaveChannel(channelName)
    console.log(`Left channel: ${channelName}`)
  }
}

export function joinChannel(channelName, events = {}) {
  if (!echoInstance) {
    initWebSocket()
  }

  const channel = echoInstance.channel(channelName)

  // Đăng ký các sự kiện
  Object.keys(events).forEach((eventName) => {
    channel.listen(eventName, events[eventName])
  })

  console.log(`Joined channel: ${channelName}`)
  return channel
}
