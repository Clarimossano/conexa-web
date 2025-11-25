import React from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { List, AlertTriangle } from 'lucide-react' // Iconos nuevos

// Importación de Secciones Modulares (Asumimos que las crearás/adaptarás)
import ContactSection from "./profile/components/ContactSection"
import AccountSection from "./profile/components/AccountSection"
import PublicProfileSection from "./profile/components/PublicProfileSection"
import PasswordSection from "./profile/components/PasswordSection"

function ProfilePage() {
  const { user, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const handleDeleteAccount = async () => {
    if (confirm("¿Estás seguro de eliminar tu cuenta permanentemente?")) {
        await deleteAccount()
        navigate("/login")
    }
  }

  // Datos Mock para el Dashboard (Hasta que tengas endpoint real)
  const stats = [
    { label: "Publicaciones Hechas", value: 128 },
    { label: "Concretadas", value: 94 },
    { label: "En Tránsito", value: 12 },
  ]

  return (
    <main className="animate-fadeIn flex flex-1 justify-center py-10 px-4 md:px-10 lg:px-20 xl:px-40 bg-background-light dark:bg-background-dark min-h-screen font-display text-gray-900 dark:text-white">
      
      <div className="flex flex-col w-full max-w-4xl gap-8">

        {/* 1. HEADER */}
        <div className="flex flex-wrap justify-between gap-4 py-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-[#F5F5F5]">
              Perfil de Usuario
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal">
              Gestiona tu cuenta y detalles de la empresa
            </p>
          </div>
        </div>

        {/* 2. DASHBOARD DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col gap-2 p-4 bg-white dark:bg-[#191919] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
              <p className="text-gray-900 dark:text-[#F5F5F5] text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 4. SECCIONES DE DATOS (MODULARES) */}
        
        {/* Account Info (Solo lectura + Email) */}
        <AccountSection user={user} />

        {/* Contact Details (Editable) */}
        <ContactSection />

        {/* Public Profile (Editable - Imagen/Desc) */}
        <PublicProfileSection />

        {/* Password Change */}
        <PasswordSection />

        {/* 5. ZONA DE PELIGRO */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-[#191919] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
            <button 
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 w-full sm:w-auto text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium text-left transition-colors"
            >
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Eliminar Cuenta
            </button>
        </div>

      </div>
    </main>
  )
}

export default ProfilePage