import React, { useState } from "react"
import { ArrowBigUp, ArrowBigDown, Pencil, Trash2, X } from "lucide-react"

const getInitials = (name = "") => {
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const CommentCard = ({
  comment,
  user,
  updateLocalComment,
  removeLocalComment
}) => {
  const isOwner = user && user.id === comment.user_id

  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(comment.content)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const avatarUrl = comment.avatar_url ?? null
  const displayName = comment.userName || "User"

  const handleEdit = () => {
    updateLocalComment(comment.id, text)

    // Mark edited locally so UI can show "editado"
    comment._edited = true

    setEditing(false)
  }

  const handleDelete = () => {
    setDeleteOpen(false)
    removeLocalComment(comment.id)
  }

  return (
    <div className="rounded-xl border p-4 dark:border-neutral-700 dark:bg-neutral-900 mb-3 animate-fadeIn">

      {/* Header */}
      <div className="flex justify-between items-start">
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
            <p className="text-sm font-semibold flex items-center gap-2">
              {displayName}

              {/* 🔥 small edited badge */}
              {comment._edited && (
                <span className="text-xs px-2 py-[2px] rounded-full bg-neutral-700 text-neutral-300">
                  editado
                </span>
              )}
            </p>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {!editing && isOwner && (
          <div className="flex gap-2 animate-fadeIn">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 px-3 py-1 rounded bg-blue-200 dark:bg-blue-700 text-sm hover:bg-blue-300 dark:hover:bg-blue-600 transition-all"
            >
              <Pencil size={14} /> Editar
            </button>

            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-all"
            >
              <Trash2 size={14} /> Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {!editing ? (
        <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
      ) : (
        <div className="mt-2 space-y-2 animate-fadeInUp">
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800"
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 rounded bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 transition-all"
            >
              Cancelar
            </button>

            <button
              onClick={handleEdit}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Icons */}
      <div className="flex items-center gap-4 mt-3 text-sm">
        <ArrowBigUp className="cursor-pointer hover:text-blue-400 transition-all" />
        <ArrowBigDown className="cursor-pointer hover:text-red-400 transition-all" />
      </div>

      {/* Delete modal */}
      {deleteOpen && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-40 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md animate-fadeInUp">

            <div className="flex justify-between mb-3">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                Eliminar comentario
              </h2>

              <button onClick={() => setDeleteOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-sm mb-4">
              ¿Seguro que deseas eliminar este comentario?
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-700"
                onClick={() => setDeleteOpen(false)}
              >
                Cancelar
              </button>

              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
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

export default CommentCard
