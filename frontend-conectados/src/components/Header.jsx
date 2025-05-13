"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-green-600">
            Conectados
          </Link>

          {/* Menú para móviles */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Menú para desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="text-gray-600 hover:text-green-600">
              Servicios
            </Link>

            {user ? (
              <>
                <Link
                  to={
                    user.rol === "PRESTADOR" ? "/pro-dashboard" : "/user-dashboard"
                  }
                  className="text-gray-600 hover:text-green-600"
                >
                  Mi Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-green-600"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-green-600"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-green-600"
                >
                  Registrarse
                </Link>
                <Link to="/register-pro" className="btn-primary">
                  Ofrecer Servicios
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 py-2 space-y-2" data-testid="mobile-menu">
            <Link
              to="/search"
              className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </Link>

            {user ? (
              <>
                <Link
                  to={
                    user.rol === "PRESTADOR" ? "/pro-dashboard" : "/user-dashboard"
                  }
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi Panel
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
                <Link
                  to="/register-pro"
                  className="block px-3 py-2 text-green-600 font-medium hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ofrecer Servicios
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
