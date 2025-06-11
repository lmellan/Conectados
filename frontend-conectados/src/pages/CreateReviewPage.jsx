// src/pages/CreateReviewPage.jsx
"use client";

import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateReviewPage = () => {
  const { user } = useContext(AuthContext);
  const { idCita } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    valoracion: 0, // Inicializar con 0 para evitar NaN
    comentario: "",
  });

  const [cita, setCita] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCita = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/citas/${idCita}`);
        if (!res.ok) throw new Error("Error al obtener cita");
        const data = await res.json();
        setCita(data);
      } catch (err) {
        console.error("Error al cargar cita:", err);
        // Opcional: setErrors({ global: "No se pudo cargar la cita." });
      }
    };
    if (idCita) fetchCita();
  }, [idCita]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Esta función ahora manejará la valoración por clic en las estrellas
  const handleRatingChange = (newValue) => {
    setFormData({ ...formData, valoracion: newValue });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.valoracion < 1 || formData.valoracion > 10) { // formData.valoracion ya es un número o 0
      newErrors.valoracion = "Debe ser un número entre 1 y 10";
    }
    if (!formData.comentario.trim()) {
      newErrors.comentario = "El comentario es obligatorio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!cita) {
      // Esto debería ser manejado por el estado de carga y la navegación inicial,
      // pero es una buena salvaguarda.
      setErrors({ global: "No se pudieron obtener los detalles de la cita." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        citaId: cita.id,
        servicioId: cita.idServicio,
        buscadorId: cita.idBuscador,
        prestadorId: cita.idPrestador,
        comentario: formData.comentario,
        valoracion: Number(formData.valoracion), // Ya es número, pero lo mantenemos para seguridad
        fecha: new Date().toISOString().split("T")[0],
      };

      console.log("Enviando reseña con datos planos:", payload);

      const response = await fetch("http://localhost:8080/api/resenas/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear reseña");
      }
      navigate("/user-dashboard");
    } catch (err) {
      console.error(err);
      setErrors({ global: err.message || "Ocurrió un error al enviar la reseña." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.rol !== "BUSCADOR") {
    // Redirigir inmediatamente, y no renderizar el resto del componente
    useEffect(() => {
      navigate("/login");
    }, [navigate]);
    return null; // No renderizar nada si no es el rol adecuado o no está logueado
  }


  if (!cita) {
    return <p className="text-center mt-10">Cargando datos de la cita...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">Dejar Reseña</h1>
            <p className="text-gray-600">Evalúa el servicio recibido y ayuda a otros usuarios</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.global && (
              <div className="mb-4 text-red-600 text-sm">{errors.global}</div>
            )}
            <div>
              <label htmlFor="valoracionInput" className="block text-sm font-medium text-gray-700 mb-2">
                Valoración *
              </label>
              {/* INPUT OCULTO para asociar la etiqueta y almacenar el valor */}
              <input
                id="valoracionInput"
                type="hidden" // o "text" si quieres que sea visible para depuración
                name="valoracion"
                value={formData.valoracion}
                readOnly // Para que no se edite manualmente, solo por clicks en estrellas
              />
              <div className="flex space-x-1 text-yellow-400 text-xl cursor-pointer">
                {[...Array(5)].map((_, i) => {
                  const whole = (i + 1) * 2;
                  const half = whole - 1;
                  const isSelectedFull = formData.valoracion >= whole;
                  const isSelectedHalf = formData.valoracion === half;

                  return (
                    <span key={i} className="relative inline-block"> {/* Añadir inline-block para que ocupe espacio */}
                      {/* Media estrella */}
                      <span
                        onClick={() => handleRatingChange(half)}
                        className={`absolute inset-0 w-1/2 overflow-hidden hover:scale-110 transition-transform ${
                          isSelectedHalf || formData.valoracion > half ? "text-yellow-400" : "text-gray-300"
                        }`}
                        aria-label={`${half} puntos`} // Etiqueta ARIA para accesibilidad
                        role="button" // Indica que es interactivo
                        tabIndex="0" // Para que sea enfocable
                        onKeyDown={(e) => { // Para accesibilidad con teclado
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleRatingChange(half);
                            }
                        }}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>

                      {/* Estrella completa */}
                      <span
                        onClick={() => handleRatingChange(whole)}
                        className={`hover:scale-110 transition-transform ${
                          isSelectedFull ? "text-yellow-400" : "text-gray-300"
                        }`}
                        aria-label={`${whole} puntos`} // Etiqueta ARIA para accesibilidad
                        role="button" // Indica que es interactivo
                        tabIndex="0" // Para que sea enfocable
                        onKeyDown={(e) => { // Para accesibilidad con teclado
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleRatingChange(whole);
                            }
                        }}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    </span>
                  );
                })}
              </div>
              {errors.valoracion && <p className="text-sm text-red-600 mt-1">{errors.valoracion}</p>}
              <p className="text-sm text-gray-500 mt-1" data-testid="valoracion-display">Puntaje: {formData.valoracion || "0"}/10</p>
            </div>

            <div>
              <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
                Comentario *
              </label>
              <textarea
                id="comentario"
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
                rows={4}
                className={`input-field ${errors.comentario ? "border-red-500" : ""}`}
              />
              {errors.comentario && <p className="text-sm text-red-600 mt-1">{errors.comentario}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => navigate("/user-dashboard")} className="btn-secondary" disabled={isSubmitting}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar Reseña"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReviewPage;