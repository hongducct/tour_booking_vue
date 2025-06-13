import { getEcho } from "./websocket"

export function testPusherConnection() {
  const echo = getEcho()

  if (!echo) {
    console.error("Echo instance not initialized")
    return false
  }

  const pusher = echo.connector.pusher

  console.log("Pusher connection state:", pusher.connection.state)
  console.log("Pusher socket ID:", pusher.connection.socket_id)

  return pusher.connection.state === "connected"
}

export function getPusherStats() {
  const echo = getEcho()

  if (!echo) {
    return { status: "not_initialized" }
  }

  const pusher = echo.connector.pusher

  return {
    state: pusher.connection.state,
    socketId: pusher.connection.socket_id,
    channels: Object.keys(pusher.channels.channels),
    options: {
      key: pusher.key,
      cluster: pusher.config.cluster,
      encrypted: pusher.config.encrypted,
    },
  }
}
