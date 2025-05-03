"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateServicePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    precio: "",
    zonaAtencion: "",
    fotos: [""],
    imageFile: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "Limpieza", name: "Limpieza" },
    { id: "Electricidad", name: "Electricidad" },
    { id: "Plomería", name: "Plomería" },
    { id: "Jardinería", name: "Jardinería" },
    { id: "Peluquería", name: "Peluquería" },
    { id: "Carpintería", name: "Carpintería" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        fotos: [URL.createObjectURL(file)],
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El título es obligatorio";
    if (!formData.categoria) newErrors.categoria = "Debes seleccionar una categoría";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria";
    if (!formData.precio || isNaN(formData.precio) || Number(formData.precio) <= 0) newErrors.precio = "El precio debe ser un número positivo";
    if (!formData.zonaAtencion) newErrors.zonaAtencion = "Debes seleccionar una zona de atención";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/api/servicios/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          categoria: formData.categoria,
          descripcion: formData.descripcion,
          precio: parseFloat(formData.precio),
          zonaAtencion: formData.zonaAtencion,
          fotos: formData.fotos,
          prestador: { id: user.id },
        }),
      });

      if (!response.ok) throw new Error("Error al crear servicio");
      navigate("/pro-dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.rol !== "PRESTADOR") {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">Crear Nuevo Servicio</h1>
            <p className="text-gray-600">Completa el formulario para ofrecer un nuevo servicio a tus clientes</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Título del servicio *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`input-field ${errors.nombre ? "border-red-500" : ""}`}
              />
              {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={`input-field ${errors.categoria ? "border-red-500" : ""}`}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoria && <p className="text-sm text-red-600 mt-1">{errors.categoria}</p>}
            </div>

            <div>
              <label htmlFor="zonaAtencion" className="block text-sm font-medium text-gray-700">Zona de atención *</label>
              <select
                id="zonaAtencion"
                name="zonaAtencion"
                value={formData.zonaAtencion}
                onChange={handleChange}
                className={`input-field ${errors.zonaAtencion ? "border-red-500" : ""}`}
              >
                <option value="">Selecciona una región</option>
                <option value="Arica y Parinacota">Arica y Parinacota</option>
                <option value="Tarapacá">Tarapacá</option>
                <option value="Antofagasta">Antofagasta</option>
                <option value="Atacama">Atacama</option>
                <option value="Coquimbo">Coquimbo</option>
                <option value="Valparaíso">Valparaíso</option>
                <option value="Región Metropolitana">Región Metropolitana</option>
                <option value="O’Higgins">O’Higgins</option>
                <option value="Maule">Maule</option>
                <option value="Ñuble">Ñuble</option>
                <option value="Biobío">Biobío</option>
                <option value="La Araucanía">La Araucanía</option>
                <option value="Los Ríos">Los Ríos</option>
                <option value="Los Lagos">Los Lagos</option>
                <option value="Aysén">Aysén</option>
                <option value="Magallanes">Magallanes</option>
              </select>
              {errors.zonaAtencion && <p className="text-sm text-red-600 mt-1">{errors.zonaAtencion}</p>}
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className={`input-field ${errors.descripcion ? "border-red-500" : ""}`}
              />
              {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">Precio por hora (CLP) *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className={`input-field ${errors.precio ? "border-red-500" : ""}`}
                min="0"
              />
              {errors.precio && <p className="text-sm text-red-600 mt-1">{errors.precio}</p>}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Imagen del servicio</label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Seleccionar imagen
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {formData.imageFile ? formData.imageFile.name : "Ningún archivo seleccionado"}
                </span>
              </div>
              {formData.fotos[0] && (
                <div className="mt-3">
                  <img
                    src={formData.fotos[0] || "/placeholder.svg"}
                    alt="Vista previa"
                    className="h-32 w-auto object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => navigate("/pro-dashboard")} className="btn-secondary" disabled={isSubmitting}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creando..." : "Crear Servicio"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;
