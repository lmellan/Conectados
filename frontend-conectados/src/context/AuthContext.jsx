// // src/context/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

//   // Estado inicial: token y user vienen de localStorage (si existen)
//   const [token, setToken] = useState(() => localStorage.getItem("token"));
//   const [user, setUser]   = useState(() => {
//     const u = localStorage.getItem("user");
//     return u ? JSON.parse(u) : null;
//   });
//   // Inicializamos rolActivo bien del user guardado
//   const [rolActivo, setRolActivo] = useState(() => {
//     const u = localStorage.getItem("user");
//     if (u) {
//       try {
//         return JSON.parse(u).rolActivo || null;
//       } catch {
//         return null;
//       }
//     }
//     return null;
//   });

//   // Cualquier cambio de token -> configura axios
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common["Authorization"];
//     }
//   }, [token]);

//   // --- LOGIN ---
//   const login = (userData, userToken) => {
//     // userData debe incluir userData.rolActivo
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", userToken);

//     setUser(userData);
//     setToken(userToken);
//     setRolActivo(userData.rolActivo);

//     axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
//     navigate(`/dashboard/${userData.rolActivo.toLowerCase()}`, { replace: true });
//   };

//   // --- LOGOUT ---
//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setUser(null);
//     setToken(null);
//     setRolActivo(null);
//     delete axios.defaults.headers.common["Authorization"];
//     navigate("/login", { replace: true });
//   };

//   // --- SWITCH ROLE ---
//   const switchRole = async (newRole) => {
//     console.log("--- Iniciando cambio de rol ---", newRole);

//     if (!user?.correo || !token) {
//       console.error("Datos insuficientes para cambiar rol", { user, token });
//       alert("No se pudo cambiar de rol. Sesión inválida.");
//       return;
//     }

//     const url     = `${API_URL}/usuarios/${encodeURIComponent(
//       user.correo
//     )}/cambiar-rol`;
//     const payload = { nuevoRol: newRole };

//     try {
//       const { data: updatedUser } = await axios.put(url, payload);
//       console.log("Cambio de rol OK:", updatedUser);

//       // Actualiza usuario, token y rolActivo en estado y localStorage
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setUser(updatedUser);
//       setRolActivo(newRole);

//       // La navegación la hará RoleRedirector automáticamente
//     } catch (err) {
//       console.error("Error al cambiar rol:", err.response || err);
//       const msg =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Error inesperado";
//       alert("No se pudo cambiar el rol: " + msg);
//     }
//   };

//   const value = {
//     user,
//     token,
//     rolActivo,
//     login,
//     logout,
//     switchRole,
//     setRolActivo,     // por si lo necesitas directamente
//     isAuthenticated: !!token,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const API_URL  = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

  const [token, setToken]     = useState(localStorage.getItem("token"));
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [rolActivo, setRolActivo] = useState(user?.rolActivo || "BUSCADOR");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    setUser(userData);
    setToken(userToken);
    setRolActivo(userData.rolActivo || "BUSCADOR");

    navigate(`/dashboard/${(userData.rolActivo||"BUSCADOR").toLowerCase()}`, { replace: true });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setRolActivo("BUSCADOR");
    navigate("/login", { replace: true });
  };

  const switchRole = async (newRole) => {
    if (!user?.correo || !token) {
      alert("Sesión inválida. Por favor vuelve a iniciar sesión.");
      return;
    }

    try {
      const { data: updatedUser } = await axios.put(
        `${API_URL}/usuarios/${encodeURIComponent(user.correo)}/cambiar-rol`,
        { nuevoRol: newRole }
      );

      // Actualiza estado y storage
      updatedUser.rolActivo = newRole;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setRolActivo(newRole);

      // ¡Redirige aquí mismo!
      navigate(`/dashboard/${newRole.toLowerCase()}`, { replace: true });
    } catch (err) {
      console.error("Error al cambiar rol:", err.response || err);
      alert("No se pudo cambiar el rol.");
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      rolActivo,
      login,
      logout,
      switchRole,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
