import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ role, children }) {
  const { rolActivo } = useAuth();

  // Si el rol activo no coincide, redirige a su dashboard
  if (rolActivo !== role) {
    const destino = rolActivo
      ? `/dashboard/${rolActivo.toLowerCase()}`
      : "/login";
    return <Navigate to={destino} replace />;
  }

  return children;
}
