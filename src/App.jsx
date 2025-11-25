import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar"; // Asegúrate de que este archivo exista
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Lógica de tema (Dark/Light Mode)
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }
  }, [theme]);

  // --- LÓGICA DE NAVEGACIÓN ---
  const showSidebar = isAuthenticated;
  // Solo mostrar Navbar si NO está logueado Y está en la raíz (Home)
  const showNavbar = !isAuthenticated && location.pathname === "/";

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
      {showSidebar && <Sidebar />}
      {showNavbar && <Navbar />}

      {/* 2. CONTENIDO PRINCIPAL (MAIN) */}
      <main
        className={`
          flex-1 relative flex flex-col
          transition-all duration-300
          /* Si hay sidebar (auth), empujamos el contenido a la derecha en desktop. Si no, ancho completo */
          ${showSidebar ? "md:ml-64" : "w-full"}
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
  );
}

export default App;
