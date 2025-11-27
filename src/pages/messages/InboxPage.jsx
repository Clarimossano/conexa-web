import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MessageSquare, User, Search } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useChatSocket } from "../../context/ChatContext"
import ChatRoom from "../../components/chat/ChatRoom"

// --- Subcomponent: Conversation List Item (Diseño Actualizado) ---
const ConversationItem = ({ conversation, isSelected, onClick }) => {
  const partnerName = conversation.otherParticipantName || "Unknown User"

  // Use last_message (standard) or fallback
  const lastMessage =
    conversation.last_message ||
    conversation.last_message_content ||
    "Open to view messages..."

  // Consumimos el contador que viene del Contexto
  const unreadCount = conversation.unreadCount || conversation.unread_count || 0

  // Estilos Base: Padding, Borde, Transición
  const baseClasses = `
    flex p-4 border-l-4 cursor-pointer transition-all duration-200
  `

  // Estilos Condicionales (Light / Dark + Selected / Unselected)
  // Selected: Fondo Ámbar suave, Borde Ámbar Fuerte
  // Unselected: Transparente, Hover gris suave/oscuro
  const selectedClasses = isSelected
    ? "bg-amber-50 dark:bg-amber-500/10 border-amber-500"
    : "border-transparent hover:bg-gray-100 dark:hover:bg-white/5"

  return (
    <div className={`${baseClasses} ${selectedClasses}`} onClick={onClick}>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          {/* Nombre: Negro en Light, Blanco en Dark (Selected: Ámbar en Light, Blanco en Dark) */}
          <p className={`truncate text-sm font-semibold flex items-center gap-2 ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-white/10 shrink-0">
                <User size={14} />
            </div>
            {partnerName}
          </p>
          
          {/* Fecha: Gris en ambos, Ámbar si seleccionado */}
          <p className={`text-[10px] shrink-0 ${isSelected ? 'text-amber-600 dark:text-amber-500' : 'text-gray-400 dark:text-gray-500'}`}>
            {conversation.created_at
              ? new Date(conversation.created_at).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </p>
        </div>

        <div className="flex justify-between items-end mt-1 pl-10">
          <p
            className={`text-xs truncate pr-2 ${
              unreadCount > 0
                ? "text-gray-900 dark:text-white font-bold"
                : "text-gray-500 dark:text-white/60 font-medium"
            }`}
          >
            {lastMessage}
          </p>

          {/* --- BADGE DE NO LEÍDOS --- */}
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-green-500 text-black text-[10px] font-bold rounded-full shadow-sm shrink-0">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Main Page Component ---
const InboxPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // CONSUMIMOS EL CONTEXTO GLOBAL (Incluyendo markAsRead)
  const { inbox, loadingInbox, refreshInbox, enterChat } = useChatSocket()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConversationId, setSelectedConversationId] = useState(null)

  // Opcional: Refrescar al montar
  useEffect(() => {
    refreshInbox()
  }, [refreshInbox])

  // --- NUEVO HANDLER: Seleccionar y Marcar como leído ---
  const handleSelectChat = (chatId) => {
    if (!chatId) return
    setSelectedConversationId(chatId)
    enterChat(chatId) // <--- Resetea el contador a 0 visualmente
  }

  // EFECTO: AUTO-SELECCIÓN (Navegación desde Marketplace)
  useEffect(() => {
    const selectedChatIdFromState = location.state?.selectedChatId

    if (selectedChatIdFromState) {
      console.log(
        "📍 Navegación detectada hacia chat:",
        selectedChatIdFromState
      )

      setSelectedConversationId(selectedChatIdFromState)
      enterChat(selectedChatIdFromState)

      // Limpieza del historial para evitar mensaje fantasma
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, navigate, location.pathname, enterChat])

  useEffect(() => {
    return () => {
      // Al salir de InboxPage, le decimos al contexto que no estamos mirando nada
      // Así si llega un mensaje, volverá a contar
      enterChat(null)
    }
  }, [enterChat])

  const selectedConversation = inbox.find(
    (c) => c.id === selectedConversationId
  )

  const filteredConversations = inbox.filter((c) =>
    c.otherParticipantName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    // CONTENEDOR PRINCIPAL: Fondo Light (Blanco/Gris) | Fondo Dark (#0A0A0A - Negro Puro)
    <div className="h-screen bg-white dark:bg-[#0A0A0A] font-display flex overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <div
        className={`
        w-full md:w-[360px] lg:w-[420px] 
        flex flex-col h-full
        bg-white dark:bg-[#191919] 
        border-r border-gray-200 dark:border-white/10 
        z-10
        ${selectedConversationId ? "hidden md:flex" : "flex"} 
      `}
      >
        {/* Header & Search */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            Chats
          </h1>
          <div className="relative group">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/50 group-focus-within:text-amber-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 dark:bg-[#2c2c2c] text-sm text-gray-900 dark:text-white pl-10 pr-4 py-2.5 rounded-lg outline-none border border-transparent focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder:text-gray-500 dark:placeholder:text-white/50 transition-all"
            />
          </div>
        </div>

        {/* List Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loadingInbox && (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse flex flex-col items-center gap-2">
              <span className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
              Loading chats...
            </div>
          )}

          {!loadingInbox && filteredConversations.length === 0 && (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
              <p className="text-sm">No conversations found.</p>
            </div>
          )}

          <nav className="flex flex-col">
            {filteredConversations.map((conv) => (
                <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={conv.id === selectedConversationId}
                // USAMOS EL NUEVO HANDLER
                onClick={() => handleSelectChat(conv.id)}
                />
            ))}
          </nav>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`
        flex-1 flex flex-col bg-gray-50 dark:bg-[#0A0A0A]
        ${
          !selectedConversationId
            ? "hidden md:flex"
            : "flex fixed top-16 inset-x-0 bottom-0 md:static z-20"
        }
      `}
      >
        {selectedConversationId ? (
          <>
            {/* Mobile Back Header */}
            <div className="md:hidden bg-white dark:bg-[#191919] border-b border-gray-200 dark:border-white/10 p-3 flex items-center">
              <button
                onClick={() => setSelectedConversationId(null)}
                className="text-sm text-gray-600 dark:text-gray-300 px-2 py-1 flex items-center gap-1"
              >
                <span>←</span> Volver
              </button>
            </div>

            <ChatRoom
              key={selectedConversationId}
              conversationId={selectedConversationId}
              partnerName={selectedConversation?.otherParticipantName || "Chat"}
              initialMessage={
                location.state?.selectedChatId === selectedConversationId
                  ? location.state?.initialMessage
                  : ""
              }
            />
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-neutral-600 p-8 bg-gray-50 dark:bg-[#0A0A0A]">
            <div className="w-24 h-24 bg-gray-200 dark:bg-[#191919] rounded-full flex items-center justify-center mb-6 border border-gray-300 dark:border-white/5">
              <MessageSquare size={40} className="opacity-50 text-gray-500 dark:text-white/20" />
            </div>
            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
              Selecciona un chat para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InboxPage