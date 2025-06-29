"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmPassword: "",
    numero: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.contrasena !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const phoneRegex = /^569\d{8}$/;
    if (!phoneRegex.test(formData.numero)) {
      setError("El número de celular debe ser en el formato 569XXXXXXXX");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          numero: formData.numero,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          setError(errorJson.message || "Error al registrar.");
        } catch {
          setError(errorText || "Error al registrar.");
        }
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con el servidor. ¿Está encendido?");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Crear una cuenta
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
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <div className="mt-1">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                Número de celular (Formato: 569XXXXXXXX)
              </label>
              <div className="mt-1">
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  required
                  value={formData.numero}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="56912345678"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  value={formData.contrasena}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Registrarme
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
