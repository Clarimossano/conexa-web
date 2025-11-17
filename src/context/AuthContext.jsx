import { createContext, useContext, useState, useEffect } from "react"
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getProfile,
  updateProfile as updateProfileService,
  deleteAccount as deleteAccountService,
  changePassword as changePasswordService
} from "../services/auth.service"

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const { data } = await getProfile()
        setUser(data)
        setIsAuthenticated(true)
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    checkLogin()
  }, [])

  const signup = async (userData) => {
    try {
      const { data } = await registerService(userData)
      setUser(data)
      setIsAuthenticated(true)
      return data
    } catch (error) {
      console.error("Error in signup:", error.response?.data)
      setIsAuthenticated(false)
      setUser(null)
      throw error
    }
  }

  const signin = async (credentials) => {
    try {
      const { data } = await loginService(credentials)
      setUser(data)
      setIsAuthenticated(true)
      return data
    } catch (error) {
      console.error("Error in signin:", error.response?.data)
      setIsAuthenticated(false)
      setUser(null)
      throw error
    }
  }

  const signout = async () => {
    try {
      await logoutService()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Error in signout:", error.response?.data)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const { data } = await updateProfileService(profileData)
      setUser(data)
      return data
    } catch (error) {
      console.error("Error updating profile:", error.response?.data)
      throw error
    }
  }

  const changePassword = async (passwords) => {
    try {
      await changePasswordService(passwords)
      // La API 2.0 requiere re-login tras cambio de pass
      await signout() 
      return true
    } catch (error) {
      console.error("Error changing password:", error.response?.data)
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      await deleteAccountService()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Error deleting account:", error.response?.data)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        signup,
        signin,
        signout,
        updateProfile,
        changePassword,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}