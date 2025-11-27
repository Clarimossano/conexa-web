import React, { useState, useEffect } from 'react'
import { useCommunityHome } from './hooks/useCommunityHome'
import { useCommunityActions } from './hooks/useCommunityActions'
import { getPosts } from './services/community.service'
import { useAuth } from './context/AuthContext'

const CommunityHomeTest = ({ onSelectPost }) => {
  const { user } = useAuth()
  
  // 1. Hooks de Carga Inicial
  const { forums, feed, loading, error, refetch: refetchHome } = useCommunityHome()
  
  // 2. Hooks de Acción (Crear Post)
  const { submitPost, isSubmitting } = useCommunityActions()

  // Estados locales para la UI de prueba
  const [displayedPosts, setDisplayedPosts] = useState([])
  const [selectedForumId, setSelectedForumId] = useState('general') // 'general' o UUID
  const [newPost, setNewPost] = useState({ title: '', content: '' })

  // Sincronizar el feed inicial cuando termina de cargar useCommunityHome
  useEffect(() => {
    if (feed.length > 0 && selectedForumId === 'general') {
      setDisplayedPosts(feed)
    }
  }, [feed, selectedForumId])

  // --- HANDLER: CAMBIAR DE FORO (FILTRO) ---
  const handleSelectForum = async (forumId) => {
    setSelectedForumId(forumId)
    try {
      // Si es general, pedimos topicId: 'general' (o null según tu backend)
      const filters = { topicId: forumId === 'general' ? 'general' : forumId }
      const posts = await getPosts(filters)
      setDisplayedPosts(posts || [])
    } catch (err) {
      console.error("Error filtrando posts:", err)
      alert("Error al cargar posts del foro")
    }
  }

  // --- HANDLER: CREAR POST ---
  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.title || !newPost.content) return

    try {
      await submitPost({
        title: newPost.title,
        content: newPost.content,
        // Si estamos en 'general', topicId es null. Si no, es el ID del foro.
        topicId: selectedForumId === 'general' ? null : selectedForumId
      })
      
      // Limpiar form
      setNewPost({ title: '', content: '' })
      
      // Recargar la lista actual
      await refetchHome()
      alert("✅ Post creado exitosamente")
    } catch {
      alert("❌ Error al crear post")
    }
  }

  if (loading) return <div className="p-10 text-center">Cargando comunidad...</div>
  if (error) return <div className="p-10 text-red-500">Error: {error}</div>

  return (
    <div className="flex gap-6 h-full">
      
      {/* IZQUIERDA: LISTA DE FOROS */}
      <div className="w-1/4 bg-neutral-900 p-4 rounded-xl border border-white/10 h-fit">
        <h2 className="text-xl font-bold mb-4 text-cyan-400">Foros</h2>
        <div className="space-y-2">
          <button
            onClick={() => handleSelectForum('general')}
            className={`w-full text-left p-2 rounded text-sm transition-colors ${
              selectedForumId === 'general' ? 'bg-cyan-700 text-white' : 'hover:bg-white/5 text-gray-300'
            }`}
          >
            # Feed General
          </button>
          {forums.map(forum => (
            <button
              key={forum.id}
              onClick={() => handleSelectForum(forum.id)}
              className={`w-full text-left p-2 rounded text-sm transition-colors flex justify-between ${
                selectedForumId === forum.id ? 'bg-cyan-700 text-white' : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <span># {forum.title}</span>
              <span className="text-xs opacity-50">({forum.postCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* DERECHA: FEED DE POSTS Y CREACIÓN */}
      <div className="w-3/4 flex flex-col gap-6">
        
        {/* 1. FORMULARIO DE CREACIÓN (Solo si logueado) */}
        {user && (
          <div className="p-4 bg-amber-900/20 border border-amber-700/50 rounded-xl">
            <h3 className="text-sm font-bold text-amber-500 mb-2">
              Crear Post en: {selectedForumId === 'general' ? 'General' : 'Foro Seleccionado'}
            </h3>
            <form onSubmit={handleCreatePost} className="flex flex-col gap-2">
              <input 
                className="bg-black/20 border border-amber-700/30 rounded p-2 text-white text-sm focus:border-amber-500 outline-none"
                placeholder="Título del Post"
                value={newPost.title}
                onChange={e => setNewPost({...newPost, title: e.target.value})}
              />
              <textarea 
                className="bg-black/20 border border-amber-700/30 rounded p-2 text-white text-sm focus:border-amber-500 outline-none resize-none"
                rows="2"
                placeholder="¿Qué quieres compartir?"
                value={newPost.content}
                onChange={e => setNewPost({...newPost, content: e.target.value})}
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="self-end bg-amber-600 hover:bg-amber-500 text-white px-4 py-1 rounded text-sm font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            </form>
          </div>
        )}

        {/* 2. LISTA DE POSTS */}
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-white">
            {selectedForumId === 'general' ? 'Novedades Recientes' : 'Discusión del Foro'}
          </h2>
          
          {displayedPosts.length === 0 ? (
            <p className="text-gray-500 italic">No hay publicaciones en este foro aún.</p>
          ) : (
            displayedPosts.map(post => (
              <div 
                key={post.id} 
                onClick={() => onSelectPost(post.id)} // Navegación al detalle
                className="p-4 bg-neutral-800 hover:bg-neutral-700 border border-white/5 hover:border-cyan-500/50 rounded-lg cursor-pointer transition-all group"
              >
                <h3 className="text-lg font-bold text-gray-200 group-hover:text-cyan-400 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{post.content}</p>
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span>👤 {post.author?.name || 'Anónimo'}</span>
                  <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                  <span>💬 {post.commentCount || 0} comentarios</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CommunityHomeTest