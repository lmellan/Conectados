"use client"

import { createContext, useState, useEffect } from "react"

// Crear el contexto
export const AuthContext = createContext()

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Comprobar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Función para iniciar sesión
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  // Función para cerrar sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Función para registrar un nuevo usuario
  const register = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  // Valores que estarán disponibles en el contexto
  const value = {
    user,
    loading,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
