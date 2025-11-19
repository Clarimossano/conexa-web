import apiClient from "./apiClient"

/**
 * Gets all published transport offers
 * @returns {Promise<Array>} An array of offer objects
 */
export const getOffers = async () => {
  return apiClient.get("/offers")
}

/**
 * Creates a new transport offer
 * @param {Object} offerData - The offer form data
 * @returns {Promise<Object>} The newly created offer
 */
export const createOffer = async (offerData) => {
  return apiClient.post("/offers", offerData)
}

/**
 * Gets all published load requests
 * @returns {Promise<Array>} An array of request objects
 */
export const getRequests = async () => {
  return apiClient.get("/requests")
}

/**
 * Creates a new load request
 * @param {Object} requestData - The request form data
 * @returns {Promise<Object>} The newly created request
 */
export const createRequest = async (requestData) => {
  return apiClient.post("/requests", requestData)
}

/**
 * Obtiene las publicaciones propias (Ofertas o Solicitudes)
 * El BE maneja la lógica de rol internamente:
 * - Transportista: Retorna solo Offers.
 * - Empresa: Retorna solo Requests.
 * - Operador Dual: Retorna ambos.
 */
export const getMyPublications = async () => {
  // Asumimos que la API retorna un array o un objeto { offers: [], requests: [] }
  const response = await apiClient.get("/publications/mine")
  return response.data
}

export const getMyOffers = async () => {
  const response = await apiClient.get("/offers/mine")
  return response.data
}

export const getMyRequests = async () => {
  const response = await apiClient.get("/requests/mine")
  return response.data
}