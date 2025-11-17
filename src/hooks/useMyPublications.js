import { useState, useEffect } from "react"
import { getMyPublications } from "../services/market.service" // Asegúrate que el nombre del archivo sea correcto
import { useAuth } from "../context/AuthContext"

export const useMyPublications = () => {
  const { user, loading: authLoading } = useAuth()

  // Inicializamos con la estructura del JSON para evitar errores de 'undefined'
  const [data, setData] = useState({
    total: 0,
    role: "",
    publications: [] 
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cláusula de guardia: Esperar al AuthContext
  if (authLoading) {
    return { 
      data: { total: 0, role: "", publications: [] }, 
      loading: true, 
      error: null,
      refetchData: () => {}
    }
  }

  const fetchData = async () => {
    // Si terminó de cargar auth y no hay usuario, no hacemos fetch
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getMyPublications()
      // Guardamos el objeto completo { total, role, publications }
      setData(result || { total: 0, role: "", publications: [] })
    } catch (err) {
      console.error("Error fetching my publications:", err)
      setError("No se pudieron cargar las publicaciones.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  return { data, loading, error, refetchData: fetchData }
}