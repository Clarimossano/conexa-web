import { Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import Sidebar from "./components/layout/Sidebar"
import Navbar from "./components/layout/Navbar" // Asegúrate de que este archivo exista
import { useAuth } from "./context/AuthContext"

function App() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Lógica de tema (Dark/Light Mode)
  const [theme] = useState(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
    return "light"
  })

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark")
    } else {
      document.querySelector("html").classList.remove("dark")
    }
  }, [theme])

  // --- LÓGICA DE NAVEGACIÓN ---
  const showSidebar = isAuthenticated
  const showNavbar = !isAuthenticated && location.pathname === "/"

  const mainContentMarginClass = isSidebarCollapsed ? "md:ml-20" : "md:ml-64"

  return (
    // CONTENEDOR PRINCIPAL
    // Cambiamos la dirección de flex según el tipo de navegación
    <div
      className={`
        flex min-h-screen bg-gray-50 dark:bg-black font-display text-gray-900 dark:text-white transition-colors duration-300
        ${showSidebar ? "flex-row" : "flex-col"} 
      `}
    >
      {/* 1. NAVEGACIÓN CONDICIONAL */}
      {showSidebar && (
        <Sidebar 
          isCollapsed={isSidebarCollapsed} // Pasar estado actual
          setIsCollapsed={setIsSidebarCollapsed} // Pasar función de toggle
        />
      )}
      {showNavbar && <Navbar />}

      {/* 2. CONTENIDO PRINCIPAL (MAIN) */}
      <main
        className={`
          flex-1 relative flex flex-col
          transition-all duration-300 ease-in-out
          /* Si hay sidebar (auth), empujamos el contenido a la derecha en desktop. Si no, ancho completo */
          ${showSidebar ? mainContentMarginClass : "w-full"}
        `}
      >
        {/*
           Contenedor Interno:
           - pt-16: Solo si hay Sidebar y es móvil (para el header del menú).
           - Si es Navbar o Login, no agregamos padding forzado (Navbar suele ser sticky).
        */}
        <div
          className={`flex-1 flex flex-col min-h-screen ${
            showSidebar ? "pt-16 md:pt-0" : ""
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default App
