import React from 'react'
import { Loader2, AlertTriangle, Search } from 'lucide-react'
import MarketCard from '../../components/market/MarketCard'
import ListFooterMessage from '../../components/common/ListFooterMessage'

const MercadoList = ({ data, loading, error, refetchData, onViewDetail }) => {
  
  // Estados de Carga y Error (Igual que antes)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-white/10">
        <Loader2 className="animate-spin text-primary mr-3" size={32} />
        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">Cargando publicaciones...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
        <AlertTriangle className="mb-2 text-red-500" size={32} />
        <p className="text-base text-red-700 dark:text-red-300 mb-4">{error.message || 'Error al cargar datos.'}</p>
        <button onClick={refetchData} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">
          Reintentar
        </button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <ListFooterMessage refetchData={refetchData} />
  }

  // LAYOUT DE GRID AJUSTADO AL DISEÑO (1 col móvil, 2 col desktop grande)
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-6 pb-10">
      {data.map((item) => (
        <MarketCard key={item.id} item={item} onViewDetail={onViewDetail} />
      ))}
    </div>
  )
}

export default MercadoList