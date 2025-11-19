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
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let result = []
      
      if (user.rol === "transportista") {
        const response = await getRequests()
        result = response.data.requests || [] 
      } 
      else if (user.rol === "empresa") {
        const response = await getOffers()
        result = response.data.offers || []
      }
      else if (user.rol === "operador_dual") {
        const [offersResponse, requestsResponse] = await Promise.all([
          getOffers(), 
          getRequests()
        ])
        
        const offers = offersResponse.data.offers || []
        const requests = requestsResponse.data.requests || []
        
        result = [...offers, ...requests]
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
    // Aseguramos que solo hacemos fetch si el usuario está definido (no null)
    if (user) {
      fetchData()
    } else {
      setLoading(false) // Si el user es null, hemos terminado de cargar sin datos
    }
  }, [user]) // El hook se re-ejecuta cada vez que el objeto 'user' cambia

  return {
    data,
    loading,
    error,
    refetchData: fetchData
  }
}