import React from "react"
import { MapPin, Calendar, Package, Truck } from "lucide-react"

const MarketCard = ({ item, onViewDetail }) => {
  const isOffer = !!item.vehicle_type

  // Mapeo de datos
  const origin = item.origin
  const destination = item.destination

  const dateRaw = item.available_date || item.ready_date
  const dateFormatted = dateRaw
    ? new Date(dateRaw).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "A CONFIRMAR"

  const cargoInfo = item.cargo_type
    ? item.cargo_type.charAt(0).toUpperCase() + item.cargo_type.slice(1)
    : "Carga General"

  const mapImageUrl = item.mapUrl // Puede ser null/undefined

  // --- ESTILOS Y COLORES ---
  const typeLabel = isOffer ? "OFERTA DE TRANSPORTE" : "SOLICITUD DE CARGA"

  const colorClasses = isOffer
    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"

  return (
    <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-white/10 p-3 md:p-6 flex flex-row gap-3 md:gap-6 shadow-sm hover:shadow-md transition-all duration-200 group h-full">
      {/* Columna Izquierda: Información */}
      <div className="flex-1 flex flex-col justify-between gap-2 md:gap-4">
        <div>
          {/* BADGE TÍTULO */}
          <div className="mb-1.5 md:mb-3">
            <span
              className={`px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-md text-[8px] md:text-[10px] font-bold uppercase tracking-wider border ${colorClasses}`}
            >
              {typeLabel}
            </span>
          </div>

          <h3 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white leading-tight mb-0.5 md:mb-1 group-hover:text-primary transition-colors">
            {origin} <span className="text-gray-400 mx-0.5 md:mx-1">➝</span> {destination}
          </h3>

          <div className="space-y-1 md:space-y-2 mt-1 md:mt-2">
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
              <Package className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
              <span>
                {cargoInfo} {item.weight_kg ? `• ${item.weight_kg} kg` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
              <span>{dateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Botón Ver detalle (Llama a la función del padre) */}
        <button
          onClick={() => onViewDetail(item)} // <--- AQUÍ SE CONECTA
          className="cursor-pointer bg-[#005A9C] hover:bg-[#004a80] dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-black text-white text-xs md:text-sm font-bold py-1.5 md:py-2.5 px-3 md:px-6 rounded-lg transition-all w-fit shadow-sm active:scale-95"
        >
          Ver detalle
        </button>
      </div>

      {/* Columna Derecha: Mapa O Fallback Visual - Reducido en móvil */}
      <div className="w-20 md:w-48 h-20 md:h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-white/5 relative">
        {mapImageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${mapImageUrl}')` }}
            title={`Ruta de ${origin} a ${destination}`}
          >
            <div className="w-full h-full bg-black/5 dark:bg-black/20"></div>
          </div>
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-1 md:p-4 text-center ${colorClasses} border-0`}
          >
            {isOffer ? (
              <Truck className="w-3.5 h-3.5 md:w-7 md:h-7 mb-0.5 md:mb-1 opacity-80" />
            ) : (
              <Package className="w-3.5 h-3.5 md:w-7 md:h-7 mb-0.5 md:mb-1 opacity-80" />
            )}
            <span className="text-[8px] md:text-sm font-black uppercase tracking-widest opacity-90 leading-none">
              {isOffer ? "OFERTA" : "PEDIDO"}
            </span>
            <span className="text-[6px] md:text-[10px] font-bold opacity-70 mt-0.5 md:mt-1 uppercase tracking-wide leading-tight">
              {isOffer ? "Transporte" : "Carga"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketCard
