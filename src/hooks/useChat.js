
import { useState, useEffect, useCallback } from "react"
import { useChatSocket } from "../context/ChatContext" // Contexto del socket
import { getMessagesHistory, initConversation } from "../services/chat.service" // Funciones REST
import { useAuth } from "../context/AuthContext" // Para obtener el senderId

export const useChat = (conversationId) => {
  const { socket, isConnected } = useChatSocket()
  const { user } = useAuth()
  
  // State for messages in the current room
  const [messages, setMessages] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // 1. Initial Load and Subscription (REST + Socket)
  const loadAndSubscribe = useCallback(async () => {
    if (!conversationId || !socket || !isConnected) return

    setLoadingHistory(true)
    
    try {
      // 1.1 Load History (REST)
      const history = await getMessagesHistory(conversationId)
      setMessages(history)

      // 1.2 Subscribe to Room (Socket)
      socket.emit("join_room", conversationId)
      console.log(`Socket joining room: ${conversationId}`)
      
    } catch (error) {
      console.error("Failed to load chat history or join room:", error)
      // Optionally handle error state
    } finally {
      setLoadingHistory(false)
    }
  }, [conversationId, socket, isConnected])

  useEffect(() => {
    loadAndSubscribe()

    // Clean up when component unmounts or conversationId changes
    return () => {
      if (socket && conversationId) {
        socket.emit("leave_room", conversationId)
      }
    }
  }, [loadAndSubscribe])
  
  // 2. Real-Time Listener (Socket)
  useEffect(() => {
    if (!socket) return

    const handleReceiveMessage = (message) => {
      const msgConversationId = message.conversation_id || message.conversationId || message.room

      // VERIFICAMOS: ¿Este mensaje pertenece a la sala actual?
      if (msgConversationId === conversationId) {
        setMessages(prevMessages => [...prevMessages, message])
          
          // Opcional: Si tienes lógica de "escribiendo...", aquí la limpiarías
      } else {
        console.log("🙈 Ignorando mensaje de otra sala en esta vista:", msgConversationId)
      }
    }

    socket.on("receive_message", handleReceiveMessage)

    return () => {
      socket.off("receive_message", handleReceiveMessage)
    }
  }, [socket, conversationId])

  // 3. Action to Send Message (Socket)
  const sendMessage = useCallback((content) => {
    if (!socket || !user || !content || !conversationId) return

    // Payload matches the backend contract
    const messagePayload = {
      room: conversationId,
      content: content,
      senderId: user.id // Assuming user context has the user's UUID
    }

    // Emit event to the server
    socket.emit("send_message", messagePayload)

    // OPTIMISTIC UI (Opcional, pero recomendado para experiencia de usuario)
    // Temporalmente agregamos el mensaje a la UI con un estado "pending"
    // Esto es más avanzado, por ahora, CONFIAMOS en el evento 'receive_message'
    // para la confirmación.

  }, [socket, conversationId, user])

  // Function to initialize a chat room if we don't have a conversationId yet
  const initializeChat = useCallback(async (partnerId, shipmentId) => {
    try {
      const conversation = await initConversation(user?.id, partnerId, shipmentId)
      return conversation.id
    } catch (error) {
      console.error("Failed to initialize conversation:", error)
      throw error
    }
  }, [user?.id])


  return {
    messages,
    loadingHistory,
    sendMessage,
    initializeChat,
    isConnected: isConnected && !!socket // Only connected if socket exists and status is true
  }
}