import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, X, Pencil, Trash2 } from "lucide-react"

import { usePostThread } from "../../hooks/usePostThread"
import CommentCard from "../../components/community/CommentCard"

const getInitials = (name = "") => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0])
      .join("")
      .toUpperCase() || "?"
  )
}

const PostDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    post,
    comments,
    loading,
    error,
    user,
    submitComment,
    removeLocalComment,
    updateLocalComment,
    updatePostContent
  } = usePostThread(id)

  const [newComment, setNewComment] = useState("")
  const [editingPost, setEditingPost] = useState(false)
  const [editPostData, setEditPostData] = useState({ title: "", content: "" })
  const [deletePostOpen, setDeletePostOpen] = useState(false)

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
        <p className="text-neutral-600 dark:text-neutral-300">Cargando…</p>
      </div>
    )
  }

  if (!post || error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
        <p className="text-neutral-600 dark:text-neutral-300">
          {error || "El post no fue encontrado."}
        </p>
      </div>
    )
  }

  const isOwner = user && user.id === post.userId

  const displayName =
    post.author_name || post.userName || post.user_name || "Usuario"

  const avatarUrl =
    post.author_avatar || post.user_avatar || post.avatar_url || null

  const handleStartEditPost = () => {
    setEditingPost(true)
    setEditPostData({
      title: post.title || "",
      content: post.content || ""
    })
  }

  const handleSavePostEdit = async () => {
    await updatePostContent(editPostData)
    setEditingPost(false)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    await submitComment(newComment)
    setNewComment("")
  }

  const handleDeletePost = async () => {
    setDeletePostOpen(false)
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn min-h-screen">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      {/* Main post */}
      <div className="rounded-xl border p-6 dark:border-neutral-700 dark:bg-neutral-900 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {getInitials(displayName)}
              </div>
            )}

            <div>
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {isOwner && !editingPost && (
            <div className="flex gap-2 animate-fadeIn">
              <button
                onClick={handleStartEditPost}
                className="flex items-center gap-1 px-3 py-1 rounded bg-blue-200 dark:bg-blue-700 text-sm hover:bg-blue-300 dark:hover:bg-blue-600 transition-all"
              >
                <Pencil size={14} /> Editar
              </button>

              <button
                onClick={() => setDeletePostOpen(true)}
                className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-all"
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          )}
        </div>

        {!editingPost ? (
          <>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="whitespace-pre-wrap text-black-200">
              {post.content}
            </div>
          </>
        ) : (
          <div className="space-y-3 animate-fadeInUp">
            <input
              className="w-full px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800"
              value={editPostData.title}
              onChange={e =>
                setEditPostData(prev => ({ ...prev, title: e.target.value }))
              }
            />

            <textarea
              rows={6}
              className="w-full px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800"
              value={editPostData.content}
              onChange={e =>
                setEditPostData(prev => ({ ...prev, content: e.target.value }))
              }
            />

            <div className="flex gap-2 justify-end animate-fadeIn">
              <button
                onClick={() => setEditingPost(false)}
                className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-700"
              >
                Cancelar
              </button>

              <button
                onClick={handleSavePostEdit}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments list */}
      <h2 className="text-xl font-semibold">Comentarios</h2>

      <div className="space-y-4">
        {(comments || []).map(c => (
          <CommentCard
            key={c.id}
            comment={c}
            user={user}
            updateLocalComment={updateLocalComment}
            removeLocalComment={removeLocalComment}
          />
        ))}
      </div>

      {/* New comment */}
      <div className="p-4 rounded-xl border dark:border-neutral-700 dark:bg-neutral-900 animate-fadeIn">
        <textarea
          className="w-full p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200"
          rows={3}
          placeholder={
            user ? "Escribe un comentario…" : "Inicia sesión para comentar"
          }
          disabled={!user}
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />

        <button
          onClick={handleAddComment}
          disabled={!user}
          className={`
            mt-2 px-4 py-2 rounded-lg font-semibold 
            text-white bg-blue-600 
            transition-all duration-300
            ${user ? "opacity-90 hover:opacity-100 hover:scale-[1.03]" : "opacity-40 cursor-not-allowed"}
          `}
        >
          Comentar
        </button>
      </div>

      {/* Delete post modal */}
      {deletePostOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-md animate-fadeInUp">

            <div className="flex justify-between mb-3">
              <h2 className="text-xl font-bold text-red-600">
                Eliminar publicación
              </h2>
              <button onClick={() => setDeletePostOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-sm mb-4">
              ¿Seguro que deseas eliminar este post?
            </p>

            <div className="flex justify-end gap-2 animate-fadeIn">
              <button
                onClick={() => setDeletePostOpen(false)}
                className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-700"
              >
                Cancelar
              </button>

              <button
                onClick={handleDeletePost}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default PostDetailPage
