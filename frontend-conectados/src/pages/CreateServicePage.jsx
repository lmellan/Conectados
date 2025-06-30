"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Usamos el hook estandarizado
import axios from "axios"; // Usamos axios para consistencia

const CreateServicePage = () => {
  // Obtenemos el usuario y el token desde el hook
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    precio: "",
    zonaAtencion: "",
    foto: "", // Guardará la imagen en formato base64 para la vista previa
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Limpieza",
    "Electricidad",
    "Plomería",
    "Jardinería",
    "Peluquería",
    "Carpintería",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      // Opcional: manejar error si no es una imagen
      setErrors((prev) => ({
        ...prev,
        foto: "Por favor, selecciona un archivo de imagen.",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El título es obligatorio";
    if (!formData.categoria)
      newErrors.categoria = "Debes seleccionar una categoría";
    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es obligatoria";
    if (
      !formData.precio ||
      isNaN(formData.precio) ||
      Number(formData.precio) <= 0
    )
      newErrors.precio = "El precio debe ser un número positivo";
    if (!formData.zonaAtencion)
      newErrors.zonaAtencion = "Debes seleccionar una zona de atención";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Verificamos los datos antes de enviarlos al backend
      const dataToSend = {
        nombre: formData.nombre,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        zonaAtencion: formData.zonaAtencion,
        foto: formData.foto,
        prestador: { id: user.id },  // Se envía el ID del prestador
      };
      
      // Imprimir los datos enviados al backend
      console.log("Datos enviados al backend:", dataToSend);

      // Usamos axios para hacer la solicitud POST
      const response = await axios.post(
        "http://localhost:8080/api/servicios/crear",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Si todo sale bien, volvemos al panel
      navigate("/dashboard");

    } catch (err) {
      console.error("Error al crear servicio:");

      // Mejor manejo del error, imprime el mensaje de error detallado
      if (err.response && err.response.data) {
        console.error("Mensaje de error del backend:", err.response.data.message);
        setErrors({
          form: err.response.data.message || "Ocurrió un error al crear el servicio.",
        });
      } else {
        console.error("Error inesperado:", err.message);
        setErrors({
          form: "Ocurrió un error inesperado, por favor intente nuevamente.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // O un spinner
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

          <form role="form" onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.form && (
              <p className="text-sm text-red-600 mb-4">{errors.form}</p>
            )}

<div>
  <label
    htmlFor="nombre"
    className="text-sm font-medium text-gray-700"
  >
    Título del servicio *
  </label>
  <input
    id="nombre"
    name="nombre"
    type="text"
    required
    value={formData.nombre}
    onChange={handleChange}
    className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
      errors.nombre ? "border-red-500" : "border-gray-300"
    }`}
  />
  {errors.nombre && (
    <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
  )}
</div>


            <div>
              <label
                htmlFor="categoria"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría *
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={`input-field ${
                  errors.categoria ? "border-red-500" : ""
                }`}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <p className="text-sm text-red-600 mt-1">{errors.categoria}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="zonaAtencion"
                className="block text-sm font-medium text-gray-700"
              >
                Zona de atención *
              </label>
              <select
                id="zonaAtencion"
                name="zonaAtencion"
                value={formData.zonaAtencion}
                onChange={handleChange}
                className={`input-field ${
                  errors.zonaAtencion ? "border-red-500" : ""
                }`}
              >
                <option value="">Selecciona una región</option>
                <option value="Arica y Parinacota">Arica y Parinacota</option>
                <option value="Tarapacá">Tarapacá</option>
                <option value="Antofagasta">Antofagasta</option>
                <option value="Atacama">Atacama</option>
                <option value="Coquimbo">Coquimbo</option>
                <option value="Valparaíso">Valparaíso</option>
                <option value="Región Metropolitana">
                  Región Metropolitana
                </option>
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
              {errors.zonaAtencion && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.zonaAtencion}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className={`input-field ${
                  errors.descripcion ? "border-red-500" : ""
                }`}
              />
              {errors.descripcion && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.descripcion}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="precio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio por hora (CLP) *
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className={`input-field ${
                  errors.precio ? "border-red-500" : ""
                }`}
                min="0"
              />
              {errors.precio && (
                <p className="text-sm text-red-600 mt-1">{errors.precio}</p>
              )}
            </div>

            <div>
              
              <label 
                htmlFor="imageFile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Imagen del servicio
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              {formData.foto && (
                <div className="mt-3">
                  <img
                    src={formData.foto}
                    alt="Vista previa"
                    className="h-32 w-auto object-cover rounded-md"
                  />
                </div>
              )}
              {errors.foto && (
                <p className="text-sm text-red-600 mt-1">{errors.foto}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
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