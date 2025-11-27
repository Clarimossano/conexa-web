import React, { useState } from 'react'
import CommunityHomeTest from './CommunityHomeTest'
import ThreadDetailTest from './ThreadDetailTest'
import { useAuth } from './context/AuthContext'

export default function CommunityTestSuite() {
  // Estado de navegación simple:
  // null = Estamos en el Home
  // 'uuid...' = Estamos viendo el detalle de un post
  const [selectedPostId, setSelectedPostId] = useState(null)
  
  const { user } = useAuth()

  // --- VISTA 1: DETALLE DEL HILO ---
  if (selectedPostId) {
    return (
      <div className="min-h-screen bg-neutral-950 text-gray-100 p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <ThreadDetailTest 
            postId={selectedPostId} 
            onBack={() => setSelectedPostId(null)} 
            onPostDeleted={() => {
              // Si borran el post, volvemos al feed
              setSelectedPostId(null)
              // Nota: CommunityHomeTest recargará los datos al montarse de nuevo
            }}
          />
        </div>
      </div>
    )
  }

  // --- VISTA 2: HOME / FEED ---
  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header de la Suite de Prueba */}
        <header className="mb-8 border-b border-gray-800 pb-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-amber-500 mb-2">Community Module Test</h1>
              <p className="text-gray-400">Entorno de pruebas para Foros, Feeds y CRUD completo.</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-gray-500">Estado de Sesión:</p>
              {user ? (
                <span className="text-green-400 font-bold">Connected as {user.email}</span>
              ) : (
                <span className="text-yellow-500 font-bold">Guest (Read Only)</span>
              )}
            </div>
          </div>

          {!user && (
            <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded text-yellow-200 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>Estás en modo invitado. Inicia sesión para probar <b>Crear Post</b>, <b>Comentar</b> y <b>Editar</b>.</span>
            </div>
          )}
        </header>

        {/* Componente de Home (Feed y Foros) */}
        <CommunityHomeTest 
          onSelectPost={(postId) => setSelectedPostId(postId)} 
        />

      </div>
    </div>
  )
}