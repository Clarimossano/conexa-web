import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback
} from "react"
import { io } from "socket.io-client"
import { useAuth } from "./AuthContext"
import { getInbox, markConversationAsRead } from "../services/chat.service"

const ChatContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useChatSocket = () => useContext(ChatContext)

// --- Sorting Helper ---
const sortByUpdatedAt = (a, b) => {
  const dateA = new Date(a.updated_at || a.created_at)
  const dateB = new Date(b.updated_at || b.created_at)
  return dateB.getTime() - dateA.getTime()
}

const normalizeId = (value) => (value !== null && value !== undefined ? value.toString() : null)

const getMessageContent = (message) =>
  message.content ||
  message.message ||
  message.last_message ||
  message.last_message_content ||
  ""

const getMessageTimestamp = (message) =>
  message.created_at || message.createdAt || message.timestamp || new Date().toISOString()

const normalizeConversation = (conversation) => {
  const unread = Number(
    conversation.unreadCount ??
      conversation.unread_count ??
      conversation.unreadMessages ??
      conversation.unread_messages ??
      0
  )

  return {
    ...conversation,
    id: normalizeId(conversation.id),
    unreadCount: unread,
    unread_count: unread
  }
}

export const ChatProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const socketRef = useRef(null)
  const activeChatIdRef = useRef(null)
  const joinedRoomsRef = useRef(new Set())

  const [inbox, setInbox] = useState([])
  const [loadingInbox, setLoadingInbox] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Ajuste URL: Aseguramos que apunte a la raíz (sin /api)
  const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
  const SOCKET_URL = RAW_URL.replace(/\/api\/?$/, "")

  // --- ACTIONS ---

  // FETCH INBOX
  const ensureRoomJoined = useCallback(
    (conversationId) => {
      const normalizedId = normalizeId(conversationId)
      const socket = socketRef.current
      if (!normalizedId || !socket || !isAuthenticated) return
      if (joinedRoomsRef.current.has(normalizedId)) return
      socket.emit("join_room", normalizedId)
      joinedRoomsRef.current.add(normalizedId)
    },
    [isAuthenticated]
  )

  const refreshInbox = useCallback(async () => {
    if (!isAuthenticated) return
    setLoadingInbox(true)
    try {
      const data = await getInbox()
      const list = Array.isArray(data) ? data : data.conversations || []
      const normalized = list.map(normalizeConversation).sort(sortByUpdatedAt)
      setInbox(normalized)
      normalized.forEach((conv) => ensureRoomJoined(conv.id))
    } catch (error) {
      console.error("Failed to load inbox:", error)
    } finally {
      setLoadingInbox(false)
    }
  }, [ensureRoomJoined, isAuthenticated])

  // MARK AS READ (Protegido contra null)
  const markAsRead = useCallback((conversationId) => {
    const normalizedId = normalizeId(conversationId)
    if (!normalizedId) return

    setInbox((prev) =>
      prev.map((conv) => {
        if (conv.id === normalizedId) {
          return {
            ...conv,
            unreadCount: 0,
            unread_count: 0
          }
        }
        return conv
      })
    )
    markConversationAsRead(normalizedId)
  }, [])

  // ENTER CHAT (Protegido)
  const enterChat = useCallback(
    (chatId) => {
      const normalizedId = normalizeId(chatId)
      activeChatIdRef.current = normalizedId
      if (normalizedId) {
        markAsRead(normalizedId)
      }
    },
    [markAsRead]
  )

  const leaveChat = useCallback(() => {
    activeChatIdRef.current = null
  }, [])


  // --- SOCKET LIFECYCLE ---
  useEffect(() => {
    // Solo conectamos si hay usuario Y hay ID de usuario
    if (isAuthenticated && user?.id && !socketRef.current) {
      console.log("🔌 Inicializando Socket Global a:", SOCKET_URL)

      const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        path: "/socket.io", // Asegúrate de que tu backend usa este path
      })

      socketRef.current = socket

      socket.on("connect", () => {
          console.log("✅ Socket Conectado!")
          setIsConnected(true)
      })
      
      socket.on("connect_error", (err) => {
          console.error("❌ Error conexión Socket:", err.message)
      })

      socket.on("disconnect", () => {
        setIsConnected(false)
        joinedRoomsRef.current.clear()
      })

      // LISTENER DE MENSAJES
      const handleReceiveMessage = (newMessage) => {
        setInbox((prevInbox) => {
          const rawConversationId =
            newMessage.conversation_id || newMessage.conversationId || newMessage.room
          const conversationId = normalizeId(rawConversationId)
          if (!conversationId) {
            refreshInbox()
            return prevInbox
          }

          const msgSenderId = newMessage.senderId || newMessage.sender_id
          const existingIndex = prevInbox.findIndex((c) => c.id === conversationId)

          if (existingIndex === -1) {
            refreshInbox()
            return prevInbox
          }

          const updatedInbox = [...prevInbox]
          const [conversation] = updatedInbox.splice(existingIndex, 1)
          const isMe = msgSenderId === user.id
          const isCurrentlyOpen = activeChatIdRef.current === conversationId
          const baseUnread =
            conversation.unreadCount ??
            conversation.unread_count ??
            conversation.unreadMessages ??
            0

          const unreadCount = isMe || isCurrentlyOpen ? 0 : baseUnread + 1

          const nextConversation = normalizeConversation({
            ...conversation,
            last_message: getMessageContent(newMessage) || conversation.last_message,
            last_message_content:
              getMessageContent(newMessage) || conversation.last_message_content,
            updated_at: getMessageTimestamp(newMessage),
            unreadCount,
            unread_count: unreadCount
          })

          updatedInbox.unshift(nextConversation)
          return updatedInbox
        })
      }

      socket.on("receive_message", handleReceiveMessage)

      return () => {
        socket.off("receive_message", handleReceiveMessage)
        if (socketRef.current) {
          socketRef.current.disconnect()
          socketRef.current = null
        }
        joinedRoomsRef.current.clear()
      }
    }

    if (!isAuthenticated && socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [isAuthenticated, refreshInbox, SOCKET_URL, user])

  // Initial Fetch
  useEffect(() => {
    if (isAuthenticated) {
      refreshInbox()
    } else {
      setInbox([])
      joinedRoomsRef.current.clear()
    }
  }, [isAuthenticated, refreshInbox])

  useEffect(() => {
    if (!isAuthenticated || !isConnected) return
    inbox.forEach((conv) => ensureRoomJoined(conv.id))
  }, [ensureRoomJoined, inbox, isAuthenticated, isConnected])

  const contextValue = {
    socket: socketRef.current,
    isConnected,
    inbox,
    loadingInbox,
    refreshInbox,
    markAsRead,
    enterChat,
    leaveChat,
  }

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  )
}
export default ChatProvider // Asegúrate de exportarlo bien