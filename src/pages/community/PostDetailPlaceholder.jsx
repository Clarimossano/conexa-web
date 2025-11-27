import { useEffect, useState } from "react";
import { usePostThread } from '../../hooks/usePostThread'
import { useParams } from "react-router-dom";

const CommentItem = ({ comment, user, removeHandler, updateHandler }) => {
  return (
    <div className="p-3 rounded-lg border border-neutral-300 dark:border-neutral-700">
      
      {/* Contenido */}
      <p className="text-neutral-800 dark:text-neutral-200">
        {comment.content}
      </p>

      {/* Autor y fecha */}
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
        👤 {comment.author?.name || "Anónimo"} —{" "}
        {new Date(comment.created_at).toLocaleString()}
      </p>

    </div>
  );
}

const PostDetailPlaceholder = () => {
  const { id } = useParams()

  const { 
  post,
  comments,
  loading,
  user,
  error
  } = usePostThread(id)

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>
  if (!post) return <p>Post no encontrado</p>

  return (
    <div className="p-6 space-y-4 animate-fadeIn">

      {/* ---------- TÍTULO Y CONTENIDO ---------- */}
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {post.title}
      </h1>

      <p className="text-neutral-700 dark:text-neutral-300">
        {post.content || post.description}
      </p>

      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Autor: {post.author?.name || "Anónimo"}
      </p>

      {/* ---------- COMENTARIOS ---------- */}
      <h2 className="text-xl font-semibold mt-6 text-neutral-900 dark:text-neutral-100">
        Comentarios
      </h2>
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
            Comentarios ({comments.length})
          </h3>

          {comments.length === 0 && (
            <p className="text-neutral-500 italic">Aún no hay comentarios.</p>
          )}

          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              removeHandler={() => {}}
              updateHandler={() => {}}
            />
          ))}
        </div>
    </div>
  );
};

export default PostDetailPlaceholder;