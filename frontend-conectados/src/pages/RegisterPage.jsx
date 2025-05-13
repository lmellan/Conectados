
"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { users } from "../data/mockData";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [canAcceptTerms, setCanAcceptTerms] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const existingUser = users.find((user) => user.email === formData.email);
    if (existingUser) {
      setError("Este correo electrónico ya está registrado");
      return;
    }

    if (!termsAccepted) {
      // Establece el error si los términos no han sido aceptados
      setError("Debes aceptar los términos y condiciones");
      return; // Detiene la ejecución de la función si no se aceptan los términos
  }

    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      isProfessional: false,
      image: "https://randomuser.me/api/portraits/lego/1.jpg",
    };

    register(newUser);
    navigate("/user-dashboard");
  };

  return (
    <>
      {showTermsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Términos y Condiciones</h3>
            <div
              className="border p-4 h-48 overflow-y-auto"
              onScroll={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.target;
                if (scrollTop + clientHeight >= scrollHeight - 10) {
                  setCanAcceptTerms(true);
                }
              }}
            >
              <p>Aquí van los términos y condiciones... (contenido largo simulado).</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin
                dui eget sem gravida, ut facilisis massa finibus. Nulla facilisi.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
                cubilia curae...
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                disabled={!canAcceptTerms}
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className={`px-4 py-2 rounded text-white ${
                  canAcceptTerms
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
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

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setShowTermsModal(true)}
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  Acepto los{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-medium text-green-600 hover:text-green-500 underline"
                  >
                    términos y condiciones
                  </button>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Registrarme
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
