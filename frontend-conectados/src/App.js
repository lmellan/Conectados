import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Importación de componentes y páginas
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// Asegúrate de que este import sea el correcto
import BecomeProPage from "./pages/BecomeProPage";
import SearchPage from "./pages/SearchPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import UserDashboard from "./pages/UserDashboard";
import ProDashboard from "./pages/ProDashboard";
import CreateServicePage from "./pages/CreateServicePage";
import EditServicePage from "./pages/EditServicePage";
import CreateReviewPage from "./pages/CreateReviewPage";

// Componente para proteger rutas que requieren autenticación.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente que decide qué Dashboard mostrar.
const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  if (user.rolActivo === "PRESTADOR") {
    return <ProDashboard />;
  }

  return <UserDashboard />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* --- Rutas Públicas --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/service/:id" element={<ServiceDetailPage />} />

              {/* --- Rutas Protegidas --- */}
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* --- NUEVA RUTA PROTEGIDA --- */}
              <Route
                path="/become-professional"
                element={
                  <ProtectedRoute>
                    <BecomeProPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/create-service"
                element={
                  <ProtectedRoute>
                    <CreateServicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-service/:id"
                element={
                  <ProtectedRoute>
                    <EditServicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review/create/:citaId"
                element={
                  <ProtectedRoute>
                    <CreateReviewPage />
                  </ProtectedRoute>
                }
              />

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
