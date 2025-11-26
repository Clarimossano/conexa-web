import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle, ChevronDown } from "lucide-react"
import { useMarket } from "../../hooks/useMarket"
import { useAuth } from "../../context/AuthContext"
import MercadoList from "./MercadoList"
import FilterDropdown from "../../components/common/FilterDropdown"
import MarketDetailSidebar from "../../components/market/MarketDetailSidebar"

const DashboardPage = () => {
  const { user } = useAuth()
  const { data, loading, error, refetchData } = useMarket()
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)

  const userRol = user?.rol

  // Lógica de filtrado
  const filteredData = data.filter((item) => {
    if (!item) return false
    if (viewMode === "all") return true
    if (viewMode === "offers") return !!item.vehicle_type
    if (viewMode === "requests") return !!item.required_vehicle_type
    return true
  })

  // 1. CORRECCIÓN: Botón "Nueva Publicación" (Azul - BG-BLUE-600)
  const newPublicationButtonClass = `
    flex w-full md:w-auto min-w-[84px] max-w-[480px]
    cursor-pointer items-center justify-center gap-2
    overflow-hidden rounded-lg h-12 px-5
    bg-amber-500 dark:bg-amber-500 
    text-white dark:text-black 
    font-bold text-base tracking-[0.015em]
    hover:bg-amber-700 dark:hover:bg-amber-500 
    transition-all
  `

  const roleActiveBg = "bg-amber-500 text-white shadow-md"

  return (
    // Fondo principal (bg-white por defecto)
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] font-display flex flex-col">
      {/* RENDERIZADO CONDICIONAL DEL SIDEBAR */}
      {selectedItem && (
        <MarketDetailSidebar 
            item={selectedItem} 
            isOpen={!!selectedItem} 
            onClose={() => setSelectedItem(null)} 
        />
      )}
      <div className="flex-1 px-4 sm:px-8 md:px-12 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* HEADING Y BOTÓN DE ACCIÓN */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Publicaciones Recientes
              </h1>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Explora y gestiona las ofertas de transporte y solicitudes de
                carga disponibles.
              </p>
            </div>

            {/* BOTÓN NUEVA PUBLICACIÓN (USANDO BG-BLUE-600) */}
            <button
              onClick={() => navigate("/marketplace/create")}
              className={newPublicationButtonClass}
            >
              <PlusCircle size={18} />
              <span>Nueva Publicación</span>
            </button>
          </div>

          {/* ACTION BAR (Filtros) */}
          <div className="flex flex-col bg-[#F9FAFB] dark:bg-neutral-900 rounded py-3 justify-between md:flex-row gap-4 items-center mb-4 px-4 md:px-4">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar flex-1">
              <FilterDropdown text="Filtrar por Ruta" />
              <FilterDropdown text="Filtrar por Fecha" />
              <FilterDropdown text="Tipo de Carga" />

              {/* Selector Dual (Si aplica) */}
              {userRol === "operador_dual" && (
                <div className="flex bg-[#F9FAFB] dark:bg-neutral-900 p-1 rounded-lg ml-2 border border-gray-300 dark:border-gray-700">
                  {["all", "offers", "requests"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                        viewMode === mode
                          ? roleActiveBg // Estilo azul activo
                          : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {mode === "all"
                        ? "Todo"
                        : mode === "offers"
                        ? "Ofertas"
                        : "Demandas"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* LISTADO */}
          <MercadoList
            data={filteredData}
            loading={loading}
            error={error}
            refetchData={refetchData}
            onViewDetail={(item) => setSelectedItem(item)}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
