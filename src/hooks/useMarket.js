import { useState, useEffect } from "react"
import { getOffers, getRequests } from "../services/market.service"
import { useAuth } from "../context/AuthContext"

/**
 * Hook para gestionar el estado y la carga de datos del Mercado Logístico
 * Carga Ofertas, Solicitudes, o AMBOS (para el rol Dual)
 * @returns {Object} { data, loading, error, refetchData }
 */
export const useMarket = () => {
  const { user } = useAuth()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let result = []
      
      // 1. Lógica para el rol TRANSPORTISTA (busca pedidos/requests)
      if (user.role === "transportista") {
        result = await getRequests()
      } 
      // 2. Lógica para el rol EMPRESA (busca ofertas/offers)
      else if (user.role === "empresa") {
        result = await getOffers()
      }
      // 3. NUEVA LÓGICA para el rol OPERADOR DUAL
      else if (user.role === "operador_dual") {
        // Ejecución paralela de AMBAS llamadas
        const [offersResult, requestsResult] = await Promise.all([
            getOffers(), 
            getRequests()
        ])
        
        // Combinamos las listas en un único array para el dashboard
        // Usamos .data ya que las funciones del servicio lo requieren
        result = [...(offersResult.data || []), ...(requestsResult.data || [])]
      }

      setData(result || [])
    } catch (err) {
      console.error("Error fetching market data:", err)
      setError("Could not load market data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  return {
    data,
    loading,
    error,
    refetchData: fetchData
  }
}