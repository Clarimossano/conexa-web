
import apiClient from "./apiClient" 

const CHAT_BASE_URL = "/chat" 

/**
 * Retrieves the logged-in user's list of conversations (Inbox).
 * @returns {Promise<Array<Conversation>>}
 */
export const getInbox = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await apiClient.get(`${CHAT_BASE_URL}/inbox`)
    return response.data.conversations
  } catch (error) {
    throw error 
  }
}

/**
 * Creates a new conversation or retrieves an existing one.
 * @param {string} targetUserId - The UUID of the user being contacted.
 * @param {string | null} [shipmentId] - Optional ID of the related shipment.
 * @returns {Promise<Conversation>}
 */
export const initConversation = async (userId, targetUserId, shipmentId = null) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await apiClient.post(`${CHAT_BASE_URL}/init`, {
      userId,
      targetUserId,
      shipmentId
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Loads the historical messages for a specific conversation.
 * @param {string} conversationId 
 * @returns {Promise<Array<Message>>}
 */
export const getMessagesHistory = async (conversationId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await apiClient.get(`${CHAT_BASE_URL}/${conversationId}/messages`)
    return response.data.messages
  } catch (error) {
    throw error
  }
}

/**
 * Marks all unread messages in a conversation as read (is_read = TRUE).
 * Used when a user opens the chat room.
 * @param {string} conversationId 
 * @returns {Promise<void>}
 */
export const markConversationAsRead = async (conversationId) => {
  try {
    // Usamos PATCH y no enviamos body, ya que el Backend solo necesita el ID 
    // de la conversación y el ID del usuario (desde la cookie JWT).
    await apiClient.patch(`${CHAT_BASE_URL}/${conversationId}/read`)
  } catch (error) {
    // Solo registramos el error, no bloqueamos el chat si falla la persistencia.
    console.error("Failed to mark conversation as read:", error) 
  }
}