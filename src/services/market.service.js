import apiClient from "./apiClient"

/**
 * Gets all published transport offers
 * @param {Object} filters - Optional filters { origin, destination, cargoType, vehicleType, availableDate }
 * @returns {Promise<Array>} An array of offer objects
 */
export const getOffers = async (filters = {}) => {
  return apiClient.get("/offers", { params: filters })
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
 * @param {Object} filters - Optional filters { origin, destination, cargoType, vehicleType, availableDate }
 * @returns {Promise<Array>} An array of request objects
 */
export const getRequests = async (filters = {}) => {
  return apiClient.get("/requests", { params: filters })
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
 * Obtiene un listing individual por ID (Offer o Request).
 */
export const getListingById = async (type, id) => {
  const endpoint = type === 'offer' ? `/offers/${id}` : `/requests/${id}`
  const response = await apiClient.get(endpoint)
  return response.data
}

/**
 * Actualiza el contenido (destino, peso, etc.) de un listing.
 */
export const updateListingContent = async (type, id, data) => {
  const endpoint = type === 'offer' ? `/offers/${id}` : `/requests/${id}`
  return apiClient.patch(endpoint, data)
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

/**
 * Obtiene el catálogo maestro de documentos requeridos.
 * Endpoint: GET /api/documents
 */
export const getDocumentTypes = async () => {
  const response = await apiClient.get("/documents")
  return response.data
}

/**
 * Actualiza la lista de documentos requeridos para una Oferta existente.
 * Endpoint: PUT /api/offers/:id/documents
 * @param {string} id - UUID de la oferta
 * @param {Array<string>} documentIds - Array de UUIDs de documentos
 */
export const updateOfferDocuments = async (id, documentIds) => {
  const payload = { requiredDocuments: documentIds }
  return apiClient.put(`/offers/${id}/documents`, payload)
}

/**
 * Actualiza la lista de documentos requeridos para un Pedido existente.
 * Endpoint: PUT /api/requests/:id/documents
 * @param {string} id - UUID del pedido
 * @param {Array<string>} documentIds - Array de UUIDs de documentos
 */
export const updateRequestDocuments = async (id, documentIds) => {
  const payload = { requiredDocuments: documentIds }
  return apiClient.put(`/requests/${id}/documents`, payload)
}

/**
 * Elimina permanentemente una oferta de transporte.
 * Endpoint: DELETE /api/offers/:id
 * @param {string} id - UUID de la oferta
 */
export const deleteOffer = async (id) => {
  return apiClient.delete(`/offers/${id}`)
}

/**
 * Elimina permanentemente un pedido de carga.
 * Endpoint: DELETE /api/requests/:id
 * @param {string} id - UUID del pedido
 */
export const deleteRequest = async (id) => {
  return apiClient.delete(`/requests/${id}`)
}