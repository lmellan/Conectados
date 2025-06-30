"use client";

import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateReviewPage = () => {
  const { user } = useContext(AuthContext);
  const { idCita } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    valoracion: "",
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
      }
    };
    if (idCita) fetchCita();
  }, [idCita]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.valoracion || isNaN(formData.valoracion) || formData.valoracion < 1 || formData.valoracion > 10) {
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
    if (!cita) return;

    setIsSubmitting(true);
    try {
      const payload = {
        citaId: cita.id,
        servicioId: cita.idServicio,
        buscadorId: cita.idBuscador,
        prestadorId: cita.idPrestador,
        comentario: formData.comentario,
        valoracion: Number(formData.valoracion),
        fecha: new Date().toISOString().split("T")[0],
      };
      

      console.log("Enviando reseña con datos planos:", payload);

      const response = await fetch("http://localhost:8080/api/resenas/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al crear reseña");
      navigate("/user-dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!user || user.rol !== "BUSCADOR") {
    navigate("/login");
    return null;
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valoración *</label>
            <div className="flex space-x-1 text-yellow-400 text-xl cursor-pointer">
                {[...Array(5)].map((_, i) => {
                const whole = (i + 1) * 2;
                const half = whole - 1;
                const isSelected = formData.valoracion >= whole;
                const isHalf = formData.valoracion === half;

                return (
                    <span key={i} className="relative">
                    {/* Media estrella */}
                    <span
                        role="button"
                        onClick={() => setFormData({ ...formData, valoracion: half })}
                        className={`absolute inset-0 w-1/2 overflow-hidden hover:scale-110 transition-transform ${
                        isHalf || formData.valoracion > half ? "text-yellow-400" : "text-gray-300"
                        }`}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 
                            3.292a1 1 0 00.95.69h3.462c.969 0 1.371 
                            1.24.588 1.81l-2.8 2.034a1 1 0 
                            00-.364 1.118l1.07 3.292c.3.921-.755 
                            1.688-1.54 1.118l-2.8-2.034a1 1 0 
                            00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 
                            0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 
                            00.951-.69l1.07-3.292z" />
                        </svg>
                    </span>

                    {/* Estrella completa */}
                    <span
                        role="button"
                        onClick={() => setFormData({ ...formData, valoracion: whole })}
                        className={`hover:scale-110 transition-transform ${
                        isSelected ? "text-yellow-400" : "text-gray-300"
                        }`}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 
                            3.292a1 1 0 00.95.69h3.462c.969 0 1.371 
                            1.24.588 1.81l-2.8 2.034a1 1 0 
                            00-.364 1.118l1.07 3.292c.3.921-.755 
                            1.688-1.54 1.118l-2.8-2.034a1 1 0 
                            00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 
                            0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 
                            00.951-.69l1.07-3.292z" />
                        </svg>
                    </span>
                    </span>
                );
                })}
            </div>
            {errors.valoracion && <p className="text-sm text-red-600 mt-1">{errors.valoracion}</p>}
            <p className="text-sm text-gray-500 mt-1">Puntaje: {formData.valoracion || "0"}/10</p>
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
