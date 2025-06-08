import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error(
          "Error al parsear datos de usuario desde localStorage",
          error
        );
        logout();
      }
    }
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    setUser(userData);
    setToken(userToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  // --- FUNCIÓN switchRole CORREGIDA ---
  const switchRole = async (newRole) => {
    // --- INICIO DE DEPURACIÓN ---
    console.log("--- Iniciando cambio de rol ---");
    console.log("Rol seleccionado:", newRole);

    if (!user || !token || !user.correo) {
      console.error(
        "ERROR: No se puede cambiar el rol. Datos de usuario incompletos.",
        { user, token }
      );
      alert("Error: Faltan datos de usuario para cambiar el rol.");
      return;
    }

    // Construimos la URL y el cuerpo de la petición para revisarlos.
    const url = `${API_URL}/usuarios/${user.correo}/cambiar-rol`;
    const payload = { nuevoRol: newRole };

    console.log("Enviando petición PUT a:", url);
    console.log("Con el siguiente cuerpo (payload):", payload);
    // --- FIN DE DEPURACIÓN ---

    try {
      const response = await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Respuesta exitosa del servidor:", response.data);

      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.location.reload();
    } catch (error) {
      // Esto nos dará toda la información del error si la petición falla.
      console.error("¡La petición falló! Detalles del error:", error.response);
      const errorMessage =
        error.response?.data?.message || error.response?.data || error.message;
      alert("No se pudo cambiar el rol: " + errorMessage);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    switchRole,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
