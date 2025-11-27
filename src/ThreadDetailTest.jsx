import React, { useState, useEffect } from 'react'
import { usePostThread } from './hooks/usePostThread'
import { useCommunityActions } from './hooks/useCommunityActions'
import { ArrowLeft, MessageSquare, Trash2, Edit2, Save, X, Send } from 'lucide-react'

// =================================================================
// 1. SUB-COMPONENTE: ITEM DE COMENTARIO (Maneja su propia edición)
// =================================================================
const CommentItem = ({ comment, user, removeHandler, updateHandler }) => {
  const isOwner = user && user.id === comment.user_id
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  const handleSave = async () => {
    if (editContent.trim() === comment.content) return setIsEditing(false)
    try {
      await updateHandler(comment.id, editContent)
      setIsEditing(false)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex gap-3 p-3 bg-white/5 rounded-lg border border-white/10 mb-3">
      {/* Avatar Placeholder */}
      <div className="w-8 h-8 rounded-full gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center text-xs font-bold text-white shrink-0">
        {comment.userName?.charAt(0) || 'U'}
      </div>

      <div className="grow min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-xs text-gray-400 mb-1">
            <span className="font-bold text-gray-300">{comment.userName || 'Anónimo'}</span>
            <span className="mx-1">•</span>
            {new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            {comment.updated_at && <span className="ml-2 text-xs text-cyan-500">(editado)</span>}
          </p>
          
          {/* Acciones de Comentario (Dueño) */}
          {isOwner && !isEditing && (
            <div className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
              <button onClick={() => setIsEditing(true)} className="text-cyan-400 hover:text-white"><Edit2 size={14}/></button>
              <button onClick={() => removeHandler(comment.id)} className="text-red-400 hover:text-white"><Trash2 size={14}/></button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-black/30 border border-cyan-500/50 rounded p-2 text-sm text-white outline-none resize-none"
              rows={2}
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button onClick={() => setIsEditing(false)} className="text-xs text-gray-400 hover:text-white">Cancelar</button>
              <button onClick={handleSave} className="text-xs bg-cyan-600 px-3 py-1 rounded text-white">Guardar</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-200 whitespace-pre-wrap">{comment.content}</p>
        )}
      </div>
    </div>
  )
}

// =================================================================
// 2. COMPONENTE PRINCIPAL: DETALLE DEL HILO
// =================================================================
const ThreadDetailTest = ({ postId, onBack }) => {
  // Hooks
  const { 
    post, comments, loading, error, user, 
    submitComment, removeLocalComment, updateLocalComment, updatePostContent 
  } = usePostThread(postId)
  
  const { removePost } = useCommunityActions()

  // Estados locales
  const [newComment, setNewComment] = useState("")
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [postEdits, setPostEdits] = useState({ title: '', content: '' })

  // Sincronizar formulario de edición cuando carga el post
  useEffect(() => {
    if (post) setPostEdits({ title: post.title, content: post.content })
  }, [post])

  // --- HANDLERS ---
  const handleCreateComment = async () => {
    if (!newComment.trim()) return
    await submitComment(newComment)
    setNewComment("")
  }

  const handleUpdatePost = async () => {
    try {
      await updatePostContent(postEdits)
      setIsEditingPost(false)
    } catch {
      alert("Error al actualizar el post")
    }
  }

  const handleDeletePost = async () => {
    if (confirm("¿Estás seguro de eliminar este hilo completo?")) {
      try {
        await removePost(post.id)
        onBack() // Volver al home si se borra
      } catch {
        alert("Error al eliminar post")
      }
    }
  }

  // --- RENDERS ---
  if (loading) return <div className="p-10 text-center text-gray-400 animate-pulse">Cargando hilo...</div>
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>
  if (!post) return <div className="p-10 text-center text-gray-500">Post no encontrado.</div>

  const isPostOwner = user && user.id === post.userId // Asegúrate que la propiedad del ID sea correcta (userId o user_id según tu API)

  return (
    <div className="flex flex-col h-full">
      
      {/* NAV HEADER */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors mb-6 w-fit"
      >
        <ArrowLeft size={20} /> Volver al Feed
      </button>

      {/* AREA DEL POST (MAIN CONTENT) */}
      <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl mb-8 relative group">
        
        {isEditingPost ? (
          <div className="space-y-4 animate-fadeIn">
            <input 
              value={postEdits.title}
              onChange={(e) => setPostEdits(prev => ({...prev, title: e.target.value}))}
              className="w-full bg-black/40 border border-amber-500/50 p-2 text-2xl font-bold text-white rounded outline-none"
            />
            <textarea 
              value={postEdits.content}
              onChange={(e) => setPostEdits(prev => ({...prev, content: e.target.value}))}
              className="w-full bg-black/40 border border-white/20 p-3 text-base text-gray-300 rounded outline-none min-h-[150px]"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsEditingPost(false)} className="px-4 py-2 rounded border border-white/10 text-gray-400 hover:text-white">Cancelar</button>
              <button onClick={handleUpdatePost} className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-500 flex gap-2 items-center"><Save size={16}/> Guardar Cambios</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-black text-white leading-tight">{post.title}</h1>
              {isPostOwner && (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditingPost(true)} className="p-2 bg-white/5 rounded hover:bg-cyan-900/50 text-cyan-400 transition-colors" title="Editar Post"><Edit2 size={18}/></button>
                  <button onClick={handleDeletePost} className="p-2 bg-white/5 rounded hover:bg-red-900/50 text-red-400 transition-colors" title="Eliminar Hilo"><Trash2 size={18}/></button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 border-b border-white/5 pb-4">
              <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded font-bold uppercase tracking-wider">{post.topic?.title || 'General'}</span>
              <span>•</span>
              <span>Publicado por <strong className="text-gray-400">{post.userName}</strong></span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </>
        )}
      </div>

      {/* AREA DE COMENTARIOS */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
          <MessageSquare size={20}/> Comentarios ({comments.length})
        </h3>

        {/* INPUT PARA COMENTAR */}
        <div className="flex gap-3 items-start bg-neutral-800/50 p-4 rounded-lg border border-white/5 mb-4">
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "¿Qué opinas de este tema?" : "Inicia sesión para unirte a la conversación."}
            disabled={!user}
            className="grow bg-transparent text-white placeholder:text-gray-600 outline-none resize-none mt-1 text-sm h-12 focus:h-24 transition-all"
          />
          <button 
            onClick={handleCreateComment}
            disabled={!user || !newComment.trim()}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-20 disabled:cursor-not-allowed text-black p-3 rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>

        {/* LISTADO */}
        <div className="space-y-1">
          {comments.length === 0 && <p className="text-gray-600 italic py-4">Aún no hay comentarios. ¡Sé el primero!</p>}
          {comments.map(c => (
            <CommentItem 
              key={c.id} 
              comment={c} 
              user={user}
              removeHandler={removeLocalComment}
              updateHandler={updateLocalComment}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThreadDetailTest