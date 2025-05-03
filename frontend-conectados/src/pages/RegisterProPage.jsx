"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { users } from "../data/mockData";

const RegisterProPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    categoria: [],
    descripcion: "",
    zonaAtencion: "",
    availability: [],
  });
  
  
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const daysOfWeek = [
    { id: 0, name: "Lunes" },
    { id: 1, name: "Martes" },
    { id: 2, name: "Miércoles" },
    { id: 3, name: "Jueves" },
    { id: 4, name: "Viernes" },
    { id: 5, name: "Sábado" },
    { id: 6, name: "Domingo" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAvailabilityChange = (dayId) => {
    const updatedAvailability = [...formData.availability];

    if (updatedAvailability.includes(dayId)) {
      // Remover el día si ya está seleccionado
      const index = updatedAvailability.indexOf(dayId);
      updatedAvailability.splice(index, 1);
    } else {
      // Agregar el día si no está seleccionado
      updatedAvailability.push(dayId);
    }

    setFormData({
      ...formData,
      availability: updatedAvailability,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
  
    if (formData.categoria.length === 0) {
      setError("Debes seleccionar al menos una categoría");
      return;
    }
  
    if (formData.availability.length === 0) {
      setError("Debes seleccionar al menos un día de disponibilidad");
      return;
    }
  
    const payload = {
      nombre: formData.name,
      correo: formData.email,
      contrasena: formData.password,
      rol: "PRESTADOR",
      zonaAtencion: formData.zonaAtencion,
      categoria: formData.categoria,
      descripcion: formData.descripcion,
      disponibilidad: formData.availability.map((id) => daysOfWeek[id].name),
    };
  
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Error al registrar el usuario");
      }
  
      navigate("/login"); 
    } catch (err) {
      setError(err.message);
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Regístrate como profesional
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre completo
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categorías de servicio
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {["Electricista", "Plomero", "Limpieza", "Peluquero", "Jardinero", "Carpintero"].map((categoria) => (
                  <label key={categoria} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="categoria"
                      value={categoria}
                      checked={formData.categoria.includes(categoria)}
                      onChange={(e) => {
                        const selected = formData.categoria.includes(categoria)
                          ? formData.categoria.filter((c) => c !== categoria)
                          : [...formData.categoria, categoria];
                        setFormData({ ...formData, categoria: selected });
                      }}
                      className="mr-2"
                    />
                    {categoria}
                  </label>
                ))}
              </div>
            </div>


            <div>
              <label
                htmlFor="zonaAtencion"
                className="block text-sm font-medium text-gray-700"
              >
                Zona de atención
              </label>
              <select
                id="zonaAtencion"
                name="zonaAtencion"
                required
                value={formData.zonaAtencion}
                onChange={handleChange}
                className="input-field"
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
            </div>



            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción de tus servicios
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Describe tu experiencia y los servicios que ofreces..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilidad
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center">
                    <input
                      id={`day-${day.id}`}
                      type="checkbox"
                      checked={formData.availability.includes(day.id)}
                      onChange={() => handleAvailabilityChange(day.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`day-${day.id}`}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {day.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900"
              >
                Acepto los{" "}
                <a
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  términos y condiciones
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Registrarme como profesional
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterProPage;
