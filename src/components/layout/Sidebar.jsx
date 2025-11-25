import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  LayoutDashboard,
  Package,
  Search,
  MessageSquare,
  Users,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react"

const Sidebar = () => {
  const { user, signout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false) // Menú móvil
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false) // Modal Logout

  // Estado para el tema (inicializado leyendo el DOM)
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  )

  // Sincronizar estado si cambia externamente (opcional pero recomendado)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"))
        }
      })
    })
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    } else {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    }
  }

  const handleLogoutConfirm = () => {
    signout()
    setIsLogoutModalOpen(false)
    setIsOpen(false) // Cerrar menú móvil también si está abierto
    navigate("/")
  }

  // Función para saber si el link está activo
  const isActive = (path) => {
    if (path === "/marketplace") return location.pathname === "/marketplace"
    return location.pathname.startsWith(path)
  }

  // Clases dinámicas
  const getLinkClass = (path) => `
    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
    ${
      isActive(path)
        ? "bg-amber-500/10 text-amber-500 font-bold"
        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
    }
  `

  const iconClass = (path) => `
    w-5 h-5 transition-colors
    ${
      isActive(path)
        ? "text-amber-500"
        : "text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
    }
  `

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-white/10">
      {/* 1. LOGO & USUARIO */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div
          className="h-10 w-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-white/10"
          style={{
            backgroundImage: `url("${
              user?.profileImageUrl || "https://placehold.co/100"
            }")`,
          }}
        />
        <div className="flex flex-col overflow-hidden">
          <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {user?.enterpriseName || "CONEXA Logistics"}
          </h1>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* 2. NAVEGACIÓN PRINCIPAL */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">
          Menu
        </p>

        <Link to="/marketplace" className={getLinkClass("/marketplace")}>
          <LayoutDashboard className={iconClass("/marketplace")} />
          <span className="text-sm">Marketplace</span>
        </Link>

        <Link
          to="/marketplace/my-publications"
          className={getLinkClass("/marketplace/my-publications")}
        >
          <Package className={iconClass("/marketplace/my-publications")} />
          <span className="text-sm">Mis Publicaciones</span>
        </Link>

        <Link to="/messages" className={getLinkClass("/messages")}>
          <MessageSquare className={iconClass("/messages")} />
          <span className="text-sm">Mensajes</span>
        </Link>

        <Link to="/community" className={getLinkClass("/community")}>
          <Users className={iconClass("/community")} />
          <span className="text-sm">Portal Comunitario</span>
        </Link>

        <Link to="/profile" className={getLinkClass("/profile")}>
          <User className={iconClass("/profile")} />
          <span className="text-sm">Perfil</span>
        </Link>
      </nav>

      {/* 3. FOOTER (Ajustes / Tema / Salir) */}
      <div className="mt-auto flex flex-col gap-1 border-t border-gray-200 dark:border-white/10 pt-4">
        <Link to="/settings" className={getLinkClass("/settings")}>
          <Settings className={iconClass("/settings")} />
          <span className="text-sm">Ajustes</span>
        </Link>

        {/* BOTÓN TOGGLE TEMA */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors w-full text-left group"
        >
          {isDark ? (
            <Sun className="w-5 h-5 group-hover:text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 group-hover:text-indigo-500" />
          )}
          <span className="text-sm font-medium">
            {isDark ? "Modo Claro" : "Modo Oscuro"}
          </span>
        </button>

        <button
          onClick={() => setIsLogoutModalOpen(true)} // Abrir modal en lugar de salir directo
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full text-left group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-500" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* MOBILE HEADER (Solo visible en móvil) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 z-50">
        <span className="font-bold text-lg text-gray-900 dark:text-white">
          CONEXA
        </span>
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-600 dark:text-gray-300"
        >
          <Menu />
        </button>
      </div>

      {/* SIDEBAR DESKTOP (Fijo a la izquierda) */}
      <aside className="hidden md:flex w-64 h-screen flex-col fixed left-0 top-0 bottom-0 z-40">
        <SidebarContent />
      </aside>

      {/* SIDEBAR MOBILE (Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#111] shadow-xl">
            <SidebarContent />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL DE LOGOUT --- */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-gray-200 dark:border-white/10 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                <LogOut size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Cerrar Sesión
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                ¿Estás seguro de que quieres salir de tu cuenta?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
