"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { services } from "../data/mockData";

const CreateServicePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    image: null,
    imagePreview: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "limpieza", name: "Limpieza" },
    { id: "electricidad", name: "Electricidad" },
    { id: "plomeria", name: "Plomería" },
    { id: "jardineria", name: "Jardinería" },
    { id: "peluqueria", name: "Peluquería" },
    { id: "carpinteria", name: "Carpintería" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
    if (!formData.category)
      newErrors.category = "Debes seleccionar una categoría";
    if (!formData.description.trim())
      newErrors.description = "La descripción es obligatoria";
    if (!formData.price) newErrors.price = "El precio es obligatorio";
    else if (isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "El precio debe ser un número positivo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulación de creación de servicio
    setTimeout(() => {
      // Crear un nuevo ID para el servicio
      const newId =
        services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;

      // Crear el nuevo servicio
      const newService = {
        id: newId,
        title: formData.title,
        category:
          categories.find((c) => c.id === formData.category)?.name ||
          formData.category,
        description: formData.description,
        price: Number(formData.price),
        providerId: user.id,
        providerName: user.name,
        providerImage: user.image,
        image:
          formData.imagePreview ||
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 0,
        reviews: 0,
      };

      // Añadir el servicio a la lista de servicios (en un caso real, esto sería una llamada a la API)
      services.push(newService);

      setIsSubmitting(false);
      navigate("/pro-dashboard");
    }, 1000);
  };

  // Redirigir si no hay usuario autenticado o no es un profesional
  if (!user || !user.isProfessional) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">Crear Nuevo Servicio</h1>
            <p className="text-gray-600">
              Completa el formulario para ofrecer un nuevo servicio a tus
              clientes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título del servicio *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${
                  errors.title ? "border-red-500" : ""
                }`}
                placeholder="Ej: Instalación eléctrica completa"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input-field ${
                  errors.category ? "border-red-500" : ""
                }`}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`input-field ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Describe detalladamente el servicio que ofreces..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio por hora (CLP) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1"
                step="0.01"
                className={`input-field ${
                  errors.price ? "border-red-500" : ""
                }`}
                placeholder="25.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Imagen del servicio
              </label>
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
                  {formData.image
                    ? formData.image.name
                    : "Ningún archivo seleccionado"}
                </span>
              </div>
              {formData.imagePreview && (
                <div className="mt-3">
                  <img
                    src={formData.imagePreview || "/placeholder.svg"}
                    alt="Vista previa"
                    className="h-32 w-auto object-cover rounded-md"
                  />
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Recomendado: Imagen de alta calidad que represente tu servicio
                (JPG, PNG)
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/pro-dashboard")}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando..." : "Crear Servicio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;
