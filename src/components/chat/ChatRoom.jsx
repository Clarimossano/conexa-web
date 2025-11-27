import { useState, useEffect, useRef } from "react"
import {
  Send,
  User,
  Loader2,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  CheckCheck,
  FileText,
} from "lucide-react"
import { useChat } from "../../hooks/useChat"
import { useAuth } from "../../context/AuthContext"

const ChatRoom = ({ conversationId, partnerName, initialMessage }) => {
  const { user } = useAuth()
  const { messages, loadingHistory, sendMessage, isConnected } = useChat(conversationId)

  const [newMessage, setNewMessage] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const messagesEndRef = useRef(null)
  const optionsRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialMessage) setNewMessage(initialMessage)
  }, [initialMessage, conversationId])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !isConnected) return
    sendMessage(newMessage)
    setNewMessage("")
  }

  const formatTime = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    // CONTENEDOR PRINCIPAL: Blanco en Light, Negro Profundo en Dark
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0A0A]">
      
      {/* 1. HEADER */}
      <div className="flex h-20 items-center justify-between border-b border-gray-200 dark:border-white/10 px-6 bg-white dark:bg-[#0A0A0A] shrink-0 transition-colors">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Avatar: Gris en Light, Oscuro en Dark */}
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <User size={24} />
            </div>
            {/* Online Status: Borde coincide con el fondo del header */}
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white dark:border-[#0A0A0A] bg-green-500"></span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
              {partnerName}
            </h3>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
              {isConnected ? "Online" : "Reconnecting..."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            title="Llamar"
          >
            <Phone size={20} />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            title="Videollamada"
          >
            <Video size={22} />
          </button>

          {/* Dropdown Menu */}
          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${
                showOptions ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white" : ""
              }`}
              title="Opciones"
            >
              <MoreVertical size={20} />
            </button>

            {showOptions && (
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors">
                  <FileText size={16} className="text-amber-500" />
                  Ver detalles de la oferta
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors">
                  <User size={16} className="text-gray-400" />
                  Ver perfil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MESSAGES AREA */}
      {/* Fondo: Gris muy suave en Light (para resaltar burbujas blancas), Negro en Dark */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-[#0A0A0A] transition-colors">
        {loadingHistory ? (
          <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500 gap-2">
            <Loader2 className="animate-spin" />
            <span>Cargando historial...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400 dark:text-gray-600">
            <p>No hay mensajes previos.</p>
            <p className="text-sm">Inicia la conversación.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const messageSenderId = msg.senderId || msg.sender_id
            const isMe = messageSenderId === user?.id

            return (
              <div
                key={msg.id || index}
                className={`flex w-full items-start gap-3 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar del "Otro" */}
                {!isMe && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-neutral-800 shrink-0 flex items-center justify-center text-gray-500 border border-gray-300 dark:border-white/5">
                    <User size={14} />
                  </div>
                )}

                <div className="flex flex-col gap-1 max-w-[75%] md:max-w-[60%]">
                  <div
                    className={`
                        px-4 py-3 text-sm shadow-sm
                        ${
                          isMe
                            ? "bg-amber-500 text-white dark:text-black rounded-2xl rounded-tr-sm" // Mis mensajes: Ámbar (Texto blanco en Light para contraste, Negro en Dark para estilo)
                            : "bg-white dark:bg-[#191919] text-gray-800 dark:text-[#F5F5F5] rounded-2xl rounded-tl-none border border-gray-200 dark:border-white/5" // Mensajes recibidos: Blanco vs Gris Oscuro
                        }
                    `}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>

                  {/* Timestamp & Status */}
                  <div
                    className={`flex items-center gap-1 text-[10px] text-gray-400 dark:text-white/40 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{formatTime(msg.created_at || msg.timestamp)}</span>
                    {isMe && <CheckCheck size={12} className="text-blue-500 dark:text-blue-400" />}
                  </div>
                </div>

                {/* Avatar Mío */}
                {isMe && (
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-500/20 shrink-0 flex items-center justify-center text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20">
                    <User size={14} />
                  </div>
                )}
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT AREA */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] transition-colors">
        <form
          onSubmit={handleSend}
          className="flex gap-4 items-center bg-gray-100 dark:bg-[#191919] rounded-xl p-2 pr-2 border border-transparent focus-within:border-amber-500/50 dark:focus-within:border-white/20 transition-all"
        >
          {/* Attach Button */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-white/50 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
            title="Adjuntar archivo"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent border-none text-gray-900 dark:text-[#F5F5F5] placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-0 text-sm py-2"
          />

          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <span>Enviar</span>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatRoom