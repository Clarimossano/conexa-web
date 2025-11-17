import apiClient from "./apiClient"

/**
 * Registers a new user
 * @param {object} userData - User data (email, password, role, etc.)
 * @returns {Promise}
 */
export const register = (userData) => {
  return apiClient.post("/auth/register", userData)
}

/**
 * Logs in a user
 * @param {object} credentials - { email, password }
 * @returns {Promise}
 */
export const login = (credentials) => {
  return apiClient.post("/auth/login", credentials)
}

/**
 * Logs out the current user
 * @returns {Promise}
 */
export const logout = () => {
  return apiClient.post("/auth/logout")
}

/**
 * Updates the user profile with a subset of data
 * @param {object} profileData - Profile data to update
 * @returns {Promise}
 */
export const updateProfile = (profileData) => {
  return apiClient.patch("/auth/profile", profileData)
}

/**
 * Deletes the authenticated user's account
 * @returns {Promise}
 */
export const deleteAccount = () => {
  return apiClient.delete("/auth/profile")
}

/**
 * Gets the profile of the currently authenticated user (using cookie)
 * @returns {Promise}
 */
export const getProfile = () => {
  return apiClient.get("/auth/profile")
}

/**
 * Change user password.
 * @param {Object} passwords - { currentPassword, newPassword }
 */
export const changePassword = (passwords) => {
  return apiClient.patch("/auth/password", passwords)
}