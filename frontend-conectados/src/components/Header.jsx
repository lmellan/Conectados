import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout, switchRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    switchRole(newRole);
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Conectados
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/search" className="text-gray-600 hover:text-indigo-600">
            Buscar Servicios
          </Link>

          {isAuthenticated && user ? (
            <>
              {user.roles && user.roles.length > 1 && (
                <div className="flex items-center">
                  <label htmlFor="role-select" className="text-gray-600 mr-2">
                    Vista:
                  </label>
                  <select
                    id="role-select"
                    value={user.rolActivo}
                    onChange={handleRoleChange}
                    className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2"
                  >
                    {user.roles.map((role) => (
                      <option key={role} value={role}>
                        {/* --- ESTA ES LA LÍNEA CORREGIDA --- */}
                        {/* Comprobamos contra "PRESTADOR", el nombre real del rol */}
                        {role === "PRESTADOR" ? "Profesional" : "Buscador"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-indigo-600"
              >
                Mi Panel
              </Link>

              <span className="text-gray-800 font-medium">
                Hola, {user.nombre}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
