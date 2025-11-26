import { useState, useEffect, useCallback } from "react"
import { getOffers, getRequests } from "../services/market.service"
import { useAuth } from "../context/AuthContext"

/**
 * Hook para gestionar el estado y la carga de datos del Mercado Logístico
 * Carga Ofertas, Solicitudes, o AMBOS (para el rol Dual)
 * @returns {Object} { data, loading, error, refetchData }
 */
export const useMarket = () => {
  const { user, loading: authLoading } = useAuth()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (filters = {}) => {
    // Si no hay usuario (invitado o no cargado), salimos.
    if (!user) {
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      let result = []
      
      // Limpieza de filtros: Eliminar claves con valores vacíos/undefined
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      )

      // Lógica de fetching por rol con filtros
      if (user.rol === "transportista") {
        const response = await getRequests(activeFilters)
        result = response.data.requests || [] 
      } 
      else if (user.rol === "empresa") {
        const response = await getOffers(activeFilters)
        result = response.data.offers || []
      }
      else if (user.rol === "operador_dual") {
        // Para dual, enviamos los filtros a ambos endpoints.
        // El backend se encarga de retornar vacío si el filtro no coincide con nada en esa tabla.
        const [offersResponse, requestsResponse] = await Promise.all([
          getOffers(activeFilters), 
          getRequests(activeFilters)
        ])
        
        const offers = offersResponse.data.offers || []
        const requests = requestsResponse.data.requests || []
        
        result = [...offers, ...requests]
      }

      setData(result || [])
    } catch (err) {
      console.error("Error fetching market data:", err)
      setError("No se pudieron cargar los datos del mercado.")
    } finally {
      setLoading(false)
    }
  }, [user])

  if (authLoading) {
    return { data: [], loading: true, error: null, refetchData: fetchData }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetchData: fetchData
  }
}