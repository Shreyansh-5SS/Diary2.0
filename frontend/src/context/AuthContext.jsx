import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Set up axios interceptor for authentication
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Fetch current user on mount if token exists
      getCurrentUser()
    } else {
      delete axios.defaults.headers.common['Authorization']
      setLoading(false)
    }
  }, [token])

  /**
   * Get current user from API
   */
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/me`)
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to get current user:', error)
      // Token might be invalid, clear it
      logout()
    } finally {
      setLoading(false)
    }
  }

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      })

      const { token: newToken, user: userData } = response.data

      // Store token in localStorage
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      console.error('Login error:', errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Register new user
   */
  const register = async (email, password, name) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        name
      })

      const { token: newToken, user: userData } = response.data

      // Store token in localStorage
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      console.error('Register error:', errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
