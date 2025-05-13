import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterProPage from "./pages/RegisterProPage";
import SearchPage from "./pages/SearchPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import UserDashboard from "./pages/UserDashboard";
import ProDashboard from "./pages/ProDashboard";
import ProProfilePage from "./pages/ProProfilePage";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import CreateServicePage from "./pages/CreateServicePage";
import EditServicePage from "./pages/EditServicePage";
import CreateReviewPage from "./pages/CreateReviewPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register-pro" element={<RegisterProPage />} />
              <Route path="/crear-resena/:idCita" element={<CreateReviewPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/service/:id" element={<ServiceDetailPage />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/pro-dashboard" element={<ProDashboard />} />
              <Route path="/create-service" element={<CreateServicePage />} />
              <Route path="/edit-service/:id" element={<EditServicePage />} />
              <Route path="/pro-profile/:id" element={<ProProfilePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
