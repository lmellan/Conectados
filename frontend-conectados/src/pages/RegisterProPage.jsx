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
    profession: "",
    description: "",
    hourlyRate: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.availability.length === 0) {
      setError("Debes seleccionar al menos un día de disponibilidad");
      return;
    }

    // Verificar si el email ya está registrado
    const existingUser = users.find((user) => user.email === formData.email);
    if (existingUser) {
      setError("Este correo electrónico ya está registrado");
      return;
    }

    // Simulación de registro
    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      isProfessional: true,
      image: "https://randomuser.me/api/portraits/lego/2.jpg", // Imagen por defecto
      profession: formData.profession,
      description: formData.description,
      hourlyRate: Number.parseFloat(formData.hourlyRate),
      availability: formData.availability,
    };

    // Registrar usuario profesional
    register(newUser);
    navigate("/pro-dashboard");
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
              <label
                htmlFor="profession"
                className="block text-sm font-medium text-gray-700"
              >
                Profesión
              </label>
              <div className="mt-1">
                <select
                  id="profession"
                  name="profession"
                  required
                  value={formData.profession}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Selecciona una profesión</option>
                  <option value="Electricista">Electricista</option>
                  <option value="Plomero">Plomero</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Peluquero">Peluquero</option>
                  <option value="Jardinero">Jardinero</option>
                  <option value="Carpintero">Carpintero</option>
                </select>
              </div>
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
              <label
                htmlFor="hourlyRate"
                className="block text-sm font-medium text-gray-700"
              >
                Tarifa por hora (CLP)
              </label>
              <div className="mt-1">
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  className="input-field"
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
