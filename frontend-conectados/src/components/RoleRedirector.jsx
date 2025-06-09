// src/components/RoleRedirector.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirector() {
  const { rolActivo } = useAuth();
  const navigate      = useNavigate();
  // Ref para detectar el primer render
  const isFirstRun   = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      // Primera ejecución: saltamos el redirect
      isFirstRun.current = false;
      return;
    }
    if (rolActivo) {
      // Solo tras un cambio efectivo de rol
      navigate(`/dashboard/${rolActivo.toLowerCase()}`, { replace: true });
    }
  }, [rolActivo, navigate]);

  return null;
}
